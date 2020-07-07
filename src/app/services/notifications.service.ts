/*
	NOTIFICATIONS Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
  // notifications data
  notifications = [];

  // CTOR
  constructor(
    private Http:HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService
  ) {

  }

  // NOTIFICATIONS METHODS
  // ==============================================================
  /*
  Function Name: getNotifications()
  Function Description: Gets all new user notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getNotifications() {
    const Url = this.serverUrl + '/notifications';

    // gets Notifications
    this.Http.get(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.notifications = response.notifications;
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
}
