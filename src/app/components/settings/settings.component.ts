/*
	Settings Page
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';

// App-related imports
import { NotificationService } from '../../services/notifications.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsPage {
  // CTOR
  constructor(
    public notificationService:NotificationService,
    public authService:AuthService
  ) {

  }

  /*
  Function Name: togglePushNotifications()
  Function Description: Enables and disables push notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  togglePushNotifications() {
    // if notifications are enabled, disable them
    if(this.notificationService.pushStatus) {
      this.notificationService.pushStatus = false;
      this.notificationService.updateUserSettings();
      this.notificationService.unsubscribeFromStream();
    }
    // otherwise enable them
    else {
      this.notificationService.pushStatus = true;
      this.notificationService.updateUserSettings();
      this.notificationService.subscribeToStream();
    }
  }

  /*
  Function Name: togglePushNotifications()
  Function Description: Enables and disables automatically refreshing the user's
                        notifications in the background.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleAutoRefresh() {
    // if auto-refresh is enabled, disable it
    if(this.notificationService.refreshStatus) {
      this.notificationService.refreshStatus = false;
      this.notificationService.refreshRateSecs = 0;
      this.notificationService.updateUserSettings();
      this.notificationService.stopAutoRefresh();
    }
    // otherwise enable it
    else {
      this.notificationService.refreshStatus = true;
      this.notificationService.refreshRateSecs = 20;
      this.notificationService.updateUserSettings();
      this.notificationService.startAutoRefresh();
    }
  }

  /*
  Function Name: updateRefreshRate()
  Function Description: Updates the user's auto-refersh rate.
  Parameters: e (event) - the button click that triggers the method.
              newRate (number) - the new refresh rate in seconds.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateRefreshRate(e:Event, newRate:number) {
    e.preventDefault();
    this.notificationService.refreshRateSecs = newRate;
  }
}
