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
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
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
  posts = {
    newItems: new BehaviorSubject<Post[]>([]),
    suggestedItems: new BehaviorSubject<Post[]>([]),
  };
  // TODO: Remove isFetchResolved and rely entirely on the
  // behaviour subjects above
  isFetchResolved = {
    newItems: new BehaviorSubject(false),
    suggestedItems: new BehaviorSubject(false),
  };
  lastFetchTarget: "/posts/new" | "/posts/suggested" | "" = "";
  lastFetchSource: "Server" | "IDB" | "" = "";
  lastFetchDate: number = 0;
  currentPage = 1;
  totalPages = 1;

  // CTOR
  constructor(
    private Http: HttpClient,
    private authService: AuthService,
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
  ) {
    // default assignment
    this.currentPage = 1;
    this.totalPages = 1;
  }

  // POST-RELATED METHODS
  // ==============================================================
  /**
   * Fetches the posts from the server and updates the posts behaviour subjects
   * @param url - The URL to fetch.
   * @param type - The type of posts to fetch. Not used when the URL is "" as it's the home page.
   * @param page - The page to fetch. Not used when the URL is "" as it's the home page.
   */
  getPosts(url: string, type: "new" | "suggested", page: number = 1) {
    if (type !== "new" && type !== "suggested") return;

    // URL and page query parameter
    const Url = this.serverUrl + url;
    let params = new HttpParams();

    if (url !== "") {
      params = params.set("page", `${page}`);
      this.fetchPostsFromIdb(url, type, page);
    } else {
      this.fetchPostsFromIdb(url, "new", page);
      this.fetchPostsFromIdb(url, "suggested", page);
    }

    this.isFetchResolved.newItems.next(false);
    this.isFetchResolved.suggestedItems.next(false);

    // HTTP request
    this.Http.get(Url, {
      params: params,
    }).subscribe({
      next: (response: any) => {
        if (url === "") {
          this.posts.newItems.next(response.recent);
          this.posts.suggestedItems.next(response.suggested);
          this.addPostsToIdb(response.recent);
          this.addPostsToIdb(response.suggested);
        } else {
          const data = response.posts;
          this.posts[`${type}Items`].next(data);
          this.addPostsToIdb(data);
        }

        this.currentPage = page;
        this.totalPages = response.total_pages || 1;
        this.lastFetchSource = "Server";
        this.lastFetchDate = Date.now();
        this.alertsService.toggleOfflineAlert();
        this.isFetchResolved.newItems.next(true);
        this.isFetchResolved.suggestedItems.next(true);
      },
      error: (err) => {
        // if the server is unavilable due to the user being offline, tell the user
        if (!navigator.onLine) {
          this.posts[`${type}Items`].next([]);
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.posts[`${type}Items`].next([]);
          this.alertsService.createErrorAlert(err);
        }

        this.isFetchResolved.newItems.next(true);
        this.isFetchResolved.suggestedItems.next(true);
      },
    });
  }

  /**
   * Fetches the given type of posts from IndexedDB.
   * @param url - The URL to fetch. Used to determine the number of posts to fetch, as
   *              the home page has 10 posts, and the full list page has 5.
   * @param type - The type of posts to fetch.
   * @param page - The page to fetch.
   */
  fetchPostsFromIdb(url: string, type: "new" | "suggested", page: number = 1) {
    const queryTarget = url == "" ? `main ${type}` : `${type} posts`;

    // get the posts from IDB
    this.serviceWorkerM.queryPosts(queryTarget, undefined, page)?.then((data: any) => {
      // if there are posts in cache, display them
      if (data.posts.length) {
        // if the latest fetch is none, the last fetch was from IDB and before or
        // the last fetch was performed more than 10 seconds ago (meaning the user)
        // changed/refreshed the page, update the latest fetch and the displayed
        // posts
        if (
          !this.lastFetchDate ||
          (this.lastFetchDate < Date.now() && this.lastFetchSource == "IDB") ||
          this.lastFetchDate + 10000 < Date.now() ||
          (page != this.currentPage && page != 1) ||
          this.lastFetchTarget != url
        ) {
          this.lastFetchSource = "IDB";
          this.lastFetchDate = Date.now();
          this.posts[`${type}Items`].next(data.posts);
          this.totalPages = data.pages;
          this.lastFetchTarget = url as "" | "/posts/new" | "/posts/suggested";
        }
      }
    });
  }

  /**
   * Adds the fetched posts to IndexedDB.
   * @param posts - The list of posts to add to IDB.
   */
  addPostsToIdb(posts: Post[]) {
    // add each post in the list to posts store
    posts.forEach((element: Post) => {
      let isoDate = new Date(element.date).toISOString();
      let post = {
        date: element.date,
        givenHugs: element.givenHugs,
        id: element.id!,
        isoDate: isoDate,
        text: element.text,
        userId: Number(element.userId),
        user: element.user,
        sentHugs: element.sentHugs!,
      };
      this.serviceWorkerM.addItem("posts", post);
    });
    this.serviceWorkerM.cleanDB("posts");
  }

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
      }).subscribe(
        (response: any) => {
          this.alertsService.createSuccessAlert(
            "Your post was published! Return to home page to view the post.",
            false,
            "/",
          );
          this.alertsService.toggleOfflineAlert();

          let isoDate = new Date(response.posts.date).toISOString();
          let iDBPost = {
            date: response.posts.date,
            givenHugs: response.posts.givenHugs,
            id: response.posts.id!,
            isoDate: isoDate,
            text: response.posts.text,
            userId: Number(response.posts.userId),
            user: response.posts.user,
            sentHugs: response.posts.sentHugs!,
          };
          this.serviceWorkerM.addItem("posts", iDBPost);
          // if there was an error, alert the user
        },
        (err: HttpErrorResponse) => {
          // if the user is offline, show the offline header message
          if (!navigator.onLine) {
            this.alertsService.toggleOfflineAlert();
          }
          // otherwise just create an error alert
          else {
            this.alertsService.createErrorAlert(err);
          }
        },
      );
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
  Function Name: deletePost()
  Function Description: Delete a post from the database.
  Parameters: post_id (number) - the ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(post_id: number) {
    const Url = this.serverUrl + `/posts/${post_id}`;
    this.Http.delete(Url, {
      headers: this.authService.authHeader,
    }).subscribe(
      (response: any) => {
        this.alertsService.createSuccessAlert(
          `Post ${response.deleted} was deleted. Refresh to view the updated post list.`,
          true,
        );
        this.alertsService.toggleOfflineAlert();

        // delete the post from idb
        this.serviceWorkerM.deleteItem("posts", post_id);
        // if there was an error, alert the user
      },
      (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    );
  }

  /*
  Function Name: deleteAllPosts()
  Function Description: Delete all of a user's posts.
  Parameters: userID (number) - the ID of the user whose posts to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllPosts(userID: number) {
    const Url = this.serverUrl + `/users/all/${userID}/posts`;
    // send delete request
    this.Http.delete(Url, {
      headers: this.authService.authHeader,
    }).subscribe(
      (_response: any) => {
        this.alertsService.createSuccessAlert(
          `User ${userID}'s posts were deleted successfully. Refresh to view the updated profile.`,
          true,
        );
        this.alertsService.toggleOfflineAlert();

        // delete the posts from idb
        this.serviceWorkerM.deleteItems("posts", "userId", userID);
        // if there was an error, alert the user
      },
      (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    );
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
    }).subscribe(
      (_response: any) => {
        this.alertsService.createSuccessAlert(
          "Your post was edited. Refresh to view the updated post.",
          true,
        );
        this.alertsService.toggleOfflineAlert();
        this.isUpdated.next(true);
        // if there was an error, alert the user
      },
      (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    );
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
    item.givenHugs += 1;
    this.Http.post(
      Url,
      {},
      {
        headers: this.authService.authHeader,
      },
    ).subscribe(
      (_response: any) => {
        this.alertsService.createSuccessAlert("Your hug was sent!", false);
        this.alertsService.toggleOfflineAlert();

        // Check which array the item is in
        this.disableHugButton(this.posts.newItems.value, ".newItem", item.id);
        this.disableHugButton(this.posts.suggestedItems.value, ".sugItem", item.id);
        // if there was an error, alert the user
      },
      (err: HttpErrorResponse) => {
        item.givenHugs -= 1;
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    );
  }

  /*
  Function Name: disableHugButton()
  Function Description: Finds the post that got a new hug in all the posts lists and
                        disables the hug button (if the post exists) to prevent attempting
                        to send multiple hugs on one post.
  Parameters: checkList (Array) - the array to check for the existence of the post.
              itemClass (string) - the css class given to the items belonging to the list.
              itemID (number) - the ID of the item to look for.
  ----------------
  Programmer: Shir Bar Lev.
  */
  disableHugButton(checkList: any[], itemClass: string, itemID: number) {
    // Check if the post is in the given array
    let currentPostIndex = checkList.findIndex((e) => e.id == itemID);
    if (currentPostIndex >= 0) {
      // if it is, disable the send-hug button
      checkList[currentPostIndex].sentHugs!.push(this.authService.userData.id!);
      let post = document.querySelectorAll(itemClass)[currentPostIndex];
      post.querySelectorAll(".fa-hand-holding-heart").forEach((element) => {
        (element.parentElement as HTMLButtonElement).disabled = true;
        (element.parentElement as HTMLButtonElement).classList.add("active");
      });
    }
  }
}
