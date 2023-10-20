/*
	Admin Dashboard - Blocks
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
import { Component } from "@angular/core";

// App imports
import { AuthService } from "@app/services/auth.service";
import { AdminService } from "@app/services/admin.service";
import { AlertsService } from "@app/services/alerts.service";
import { ApiClientService } from "@app/services/apiClient.service";

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

@Component({
  selector: "app-admin-blocks",
  templateUrl: "./adminBlocks.component.html",
})
export class AdminBlocks {
  blockedUsers: BlockedUser[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  nextButtonClass = "appButton nextButton";
  previousButtonClass = "appButton prevButton";

  // CTOR
  constructor(
    public authService: AuthService,
    public adminService: AdminService,
    private alertsService: AlertsService,
    private apiClient: ApiClientService,
  ) {
    this.fetchBlocks();
  }

  /**
   * Fetches the list of blocked users.
   */
  fetchBlocks() {
    this.isLoading = true;

    this.apiClient
      .get<{ success: boolean; users: BlockedUser[]; total_pages: number }>("users/blocked", {
        page: `${this.currentPage}`,
      })
      .subscribe({
        next: (data) => {
          this.blockedUsers = data.users;
          this.totalPages = data.total_pages;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  /*
  Function Name: block()
  Function Description: Triggers user blocking.
  Parameters: e (Event) - The sending event (clicking the 'block button')
              userID (number) - The ID of the user to block
              length (string) - length of time for which the user should be blocked
  ----------------
  Programmer: Shir Bar Lev.
  */
  block(e: Event, userID: number, length: string) {
    // prevent submit button default behaviour
    e.preventDefault();

    // if there's a user ID, proceed
    if (userID) {
      userID = Number(userID);
      // if the user is trying to block another user, let them
      if (userID != this.authService.userData.id) {
        // if the user ID is a number, check the user's block
        if (!isNaN(userID)) {
          // if the textfield was marked red, remove it
          if (document.getElementById("blockID")!.classList.contains("missing")) {
            document.getElementById("blockID")!.classList.remove("missing");
          }
          document.getElementById("blockID")!.setAttribute("aria-invalid", "false");

          this.checkBlock(userID, length);
        }
        // otherwise alert the user that user ID has to be a number
        else {
          this.alertsService.createAlert({
            type: "Error",
            message: "User ID must be a number. Please correct the User ID and try again.",
          });
          document.getElementById("blockID")!.classList.add("missing");
        }
      }
      // otherwise alert that they can't block themselves
      else {
        this.alertsService.createAlert({ type: "Error", message: "You cannot block yourself." });
      }
    }
    // otherwise alert the user a user ID is needed to block someone
    else {
      this.alertsService.createAlert({
        type: "Error",
        message:
          "A user ID is needed to block a user. Please add user ID to the textfield and try again.",
      });
      document.getElementById("blockID")!.classList.add("missing");
      document.getElementById("blockID")!.setAttribute("aria-invalid", "true");
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
  checkBlock(userID: number, length: string, reportID?: number) {
    // send the request to get the block data
    this.apiClient.get(`users/all/${userID}`).subscribe({
      next: (response: any) => {
        // set the user's block data
        const user = response.user;
        const blockData = {
          userID: user.id,
          isBlocked: user.blocked,
          releaseDate: user.releaseDate ? new Date(user.releaseDate) : undefined,
        };

        const releaseDate = this.adminService.calculateUserReleaseDate(
          length,
          blockData.releaseDate,
        );

        this.adminService.blockUser(userID, releaseDate, reportID);
      },
    });
  }

  /*
  Function Name: unblock()
  Function Description: Unblocks a user.
  Parameters: userID (number) - The ID of the user to block
  ----------------
  Programmer: Shir Bar Lev.
  */
  unblock(userID: number) {
    this.adminService.unblockUser(userID);
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
  nextPage() {
    this.currentPage += 1;
    this.fetchBlocks();
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.currentPage -= 1;
    this.fetchBlocks();
  }
}
