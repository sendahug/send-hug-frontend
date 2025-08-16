/*
	Popup
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
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Observable, of } from "rxjs";
import { provideZonelessChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";

import { PostEditFormComponent } from "./postEditForm.component";
import { type PostGet } from "@app/interfaces/post.interface";
import { PopUpComponent } from "@common/popUp/popUp.component";
import { ValidationService } from "@app/services/validation.service";
import { AdminService } from "@app/services/admin.service";
import { AuthService } from "@app/services/auth.service";
import { ApiClientService } from "@app/services/apiClient.service";
import { TeleportDirective } from "@app/directives/teleport.directive";
import { type PostAndReportResponse } from "@app/interfaces/api";
import { type ReportType } from "@app/interfaces/report.interface";

// POST EDIT
// ==================================================================
describe("PostEditFormComponent", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAdminService = MockProvider(AdminService);
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal(undefined),
    });
    const MockAPIClient = MockProvider(ApiClientService);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        PopUpComponent,
        PostEditFormComponent,
        TeleportDirective,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        MockAdminService,
        MockAuthService,
        MockAPIClient,
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;

    expect(popUp).toBeTruthy();
  });

  it("should make the request to itemsService to change the post", async () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = {
      id: 1,
      userId: 4,
      user: "me",
      text: "hi",
      date: new Date(),
      givenHugs: 0,
      sentHugs: [],
    };
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("isAdmin", false);
    const newText = "new text";
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: newText,
        date: new Date(),
        givenHugs: 0,
      },
    };
    const reportPostResponse = {
      success: true,
      updatedPost: {
        ...serverResponse.updated,
      },
      reportId: undefined,
    };
    await fixture.whenStable();

    const apiClientSpy = spyOn(popUp["apiClient"], "patch").and.returnValue(of(serverResponse));
    const updateReportSpy = spyOn(popUp, "updateReportIfNecessary").and.returnValue(
      of(reportPostResponse),
    );
    const emitSpy = spyOn(popUp.editMode, "emit");
    const resultSpy = spyOn(popUp.updateResult, "emit");
    const alertSpy = spyOn(popUp["alertService"], "createSuccessAlert");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".sendData")[0].click();

    expect(validateSpy).toHaveBeenCalledWith("post");
    const updatedItem = { ...originalItem };
    updatedItem["text"] = newText;

    expect(apiClientSpy).toHaveBeenCalledWith(`posts/${originalItem.id}`, updatedItem);
    expect(updateReportSpy).toHaveBeenCalledWith(null, serverResponse);
    expect(emitSpy).toHaveBeenCalledWith(false);
    expect(alertSpy).toHaveBeenCalledWith("Post 1 was edited.");
    expect(resultSpy).toHaveBeenCalledWith(reportPostResponse);
  });

  it("should handle errors when editing the post", async () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = {
      id: 1,
      userId: 4,
      user: "me",
      text: "hi",
      date: new Date(),
      givenHugs: 0,
      sentHugs: [],
    };
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("isAdmin", false);
    const newText = "new text";
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: newText,
        date: new Date(),
        givenHugs: 0,
      },
    };
    await fixture.whenStable();

    const apiClientSpy = spyOn(popUp["apiClient"], "patch").and.returnValue(of(serverResponse));
    const updateReportSpy = spyOn(popUp, "updateReportIfNecessary").and.throwError("Error");
    const emitSpy = spyOn(popUp.editMode, "emit");
    const resultSpy = spyOn(popUp.updateResult, "emit");
    const alertSpy = spyOn(popUp["alertService"], "createSuccessAlert");
    const errorAlertSpy = spyOn(popUp["alertService"], "createAlert");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".sendData")[0].click();

    expect(validateSpy).toHaveBeenCalledWith("post");
    const updatedItem = { ...originalItem };
    updatedItem["text"] = newText;

    expect(apiClientSpy).toHaveBeenCalledWith(`posts/${originalItem.id}`, updatedItem);
    expect(updateReportSpy).toHaveBeenCalledWith(null, serverResponse);
    expect(emitSpy).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(resultSpy).not.toHaveBeenCalled();
    expect(errorAlertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "An error occurred: Error: Error",
    });
  });

  it("should send a different message if the report was closed", async () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("reportData", {
      reportID: 1,
      postID: 2,
      userID: 0,
    });
    fixture.componentRef.setInput("isAdmin", true);
    fixture.componentRef.setInput("editedItem", originalItem);
    const newText = "new text";
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: newText,
        date: new Date(),
        givenHugs: 0,
      },
    };
    const reportPostResponse = {
      success: true,
      updatedPost: {
        ...serverResponse.updated,
      },
      reportId: 1,
    };
    await fixture.whenStable();

    const apiClientSpy = spyOn(popUp["apiClient"], "patch").and.returnValue(of(serverResponse));
    const updateReportSpy = spyOn(popUp, "updateReportIfNecessary").and.returnValue(
      of(reportPostResponse),
    );
    const emitSpy = spyOn(popUp.editMode, "emit");
    const resultSpy = spyOn(popUp.updateResult, "emit");
    const alertSpy = spyOn(popUp["alertService"], "createSuccessAlert");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    popUpDOM.querySelector("#updateAndClose").click();

    expect(validateSpy).toHaveBeenCalledWith("post");
    const updatedItem = { ...originalItem };
    updatedItem["text"] = newText;

    expect(apiClientSpy).toHaveBeenCalledWith(`posts/${originalItem.id}`, updatedItem);
    expect(updateReportSpy).toHaveBeenCalledWith(true, serverResponse);
    expect(emitSpy).toHaveBeenCalledWith(false);
    expect(alertSpy).toHaveBeenCalledWith(
      "Report 1 was closed, and the associated post was edited!",
    );

    expect(resultSpy).toHaveBeenCalledWith(reportPostResponse);
  });

  it("should not try to close the report if the user chose not to", async () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("reportData", {
      reportID: 1,
      postID: 2,
      userID: 0,
    });
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("isAdmin", true);
    const newText = "new text";
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: newText,
        date: new Date(),
        givenHugs: 0,
      },
    };
    const reportPostResponse = {
      success: true,
      updatedPost: {
        ...serverResponse.updated,
      },
      reportId: undefined,
    };
    await fixture.whenStable();

    const apiClientSpy = spyOn(popUp["apiClient"], "patch").and.returnValue(of(serverResponse));
    const updateReportSpy = spyOn(popUp, "updateReportIfNecessary").and.returnValue(
      of(reportPostResponse),
    );
    const emitSpy = spyOn(popUp.editMode, "emit");
    const resultSpy = spyOn(popUp.updateResult, "emit");
    const alertSpy = spyOn(popUp["alertService"], "createSuccessAlert");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    popUpDOM.querySelector("#updateDontClose").click();

    expect(validateSpy).toHaveBeenCalledWith("post");
    const updatedItem = { ...originalItem };
    updatedItem["text"] = newText;

    expect(apiClientSpy).toHaveBeenCalledWith(`posts/${originalItem.id}`, updatedItem);
    expect(updateReportSpy).toHaveBeenCalledWith(false, serverResponse);
    expect(emitSpy).toHaveBeenCalledWith(false);
    expect(alertSpy).toHaveBeenCalledWith("Post 1 was edited.");
    expect(resultSpy).toHaveBeenCalledWith(reportPostResponse);
  });

  it("should close the report if the user chooses to", (done: DoneFn) => {
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: "new text",
        date: new Date(),
        givenHugs: 0,
      },
    };

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("reportData", {
      reportID: 2,
      postID: 1,
      userID: 0,
    });
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("isAdmin", true);
    const closeReportResponse = {
      success: true,
      updated: {
        id: 2,
        postID: 1,
        dismissed: false,
        closed: true,
        reportReason: "reason",
        date: new Date(),
        type: "Post" as ReportType,
        userID: 4,
        reporter: 1,
      },
    };
    const adminServiceSpy = spyOn(popUp["adminService"], "closeReport").and.returnValue(
      of(closeReportResponse),
    );

    (
      popUp.updateReportIfNecessary(true, serverResponse) as Observable<PostAndReportResponse>
    ).subscribe({
      next: (response) => {
        expect(response).toEqual({
          success: true,
          updatedPost: {
            ...serverResponse.updated,
          },
          reportId: 2,
        });

        expect(adminServiceSpy).toHaveBeenCalledWith(2, false, 1);
        done();
      },
    });
  });

  it("should not close the report if the user chooses not to", (done: DoneFn) => {
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: "new text",
        date: new Date(),
        givenHugs: 0,
      },
    };

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("reportData", {
      reportID: 1,
      postID: 2,
      userID: 0,
    });
    fixture.componentRef.setInput("isAdmin", true);
    const adminServiceSpy = spyOn(popUp["adminService"], "closeReport");

    (
      popUp.updateReportIfNecessary(false, serverResponse) as Observable<PostAndReportResponse>
    ).subscribe({
      next: (response) => {
        expect(response).toEqual({
          success: true,
          updatedPost: {
            ...serverResponse.updated,
          },
          reportId: undefined,
        });

        expect(adminServiceSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it("should not close the report if it's not the admin menu", (done: DoneFn) => {
    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("reportData", null);
    fixture.componentRef.setInput("isAdmin", false);
    const newText = "new text";
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: newText,
        date: new Date(),
        givenHugs: 0,
      },
    };
    const adminServiceSpy = spyOn(popUp["adminService"], "closeReport");

    (
      popUp.updateReportIfNecessary(false, serverResponse) as Observable<PostAndReportResponse>
    ).subscribe({
      next: (response) => {
        expect(response).toEqual({
          success: true,
          updatedPost: {
            ...serverResponse.updated,
          },
          reportId: undefined,
        });

        expect(adminServiceSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it("should not close the report if there's no report data", (done: DoneFn) => {
    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("reportData", null);
    fixture.componentRef.setInput("isAdmin", true);
    const newText = "new text";
    const serverResponse = {
      success: true,
      updated: {
        id: 1,
        userId: 4,
        user: "me",
        text: newText,
        date: new Date(),
        givenHugs: 0,
      },
    };
    const adminServiceSpy = spyOn(popUp["adminService"], "closeReport");

    (
      popUp.updateReportIfNecessary(true, serverResponse) as Observable<PostAndReportResponse>
    ).subscribe({
      error: (error) => {
        expect(error).toEqual("No report data provided. Cannot close the report.");
        expect(adminServiceSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it("should alert if the post isn't valid", async () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => ({ error: "error" }),
    );

    const fixture = TestBed.createComponent(PostEditFormComponent);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = { text: "hi", id: 2 } as PostGet;
    fixture.componentRef.setInput("editedItem", originalItem);
    fixture.componentRef.setInput("reportData", {
      reportID: 1,
      postID: 2,
      userID: 0,
    });
    fixture.componentRef.setInput("isAdmin", true);
    const newText = "new text";
    await fixture.whenStable();

    const apiClientSpy = spyOn(popUp["apiClient"], "patch");
    const alertSpy = spyOn(popUp["alertService"], "createAlert");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    popUpDOM.querySelector("#updateDontClose").click();

    expect(validateSpy).toHaveBeenCalledWith("post");
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({ type: "Error", message: "error" });
  });
});
