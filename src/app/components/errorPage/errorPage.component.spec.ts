/*
	Error Page
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

// App imports
import { ErrorPage } from "./errorPage.component";

describe("ErrorPage", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [ErrorPage],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(ErrorPage);
    const errorPage = fixture.componentInstance;
    expect(errorPage).toBeTruthy();
  });

  // Check that the error page has the right error message
  it("should have an error message", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ErrorPage);
    const errorPage = fixture.componentInstance;
    const errorPageDOM = fixture.nativeElement;
    const error = {
      title: "Sorry!",
      message: `The page you were looking for doesn\'t exist.`,
      code: 404,
    };

    fixture.detectChanges();

    expect(errorPage.error).toEqual(error);
    expect(errorPageDOM.querySelectorAll("h3")[0].textContent).toBe(error.title);
    expect(errorPageDOM.querySelector("#errorCode").textContent).toContain(error.code);
    done();
  });

  // Check that the 'back' method is called when clicking the back button
  it("should call back method when clicking the back button", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ErrorPage);
    const errorPage = fixture.componentInstance;
    const errorPageDOM = fixture.nativeElement;
    const backSpy = spyOn(errorPage, "goBack").and.callThrough();
    const mockLocationSpy = spyOn(errorPage["location"], "back");

    fixture.detectChanges();

    // click the back button
    errorPageDOM.querySelector("#backBtn").click();
    fixture.detectChanges();

    expect(backSpy).toHaveBeenCalled();
    expect(mockLocationSpy).toHaveBeenCalled();
    done();
  });
});
