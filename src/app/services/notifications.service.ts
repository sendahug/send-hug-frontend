/*
	Notifications Service
	Send a Hug Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { SWManager } from "./sWManager.service";
import { environment } from "@env/environment";
import { ApiClientService } from "./apiClient.service";

interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  readonly publicKey = environment.vapidKey;
  // notifications data
  notifications: any[] = [];
  // push notifications variables
  toggleBtn!: "Enable" | "Disable";
  notificationsSub: PushSubscription | undefined;
  subId = 0;
  newNotifications = 0;
  pushStatus!: Boolean;
  resubscribeCalls = 0;
  pushDate = 0;
  // notifications refresh variables
  refreshBtn!: "Enable" | "Disable";
  refreshStatus!: Boolean;
  refreshRateSecs = 20;
  refreshCounter: Observable<number> | undefined;
  refreshSub: Subscription | undefined;

  // CTOR
  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private swPush: SwPush,
    private serviceWorkerM: SWManager,
    private apiClient: ApiClientService,
  ) {
    // if the user is logged in, and their data is fetched, set the appropriate variables
    this.authService.isUserDataResolved.subscribe((value) => {
      if (value) {
        this.pushStatus = this.authService.userData.pushEnabled;
        this.refreshStatus = this.authService.userData.autoRefresh;
        this.refreshRateSecs = this.authService.userData.refreshRate;
      } else {
        this.pushStatus = false;
        this.refreshStatus = false;
      }

      this.toggleBtn = this.pushStatus ? "Disable" : "Enable";
      this.refreshBtn = this.refreshStatus ? "Disable" : "Enable";

      // if there's an active service worker and push notifications are supported
      if ("PushManager" in window && this.serviceWorkerM.activeServiceWorkerReg) {
        // check the state of the Push permission
        this.serviceWorkerM.activeServiceWorkerReg.pushManager
          .permissionState({
            applicationServerKey: this.publicKey as string,
            userVisibleOnly: true,
          })
          .then((permission) => {
            // If permission was denied and the user's Push status is true, alert the
            // user they can't get push notifications in this browser
            if (permission == "denied") {
              if (this.pushStatus) {
                this.pushStatus = false;
                this.toggleBtn = "Enable";
                this.alertsService.createAlert({
                  type: "Error",
                  message:
                    "Push notifications permission has been denied. Go to your browser settings, remove Send A Hug from the denied list, and then activate push notifications again.",
                });
              }
            }
            // If the client wasn't even asked on this browser and the user's push status
            // is true, trigger subscription
            else if (permission == "prompt") {
              if (this.pushStatus) {
                this.subscribeToStream();
              }
            }
          });
      }
      // otherwise, turn everything false
      else {
        this.pushStatus = false;
        this.toggleBtn = "Enable";
      }
    });

    navigator.serviceWorker.addEventListener("message", this.renewPushSubscription);
  }

  // NOTIFICATIONS METHODS
  // ==============================================================
  /*
  Function Name: startAutoRefresh()
  Function Description: Checks whethter the user is authenticated and if so, starts
                        the auto-refresh process.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  startAutoRefresh() {
    let userSub: Subscription;
    // wait until the user is authenticated
    userSub = this.authService.isUserDataResolved.subscribe((value) => {
      // once they are, start the refresh counter
      if (value && this.refreshStatus) {
        this.refreshBtn = "Disable";
        this.autoRefresh();

        // unsubscribe from the user data observable as it's no longer needed
        if (userSub) {
          userSub.unsubscribe();
        }
      }
    });
  }

  /*
  Function Name: autoRefresh()
  Function Description: Runs the interval and sends a fetch request every 20
                        seconds (or however much is set).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  autoRefresh() {
    // if the refresh counter is undefined, start an interval
    if (!this.refreshCounter) {
      this.refreshCounter = interval(this.refreshRateSecs * 1000);
      // every ten seconds, when the counter is done, silently refres
      // the user's notifications
      this.refreshSub = this.refreshCounter.subscribe((_value) => {
        this.getNotifications(true);
      });
    }
    // otherwise there's already a running counter, so leave it as is
    else {
      return;
    }
  }

  /*
  Function Name: stopAutoRefresh()
  Function Description: Stops auto-refresh by unsubscribing from the interval.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  stopAutoRefresh() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
      this.refreshCounter = undefined;
      this.refreshBtn = "Enable";
    }
  }

  /*
  Function Name: getNotifications()
  Function Description: Gets all new user notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getNotifications(silentRefresh?: boolean) {
    const silent = silentRefresh ? silentRefresh : false;

    // gets Notifications
    this.apiClient
      .get<GetNotificationsResponse>("notifications", { silentRefresh: silent })
      .subscribe({
        next: (response) => {
          this.notifications = response.notifications;

          // if it's a silent refresh, check how many new notifications the user has
          if (silentRefresh) {
            this.newNotifications = this.notifications.length;
          }
        },
      });
  }

  /*
  Function Name: subscribeToStream()
  Function Description: Subscribes the user to push notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  subscribeToStream() {
    if ("PushManager" in window) {
      // check the state of the Push permission
      this.serviceWorkerM.activeServiceWorkerReg?.pushManager
        .permissionState({
          applicationServerKey: this.publicKey as string,
          userVisibleOnly: true,
        })
        .then((permission) => {
          // If permission was denied, alert the user they can't get push notifications in this browser
          if (permission == "denied") {
            this.alertsService.createAlert({
              type: "Error",
              message:
                "Push notifications permission has been denied. Go to your browser settings, remove Send A Hug from the denied list, and then activate push notifications again.",
            });
          }
          // otherwise, request a subscription
          else {
            // request subscription
            this.swPush
              .requestSubscription({
                serverPublicKey: this.publicKey as string,
                // if it went successfully, send the subscription data to the server
              })
              .then((subscription) => {
                this.notificationsSub = subscription;
                this.toggleBtn = "Disable";
                this.pushDate = Date.now();
                this.setSubscription();

                // send the info to the server
                this.apiClient.post("notifications", JSON.stringify(subscription)).subscribe({
                  next: (response: any) => {
                    this.subId = response.subId;
                    this.alertsService.createSuccessAlert(
                      "Subscribed to push notifications successfully!",
                    );
                  },
                });
                // if there was an error, alert the user
              })
              .catch((err) => {
                this.alertsService.createAlert({ type: "Error", message: err });
              });
          }
        });
    } else {
      this.alertsService.createAlert({
        type: "Error",
        message: "Push notifications are not currently supported in this browser.",
      });
    }
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
    if (this.pushDate + 864e5 <= Date.now()) {
      this.resubscribeCalls = 0;
    }

    //
    if (event.data.action == "resubscribe" && this.resubscribeCalls < 2) {
      this.resubscribeCalls++;

      // request a new push subscription
      this.swPush
        .requestSubscription({
          serverPublicKey: this.publicKey as string,
        })
        .then((subscription) => {
          this.notificationsSub = subscription;
          this.toggleBtn = "Disable";
          this.pushDate = Date.now();
          this.setSubscription();

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

  /*
  Function Name: unsubscribeFromStream()
  Function Description: Unsubscribes the user from push notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  unsubscribeFromStream() {
    this.toggleBtn = "Enable";
    this.pushStatus = false;

    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }
  }

  /*
  Function Name: setSubscription()
  Function Description: Sets the currently active PushSubscription (if applicable) in localStorage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setSubscription() {
    // if the user is subscribed to push notifications, keep the data in localStorage
    if (this.notificationsSub) {
      localStorage.setItem("PUSH_SUBSCRIPTION", JSON.stringify(this.notificationsSub));
    }
  }

  /*
  Function Name: getSubscription()
  Function Description: Gets the currently active PushSubscription (if applicable) from localStorage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getSubscription() {
    let pushSub;
    // if push notifications are enabled, there's a subscription in localStorage, so get it
    if (this.pushStatus) {
      pushSub = JSON.parse(localStorage.getItem("PUSH_SUBSCRIPTION")!);
    }

    // if there's a push subscription, compare it to the one currently active. If
    // it's the same, leave as is; otherwise set the new subscription as the latest subscription
    // in localStorage
    if (pushSub && this.notificationsSub) {
      if (pushSub["endpoint"] != this.notificationsSub["endpoint"]) {
        this.setSubscription();
      }
    }
  }

  /*
  Function Name: updateUserSettings()
  Function Description: Updates the user's auto-refresh and push settings in the database.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateUserSettings() {
    const newSettings = {
      autoRefresh: this.refreshStatus,
      pushEnabled: this.pushStatus,
      refreshRate: this.refreshRateSecs,
    };

    // send the data to the server
    this.apiClient.patch(`users/all/${this.authService.userData.id}`, newSettings).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert("Settings updated successfully!");
      },
    });
  }
}
