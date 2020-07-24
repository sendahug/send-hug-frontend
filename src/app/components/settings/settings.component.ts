/*
	Settings Page
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';

// App-related imports
import { NotificationService } from '../../services/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsPage {
  // CTOR
  constructor(
    public notificationService:NotificationService
  ) {

  }
}
