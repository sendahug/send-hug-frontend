/*
	Paginated list
	Send a Hug Component Tests
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

import { TestBed } from "@angular/core/testing";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { Component, NO_ERRORS_SCHEMA, provideZoneChangeDetection, signal } from "@angular/core";

import { PaginatedListComponent } from "./paginatedList.component";
import { LoaderComponent } from "@common/loader/loader.component";

@Component({
  selector: "app-mock-component",
  template: `
    <app-paginated-list
      [isLoading]="isLoading()"
      [isIdbFetchLoading]="isIdbFetchLoading()"
      [itemType]="'items'"
      [itemCount]="items().length"
      [totalPages]="totalPages()"
      [loadingMessage]="'Loading items...'"
    >
      <ul itemList *ngIf="items().length" id="list">
        <li *ngFor="let item of items()">{{ item.id }} - {{ item.name }}</li>
      </ul>

      <button deleteAllButton class="appButton deleteButton deleteAll">Delete All</button>
    </app-paginated-list>
  `,
  standalone: true,
  imports: [PaginatedListComponent, CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
class MockParentComponent {
  readonly items = signal<{ id: number; name: string }[]>([]);
  readonly totalPages = signal(1);
  readonly currentPage = signal(1);
  readonly isLoading = signal(false);
  readonly isIdbFetchLoading = signal(false);

  constructor() {
    this.totalPages.set(1);
  }

  updateCurrentPage(page: number) {
    this.currentPage.set(page);
  }
}

describe("PaginatedListComponent", () => {
  let mockItems: { id: number; name: string }[];

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    /**
     * @todo we should be mocking the Loader here, but for it breaks tests.
     * Since it's a tiny component, we've decided it's fine for the time being.
     * That said, we should figure it out and mock it like we do with other child components.
     * This is the same problem as in the messages component - mockComponent breaks signals.
     */
    TestBed.configureTestingModule({
      imports: [CommonModule, LoaderComponent, PaginatedListComponent, MockParentComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
      ],
    }).compileComponents();

    mockItems = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
      { id: 4, name: "Item 4" },
      { id: 5, name: "Item 5" },
      { id: 6, name: "Item 6" },
    ];
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(PaginatedListComponent);
    const paginatedList = fixture.componentInstance;

    expect(paginatedList).toBeTruthy();
  });

  // Check that the component sets the page to 1 initially
  it("should set the page to 1 upon starting", () => {
    const fixture = TestBed.createComponent(PaginatedListComponent);
    const paginatedList = fixture.componentInstance;
    const paginatedListDOM = fixture.nativeElement;
    fixture.componentRef.setInput("itemCount", 6);
    fixture.componentRef.setInput("itemType", "posts");
    fixture.componentRef.setInput("totalPages", 2);
    fixture.componentRef.setInput("isLoading", false);
    fixture.componentRef.setInput("isIdbFetchLoading", false);
    fixture.detectChanges();

    expect(paginatedList.currentPage()).toEqual(1);
    expect(paginatedListDOM.querySelector(".pageCount").textContent.trim().toLowerCase()).toBe(
      "page 1 of 2",
    );
  });

  it("should render an itemList slot and a deleteAllButton slot", () => {
    const fixture = TestBed.createComponent(MockParentComponent);
    const parentComponent = fixture.componentInstance;
    const parentComponentDOM = fixture.nativeElement;
    parentComponent.items.set(mockItems);
    parentComponent.totalPages.set(3);
    parentComponent.isLoading.set(false);
    parentComponent.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    const itemList = parentComponentDOM.querySelector("app-paginated-list").querySelector("#list");

    expect(itemList).toBeTruthy();
    const items = itemList.querySelectorAll("li");

    expect(items.length).toBe(6);
    expect(items[0].textContent.trim()).toBe("1 - Item 1");
    expect(items[1].textContent.trim()).toBe("2 - Item 2");
    expect(items[2].textContent.trim()).toBe("3 - Item 3");
    expect(items[3].textContent.trim()).toBe("4 - Item 4");
    expect(items[4].textContent.trim()).toBe("5 - Item 5");
    expect(items[5].textContent.trim()).toBe("6 - Item 6");

    const deleteAllButton = parentComponentDOM
      .querySelector("app-paginated-list")
      .querySelector(".deleteAll");

    expect(deleteAllButton).toBeTruthy();
    expect(deleteAllButton.textContent.trim()).toBe("Delete All");
    expect(deleteAllButton.classList.contains("deleteButton")).toBeTrue();
    expect(deleteAllButton.classList.contains("appButton")).toBeTrue();
  });

  it("should navigate to the next page", () => {
    const fixture = TestBed.createComponent(PaginatedListComponent);
    const paginatedList = fixture.componentInstance;
    const paginatedListDOM = fixture.nativeElement;
    fixture.componentRef.setInput("itemCount", 6);
    fixture.componentRef.setInput("itemType", "posts");
    fixture.componentRef.setInput("totalPages", 2);
    fixture.componentRef.setInput("isLoading", false);
    fixture.componentRef.setInput("isIdbFetchLoading", false);
    fixture.detectChanges();
    const nextPageSpy = spyOn(paginatedList, "nextPage").and.callThrough();
    const emitSpy = spyOn(paginatedList.pageChange, "emit");

    paginatedListDOM.querySelector(".nextButton").click();
    fixture.detectChanges();

    expect(nextPageSpy).toHaveBeenCalledWith();
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it("should navigate to the previous page", () => {
    const fixture = TestBed.createComponent(PaginatedListComponent);
    const paginatedList = fixture.componentInstance;
    const paginatedListDOM = fixture.nativeElement;
    fixture.componentRef.setInput("itemCount", 6);
    fixture.componentRef.setInput("itemType", "posts");
    fixture.componentRef.setInput("totalPages", 2);
    fixture.componentRef.setInput("isLoading", false);
    fixture.componentRef.setInput("isIdbFetchLoading", false);
    paginatedList.currentPage.set(2);
    fixture.detectChanges();
    const nextPageSpy = spyOn(paginatedList, "prevPage").and.callThrough();
    const emitSpy = spyOn(paginatedList.pageChange, "emit");

    paginatedListDOM.querySelector(".prevButton").click();
    fixture.detectChanges();

    expect(nextPageSpy).toHaveBeenCalledWith();
    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it("should show the loader in header mode if the IDB fetch is complete", () => {
    const fixture = TestBed.createComponent(PaginatedListComponent);
    const paginatedList = fixture.componentInstance;
    const paginatedListDOM = fixture.nativeElement;
    fixture.componentRef.setInput("itemCount", 6);
    fixture.componentRef.setInput("itemType", "posts");
    fixture.componentRef.setInput("totalPages", 2);
    fixture.componentRef.setInput("isLoading", true);
    fixture.componentRef.setInput("isIdbFetchLoading", false);
    fixture.detectChanges();

    expect(paginatedList.loaderClass()).toBe("header");
    expect(paginatedListDOM.querySelector("app-loader").classList).toContain("header");
  });

  it("should show the loader in full mode if the IDB fetch isn't complete", () => {
    const fixture = TestBed.createComponent(PaginatedListComponent);
    const paginatedList = fixture.componentInstance;
    const paginatedListDOM = fixture.nativeElement;
    fixture.componentRef.setInput("itemCount", 6);
    fixture.componentRef.setInput("itemType", "posts");
    fixture.componentRef.setInput("totalPages", 2);
    fixture.componentRef.setInput("isLoading", true);
    fixture.componentRef.setInput("isIdbFetchLoading", true);
    fixture.detectChanges();

    expect(paginatedList.loaderClass()).toBe("");
    expect(paginatedListDOM.querySelector("app-loader").classList).not.toContain("header");
  });
});
