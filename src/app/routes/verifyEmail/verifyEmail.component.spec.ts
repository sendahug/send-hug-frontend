/*
	Email Verification Page
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
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { provideRouter } from "@angular/router";
import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

import { VerifyEmailPage } from "./verifyEmail.component";
import { mockAuthedUser } from "@tests/mockData";
import { AuthService } from "@app/services/auth.service";

describe("VerifyEmailPage", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(false),
      userData: signal(undefined),
      isUserDataResolved: new BehaviorSubject(false),
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonModule, VerifyEmailPage],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        MockAuthService,
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(VerifyEmailPage);
    const verifyEmailPage = fixture.componentInstance;
    expect(verifyEmailPage).toBeTruthy();
  });

  it("should wait for the user's login to be resolved", () => {
    const fixture = TestBed.createComponent(VerifyEmailPage);
    const verifyEmailPage = fixture.componentInstance;
    const verifyEmailPageDOM = fixture.nativeElement;
    const verifySpy = spyOn(verifyEmailPage, "verifyEmail");
    verifyEmailPage["authService"].authenticated.set(true);
    verifyEmailPage["authService"].userData.set(mockAuthedUser);
    fixture.detectChanges();

    expect(verifyEmailPage.loadingAuth()).toBeTrue();
    expect(verifyEmailPageDOM.querySelector("app-loader")).toBeDefined();
    expect(verifyEmailPageDOM.querySelector("#logoutBox")).toBeNull();
    verifyEmailPage["authService"].isUserDataResolved.next(true);
    fixture.detectChanges();

    expect(verifyEmailPage.loadingAuth()).toBeFalse();
    expect(verifySpy).toHaveBeenCalled();
    expect(verifyEmailPageDOM.querySelector("app-loader")).toBeNull();
    expect(verifyEmailPageDOM.querySelector("#logoutBox")).toBeDefined();
  });

  it("should verify the email of unverified users", () => {
    const fixture = TestBed.createComponent(VerifyEmailPage);
    const verifyEmailPage = fixture.componentInstance;
    verifyEmailPage["authService"].authenticated.set(true);
    verifyEmailPage["authService"].userData.set({ ...mockAuthedUser, emailVerified: false });
    const updateSpy = spyOn(verifyEmailPage["authService"], "updateUserData");
    const routerSpy = spyOn(verifyEmailPage["router"], "navigate");
    fixture.detectChanges();

    verifyEmailPage.verifyEmail();
    fixture.detectChanges();

    expect(updateSpy).toHaveBeenCalledWith({ emailVerified: true });
    expect(routerSpy).toHaveBeenCalledWith(["/"]);
  });

  it("shouldn't verify the email of verified users", () => {
    const fixture = TestBed.createComponent(VerifyEmailPage);
    const verifyEmailPage = fixture.componentInstance;
    verifyEmailPage["authService"].authenticated.set(true);
    verifyEmailPage["authService"].userData.set(mockAuthedUser);
    const updateSpy = spyOn(verifyEmailPage["authService"], "updateUserData");
    const routerSpy = spyOn(verifyEmailPage["router"], "navigate");
    fixture.detectChanges();

    verifyEmailPage.verifyEmail();
    fixture.detectChanges();

    expect(updateSpy).not.toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(["/"]);
  });

  it("should do nothing if the user isn't authenticated", () => {
    const fixture = TestBed.createComponent(VerifyEmailPage);
    const verifyEmailPage = fixture.componentInstance;
    verifyEmailPage["authService"].authenticated.set(true);
    verifyEmailPage["authService"].userData.set(undefined);
    const updateSpy = spyOn(verifyEmailPage["authService"], "updateUserData");
    const routerSpy = spyOn(verifyEmailPage["router"], "navigate");
    fixture.detectChanges();

    verifyEmailPage.verifyEmail();
    fixture.detectChanges();

    expect(updateSpy).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
