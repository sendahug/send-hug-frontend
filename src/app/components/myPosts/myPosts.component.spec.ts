/*
	My Posts
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
import { provideRouter } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import { Component, signal } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockProvider } from "ng-mocks";

import { MyPostsComponent } from "./myPosts.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { type PostGet } from "@app/interfaces/post.interface";
import { PostComponent } from "@common/post/post.component";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { ApiClientService } from "@app/services/apiClient.service";
import { SWManager } from "@app/services/sWManager.service";
import { MockItemDeleteFormComponent } from "@tests/mockForms";

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
  standalone: true,
  imports: [MyPostsComponent],
})
class MockUserPageComponent {
  userId: number;

  constructor() {
    this.userId = 1;
  }
}

// Sub-component testing
// ==================================================
describe("MyPostsComponent", () => {
  let mockPosts: PostGet[];

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
    });
    const MockAPIClient = MockProvider(ApiClientService);
    const MockSWManager = MockProvider(SWManager, {
      fetchPosts: () => new Promise(() => {}),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MockItemDeleteFormComponent,
        PostComponent,
        MyPostsComponent,
        MockUserPageComponent,
      ],
      declarations: [],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideRouter([]),
        MockAuthService,
        MockAPIClient,
        MockSWManager,
      ],
    }).compileComponents();

    mockPosts = [
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
  });

  // Check that the component is created
  it("should create the component", async () => {
    const upFixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = upFixture.componentInstance;
    await upFixture.whenStable();
    const myPosts: MyPostsComponent =
      upFixture.debugElement.children[0].children[0].componentInstance;

    expect(userPage).toBeTruthy();
    expect(myPosts).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it("should have all popup variables set to false", async () => {
    const upFixture = TestBed.createComponent(MockUserPageComponent);
    await upFixture.whenStable();
    const myPosts: MyPostsComponent =
      upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.deleteMode()).toBeFalse();
  });

  // Check that the component gets the user ID correctly
  it("should get the correct user ID", async () => {
    const upFixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    await upFixture.whenStable();
    const myPosts: MyPostsComponent =
      upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.userID).toBe(1);
    expect(myPosts.user()).toBe("other");
  });

  it("should fetch posts on init", async () => {
    const upFixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    await upFixture.whenStable();
    const myPosts: MyPostsComponent =
      upFixture.debugElement.children[0].children[0].componentInstance;
    const fetchSpy = spyOn(myPosts, "fetchPosts");

    myPosts.ngOnInit();

    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should set the user ID to the logged in user's ID if no ID is provided", async () => {
    const fixture = TestBed.createComponent(MyPostsComponent);
    const myPosts = fixture.componentInstance;
    await fixture.whenStable();
    const authService = TestBed.inject(AuthService);

    expect(myPosts.userID).toBe(authService.userData()!.id as number);
    expect(myPosts.user()).toBe("self");
  });

  it("should fetch posts from the server", async () => {
    const upFixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    await upFixture.whenStable();
    const myPosts: MyPostsComponent =
      upFixture.debugElement.children[0].children[0].componentInstance;
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
    expect(idbSpy).toHaveBeenCalledWith();
    expect(apiClientSpy).toHaveBeenCalledWith("users/1/posts", { page: 1 });
    expect(swSpy).toHaveBeenCalledWith("posts", mockPosts, "date");
    expect(myPosts.totalPages()).toEqual(2);
    expect(myPosts.posts()).toEqual(mockPosts);
  });

  it("should fetch posts from IDB", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    upFixture.detectChanges();
    const myPosts: MyPostsComponent =
      upFixture.debugElement.children[0].children[0].componentInstance;
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
      expect(myPosts.isLoading()).toBeTrue();
      expect(myPosts.isIdbFetchLoading()).toBeFalse();
      expect(data.page).toEqual(1);
      expect(data.posts).toEqual(mockPosts);
      expect(data.total_pages).toEqual(2);
      expect(data.success).toBeTrue();
      done();
    });
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false - post delete", async () => {
    // create the component
    const fixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    await fixture.whenStable();

    const myPosts: MyPostsComponent =
      fixture.debugElement.children[0].children[0].componentInstance;
    const changeSpy = spyOn(myPosts, "changeMode").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isIdbFetchLoading.set(false);

    // start the popup
    myPosts.deleteMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.children[0].children[0].query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.editMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false);
    expect(myPosts.deleteMode()).toBeFalse();
  });

  // Check that the popup is opened when clicking 'delete all'
  it("should open the popup upon deleting all", async () => {
    const fixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    await fixture.whenStable();

    const myPosts: MyPostsComponent =
      fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const deleteSpy = spyOn(myPosts, "deleteAllPosts").and.callThrough();
    myPosts.posts.set(mockPosts);
    myPosts.isIdbFetchLoading.set(false);
    await fixture.whenStable();

    // before the click
    expect(myPosts.deleteMode()).toBeFalse();
    expect(deleteSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelector("#deleteAll").click();
    await fixture.whenStable();

    // after the click
    expect(myPosts.deleteMode()).toBeTrue();
    expect(myPosts.deleteEndpoint()).toEqual(`users/${userPage.userId}/posts`);
    expect(myPosts.itemType).toEqual("Post");
    expect(myPostsDOM.querySelector("item-delete-form")).toBeTruthy();
  });

  it("continues to the next page", async () => {
    const fixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = fixture.componentInstance;
    userPage.userId = 1;
    await fixture.whenStable();

    const myPosts: MyPostsComponent =
      fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const nextPageSpy = spyOn(myPosts, "nextPage").and.callThrough();
    const fetchSpy = spyOn(myPosts, "fetchPosts");
    myPosts.posts.set(mockPosts);
    myPosts.isIdbFetchLoading.set(false);
    myPosts.totalPages.set(2);
    await fixture.whenStable();

    // change the page
    myPostsDOM.querySelectorAll(".nextButton")[0].click();

    expect(nextPageSpy).toHaveBeenCalledWith();
    expect(fetchSpy).toHaveBeenCalledWith();
    expect(myPosts.currentPage()).toEqual(2);
  });

  it("goes back to the previous page", async () => {
    const fixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = fixture.componentInstance;
    userPage.userId = 1;
    await fixture.whenStable();

    const myPosts: MyPostsComponent =
      fixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const prevPageSpy = spyOn(myPosts, "prevPage").and.callThrough();
    const fetchSpy = spyOn(myPosts, "fetchPosts");
    myPosts.posts.set(mockPosts);
    myPosts.isIdbFetchLoading.set(false);
    myPosts.totalPages.set(2);
    myPosts.currentPage.set(2);
    await fixture.whenStable();

    // change the page
    myPostsDOM.querySelectorAll(".prevButton")[0].click();

    expect(prevPageSpy).toHaveBeenCalledWith();
    expect(fetchSpy).toHaveBeenCalledWith();
    expect(myPosts.currentPage()).toEqual(1);
  });

  it("should remove a deleted post", async () => {
    // create the component
    const fixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    await fixture.whenStable();

    const myPosts: MyPostsComponent =
      fixture.debugElement.children[0].children[0].componentInstance;
    spyOn(myPosts, "fetchPosts");
    myPosts.posts.set(mockPosts);
    myPosts.isIdbFetchLoading.set(false);
    const removeSpy = spyOn(myPosts, "removeDeletedPost").and.callThrough();
    await fixture.whenStable();

    const singlePost = fixture.debugElement.query(By.css("app-single-post"))
      .componentInstance as PostComponent;
    singlePost.deletedId.emit(2);
    await fixture.whenStable();

    expect(removeSpy).toHaveBeenCalledWith(2);
    expect(myPosts.posts().length).toBe(1);
    expect(myPosts.posts()[0].id).not.toBe(2);
  });

  it("should delete all posts", async () => {
    // create the component
    const fixture = TestBed.createComponent(MockUserPageComponent);
    const userPage = fixture.componentInstance;
    userPage.userId = 4;
    await fixture.whenStable();

    const myPosts: MyPostsComponent =
      fixture.debugElement.children[0].children[0].componentInstance;
    spyOn(myPosts, "fetchPosts");
    myPosts.posts.set(mockPosts);
    myPosts.isIdbFetchLoading.set(false);
    const updateListSpy = spyOn(myPosts, "updatePostsList").and.callThrough();

    // start the popup
    myPosts.deleteMode.set(true);
    await fixture.whenStable();

    const singlePost = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    singlePost.deleted.emit(4);
    await fixture.whenStable();

    expect(updateListSpy).toHaveBeenCalledWith();
    expect(myPosts.posts().length).toBe(0);
  });
});
