/*
	Admin Dashboard
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';

// App-relateed imports
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsTab {
  // CTOR
  constructor(
    private authService:AuthService,
    public notificationService:NotificationService
  ) {
    // if the user is authenticated, get all notifications from
    // the last time the user checked them
    this.authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        this.notificationService.getNotifications(false);
      }
    })
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
      this.notificationService.unsubscribeFromStream();
    }
    // otherwise enable them
    else {
      this.notificationService.pushStatus = true;
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
      this.notificationService.stopAutoRefresh();
    }
    // otherwise enable it
    else {
      this.notificationService.refreshStatus = true;
      this.notificationService.refreshRateSecs = 10;
      this.notificationService.startAutoRefresh();
    }
  }
}
