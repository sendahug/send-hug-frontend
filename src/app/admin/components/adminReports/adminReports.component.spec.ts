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
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { BehaviorSubject, of, throwError } from "rxjs";
import { By } from "@angular/platform-browser";
import { MockComponent, MockProvider } from "ng-mocks";

import { AdminReports } from "./adminReports.component";
import { AuthService } from "@app/services/auth.service";
import { Loader } from "@common/loader/loader.component";
import { mockAuthedUser } from "@tests/mockData";
import { type ReportGet } from "@app/interfaces/report.interface";
import { ApiClientService } from "@app/services/apiClient.service";
import { PostEditForm } from "@forms/postEditForm/postEditForm.component";
import { DisplayNameEditForm } from "@forms/displayNameEditForm/displayNameEditForm.component";
import { ItemDeleteForm } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { AdminService } from "@app/services/admin.service";

// REPORTS PAGE
// ==================================================================
describe("AdminReports", () => {
  let mockUserReports: ReportGet[];
  let mockPostReports: ReportGet[];

  // Before each test, configure testing environment
  beforeEach(() => {
    // make sure the test goes through with admin permission
    const MockAuthService = MockProvider(AuthService, {
      isUserDataResolved: new BehaviorSubject(true),
      userData: signal({ ...mockAuthedUser }),
      authenticated: signal(true),
      canUser: () => true,
    });
    const MockAdminService = MockProvider(AdminService);
    const MockAPIClient = MockProvider(ApiClientService, {
      get: () => of(),
    });
    const MockEditForm = MockComponent(DisplayNameEditForm);
    const MockDeleteForm = MockComponent(ItemDeleteForm);
    const MockPostEditForm = MockComponent(PostEditForm);
    const MockLoader = MockComponent(Loader);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MockLoader, MockPostEditForm, MockDeleteForm, MockEditForm, CommonModule],
      declarations: [AdminReports],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideRouter([]),
        MockAuthService,
        MockAdminService,
        MockAPIClient,
      ],
    }).compileComponents();

    // make sure the test goes through with admin permission
    const authService = TestBed.inject(AuthService) as AuthService;
    spyOn(authService, "canUser").and.returnValue(true);
    authService.isUserDataResolved.next(true);
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });

    // set up mock data
    mockUserReports = [
      {
        id: 1,
        type: "User" as "User" | "Post",
        userID: 10,
        reporter: 4,
        reportReason: "something",
        date: new Date("2020-06-29 19:17:31.072"),
        dismissed: false,
        closed: false,
        displayName: "user",
      },
    ];
    mockPostReports = [
      {
        id: 2,
        type: "Post" as "User" | "Post",
        userID: 11,
        postID: 5,
        reporter: 4,
        reportReason: "reason",
        date: new Date("2020-06-29 19:17:31.072"),
        dismissed: false,
        closed: false,
        text: "hi",
      },
    ];
  });

  // Check that a call is made to get open reports
  it("should get open reports", (done: DoneFn) => {
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      of({
        postReports: [...mockPostReports],
        userReports: [...mockUserReports],
        totalPostPages: 2,
        totalUserPages: 2,
        success: true,
      }),
    );
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(apiClientSpy).toHaveBeenCalledWith("reports", {
      userPage: "1",
      postPage: "1",
    });
    expect(adminReports.userReports.length).toBe(1);
    expect(
      adminReportsDOM.querySelectorAll(".tableContainer")[0].querySelectorAll("tbody tr").length,
    ).toBe(1);
    expect(adminReports.totalPostReportsPages()).toBe(2);
    expect(adminReports.postReports.length).toBe(1);
    expect(
      adminReportsDOM.querySelectorAll(".tableContainer")[1].querySelectorAll("tbody tr").length,
    ).toBe(1);
    expect(adminReports.totalUserReportsPages()).toBe(2);
    done();
  });

  it("should remove the loading screen if there was an error", (done: DoneFn) => {
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      throwError(() => new Error("ERROR")),
    );
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(apiClientSpy).toHaveBeenCalledWith("reports", {
      userPage: "1",
      postPage: "1",
    });
    expect(adminReports.userReports.length).toBe(0);
    expect(adminReportsDOM.querySelectorAll(".tableContainer").length).toBe(0);
    expect(adminReports.postReports.length).toBe(0);
    expect(adminReports.isLoading).toBeFalse();
    expect(adminReportsDOM.querySelectorAll(".errorMessage")[0].textContent).toBe(
      "There are no user reports waiting for review.",
    );
    expect(adminReportsDOM.querySelectorAll(".errorMessage")[1].textContent).toBe(
      "There are no post reports waiting for review.",
    );
    done();
  });

  it("should block a user", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminReports, "blockUser").and.callThrough();
    const adminService = adminReports["adminService"];
    const blockServiceSpy = spyOn(adminService, "blockUser").and.returnValue(
      of({
        success: true,
        updated: {
          id: 1,
          type: "User",
          userID: 10,
          displayName: "name",
          reporter: 3,
          reportReason: "reason",
          date: new Date(),
          dismissed: true,
          closed: true,
        },
        reportID: 1,
      }),
    );

    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // trigger a click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(blockSpy).toHaveBeenCalledWith(10, 1);
    expect(blockServiceSpy).toHaveBeenCalledWith(10, "oneDay", 1);
    expect(adminReports.userReports.length).toBe(0);
    done();
  });

  it("should block a user but not remove the report if there's no report ID", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminReports, "blockUser").and.callThrough();
    const adminService = adminReports["adminService"];
    const blockServiceSpy = spyOn(adminService, "blockUser").and.returnValue(
      of({
        success: true,
        updated: {
          id: 1,
          type: "User",
          userID: 10,
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

    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // trigger a click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(blockSpy).toHaveBeenCalledWith(10, 1);
    expect(blockServiceSpy).toHaveBeenCalledWith(10, "oneDay", 1);
    expect(adminReports.userReports.length).toBe(1);
    done();
  });

  // Check that user editing triggers the popup
  it("should edit a user's display name", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const editSpy = spyOn(adminReports, "editUser").and.callThrough();
    spyOn(adminReports, "fetchReports");
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // before the click
    expect(adminReports.nameEditMode).toBeFalse();

    // trigger click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(editSpy).toHaveBeenCalledWith(1, 10, "user");
    expect(adminReports.nameEditMode).toBeTrue();
    expect(adminReports.toEdit).toEqual({
      displayName: "user",
      id: 10,
    });
    expect(adminReportsDOM.querySelector("display-name-edit-form")).toBeTruthy();
    done();
  });

  // Check that post editing triggers the popup
  it("should edit a post's text", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const editSpy = spyOn(adminReports, "editPost").and.callThrough();
    spyOn(adminReports, "fetchReports");
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // before the click
    expect(adminReports.postEditMode).toBeFalse();

    // trigger click
    const postTable = adminReportsDOM.querySelectorAll(".tableContainer")[1];
    postTable.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(editSpy).toHaveBeenCalled();
    expect(adminReports.postEditMode).toBeTrue();
    expect(adminReportsDOM.querySelector("post-edit-form")).toBeTruthy();
    done();
  });

  // Check that deleting a post triggers the popup
  it("should delete a post", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const deleteSpy = spyOn(adminReports, "deletePost").and.callThrough();
    spyOn(adminReports, "fetchReports");
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // before the click
    expect(adminReports.deleteMode).toBeFalse();

    // trigger click
    const postTable = adminReportsDOM.querySelectorAll(".tableContainer")[1];
    postTable.querySelectorAll(".adminButton")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(deleteSpy).toHaveBeenCalled();
    expect(adminReports.deleteMode).toBeTrue();
    expect(adminReports.toDelete).toBe("ad post");
    expect(adminReportsDOM.querySelector("item-delete-form")).toBeTruthy();
    done();
  });

  // Check that you can dismiss reports
  it("should dismiss post report", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const dismissSpy = spyOn(adminReports, "dismissReport").and.callThrough();
    const adminService = adminReports["adminService"];
    const dismissServiceSpy = spyOn(adminService, "closeReport").and.returnValue(
      of({
        success: true,
        updated: {
          id: 2,
          type: "Post" as "User" | "Post",
          userID: 11,
          postID: 5,
          reporter: 4,
          reportReason: "reason",
          date: new Date("2020-06-29 19:17:31.072"),
          dismissed: true,
          closed: true,
        },
      }),
    );
    const alertsSpy = spyOn(adminReports["alertsService"], "createSuccessAlert");
    spyOn(adminReports, "fetchReports");
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // trigger click
    const postTable = adminReportsDOM.querySelectorAll(".tableContainer")[1];
    postTable.querySelectorAll(".adminButton")[2].click();
    fixture.detectChanges();

    // check expectations
    expect(dismissSpy).toHaveBeenCalled();
    expect(dismissServiceSpy).toHaveBeenCalled();
    expect(dismissServiceSpy).toHaveBeenCalledWith(2, true, 5, undefined);
    expect(alertsSpy).toHaveBeenCalledWith(`Report 2 was dismissed!`);
    expect(adminReports.postReports.length).toEqual(0);
    done();
  });

  it("should dismiss user report", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const dismissSpy = spyOn(adminReports, "dismissReport").and.callThrough();
    const adminService = adminReports["adminService"];
    const dismissServiceSpy = spyOn(adminService, "closeReport").and.returnValue(
      of({
        success: true,
        updated: {
          id: 1,
          type: "User" as "User" | "Post",
          userID: 10,
          postID: undefined,
          reporter: 4,
          reportReason: "reason",
          date: new Date("2020-06-29 19:17:31.072"),
          dismissed: true,
          closed: true,
        },
      }),
    );
    const alertsSpy = spyOn(adminReports["alertsService"], "createSuccessAlert");
    spyOn(adminReports, "fetchReports");
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;

    fixture.detectChanges();

    // trigger click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[2].click();
    fixture.detectChanges();

    // check expectations
    expect(dismissSpy).toHaveBeenCalled();
    expect(dismissServiceSpy).toHaveBeenCalled();
    expect(dismissServiceSpy).toHaveBeenCalledWith(1, true, undefined, 10);
    expect(alertsSpy).toHaveBeenCalledWith(`Report 1 was dismissed!`);
    expect(adminReports.userReports.length).toEqual(0);
    done();
  });

  it("should go to the next page - user reports", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const nextPageSpy = spyOn(adminReports, "nextPage").and.callThrough();
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;
    adminReports.totalUserReportsPages.set(2);
    adminReports.currentUserReportsPage.set(1);
    fixture.detectChanges();

    // trigger click
    // TODO: figure out why adminReportsDOM.querySelectorAll(".nextButton")[0] seems
    // to return undefined here.
    adminReportsDOM.querySelectorAll(".pagination > button")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(nextPageSpy).toHaveBeenCalled();
    expect(adminReports.currentUserReportsPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });

  it("should go to the next page - posts reports", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const nextPageSpy = spyOn(adminReports, "nextPage").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    adminReports.isLoading = false;
    adminReports.totalPostReportsPages.set(2);
    adminReports.currentPostReportsPage.set(1);
    fixture.detectChanges();

    // trigger click
    adminReportsDOM.querySelectorAll(".nextButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(nextPageSpy).toHaveBeenCalled();
    expect(adminReports.currentPostReportsPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });

  it("should go to the previous page - user reports", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const prevPageSpy = spyOn(adminReports, "prevPage").and.callThrough();
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;
    adminReports.totalUserReportsPages.set(2);
    adminReports.currentUserReportsPage.set(2);
    fixture.detectChanges();

    // trigger click
    // TODO: figure out why adminReportsDOM.querySelectorAll(".prevButton")[0] seems
    // to return undefined here.
    adminReportsDOM.querySelectorAll(".pagination > button")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(prevPageSpy).toHaveBeenCalled();
    expect(adminReports.currentUserReportsPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });

  it("should go to the previous page - posts reports", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const prevPageSpy = spyOn(adminReports, "prevPage").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    adminReports.isLoading = false;
    adminReports.totalPostReportsPages.set(2);
    adminReports.currentPostReportsPage.set(2);
    fixture.detectChanges();

    // trigger click
    // TODO: figure out why adminReportsDOM.querySelectorAll(".prevButton")[0] seems
    // to return undefined here.
    adminReportsDOM.querySelectorAll(".pagination > button")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(prevPageSpy).toHaveBeenCalled();
    expect(adminReports.currentPostReportsPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false - display name edit", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;
    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = {
      displayName: "displayName",
      id: 2,
    };
    adminReports.nameEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.userID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminReports.nameEditMode).toBeFalse();
    done();
  });

  it("should change mode when the event emitter emits false - post edit", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;
    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = "post";
    adminReports.postEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.postID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminReports.postEditMode).toBeFalse();
    done();
  });

  it("should change mode when the event emitter emits false - delete post", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    adminReports.userReports = [...mockUserReports];
    adminReports.isLoading = false;
    fixture.detectChanges();

    // start the popup
    adminReports.deleteMode = true;
    adminReports.toDelete = "post";
    adminReports.itemToDelete = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminReports.deleteMode).toBeFalse();
    done();
  });

  it("should update the UI when the edit is done - display name edit + close report", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updateUserReport").and.callThrough();
    adminReports.userReports = [...mockUserReports];
    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = {
      displayName: "displayName",
      id: 2,
    };
    adminReports.nameEditMode = true;
    adminReports.reportData.reportID = 1;
    adminReports.reportData.userID = 10;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditForm;
    popup.updatedDetails.emit({
      closed: true,
      reportID: 1,
      displayName: "beep",
    });
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith({
      closed: true,
      reportID: 1,
      displayName: "beep",
    });
    expect(adminReports.userReports.length).toBe(0);
    done();
  });

  it("shouldn't update the UI if the report ID doesn't exist - user report", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updateUserReport").and.callThrough();
    adminReports.userReports = [...mockUserReports];
    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = {
      displayName: "displayName",
      id: 2,
    };
    adminReports.nameEditMode = true;
    adminReports.reportData.reportID = 1;
    adminReports.reportData.userID = 10;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditForm;
    popup.updatedDetails.emit({
      closed: false,
      reportID: 100000,
      displayName: "beep",
    });
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith({
      closed: false,
      reportID: 100000,
      displayName: "beep",
    });
    expect(adminReports.userReports.length).toBe(1);
    done();
  });

  it("should update the UI when the edit is done - display name edit + don't close report", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updateUserReport").and.callThrough();
    adminReports.userReports = [...mockUserReports];
    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = {
      displayName: "displayName",
      id: 2,
    };
    adminReports.nameEditMode = true;
    adminReports.reportData.reportID = 1;
    adminReports.reportData.userID = 10;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditForm;
    popup.updatedDetails.emit({
      closed: false,
      reportID: 1,
      displayName: "beep",
    });
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith({
      closed: false,
      reportID: 1,
      displayName: "beep",
    });
    expect(adminReports.userReports.length).toBe(1);
    expect(adminReports.userReports[0].displayName).toBe("beep");
    done();
  });

  it("should update the UI when a report is closed - post edit", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updatePostReport").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    const reportPostResponse = {
      success: true,
      updatedPost: {
        id: 5,
        userId: 4,
        user: "me",
        text: "test",
        date: new Date(),
        givenHugs: 0,
      },
      reportId: 2,
    };

    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = "post";
    adminReports.postEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.postID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditForm;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalled();
    expect(adminReports.postReports.length).toBe(0);
    done();
  });

  it("shouldn't update the UI when a report doesn't exist - post edit", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updatePostReport").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    const reportPostResponse = {
      success: true,
      updatedPost: {
        id: 500,
        userId: 4,
        user: "me",
        text: "test",
        date: new Date(),
        givenHugs: 0,
      },
      reportId: undefined,
    };

    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = "post";
    adminReports.postEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.postID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditForm;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalled();
    expect(adminReports.postReports.length).toBe(1);
    done();
  });

  it("should change update the UI when a report isn't closed - post edit", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updatePostReport").and.callThrough();
    adminReports.postReports = [...mockPostReports];
    const reportPostResponse = {
      success: true,
      updatedPost: {
        id: 5,
        userId: 4,
        user: "me",
        text: "test",
        date: new Date(),
        givenHugs: 0,
      },
      reportId: undefined,
    };

    fixture.detectChanges();

    // start the popup
    adminReports.toEdit = "post";
    adminReports.postEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.postID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditForm;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalled();
    expect(adminReports.postReports.length).toBe(1);
    expect(adminReports.postReports[0].text).toBe(reportPostResponse.updatedPost.text);
    done();
  });

  it("should update the UI when the post is deleted - delete post", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const removeSpy = spyOn(adminReports, "removeReport").and.callThrough();
    adminReports.postReports = [...mockPostReports];

    fixture.detectChanges();

    // start the popup
    adminReports.deleteMode = true;
    adminReports.toDelete = "post";
    adminReports.itemToDelete = 5;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteForm;
    popup.deleted.emit(5);
    fixture.detectChanges();

    // check the popup is exited
    expect(removeSpy).toHaveBeenCalled();
    expect(adminReports.postReports.length).toBe(0);
    done();
  });
});
