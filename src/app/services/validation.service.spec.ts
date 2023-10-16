/*
	Validation Service
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
import { Component } from "@angular/core";

import { ValidationService } from "./validation.service";

// Mock Page for testing toggleErrorIndicator
// ==================================================
@Component({
  selector: "app-page-mock",
  template: `
    <input
      type="text"
      id="mockTextField"
      value="{{ editedItem }}"
      required
      aria-invalid="false"
      aria-required="true"
    />
  `,
})
class MockPage {
  editedItem = "";

  constructor(private validationService: ValidationService) {}
}

describe("PostsService", () => {
  let validationService: ValidationService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValidationService],
      declarations: [MockPage],
    }).compileComponents();

    validationService = TestBed.inject(ValidationService);
  });

  // Check the service is created
  it("should be created", () => {
    expect(validationService).toBeTruthy();
  });

  it("should validate posts correctly", () => {
    const validPost = "hello";
    let longPost = "";

    for (let i = 100; i < 200; i++) {
      longPost += i * 500;
    }

    const postsToTest = ["", longPost];
    const responses = [
      "Post text cannot be empty. Please fill the field and try again.",
      "Post text cannot be over 480 characters! Please shorten the post and try again.",
    ];

    const alertSpy = spyOn(validationService["alertsService"], "createAlert");
    const toggleSpy = spyOn(validationService, "toggleErrorIndicator");

    // check the valid post
    const res = validationService.validateItem("post", validPost, "el");

    expect(res).toBe(true);
    expect(toggleSpy).toHaveBeenCalledWith(true, "el");
    expect(alertSpy).not.toHaveBeenCalled();

    // check the invalid posts
    postsToTest.forEach((post, index) => {
      const res = validationService.validateItem("post", post, "el");

      expect(res).toBe(false);
      expect(toggleSpy).toHaveBeenCalledWith(false, "el");
      expect(alertSpy).toHaveBeenCalledWith({ type: "Error", message: responses[index] });
    });
  });

  it("should validate messages correctly", () => {
    const validMessage = "hello";
    let longMessage = "";

    for (let i = 100; i < 200; i++) {
      longMessage += i * 500;
    }

    const messagesToTest = ["", longMessage];
    const responses = [
      "A message cannot be empty. Please fill the field and try again.",
      "Message text cannot be over 480 characters! Please shorten the message and try again.",
    ];

    const alertSpy = spyOn(validationService["alertsService"], "createAlert");
    const toggleSpy = spyOn(validationService, "toggleErrorIndicator");

    // check the valid message
    const res = validationService.validateItem("message", validMessage, "el");

    expect(res).toBe(true);
    expect(toggleSpy).toHaveBeenCalledWith(true, "el");
    expect(alertSpy).not.toHaveBeenCalled();

    // check the invalid messages
    messagesToTest.forEach((mess, index) => {
      const res = validationService.validateItem("message", mess, "el");

      expect(res).toBe(false);
      expect(toggleSpy).toHaveBeenCalledWith(false, "el");
      expect(alertSpy).toHaveBeenCalledWith({ type: "Error", message: responses[index] });
    });
  });

  it("should validate display names correctly", () => {
    const validName = "hello";
    let longName = "";

    for (let i = 0; i < 50; i++) {
      longName += i;
    }

    const namesToTest = ["", longName];
    const responses = [
      "New display name cannot be empty. Please fill the field and try again.",
      "New display name cannot be over 60 characters! Please shorten the name and try again.",
    ];

    const alertSpy = spyOn(validationService["alertsService"], "createAlert");
    const toggleSpy = spyOn(validationService, "toggleErrorIndicator");

    // check the valid name
    const res = validationService.validateItem("displayName", validName, "el");

    expect(res).toBe(true);
    expect(toggleSpy).toHaveBeenCalledWith(true, "el");
    expect(alertSpy).not.toHaveBeenCalled();

    // check the invalid namesToTest
    namesToTest.forEach((name, index) => {
      const res = validationService.validateItem("displayName", name, "el");

      expect(res).toBe(false);
      expect(toggleSpy).toHaveBeenCalledWith(false, "el");
      expect(alertSpy).toHaveBeenCalledWith({ type: "Error", message: responses[index] });
    });
  });

  it("should validate report - other reason correctly", () => {
    const validReason = "hello";
    let longReason = "";

    for (let i = 100; i < 200; i++) {
      longReason += i * 10;
    }

    const reasonsToTest = ["", longReason];
    const responses = [
      "The 'other' field cannot be empty.",
      "Report reason cannot be over 120 characters! Please shorten the message and try again.",
    ];

    const alertSpy = spyOn(validationService["alertsService"], "createAlert");
    const toggleSpy = spyOn(validationService, "toggleErrorIndicator");

    // check the valid reason
    const res = validationService.validateItem("reportOther", validReason, "el");

    expect(res).toBe(true);
    expect(toggleSpy).toHaveBeenCalledWith(true, "el");
    expect(alertSpy).not.toHaveBeenCalled();

    // check the invalid reason
    reasonsToTest.forEach((reason, index) => {
      const res = validationService.validateItem("reportOther", reason, "el");

      expect(res).toBe(false);
      expect(toggleSpy).toHaveBeenCalledWith(false, "el");
      expect(alertSpy).toHaveBeenCalledWith({ type: "Error", message: responses[index] });
    });
  });

  it("should return true for emptyAllowed", () => {
    const emptyReason = "";
    const alertSpy = spyOn(validationService["alertsService"], "createAlert");
    const toggleSpy = spyOn(validationService, "toggleErrorIndicator");
    validationService.validationRules.reportOther.emptyAllowed = true;

    // check the valid reason
    const res = validationService.validateItem("reportOther", emptyReason, "el");

    expect(res).toBe(true);
    expect(toggleSpy).toHaveBeenCalledWith(true, "el");
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("should toggle error indicator on", () => {
    const fixture = TestBed.createComponent(MockPage);
    const mockPage = fixture.componentInstance;
    const mockPageDOM = fixture.nativeElement;
    const textField = mockPageDOM.querySelector("#mockTextField");

    mockPage["validationService"].toggleErrorIndicator(false, "mockTextField");

    expect(textField.classList).toContain("missing");
    expect(textField.getAttribute("aria-invalid")).toEqual("true");
  });

  it("should toggle error indicator off", () => {
    const fixture = TestBed.createComponent(MockPage);
    const mockPage = fixture.componentInstance;
    const mockPageDOM = fixture.nativeElement;
    const textField = mockPageDOM.querySelector("#mockTextField");

    mockPage["validationService"].toggleErrorIndicator(true, "mockTextField");

    expect(textField.classList).not.toContain("missing");
    expect(textField.getAttribute("aria-invalid")).toEqual("false");
  });

  it("should toggle missing off if it's on", () => {
    const fixture = TestBed.createComponent(MockPage);
    const mockPage = fixture.componentInstance;
    const mockPageDOM = fixture.nativeElement;
    const textField = mockPageDOM.querySelector("#mockTextField");

    mockPage["validationService"].toggleErrorIndicator(false, "mockTextField");

    expect(textField.classList).toContain("missing");

    mockPage["validationService"].toggleErrorIndicator(true, "mockTextField");

    expect(textField.classList).not.toContain("missing");
  });
});
