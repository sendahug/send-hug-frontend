/*
	Items Service
	Send a Hug Service
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
import { Injectable, computed, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, tap } from "rxjs";

// App-related imports
import { type PostGet } from "@app/interfaces/post.interface";
import { type MessageCreate, type MessageGet } from "@app/interfaces/message.interface";
import { type OtherUser } from "@app/interfaces/otherUser.interface";
import { AlertsService } from "@app/services/alerts.service";
import { SWManager } from "@app/services/sWManager.service";
import { ApiClientService } from "@app/services/apiClient.service";

interface SendMessageResponse {
  success: boolean;
  message: MessageGet;
}

@Injectable({
  providedIn: "root",
})
export class ItemsService {
  // search variables
  isSearching = false;
  userSearchResults: OtherUser[] = [];
  numUserResults = 0;
  numPostResults = 0;
  postSearchResults: PostGet[] = [];
  postSearchPage = signal(1);
  totalPostSearchPages = signal(1);
  isSearchResolved = new BehaviorSubject(false);
  previousPageButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.postSearchPage() <= 1,
  }));
  nextPageButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.totalPostSearchPages() <= this.postSearchPage(),
  }));
  // Posts variables
  currentlyOpenMenu = new BehaviorSubject("");
  receivedAHug = new BehaviorSubject(0);

  // CTOR
  constructor(
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
    private apiClient: ApiClientService,
  ) {}

  // POST-RELATED METHODS
  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written.
  Parameters: postId (number) - the ID of the post for which to send a hug.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(postId: number) {
    this.apiClient.post(`posts/${postId}/hugs`, {}).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert("Your hug was sent!");
        // Alert the posts that this item received a hug
        this.receivedAHug.next(postId);
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
  sendMessage(message: MessageCreate) {
    return this.apiClient.post<SendMessageResponse>("messages", message).pipe(
      tap((response) => {
        this.alertsService.createSuccessAlert("Your message was sent!");
        let isoDate = new Date(response.message.date).toISOString();
        let message = {
          ...response.message,
          isoDate: isoDate,
        };
        this.serviceWorkerM.addItem("messages", message);
      }),
    );
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

    this.apiClient
      .post("", { search: searchQuery }, { page: `${this.postSearchPage()}` })
      .subscribe({
        next: (response: any) => {
          this.userSearchResults = response.users;
          this.postSearchResults = response.posts;
          this.postSearchPage.set(response.current_page);
          this.totalPostSearchPages.set(response.total_pages);
          this.numUserResults = response.user_results;
          this.numPostResults = response.post_results;
          this.isSearching = false;
          this.isSearchResolved.next(true);
        },
        error: (_err: HttpErrorResponse) => {
          this.isSearchResolved.next(true);
          this.isSearching = false;
        },
      });
  }
}
