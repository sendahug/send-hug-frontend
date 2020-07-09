/*
	NOTIFICATIONS Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { interval, Subscription, Observable } from 'rxjs';

// App-related imports
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { SWManager } from './sWManager.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  readonly publicKey = environment.production ? prodEnv.vapidKey : environment.vapidKey;
  // notifications data
  notifications = [];
  notificationsSub: PushSubscription | undefined;
  newNotifications = 0;
  pushStatus = false;
  refreshStatus = true;
  refreshRateSecs = 20;
  refreshCounter: Observable<number> | undefined;
  refreshSub: Subscription | undefined;

  // CTOR
  constructor(
    private Http:HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService,
    private swPush:SwPush
  ) {

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
    // wait until the user is authenticated
    let userSub = this.authService.isUserDataResolved.subscribe((value) => {
      // once they are, start the refresh counter
      if(value && this.refreshStatus) {
        this.autoRefresh();
        this.setSubscription();

        // unsubscribe from the user data observable as it's no longer needed
        if(userSub) {
          userSub.unsubscribe();
        }
      }
    })
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
    if(!this.refreshCounter) {
      this.refreshCounter = interval(this.refreshRateSecs * 1000);
      // every ten seconds, when the counter is done, silently refres
      // the user's notifications
      this.refreshSub = this.refreshCounter.subscribe((_value) => {
        this.getNotifications(true);
      })
    }
    // otherwise there's already a running counter, so leave it as is
    else {
      return
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
    if(this.refreshSub) {
      this.refreshSub.unsubscribe();
      this.refreshCounter = undefined;
      this.setSubscription();
    }
  }

  /*
  Function Name: getNotifications()
  Function Description: Gets all new user notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getNotifications(silentRefresh?:boolean) {
    const Url = this.serverUrl + '/notifications';
    const silent = silentRefresh ? silentRefresh : false;
    const params = new HttpParams().set('silentRefresh', `${silent}`);

    // gets Notifications
    this.Http.get(Url, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      this.notifications = response.notifications;

      // if it's a silent refresh, check how many new notifications the user has
      if(silentRefresh) {
        this.newNotifications = (this.notifications.length);
      }
    }, (err:HttpErrorResponse) => {
      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
    })
  }

  /*
  Function Name: subscribeToStream()
  Function Description: Subscribes the user to push notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  subscribeToStream() {
    const Url = this.serverUrl + '/notifications';
    const headers = this.authService.authHeader.set('content-type', 'application/json');

    if('PushManager' in window) {
      // request subscription
      this.swPush.requestSubscription({
        serverPublicKey: this.publicKey
      // if it went successfully, send the subscription data to the server
      }).then((subscription) => {
        this.notificationsSub = subscription;
        this.setSubscription();

        // send the info to the server
        this.Http.post(Url, JSON.stringify(subscription), {
          headers: headers
        }).subscribe((_response:any) => {
          this.alertsService.createSuccessAlert('Subscribed to push notifications successfully!');
        }, (err:HttpErrorResponse) => {
          this.alertsService.createErrorAlert(err);
        })
      // if there was an error, alert the user
      }).catch((err) => {
        this.alertsService.createAlert({ type: 'Error', message: err });
      })
    }
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'Push notifications are not currently supported in this browser.' });
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
    if(this.notificationsSub) {
      this.notificationsSub.unsubscribe();
      this.setSubscription();
    }
  }

  /*
  Function Name: setSubscription()
  Function Description: Sets the currently active PushSubscription (if applicable), as well
                        as auto-refresh and push settings in localStorage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setSubscription() {
    // if the user is subscribed to push notifications, keep the data in localStorage
    if(this.notificationsSub) {
      localStorage.setItem("PUSH_SUBSCRIPTION", JSON.stringify(this.notificationsSub));
    }

    // set the user's push notification preference in localStorage
    localStorage.setItem('PUSH_STATUS', `${this.pushStatus}`);

    // set the user's auto-refresh preference in localStorage
    localStorage.setItem('REFRESH_STATUS', `${this.refreshStatus}`);
  }

  /*
  Function Name: getSubscription()
  Function Description: Gets the currently active PushSubscription (if applicable), as well
                        as auto-refresh and push settings from localStorage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getSubscription() {
    // gets settings from localStorage
    let pushStatus = Boolean(localStorage.getItem('PUSH_STATUS'));
    let refreshStatus = Boolean(localStorage.getItem('REFRESH_STATUS'));
    let pushSub;

    // if push notifications are enabled, there's a subscription in localStorage, so get it
    if(pushStatus) {
      pushSub = JSON.parse(localStorage.getItem('PUSH_SUBSCRIPTION')!);
    }

    // if the push status and refresh status are the same as those set in the app,
    // save the current setting; otherwise replace it with the user's latest choice from
    // localStorage (for cases of closing the browser and re-opening it).
    this.pushStatus = (this.pushStatus == pushStatus) ? this.pushStatus : pushStatus;
    this.refreshStatus = (this.refreshStatus == refreshStatus) ? this.refreshStatus : refreshStatus;

    // if there's a push subscription, compare it to the one currently active. If
    // it's the same, leave as is; otherwise set the new subscription as the latest subscription
    // in localStorage
    if(pushSub) {
      if(pushSub != this.notificationsSub) {
        this.setSubscription();
      }
    }
  }
}
