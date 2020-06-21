/*
	Admin Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// App-related imports
import { AlertMessage } from '../interfaces/alert.interface';
import { Report } from '../interfaces/report.interface';
import { Message } from '../interfaces/message.interface';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { ItemsService } from './items.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  userReports: Report[] = [];
  postReports: Report[] = [];

  constructor(
    private Http:HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService,
    private itemsService:ItemsService
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

  /*
  Function Name: deletePost()
  Function Description: Sends a request to delete the post. If successful, alerts
                        the user (via the ItemsService) that their post was deleted.
  Parameters: postID (number) - ID of the post to delete.
              userID (number) - ID of the user who wrote the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID:number, userID:number) {
    const postUrl = this.serverUrl + `/posts/${postID}`;

    // delete the post from the database
    this.Http.delete(postUrl, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      // create a message from the admin to the user whose post was deleted
      let message:Message = {
        from: this.authService.userData.displayName,
        fromId: this.authService.userData.id!,
        forId: userID,
        messageText: `Your post (ID ${response.deleted}) was deleted due to violating our community rules.`,
        date: new Date()
      }
      // send the message about the deleted post
      this.itemsService.sendMessage(message);
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: dismissReport()
  Function Description: Dismiss an open report without taking further action.
  Parameters: reportID (number) - the ID of the report to dismiss.
  ----------------
  Programmer: Shir Bar Lev.
  */
  dismissReport(reportID:number) {
    const Url = this.serverUrl + `/reports/${reportID}`;

    let report:Report;

    // if the item is a user report, gets it from user reports array
    if(this.userReports.filter(e => e.id == reportID)) {
      report = this.userReports.filter(e => e.id == reportID)[0];
    }
    // if not, the item must be a post report, so gets it from the post reports array
    else {
      report = this.userReports.filter(e => e.id == reportID)[0];
    }

    // sets the dismissed and closed values to true
    report.dismissed = true;
    report.closed = true;

    // send a request to update the report
    this.Http.patch(Url, report, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      // if the report was dismissed, alert the user
      if(response.success) {
        this.createSuccessAlert('The report was dismissed! Refresh the page to view the updated list.', true);
      }
    // if there's an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // BLOCKS-RELATED METHODS
  // ==============================================================
  /*
  Function Name: blockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID:number, releaseDate:Date) {
    const Url = this.serverUrl + `/users/${userID}`;

    // try to block the user
    this.Http.patch(Url, {
      id: userID,
      releaseDate: releaseDate,
      blocked: true
    }, {
      headers: this.authService.authHeader
    // If successful, let the user know
    }).subscribe((response:any) => {
      this.createSuccessAlert(`User ${response.updated} has been blocked until ${releaseDate}`, true);
    // if there was an error, alert the user.
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: unblockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  unblockUser(userID:number) {
    const Url = this.serverUrl + `/users/${userID}`;

    // try to unblock the user
    this.Http.patch(Url, {
      id: userID,
      releaseDate: null,
      blocked: false
    }, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.createSuccessAlert(`User ${response.updated} has been unblocked.`, true);
    // if there was an error, alert the user.
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
