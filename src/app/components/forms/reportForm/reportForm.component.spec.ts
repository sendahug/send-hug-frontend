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
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { provideZoneChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";

import { ReportForm } from "./reportForm.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { PopUp } from "@app/components/popUp/popUp.component";
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
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, PopUp, RouterLink, ReportForm],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        MockAuthService,
        MockAPIClient,
      ],
    }).compileComponents();
  });

  // Check that the reported post is shown
  it("shows the reported post", () => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };

    fixture.detectChanges();

    expect(popUpDOM.querySelector("#reportItem")).toBeTruthy();
    expect(popUpDOM.querySelectorAll(".userPost")).toBeTruthy();
    expect(popUpDOM.querySelector("#reportText").textContent).toBe("hi");
  });

  // Check that the reported user's display name is shown
  it("shows the reported user's name", () => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "User";
    popUp.reportedItem = {
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
    };

    fixture.detectChanges();

    expect(popUpDOM.querySelector("#uReportText")).toBeTruthy();
    expect(popUpDOM.querySelector("#uReportText").textContent).toBe("string");
  });

  // Check that the correct radio button is set as selected
  it("correctly identifies the chosen radio button", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };
    const selectSpy = spyOn(popUp, "checkSelectedForOther").and.callThrough();
    fixture.detectChanges();

    // select option 1
    popUpDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    // check the first option was selected
    expect(selectSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalledWith(popUpDOM.querySelector("#pRadioOption0"));
    expect(popUp.reportForm.controls.selectedReason.value).toEqual("0");

    // select option 2
    popUpDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();

    // check the second option was selected
    expect(selectSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalledWith(popUpDOM.querySelector("#pRadioOption1"));
    expect(popUp.reportForm.controls.selectedReason.value).toEqual("1");

    // select option 3
    popUpDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();

    // check the third option was selected
    expect(selectSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalledWith(popUpDOM.querySelector("#pRadioOption2"));
    expect(popUp.reportForm.controls.selectedReason.value).toEqual("2");

    // select option 4
    popUpDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    // check the fourth option was selected
    expect(selectSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalledWith(popUpDOM.querySelector("#pRadioOption3"));
    expect(popUp.reportForm.controls.selectedReason.value).toEqual("3");
    done();
  });

  it("checkSelectedForOther() - correctly enables/disables the 'other' text field", () => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "User";
    popUp.reportedItem = {
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
    };
    const otherTextField = document.getElementById("rOption3Text") as HTMLInputElement;

    popUp.checkSelectedForOther(popUpDOM.querySelector("#pRadioOption0"));
    fixture.detectChanges();
    expect(otherTextField.disabled).toBe(true);

    popUp.checkSelectedForOther(popUpDOM.querySelector("#pRadioOption1"));
    fixture.detectChanges();
    expect(otherTextField.disabled).toBe(true);

    popUp.checkSelectedForOther(popUpDOM.querySelector("#pRadioOption2"));
    fixture.detectChanges();
    expect(otherTextField.disabled).toBe(true);

    popUp.checkSelectedForOther(popUpDOM.querySelector("#pRadioOption3"));
    fixture.detectChanges();
    expect(otherTextField.disabled).toBe(false);
  });

  it("Correctly sets the required and aria-required attributes", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };
    const otherTextField = document.getElementById("rOption3Text") as HTMLInputElement;

    popUpDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();
    expect(otherTextField.required).toBe(false);
    expect(otherTextField.getAttribute("aria-required")).toEqual("false");

    popUpDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();
    expect(otherTextField.required).toBe(false);
    expect(otherTextField.getAttribute("aria-required")).toEqual("false");

    popUpDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();
    expect(otherTextField.required).toBe(true);
    expect(otherTextField.getAttribute("aria-required")).toEqual("true");

    popUpDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();
    expect(otherTextField.required).toBe(false);
    expect(otherTextField.getAttribute("aria-required")).toEqual("false");

    done();
  });

  it("getSelectedReasonText() - correctly sets the selected reason - posts", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };

    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toBe(undefined);

    popUpDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("The post is Inappropriate");

    popUpDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("The post is Spam");

    popUpDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("The post is Offensive");

    popUpDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("other");

    done();
  });

  it("getSelectedReasonText() - correctly sets the selected reason - users", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "User";
    popUp.reportedItem = {
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
    };

    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toBe(undefined);

    popUpDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("The user is posting Spam");

    popUpDOM.querySelector("#pRadioOption1").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual(
      "The user is posting harmful / dangerous content",
    );

    popUpDOM.querySelector("#pRadioOption2").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("The user is behaving in an abusive manner");

    popUpDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();
    expect(popUp.getSelectedReasonText()).toEqual("other");

    done();
  });

  // Check that if the user chooses 'other' as reason they can't submit an
  // empty reason
  it("requires text if the chosen reason is other - invalid", (done: DoneFn) => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };
    const apiClientSpy = spyOn(popUp["apiClient"], "post");
    const alertServiceSpy = spyOn(popUp["alertsService"], "createAlert");
    fixture.detectChanges();

    // select option 4
    popUpDOM.querySelector("#pRadioOption3").click();
    fixture.detectChanges();

    // try to submit it without text in the textfield
    popUpDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // check the report wasn't sent and the user was alerted
    expect(validateSpy).toHaveBeenCalledWith("reportOther");
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(alertServiceSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "If you choose 'other', you must specify a reason.",
    });
    done();
  });

  it("requires text if the chosen reason is other - valid", (done: DoneFn) => {
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

    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };
    const apiClientSpy = spyOn(popUp["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(popUp["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(popUp.reportMode, "emit");
    const reportReason = "because";
    const otherText = popUpDOM.querySelector("#rOption3Text");
    fixture.detectChanges();

    // select option 4
    popUpDOM.querySelector("#pRadioOption3").click();
    otherText.value = reportReason;
    otherText.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(popUp.reportForm.controls.otherReason.value).toEqual(reportReason);

    // try to submit it
    popUpDOM.querySelectorAll(".reportButton")[0].click();
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
    done();
  });

  it("creates the report and sends it to the itemsService - post", (done: DoneFn) => {
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

    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "Post";
    popUp.reportedItem = {
      id: 1,
      givenHugs: 0,
      sentHugs: [],
      user: "name",
      userId: 2,
      text: "hi",
      date: new Date(),
    };
    const apiClientSpy = spyOn(popUp["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(popUp["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(popUp.reportMode, "emit");
    fixture.detectChanges();

    // select option 1
    popUpDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    // try to submit it without text in the textfield
    popUpDOM.querySelectorAll(".reportButton")[0].click();
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
    done();
  });

  it("creates the report and sends it to the itemsService - user", (done: DoneFn) => {
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

    const fixture = TestBed.createComponent(ReportForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.reportType = "User";
    popUp.reportedItem = {
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
    };
    const apiClientSpy = spyOn(popUp["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(popUp["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(popUp.reportMode, "emit");
    fixture.detectChanges();

    // select option 1
    popUpDOM.querySelector("#pRadioOption0").click();
    fixture.detectChanges();

    // try to submit it without text in the textfield
    popUpDOM.querySelectorAll(".reportButton")[0].click();
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
    done();
  });
});
