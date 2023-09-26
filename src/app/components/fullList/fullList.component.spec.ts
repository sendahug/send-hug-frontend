/*
	Full List
	Send a Hug Component Tests
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

import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
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
import { By } from "@angular/platform-browser";

import { FullList } from "./fullList.component";
import { PopUp } from "../popUp/popUp.component";
import { SinglePost } from "../post/post.component";
import { PostsService } from "../../services/posts.service";
import { MockPostsService } from "../../services/posts.service.mock";
import { AuthService } from "../../services/auth.service";
import { MockAuthService } from "../../services/auth.service.mock";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { Loader } from "../loader/loader.component";

describe("FullList", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [FullList, PopUp, Loader, SinglePost],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    expect(fullList).toBeTruthy();
  });

  // Check the posts' menu is shown if there's enough room for them
  it("should show the posts's menu if wide enough", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "New" } as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    spyOn(authService, "canUser").and.returnValue(true);
    fixture.detectChanges();

    // change the elements' width to make sure there's enough room for the menu
    let sub = fullListDOM
      .querySelectorAll(".newItem")[0]!
      .querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "";
    sub.style.display = "flex";
    fixture.detectChanges();

    // check all menus are shown
    let posts = fullListDOM.querySelectorAll(".newItem");
    posts.forEach((element: HTMLLIElement) => {
      expect(element.querySelectorAll(".buttonsContainer")[0].classList).not.toContain("float");
      expect(element.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
      expect(element.querySelectorAll(".subMenu")[0].classList).not.toContain("float");
      expect(element.querySelectorAll(".menuButton")[0].classList).toContain("hidden");
    });
    done();
  });

  // check the posts' menu isn't shown if there isn't enough room for it
  it("shouldn't show the posts's menu if not wide enough", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "New" } as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    spyOn(authService, "canUser").and.returnValue(true);
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = fullListDOM
      .querySelectorAll(".newItem")[0]!
      .querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "40px";
    sub.style.display = "flex";
    (sub.firstElementChild! as HTMLAnchorElement).style.width = "100px";
    fixture.detectChanges();

    // check all menus aren't shown
    let posts = fullListDOM.querySelectorAll(".newItem");
    posts.forEach((element: HTMLLIElement) => {
      expect(element.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
      expect(element.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
      expect(element.querySelectorAll(".subMenu")[0].classList).toContain("float");
      expect(element.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    });
    done();
  });

  // check a menu is shown when clickinng the options button
  it("should show the post's menu when clicked", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "New" } as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, "openMenu").and.callThrough();
    spyOn(authService, "canUser").and.returnValue(true);
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = fullListDOM.querySelectorAll(".newItem")[0]!;
    let sub = firstElement.querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "40px";
    sub.style.display = "flex";
    (sub.firstElementChild! as HTMLAnchorElement).style.width = "100px";
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");

    // click the options buton for the first new post
    firstElement.querySelectorAll(".menuButton")[0].click();
    fixture.detectChanges();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith("nPost1");
    expect(fullList.showMenuNum).toBe("nPost1");
    expect(firstElement.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    done();
  });

  // check only the selected menu is shown when clicking a button
  it("should show the correct post's menu when clicked", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "New" } as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, "openMenu").and.callThrough();
    spyOn(authService, "canUser").and.returnValue(true);
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = fullListDOM
      .querySelectorAll(".newItem")[0]!
      .querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "40px";
    sub.style.display = "flex";
    (sub.firstElementChild! as HTMLAnchorElement).style.width = "100px";
    fixture.detectChanges();

    // pre-click check
    const clickElement = fullListDOM.querySelectorAll(".newItem")[1]!;
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(clickElement.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(clickElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");

    // trigger click
    clickElement.querySelectorAll(".menuButton")[0].click();
    fixture.detectChanges();

    // check only the second post's menu is shown
    let posts = fullListDOM.querySelectorAll(".newItem");
    posts.forEach((element: HTMLLIElement) => {
      expect(element.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
      expect(element.querySelectorAll(".subMenu")[0].classList).toContain("float");
      expect(element.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
      // if it's the second element, check the menu isn't hidden
      if (element.firstElementChild!.id == "nPost2") {
        expect(element.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
      }
      // otherwise check it's hidden
      else {
        expect(element.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
      }
    });
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith("nPost2");
    expect(fullList.showMenuNum).toBe("nPost2");
    done();
  });

  // check that clicking the same menu button again hides it
  it("should hide the post's menu when clicked again", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "New" } as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, "openMenu").and.callThrough();
    spyOn(authService, "canUser").and.returnValue(true);
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = fullListDOM.querySelectorAll(".newItem")[0]!;
    let sub = firstElement.querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "40px";
    sub.style.display = "flex";
    (sub.firstElementChild! as HTMLAnchorElement).style.width = "100px";
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");

    // click the options buton for the first new post
    fullListDOM.querySelectorAll(".newItem")[0]!.querySelectorAll(".menuButton")[0].click();
    fixture.detectChanges();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith("nPost1");
    expect(fullList.showMenuNum).toBe("nPost1");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");

    // click the options buton for the first new post again
    fullListDOM.querySelectorAll(".newItem")[0]!.querySelectorAll(".menuButton")[0].click();
    fixture.detectChanges();

    // check the menu is hidden
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith("nPost1");
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    done();
  });

  // check that clicking another menu button also closes the previous one
  // and opens the new one
  it("should hide the previous post's menu when another post's menu button is clicked", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "New" } as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, "openMenu").and.callThrough();
    spyOn(authService, "canUser").and.returnValue(true);
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = fullListDOM.querySelectorAll(".newItem")[0]!;
    let sub = firstElement.querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "40px";
    sub.style.display = "flex";
    (sub.firstElementChild! as HTMLAnchorElement).style.width = "100px";
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    expect(
      fullListDOM.querySelectorAll(".newItem")[1]!.querySelectorAll(".subMenu")[0].classList,
    ).toContain("hidden");

    // click the options buton for the first new post
    fullListDOM.querySelectorAll(".newItem")[0]!.querySelectorAll(".menuButton")[0].click();
    fixture.detectChanges();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith("nPost1");
    expect(fullList.showMenuNum).toBe("nPost1");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(firstElement.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    expect(
      fullListDOM.querySelectorAll(".newItem")[1]!.querySelectorAll(".subMenu")[0].classList,
    ).toContain("hidden");

    // click the options button for another post
    fullListDOM.querySelectorAll(".newItem")[1]!.querySelectorAll(".menuButton")[0].click();
    fixture.detectChanges();

    // check the first post's menu is hidden and the new post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith("nPost2");
    expect(firstElement.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(
      fullListDOM.querySelectorAll(".newItem")[1]!.querySelectorAll(".subMenu")[0].classList,
    ).not.toContain("hidden");
    done();
  });

  // FULL NEW LIST
  // ==================================================================
  describe("Full New List", () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register("sw.js", { enabled: false }),
          FontAwesomeModule,
        ],
        declarations: [FullList, PopUp, Loader, SinglePost],
        providers: [
          { provide: APP_BASE_HREF, useValue: "/" },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
        ],
      }).compileComponents();
    });

    // Check that the type parameter has an affect on the page
    it("has a type determined by the type parameter - new", (done: DoneFn) => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{ path: "New" } as UrlSegment]);
      const postsService = TestBed.inject(PostsService);
      const postsSpy = spyOn(postsService, "getPosts").and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;

      fixture.detectChanges();

      expect(fullList.waitFor).toBe("new posts");
      expect(postsSpy).toHaveBeenCalledWith("/posts/new", "new", 1);
      expect(postsService.posts.newItems.value).toBeTruthy();
      expect(postsService.posts.newItems.value.length).toBe(2);
      done();
    });

    // Check that a different page gets different results
    it("changes page when clicked", (done: DoneFn) => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{ path: "New" } as UrlSegment]);
      const pageSpy = spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue("1");
      const newPostsSpy = spyOn(TestBed.inject(PostsService), "getPosts").and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;
      const fullListDOM = fixture.nativeElement;
      fixture.detectChanges();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector("#fullItems").children.length).toBe(2);
      expect(newPostsSpy).toHaveBeenCalled();
      expect(newPostsSpy).toHaveBeenCalledTimes(1);

      // change the page
      fullListDOM.querySelectorAll(".nextButton")[0].click();
      fixture.detectChanges();

      // expectations for page 2
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(2);
      expect(fullListDOM.querySelector("#fullItems").children.length).toBe(1);
      expect(newPostsSpy).toHaveBeenCalledTimes(2);

      // change the page again
      fullListDOM.querySelectorAll(".prevButton")[0].click();
      fixture.detectChanges();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector("#fullItems").children.length).toBe(2);
      expect(newPostsSpy).toHaveBeenCalledTimes(3);
      done();
    });
  });

  // FULL SUGGESTED LIST
  // ==================================================================
  describe("Full Suggested List", () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register("sw.js", { enabled: false }),
          FontAwesomeModule,
        ],
        declarations: [FullList, PopUp, Loader, SinglePost],
        providers: [
          { provide: APP_BASE_HREF, useValue: "/" },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
        ],
      }).compileComponents();
    });

    // Check that the type parameter has an affect on the page
    it("has a type determined by the type parameter - suggested", (done: DoneFn) => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{ path: "Suggested" } as UrlSegment]);
      const postsService = TestBed.inject(PostsService);
      const postsSpy = spyOn(postsService, "getPosts").and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;

      fixture.detectChanges();

      expect(fullList.waitFor).toBe("suggested posts");
      expect(postsSpy).toHaveBeenCalledWith("/posts/suggested", "suggested", 1);
      expect(postsService.posts.newItems.value).toBeTruthy();
      expect(postsService.posts.suggestedItems.value.length).toBe(2);
      done();
    });

    // Check that a different page gets different results
    it("changes page when clicked", (done: DoneFn) => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{ path: "Suggested" } as UrlSegment]);
      const pageSpy = spyOn(paramMap.snapshot.queryParamMap, "get").and.returnValue("1");
      const sugPostsSpy = spyOn(TestBed.inject(PostsService), "getPosts").and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;
      const fullListDOM = fixture.nativeElement;
      fixture.detectChanges();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector("#fullItems").children.length).toBe(2);
      expect(sugPostsSpy).toHaveBeenCalled();
      expect(sugPostsSpy).toHaveBeenCalledTimes(1);

      // change the page
      fullListDOM.querySelectorAll(".nextButton")[0].click();
      fixture.detectChanges();

      // expectations for page 2
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(2);
      expect(fullListDOM.querySelector("#fullItems").children.length).toBe(1);
      expect(sugPostsSpy).toHaveBeenCalledTimes(2);

      // change the page
      fullListDOM.querySelectorAll(".prevButton")[0].click();
      fixture.detectChanges();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector("#fullItems").children.length).toBe(2);
      expect(sugPostsSpy).toHaveBeenCalledTimes(3);
      done();
    });
  });
});
