/*
	Admin Dashboard
	Send a Hug Component
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
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

// App imports
import { AuthService } from "@app/services/auth.service";
import { AdminService } from "@app/services/admin.service";
import { AlertsService } from "@app/services/alerts.service";

type AdminList = "userReports" | "postReports" | "blockedUsers" | "filteredPhrases";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./adminDashboard.component.html",
})
export class AdminDashboard implements OnInit {
  screen: string = "";
  adminCategories = [
    {
      title: "Reports",
      explanation: `Here you can view all the posts and users who've been reported by users. For post reports, you can either edit or delete the reported post. For user reports, you can edit or block the user.
                    If you find no justified reason for the report (for either a user or a post), you can also dismiss the report without taking action on the post or the user.`,
    },
    {
      title: "Blocks",
      explanation: `Here you can view all blocked users and how long they've been block for. You can also block or unblock a user by their ID.`,
    },
    {
      title: "Filters",
      explanation: `Here you can view currently filtered words. You can also add or remote filtered words to the list.`,
    },
  ];
  userDataSubscription: Subscription | undefined;
  blockSubscription: Subscription | undefined;
  // edit popup sub-component variables
  toEdit: any;
  editType: string | undefined;
  editMode: boolean;
  reportData: {
    userID?: number;
    reportID: number;
    postID?: number;
  } = {
    reportID: 0,
  };
  delete: boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report: boolean;
  lastFocusedElement: any;
  nextButtonClass = "appButton nextButton";
  previousButtonClass = "appButton prevButton";
  // loader sub-component variable
  waitFor = `admin ${this.screen}`;

  // CTOR
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public adminService: AdminService,
    private alertsService: AlertsService,
  ) {
    this.route.url.subscribe((params) => {
      if (params[0] && params[0].path) {
        this.screen = params[0].path;
      } else {
        this.screen = "main";
      }
    });

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
      if (value == true) {
        // if the current screen is the filters screen
        if (this.screen == "filters") {
          this.adminService.getFilters();
        }

        this.waitFor = `admin ${this.screen}`;

        // also unsubscribe from this to avoid sending the same request
        // multiple times
        if (this.userDataSubscription) {
          this.userDataSubscription.unsubscribe();
        }
      }
    });
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
  addFilter(e: Event, filter: string) {
    e.preventDefault();

    // if there's a filter in the textfield, continue
    if (filter) {
      // if the textfield was marked red, remove it
      if (document.getElementById("filter")!.classList.contains("missing")) {
        document.getElementById("filter")!.classList.remove("missing");
      }
      document.getElementById("filter")!.setAttribute("aria-invalid", "false");

      this.adminService.addFilter(filter);
    }
    // otherwise alert the user a filter is required
    else {
      this.alertsService.createAlert({
        type: "Error",
        message: "A filtered phrase is required in order to add to the filters list.",
      });
      document.getElementById("filter")!.classList.add("missing");
      document.getElementById("filter")!.setAttribute("aria-invalid", "true");
    }
  }

  /*
  Function Name: removeFilter()
  Function Description: Remove a filter from the filtered phrases list.
  Parameters: filter (number) - The string to remove from the filters list.
  ----------------
  Programmer: Shir Bar Lev.
  */
  removeFilter(filter: number) {
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
  nextPage(type: AdminList) {
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
  prevPage(type: AdminList) {
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
  changeMode(edit: boolean) {
    this.editMode = edit;
    this.lastFocusedElement.focus();
  }
}
