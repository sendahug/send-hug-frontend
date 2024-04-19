/*
	Admin Dashboard - Reports
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Angular imports
import { Component, computed, signal } from "@angular/core";

// App imports
import { AdminService } from "@common/services/admin.service";
import { ApiClientService } from "@common/services/apiClient.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Report } from "@app/interfaces/report.interface";
import { AlertsService } from "@common/services/alerts.service";
import { PostAndReportResponse, UpdatedUserReportResponse } from "@app/interfaces/responses";

@Component({
  selector: "app-admin-reports",
  templateUrl: "./adminReports.component.html",
})
export class AdminReports {
  postReports: Report[] = [];
  userReports: Report[] = [];
  totalPostReportsPages = signal(1);
  totalUserReportsPages = signal(1);
  currentPostReportsPage = signal(1);
  currentUserReportsPage = signal(1);
  isLoading = false;
  // edit popup sub-component variables
  toEdit: any;
  nameEditMode: boolean = false;
  postEditMode: boolean = false;
  reportData: {
    userID?: number;
    reportID: number;
    postID?: number;
  } = {
    reportID: 0,
  };
  deleteMode: boolean = false;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  lastFocusedElement: any;
  usersPrevButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentUserReportsPage() <= 1,
  }));
  usersNextButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.currentUserReportsPage() >= this.totalUserReportsPages(),
  }));
  postsPrevButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentPostReportsPage() <= 1,
  }));
  postsNextButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.currentPostReportsPage() >= this.totalPostReportsPages(),
  }));

  constructor(
    private apiClient: ApiClientService,
    private adminService: AdminService,
    private alertsService: AlertsService,
  ) {
    this.fetchReports();
  }

  /**
   * Fetches the reports from the server.
   */
  fetchReports() {
    this.isLoading = true;

    // Get reports
    this.apiClient
      .get("reports", {
        userPage: `${this.currentUserReportsPage()}`,
        postPage: `${this.currentPostReportsPage()}`,
      })
      .subscribe({
        next: (response: any) => {
          this.userReports = response.userReports;
          this.totalUserReportsPages.set(response.totalUserPages);
          this.postReports = response.postReports;
          this.totalPostReportsPages.set(response.totalPostPages);
          this.isLoading = false;
        },
        error: (_err: HttpErrorResponse) => {
          this.isLoading = false;
        },
      });
  }

  /*
  Function Name: blockUser()
  Function Description: Sends a request to block a user.
  Parameters: userID (number) - the ID of the user to block.
              reportID (number) - the ID of the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID: number, reportID: number) {
    const length = "oneDay";
    this.adminService.blockUser(userID, length, reportID).subscribe((response) => {
      if (response.reportID) {
        this.userReports = this.userReports.filter((report) => report.id != response.reportID);
      }
    });
  }

  /*
  Function Name: editUser()
  Function Description: Edits a user's display name.
  Parameters: userID (number) - the ID of the user to edit.
              reportID (number) - the ID of the report triggering the edit.
              displayName (string) - the user's current display name.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editUser(reportID: number, userID: number, displayName: string) {
    this.lastFocusedElement = document.activeElement;
    this.toEdit = {
      displayName,
      id: userID,
    };
    this.nameEditMode = true;
    this.reportData.reportID = reportID;
    this.reportData.userID = userID;
  }

  /*
  Function Name: editPost()
  Function Description: Edits a reported post's text.
  Parameters: postID (number) - the ID of the post to edit.
              reportID (number) - the ID of the report triggering the edit.
              postText (string) - the post's current text.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(postID: number, postText: string, reportID: number) {
    this.lastFocusedElement = document.activeElement;
    this.toEdit = { text: postText, id: postID };
    this.postEditMode = true;
    this.reportData.reportID = reportID;
    this.reportData.postID = postID;
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to delete a post.
  Parameters: postID (number) - the ID of the post to delete.
              userID (number) - the ID of the user who wrote the post.
              reportID (number) - the ID of the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID: number, userID: number, reportID: number) {
    this.lastFocusedElement = document.activeElement;
    this.deleteMode = true;
    this.toDelete = "ad post";
    this.itemToDelete = postID;
    this.reportData.reportID = reportID;
    this.reportData.userID = userID;
  }

  /*
  Function Name: dismissReport()
  Function Description: Closes an open report without taking further action.
  Parameters: reportID (number) - the ID of the report to close.
  ----------------
  Programmer: Shir Bar Lev.
  */
  dismissReport(reportID: number, dismiss: boolean, postID?: number, userID?: number) {
    this.adminService.closeReport(reportID, dismiss, postID, userID).subscribe({
      next: (response: any) => {
        // if the report was dismissed, alert the user
        this.alertsService.createSuccessAlert(`Report ${response.updated.id} was dismissed!`);
        if (userID) this.userReports = this.userReports.filter((report) => report.id != reportID);
        if (postID) this.postReports = this.postReports.filter((report) => report.id != reportID);
      },
    });
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage(type: "posts" | "users") {
    if (type == "posts") this.currentPostReportsPage.set(this.currentPostReportsPage() + 1);
    else this.currentUserReportsPage.set(this.currentUserReportsPage() + 1);
    this.fetchReports();
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage(type: "posts" | "users") {
    if (type == "posts") this.currentPostReportsPage.set(this.currentPostReportsPage() - 1);
    else this.currentUserReportsPage.set(this.currentUserReportsPage() - 1);
    this.fetchReports();
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the edit popup.
  Parameters: edit (boolean) - indicating whether edit mode should be active.
                               When the user finishes editing, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(edit: boolean, type: "EditName" | "Delete" | "EditPost") {
    if (type === "EditName") this.nameEditMode = edit;
    else if (type === "EditPost") this.postEditMode = edit;
    else this.deleteMode = edit;
    this.lastFocusedElement?.focus();
  }

  /**
   * Updates the UI with the updated details of the post and report.
   * @param response The post/report response returned by the PostEditForm.
   */
  updatePostReport(response: PostAndReportResponse) {
    // If the report was closed, remove it
    if (response.reportId) {
      this.postReports = this.postReports.filter((report) => report.id != response.reportId);
    } else {
      // otherwise at least update the post's test
      const updatedReport = this.postReports.find(
        (report) => report.postID == response.updatedPost?.id,
      );
      if (!(updatedReport && updatedReport.text)) return;

      updatedReport.text = response.updatedPost?.text;
    }
  }

  /**
   *
   * @param response The name/report response returned by the Display Name Edit Form.
   */
  updateUserReport(response: UpdatedUserReportResponse) {
    if (response.closed) {
      this.userReports = this.userReports.filter((report) => report.id != response.reportID);
    } else {
      const updatedReport = this.userReports.find((report) => report.id == response.reportID);

      if (!(updatedReport && updatedReport.displayName)) return;

      updatedReport.displayName = response.displayName;
    }
  }
}
