/*
	My Posts
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
import { RouterModule } from "@angular/router";
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
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { MyPosts } from "./myPosts.component";
import { PopUp } from "../popUp/popUp.component";
import { Loader } from "../loader/loader.component";
import { HeaderMessage } from "../headerMessage/headerMessage.component";
import { AuthService } from "../../services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { MockReportForm, MockDeleteForm, MockEditForm } from "@tests/mockForms";

const mockPosts = [
  {
    date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
    givenHugs: 1,
    id: 1,
    sentHugs: [],
    text: "test",
    userId: 1,
    user: "shirb",
  },
  {
    date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
    givenHugs: 1,
    id: 2,
    sentHugs: [],
    text: "test",
    userId: 1,
    user: "shirb",
  },
];

// Mock User Page for testing the sub-component
// ==================================================
@Component({
  selector: "app-user-mock",
  template: `
    <!-- If the user is logged in, displays a user page. -->
    <div id="profileContainer">
      <app-my-posts [userID]="userId"></app-my-posts>
    </div>
  `,
})
class MockUserPage {
  waitFor = "user";
  userId: number | undefined;

  constructor(public authService: AuthService) {
    this.userId = 1;
  }
}

// Sub-component testing
// ==================================================
describe("MyPosts", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [
        MockUserPage,
        MyPosts,
        PopUp,
        Loader,
        HeaderMessage,
        MockDeleteForm,
        MockEditForm,
        MockReportForm,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData = { ...mockAuthedUser };
  });

  // Check that the component is created
  it("should create the component", () => {
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    expect(userPage).toBeTruthy();
    expect(myPosts).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it("should have all popup variables set to false", () => {
    const upFixture = TestBed.createComponent(MockUserPage);
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.deleteMode).toBeFalse();
    expect(myPosts.reportMode).toBeFalse();
  });

  // Check that the component gets the user ID correctly
  it("should get the correct user ID", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.userID).toBe(1);
    expect(myPosts.user()).toBe("other");
    done();
  });

  it("should fetch posts on init", () => {
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const fetchSpy = spyOn(myPosts, "fetchPosts");

    myPosts.ngOnInit();

    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should set the user ID to the logged in user's ID if no ID is provided", () => {
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    userPage.userId = undefined;
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.userID).toBe(userPage.authService.userData.id as number);
    expect(myPosts.user()).toBe("self");
  });

  it("should fetch posts from the server", () => {
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const idbSpy = spyOn(myPosts, "fetchPostsFromIdb").and.returnValue(
      of({ page: 1, posts: [], total_pages: 1, success: true }),
    );
    const apiClientSpy = spyOn(myPosts["apiClient"], "get").and.returnValue(
      of({ page: 1, posts: mockPosts, total_pages: 2, success: true }),
    );
    const swSpy = spyOn(myPosts["swManager"], "addFetchedItems");

    // before
    expect(myPosts.totalPages()).toEqual(1);
    expect(myPosts.posts.length).toEqual(0);

    myPosts.fetchPosts();

    // after
    expect(idbSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalledWith("users/all/1/posts", { page: 1 });
    expect(swSpy).toHaveBeenCalledWith("posts", mockPosts, "date");
    expect(myPosts.totalPages()).toEqual(2);
    expect(myPosts.posts()).toEqual(mockPosts);
  });

  it("should fetch posts from IDB", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    upFixture.detectChanges();
    const myPosts: MyPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const swSpy = spyOn(myPosts["swManager"], "fetchPosts").and.returnValue(
      new Promise((resolve) => {
        resolve({ posts: mockPosts, pages: 2 });
      }),
    );

    // before
    expect(myPosts.totalPages()).toEqual(1);
    expect(myPosts.posts.length).toEqual(0);

    myPosts.fetchPostsFromIdb().subscribe((data) => {
      // after
      expect(swSpy).toHaveBeenCalledWith("user", 5, 1, 1, false);
      expect(myPosts.totalPages()).toEqual(2);
      expect(myPosts.posts()).toEqual(mockPosts);
      expect(myPosts.isLoading()).toBeFalse();
      expect(data.page).toEqual(1);
      expect(data.posts).toEqual(mockPosts);
      expect(data.total_pages).toEqual(2);
      expect(data.success).toBeTrue();
      done();
    });
  });

  // Check that the popup is opened when clicking 'edit'
  it("should open the popup upon editing", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const editSpy = spyOn(myPosts, "editPost").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    fixture.detectChanges();

    // before the click
    expect(myPosts.user()).toBe("self");
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.userID).toBe(4);
    expect(editSpy).not.toHaveBeenCalled();

    fixture.detectChanges();

    expect(myPosts.posts().length).toBe(2);
    expect(myPostsDOM.querySelectorAll(".userPost").length).toEqual(2);

    // trigger click
    myPostsDOM.querySelectorAll(".editButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.editType).toBe("post");
    expect(myPosts.postToEdit).toBe(mockPosts[0]);
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false - post delete", (done: DoneFn) => {
    // create the component
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const changeSpy = spyOn(myPosts, "changeMode").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    myPosts.lastFocusedElement = document.querySelectorAll("a")[0];
    myPosts.deleteMode = true;
    myPosts.toDelete = "Post";
    myPosts.itemToDelete = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.children[0].children[0].query(By.css("item-delete-form"))
      .componentInstance as MockDeleteForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(myPosts.deleteMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  it("should change mode when the event emitter emits false - post report", (done: DoneFn) => {
    // create the component
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const changeSpy = spyOn(myPosts, "changeMode").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    myPosts.lastFocusedElement = document.querySelectorAll("a")[0];
    myPosts.reportMode = true;
    myPosts.reportType = "Post";
    myPosts.reportedItem = mockPosts[0];
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.children[0].children[0].query(By.css("report-form"))
      .componentInstance as MockReportForm;
    popup.reportMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(myPosts.reportMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  it("should change mode when the event emitter emits false - post edit", (done: DoneFn) => {
    // create the component
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const changeSpy = spyOn(myPosts, "changeMode").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    myPosts.lastFocusedElement = document.querySelectorAll("a")[0];
    myPosts.editMode = true;
    myPosts.editType = "post";
    myPosts.postToEdit = mockPosts[0];
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.children[0].children[0].query(By.css("post-edit-form"))
      .componentInstance as MockEditForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(myPosts.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  // Check that the popup is opened when clicking 'delete'
  it("should open the popup upon deleting", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const deleteSpy = spyOn(myPosts, "deletePost").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    fixture.detectChanges();

    // before the click
    expect(myPosts.deleteMode).toBeFalse();
    expect(deleteSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelectorAll(".deleteButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(myPosts.deleteMode).toBeTrue();
    expect(myPosts.toDelete).toBe("Post");
    expect(myPosts.itemToDelete).toBe(1);
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that the popup is opened when clicking 'delete all'
  it("should open the popup upon deleting all", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const deleteSpy = spyOn(myPosts, "deleteAllPosts").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    fixture.detectChanges();

    // before the click
    expect(myPosts.deleteMode).toBeFalse();
    expect(deleteSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelector("#deleteAll").click();
    fixture.detectChanges();

    // after the click
    expect(myPosts.deleteMode).toBeTrue();
    expect(myPosts.toDelete).toBe("All posts");
    expect(myPosts.itemToDelete).toBe(4);
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that the popup is opened when clicking 'report'
  it("should open the popup upon reporting", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 1;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const reportSpy = spyOn(myPosts, "reportPost").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);

    fixture.detectChanges();

    // before the click
    expect(myPosts.reportMode).toBeFalse();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(myPosts.reportMode).toBeTrue();
    expect(myPosts.reportType).toBe("Post");
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that sending a hug triggers the posts service
  it("should trigger items service on hug", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 1;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const hugSpy = spyOn(myPosts, "sendHug").and.callThrough();
    const hugServiceSpy = spyOn(myPosts["itemsService"], "sendHug");
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);

    fixture.detectChanges();

    // simulate click
    myPostsDOM.querySelectorAll(".hugButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(hugSpy).toHaveBeenCalledWith(1);
    expect(hugServiceSpy).toHaveBeenCalledWith(mockPosts[0].id);
    done();
  });

  it("continues to the next page", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 1;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const nextPageSpy = spyOn(myPosts, "nextPage").and.callThrough();
    const fetchSpy = spyOn(myPosts, "fetchPosts");
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    myPosts.totalPages.set(2);
    fixture.detectChanges();

    // change the page
    myPostsDOM.querySelectorAll(".nextButton")[0].click();

    expect(nextPageSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
    expect(myPosts.currentPage()).toEqual(2);
    done();
  });

  it("goes back to the previous page", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockUserPage);
    const userPage = fixture.componentInstance;
    userPage.userId = 1;
    fixture.detectChanges();
    const myPosts: MyPosts = fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const prevPageSpy = spyOn(myPosts, "prevPage").and.callThrough();
    const fetchSpy = spyOn(myPosts, "fetchPosts");
    myPosts.posts.set(mockPosts);
    myPosts.isLoading.set(false);
    myPosts.totalPages.set(2);
    myPosts.currentPage.set(2);
    fixture.detectChanges();

    // change the page
    myPostsDOM.querySelectorAll(".prevButton")[0].click();

    expect(prevPageSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
    expect(myPosts.currentPage()).toEqual(1);
    done();
  });
});
