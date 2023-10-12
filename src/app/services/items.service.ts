/*
	Items Service
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
import { Post } from "../interfaces/post.interface";
import { Message } from "../interfaces/message.interface";
import { OtherUser } from "../interfaces/otherUser.interface";
import { Report } from "../interfaces/report.interface";
import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { SWManager } from "./sWManager.service";
import { ApiClientService } from "./apiClient.service";

@Injectable({
  providedIn: "root",
})
export class ItemsService {
  // User variables
  otherUserData: OtherUser = {
    id: 0,
    displayName: "",
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    role: "",
    selectedIcon: "kitty",
    iconColours: {
      character: "",
      lbg: "",
      rbg: "",
      item: "",
    },
  };
  isOtherUser = false;
  isOtherUserResolved = new BehaviorSubject(false);
  previousUser: number = 0;
  // search variables
  isSearching = false;
  userSearchResults: OtherUser[] = [];
  numUserResults = 0;
  numPostResults = 0;
  postSearchResults: Post[] = [];
  postSearchPage = 1;
  totalPostSearchPages = 1;
  isSearchResolved = new BehaviorSubject(false);
  // idb variables
  idbResolved = {
    user: new BehaviorSubject(false),
  };
  // Posts variables
  isUpdated = new BehaviorSubject(false);
  currentlyOpenMenu = new BehaviorSubject(-1);
  receivedAHug = new BehaviorSubject(0);

  // CTOR
  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
    private apiClient: ApiClientService,
  ) {}

  // POST-RELATED METHODS
  /*
  Function Name: sendPost()
  Function Description: Create a new post.
  Parameters: post (Post) - the post to attempt to add to the database.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendPost(post: Post) {
    // if the user isn't blocked, let them post
    if (!this.authService.userData.blocked) {
      this.apiClient.post("posts", post).subscribe({
        next: (response: any) => {
          this.alertsService.createSuccessAlert(
            "Your post was published! Return to home page to view the post.",
            false,
            "/",
          );
          this.alertsService.toggleOfflineAlert();

          let isoDate = new Date(response.posts.date).toISOString();
          let iDBPost = {
            ...response.posts,
            isoDate: isoDate,
          };
          this.serviceWorkerM.addItem("posts", iDBPost);
        },
      });
    }
    // if they're blocked, alert them they cannot post while blocked
    else {
      this.alertsService.createAlert({
        type: "Error",
        message: `You cannot post new posts while you're blocked. You're blocked until ${this.authService.userData.releaseDate}.`,
      });
    }
  }

  /*
  Function Name: editPost()
  Function Description: Edit an existing post. This is used only for editing the post's text.
  Parameters: post (Post) - the updated data of the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post: Post) {
    this.isUpdated.next(false);

    // send update request
    this.apiClient.patch(`posts/${post.id}`, post).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert(
          "Your post was edited. Refresh to view the updated post.",
          true,
        );
        this.alertsService.toggleOfflineAlert();
        this.isUpdated.next(true);
      },
    });
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written.
  Parameters: item (Post) - the post for which to send a hug.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(item: any) {
    this.apiClient.post(`posts/${item.id}/hugs`, {}).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert("Your hug was sent!", false);
        this.alertsService.toggleOfflineAlert();
        // Alert the posts that this item received a hug
        this.receivedAHug.next(item.id);
      },
    });
  }

  // USER-RELATED METHODS
  // ==============================================================
  /*
  Function Name: sendUserHug()
  Function Description: Send a hug to a user.
  Parameters: userID (number) - the ID of the user.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendUserHug(userID: number) {
    // update the users' data
    this.otherUserData.receivedHugs += 1;
    this.authService.userData.givenHugs += 1;

    this.apiClient.post(`users/all/${userID}/hugs`, {}).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert("Your hug was sent!", true);
        this.alertsService.toggleOfflineAlert();
      },
    });
  }

  /*
  Function Name: getUser()
  Function Description: Gets the data of a specific user.
  Parameters: userID (number) - the ID of the user to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getUser(userID: number) {
    if (this.previousUser != 0 && this.previousUser != userID) {
      this.otherUserData = {
        id: 0,
        displayName: "",
        receivedHugs: 0,
        givenHugs: 0,
        postsNum: 0,
        role: "",
        selectedIcon: "kitty",
        iconColours: {
          character: "",
          lbg: "",
          rbg: "",
          item: "",
        },
      };
      this.isOtherUserResolved.next(false);
      this.idbResolved.user.next(false);
    }

    // get the user's data from IDB
    this.serviceWorkerM.queryUsers(userID)?.then((data: any) => {
      // if the user's data exists in the IDB database
      if (data) {
        this.otherUserData = data;
        this.idbResolved.user.next(true);
      }
    });

    // try to get the user's data from the server
    this.apiClient.get(`users/all/${userID}`).subscribe({
      next: (response: any) => {
        let user = response.user;
        this.otherUserData = {
          id: user.id,
          displayName: user.displayName,
          receivedHugs: user.receivedH,
          givenHugs: user.givenH,
          role: user.role,
          postsNum: user.posts,
          selectedIcon: user.selectedIcon,
          iconColours: {
            character: user.iconColours.character,
            lbg: user.iconColours.lbg,
            rbg: user.iconColours.rbg,
            item: user.iconColours.item,
          },
        };
        this.isOtherUserResolved.next(true);
        this.idbResolved.user.next(true);
        this.alertsService.toggleOfflineAlert();

        // adds the user's data to the users store
        this.serviceWorkerM.addItem("users", this.otherUserData);
        // if there was an error, alert the user
      },
      error: (_err: HttpErrorResponse) => {
        this.isOtherUserResolved.next(true);
        this.idbResolved.user.next(true);
      },
    });
  }

  // MESSAGE-RELATED METHODS
  // ==============================================================
  /*
  Function Name: sendMessage()
  Function Description: Send a message.
  Parameters: message (Message) - the message to send.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendMessage(message: Message) {
    this.apiClient.post("messages", message).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert("Your message was sent!", false, "/");
        this.alertsService.toggleOfflineAlert();

        let isoDate = new Date(response.message.date).toISOString();
        let message = {
          ...response.message,
          isoDate: isoDate,
        };
        this.serviceWorkerM.addItem("messages", message);
      },
    });
  }

  // SEARCH-RELATED METHODS
  // ==============================================================
  /*
  Function Name: sendSearch()
  Function Description: Sends a search query to the database.
  Parameters: searchQuery (string) - String to search for.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendSearch(searchQuery: string) {
    this.isSearching = true;

    this.apiClient.post("", { search: searchQuery }, { page: `${this.postSearchPage}` }).subscribe({
      next: (response: any) => {
        this.userSearchResults = response.users;
        this.postSearchResults = response.posts;
        this.postSearchPage = response.current_page;
        this.totalPostSearchPages = response.total_pages;
        this.numUserResults = response.user_results;
        this.numPostResults = response.post_results;
        this.isSearching = false;
        this.isSearchResolved.next(true);
        this.alertsService.toggleOfflineAlert();
      },
      error: (_err: HttpErrorResponse) => {
        this.isSearchResolved.next(true);
        this.isSearching = false;
      },
    });
  }

  // REPORT METHODS
  // ==============================================================
  /*
  Function Name: sendReport()
  Function Description: Sends a new post/user report to the database.
  Parameters: report (Report) - the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendReport(report: Report) {
    // sends the report
    this.apiClient.post("reports", report).subscribe({
      next: (response: any) => {
        // if successful, alert the user
        let sent_report: Report = response.report;
        if (sent_report.type == "Post") {
          this.alertsService.createSuccessAlert(
            `Post number ${sent_report.postID} was successfully reported.`,
            false,
            "/",
          );
        } else {
          this.alertsService.createSuccessAlert(
            `User ${sent_report.userID} was successfully reported.`,
            false,
            "/",
          );
        }
        this.alertsService.toggleOfflineAlert();
      },
    });
  }
}
