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
import { ActivatedRoute, RouterModule, UrlSegment } from "@angular/router";
import { of } from "rxjs";

import { AdminDashboard } from "./adminDashboard.component";
import { AuthService } from "@common/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { AdminReports } from "@admin/components/adminReports/adminReports.component";
import { AdminBlocks } from "@admin/components/adminBlocks/adminBlocks.component";
import { AdminFilters } from "@admin/components/adminFilters/adminFilters.component";
import { AppCommonModule } from "@app/common/common.module";

describe("AdminDashboard", () => {
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
        AppCommonModule,
      ],
      declarations: [AdminDashboard, AdminReports, AdminBlocks, AdminFilters],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    // make sure the test goes through with admin permission
    const authService = TestBed.inject(AuthService) as AuthService;
    spyOn(authService, "canUser").and.returnValue(true);
    authService.isUserDataResolved.next(true);
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    expect(adminDashboard).toBeTruthy();
  });

  it("should set the page correctly - reports", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "reports" } as UrlSegment]);
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    expect(adminDashboard.screen).toEqual("reports");
  });

  it("should set the page correctly - blocks", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "blocks" } as UrlSegment]);
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    expect(adminDashboard.screen).toEqual("blocks");
  });

  it("should set the page correctly - filters", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "filters" } as UrlSegment]);
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    expect(adminDashboard.screen).toEqual("filters");
  });

  it("should wait for user data to be resolved", () => {
    const authService = TestBed.inject(AuthService);
    authService.isUserDataResolved.next(false);
    const authServiceSpy = spyOn(authService.isUserDataResolved, "subscribe").and.callThrough();
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    adminDashboard.ngOnInit();

    expect(authServiceSpy).toHaveBeenCalled();
    expect(adminDashboard.waitFor).toEqual("admin ");

    authService.isUserDataResolved.next(true);

    expect(adminDashboard.waitFor).toEqual("admin main");
  });
});
