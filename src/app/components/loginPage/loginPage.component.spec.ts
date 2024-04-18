/*
	User Page
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
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { LoginPage } from "./loginPage.component";
import { AuthService } from "@common/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { AppCommonModule } from "@app/common/common.module";

describe("LoginPage", () => {
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
      declarations: [LoginPage],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    expect(loginPage).toBeTruthy();
  });

  // Check that the 'please login page' is shown if the user's logged out
  it("should show login page if user is not authenticated", (done: DoneFn) => {
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(false);
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);

    fixture.detectChanges();

    expect(loginPageDOM.querySelector("#logoutBox")).toBeNull();
    expect(loginPageDOM.querySelector("#loginBox")).toBeTruthy();
    done();
  });

  // Check that the login button triggers the AuthService's login method
  it("should trigger the AuthService upon clicking login", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    const loginSpy = spyOn(loginPage, "login").and.callThrough();
    const serviceLoginSpy = spyOn(loginPage.authService, "login");
    loginPage.authService.authenticated.set(false);

    fixture.detectChanges();

    // check that the user isn't logged in before the click
    expect(loginPage.authService.authenticated()).toBeFalse();
    expect(loginPageDOM.querySelector("#loginBox")).toBeTruthy();

    // trigger click on the login button
    loginPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    // check the login methods were called
    expect(loginSpy).toHaveBeenCalled();
    expect(serviceLoginSpy).toHaveBeenCalled();
    done();
  });

  it("should show logout page if user is authenticated", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(true);
    loginPage.authService.userData.set({ ...mockAuthedUser });

    fixture.detectChanges();

    expect(loginPageDOM.querySelector("#loginBox")).toBeNull();
    expect(loginPageDOM.querySelector("#logoutBox")).toBeTruthy();
    expect(loginPageDOM.querySelectorAll(".errorMessage")[0].textContent).toContain(
      "You are already logged in",
    );
    expect(loginPageDOM.querySelectorAll(".errorMessage")[1].textContent).toContain(
      `You are currently logged in as ${mockAuthedUser.displayName}`,
    );
    done();
  });

  // Check that the logout button triggers the AuthService's logout method
  it("should trigger the AuthService upon clicking logout", (done: DoneFn) => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    const logoutSpy = spyOn(loginPage, "logout").and.callThrough();
    const serviceLogoutSpy = spyOn(loginPage.authService, "logout");

    fixture.detectChanges();

    // check the user is logged in
    expect(loginPage.authService.authenticated()).toBeTrue();
    expect(loginPageDOM.querySelector("#logoutBox")).toBeTruthy();

    // trigger click on the logout button
    loginPageDOM.querySelector("#logout").click();
    fixture.detectChanges();

    // check the logout methods were called
    expect(logoutSpy).toHaveBeenCalled();
    expect(serviceLogoutSpy).toHaveBeenCalled();
    done();
  });
});
