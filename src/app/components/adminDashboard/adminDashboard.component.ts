/*
	Admin Dashboard
	Send a Hug Component
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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// App imports
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { AlertsService } from '../../services/alerts.service';

type AdminList = 'userReports' | 'postReports' | 'blockedUsers' | 'filteredPhrases';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './adminDashboard.component.html'
})
export class AdminDashboard implements OnInit {
  screen:string = '';
  adminCategories = [
    {
      title: 'Reports',
      explanation: `Here you can view all the posts and users who've been reported by users. For post reports, you can either edit or delete the reported post. For user reports, you can edit or block the user.
                    If you find no justified reason for the report (for either a user or a post), you can also dismiss the report without taking action on the post or the user.`
    },
    {
      title: 'Blocks',
      explanation: `Here you can view all blocked users and how long they've been block for. You can also block or unblock a user by their ID.`
    },
    {
      title: 'Filters',
      explanation: `Here you can view currently filtered words. You can also add or remote filtered words to the list.`
    }
  ]
  userDataSubscription: Subscription | undefined;
  blockSubscription: Subscription | undefined;
  // edit popup sub-component variables
  toEdit: any;
  editType: string | undefined;
  editMode:boolean;
  reportData: {
    userID?: number,
    reportID: number,
    postID?: number
  } = {
    reportID: 0
  }
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report:boolean;
  lastFocusedElement: any;
  // loader sub-component variable
  waitFor = `admin ${this.screen}`;

  // CTOR
  constructor(
    private route:ActivatedRoute,
    public authService:AuthService,
    public adminService:AdminService,
    private alertsService:AlertsService
  ) {
    this.route.url.subscribe(params => {
      if(params[0] && params[0].path) {
        this.screen = params[0].path;
      }
      else {
        this.screen = 'main';
      }
    })

    this.editMode = false;
    this.delete = false;
    this.report = false;
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. Checks for the current screen and calls
                        the appropriate getter method.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    // set the userDataSubscription to the subscription to isUserDataResolved
    this.userDataSubscription = this.authService.isUserDataResolved.subscribe((value) => {
      // if the user is logged in, fetch requested data for the current page
      if(value == true) {
        // if the current screen is the reports screen
        if(this.screen == 'reports') {
          this.adminService.getOpenReports();
        }
        // if the current screen is the blocks screen
        else if(this.screen == 'blocks') {
          this.adminService.getBlockedUsers();
        }
        // if the current screen is the filters screen
        else if(this.screen == 'filters') {
          this.adminService.getFilters();
        }

        this.waitFor = `admin ${this.screen}`;

        // also unsubscribe from this to avoid sending the same request
        // multiple times
        if(this.userDataSubscription) {
          this.userDataSubscription.unsubscribe();
        }
      }
    })
  }

  // REPORTS PAGE
  // ==================================================================
  /*
  Function Name: blockUser()
  Function Description: Sends a request to block a user.
  Parameters: userID (number) - the ID of the user to block.
              reportID (number) - the ID of the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID:number, reportID:number) {
    this.checkBlock(userID, 'oneDay', reportID);
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
  editUser(reportID:number, userID:number, displayName:string) {
    this.lastFocusedElement = document.activeElement;
    this.editType = 'other user';
    this.toEdit = displayName;
    this.editMode = true;
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
  editPost(postID:number, postText:string, reportID:number) {
    this.lastFocusedElement = document.activeElement;
    this.editType = 'admin post';
    this.toEdit = { "text": postText, "id": postID };
    this.editMode = true;
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
  deletePost(postID:number, userID:number, reportID:number) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'ad post';
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
  dismissReport(reportID:number) {
    this.adminService.dismissReport(reportID);
  }

  // BLOCKS PAGE
  // ==================================================================
  /*
  Function Name: block()
  Function Description: Triggers user blocking.
  Parameters: e (Event) - The sending event (clicking the 'block button')
              userID (number) - The ID of the user to block
              length (string) - length of time for which the user should be blocked
  ----------------
  Programmer: Shir Bar Lev.
  */
  block(e:Event, userID:number, length:string) {
    // prevent submit button default behaviour
    e.preventDefault();

    // if there's a user ID, proceed
    if(userID) {
      userID = Number(userID)
      // if the user is trying to block another user, let them
      if(userID != this.authService.userData.id) {
        // if the user ID is a number, check the user's block
        if(!isNaN(userID)) {
          // if the textfield was marked red, remove it
          if(document.getElementById('blockID')!.classList.contains('missing')) {
            document.getElementById('blockID')!.classList.remove('missing');
          }
          document.getElementById('blockID')!.setAttribute('aria-invalid', 'false');

          this.checkBlock(userID, length);
        }
        // otherwise alert the user that user ID has to be a number
        else {
          this.alertsService.createAlert({ type: 'Error', message: 'User ID must be a number. Please correct the User ID and try again.' });
          document.getElementById('blockID')!.classList.add('missing');
        }
      }
      // otherwise alert that they can't block themselves
      else {
        this.alertsService.createAlert({ type: 'Error', message: 'You cannot block yourself.' });
      }
    }
    // otherwise alert the user a user ID is needed to block someone
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'A user ID is needed to block a user. Please add user ID to the textfield and try again.' });
      document.getElementById('blockID')!.classList.add('missing');
      document.getElementById('blockID')!.setAttribute('aria-invalid', 'true');
    }
  }

  /*
  Function Name: checkBlock()
  Function Description: Trigers fetching block data and passes the current
                        length and reportID data to setBlock to calculate
                        the user's release date.
  Parameters: userID (number) - The ID of the user to block
              length (string) - length of time for which the user should be blocked
              reportID (number) - the ID of the report triggering the block (if any)
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkBlock(userID:number, length:string, reportID?:number) {
    this.adminService.checkUserBlock(userID);

    // Checks whether the user's block data has been fetched from the server
    this.blockSubscription = this.adminService.isBlockDataResolved.subscribe((value) => {
      // if it has, cancels the subscription and passes the data to setBlock
      // so that the user's release date can be determined
      if(value) {
        this.setBlock(userID, length, reportID);
        if(this.blockSubscription) {
          this.blockSubscription.unsubscribe();
        }
      }
    })
  }

  /*
  Function Name: setBlock()
  Function Description: Sets the user's release date and passes the data to the admin service.
  Parameters: e (Event) - The sending event (clicking the 'block button')
              userID (number) - The ID of the user to block
              length (string) - length of time for which the user should be blocked
  ----------------
  Programmer: Shir Bar Lev.
  */
  setBlock(userID:number, length:string, reportID?:number) {
    let releaseDate:Date;
    let currentDate = new Date();
    let millisecondsPerDay = 864E5;

    // calculates when the user should be unblocked
    switch(length) {
      case 'oneDay':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 1);
        break;
      case 'oneWeek':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 7);
        break;
      case 'oneMonth':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 30);
        break;
      case 'forever':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 36500);
        break;
      default:
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 1);
        break;
    }

    // If the user is already blocked, adds the given amount of time
    // to extend the block
    if(this.adminService.userBlockData?.isBlocked) {
      let newRelease = releaseDate.getTime() - currentDate.getTime();
      let currentRelease = this.adminService.userBlockData.releaseDate.getTime();
      releaseDate = new Date(newRelease + currentRelease);
    }

    // if the user is blocked through the reports page, pass on the report ID
    if(reportID) {
      this.adminService.blockUser(userID, releaseDate, reportID);
    }
    // otherwise continue without it
    else {
      this.adminService.blockUser(userID, releaseDate);
    }
  }

  /*
  Function Name: unblock()
  Function Description: Unblocks a user.
  Parameters: userID (number) - The ID of the user to block
  ----------------
  Programmer: Shir Bar Lev.
  */
  unblock(userID:number) {
    this.adminService.unblockUser(userID);
  }

  // FILTERS PAGE
  // ==================================================================
  /*
  Function Name: addFilter()
  Function Description: Add a filtered phrase to the list.
  Parameters: e (Event) - The sending event (clicking the 'add filter' button)
              filter (string) - The string to filter.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addFilter(e:Event, filter:string) {
    e.preventDefault();

    // if there's a filter in the textfield, continue
    if(filter) {
      // if the textfield was marked red, remove it
      if(document.getElementById('filter')!.classList.contains('missing')) {
        document.getElementById('filter')!.classList.remove('missing');
      }
      document.getElementById('filter')!.setAttribute('aria-invalid', 'false');

      this.adminService.addFilter(filter);
    }
    // otherwise alert the user a filter is required
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'A filtered phrase is required in order to add to the filters list.' });
      document.getElementById('filter')!.classList.add('missing');
      document.getElementById('filter')!.setAttribute('aria-invalid', 'true');
    }
  }

  /*
  Function Name: removeFilter()
  Function Description: Remove a filter from the filtered phrases list.
  Parameters: filter (number) - The string to remove from the filters list.
  ----------------
  Programmer: Shir Bar Lev.
  */
  removeFilter(filter:number) {
    this.adminService.removeFilter(filter);
  }

  // GENERAL METHODS
  /*
  // ==================================================================
  Function Name: nextPage()
  Function Description: Go to the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage(type:AdminList) {
    this.adminService.currentPage[type] += 1;
    this.adminService.getPage(type);
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage(type:AdminList) {
    this.adminService.currentPage[type] -= 1;
    this.adminService.getPage(type);
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
  changeMode(edit:boolean) {
    this.editMode = edit;
    this.lastFocusedElement.focus();
  }
}
