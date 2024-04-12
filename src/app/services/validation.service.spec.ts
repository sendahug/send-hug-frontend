/*
	Validation Service
	Send a Hug Service Tests
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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { FormControl } from "@angular/forms";

import { ValidationService } from "./validation.service";

describe("PostsService", () => {
  let validationService: ValidationService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValidationService],
      declarations: [],
    }).compileComponents();

    validationService = TestBed.inject(ValidationService);
  });

  // Check the service is created
  it("should be created", () => {
    expect(validationService).toBeTruthy();
  });

  it("should validate posts correctly - too short", () => {
    const post = "";
    const control = new FormControl(post);
    const res = validationService.validateItemAgainst("post")(control);

    expect(res).toEqual({
      error: "Post text cannot be empty. Please fill the field and try again.",
    });
  });

  it("should validate posts correctly - too long", () => {
    let post = "";

    for (let i = 100; i < 200; i++) {
      post += i * 500;
    }

    const control = new FormControl(post);
    const res = validationService.validateItemAgainst("post")(control);

    expect(res).toEqual({
      error: "Post text cannot be over 480 characters! Please shorten it and try again.",
    });
  });

  it("should validate posts correctly - valid", () => {
    const post = "hello";
    const control = new FormControl(post);
    const res = validationService.validateItemAgainst("post")(control);

    expect(res).toBeNull();
  });

  it("should validate messages correctly - too short", () => {
    const message = "";
    const control = new FormControl(message);
    const res = validationService.validateItemAgainst("message")(control);

    expect(res).toEqual({
      error: "A message cannot be empty. Please fill the field and try again.",
    });
  });

  it("should validate messages correctly - too long", () => {
    let message = "";

    for (let i = 100; i < 200; i++) {
      message += i * 500;
    }

    const control = new FormControl(message);
    const res = validationService.validateItemAgainst("message")(control);

    expect(res).toEqual({
      error: "A message cannot be over 480 characters! Please shorten it and try again.",
    });
  });

  it("should validate messages correctly - valid", () => {
    const message = "hello";
    const control = new FormControl(message);
    const res = validationService.validateItemAgainst("message")(control);

    expect(res).toBeNull();
  });

  it("should validate display names correctly - too short", () => {
    const name = "";
    const control = new FormControl(name);
    const res = validationService.validateItemAgainst("displayName")(control);

    expect(res).toEqual({
      error: "New display name cannot be empty. Please fill the field and try again.",
    });
  });

  it("should validate display names correctly - too long", () => {
    let name = "";

    for (let i = 100; i < 200; i++) {
      name += i * 500;
    }

    const control = new FormControl(name);
    const res = validationService.validateItemAgainst("displayName")(control);

    expect(res).toEqual({
      error: "New display name cannot be over 60 characters! Please shorten it and try again.",
    });
  });

  it("should validate display names correctly - valid", () => {
    const name = "hello";
    const control = new FormControl(name);
    const res = validationService.validateItemAgainst("displayName")(control);

    expect(res).toBeNull();
  });

  it("should validated report - other reason correctly - too short", () => {
    const reason = "";
    const control = new FormControl(reason);
    const res = validationService.validateItemAgainst("reportOther")(control);

    expect(res).toEqual({
      error: "Report reason cannot be empty. Please fill the field and try again.",
    });
  });

  it("should validate report - other reason correctly - too long", () => {
    let reason = "";

    for (let i = 100; i < 200; i++) {
      reason += i * 10;
    }

    const control = new FormControl(reason);
    const res = validationService.validateItemAgainst("reportOther")(control);

    expect(res).toEqual({
      error: "Report reason cannot be over 120 characters! Please shorten it and try again.",
    });
  });

  it("should validate report - other reason correctly - valid", () => {
    const reason = "hello";
    const control = new FormControl(reason);
    const res = validationService.validateItemAgainst("reportOther")(control);

    expect(res).toBeNull();
  });

  it("should return true for not required", () => {
    const emptyReason = "";
    validationService.validationRules.reportOther.required = false;
    const control = new FormControl(emptyReason);

    // check the valid reason
    const res = validationService.validateItemAgainst("reportOther")(control);

    expect(res).toBeNull();
  });
});
