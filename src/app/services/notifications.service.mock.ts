/*
	NOTIFICATIONS Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription, Observable } from 'rxjs';

// App-related imports
import { MockAuthService } from './auth.service.mock';
import { MockAlertsService } from './alerts.service.mock';

@Injectable({
  providedIn: 'root'
})
export class MockNotificationService {
  // notifications data
  notifications = [];
  // push notifications variables
  toggleBtn!: 'Enable' | 'Disable';
  notificationsSub: PushSubscription | undefined;
  newNotifications = 0;
  pushStatus!:Boolean;
  // notifications refresh variables
  refreshBtn!: 'Enable' | 'Disable';
  refreshStatus!:Boolean;
  refreshRateSecs = 20;
  refreshCounter: Observable<number> | undefined;
  refreshSub: Subscription | undefined;

  // CTOR
  constructor(
    private authService:MockAuthService,
    private alertsService:MockAlertsService
  ) {
    // if the user is logged in, and their data is fetched, set the appropriate variables
    this.authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        this.pushStatus = this.authService.userData.pushEnabled;
        this.refreshStatus = this.authService.userData.autoRefresh;
        this.refreshRateSecs = this.authService.userData.refreshRate;
      }
      else {
        this.pushStatus = false;
        this.refreshStatus = false;
      }

      this.toggleBtn = this.pushStatus ? 'Disable': 'Enable';
      this.refreshBtn = this.refreshStatus ? 'Disable' : 'Enable';
    })
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
        this.refreshBtn = 'Disable';
        this.autoRefresh();

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
      this.refreshBtn = 'Enable';
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
    const silent = silentRefresh ? silentRefresh : false;

    this.notifications = [];

    // if it's a silent refresh, check how many new notifications the user has
    if(silent) {
      this.newNotifications = (this.notifications.length);
    }
  }

  /*
  Function Name: subscribeToStream()
  Function Description: Subscribes the user to push notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  subscribeToStream() {
    this.toggleBtn = 'Disable';
    this.setSubscription();
    this.alertsService.createSuccessAlert('Subscribed to push notifications successfully!');
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
      this.toggleBtn = 'Enable';
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
    return 'set';
  }

  /*
  Function Name: getSubscription()
  Function Description: Gets the currently active PushSubscription (if applicable) from localStorage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getSubscription() {
    return '';
  }

  /*
  Function Name: updateUserSettings()
  Function Description: Updates the user's auto-refresh and push settings in the database.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateUserSettings() {
    this.alertsService.createSuccessAlert('Settings updated successfully!');
  }
}
