/*
	Loader
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
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { provideZoneChangeDetection } from "@angular/core";

import { Loader } from "./loader.component";

describe("Loader", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [Loader],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    expect(loader).toBeTruthy();
  });

  // Check that the component displays a loading message
  // TODO: Enable this once I figure out a way around Istanbul messing with
  // the declarations
  // it("should display a loading message passed in from the parent", (done: DoneFn) => {
  //   const fixture = TestBed.createComponent(Loader);
  //   const loader = fixture.componentInstance;
  //   const loaderDOM = fixture.nativeElement;
  //   fixture.componentRef.setInput("loadingMessage", "Fetching user data...");
  //   fixture.detectChanges();

  //   expect(loader.loadingMessage()).toBeDefined();
  //   expect(loader.loadingMessage()).toBe("Fetching user data...");
  //   expect(loaderDOM.querySelector("#loadingMessage")).toBeTruthy();
  //   expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.loadingMessage());
  //   done();
  // });

  it("should display a default message if waitingFor is null", () => {
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;
    fixture.detectChanges();

    expect(loader.loadingMessage()).toBe("Loading...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe("Loading...");
  });
});
