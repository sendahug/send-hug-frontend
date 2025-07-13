/*
  hasPermission Guard
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
import { provideRouter, Router, UrlSegment } from "@angular/router";
import {} from "jasmine";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";

import { hasPermissionGuard } from "./hasPermission.guard";
import { AuthService } from "@app/services/auth.service";

describe("hasPermissionGuard", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      declarations: [],
      providers: [provideRouter([]), MockAuthService],
    }).compileComponents();
  });

  it("should return true if the route has no required permission", (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      const hasPermissionResult = hasPermissionGuard({ path: "test", data: {} }, []);

      expect(hasPermissionResult).toBeTrue();
      done();
    });
  });

  it("should return true if the user has the right permission", (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      const authService = TestBed.inject(AuthService);
      const canUserSpy = spyOn(authService, "canUser").and.returnValue(true);

      const hasPermissionResult = hasPermissionGuard(
        { path: "test", data: { permission: "myPerm" } },
        [],
      );

      expect(hasPermissionResult).toBeTrue();
      expect(canUserSpy).toHaveBeenCalledWith("myPerm");
      done();
    });
  });

  it("should redirect to login if the user doesn't have the required permission", (done: DoneFn) => {
    TestBed.runInInjectionContext(() => {
      const authService = TestBed.inject(AuthService);
      const canUserSpy = spyOn(authService, "canUser").and.returnValue(false);

      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, "navigate");

      hasPermissionGuard({ path: "test", data: { permission: "myPerm" } }, [
        new UrlSegment("/test", {}),
      ]);

      expect(navigateSpy).toHaveBeenCalledWith(["/"], {
        queryParams: { redirect: encodeURIComponent("/test") },
      });

      expect(canUserSpy).toHaveBeenCalledWith("myPerm");
      done();
    });
  });
});
