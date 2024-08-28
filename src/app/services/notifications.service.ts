/*
	Notifications Service
	Send a Hug Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Angular imports
import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { interval, Subscription, Observable } from "rxjs";

// App-related imports
import { AlertsService } from "./alerts.service";
import { SWManager } from "./sWManager.service";
import { ApiClientService } from "./apiClient.service";

interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
  newCount: number;
}

export type ToggleButtonOption = "Enable" | "Disable";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  readonly publicKey = import.meta.env["VITE_PUBLIC_KEY"];
  // notifications data
  notifications: any[] = [];
  // push notifications variables
  notificationsSub: PushSubscription | undefined;
  subId = 0;
  newNotifications = 0;
  resubscribeCalls = 0;
  subscriptionDate = 0;
  // notifications refresh variables
  refreshCounter: Observable<number> | undefined;
  refreshSub: Subscription | undefined;

  // CTOR
  constructor(
    private alertsService: AlertsService,
    private swPush: SwPush,
    private serviceWorkerM: SWManager,
    private apiClient: ApiClientService,
  ) {
    navigator.serviceWorker.addEventListener("message", this.renewPushSubscription);
  }

  // NOTIFICATIONS METHODS
  // ==============================================================
  /**
   * Runs the interval and sends a fetch request every x seconds (however much is set).
   * @param refreshRate - how often to fetch the notifications (in seconds).
   */
  startAutoRefresh(refreshRate: number): void {
    // if there's already a running counter, leave it as is
    if (this.refreshCounter) return;

    // otherwise if the refresh counter is undefined, start an interval
    this.refreshCounter = interval(refreshRate * 1000);
    // every ten seconds, when the counter is done, silently refres
    // the user's notifications
    this.refreshSub = this.refreshCounter.subscribe((_value) => {
      this.getNotifications();
    });
  }

  /**
   * Stops auto-refresh by unsubscribing from the interval.
   */
  stopAutoRefresh() {
    this.refreshSub?.unsubscribe();
    this.refreshCounter = undefined;
  }

  /**
   * Gets all new user notifications.
   * @param page - the current page to fetch.
   */
  getNotifications(page: number = 1) {
    // gets Notifications
    this.apiClient.get<GetNotificationsResponse>("notifications", { page }).subscribe({
      next: (response) => {
        this.notifications = response.notifications;
        this.newNotifications = response.newCount;
      },
    });
  }

  // PUSH SUBSCRIPTION METHODS
  // ==============================================================
  /**
   * Get the current Push Permission state.
   * @returns a promise that resolves to a PermissionState or undefined.
   */
  getPushPermissionState(): Promise<PermissionState | undefined> {
    if (!("PushManager" in window)) {
      this.alertsService.createAlert({
        type: "Error",
        message: "Push notifications aren't supported in this browser.",
      });
      return new Promise((resolve) => resolve(undefined));
    }

    if (!this.serviceWorkerM.activeServiceWorkerReg) {
      // TODO: Should we alert the user?
      return new Promise((resolve) => resolve(undefined));
    }

    return this.serviceWorkerM.activeServiceWorkerReg.pushManager.permissionState({
      applicationServerKey: this.publicKey as string,
      userVisibleOnly: true,
    });
  }

  /**
   * Checks the current push permission state.
   * @param pushEanbled - whether the user has push notifications enabled.
   * @returns a promise that resolves to the permission state.
   */
  checkInitialPermissionState(pushEanbled: boolean): Promise<PermissionState | undefined> {
    // If the user hasn't enabled push notifications, none
    // of this matters anyway, so don't bother checking for permission
    if (!pushEanbled) return new Promise((resolve) => resolve(undefined));

    // check the state of the Push permission
    return this.getPushPermissionState().then((permission) => {
      // If permission was denied and the user's Push status is true, alert the
      // user they can't get push notifications in this browser
      if (permission == "denied") {
        this.alertsService.createAlert({
          type: "Error",
          message:
            "Push notifications permission has been denied. Go to your browser settings, remove Send A Hug from the denied list, and then activate push notifications again.",
        });
      }
      // If the client wasn't even asked on this browser and the user's push status
      // is true, trigger subscription
      else if (permission == "prompt") {
        this.subscribeToStream();
      }

      return permission;
    });
  }

  /**
   * Request a new push subscription from the current browser
   * and update the push subscription (locally) and the user's settings.
   * @returns A promise that resolves into a push subscription or undefined,
   */
  requestSubscription() {
    // request subscription
    return this.swPush
      .requestSubscription({
        serverPublicKey: this.publicKey as string,
        // if it went successfully, send the subscription data to the server
      })
      .then((subscription) => {
        this.notificationsSub = subscription;
        this.subscriptionDate = Date.now();
        this.setSubscription();

        return subscription;
        // if there was an error, alert the user
      })
      .catch((err) => {
        this.alertsService.createAlert({ type: "Error", message: err });
      });
  }

  /**
   * Subscribes the user to push notifications.
   * @returns a promise that resolves to undefined.
   */
  subscribeToStream() {
    return this.requestSubscription()
      .then((subscription) => {
        // send the info to the server
        this.apiClient.post("notifications", JSON.stringify(subscription)).subscribe({
          next: (response: any) => {
            this.subId = response.subId;
            this.alertsService.createSuccessAlert("Subscribed to push notifications successfully!");
          },
        });
      })
      .catch((err) => {
        this.alertsService.createAlert({ type: "Error", message: err });
      });
  }

  /*
  Function Name: renewPushSubscription()
  Function Description: Silently renews the expired push subscription.
  Parameters: event (MessageEvent) - the ServiceWorker message event triggering the method.
  ----------------
  Programmer: Shir Bar Lev.
  */
  renewPushSubscription(event: MessageEvent) {
    // if it's been more than 24 hours since the last update, the push subscription
    // expired, so reset the resubscribe calls
    if (this.subscriptionDate + 864e5 <= Date.now()) {
      this.resubscribeCalls = 0;
    }

    if (event.data.action == "resubscribe" && this.resubscribeCalls < 2) {
      this.resubscribeCalls++;

      // request a new push subscription
      this.requestSubscription().then((subscription) => {
        // update the saved subscription in the database
        this.apiClient
          .patch(`subscriptions/${this.subId}`, JSON.stringify(subscription))
          .subscribe({
            next: (response: any) => {
              this.subId = response.subId;
            },
          });
      });
    }
  }

  /**
   * Unsubscribes the user from push notifications.
   * @returns a promise that resolves to a boolean value when the current subscription
   *   is successfully unsubscribed.
   */
  unsubscribeFromStream(): Promise<boolean> {
    if (!this.notificationsSub) return new Promise((resolve) => resolve(true));

    return this.notificationsSub.unsubscribe();
  }

  /**
   * Gets the currently active PushSubscription (if applicable) from localStorage.
   */
  getCachedSubscription() {
    const pushSub = JSON.parse(localStorage.getItem("PUSH_SUBSCRIPTION")!);

    // if there's a push subscription, compare it to the one currently active. If
    // it's the same, leave as is; otherwise set the new subscription as the latest subscription
    // in localStorage
    if (pushSub && this.notificationsSub) {
      if (pushSub["endpoint"] != this.notificationsSub["endpoint"]) {
        this.setSubscription();
      }
    }
  }

  /**
   * Sets the currently active PushSubscription (if applicable) in localStorage.
   */
  protected setSubscription() {
    // if the user is subscribed to push notifications, keep the data in localStorage
    if (this.notificationsSub) {
      localStorage.setItem("PUSH_SUBSCRIPTION", JSON.stringify(this.notificationsSub));
    }
  }
}
