/*
	Main Page
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
import { Component, WritableSignal, signal } from "@angular/core";
import { catchError, forkJoin, from, map, of, switchMap, tap } from "rxjs";

// App-related imports
import { PostsService } from "../../services/posts.service";
import { ApiClientService } from "../../services/apiClient.service";
import { SWManager } from "../../services/sWManager.service";
import { Post } from "../../interfaces/post.interface";
import { AlertsService } from "../../services/alerts.service";

interface MainPageResponse {
  recent: Post[];
  suggested: Post[];
  success?: boolean;
}

@Component({
  selector: "app-main-page",
  templateUrl: "./mainPage.component.html",
})
export class MainPage {
  isLoading = signal(false);
  newPosts: WritableSignal<Post[]> = signal([]);
  suggestedPosts: WritableSignal<Post[]> = signal([]);
  // loader sub-component variables
  waitFor = "main page";

  // CTOR
  constructor(
    public postsService: PostsService,
    private apiClient: ApiClientService,
    private swManager: SWManager,
    private alertsService: AlertsService,
  ) {
    this.fetchPosts();
  }

  /**
   * Fetches the posts to display from IDB and then
   * from the server.
   */
  fetchPosts() {
    this.isLoading.set(true);
    const fetchFromIdb$ = this.fetchFromIdb();

    fetchFromIdb$
      .pipe(switchMap(() => this.apiClient.get<MainPageResponse>("")))
      .subscribe((data) => {
        this.updatePostsInterface(data);
        this.alertsService.toggleOfflineAlert();
        // TODO: Convert these into a generic "add" function
        // All that's done with these 'add's is to add an ISO date
        // which is the same across all objects. No need for multiple
        // functions.
        this.postsService.addPostsToIdb(data.recent);
        this.postsService.addPostsToIdb(data.suggested);
      });
  }

  /**
   * Generates the observable for fetching the data from IndexedDB.
   * @returns an observable that handles fetching
   *          posts from IndexedDB and transforming them.
   */
  fetchFromIdb() {
    // Fetch from Idb
    return forkJoin({
      recent: from(this.swManager.fetchPosts("date", 10, undefined, 1, true)),
      suggested: from(this.swManager.fetchPosts("hugs", 10, undefined, 1, false)),
    }).pipe(
      // Transform and update the UI
      map((data) => {
        return {
          recent: data.recent.posts,
          suggested: data.suggested.posts,
          success: true,
        } as MainPageResponse;
      }),
      tap((data) => this.updatePostsInterface(data)),
      catchError((error) => {
        console.log(error);
        return of(error);
      }),
    );
  }

  /**
   * Updates the main page's interface with the newly fetched data.
   * @param data - the posts to set as new and suggested posts.
   */
  updatePostsInterface(data: MainPageResponse) {
    if (data.recent) this.newPosts.set(data.recent);
    if (data.suggested) this.suggestedPosts.set(data.suggested);
    this.isLoading.set(false);
  }
}
