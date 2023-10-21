/*
	Admin Dashboard - Filters
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
import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";

// App imports
import { AdminService } from "@app/services/admin.service";
import { AlertsService } from "@app/services/alerts.service";
import { ApiClientService } from "@app/services/apiClient.service";

@Component({
  selector: "app-admin-filters",
  templateUrl: "./adminFilters.component.html",
})
export class AdminFilters {
  filteredPhrases: { id: number; filter: string }[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  nextButtonClass = "appButton nextButton";
  previousButtonClass = "appButton prevButton";

  // CTOR
  constructor(
    public adminService: AdminService,
    private alertsService: AlertsService,
    private apiClient: ApiClientService,
  ) {
    this.fetchFilters();
  }

  /**
   * Fetches the filters from the server.
   */
  fetchFilters() {
    this.isLoading = true;

    // try to fetch the list of words
    this.apiClient.get("filters", { page: `${this.currentPage}` }).subscribe({
      next: (response: any) => {
        this.filteredPhrases = response.words;
        this.totalPages = response.total_pages;
        this.isLoading = false;
        // if there was an error, alert the user.
      },
      error: (_err: HttpErrorResponse) => {
        this.isLoading = false;
      },
    });
  }

  /*
  Function Name: addFilter()
  Function Description: Add a filtered phrase to the list.
  Parameters: e (Event) - The sending event (clicking the 'add filter' button)
              filter (string) - The string to filter.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addFilter(e: Event, filter: string) {
    e.preventDefault();

    // if there's a filter in the textfield, continue
    if (filter) {
      // if the textfield was marked red, remove it
      if (document.getElementById("filter")!.classList.contains("missing")) {
        document.getElementById("filter")!.classList.remove("missing");
      }
      document.getElementById("filter")!.setAttribute("aria-invalid", "false");

      // try to add the filter
      this.apiClient.post("filters", { word: filter }).subscribe({
        next: (response: any) => {
          this.alertsService.createSuccessAlert(
            `The phrase ${response.added.filter} was added to the list of filtered words! Refresh to see the updated list.`,
            true,
          );
        },
      });
    }
    // otherwise alert the user a filter is required
    else {
      this.alertsService.createAlert({
        type: "Error",
        message: "A filtered phrase is required in order to add to the filters list.",
      });
      document.getElementById("filter")!.classList.add("missing");
      document.getElementById("filter")!.setAttribute("aria-invalid", "true");
    }
  }

  /*
  Function Name: removeFilter()
  Function Description: Remove a filter from the filtered phrases list.
  Parameters: filter (number) - The string to remove from the filters list.
  ----------------
  Programmer: Shir Bar Lev.
  */
  removeFilter(filter: number) {
    // try to delete the filter
    this.apiClient.delete(`filters/${filter}`).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `The phrase ${response.deleted.filter} was removed from the list of filtered words. Refresh to see the updated list.`,
          true,
        );
      },
    });
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.currentPage += 1;
    this.fetchFilters();
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.currentPage -= 1;
    this.fetchFilters();
  }
}
