/*
	Post
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
import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { SinglePost } from "./post.component";
import { PopUp } from "../popUp/popUp.component";
import { mockAuthedUser } from "@tests/mockData";

// Mock User Page for testing the sub-component
// ==================================================
@Component({
  selector: "app-page-mock",
  template: `
    <app-single-post [post]="mockPost" [type]="'n'" [containerClass]="'newItem'"></app-single-post>
  `,
})
class MockPage {
  showMenuNum: string | null = null;
  // loader sub-component variables
  waitFor = "main page";
  mockPost = {
    date: new Date("2020-06-27 19:17:31.072"),
    givenHugs: 0,
    id: 1,
    text: "test",
    userId: 1,
    user: "test",
    sentHugs: [],
  };

  constructor() {}
}

// Sub-component testing
// ==================================================
describe("Post", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [MockPage, SinglePost, PopUp],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that all the popup-related variables are set to false at first
  it("should have all popup variables set to false", () => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeFalse();
  });

  // Check that sending a hug triggers the items service
  it("should trigger items service on hug", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const hugSpy = spyOn(myPosts, "sendHug").and.callThrough();
    const spy = spyOn(myPosts.itemsService, "sendHug");
    const authService = myPosts.authService;
    authService.authenticated = true;
    authService.userData = { ...mockAuthedUser };

    upFixture.detectChanges();

    //  before the click
    expect(hugSpy).not.toHaveBeenCalled();
    upFixture.detectChanges();

    // simulate click
    myPostsDOM.querySelectorAll(".hugButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
    expect(hugSpy).toHaveBeenCalled();
    done();
  });

  // Check that the popup is opened when clicking 'edit'
  it("should open the popup upon editing", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const authService = myPosts.authService;
    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    upFixture.detectChanges();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    pageDOM.querySelectorAll(".editButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.editType).toBe("post");
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that the popup is opened when clicking 'delete'
  it("should open the popup upon deleting", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const authService = myPosts.authService;
    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    upFixture.detectChanges();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    pageDOM.querySelectorAll(".deleteButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.delete).toBeTrue();
    expect(myPosts.toDelete).toBe("Post");
    expect(myPosts.itemToDelete).toBe(1);
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that the popup is opened when clicking 'report'
  it("should open the popup upon reporting", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const authService = myPosts.authService;
    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    const reportSpy = spyOn(myPosts, "reportPost").and.callThrough();
    upFixture.detectChanges();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.postToEdit).toBeUndefined();
    expect(myPosts.editType).toBeUndefined();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeFalse();
    expect(myPosts.reportType).toBeUndefined();
    expect(authSpy).toHaveBeenCalled();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    pageDOM.querySelectorAll(".reportButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.postToEdit).toBeUndefined();
    expect(myPosts.editType).toBeUndefined();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeTrue();
    expect(myPosts.reportType).toBe("Post");
    expect(reportSpy).toHaveBeenCalled();
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const changeSpy = spyOn(myPosts, "changeMode").and.callThrough();
    upFixture.detectChanges();

    // start the popup
    myPosts.lastFocusedElement = document.querySelectorAll("a")[0];
    myPosts.editMode = true;
    myPosts.delete = true;
    myPosts.toDelete = "Post";
    myPosts.itemToDelete = 1;
    myPosts.report = false;
    upFixture.detectChanges();

    // exit the popup
    const popup = upFixture.debugElement.query(By.css("app-pop-up")).componentInstance as PopUp;
    popup.exitEdit();
    upFixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(myPosts.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  it("toggleMenu() - should set the currently open menu to the given post's id", () => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    myPosts.itemsService.currentlyOpenMenu.next("nPost3");
    const openMenuSpy = spyOn(myPosts.itemsService.currentlyOpenMenu, "next").and.callThrough();

    // before the change
    expect(myPosts.itemsService.currentlyOpenMenu.value).toBe("nPost3");
    expect(openMenuSpy).not.toHaveBeenCalled();

    // trigger the function
    myPosts.toggleOptions();
    upFixture.detectChanges();

    // after the change
    expect(myPosts.itemsService.currentlyOpenMenu.value).toBe("nPost1");
    expect(openMenuSpy).toHaveBeenCalledWith("nPost1");
  });

  it("toggleMenu() - should set the currently open menu to an emptpy string if the given post's id is already open", () => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    myPosts.itemsService.currentlyOpenMenu.next("nPost1");
    const openMenuSpy = spyOn(myPosts.itemsService.currentlyOpenMenu, "next").and.callThrough();

    // before the call
    expect(myPosts.itemsService.currentlyOpenMenu.value).toBe("nPost1");
    expect(openMenuSpy).not.toHaveBeenCalled();

    // trigger the function
    myPosts.toggleOptions();
    upFixture.detectChanges();

    // after the call
    expect(myPosts.itemsService.currentlyOpenMenu.value).toBe("");
    expect(openMenuSpy).toHaveBeenCalledWith("");
  });

  // check the posts' menu isn't shown if there isn't enough room for it
  it("checkMenuSize() - shouldn't show the posts's menu if not wide enough", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const authService = myPosts.authService;
    spyOn(authService, "canUser").and.returnValue(true);

    // change the elements' width to make sure there isn't enough room for the menu
    const post = myPostsDOM.querySelector(".newItem");
    const container = post.querySelector(".buttonsContainer") as HTMLDivElement;
    container.style.width = "40px";
    upFixture.detectChanges();

    // check all menus aren't shown
    expect(post.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(post.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(post.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(post.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    done();
  });

  // check the posts' menu is shown if there is enough room for it
  it("checkMenuSize() - should show the menu if it's wide enough for it", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const authService = myPosts.authService;
    spyOn(authService, "canUser").and.returnValue(true);

    // change the elements' width to make sure there isn't enough room for the menu
    const post = myPostsDOM.querySelector(".newItem");
    const container = post.querySelector(".buttonsContainer") as HTMLDivElement;
    container.style.width = "400px";
    upFixture.detectChanges();

    // check all menus aren't shown
    expect(post.querySelectorAll(".buttonsContainer")[0].classList).not.toContain("float");
    expect(post.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(post.querySelectorAll(".subMenu")[0].classList).not.toContain("float");
    expect(post.querySelectorAll(".menuButton")[0].classList).toContain("hidden");
    done();
  });

  // check the posts' menu is floating if there isn't enough room for it
  it("checkMenuSize() - should float the menu if it's wide enough for it", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const authService = myPosts.authService;
    spyOn(authService, "canUser").and.returnValue(true);

    // change the elements' width to make sure there isn't enough room for the menu
    const post = myPostsDOM.querySelector(".newItem");
    const container = post.querySelector(".buttonsContainer") as HTMLDivElement;
    container.style.width = "40px";
    upFixture.detectChanges();

    // check all menus aren't shown
    expect(post.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(post.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(post.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(post.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");

    // click the options buton for the post
    post.querySelectorAll(".menuButton")[0].click();
    upFixture.detectChanges();

    // check the menu is floating
    expect(post.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(post.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(post.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(post.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
    done();
  });

  it("should update the post's givenHugs and sentHugs when a hug is sent", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    const itemsService = myPosts.itemsService;
    const disableButtonSpy = spyOn(myPosts, "disableHugButton");
    const authService = myPosts.authService;
    authService.authenticated = true;
    authService.userData = { ...mockAuthedUser };

    // before
    expect(myPosts.post.givenHugs).toBe(0);
    expect(myPosts.post.sentHugs).toEqual([]);

    // trigger the function
    itemsService.receivedAHug.next(1);
    upFixture.detectChanges();

    // after
    expect(myPosts.post.givenHugs).toBe(1);
    expect(myPosts.post.sentHugs).toEqual([4]);
    expect(myPostsDOM.querySelectorAll(".badge")[0].textContent).toBe("1");
    expect(disableButtonSpy).toHaveBeenCalled();
    done();
  });

  it("should disable the hug button", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const myPosts = upFixture.debugElement.children[0].componentInstance;
    myPosts.post = {
      date: new Date("2020-06-27 19:17:31.072"),
      givenHugs: 0,
      id: 1,
      text: "test",
      userId: 1,
      user: "test",
      sentHugs: [],
    };
    myPosts.authService.authenticated = true;
    const myPostsDOM = upFixture.debugElement.children[0].nativeElement;
    upFixture.detectChanges();

    // before
    const hugButton = myPostsDOM.querySelectorAll(".hugButton")[0] as HTMLButtonElement;
    expect(hugButton.disabled).toBeFalse();
    expect(hugButton.classList).not.toContain("active");

    // trigger the function
    myPosts.disableHugButton();
    upFixture.detectChanges();

    // after
    expect(hugButton.disabled).toBeTrue();
    expect(hugButton.classList).toContain("active");
    done();
  });
});
