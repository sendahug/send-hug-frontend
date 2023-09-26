/*
	Posts Service Mock for testing
	Send a Hug Mock Service
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
import { MockAlertsService } from "./alerts.service.mock";

@Injectable({
  providedIn: "root",
})
export class MockPostsService {
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
  constructor(private alertsService: MockAlertsService) {
    // default assignment
    this.currentPage = 1;
    this.totalPages = 1;
  }

  // POST-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getItems()
  Function Description: Gets ten recent posts and ten suggested posts for the
                        main page (MainPage component).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getPosts(_url: string, _type: "new" | "suggested", page: number = 1) {
    this.isFetchResolved.newItems.next(false);
    this.isFetchResolved.suggestedItems.next(false);

    const pageOnePosts = [
      {
        date: new Date("2020-06-27 19:17:31.072"),
        givenHugs: 0,
        id: 1,
        text: "test",
        userId: 1,
        user: "test",
        sentHugs: [],
      },
      {
        date: new Date("2020-06-28 19:17:31.072"),
        givenHugs: 0,
        id: 2,
        text: "test2",
        userId: 1,
        user: "test",
        sentHugs: [],
      },
    ];
    const pageTwoPosts = [
      {
        date: new Date("2020-06-27 19:17:31.072"),
        givenHugs: 0,
        id: 1,
        text: "test",
        userId: 1,
        user: "test",
        sentHugs: [],
      },
    ];

    // mock data
    if (page == 1) {
      this.posts.newItems.next(pageOnePosts);
      this.posts.suggestedItems.next(pageOnePosts);
      this.currentPage = 1;
      this.totalPages = 2;
      this.isFetchResolved.newItems.next(true);
      this.isFetchResolved.suggestedItems.next(true);
    } else if (page == 2) {
      this.posts.newItems.next(pageTwoPosts);
      this.posts.suggestedItems.next(pageTwoPosts);
      this.currentPage = 2;
      this.totalPages = 2;
      this.isFetchResolved.newItems.next(true);
      this.isFetchResolved.suggestedItems.next(true);
    } else {
      let err: HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        statusText: "Not found",
      });
      this.alertsService.createErrorAlert(err);
    }
  }

  /*
  Function Name: sendPost()
  Function Description: Create a new post.
  Parameters: post (Post) - the post to attempt to add to the database.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendPost(post: Post) {
    this.alertsService.createSuccessAlert(
      "Your post was published! Return to home page to view the post.",
      false,
      "/",
    );
  }

  /*
  Function Name: deletePost()
  Function Description: Delete a post from the database.
  Parameters: post_id (number) - the ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(post_id: number) {
    this.alertsService.createSuccessAlert(
      `Post ${post_id} was deleted. Refresh to view the updated post list.`,
      true,
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
    this.alertsService.createSuccessAlert(
      `User ${userID}'s posts were deleted successfully. Refresh to view the updated profile.`,
      true,
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
    this.isUpdated.next(false);

    this.alertsService.createSuccessAlert(
      "Your post was edited. Refresh to view the updated post.",
      true,
    );
    this.isUpdated.next(true);
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written.
  Parameters: item (Post) - the post for which to send a hug.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(item: any) {
    item.givenHugs += 1;
    this.alertsService.createSuccessAlert("Your hug was sent!", false);

    // Check which array the item is in
    this.disableHugButton(this.posts.newItems.value, ".newItem", item.id);
    this.disableHugButton(this.posts.suggestedItems.value, ".sugItem", item.id);
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
    if (currentPostIndex > 0) {
      // if it is, disable the send-hug button
      let post = document.querySelectorAll(itemClass)[currentPostIndex];
      post.querySelectorAll(".fa-hand-holding-heart").forEach((element) => {
        (element.parentElement as HTMLButtonElement).disabled = true;
      });
    }
  }
}
