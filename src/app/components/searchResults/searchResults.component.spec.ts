/*
	Search Results
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
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { SearchResults } from "./searchResults.component";
import { PopUp } from "@common/components/popUp/popUp.component";
import { Loader } from "../../common/components/loader/loader.component";
import { SinglePost } from "@common/components/post/post.component";
import { ItemsService } from "../../common/services/items.service";
import { iconCharacters } from "@app/interfaces/types";
import { AppCommonModule } from "@app/common/common.module";

const mockUserSearchResults = [
  {
    id: 6,
    displayName: "tests",
    receivedH: 2,
    givenH: 4,
    posts: 1,
    role: {
      id: 1,
      name: "user",
      permissions: [],
    },
    selectedIcon: "kitty" as iconCharacters,
    iconColours: {
      character: "#BA9F93",
      lbg: "#e2a275",
      rbg: "#f8eee4",
      item: "#f4b56a",
    },
  },
  {
    id: 7,
    displayName: "testing",
    receivedH: 2,
    givenH: 4,
    posts: 1,
    role: {
      id: 1,
      name: "user",
      permissions: [],
    },
    selectedIcon: "kitty" as iconCharacters,
    iconColours: {
      character: "#BA9F93",
      lbg: "#e2a275",
      rbg: "#f8eee4",
      item: "#f4b56a",
    },
  },
];
const mockPostSearchResults = [
  {
    date: new Date("Mon, 01 Jun 2020 15:19:41 GMT"),
    givenHugs: 0,
    id: 6,
    text: "test",
    user: "shirb",
    userId: 1,
    sentHugs: [],
  },
  {
    date: new Date("Mon, 01 Jun 2020 15:18:37 GMT"),
    givenHugs: 0,
    id: 5,
    text: "test",
    user: "shirb",
    userId: 1,
    sentHugs: [],
  },
];

describe("SearchResults", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
        AppCommonModule,
      ],
      declarations: [SearchResults, PopUp, Loader, SinglePost],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;
    expect(searchResults).toBeTruthy();
  });

  // Check that the component is getting the search query correctly
  it("should get the search query from the URL query param", () => {
    const route = TestBed.inject(ActivatedRoute);
    const routeSpy = spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "query") {
        return "search";
      } else {
        return null;
      }
    });
    const itemsServiceSpy = spyOn(TestBed.inject(ItemsService), "sendSearch");
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;
    const searchResultsDOM = fixture.nativeElement;
    searchResults.itemsService.isSearchResolved.next(true);
    fixture.detectChanges();

    expect(routeSpy).toHaveBeenCalled();
    expect(itemsServiceSpy).toHaveBeenCalledWith("search");
    expect(searchResults.searchQuery).toBe("search");
    expect(searchResultsDOM.querySelector("#resultSummary").textContent).toContain('"search"');
  });

  // Check that a search is triggered if there's no running search
  it("should trigger a search if there's no running search", () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "query") {
        return "search";
      } else {
        return null;
      }
    });
    const searchSpy = spyOn(TestBed.inject(ItemsService), "sendSearch");
    TestBed.inject(ItemsService).isSearching = false;
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;

    expect(searchResults.searchQuery).toBe("search");
    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalledWith("search");
  });

  // Check that if there's a running search, the search method isn't triggered
  it("shouldn't trigger a search if there is one running", () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "query") {
        return "search";
      } else {
        return null;
      }
    });
    const searchSpy = spyOn(TestBed.inject(ItemsService), "sendSearch");
    TestBed.inject(ItemsService).isSearching = true;
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;

    expect(searchResults.searchQuery).toBe("search");
    expect(searchSpy).not.toHaveBeenCalled();
  });

  // USER SEARCH RESULTS
  // ==================================================================
  describe("User Results", () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterModule.forRoot([]),
          HttpClientModule,
          ServiceWorkerModule.register("sw.js", { enabled: false }),
          FontAwesomeModule,
          AppCommonModule,
        ],
        declarations: [SearchResults, PopUp, Loader, SinglePost],
        providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      }).compileComponents();

      spyOn(TestBed.inject(ItemsService), "sendSearch");
    });

    // Check that an error message is shown if there are no results
    it("should show error message if there are no user results", (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
        if (param == "query") {
          return "search";
        } else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.isSearchResolved.next(true);
      searchResults.itemsService.userSearchResults = [];
      searchResults.itemsService.numUserResults = 0;

      fixture.detectChanges();

      expect(searchResultsDOM.querySelector("#userSearchResults")).toBeNull();
      expect(searchResultsDOM.querySelector("#uSearchResErr")).toBeTruthy();
      done();
    });

    // Check that the result list is shown when there are results
    it("should show a list of users with links to their pages", (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
        if (param == "query") {
          return "test";
        } else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.isSearchResolved.next(true);
      searchResults.itemsService.userSearchResults = mockUserSearchResults;
      searchResults.itemsService.numUserResults = 2;

      fixture.detectChanges();

      expect(searchResults.itemsService.userSearchResults).toBeTruthy();
      expect(searchResults.itemsService.userSearchResults.length).toBe(2);
      expect(searchResultsDOM.querySelector("#userSearchResults")).toBeTruthy();
      expect(searchResultsDOM.querySelectorAll(".searchResultUser").length).toBe(2);
      searchResultsDOM.querySelectorAll(".searchResultUser").forEach((item: HTMLElement) => {
        expect(item.firstElementChild).toBeTruthy();
        expect(item.firstElementChild!.getAttribute("href")).toContain("/user");
        expect(item.firstElementChild!.textContent).toContain("test");
      });
      expect(searchResultsDOM.querySelector("#uSearchResErr")).toBeNull();
      done();
    });
  });

  // POST SEARCH RESULTS
  // ==================================================================
  describe("Post Results", () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterModule.forRoot([]),
          HttpClientModule,
          ServiceWorkerModule.register("sw.js", { enabled: false }),
          FontAwesomeModule,
          AppCommonModule,
        ],
        declarations: [SearchResults, PopUp, Loader, SinglePost],
        providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      }).compileComponents();

      spyOn(TestBed.inject(ItemsService), "sendSearch");
    });

    // Check that an error message is shown if there are no results
    it("should show error message if there are no post results", (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
        if (param == "query") {
          return "search";
        } else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.isSearchResolved.next(true);
      searchResults.itemsService.postSearchResults = [];
      searchResults.itemsService.numPostResults = 0;

      fixture.detectChanges();

      expect(searchResultsDOM.querySelector("#postSearchResults")).toBeNull();
      expect(searchResultsDOM.querySelector("#pSearchResErr")).toBeTruthy();
      done();
    });

    // Check that the result list is shown when there are results
    it("should show a list of posts", (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
        if (param == "query") {
          return "test";
        } else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.isSearchResolved.next(true);
      searchResults.itemsService.postSearchResults = [mockPostSearchResults[0]];
      searchResults.itemsService.numPostResults = 1;
      searchResults.itemsService.totalPostSearchPages.set(2);

      fixture.detectChanges();

      expect(searchResults.itemsService.postSearchResults).toBeTruthy();
      expect(searchResults.itemsService.postSearchResults.length).toBe(1);
      expect(searchResultsDOM.querySelector("#postSearchResults")).toBeTruthy();
      expect(searchResultsDOM.querySelectorAll(".searchResult").length).toBe(1);
      expect(searchResultsDOM.querySelectorAll(".searchResult")[0]).toBeTruthy();
      expect(searchResultsDOM.querySelector("#pSearchResErr")).toBeNull();
      done();
    });

    // Check that a different page gets different results
    it("changes page when clicked", (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, "get").and.callFake((param: string) => {
        if (param == "query") {
          return "search";
        } else {
          return null;
        }
      });
      const router = TestBed.inject(Router);
      const routeSpy = spyOn(router, "navigate");

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.isSearchResolved.next(true);
      searchResults.itemsService.postSearchResults = [mockPostSearchResults[0]];
      searchResults.itemsService.numPostResults = 1;
      searchResults.itemsService.totalPostSearchPages.set(2);
      fixture.detectChanges();

      // expectations for page 1
      expect(searchResults.itemsService.postSearchPage()).toBe(1);
      expect(
        searchResultsDOM.querySelector("#postSearchResults").firstElementChild.children.length,
      ).toBe(1);

      // change the page
      searchResultsDOM.querySelectorAll(".nextButton")[0].click();
      searchResults.itemsService.postSearchResults = [...mockPostSearchResults];
      searchResults.itemsService.numPostResults = 2;
      fixture.detectChanges();

      // expectations for page 2
      expect(routeSpy).toHaveBeenCalled();
      expect(searchResults.itemsService.postSearchPage()).toBe(2);
      expect(
        searchResultsDOM.querySelector("#postSearchResults").firstElementChild.children.length,
      ).toBe(2);

      // change the page
      searchResultsDOM.querySelectorAll(".prevButton")[0].click();
      searchResults.itemsService.postSearchResults = [mockPostSearchResults[0]];
      searchResults.itemsService.numPostResults = 1;
      fixture.detectChanges();

      // expectations for page 1
      expect(routeSpy).toHaveBeenCalledTimes(2);
      expect(searchResults.itemsService.postSearchPage()).toBe(1);
      expect(
        searchResultsDOM.querySelector("#postSearchResults").firstElementChild.children.length,
      ).toBe(1);
      done();
    });
  });
});
