/*
  Site Policies
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
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute, RouterModule, UrlSegment } from "@angular/router";
import { of } from "rxjs";

import { SitePolicies } from "./sitePolicies.component";

describe("SitePolicies", () => {
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
      declarations: [SitePolicies],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check the page is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(SitePolicies);
    const sitePolicies = fixture.componentInstance;
    expect(sitePolicies).toBeTruthy();
  });

  // check the title is correct
  it("should show the correct policy and title - terms", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "terms" } as UrlSegment]);
    const fixture = TestBed.createComponent(SitePolicies);
    const sitePolicies = fixture.componentInstance;

    expect(sitePolicies.pageTitle).toEqual("Terms and Conditions");
    expect(sitePolicies.currentPolicy).toEqual("TermsConditions");
  });

  it("should show the correct policy and title - privacy", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "privacy" } as UrlSegment]);
    const fixture = TestBed.createComponent(SitePolicies);
    const sitePolicies = fixture.componentInstance;

    expect(sitePolicies.pageTitle).toEqual("Privacy Policy");
    expect(sitePolicies.currentPolicy).toEqual("PrivacyPolicy");
  });

  it("should show the correct policy and title - cookies", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "cookies" } as UrlSegment]);
    const fixture = TestBed.createComponent(SitePolicies);
    const sitePolicies = fixture.componentInstance;

    expect(sitePolicies.pageTitle).toEqual("Cookies Policy");
    expect(sitePolicies.currentPolicy).toEqual("CookiePolicy");
  });
});
