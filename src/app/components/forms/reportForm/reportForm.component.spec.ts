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
import { provideRouter, RouterLink } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { provideZonelessChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";

import { ReportFormComponent } from "./reportForm.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { PopUpComponent } from "@common/popUp/popUp.component";
import { ValidationService } from "@app/services/validation.service";
import { ApiClientService } from "@app/services/apiClient.service";

describe("Report", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
    });
    const MockAPIClient = MockProvider(ApiClientService, {
      post: () => of(),
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, PopUpComponent, RouterLink, ReportFormComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter([]),
        MockAuthService,
        MockAPIClient,
      ],
    }).compileComponents();
  });

  // Check that the reported post is shown
  it("shows the reported post", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });
    fixture.detectChanges();

    expect(reportFormDOM.querySelector("#reportItem")).toBeTruthy();
    expect(reportFormDOM.querySelectorAll(".userPost")).toBeTruthy();
    expect(reportFormDOM.querySelector("#reportText").textContent).toBe("hi");
  });

  // Check that the reported user's display name is shown
  it("shows the reported user's name", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "User");
    fixture.componentRef.setInput("reportedItem", {
      id: 3,
      displayName: "string",
      receivedH: 3,
      givenH: 4,
      posts: 2,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });

    fixture.detectChanges();

    expect(reportFormDOM.querySelector("#uReportText")).toBeTruthy();
    expect(reportFormDOM.querySelector("#uReportText").textContent).toBe("string");
  });

  // Check that the correct radio button is set as selected
  it("correctly identifies the chosen radio button", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });
    const selectSpy = spyOn(reportForm, "checkSelectedForOther").and.callThrough();
    fixture.detectChanges();

    // select option 1
    reportFormDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    // check the first option was selected
    expect(selectSpy).toHaveBeenCalledWith(reportFormDOM.querySelector("#pRadioOption0"));
    expect(reportForm.reportForm.controls.selectedReason.value).toEqual("0");

    // select option 2
    reportFormDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();

    // check the second option was selected
    expect(selectSpy).toHaveBeenCalledWith(reportFormDOM.querySelector("#pRadioOption1"));
    expect(reportForm.reportForm.controls.selectedReason.value).toEqual("1");

    // select option 3
    reportFormDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();

    // check the third option was selected
    expect(selectSpy).toHaveBeenCalledWith(reportFormDOM.querySelector("#pRadioOption2"));
    expect(reportForm.reportForm.controls.selectedReason.value).toEqual("2");

    // select option 4
    reportFormDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    // check the fourth option was selected
    expect(selectSpy).toHaveBeenCalledWith(reportFormDOM.querySelector("#pRadioOption3"));
    expect(reportForm.reportForm.controls.selectedReason.value).toEqual("3");
  });

  it("checkSelectedForOther() - correctly enables/disables the 'other' text field", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "User");
    fixture.componentRef.setInput("reportedItem", {
      id: 3,
      displayName: "string",
      receivedH: 3,
      givenH: 4,
      posts: 2,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    fixture.detectChanges();
    const otherTextField = document.getElementById("rOption3Text") as HTMLInputElement;

    reportForm.checkSelectedForOther(reportFormDOM.querySelector("#pRadioOption0"));
    fixture.detectChanges();

    expect(otherTextField.disabled).toBe(true);

    reportForm.checkSelectedForOther(reportFormDOM.querySelector("#pRadioOption1"));
    fixture.detectChanges();

    expect(otherTextField.disabled).toBe(true);

    reportForm.checkSelectedForOther(reportFormDOM.querySelector("#pRadioOption2"));
    fixture.detectChanges();

    expect(otherTextField.disabled).toBe(true);

    reportForm.checkSelectedForOther(reportFormDOM.querySelector("#pRadioOption3"));
    fixture.detectChanges();

    expect(otherTextField.disabled).toBe(false);
  });

  it("Correctly sets the required and aria-required attributes", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });
    fixture.detectChanges();
    const otherTextField = document.getElementById("rOption3Text") as HTMLInputElement;

    reportFormDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    expect(otherTextField.required).toBe(false);
    expect(otherTextField.getAttribute("aria-required")).toEqual("false");

    reportFormDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();

    expect(otherTextField.required).toBe(false);
    expect(otherTextField.getAttribute("aria-required")).toEqual("false");

    reportFormDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    expect(otherTextField.required).toBe(true);
    expect(otherTextField.getAttribute("aria-required")).toEqual("true");

    reportFormDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();

    expect(otherTextField.required).toBe(false);
    expect(otherTextField.getAttribute("aria-required")).toEqual("false");
  });

  it("getSelectedReasonText() - correctly sets the selected reason - posts", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });

    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toBe(undefined);

    reportFormDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("The post is Inappropriate");

    reportFormDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("The post is Spam");

    reportFormDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("The post is Offensive");

    reportFormDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("other");
  });

  it("getSelectedReasonText() - correctly sets the selected reason - users", () => {
    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "User");
    fixture.componentRef.setInput("reportedItem", {
      id: 3,
      displayName: "string",
      receivedH: 3,
      givenH: 4,
      posts: 2,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });

    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toBe(undefined);

    reportFormDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("The user is posting Spam");

    reportFormDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual(
      "The user is posting harmful / dangerous content",
    );

    reportFormDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("The user is behaving in an abusive manner");

    reportFormDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    expect(reportForm.getSelectedReasonText()).toEqual("other");
  });

  // Check that if the user chooses 'other' as reason they can't submit an
  // empty reason
  it("requires text if the chosen reason is other - invalid", () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });
    const apiClientSpy = spyOn(reportForm["apiClient"], "post");
    const alertServiceSpy = spyOn(reportForm["alertsService"], "createAlert");
    fixture.detectChanges();

    // select option 4
    reportFormDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    // try to submit it without text in the textfield
    reportFormDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // check the report wasn't sent and the user was alerted
    expect(validateSpy).toHaveBeenCalledWith("reportOther");
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(alertServiceSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "If you choose 'other', you must specify a reason.",
    });
  });

  it("requires text if the chosen reason is other - valid", () => {
    // mock response
    const mockResponse = {
      report: {
        closed: false,
        date: "Tue Jun 23 2020 14:59:31 GMT+0300",
        dismissed: false,
        id: 36,
        reportReason: "because",
        reporter: 2,
        type: "Post",
        postID: 1,
      },
      success: true,
    };

    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });
    fixture.detectChanges();
    const apiClientSpy = spyOn(reportForm["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(reportForm["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(reportForm.reportMode, "emit");
    const reportReason = "because";
    const otherText = reportFormDOM.querySelector("#rOption3Text");

    // select option 4
    reportFormDOM.querySelector("#pRadioOption3").click();
    otherText.value = reportReason;
    otherText.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(reportForm.reportForm.controls.otherReason.value).toEqual(reportReason);

    // try to submit it
    reportFormDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // check the report was sent
    const report = {
      type: "Post",
      postID: 1,
      reportReason: "because",
      dismissed: false,
      closed: false,
    };

    expect(validateSpy).toHaveBeenCalledWith("reportOther");
    expect(apiClientSpy).toHaveBeenCalledWith("reports", jasmine.objectContaining(report));
    expect(alertsSpy).toHaveBeenCalledWith(`Post number 1 was successfully reported.`, {
      navigate: true,
      navTarget: "/",
      navText: "Home Page",
    });

    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it("creates the report and sends it to the itemsService - post", () => {
    // mock response
    const mockResponse = {
      report: {
        closed: false,
        date: "Tue Jun 23 2020 14:59:31 GMT+0300",
        dismissed: false,
        id: 36,
        reportReason: "The user is posting Spam",
        reporter: 2,
        type: "Post",
        postID: 1,
      },
      success: true,
    };

    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "Post");
    fixture.componentRef.setInput("reportedItem", {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    });
    const apiClientSpy = spyOn(reportForm["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(reportForm["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(reportForm.reportMode, "emit");
    fixture.detectChanges();

    // select option 1
    reportFormDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    // try to submit it without text in the textfield
    reportFormDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // check the report wasn't sent and the user was alerted
    const report = {
      type: "Post",
      userID: 2,
      postID: 1,
      reportReason: "The post is Inappropriate",
      dismissed: false,
      closed: false,
    };

    expect(apiClientSpy).toHaveBeenCalledWith("reports", jasmine.objectContaining(report));
    expect(alertsSpy).toHaveBeenCalledWith(`Post number 1 was successfully reported.`, {
      navigate: true,
      navTarget: "/",
      navText: "Home Page",
    });

    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it("creates the report and sends it to the itemsService - user", () => {
    // mock response
    const mockResponse = {
      report: {
        closed: false,
        date: "Tue Jun 23 2020 14:59:31 GMT+0300",
        dismissed: false,
        id: 36,
        reportReason: "The user is posting Spam",
        reporter: 2,
        type: "User",
        userID: 3,
      },
      success: true,
    };

    const fixture = TestBed.createComponent(ReportFormComponent);
    const reportForm = fixture.componentInstance;
    const reportFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("reportType", "User");
    fixture.componentRef.setInput("reportedItem", {
      id: 3,
      displayName: "string",
      receivedH: 3,
      givenH: 4,
      posts: 2,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    const apiClientSpy = spyOn(reportForm["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(reportForm["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(reportForm.reportMode, "emit");
    fixture.detectChanges();

    // select option 1
    reportFormDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    // try to submit it without text in the textfield
    reportFormDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // check the report wasn't sent and the user was alerted
    const report = {
      type: "User",
      userID: 3,
      postID: undefined,
      reportReason: "The user is posting Spam",
      dismissed: false,
      closed: false,
    };

    expect(apiClientSpy).toHaveBeenCalledWith("reports", jasmine.objectContaining(report));
    expect(alertsSpy).toHaveBeenCalledWith(`User 3 was successfully reported.`, {
      navigate: true,
      navTarget: "/",
      navText: "Home Page",
    });

    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
