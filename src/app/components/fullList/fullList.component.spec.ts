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
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { of } from "rxjs";
import {
  ActivatedRoute,
  provideRouter,
  Router,
  RouterLink,
  RouterModule,
  UrlSegment,
} from "@angular/router";
import { By } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { MockComponent, MockProvider } from "ng-mocks";

import { FullList } from "./fullList.component";
import { ApiClientService } from "@app/services/apiClient.service";
import { SWManager } from "@app/services/sWManager.service";
import { Post } from "@app/interfaces/post.interface";
import { SinglePost } from "@app/components/post/post.component";
import { Loader } from "@app/components/loader/loader.component";
import { routes } from "@app/app.routes";

describe("FullList", () => {
  let pageOnePosts: Post[];
  const MockSinglePost = MockComponent(SinglePost);
  const MockLoader = MockComponent(Loader);
  const MockAPIClient = MockProvider(ApiClientService);

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        CommonModule,
        MockSinglePost,
        RouterLink,
        MockLoader,
        FullList,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        MockAPIClient,
      ],
    }).compileComponents();

    pageOnePosts = [
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
      posts: pageOnePosts,
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
    expect(addItemsSpy).toHaveBeenCalledWith("posts", pageOnePosts, "date");
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
      new Promise((resolve) => resolve({ posts: pageOnePosts, pages: 2 })),
    );
    const updateInterfaceSpy = spyOn(FullList.prototype, "updateInterface");

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    fullList.fetchPostsFromIdb().subscribe((_data) => {
      expect(idbSpy).toHaveBeenCalledWith("date", 5, undefined, 1, true);
      expect(updateInterfaceSpy).toHaveBeenCalledWith({
        posts: pageOnePosts,
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
      new Promise((resolve) => resolve({ posts: pageOnePosts, pages: 2 })),
    );
    const updateInterfaceSpy = spyOn(FullList.prototype, "updateInterface");

    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    fullList.fetchPostsFromIdb().subscribe((_data) => {
      expect(idbSpy).toHaveBeenCalledWith("hugs", 5, undefined, 1, false);
      expect(updateInterfaceSpy).toHaveBeenCalledWith({
        posts: pageOnePosts,
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

    fullList.updateInterface({ posts: pageOnePosts, total_pages: 4, success: true });
    fixture.detectChanges();

    expect(totalPagesSpy).toHaveBeenCalledWith(4);
    expect(postsSpy).toHaveBeenCalledWith(pageOnePosts);
    expect(isLoadingSpy).toHaveBeenCalledWith(false);

    const suggestedPosts = fullListDOM.querySelectorAll("app-single-post");
    expect(suggestedPosts.length).toBe(2);

    const firstPost = fixture.debugElement.query(By.css("app-single-post"))
      .componentInstance as SinglePost;
    expect(firstPost.post?.text).toEqual("test");

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

  it("should remove a deleted post", () => {
    spyOn(FullList.prototype, "fetchPosts");
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.snapshot.url = [{ path: "Suggested" }] as UrlSegment[];
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    fullList.posts.set(pageOnePosts);
    const removeSpy = spyOn(fullList, "removeDeletedPost").and.callThrough();
    fixture.detectChanges();

    const singlePost = fixture.debugElement.query(By.css("app-single-post"))
      .componentInstance as SinglePost;
    singlePost.deletedId.emit(2);
    fixture.detectChanges();

    expect(removeSpy).toHaveBeenCalledWith(2);
    expect(fullList.posts().length).toBe(1);
    expect(fullList.posts()[0].id).not.toBe(2);
  });
});
