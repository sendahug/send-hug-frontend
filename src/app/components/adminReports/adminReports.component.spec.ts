/*
  Admin Dashboard
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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

import { AdminReports } from "./adminReports.component";
import { PopUp } from "../popUp/popUp.component";
import { AuthService } from "../../services/auth.service";
import { Loader } from "../loader/loader.component";
import { mockAuthedUser } from "@tests/mockData";
import { Report } from "@app/interfaces/report.interface";
import { ApiClientService } from "@app/services/apiClient.service";
import { MockDeleteForm, MockDisplayNameForm, MockEditForm } from "@tests/mockForms";

const mockUserReports: Report[] = [
  {
    id: 1,
    type: "User" as "User" | "Post",
    userID: 10,
    reporter: 4,
    reportReason: "something",
    date: new Date("2020-06-29 19:17:31.072"),
    dismissed: false,
    closed: false,
  },
];
const mockPostReports: Report[] = [
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
  },
];

// REPORTS PAGE
// ==================================================================
describe("AdminReports", () => {
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
        AdminReports,
        PopUp,
        Loader,
        MockDeleteForm,
        MockDisplayNameForm,
        MockEditForm,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    // make sure the test goes through with admin permission
    const authService = TestBed.inject(AuthService) as AuthService;
    spyOn(authService, "canUser").and.returnValue(true);
    authService.isUserDataResolved.next(true);
    authService.authenticated.set(true);
    authService.userData = { ...mockAuthedUser };
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

  it("should blcok a user", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const adminReportsDOM = fixture.nativeElement;
    const blockSpy = spyOn(adminReports, "blockUser").and.callThrough();
    const adminService = adminReports["adminService"];
    const blockServiceSpy = spyOn(adminService, "blockUser");

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
    expect(editSpy).toHaveBeenCalled();
    expect(adminReports.nameEditMode).toBeTrue();
    expect(adminReports.editType).toBe("other user");
    expect(adminReportsDOM.querySelector("app-pop-up")).toBeTruthy();
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
    expect(adminReports.editType).toBe("admin post");
    expect(adminReportsDOM.querySelector("app-pop-up")).toBeTruthy();
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
    expect(adminReportsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that you can dismiss reports
  it("should dismiss report", (done: DoneFn) => {
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
    expect(alertsSpy).toHaveBeenCalledWith(
      `Report 2 was dismissed! Refresh the page to view the updated list.`,
      { reload: true },
    );
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

    fixture.detectChanges();

    // start the popup
    adminReports.lastFocusedElement = document.querySelectorAll("a")[0];
    adminReports.editType = "other user";
    adminReports.toEdit = "displayName";
    adminReports.nameEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.userID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as MockDisplayNameForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminReports.nameEditMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  it("should change mode when the event emitter emits false - post edit", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();

    fixture.detectChanges();

    // start the popup
    adminReports.lastFocusedElement = document.querySelectorAll("a")[0];
    adminReports.editType = "admin post";
    adminReports.toEdit = "post";
    adminReports.postEditMode = true;
    adminReports.reportData.reportID = 5;
    adminReports.reportData.postID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as MockEditForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminReports.postEditMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  it("should change mode when the event emitter emits false - delete post", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminReports);
    const adminReports = fixture.componentInstance;
    const changeSpy = spyOn(adminReports, "changeMode").and.callThrough();

    fixture.detectChanges();

    // start the popup
    adminReports.lastFocusedElement = document.querySelectorAll("a")[0];
    adminReports.deleteMode = true;
    adminReports.toDelete = "post";
    adminReports.itemToDelete = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as MockDeleteForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminReports.deleteMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });
});
