/*
	Search Results
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
import { Component, AfterViewChecked } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

// App-related imports
import { ItemsService } from "../../services/items.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-search-results",
  templateUrl: "./searchResults.component.html",
})
export class SearchResults implements AfterViewChecked {
  searchQuery: string | null;
  page = 1;
  showMenuNum: string | null = null;
  //loader component variable
  waitFor = "search";

  // CTOR
  constructor(
    public itemsService: ItemsService,
    public authService: AuthService,
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
  Function Name: ngAfterViewInit()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is intialised. It checks whether posts' buttons are
                        too big for their container; if they are, changes the menu to be
                        a floating one.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    let posts = document.querySelectorAll(".searchResult");

    if (posts[0]) {
      // check the first post; the others are the same
      let firstPButtons = posts[0]!.querySelectorAll(".buttonsContainer")[0] as HTMLDivElement;
      let sub = posts[0]!.querySelectorAll(".subMenu")[0] as HTMLDivElement;

      // remove the hidden label check the menu's width
      if (sub.classList.contains("hidden")) {
        firstPButtons.classList.remove("float");
        sub.classList.remove("hidden");
        sub.classList.remove("float");
      }

      // if they're too long and there's no menu to show
      if (sub.scrollWidth > sub.offsetWidth && !this.showMenuNum) {
        // change each menu to a floating, hidden menu
        posts.forEach((element) => {
          element.querySelectorAll(".buttonsContainer")[0].classList.add("float");
          element.querySelectorAll(".subMenu")[0].classList.add("hidden");
          element.querySelectorAll(".subMenu")[0].classList.add("float");
          element.querySelectorAll(".menuButton")[0].classList.remove("hidden");
        });
      }
      // if there's a menu to show, show that specific menu
      else if (this.showMenuNum) {
        // change each menu to a floating menu
        posts.forEach((element) => {
          if (element.firstElementChild!.id == this.showMenuNum) {
            element.querySelectorAll(".subMenu")[0].classList.remove("hidden");
          } else {
            element.querySelectorAll(".subMenu")[0].classList.add("hidden");

            // if it's not the first element that needs an open menu, close
            // the first item's menu like  it was opened above
            if (element.firstElementChild!.id == posts[0].firstElementChild!.id) {
              element.querySelectorAll(".buttonsContainer")[0].classList.add("float");
              element.querySelectorAll(".subMenu")[0].classList.add("hidden");
              element.querySelectorAll(".subMenu")[0].classList.add("float");
            }
          }
        });
      }
      // otherwise make sure the menu button is hidden and the buttons container
      // is in its normal design
      else {
        posts.forEach((element) => {
          element.querySelectorAll(".buttonsContainer")[0].classList.remove("float");
          element.querySelectorAll(".subMenu")[0].classList.remove("hidden");
          element.querySelectorAll(".subMenu")[0].classList.remove("float");
          element.querySelectorAll(".menuButton")[0].classList.add("hidden");
        });
      }
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
    this.itemsService.postSearchPage += 1;
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
    this.itemsService.postSearchPage -= 1;
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

  /*
  Function Name: openMenu()
  Function Description: Opens a floating sub menu that contains the message, report, edit (if
                        applicable) and delete (if applicable) options on smaller screens.
  Parameters: menu (string) - ID of the item for which to open the submenu.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openMenu(menu: string) {
    let post = document.querySelector("#" + menu)!.parentElement;
    let subMenu = post!.querySelectorAll(".subMenu")[0];

    // if the submenu is hidden, show it
    if (subMenu.classList.contains("hidden")) {
      subMenu.classList.remove("hidden");
      this.showMenuNum = menu;
    }
    // otherwise hide it
    else {
      subMenu.classList.add("hidden");
      this.showMenuNum = null;
    }
  }
}
