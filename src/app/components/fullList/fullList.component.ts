/*
	Full List
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
import { Component, WritableSignal, computed, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { from, map, switchMap, tap } from "rxjs";

// App-related imports
import { FullListType } from "@app/interfaces/types";
import { Post } from "@app/interfaces/post.interface";
import { SWManager } from "@app/services/sWManager.service";
import { ApiClientService } from "@app/services/apiClient.service";

interface PostsListResponse {
  success: boolean;
  posts: Post[];
  total_pages: number;
}

@Component({
  selector: "app-full-list",
  templateUrl: "./fullList.component.html",
})
export class FullList {
  // current page and type of list
  type: FullListType = "New";
  currentPage = signal(1);
  totalPages = signal(1);
  isLoading = signal(false);
  posts: WritableSignal<Post[]> = signal([]);
  previousPageButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentPage() <= 1,
  }));
  nextPageButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.totalPages() <= this.currentPage(),
  }));
  // loader sub-component variables
  waitFor = "";

  // CTOR
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private swManager: SWManager,
    private apiClient: ApiClientService,
  ) {
    const urlPath = this.route.snapshot.url[0].path;

    // set the type from the url only if a valid type is
    // passed in
    if (urlPath.toLowerCase() === "new" || urlPath.toLowerCase() === "suggested") {
      this.type = urlPath as FullListType;
    }

    const requestedPage = Number(this.route.snapshot.queryParamMap.get("page"));

    // set a default page if no page is set or it's invalid
    if ((requestedPage && isNaN(requestedPage)) || !requestedPage) {
      this.currentPage.set(1);
    } else {
      this.currentPage.set(requestedPage);
    }

    this.waitFor = `${this.type.toLowerCase()} posts`;
    this.fetchPosts();
  }

  /**
   * Fetches the posts to display from IDB and then
   * from the server.
   */
  fetchPosts() {
    const fetchFromIdb$ = this.fetchPostsFromIdb();
    this.isLoading.set(true);

    fetchFromIdb$
      .pipe(
        switchMap(() =>
          this.apiClient.get<PostsListResponse>(`posts/${this.type.toLowerCase()}`, {
            page: this.currentPage(),
          }),
        ),
      )
      .subscribe((data) => {
        this.updateInterface(data);
        this.swManager.addFetchedItems("posts", data.posts, "date");
      });
  }

  /**
   * Generates the observable for fetching the data from IndexedDB.
   * @returns an observable that handles fetching
   *          posts from IndexedDB and transforming them.
   */
  fetchPostsFromIdb() {
    const index = this.type.toLowerCase() === "new" ? "date" : "hugs";

    return from(
      this.swManager.fetchPosts(
        index,
        5,
        undefined,
        this.currentPage(),
        this.type.toLowerCase() === "new",
      ),
    ).pipe(
      map((data) => {
        return {
          posts: data.posts,
          total_pages: data.pages,
          success: true,
        } as PostsListResponse;
      }),
      tap((data) => {
        this.updateInterface(data);
      }),
    );
  }

  /**
   * Updates the UI with the fetched posts.
   * @param data - the data to update the UI with.
   */
  updateInterface(data: PostsListResponse) {
    this.totalPages.set(data.total_pages);
    this.posts.set(data.posts);
    this.isLoading.set(false);
  }

  /**
   * Go to the next page of posts. Sends a request to the
   * IDB and API clients to get the data for the next page.
   */
  nextPage() {
    this.currentPage.set(this.currentPage() + 1);
    this.fetchPosts();
    this.updatePageUrlParam();
  }

  /**
   * Go to the previous page of posts. Sends a request to the
   * IDB and API clients to get the data for the next page.
   */
  prevPage() {
    this.currentPage.set(this.currentPage() - 1);
    this.fetchPosts();
    this.updatePageUrlParam();
  }

  /**
   * Updates the URL query parameter (page) according to the new page.
   */
  updatePageUrlParam() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage(),
      },
      replaceUrl: true,
    });
  }
}
