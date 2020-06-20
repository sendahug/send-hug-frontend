/*
	Admin Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// App-related imports
import { AlertMessage } from '../interfaces/alert.interface';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  userReports = [];
  postReports = [];

  constructor(
    private Http:HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService
  ) {

  }

  // REPORTS-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getOpenReports()
  Function Description: Gets a paginated list of the currently open reports.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getOpenReports() {
    const Url = this.serverUrl + '/reports';

    // Get reports
    this.Http.get(Url, {
      headers: this.authService.authHeader
    // if successful, set the appropriate variables
    }).subscribe((response:any) => {
      this.userReports = response.userReports;
      this.postReports = response.postReports;
    // if there's an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // ALERT METHODS
  // ==============================================================
  /*
  Function Name: createSuccessAlert()
  Function Description: Creates an alert for the user to know their action succeeded.
  Parameters: message (string) - the alert text.
              reload (boolean) - whether a reload button is required; defaults to false.
              navigate (string) - Optional parameter indicating the navigation target (if needed).
  ----------------
  Programmer: Shir Bar Lev.
  */
  createSuccessAlert(message:string, reload:boolean = false, navigate?:string) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Success',
      message: message
    }

    this.alertsService.createAlert(alert, reload, navigate);
  }

  /*
  Function Name: createErrorAlert()
  Function Description: Checks what type of error occurred and returns an alert.
  Parameters: err (HttpErrorResponse) - The HTTP error response from the server.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createErrorAlert(err:HttpErrorResponse) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Error',
      message: err.error.message
    }

    // if it's an auth error, the structure is slightly different
    if(err.status == 403 || err.status == 401) {
      alert.message = err.error.message.description;
    }

    this.alertsService.createAlert(alert);
  }
}
