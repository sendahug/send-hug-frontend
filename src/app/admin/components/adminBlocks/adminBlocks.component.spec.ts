/*
  Admin Dashboard
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
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { MockComponent, MockProvider } from "ng-mocks";
import { ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AdminBlocks } from "./adminBlocks.component";
import { AuthService } from "@app/services/auth.service";
import { Loader } from "@common/loader/loader.component";
import { mockAuthedUser } from "@tests/mockData";
import { ApiClientService } from "@app/services/apiClient.service";
import { AdminService } from "@app/services/admin.service";

const mockBlockedUsers = [
  {
    id: 15,
    displayName: "name",
    receivedH: 2,
    givenH: 2,
    role: "user",
    blocked: true,
    releaseDate: new Date("2120-09-29 19:17:31.072"),
    posts: 1,
  },
];

// BLOCKS PAGE
// ==================================================================
describe("Blocks Page", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAdminService = MockProvider(AdminService);
    const MockAuthService = MockProvider(AuthService, {
      isUserDataResolved: new BehaviorSubject(true),
      userData: signal({ ...mockAuthedUser }),
      authenticated: signal(true),
      canUser: () => true,
    });
    const MockAPIClient = MockProvider(ApiClientService, {
      get: () => of(),
    });
    const MockLoader = MockComponent(Loader);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, BrowserModule, MockLoader],
      declarations: [AdminBlocks],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideRouter([]),
        MockAdminService,
        MockAuthService,
        MockAPIClient,
      ],
    }).compileComponents();

    // make sure the test goes through with admin permission
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "canUser").and.returnValue(true);
    authService.isUserDataResolved.next(true);
    authService.userData.set({ ...mockAuthedUser });
  });

  // Check that a call is made to get blocked users
  it("should get blocked users", (done: DoneFn) => {
    // set up the spy and the component
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      of({
        users: [...mockBlockedUsers],
        totalPages: 1,
        success: true,
      }),
    );
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    fixture.detectChanges();

    adminBlocks.fetchBlocks();

    expect(apiClientSpy).toHaveBeenCalledWith("users/blocked", { page: "1" });
    expect(adminBlocks.blockedUsers.length).toBe(1);
    expect(adminBlocks.isLoading).toBeFalse();
    expect(
      adminBlocksDOM.querySelectorAll(".tableContainer")[0].querySelectorAll("tbody tr").length,
    ).toBe(1);
    done();
  });

  it("should remove the loading screen if there was an error", (done: DoneFn) => {
    // set up the spy and the component
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      throwError(() => new Error("ERROR")),
    );
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    fixture.detectChanges();

    adminBlocks.fetchBlocks();

    expect(apiClientSpy).toHaveBeenCalledWith("users/blocked", { page: "1" });
    expect(adminBlocks.blockedUsers.length).toBe(0);
    expect(adminBlocks.isLoading).toBeFalse();
    expect(adminBlocksDOM.querySelectorAll(".tableContainer").length).toBe(0);
    expect(adminBlocksDOM.querySelector("app-loader")).toBeNull();
    expect(adminBlocksDOM.querySelectorAll(".errorMessage")[0].textContent).toBe(
      "There are no blocked users.",
    );
    done();
  });

  // Check that you can block a user
  it("should block a user - new block", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminBlocks, "block").and.callThrough();
    const blockServiceSpy = spyOn(adminBlocks.adminService, "blockUser").and.returnValue(
      of({
        success: true,
        updated: {
          id: 5,
          type: "User",
          userID: 15,
          displayName: "name",
          reporter: 3,
          reportReason: "reason",
          date: new Date(),
          dismissed: true,
          closed: true,
        },
        reportID: undefined,
      }),
    );
    spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelector("#blockID").value = 5;
    adminBlocksDOM.querySelector("#blockID").dispatchEvent(new Event("input"));
    adminBlocksDOM.querySelector("#blockLength").value = "oneDay";
    adminBlocksDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(blockSpy).toHaveBeenCalled();
    expect(blockServiceSpy).toHaveBeenCalledWith(5, "oneDay");
    expect(adminBlocks.blockedUsers.length).toBe(2);
    done();
  });

  // Check that you can block a user
  it("should block a user - extended block", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminBlocks, "block").and.callThrough();
    const blockServiceSpy = spyOn(adminBlocks.adminService, "blockUser").and.returnValue(
      of({
        success: true,
        updated: {
          id: 15,
          type: "User",
          userID: 15,
          displayName: "name",
          reporter: 3,
          reportReason: "reason",
          date: new Date(),
          dismissed: true,
          closed: true,
        },
        reportID: undefined,
      }),
    );
    spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelector("#blockID").value = 15;
    adminBlocksDOM.querySelector("#blockID").dispatchEvent(new Event("input"));
    adminBlocksDOM.querySelector("#blockLength").value = "oneDay";
    adminBlocksDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(blockSpy).toHaveBeenCalled();
    expect(blockServiceSpy).toHaveBeenCalledWith(15, "oneDay");
    expect(adminBlocks.blockedUsers.length).toBe(1);
    done();
  });

  it("should check a user ID is provided", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminBlocks, "block").and.callThrough();
    const blockServiceSpy = spyOn(adminBlocks.adminService, "blockUser");
    const alertSpy = spyOn(adminBlocks["alertsService"], "createAlert");
    spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelector("#blockID").value = null;
    adminBlocksDOM.querySelector("#blockID").dispatchEvent(new Event("input"));
    adminBlocksDOM.querySelector("#blockLength").value = "oneDay";
    adminBlocksDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(blockSpy).toHaveBeenCalled();
    expect(blockServiceSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message:
        "A user ID is needed to block a user. Please add user ID to the textfield and try again.",
    });
    done();
  });

  it("should check the user ID isn't the logged in user's ID", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminBlocks, "block").and.callThrough();
    const blockServiceSpy = spyOn(adminBlocks.adminService, "blockUser");
    const alertSpy = spyOn(adminBlocks["alertsService"], "createAlert");
    spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelector("#blockID").value = 4;
    adminBlocksDOM.querySelector("#blockID").dispatchEvent(new Event("input"));
    adminBlocksDOM.querySelector("#blockLength").value = "oneDay";
    adminBlocksDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(blockSpy).toHaveBeenCalled();
    expect(blockServiceSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "You cannot block yourself.",
    });
    done();
  });

  it("should check the user ID is a number", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminBlocks, "block").and.callThrough();
    const blockServiceSpy = spyOn(adminBlocks.adminService, "blockUser");
    const alertSpy = spyOn(adminBlocks["alertsService"], "createAlert");
    spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelector("#blockID").value = "hello";
    adminBlocksDOM.querySelector("#blockID").dispatchEvent(new Event("input"));
    adminBlocksDOM.querySelector("#blockLength").value = "oneDay";
    adminBlocksDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(blockSpy).toHaveBeenCalled();
    expect(blockServiceSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "User ID must be a number. Please correct the User ID and try again.",
    });
    done();
  });

  // Check that you can unblock a user
  it("should unblock a user", (done: DoneFn) => {
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

    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const unblockSpy = spyOn(adminBlocks, "unblock").and.callThrough();
    const patchSpy = spyOn(adminBlocks["apiClient"], "patch").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(adminBlocks["alertsService"], "createSuccessAlert");
    spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(unblockSpy).toHaveBeenCalledWith(15);
    expect(patchSpy).toHaveBeenCalledWith("users/all/15", {
      id: 15,
      releaseDate: null,
      blocked: false,
    });
    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      `User ${mockResponse.updated.displayName} has been unblocked.`,
    );
    expect(adminBlocks.blockedUsers.length).toEqual(0);
    done();
  });

  it("should go to the next page", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const nextPageSpy = spyOn(adminBlocks, "nextPage").and.callThrough();
    const fetchSpy = spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(2);
    adminBlocks.currentPage.set(1);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelectorAll(".pagination > button")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(nextPageSpy).toHaveBeenCalled();
    expect(adminBlocks.currentPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });

  it("should return to the previous page", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminBlocks);
    const adminBlocks = fixture.componentInstance;
    const adminBlocksDOM = fixture.nativeElement;
    const prevPageSpy = spyOn(adminBlocks, "prevPage").and.callThrough();
    const fetchSpy = spyOn(adminBlocks, "fetchBlocks");
    adminBlocks.blockedUsers = [...mockBlockedUsers];
    adminBlocks.isLoading = false;
    adminBlocks.totalPages.set(2);
    adminBlocks.currentPage.set(2);
    fixture.detectChanges();

    // trigger a click
    adminBlocksDOM.querySelectorAll(".pagination > button")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(prevPageSpy).toHaveBeenCalled();
    expect(adminBlocks.currentPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });
});
