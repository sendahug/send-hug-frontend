/*
	Admin Dashboard
	Send a Hug Component
*/

// Angular imports
import { Component, OnChanges } from '@angular/core';

// App-relateed imports
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsTab implements OnChanges {
  pushStatus = false;
  toggleBtn: 'Enable' | 'Disable';

  // CTOR
  constructor(
    private authService:AuthService,
    private notificationService:NotificationService
  ) {
    // if the user is authenticated, get all notifications from
    // the last time the user checked them
    this.authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        this.notificationService.getNotifications();
      }
    })

    // if push notifications is enabled, have the button show 'disable'
    if(this.pushStatus) {
      this.toggleBtn = 'Disable';
    }
    // otherwise show 'enable'
    else {
      this.toggleBtn = 'Enable';
    }
  }

  /*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. It checks whether push notifications
                        are currently enabled.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnChanges() {
    // if push notifications is enabled, have the button show 'disable'
    if(this.pushStatus) {
      this.toggleBtn = 'Disable';
    }
    // otherwise show 'enable'
    else {
      this.toggleBtn = 'Enable';
    }
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
    if(this.pushStatus) {
      this.pushStatus = false;
      this.notificationService.unsubscribeFromStream();
    }
    // otherwise enable them
    else {
      this.pushStatus = true;
      this.notificationService.subscribeToStream();
    }
  }
}
