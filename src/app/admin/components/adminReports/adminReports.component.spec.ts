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
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { BehaviorSubject, of, Subscription, throwError } from "rxjs";
import { By } from "@angular/platform-browser";
import { MockProvider } from "ng-mocks";

import { AdminReportsComponent } from "./adminReports.component";
import { AuthService } from "@app/services/auth.service";
import { LoaderComponent } from "@common/loader/loader.component";
import { mockAuthedUser } from "@tests/mockData";
import { type ReportGet } from "@app/interfaces/report.interface";
import { ApiClientService } from "@app/services/apiClient.service";
import { PostEditFormComponent } from "@forms/postEditForm/postEditForm.component";
import { DisplayNameEditFormComponent } from "@forms/displayNameEditForm/displayNameEditForm.component";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { AdminService } from "@app/services/admin.service";
import { iconCharacters } from "@app/interfaces/types";
import { PostGet } from "@app/interfaces/post.interface";

// REPORTS PAGE
// ==================================================================
describe("AdminReportsComponent", () => {
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

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        LoaderComponent,
        PostEditFormComponent,
        ItemDeleteFormComponent,
        DisplayNameEditFormComponent,
        CommonModule,
      ],
      declarations: [AdminReportsComponent],
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
  it("should get open reports", () => {
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      of({
        postReports: [...mockPostReports],
        userReports: [...mockUserReports],
        totalPostPages: 2,
        totalUserPages: 2,
        success: true,
      }),
    );
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(apiClientSpy).toHaveBeenCalledWith("reports", {
      userPage: "1",
      postPage: "1",
    });

    expect(adminReports.userReports().length).toBe(1);
    expect(
      adminReportsDOM.querySelectorAll(".tableContainer")[0].querySelectorAll("tbody tr").length,
    ).toBe(1);

    expect(adminReports.totalPostReportsPages()).toBe(2);
    expect(adminReports.postReports().length).toBe(1);
    expect(
      adminReportsDOM.querySelectorAll(".tableContainer")[1].querySelectorAll("tbody tr").length,
    ).toBe(1);

    expect(adminReports.totalUserReportsPages()).toBe(2);
  });

  it("should remove the loading screen if there was an error", () => {
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      throwError(() => new Error("ERROR")),
    );
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(apiClientSpy).toHaveBeenCalledWith("reports", {
      userPage: "1",
      postPage: "1",
    });

    expect(adminReports.userReports().length).toBe(0);
    expect(adminReportsDOM.querySelectorAll(".tableContainer").length).toBe(0);
    expect(adminReports.postReports().length).toBe(0);
    expect(adminReports.isLoading()).toBeFalse();
    expect(adminReportsDOM.querySelectorAll(".errorMessage")[0].textContent.trim()).toBe(
      "There are no user reports waiting for review.",
    );

    expect(adminReportsDOM.querySelectorAll(".errorMessage")[1].textContent.trim()).toBe(
      "There are no post reports waiting for review.",
    );
  });

  it("should block a user", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
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
          receivedH: 0,
          givenH: 0,
          posts: 0,
          role: {
            id: 1,
            name: "user",
            permissions: [],
          },
          selectedIcon: "kitty" as iconCharacters,
          iconColours: {
            character: "#000000",
            rbg: "#FFFFFF",
            lbg: "",
            item: "",
          },
        },
        reportID: 1,
      }),
    );

    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // trigger a click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(blockSpy).toHaveBeenCalledWith(10, 1);
    expect(blockServiceSpy).toHaveBeenCalledWith(10, "oneDay", 1);
    expect(adminReports.userReports().length).toBe(0);
  });

  it("should block a user but not remove the report if there's no report ID", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
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
          receivedH: 0,
          givenH: 0,
          posts: 0,
          role: {
            id: 1,
            name: "user",
            permissions: [],
          },
          selectedIcon: "kitty" as iconCharacters,
          iconColours: {
            character: "#000000",
            rbg: "#FFFFFF",
            lbg: "",
            item: "",
          },
        },
        reportID: undefined,
      }),
    );

    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // trigger a click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(blockSpy).toHaveBeenCalledWith(10, 1);
    expect(blockServiceSpy).toHaveBeenCalledWith(10, "oneDay", 1);
    expect(adminReports.userReports().length).toBe(1);
  });

  // Check that user editing triggers the popup
  it("should edit a user's display name", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const editSpy = spyOn(adminReports, "editUser").and.callThrough();
    spyOn(adminReports, "fetchReports");
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // before the click
    expect(adminReports.nameEditMode()).toBeFalse();

    // trigger click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(editSpy).toHaveBeenCalledWith(1, 10, "user");
    expect(adminReports.nameEditMode()).toBeTrue();
    expect(adminReports.userToEdit()).toEqual({
      displayName: "user",
      id: 10,
    });

    expect(adminReportsDOM.querySelector("display-name-edit-form")).toBeTruthy();
  });

  // Check that post editing triggers the popup
  it("should edit a post's text", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const editSpy = spyOn(adminReports, "editPost").and.callThrough();
    spyOn(adminReports, "fetchReports");
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // before the click
    expect(adminReports.postEditMode()).toBeFalse();

    // trigger click
    const postTable = adminReportsDOM.querySelectorAll(".tableContainer")[1];
    postTable.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(editSpy).toHaveBeenCalledWith(
      mockPostReports[0].postID!,
      mockPostReports[0].text!,
      mockPostReports[0].id!,
    );

    expect(adminReports.postEditMode()).toBeTrue();
    expect(adminReportsDOM.querySelector("post-edit-form")).toBeTruthy();
  });

  // Check that deleting a post triggers the popup
  it("should delete a post", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const deleteSpy = spyOn(adminReports, "deletePost").and.callThrough();
    spyOn(adminReports, "fetchReports");
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // before the click
    expect(adminReports.deleteMode()).toBeFalse();

    // trigger click
    const postTable = adminReportsDOM.querySelectorAll(".tableContainer")[1];
    postTable.querySelectorAll(".adminButton")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(deleteSpy).toHaveBeenCalledWith(
      mockPostReports[0].postID!,
      mockPostReports[0].userID!,
      mockPostReports[0].id!,
    );

    expect(adminReports.deleteMode()).toBeTrue();
    expect(adminReports.itemToDelete()).toEqual(mockPostReports[0].postID!);
    expect(adminReports.reportData()).toEqual({
      userID: mockPostReports[0].userID!,
      reportID: mockPostReports[0].id!,
    });

    expect(adminReportsDOM.querySelector("item-delete-form")).toBeTruthy();
  });

  // Check that you can dismiss reports
  it("should dismiss post report", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
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
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // trigger click
    const postTable = adminReportsDOM.querySelectorAll(".tableContainer")[1];
    postTable.querySelectorAll(".adminButton")[2].click();
    fixture.detectChanges();

    // check expectations
    expect(dismissSpy).toHaveBeenCalledWith(2, true, 5);
    expect(dismissServiceSpy).toHaveBeenCalledWith(2, true, 5, undefined);
    expect(alertsSpy).toHaveBeenCalledWith(`Report 2 was dismissed!`);
    expect(adminReports.postReports().length).toEqual(0);
  });

  it("should dismiss user report", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
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
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // trigger click
    const userTable = adminReportsDOM.querySelectorAll(".tableContainer")[0];
    userTable.querySelectorAll(".adminButton")[2].click();
    fixture.detectChanges();

    // check expectations
    expect(dismissSpy).toHaveBeenCalledWith(1, true, undefined, 10);
    expect(dismissServiceSpy).toHaveBeenCalledWith(1, true, undefined, 10);
    expect(alertsSpy).toHaveBeenCalledWith(`Report 1 was dismissed!`);
    expect(adminReports.userReports().length).toEqual(0);
  });

  it("should go to the next page - user reports", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const nextPageSpy = spyOn(adminReports, "nextPage").and.callThrough();
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    adminReports.totalUserReportsPages.set(2);
    adminReports.currentUserReportsPage.set(1);
    fixture.detectChanges();

    // trigger click
    // TODO: figure out why adminReportsDOM.querySelectorAll(".nextButton")[0] seems
    // to return undefined here.
    adminReportsDOM.querySelectorAll(".pagination > button")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(nextPageSpy).toHaveBeenCalledWith("users");
    expect(adminReports.currentUserReportsPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should go to the next page - posts reports", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const nextPageSpy = spyOn(adminReports, "nextPage").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.isLoading.set(false);
    adminReports.totalPostReportsPages.set(2);
    adminReports.currentPostReportsPage.set(1);
    fixture.detectChanges();

    // trigger click
    adminReportsDOM.querySelectorAll(".nextButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(nextPageSpy).toHaveBeenCalledWith("posts");
    expect(adminReports.currentPostReportsPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should go to the previous page - user reports", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const prevPageSpy = spyOn(adminReports, "prevPage").and.callThrough();
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    adminReports.totalUserReportsPages.set(2);
    adminReports.currentUserReportsPage.set(2);
    fixture.detectChanges();

    // trigger click
    // TODO: figure out why adminReportsDOM.querySelectorAll(".prevButton")[0] seems
    // to return undefined here.
    adminReportsDOM.querySelectorAll(".pagination > button")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(prevPageSpy).toHaveBeenCalledWith("users");
    expect(adminReports.currentUserReportsPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should go to the previous page - posts reports", () => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const fetchSpy = spyOn(adminReports, "fetchReports");
    const prevPageSpy = spyOn(adminReports, "prevPage").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.isLoading.set(false);
    adminReports.totalPostReportsPages.set(2);
    adminReports.currentPostReportsPage.set(2);
    fixture.detectChanges();

    // trigger click
    // TODO: figure out why adminReportsDOM.querySelectorAll(".prevButton")[0] seems
    // to return undefined here.
    adminReportsDOM.querySelectorAll(".pagination > button")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(prevPageSpy).toHaveBeenCalledWith("posts");
    expect(adminReports.currentPostReportsPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false - display name edit", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    adminReports.userToEdit.set({
      displayName: "displayName",
      id: 2,
    });
    adminReports.nameEditMode.set(true);
    adminReports.reportData.set({
      reportID: 5,
      userID: 2,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditFormComponent;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "EditName");
    expect(adminReports.nameEditMode()).toBeFalse();
  });

  it("should change mode when the event emitter emits false - post edit", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    adminReports.postToEdit.set({ text: "", id: 1 } as PostGet);
    adminReports.postEditMode.set(true);
    adminReports.reportData.set({
      reportID: 5,
      postID: 2,
      userID: 0,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditFormComponent;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "EditPost");
    expect(adminReports.postEditMode()).toBeFalse();
  });

  it("should change mode when the event emitter emits false - delete post", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    adminReports.deleteMode.set(true);
    adminReports.itemToDelete.set(mockPostReports[0].postID!);
    adminReports.reportData.set({
      userID: mockPostReports[0].userID!,
      reportID: mockPostReports[0].id!,
    });
    adminReports.itemToDelete.set(2);
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "Delete");
    expect(adminReports.deleteMode()).toBeFalse();
  });

  it("should update the UI when the edit is done - display name edit + close report", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updateUserReport").and.callThrough();
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    adminReports.userToEdit.set({
      displayName: "displayName",
      id: 2,
    });
    adminReports.nameEditMode.set(true);
    adminReports.reportData.set({
      reportID: 1,
      userID: 10,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditFormComponent;
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

    expect(adminReports.userReports().length).toBe(0);
  });

  it("shouldn't update the UI if the report ID doesn't exist - user report", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updateUserReport").and.callThrough();
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    adminReports.userToEdit.set({
      displayName: "displayName",
      id: 2,
    });
    adminReports.nameEditMode.set(true);
    adminReports.reportData.set({
      reportID: 1,
      userID: 10,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditFormComponent;
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

    expect(adminReports.userReports().length).toBe(1);
  });

  it("should update the UI when the edit is done - display name edit + don't close report", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updateUserReport").and.callThrough();
    adminReports.userReports.set([...mockUserReports]);
    adminReports.isLoading.set(false);
    fixture.detectChanges();

    // start the popup
    adminReports.userToEdit.set({
      displayName: "displayName",
      id: 2,
    });
    adminReports.nameEditMode.set(true);
    adminReports.reportData.set({
      reportID: 1,
      userID: 10,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as DisplayNameEditFormComponent;
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

    expect(adminReports.userReports().length).toBe(1);
    expect(adminReports.userReports()[0].displayName).toBe("beep");
  });

  it("should update the UI when a report is closed - post edit", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updatePostReport").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.isLoading.set(false);
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
    adminReports.postToEdit.set({ text: "", id: 1 } as PostGet);
    adminReports.postEditMode.set(true);
    adminReports.reportData.set({
      reportID: 5,
      postID: 2,
      userID: 0,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditFormComponent;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(reportPostResponse);
    expect(adminReports.postReports().length).toBe(0);
  });

  it("shouldn't update the UI when a report doesn't exist - post edit", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updatePostReport").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.isLoading.set(false);
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
    adminReports.postToEdit.set({ text: "", id: 1 } as PostGet);
    adminReports.postEditMode.set(true);
    adminReports.reportData.set({
      reportID: 5,
      postID: 2,
      userID: 0,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditFormComponent;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(reportPostResponse);
    expect(adminReports.postReports().length).toBe(1);
  });

  it("should change update the UI when a report isn't closed - post edit", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const updateSpy = spyOn(adminReports, "updatePostReport").and.callThrough();
    adminReports.postReports.set([...mockPostReports]);
    adminReports.isLoading.set(false);
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
    adminReports.postToEdit.set({ text: "", id: 1 } as PostGet);
    adminReports.postEditMode.set(true);
    adminReports.reportData.set({
      reportID: 5,
      postID: 2,
      userID: 0,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditFormComponent;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(reportPostResponse);
    expect(adminReports.postReports().length).toBe(1);
    expect(adminReports.postReports()[0].text).toBe(reportPostResponse.updatedPost.text);
  });

  it("should update the UI when the post is deleted - delete post", () => {
    const fixture = TestBed.createComponent(AdminReportsComponent);
    const adminReports = fixture.componentInstance;
    const removeSpy = spyOn(adminReports, "removeReport").and.callThrough();
    const subscription = new Subscription();
    subscription.unsubscribe();
    const closeReportSpy = spyOn(
      adminReports["adminService"],
      "closeReportAndAlertUserAfterDelete",
    ).and.returnValue(subscription);
    adminReports.postReports.set([...mockPostReports]);
    adminReports.isLoading.set(false);

    fixture.detectChanges();

    // start the popup
    adminReports.deleteMode.set(true);
    adminReports.itemToDelete.set(mockPostReports[0].postID!);
    adminReports.reportData.set({
      userID: mockPostReports[0].userID!,
      reportID: mockPostReports[0].id!,
    });
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.deleted.emit(5);
    fixture.detectChanges();

    // check the popup is exited
    expect(removeSpy).toHaveBeenCalledWith(5);
    expect(closeReportSpy).toHaveBeenCalledWith(5, {
      userID: mockPostReports[0].userID!,
      reportID: mockPostReports[0].id!,
    });

    expect(adminReports.postReports().length).toBe(0);
  });
});
