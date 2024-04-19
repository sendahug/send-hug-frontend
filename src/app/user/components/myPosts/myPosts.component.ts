/*
	My Posts
	Send a Hug Component
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
import { Component, OnInit, Input, signal, computed } from "@angular/core";
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import { from, map, switchMap, tap } from "rxjs";

// App-related imports
import { Post } from "@app/interfaces/post.interface";
import { AuthService } from "@common/services/auth.service";
import { ItemsService } from "@common/services/items.service";
import { SWManager } from "@common/services/sWManager.service";
import { ApiClientService } from "@common/services/apiClient.service";

interface MyPostsResponse {
  page: number;
  posts: Post[];
  total_pages: number;
  success: boolean;
}

@Component({
  selector: "app-my-posts",
  templateUrl: "./myPosts.component.html",
})
export class MyPosts implements OnInit {
  isLoading = signal(false);
  isServerFetchResolved = signal(false);
  posts = signal<Post[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  // edit popup sub-component variables
  deleteMode: boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  lastFocusedElement: any;
  previousPageButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentPage() <= 1,
  }));
  nextPageButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.totalPages() <= this.currentPage(),
  }));
  // loader sub-component variable
  waitFor = "user posts";
  // The user whose posts to fetch
  @Input()
  userID!: number;
  user = computed(() =>
    this.userID && this.userID != this.authService.userData()!.id! ? "other" : "self",
  );
  // icons
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;

  // CTOR
  constructor(
    public authService: AuthService,
    private itemsService: ItemsService,
    private swManager: SWManager,
    private apiClient: ApiClientService,
  ) {
    if (!this.userID) {
      this.userID = this.authService.userData()!.id!;
    }

    this.deleteMode = false;
    this.currentPage.set(1);
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the requested user's
                        identity (myself or someone else).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    if (!this.userID) {
      this.userID = this.authService.userData()!.id!;
    }

    this.fetchPosts();
  }

  /**
   * Fetches the posts to display from IDB and then
   * from the server.
   */
  fetchPosts() {
    const fetchFromIdb$ = this.fetchPostsFromIdb();
    this.isLoading.set(true);
    this.isServerFetchResolved.set(false);

    fetchFromIdb$
      .pipe(
        switchMap(() =>
          this.apiClient.get<MyPostsResponse>(`users/all/${this.userID}/posts`, {
            page: this.currentPage(),
          }),
        ),
      )
      .subscribe((data) => {
        this.totalPages.set(data.total_pages);
        this.posts.set(data.posts);
        this.isLoading.set(false);
        this.isServerFetchResolved.set(true);
        this.swManager.addFetchedItems("posts", data.posts, "date");
      });
  }

  /**
   * Generates the observable for fetching the data from IndexedDB.
   * @returns an observable that handles fetching
   *          posts from IndexedDB and transforming them.
   */
  fetchPostsFromIdb() {
    return from(this.swManager.fetchPosts("user", 5, this.userID, this.currentPage(), false)).pipe(
      tap((data) => {
        this.posts.set(data.posts);
        this.isLoading.set(false);
        this.totalPages.set(data.pages);
      }),
      map((data) => {
        return {
          page: this.currentPage(),
          posts: data.posts,
          total_pages: data.pages,
          success: true,
        };
      }),
    );
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
    this.deleteMode = edit;
    this.lastFocusedElement.focus();
  }

  /*
  Function Name: deleteAllPosts()
  Function Description: Send a request to the items service to delete all of the user's
                        posts.
  Parameters: post_id (number) - ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllPosts() {
    this.lastFocusedElement = document.activeElement;
    this.deleteMode = true;
    this.toDelete = "All posts";
    this.itemToDelete = this.userID;
  }

  /**
   * Deletes all posts from the current page once they're deleted
   * in the backend.
   */
  updatePostsList() {
    this.posts.set([]);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of user posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.currentPage.set(this.currentPage() + 1);
    this.fetchPosts();
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of user posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.currentPage.set(this.currentPage() - 1);
    this.fetchPosts();
  }
}
