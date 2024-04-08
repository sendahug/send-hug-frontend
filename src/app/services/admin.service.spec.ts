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
import { HttpClientTestingModule } from "@angular/common/http/testing";
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

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData = { ...mockAuthedUser };
    authService.isUserDataResolved.next(true);
  });

  // Check the service is created
  it("should be created", () => {
    expect(adminService).toBeTruthy();
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
    const dismissSpy = spyOn(adminService, "closeReport");
    const messageSpy = spyOn(adminService["itemsService"], "sendMessage");
    const deleteSWSpy = spyOn(adminService["serviceWorkerM"], "deleteItem");
    const deleteAPISpy = spyOn(adminService["apiClient"], "delete").and.returnValue(
      of(mockResponse),
    );
    adminService.deletePost(10, reportData, true);

    expect(alertSpy).toHaveBeenCalledWith("Post 10 was successfully deleted.");
    expect(dismissSpy).toHaveBeenCalledWith(5, false, 10);
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
    expect(alertSpy).toHaveBeenCalledWith("User user updated.", { reload: true });
    expect(patchSpy).toHaveBeenCalledWith("users/all/2", userData);
  });

  // Check that the service dismisses a report
  it("closeReport() - should dismiss report", (done: DoneFn) => {
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
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));

    adminService.closeReport(1, true).subscribe({
      next: (_response) => {
        expect(patchSpy).toHaveBeenCalledWith("reports/1", {
          id: 1,
          dismissed: true,
          closed: true,
          postID: undefined,
          userID: undefined,
        });
        done();
      },
    });
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
    const blockDate = new Date("2020-09-29 19:17:31.072");
    const fetchUserDataSpy = spyOn(adminService, "fetchUserBlockData").and.returnValue(
      of({
        userID: 15,
        isBlocked: false,
        releaseDate: undefined,
      }),
    );
    const calculateSpy = spyOn(adminService, "calculateUserReleaseDate").and.returnValue(blockDate);
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");

    adminService.blockUser(15, "oneDay");

    expect(fetchUserDataSpy).toHaveBeenCalledWith(15);
    expect(calculateSpy).toHaveBeenCalledWith("oneDay", undefined);
    expect(patchSpy).toHaveBeenCalledWith("users/all/15", {
      id: 15,
      releaseDate: blockDate,
      blocked: true,
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `User ${mockResponse.updated.displayName} has been blocked until ${mockResponse.updated.releaseDate}`,
      { reload: true },
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
    const blockDate = new Date("2020-09-29 19:17:31.072");
    const fetchUserDataSpy = spyOn(adminService, "fetchUserBlockData").and.returnValue(
      of({
        userID: 15,
        isBlocked: false,
        releaseDate: undefined,
      }),
    );
    const calculateSpy = spyOn(adminService, "calculateUserReleaseDate").and.returnValue(blockDate);
    const patchSpy = spyOn(adminService["apiClient"], "patch").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminService["alertsService"], "createSuccessAlert");
    const dismissSpy = spyOn(adminService, "closeReport");

    adminService.blockUser(15, "oneDay", 3);

    expect(fetchUserDataSpy).toHaveBeenCalledWith(15);
    expect(calculateSpy).toHaveBeenCalledWith("oneDay", undefined);
    expect(patchSpy).toHaveBeenCalledWith("users/all/15", {
      id: 15,
      releaseDate: blockDate,
      blocked: true,
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `User ${mockResponse.updated.displayName} has been blocked until ${mockResponse.updated.releaseDate}`,
      { reload: true },
    );
    expect(dismissSpy).toHaveBeenCalled();
    expect(dismissSpy).toHaveBeenCalledWith(3, false, undefined, 15);
  });

  it("fetchUserBlockData() - should fetch user data for blocking - unblocked user", (done: DoneFn) => {
    const apiClientSpy = spyOn(adminService["apiClient"], "get").and.returnValue(
      of({
        user: {
          id: 10,
          blocked: false,
          releaseDate: null,
        },
      }),
    );

    adminService.fetchUserBlockData(10).subscribe({
      next: (data) => {
        expect(apiClientSpy).toHaveBeenCalledWith("users/all/10");
        expect(data).toEqual({
          userID: 10,
          isBlocked: false,
          releaseDate: undefined,
        });
        done();
      },
    });
  });

  it("fetchUserBlockData() - should fetch user data for blocking - blocked user", (done: DoneFn) => {
    const blockedUntil = "Tue Sep 29 2020 19:17:31 GMT+0100 (British Summer Time)";
    const apiClientSpy = spyOn(adminService["apiClient"], "get").and.returnValue(
      of({
        user: {
          id: 10,
          blocked: true,
          releaseDate: blockedUntil,
        },
      }),
    );

    adminService.fetchUserBlockData(10).subscribe({
      next: (data) => {
        expect(apiClientSpy).toHaveBeenCalledWith("users/all/10");
        expect(data).toEqual({
          userID: 10,
          isBlocked: true,
          releaseDate: new Date(blockedUntil),
        });
        done();
      },
    });
  });

  // Check that blocks are calculated correctly - day
  it("should calculate block length - day", () => {
    // set up the spy and the component
    const blockLengthNum = 864e5 * 1;
    const blockLengthStr = "oneDay";
    const releaseDate = new Date(new Date().getTime() + blockLengthNum);

    const calculatedReleaseDate = adminService.calculateUserReleaseDate(blockLengthStr, undefined);

    expect(calculatedReleaseDate.getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
  });

  // Check that blocks are calculated correctly - week
  it("should calculate block length - week", () => {
    // set up the spy and the component
    const blockLengthNum = 864e5 * 7;
    const blockLengthStr = "oneWeek";
    const releaseDate = new Date(new Date().getTime() + blockLengthNum);

    const calculatedReleaseDate = adminService.calculateUserReleaseDate(blockLengthStr, undefined);

    expect(calculatedReleaseDate.getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
  });

  // Check that blocks are calculated correctly - month
  it("should calculate block length - month", () => {
    // set up the spy and the component
    const blockLengthNum = 864e5 * 30;
    const blockLengthStr = "oneMonth";
    const releaseDate = new Date(new Date().getTime() + blockLengthNum);

    const calculatedReleaseDate = adminService.calculateUserReleaseDate(blockLengthStr, undefined);

    expect(calculatedReleaseDate.getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
  });

  // Check that blocks are calculated correctly - forever
  it("should calculate block length - forever", () => {
    // set up the spy and the component
    const blockLengthNum = 864e5 * 36500;
    const blockLengthStr = "forever";
    const releaseDate = new Date(new Date().getTime() + blockLengthNum);

    const calculatedReleaseDate = adminService.calculateUserReleaseDate(blockLengthStr, undefined);

    expect(calculatedReleaseDate.getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
  });

  // Check that blocks are calculated correctly - default case
  it("should calculate block length - default", () => {
    // set up the spy and the component
    const blockLengthNum = 864e5 * 1;
    const blockLengthStr = "a";
    const releaseDate = new Date(new Date().getTime() + blockLengthNum);

    const calculatedReleaseDate = adminService.calculateUserReleaseDate(blockLengthStr, undefined);

    expect(calculatedReleaseDate.getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
  });

  // Check that blocks are calculated correctly - extending a block
  it("should calculate block length - extending an existing block", () => {
    // set up the spy and the component
    const currentRelease = new Date("2120-09-29 19:17:31.072");
    const releaseDate = new Date(currentRelease.getTime() + 864e5 * 7);
    const blockLengthStr = "oneWeek";

    const calculatedReleaseDate = adminService.calculateUserReleaseDate(
      blockLengthStr,
      currentRelease,
    );

    expect(calculatedReleaseDate.getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
  });
});
