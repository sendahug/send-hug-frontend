/*
  Navigation Menu
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
import { Component, output } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

// App-related imports
import { ItemsService } from "@app/services/items.service";
import { AlertsService } from "@app/services/alerts.service";

@Component({
  selector: "app-search-form",
  templateUrl: "./searchForm.component.html",
  styleUrl: "./searchForm.component.less",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
})
export class SearchForm {
  searchForm = this.fb.group({
    searchQuery: this.fb.control("", [Validators.required, Validators.minLength(1)]),
  });
  showForm = output<boolean>();
  // font awesome icons
  faTimes = faTimes;

  constructor(
    protected itemsService: ItemsService,
    protected alertsService: AlertsService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  /*
  Function Name: searchApp()
  Function Description: Initiates a search for the given query.
  Parameters: e (Event) - Click event (on the search button).
  ----------------
  Programmer: Shir Bar Lev.
  */
  searchApp(e: Event) {
    e.preventDefault();
    const searchQuery = this.searchForm.controls.searchQuery.value;

    // if there's something in the search query text field, search for it
    if (searchQuery) {
      this.itemsService.sendSearch(searchQuery);
      // clears the search box
      this.searchForm.reset();
      //navigate to search results
      this.router.navigate(["search"], {
        queryParams: {
          query: searchQuery,
        },
      });
      this.toggleSearch();
    }
    // otherwise alert the user there are no empty searches
    else {
      this.alertsService.createAlert({
        message: "Search query is empty! Please write a term to search for.",
        type: "Error",
      });
    }
  }

  /**
   * Alerts the parent component to close the search.
   */
  toggleSearch() {
    this.showForm.emit(false);
  }
}
