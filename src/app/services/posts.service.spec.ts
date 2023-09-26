/*
	Posts Service
	Send a Hug Service Tests
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
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";

import { PostsService } from "./posts.service";
import { AuthService } from "./auth.service";
import { MockAuthService } from "./auth.service.mock";
import { AlertsService } from "./alerts.service";
import { MockAlertsService } from "./alerts.service.mock";
import { SWManager } from "./sWManager.service";
import { MockSWManager } from "./sWManager.service.mock";

describe("PostsService", () => {
  let httpController: HttpTestingController;
  let postsService: PostsService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostsService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService },
        { provide: SWManager, useClass: MockSWManager },
      ],
    }).compileComponents();

    postsService = TestBed.inject(PostsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  // Check the service is created
  it("should be created", () => {
    expect(postsService).toBeTruthy();
  });

  // Check the service gets the main page items
  it("getPosts() - should get home page items", () => {
    // mock response
    const mockResponse = {
      success: true,
      recent: [
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
      ],
      suggested: [
        {
          date: new Date("2020-06-28 19:17:31.072"),
          givenHugs: 0,
          id: 2,
          text: "test2",
          userId: 1,
          user: "test",
          sentHugs: [],
        },
        {
          date: new Date("2020-06-27 19:17:31.072"),
          givenHugs: 0,
          id: 1,
          text: "test",
          userId: 1,
          user: "test",
          sentHugs: [],
        },
      ],
    };

    const querySpy = spyOn(postsService["serviceWorkerM"], "queryPosts");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    const cleanSpy = spyOn(postsService["serviceWorkerM"], "cleanDB");
    postsService.getPosts("", "new", 1);
    // wait for the fetch to be resolved
    postsService.isFetchResolved.newItems.subscribe((value) => {
      if (value) {
        expect(postsService.posts.newItems.value.length).toBe(2);
        expect(postsService.posts.newItems.value[0].id).toBe(1);
      }
    });
    postsService.isFetchResolved.suggestedItems.subscribe((value) => {
      if (value) {
        expect(postsService.posts.suggestedItems.value.length).toBe(2);
        expect(postsService.posts.suggestedItems.value[0].id).toBe(2);
      }
    });

    const req = httpController.expectOne(`${postsService.serverUrl}`);
    expect(req.request.method).toEqual("GET");
    req.flush(mockResponse);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(4);
    expect(cleanSpy).toHaveBeenCalled();
    expect(cleanSpy).toHaveBeenCalledWith("posts");
  });

  // Check the service gets the full new items
  it("getPosts() - should get new items", () => {
    // mock page 1 response
    const mockP1Response = {
      success: true,
      total_pages: 2,
      posts: [
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
      ],
    };

    const querySpy = spyOn(postsService["serviceWorkerM"], "queryPosts");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    const cleanSpy = spyOn(postsService["serviceWorkerM"], "cleanDB");
    // fetch page 1
    postsService.getPosts("/posts/new", "new", 1);
    // wait for the fetch to be resolved
    postsService.isFetchResolved.newItems.subscribe((value) => {
      if (value) {
        expect(postsService.currentPage).toBe(1);
        expect(postsService.totalPages).toBe(2);
        expect(postsService.posts.newItems.value.length).toBe(2);
        expect(postsService.posts.newItems.value[0].id).toBe(1);
      }
    });

    const p1Req = httpController.expectOne(`${postsService.serverUrl}/posts/new?page=1`);
    expect(p1Req.request.method).toEqual("GET");
    p1Req.flush(mockP1Response);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith("new posts", undefined, 1);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
    expect(cleanSpy).toHaveBeenCalledWith("posts");
  });

  // Check the service gets the full new items page 2
  it("getPosts() - should get new items page 2", () => {
    // mock page 2 response
    const mockP2Response = {
      success: true,
      total_pages: 2,
      posts: [
        {
          date: new Date("2020-06-27 19:17:31.072"),
          givenHugs: 0,
          id: 3,
          text: "test",
          userId: 1,
          user: "test",
          sentHugs: [],
        },
      ],
    };

    const querySpy = spyOn(postsService["serviceWorkerM"], "queryPosts");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    const cleanSpy = spyOn(postsService["serviceWorkerM"], "cleanDB");
    // fetch page 2
    postsService.getPosts("/posts/new", "new", 2);
    // wait for the fetch to be resolved
    postsService.isFetchResolved.newItems.subscribe((value) => {
      if (value) {
        expect(postsService.currentPage).toBe(2);
        expect(postsService.totalPages).toBe(2);
        expect(postsService.posts.newItems.value.length).toBe(1);
        expect(postsService.posts.newItems.value[0].id).toBe(3);
      }
    });

    const p2Req = httpController.expectOne(`${postsService.serverUrl}/posts/new?page=2`);
    expect(p2Req.request.method).toEqual("GET");
    p2Req.flush(mockP2Response);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith("new posts", undefined, 2);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(cleanSpy).toHaveBeenCalled();
    expect(cleanSpy).toHaveBeenCalledWith("posts");
  });

  // Check the service gets the full suggested items
  it("getPosts() - should get suggested items", () => {
    // mock page 1 response
    const mockP1Response = {
      success: true,
      total_pages: 2,
      posts: [
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
      ],
    };

    const querySpy = spyOn(postsService["serviceWorkerM"], "queryPosts");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    const cleanSpy = spyOn(postsService["serviceWorkerM"], "cleanDB");
    // fetch page 1
    postsService.getPosts("/posts/suggested", "suggested", 1);
    // wait for the fetch to be resolved
    postsService.isFetchResolved.suggestedItems.subscribe((value) => {
      if (value) {
        expect(postsService.currentPage).toBe(1);
        expect(postsService.totalPages).toBe(2);
        expect(postsService.posts.suggestedItems.value.length).toBe(2);
        expect(postsService.posts.suggestedItems.value[0].id).toBe(1);
      }
    });

    const p1Req = httpController.expectOne(`${postsService.serverUrl}/posts/suggested?page=1`);
    expect(p1Req.request.method).toEqual("GET");
    p1Req.flush(mockP1Response);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith("suggested posts", undefined, 1);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
    expect(cleanSpy).toHaveBeenCalledWith("posts");
  });

  // Check the service gets the full suggested items page 2
  it("getPosts() - should get suggested items page 2", () => {
    // mock page 2 response
    const mockP2Response = {
      success: true,
      total_pages: 2,
      posts: [
        {
          date: new Date("2020-06-27 19:17:31.072"),
          givenHugs: 0,
          id: 3,
          text: "test",
          userId: 1,
          user: "test",
          sentHugs: [],
        },
      ],
    };

    const querySpy = spyOn(postsService["serviceWorkerM"], "queryPosts");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    const cleanSpy = spyOn(postsService["serviceWorkerM"], "cleanDB");
    // fetch page 2
    postsService.getPosts("/posts/suggested", "suggested", 2);
    // wait for the fetch to be resolved
    postsService.isFetchResolved.suggestedItems.subscribe((value) => {
      if (value) {
        expect(postsService.currentPage).toBe(2);
        expect(postsService.totalPages).toBe(2);
        expect(postsService.posts.suggestedItems.value.length).toBe(1);
        expect(postsService.posts.suggestedItems.value[0].id).toBe(3);
      }
    });

    const p2Req = httpController.expectOne(`${postsService.serverUrl}/posts/suggested?page=2`);
    expect(p2Req.request.method).toEqual("GET");
    p2Req.flush(mockP2Response);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith("suggested posts", undefined, 2);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(cleanSpy).toHaveBeenCalled();
    expect(cleanSpy).toHaveBeenCalledWith("posts");
  });

  // Check the service creates a new post
  it("sendPost() - should send a post", () => {
    // mock response
    const mockResponse = {
      posts: {
        date: "Wed Jun 10 2020 10:30:05 GMT+0300",
        givenHugs: 0,
        id: 10,
        text: "test curl",
        userId: 4,
        user: "user",
        sendHugs: [],
      },
      success: true,
    };

    const newPost = {
      userId: 4,
      user: "name",
      text: "text",
      date: new Date(),
      givenHugs: 0,
    };
    const spy = spyOn(postsService["alertsService"], "createSuccessAlert");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    postsService["authService"].login();
    postsService.sendPost(newPost);

    const req = httpController.expectOne(`${postsService.serverUrl}/posts`);
    expect(req.request.method).toEqual("POST");
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      "Your post was published! Return to home page to view the post.",
      false,
      "/",
    );
    expect(addSpy).toHaveBeenCalled();
  });

  // Check the service prevents blocked users from sending posts
  it("sendPost() - should prevent blocked users from sending posts", () => {
    const newPost = {
      userId: 4,
      user: "name",
      text: "text",
      date: new Date(),
      givenHugs: 0,
    };
    const spy = spyOn(postsService["alertsService"], "createAlert");
    const addSpy = spyOn(postsService["serviceWorkerM"], "addItem");
    postsService["authService"].login();
    postsService["authService"].userData.blocked = true;
    postsService["authService"].userData.releaseDate = new Date(new Date().getTime() + 864e5 * 1);
    postsService.sendPost(newPost);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      type: "Error",
      message: `You cannot post new posts while you're blocked. You're blocked until ${postsService["authService"].userData.releaseDate}.`,
    });
    expect(addSpy).not.toHaveBeenCalled();
  });

  // Check the service deletes a post
  it("deletePost() - should delete a post", () => {
    // mock response
    const mockResponse = {
      success: true,
      deleted: 8,
    };

    const spy = spyOn(postsService["alertsService"], "createSuccessAlert");
    const deleteSpy = spyOn(postsService["serviceWorkerM"], "deleteItem");
    postsService.deletePost(8);

    const req = httpController.expectOne(`${postsService.serverUrl}/posts/8`);
    expect(req.request.method).toEqual("DELETE");
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      `Post ${mockResponse.deleted} was deleted. Refresh to view the updated post list.`,
      true,
    );
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith("posts", 8);
  });

  // Check the service deletes all of a user's posts
  it("deleteAllPosts() - should delete all of a user's posts", () => {
    // mock response
    const mockResponse = {
      deleted: 2,
      success: true,
      userID: 4,
    };

    const spy = spyOn(postsService["alertsService"], "createSuccessAlert");
    const deleteSpy = spyOn(postsService["serviceWorkerM"], "deleteItems");
    postsService.deleteAllPosts(4);

    const req = httpController.expectOne(`${postsService.serverUrl}/users/all/4/posts`);
    expect(req.request.method).toEqual("DELETE");
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      `User ${mockResponse.userID}'s posts were deleted successfully. Refresh to view the updated profile.`,
      true,
    );
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith("posts", "userId", 4);
  });

  // Check the service edits a post
  it("editPost() - should edit a post", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        date: "Mon, 08 Jun 2020 14:43:15 GMT",
        givenHugs: 0,
        id: 15,
        text: "test curl",
        userId: 4,
        user: "name",
      },
    };

    const newPost = {
      date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
      givenHugs: 0,
      id: 15,
      text: "test curl",
      userId: 4,
      user: "name",
    };
    const spy = spyOn(postsService["alertsService"], "createSuccessAlert");
    postsService.editPost(newPost);
    // wait for the edit to be resolved
    postsService.isUpdated.subscribe((value) => {
      if (value) {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(
          "Your post was edited. Refresh to view the updated post.",
          true,
        );
      }
    });

    const req = httpController.expectOne(`${postsService.serverUrl}/posts/15`);
    expect(req.request.method).toEqual("PATCH");
    req.flush(mockResponse);
  });

  // Check the service sends a hug
  it("sendHug() - should send a hug", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        date: "Mon, 08 Jun 2020 14:43:15 GMT",
        givenHugs: 1,
        id: 15,
        text: "test curl",
        userId: 4,
        user: "name",
      },
    };

    const newPost = {
      date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
      givenHugs: 0,
      id: 15,
      text: "test curl",
      userId: 4,
      user: "name",
    };
    const alertSpy = spyOn(postsService["alertsService"], "createSuccessAlert");
    const disableSpy = spyOn(postsService, "disableHugButton");
    postsService.sendHug(newPost);

    const req = httpController.expectOne(`${postsService.serverUrl}/posts/15/hugs`);
    expect(req.request.method).toEqual("POST");
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("Your hug was sent!", false);
    expect(disableSpy).toHaveBeenCalled();
    expect(disableSpy).toHaveBeenCalledTimes(2);
  });
});
