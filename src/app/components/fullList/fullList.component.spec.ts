/*
	Full List
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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { of } from "rxjs";
import { ActivatedRoute, Router, RouterModule, UrlSegment } from "@angular/router";

import { FullList } from "./fullList.component";
import { PopUp } from "@app/common/components/popUp/popUp.component";
import { SinglePost } from "@app/common/components/post/post.component";
import { Loader } from "../loader/loader.component";
import { ApiClientService } from "../../services/apiClient.service";
import { SWManager } from "../../services/sWManager.service";

const PageOnePosts = [
  {
    date: new Date("2020-06-27 19:17:31.072"),
    givenHugs: 0,
    id: 1,
    text: "test",
    userId: 1,
    user: "test",
    sentHugs: [],
  },
  {
    date: new Date("2020-06-28 19:17:31.072"),
    givenHugs: 0,
    id: 2,
    text: "test2",
    userId: 1,
    user: "test",
    sentHugs: [],
  },
];
const PageTwoPosts = [
  {
    date: new Date("2020-06-29 19:17:31.072"),
    givenHugs: 0,
    id: 3,
    text: "test3",
    userId: 1,
    user: "test3",
    sentHugs: [],
  },
];

describe("FullList", () => {
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
      ],
      declarations: [FullList, PopUp, Loader, SinglePost],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    expect(fullList).toBeTruthy();
  });

  it("should set the type according to the URL param - new", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];

    // create the component
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    fixture.detectChanges();

    expect(fullList.type).toBe("New");
  });

  it("should set the type according to the URL param - suggested", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];

    // create the component
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    fixture.detectChanges();

    expect(fullList.type).toBe("Suggested");
  });

  it("should set the page according to the URL param", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];
    spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue("2");

    // create the component
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    fixture.detectChanges();

    expect(fullList.currentPage()).toBe(2);
  });

  it("should set the page to 1 if the URL param is invalid", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];
    spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue("abc");

    // create the component
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    fixture.detectChanges();

    expect(fullList.currentPage()).toBe(1);
  });

  it("should set the page to 1 if the URL param is not set", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];
    spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue(null);

    // create the component
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    fixture.detectChanges();

    expect(fullList.currentPage()).toBe(1);
  });

  it("should fetch posts from the server", (done: DoneFn) => {
    // Inject services
    const apiClient = TestBed.inject(ApiClientService);
    const swManager = TestBed.inject(SWManager);
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];

    const mockPageOneResponse = {
      posts: PageOnePosts,
      total_pages: 2,
      success: true,
    };

    // set up spies
    const idbSpy = spyOn(FullList.prototype, "fetchPostsFromIdb").and.returnValue(
      of({ posts: [], total_pages: 1, success: true }),
    );
    const apiClientSpy = spyOn(apiClient, "get").and.returnValue(of(mockPageOneResponse));
    const updateInterfaceSpy = spyOn(FullList.prototype, "updateInterface");
    const addItemsSpy = spyOn(swManager, "addFetchedItems");

    TestBed.createComponent(FullList);

    expect(idbSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalledWith("posts/new", { page: 1 });
    expect(updateInterfaceSpy).toHaveBeenCalledWith(mockPageOneResponse);
    expect(addItemsSpy).toHaveBeenCalledWith("posts", PageOnePosts, "date");
    done();
  });

  it("should fetch posts from IDB - new", (done: DoneFn) => {
    // Inject services
    const swManager = TestBed.inject(SWManager);
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "New" }] as UrlSegment[];
    spyOn(FullList.prototype, "fetchPosts");

    // set up spies
    const idbSpy = spyOn(swManager, "fetchPosts").and.returnValue(
      new Promise((resolve) => resolve({ posts: PageOnePosts, pages: 2 })),
    );
    const updateInterfaceSpy = spyOn(FullList.prototype, "updateInterface");

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    fullList.fetchPostsFromIdb().subscribe((_data) => {
      expect(idbSpy).toHaveBeenCalledWith("date", 5, undefined, 1, true);
      expect(updateInterfaceSpy).toHaveBeenCalledWith({
        posts: PageOnePosts,
        total_pages: 2,
        success: true,
      });
      done();
    });
  });

  it("should fetch posts from IDB - suggested", (done: DoneFn) => {
    // Inject services
    const swManager = TestBed.inject(SWManager);
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];
    spyOn(FullList.prototype, "fetchPosts");

    // set up spies
    const idbSpy = spyOn(swManager, "fetchPosts").and.returnValue(
      new Promise((resolve) => resolve({ posts: PageOnePosts, pages: 2 })),
    );
    const updateInterfaceSpy = spyOn(FullList.prototype, "updateInterface");

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    fullList.fetchPostsFromIdb().subscribe((_data) => {
      expect(idbSpy).toHaveBeenCalledWith("hugs", 5, undefined, 1, false);
      expect(updateInterfaceSpy).toHaveBeenCalledWith({
        posts: PageOnePosts,
        total_pages: 2,
        success: true,
      });
      done();
    });
  });

  it("should update the user interface", (done: DoneFn) => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.nativeElement;
    fixture.detectChanges();

    const totalPagesSpy = spyOn(fullList.totalPages, "set").and.callThrough();
    const postsSpy = spyOn(fullList.posts, "set").and.callThrough();
    const isLoadingSpy = spyOn(fullList.isLoading, "set").and.callThrough();

    fullList.updateInterface({ posts: PageOnePosts, total_pages: 4, success: true });
    fixture.detectChanges();

    expect(totalPagesSpy).toHaveBeenCalledWith(4);
    expect(postsSpy).toHaveBeenCalledWith(PageOnePosts);
    expect(isLoadingSpy).toHaveBeenCalledWith(false);

    const suggestedPosts = fullListDOM.querySelectorAll(".sugItem");
    expect(suggestedPosts.length).toBe(2);
    expect(suggestedPosts[0].querySelector(".itemText").textContent).toContain("test");
    done();
  });

  it("should continue to the next page", (done: DoneFn) => {
    const fetchSpy = spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.nativeElement;
    fullList.totalPages.set(2);
    fixture.detectChanges();

    const updateURLSpy = spyOn(fullList, "updatePageUrlParam");

    // before
    expect(fullList.currentPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // click the next button
    fullListDOM.querySelectorAll(".nextButton")[0].click();

    // after
    expect(fullList.currentPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(updateURLSpy).toHaveBeenCalled();
    done();
  });

  it("should go to the previous page", (done: DoneFn) => {
    const fetchSpy = spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];
    spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue("2");

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.nativeElement;
    fullList.totalPages.set(2);
    fixture.detectChanges();

    const updateURLSpy = spyOn(fullList, "updatePageUrlParam");

    // before
    expect(fullList.currentPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    fullListDOM.querySelectorAll(".prevButton")[0].click();

    // after
    expect(fullList.currentPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(updateURLSpy).toHaveBeenCalled();
    done();
  });

  it("should trigger navigation when the page changes", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];
    spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue("2");
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, "navigate");

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    fullList.currentPage.set(3);
    fullList.updatePageUrlParam();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: paramMap,
      queryParams: { page: 3 },
      replaceUrl: true,
    });
  });
});
