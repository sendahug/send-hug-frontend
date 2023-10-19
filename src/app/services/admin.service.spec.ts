/*
	Admin Service
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
import { of } from "rxjs";

import { AdminService } from "./admin.service";
import { AuthService } from "./auth.service";
import { mockAuthedUser } from "@tests/mockData";

describe("AdminService", () => {
  let httpController: HttpTestingController;
  let adminService: AdminService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    }).compileComponents();

    adminService = TestBed.inject(AdminService);
    httpController = TestBed.inject(HttpTestingController);

    const authService = TestBed.inject(AuthService);
    authService.authenticated = true;
    authService.userData = { ...mockAuthedUser };
    authService.isUserDataResolved.next(true);
  });

  // Check the service is created
  it("should be created", () => {
    expect(adminService).toBeTruthy();
  });

  // Check the getPage method gets the correct type of data
  it("getPage() - should get the correct type of data for the current page", () => {
    const pageSpy = spyOn(adminService, "getPage").and.callThrough();
    const blocksSpy = spyOn(adminService, "getBlockedUsers");
    const filtersSpy = spyOn(adminService, "getFilters");

    // try the blocked users
    adminService.getPage("blockedUsers");
    expect(pageSpy).toHaveBeenCalledTimes(1);
    expect(blocksSpy).toHaveBeenCalledTimes(1);
    expect(filtersSpy).not.toHaveBeenCalled();

    // try the filters page
    adminService.getPage("filteredPhrases");
    expect(pageSpy).toHaveBeenCalledTimes(2);
    expect(blocksSpy).toHaveBeenCalledTimes(1);
    expect(filtersSpy).toHaveBeenCalledTimes(1);
  });

  // Check that the service edits the post
  it("editPost() - should edit a post", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 2,
        userId: 1,
        text: "edited",
        date: new Date("2020-06-29 19:17:31.072"),
        givenHugs: 1,
        sentHugs: [],
      },
    };

    const post = {
      text: "edited",
      id: 2,
    };
    const spy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));

    adminService.editPost(post, true, 2);

    // wait for the request to be resolved
    adminService.isUpdated.subscribe((value) => {
      if (value) {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith("Post 2 updated.", true);
        expect(patchSpy).toHaveBeenCalledWith(`posts/${post.id}`, post);
      }
    });
  });

  // Check that the service deletes the post
  it("deletePost() - should delete a post", () => {
    // mock response
    const mockResponse = {
      success: true,
      deleted: 10,
    };

    const reportData = {
      reportID: 5,
      userID: 2,
    };
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const dismissSpy = spyOn(adminService, "dismissReport");
    const messageSpy = spyOn(adminService["itemsService"], "sendMessage");
    const deleteSWSpy = spyOn(adminService["serviceWorkerM"], "deleteItem");
    const deleteAPISpy = spyOn(adminService["apiClient"], "delete").and.returnValue(
      of(mockResponse),
    );
    adminService.deletePost(10, reportData, true);

    expect(alertSpy).toHaveBeenCalledWith("Post 10 was successfully deleted.");
    expect(dismissSpy).toHaveBeenCalledWith(5);
    expect(messageSpy).toHaveBeenCalled();
    expect(deleteSWSpy).toHaveBeenCalledWith("posts", 10);
    expect(deleteAPISpy).toHaveBeenCalledWith("posts/10");
  });

  // Check that the service edits a user's display name
  it("editUser() - should edit a user's display name", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 2,
        displayName: "user",
        receivedH: 2,
        givenH: 4,
        role: "user",
      },
    };

    const userData = {
      userID: 2,
      displayName: "user",
    };
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));

    adminService.editUser(userData, true, 6);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("User user updated.", true);
    expect(patchSpy).toHaveBeenCalledWith("users/all/2", userData);
  });

  // Check that the service dismisses a report
  it("dismissReport() - should dismiss report", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 1,
        type: "user",
        userID: 2,
        displayName: "name",
        reporter: 3,
        reportReason: "reason",
        date: new Date(),
        dismissed: true,
        closed: true,
      },
    };

    adminService.userReports = [
      {
        id: 1,
        type: "User",
        userID: 2,
        reporter: 3,
        reportReason: "reason",
        date: new Date(),
        dismissed: false,
        closed: false,
      },
    ];
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));

    adminService.dismissReport(1);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      "Report 1 was dismissed! Refresh the page to view the updated list.",
      true,
    );
    expect(patchSpy).toHaveBeenCalledWith("reports/1", {
      ...adminService.userReports[0],
      dismissed: true,
    });
  });

  // Check that the service gets a list of blocked users
  it("getBlockedUsers() - should get blocked users", () => {
    // mock response
    const mockResponse = {
      success: true,
      users: [
        {
          id: 15,
          displayName: "name",
          receivedHugs: 2,
          givenHugs: 2,
          role: "user",
          blocked: true,
          releaseDate: new Date("2020-09-29 19:17:31.072"),
          postsNum: 1,
        },
      ],
      total_pages: 1,
    };
    const apiClientSpy = spyOn(adminService["apiClient"], "get").and.returnValue(of(mockResponse));

    adminService.getBlockedUsers();
    // wait for the request to be resolved
    adminService.isBlocksResolved.subscribe((value) => {
      // once it is, check that the response was handled correctly
      if (value) {
        expect(adminService.blockedUsers.length).toBe(1);
        expect(adminService.totalPages.blockedUsers).toBe(1);
        expect(adminService.blockedUsers[0].id).toBe(15);
      }
    });
    expect(apiClientSpy).toHaveBeenCalledWith("users/blocked", { page: "1" });
  });

  // Check that the user's block data is fetched from the server
  it("checkUserBlock() - should check whether a user is blocked", () => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        id: 15,
        displayName: "name",
        receivedHugs: 2,
        givenHugs: 2,
        role: "user",
        blocked: true,
        releaseDate: new Date("2020-09-29 19:17:31.072"),
        postsNum: 1,
      },
      total_pages: 1,
    };
    const getSpy = spyOn(adminService["apiClient"], "get").and.returnValue(of(mockResponse));

    adminService.checkUserBlock(15);
    // wait for the request to be resolved
    adminService.isBlocksResolved.subscribe((value) => {
      // once it is, check that the response was handled correctly
      if (value) {
        expect(adminService.userBlockData!.userID).toBe(15);
        expect(adminService.userBlockData!.isBlocked).toBeTrue();
        expect(adminService.userBlockData!.releaseDate).toEqual(
          new Date("2020-09-29 19:17:31.072"),
        );
      }
    });
    expect(getSpy).toHaveBeenCalledWith("users/all/15");
  });

  // Check that the service blocks the user
  it("blockUser() - should block a user", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 15,
        displayName: "name",
        receivedHugs: 2,
        givenHugs: 2,
        role: "user",
        blocked: true,
        releaseDate: new Date("2020-09-29 19:17:31.072"),
        postsNum: 1,
      },
      total_pages: 1,
    };
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");

    adminService.blockUser(15, new Date("2020-09-29 19:17:31.072"));

    expect(patchSpy).toHaveBeenCalledWith("users/all/15", {
      id: 15,
      releaseDate: new Date("2020-09-29 19:17:31.072"),
      blocked: true,
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `User ${mockResponse.updated.displayName} has been blocked until ${mockResponse.updated.releaseDate}`,
      true,
    );
  });

  // Check that the service blocks the user and dismisses the report
  it("blockUser() - should block a user and dismiss a report", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 15,
        displayName: "name",
        receivedHugs: 2,
        givenHugs: 2,
        role: "user",
        blocked: true,
        releaseDate: new Date("2020-09-29 19:17:31.072"),
        postsNum: 1,
      },
      total_pages: 1,
    };
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const dismissSpy = spyOn(adminService, "dismissReport");

    adminService.blockUser(15, new Date("2020-09-29 19:17:31.072"), 3);

    expect(patchSpy).toHaveBeenCalledWith("users/all/15", {
      id: 15,
      releaseDate: new Date("2020-09-29 19:17:31.072"),
      blocked: true,
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `User ${mockResponse.updated.displayName} has been blocked until ${mockResponse.updated.releaseDate}`,
      true,
    );
    expect(dismissSpy).toHaveBeenCalled();
    expect(dismissSpy).toHaveBeenCalledWith(3);
  });

  // Check the service unblocks a user
  it("should unblock a user", () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 15,
        displayName: "name",
        receivedHugs: 2,
        givenHugs: 2,
        role: "user",
        blocked: false,
        releaseDate: null,
        postsNum: 1,
      },
      total_pages: 1,
    };
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");

    adminService.unblockUser(15);

    expect(patchSpy).toHaveBeenCalledWith("users/all/15", {
      id: 15,
      releaseDate: null,
      blocked: false,
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `User ${mockResponse.updated.displayName} has been unblocked.`,
      true,
    );
  });

  // Check the service gets filtered words
  it("should get filtered words", () => {
    // mock response
    const mockResponse = {
      success: true,
      total_pages: 1,
      words: ["word1", "word2"],
    };
    const apiClientSpy = spyOn(adminService["apiClient"], "get").and.returnValue(of(mockResponse));

    adminService.getFilters();
    // wait for the request to be resolved
    adminService.isFiltersResolved.subscribe((value) => {
      // once it is, check that the response was handled correctly
      if (value) {
        expect(adminService.filteredPhrases.length).toBe(2);
        expect(adminService.totalPages.filteredPhrases).toBe(1);
      }
    });
    expect(apiClientSpy).toHaveBeenCalledWith("filters", { page: "1" });
  });

  // Check that the service adds a filter
  it("should add a filter", () => {
    // mock response
    const mockResponse = {
      success: true,
      added: {
        filter: "sample",
        id: 1,
      },
    };
    const postSpy = spyOn(adminService["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");

    adminService.addFilter("sample");

    expect(postSpy).toHaveBeenCalledWith("filters", { word: "sample" });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `The phrase ${mockResponse.added.filter} was added to the list of filtered words! Refresh to see the updated list.`,
      true,
    );
  });

  // Check that the service removes a filter
  it("should remove a filter", () => {
    // mock response
    const mockResponse = {
      success: true,
      deleted: {
        filter: "word1",
        id: 1,
      },
    };

    adminService.filteredPhrases = [
      { id: 1, filter: "word1" },
      { id: 2, filter: "word2" },
    ];
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const deleteSpy = spyOn(adminService["apiClient"], "delete").and.returnValue(of(mockResponse));

    adminService.removeFilter(1);

    expect(deleteSpy).toHaveBeenCalledWith("filters/1");
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `The phrase ${mockResponse.deleted.filter} was removed from the list of filtered words. Refresh to see the updated list.`,
      true,
    );
  });
});
