/*
	Search Results
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
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// App-related imports
import { ItemsService } from "@app/services/items.service";

@Component({
  selector: "app-search-results",
  templateUrl: "./searchResults.component.html",
})
export class SearchResults {
  searchQuery: string | null;
  page = 1;
  showMenuNum: string | null = null;
  //loader component variable
  waitFor = "search";

  // CTOR
  constructor(
    public itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.searchQuery = this.route.snapshot.queryParamMap.get("query");

    // if there's a search query but there's no ongoing search, it might be
    // the result of the user manually navigating here or refreshing the page.
    // in that case, trigger a search manually
    if (this.searchQuery && !this.itemsService.isSearching) {
      this.itemsService.sendSearch(this.searchQuery);
    }
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
    this.itemsService.postSearchPage.set(this.itemsService.postSearchPage() + 1);
    this.page += 1;
    this.itemsService.sendSearch(this.searchQuery!);

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        query: this.searchQuery,
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
    this.itemsService.postSearchPage.set(this.itemsService.postSearchPage() - 1);
    this.page -= 1;
    this.itemsService.sendSearch(this.searchQuery!);

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        query: this.searchQuery,
        page: this.page,
      },
      replaceUrl: true,
    });
  }
}
