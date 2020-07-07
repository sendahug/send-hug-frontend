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
    private notificationService:NotificationService
  ) {
    // if the user is authenticated, get all notifications from
    // the last time the user checked them
    this.authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        this.notificationService.getNotifications();
      }
    })
  }
}
