/*
	Admin Service
	Send a Hug Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

// App-related imports
import { Report } from "../interfaces/report.interface";
import { Message } from "../interfaces/message.interface";
import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { ItemsService } from "./items.service";
import { SWManager } from "./sWManager.service";
import { ApiClientService } from "./apiClient.service";

interface BlockedUser {
  id: number;
  displayName: string;
  receivedH: number;
  givenH: number;
  posts: number;
  role: string;
  blocked?: boolean;
  releaseDate?: Date;
}

@Injectable({
  providedIn: "root",
})
export class AdminService {
  userReports: Report[] = [];
  postReports: Report[] = [];
  isReportsResolved = new BehaviorSubject(false);
  blockedUsers: BlockedUser[] = [];
  isBlocksResolved = new BehaviorSubject(false);
  // blocked user data
  userBlockData:
    | {
        userID: number;
        isBlocked: boolean;
        releaseDate: Date;
      }
    | undefined;
  isBlockDataResolved = new BehaviorSubject(false);
  filteredPhrases: string[] = [];
  isFiltersResolved = new BehaviorSubject(false);
  // pagination
  currentPage = {
    userReports: 1,
    postReports: 1,
    blockedUsers: 1,
    filteredPhrases: 1,
  };
  totalPages = {
    userReports: 1,
    postReports: 1,
    blockedUsers: 1,
    filteredPhrases: 1,
  };
  isUpdated = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private itemsService: ItemsService,
    private serviceWorkerM: SWManager,
    private apiClient: ApiClientService,
  ) {}

  // GENERAL METHODS
  // ==============================================================
  /*
  Function Name: getPage()
  Function Description: Checks which list's page was changed and fetches the
                        data for the given page.
  Parameters: list (string) - The list for which to fetch another page.
              page (number) - The page number to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getPage(list: string) {
    switch (list) {
      case "userReports":
        this.getOpenReports();
        break;
      case "postReports":
        this.getOpenReports();
        break;
      case "blockedUsers":
        this.getBlockedUsers();
        break;
      case "filteredPhrases":
        this.getFilters();
        break;
    }
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
    this.isReportsResolved.next(false);

    // Get reports
    this.apiClient
      .get("reports", {
        userPage: `${this.currentPage.userReports}`,
        postPage: `${this.currentPage.postReports}`,
      })
      .subscribe({
        next: (response: any) => {
          this.userReports = response.userReports;
          this.totalPages.userReports = response.totalUserPages;
          this.postReports = response.postReports;
          this.totalPages.postReports = response.totalPostPages;
          this.isReportsResolved.next(true);
        },
        error: (_err: HttpErrorResponse) => {
          this.isReportsResolved.next(true);
        },
      });
  }

  /*
  Function Name: editPost()
  Function Description: Edits a reported post's text. If necessary,
                        also closes the report.
  Parameters: post (any) - the ID and new text of the post.
              reportID (number) - the ID of the report triggering the edit.
              closeReport (boolean) - whether or not to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post: any, closeReport: boolean, reportID: number) {
    // if the report should be closed
    if (closeReport) {
      post["closeReport"] = reportID;
    }
    this.isUpdated.next(false);

    // try to edit the post
    this.apiClient.patch(`posts/${post.id}`, post).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(`Post ${response.updated.id} updated.`, closeReport);
        this.isUpdated.next(true);
      },
    });
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to delete the post. If successful, alerts
                        the user (via the ItemsService) that their post was deleted.
  Parameters: postID (number) - ID of the post to delete.
              reportData (any) - User ID and report ID.
              closeReport (boolean) - whether to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID: number, reportData: any, closeReport: boolean) {
    // delete the post from the database
    this.apiClient.delete(`posts/${postID}`).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(`Post ${response.deleted} was successfully deleted.`);
        // create a message from the admin to the user whose post was deleted
        let message: Message = {
          from: {
            displayName: this.authService.userData.displayName,
          },
          fromId: this.authService.userData.id!,
          forId: reportData.userID,
          messageText: `Your post (ID ${response.deleted}) was deleted due to violating our community rules.`,
          date: new Date(),
        };

        // if the report needs to be closed
        if (closeReport) {
          this.dismissReport(reportData.reportID);
        }

        // delete the post from idb
        this.serviceWorkerM.deleteItem("posts", postID);

        // send the message about the deleted post
        this.itemsService.sendMessage(message);
      },
    });
  }

  /*
  Function Name: editUser()
  Function Description: Sends a request to edit the user's display name. If necessary,
                        also closes the report.
  Parameters: user (any) - the ID and new display name of the user.
              reportID (number) - the ID of the report triggering the edit.
              closeReport (boolean) - whether or not to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editUser(user: any, closeReport: boolean, reportID: number) {
    // if the report should be closed
    if (closeReport) {
      user["closeReport"] = reportID;
    }

    // update the user's display name
    this.apiClient.patch(`users/all/${user.userID}`, user).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `User ${response.updated.displayName} updated.`,
          closeReport,
        );
      },
    });
  }

  /*
  Function Name: dismissReport()
  Function Description: Dismiss an open report without taking further action.
  Parameters: reportID (number) - the ID of the report to dismiss.
  ----------------
  Programmer: Shir Bar Lev.
  */
  dismissReport(reportID: number) {
    let report: Report;

    // if the item is a user report, gets it from user reports array
    if (this.userReports.filter((e) => e.id == reportID).length) {
      report = this.userReports.filter((e) => e.id == reportID)[0];
    }
    // if not, the item must be a post report, so gets it from the post reports array
    else {
      report = this.postReports.filter((e) => e.id == reportID)[0];
    }

    // sets the dismissed and closed values to true
    report.dismissed = true;
    report.closed = true;

    // send a request to update the report
    this.apiClient.patch(`reports/${reportID}`, report).subscribe({
      next: (response: any) => {
        // if the report was dismissed, alert the user
        this.alertsService.createSuccessAlert(
          `Report ${response.updated.id} was dismissed! Refresh the page to view the updated list.`,
          true,
        );
      },
    });
  }

  // BLOCKS-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getBlockedUsers()
  Function Description: Gets a paginated list of the currently blocked users.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getBlockedUsers() {
    this.isBlocksResolved.next(false);

    // try to fetch blocked users
    this.apiClient.get("users/blocked", { page: `${this.currentPage.blockedUsers}` }).subscribe({
      next: (response: any) => {
        this.blockedUsers = response.users;
        this.totalPages.blockedUsers = response.total_pages;
        this.isBlocksResolved.next(true);
        // if there was an error, alert the user.
      },
      error: (_err: HttpErrorResponse) => {
        this.isBlocksResolved.next(true);
      },
    });
  }

  /*
  Function Name: checkUserBlock()
  Function Description: Gets a specific user's block data (meaning, whether the
                        user is blocked and if they are, how long for)
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkUserBlock(userID: number) {
    this.isBlockDataResolved.next(false);

    // send the request to get the block data
    this.apiClient.get(`users/all/${userID}`).subscribe({
      next: (response: any) => {
        // set the user's block data
        let user = response.user;
        this.userBlockData = {
          userID: user.id,
          isBlocked: user.blocked,
          releaseDate: new Date(user.releaseDate),
        };
        // set the variable monitoring whether the request is resolved to true
        this.isBlockDataResolved.next(true);
        // if there was an error, alert the user.
      },
      error: (_err: HttpErrorResponse) => {
        this.isBlockDataResolved.next(true);
      },
    });
  }

  /*
  Function Name: blockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID: number, releaseDate: Date, reportID?: number) {
    // try to block the user
    this.apiClient
      .patch(`users/all/${userID}`, {
        id: userID,
        releaseDate: releaseDate,
        blocked: true,
      })
      .subscribe({
        next: (response: any) => {
          this.alertsService.createSuccessAlert(
            `User ${response.updated.displayName} has been blocked until ${releaseDate}`,
            true,
          );
          // if the block was done via the reports page, also dismiss the report
          if (reportID) {
            this.dismissReport(reportID);
          }
        },
      });
  }

  /*
  Function Name: unblockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  unblockUser(userID: number) {
    // try to unblock the user
    this.apiClient
      .patch(`users/all/${userID}`, {
        id: userID,
        releaseDate: null,
        blocked: false,
      })
      .subscribe({
        next: (response: any) => {
          this.alertsService.createSuccessAlert(
            `User ${response.updated.displayName} has been unblocked.`,
            true,
          );
        },
      });
  }

  // FILTERS-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getFilters()
  Function Description: Gets a paginated list of user-added filtered words.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getFilters() {
    this.isFiltersResolved.next(false);

    // try to fetch the list of words
    this.apiClient.get("filters", { page: `${this.currentPage.filteredPhrases}` }).subscribe({
      next: (response: any) => {
        this.filteredPhrases = response.words;
        this.totalPages.filteredPhrases = response.total_pages;
        this.isFiltersResolved.next(true);
        // if there was an error, alert the user.
      },
      error: (_err: HttpErrorResponse) => {
        this.isFiltersResolved.next(true);
      },
    });
  }

  /*
  Function Name: addFilter()
  Function Description: Adds a new string to the filtered phrases list.
  Parameters: filter (string) - String to add to filtered words.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addFilter(filter: string) {
    // try to add the filter
    this.apiClient.post("filters", { word: filter }).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `The phrase ${response.added.filter} was added to the list of filtered words! Refresh to see the updated list.`,
          true,
        );
      },
    });
  }

  /*
  Function Name: removeFilter()
  Function Description: Removes a string from the filtered phrases list.
  Parameters: filter (number) - String to remove from filtered words.
  ----------------
  Programmer: Shir Bar Lev.
  */
  removeFilter(filter: number) {
    // try to delete the filter
    this.apiClient.delete(`filters/${filter}`).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `The phrase ${response.deleted.filter} was removed from the list of filtered words. Refresh to see the updated list.`,
          true,
        );
      },
    });
  }
}
