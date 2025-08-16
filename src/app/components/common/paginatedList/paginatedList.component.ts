/*
	Paginated list
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
import { Component, signal, computed, input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

// App-related imports
import { LoaderComponent } from "@common/loader/loader.component";

@Component({
  selector: "app-paginated-list",
  templateUrl: "./paginatedList.component.html",
  styleUrl: "./paginatedList.component.less",
  standalone: true,
  imports: [CommonModule, LoaderComponent],
})
export class PaginatedListComponent {
  readonly currentPage = signal(1);
  readonly itemCount = input<number>(0);
  readonly itemType = input<string>("");
  readonly totalPages = input<number>(1);
  readonly isLoading = input<boolean>(false);
  readonly isIdbFetchLoading = input<boolean>(false);
  @Output() pageChange = new EventEmitter<number>();
  readonly previousPageButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentPage() <= 1,
  }));
  readonly nextPageButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.totalPages() <= this.currentPage(),
  }));
  // loader sub-component variable
  readonly loadingMessage = input<string>();
  readonly loaderClass = computed(() =>
    !this.isIdbFetchLoading() && this.isLoading() ? "header" : "",
  );

  // CTOR
  constructor() {
    this.currentPage.set(1);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of messages. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.currentPage.set(this.currentPage() + 1);
    this.pageChange.emit(this.currentPage());
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of messages. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.currentPage.set(this.currentPage() - 1);
    this.pageChange.emit(this.currentPage());
  }
}
