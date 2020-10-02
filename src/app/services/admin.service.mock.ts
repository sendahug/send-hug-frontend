/*
	Admin Service
	Send a Hug Mock Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

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
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { Report } from '../interfaces/report.interface';
import { Message } from '../interfaces/message.interface';
import { MockAuthService } from './auth.service.mock';
import { MockAlertsService } from './alerts.service.mock';
import { MockItemsService } from './items.service.mock';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';
import { OtherUser } from '../interfaces/otherUser.interface';

@Injectable({
  providedIn: 'root'
})
export class MockAdminService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  userReports: Report[] = [];
  postReports: Report[] = [];
  isReportsResolved = new BehaviorSubject(false);
  blockedUsers: OtherUser[] = [];
  isBlocksResolved = new BehaviorSubject(false);
  // blocked user data
  userBlockData: {
    userID: number,
    isBlocked: boolean,
    releaseDate: Date | undefined
  } | undefined;
  isBlockDataResolved = new BehaviorSubject(false);
  filteredPhrases: string[] = [];
  isFiltersResolved = new BehaviorSubject(false);
  // pagination
  currentPage = {
    userReports: 1,
    postReports: 1,
    blockedUsers: 1,
    filteredPhrases: 1
  }
  totalPages = {
    userReports: 1,
    postReports: 1,
    blockedUsers: 1,
    filteredPhrases: 1
  }
  isUpdated = new BehaviorSubject(false);

  constructor(
    private authService:MockAuthService,
    private alertsService:MockAlertsService,
    private itemsService:MockItemsService
  ) {

  }

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
    switch(list) {
      case 'userReports':
        this.getOpenReports();
        break;
      case 'postReports':
        this.getOpenReports();
        break;
      case 'blockedUsers':
        this.getBlockedUsers();
        break;
      case 'filteredPhrases':
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

    this.userReports = [{
      id: 1,
      type: 'User',
      userID: 10,
      reporter: 4,
      reportReason: 'something',
      date: new Date('2020-06-29 19:17:31.072'),
      dismissed: false,
      closed: false
    }]
    this.totalPages.userReports = 1;
    this.postReports = [{
      id: 2,
      type: 'Post',
      userID: 11,
      postID: 5,
      reporter: 4,
      reportReason: 'reason',
      date: new Date('2020-06-29 19:17:31.072'),
      dismissed: false,
      closed: false
    }];
    this.totalPages.postReports = 1;
    this.isReportsResolved.next(true);
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
  editPost(post:any, closeReport:boolean, reportID:number) {
    // if the report should be closed
    if(closeReport) {
      post['closeReport'] = reportID;
    }
    this.isUpdated.next(false);

    this.alertsService.createSuccessAlert(`Post ${post.id} updated.`, closeReport);
    this.isUpdated.next(true);
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
  deletePost(postID:number, reportData:any, closeReport:boolean) {
    this.alertsService.createSuccessAlert(`Post ${postID} was successfully deleted.`);
    // create a message from the admin to the user whose post was deleted
    let message:Message = {
      from: this.authService.userData.displayName,
      fromId: this.authService.userData.id!,
      forId: reportData.userID,
      messageText: `Your post (ID ${postID}) was deleted due to violating our community rules.`,
      date: new Date()
    }
    if(closeReport) {
      this.dismissReport(reportData.reportID);
    }
    // send the message about the deleted post
    this.itemsService.sendMessage(message);
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
  editUser(user:any, closeReport:boolean, reportID:number) {
    // if the report should be closed
    if(closeReport) {
      user['closeReport'] = reportID;
    }
    this.alertsService.createSuccessAlert(`User ${user.displayName} updated.`, closeReport);
  }

  /*
  Function Name: dismissReport()
  Function Description: Dismiss an open report without taking further action.
  Parameters: reportID (number) - the ID of the report to dismiss.
  ----------------
  Programmer: Shir Bar Lev.
  */
  dismissReport(reportID:number) {
    let report:Report;

    // if the item is a user report, gets it from user reports array
    if(this.userReports.filter(e => e.id == reportID).length) {
      report = this.userReports.filter(e => e.id == reportID)[0];
    }
    // if not, the item must be a post report, so gets it from the post reports array
    else {
      report = this.postReports.filter(e => e.id == reportID)[0];
    }

    // sets the dismissed and closed values to true
    report.dismissed = true;
    report.closed = true;

    this.alertsService.createSuccessAlert('The report was dismissed! Refresh the page to view the updated list.', true);
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

    this.blockedUsers = [{
            id: 15,
            displayName: 'name',
            receivedHugs: 2,
            givenHugs: 2,
            role: 'user',
            blocked: true,
            releaseDate: new Date('2020-09-29 19:17:31.072'),
            postsNum: 1
        }];
    this.totalPages.blockedUsers = 1;
    this.isBlocksResolved.next(true);
  }

  /*
  Function Name: checkUserBlock()
  Function Description: Gets a specific user's block data (meaning, whether the
                        user is blocked and if they are, how long for)
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkUserBlock(userID:number) {
    this.isBlockDataResolved.next(false);

    // if it's user 15, who's blocked, return the data
    if(userID == 15) {
      this.userBlockData = {
        userID: userID,
        isBlocked: true,
        releaseDate: new Date('2020-09-29 19:17:31.072')
      }
    }
    // otherwise the user isn't blocked, so return this
    else {
      this.userBlockData = {
        userID: userID,
        isBlocked: false,
        releaseDate: undefined
      }
    }

    // set the variable monitoring whether the request is resolved to true
    this.isBlockDataResolved.next(true);
  }

  /*
  Function Name: blockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID:number, releaseDate:Date, reportID?:number) {
    const user = {
      id: userID,
      releaseDate: releaseDate,
      blocked: true
    };

    this.alertsService.createSuccessAlert(`User ${user.id} has been blocked until ${releaseDate}`, true);
  }

  /*
  Function Name: unblockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  unblockUser(userID:number) {
    const user = {
      id: userID,
      releaseDate: null,
      blocked: false
    };

    this.alertsService.createSuccessAlert(`User ${user.id} has been unblocked.`, true);
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

    this.filteredPhrases = ['word', 'word2'];
    this.totalPages.filteredPhrases = 1;
    this.isFiltersResolved.next(true);
  }

  /*
  Function Name: addFilter()
  Function Description: Adds a new string to the filtered phrases list.
  Parameters: filter (string) - String to add to filtered words.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addFilter(filter:string) {
    this.alertsService.createSuccessAlert(`The phrase ${filter} was added to the list of filtered words! Refresh to see the updated list.`, true);
  }

  /*
  Function Name: removeFilter()
  Function Description: Removes a string from the filtered phrases list.
  Parameters: filter (string) - String to remove from filtered words.
  ----------------
  Programmer: Shir Bar Lev.
  */
  removeFilter(filter:string) {
    const filterID = this.filteredPhrases.findIndex(element => element == filter);

    this.alertsService.createSuccessAlert(`The phrase ${filter} was removed from the list of filtered words. Refresh to see the updated list.`, true);
  }
}
