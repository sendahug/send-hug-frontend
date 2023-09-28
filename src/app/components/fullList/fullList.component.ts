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
import { Component, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// App-related imports
import { AuthService } from "../../services/auth.service";
import { PostsService } from "../../services/posts.service";
import { FullListType, LowercaseFullListType } from "../../interfaces/types";

@Component({
  selector: "app-full-list",
  templateUrl: "./fullList.component.html",
})
export class FullList {
  // current page and type of list
  type: FullListType = "New";
  page: any;
  showMenuNum: string | null = null;
  postsFetchUrl = computed(() => `/posts/${this.type.toLowerCase()}`);
  postsServiceProperty = computed(() => `${this.type.toLowerCase()}Items`);
  // loader sub-component variables
  waitFor = "";

  // CTOR
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    public postsService: PostsService,
  ) {
    // get the type of list and the current page
    this.route.url.subscribe((params) => {
      const urlPath = params[0].path;

      // set the type from the url only if a valid type is
      // passed in
      if (urlPath.toLowerCase() === "new" || urlPath.toLowerCase() === "suggested") {
        this.type = urlPath as FullListType;
      }

      this.page = Number(this.route.snapshot.queryParamMap.get("page"));

      // set a default page if no page is set or it's invalid
      if ((this.page && this.page.isNaN) || !this.page) {
        this.page = 1;
      }

      this.waitFor = `${this.type.toLowerCase()} posts`;
      this.postsService.getPosts(
        this.postsFetchUrl(),
        this.type.toLowerCase() as LowercaseFullListType,
        this.page,
      );
    });
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.page += 1;
    this.postsService.getPosts(
      this.postsFetchUrl(),
      this.type.toLowerCase() as LowercaseFullListType,
      this.page,
    );

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
      },
      replaceUrl: true,
    });
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.page -= 1;
    this.postsService.getPosts(
      this.postsFetchUrl(),
      this.type.toLowerCase() as LowercaseFullListType,
      this.page,
    );

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
      },
      replaceUrl: true,
    });
  }
}
