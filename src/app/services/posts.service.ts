/*
	Posts Service
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
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

// App-related imports
import { Post } from "../interfaces/post.interface";
import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { SWManager } from "./sWManager.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  readonly serverUrl = environment.backend.domain;
  isUpdated = new BehaviorSubject(false);
  currentlyOpenMenu = new BehaviorSubject(-1);
  receivedAHug = new BehaviorSubject(0);

  // CTOR
  constructor(
    private Http: HttpClient,
    private authService: AuthService,
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
  ) {}

  // POST-RELATED METHODS
  // ==============================================================
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
      const Url = this.serverUrl + "/posts";
      this.Http.post(Url, post, {
        headers: this.authService.authHeader,
      }).subscribe({
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
          // if there was an error, alert the user
        },
        error: (err: HttpErrorResponse) => {
          // if the user is offline, show the offline header message
          if (!navigator.onLine) {
            this.alertsService.toggleOfflineAlert();
          }
          // otherwise just create an error alert
          else {
            this.alertsService.createErrorAlert(err);
          }
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
    const Url = this.serverUrl + `/posts/${post.id}`;
    this.isUpdated.next(false);

    // send update request
    this.Http.patch(Url, post, {
      headers: this.authService.authHeader,
    }).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert(
          "Your post was edited. Refresh to view the updated post.",
          true,
        );
        this.alertsService.toggleOfflineAlert();
        this.isUpdated.next(true);
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
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
    const Url = this.serverUrl + `/posts/${item.id}/hugs`;
    this.Http.post(
      Url,
      {},
      {
        headers: this.authService.authHeader,
      },
    ).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert("Your hug was sent!", false);
        this.alertsService.toggleOfflineAlert();
        // Alert the posts that this item received a hug
        this.receivedAHug.next(item.id);
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }
}
