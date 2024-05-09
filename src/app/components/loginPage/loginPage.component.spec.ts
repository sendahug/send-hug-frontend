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
import { of, throwError } from "rxjs";
import { User as FirebaseUser, UserCredential } from "firebase/auth";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { LoginPage } from "./loginPage.component";
import { AuthService } from "@common/services/auth.service";
import { getMockFirebaseUser, mockAuthedUser } from "@tests/mockData";
import { AppCommonModule } from "@app/common/common.module";
import { User } from "@app/interfaces/user.interface";
import { PasswordResetForm } from "@app/common/components/passwordResetForm/passwordResetForm.component";

describe("LoginPage", () => {
  let mockFirbeaseUser: FirebaseUser;
  let mockUserCredential: UserCredential;
  let mockUser: User;

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
        ReactiveFormsModule,
      ],
      declarations: [LoginPage, PasswordResetForm],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    mockFirbeaseUser = getMockFirebaseUser();
    mockUserCredential = {
      user: mockFirbeaseUser,
      providerId: "",
      operationType: "signIn",
    };
    mockUser = { ...mockAuthedUser };
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

  it("signIn() - should run the login process - success", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loadingSpy = spyOn(loginPage.isLoading, "set").and.callThrough();
    const fetchUserSpy = spyOn(loginPage.authService, "fetchUser").and.returnValue(of(mockUser));
    const routerSpy = spyOn(loginPage["router"], "navigate");
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const mockObservable = of(mockUserCredential);

    loginPage.signIn(mockObservable, "apple").add(() => {
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(fetchUserSpy).toHaveBeenCalledWith(true);
      expect(routerSpy).toHaveBeenCalledWith(["/user"]);
      expect(alertsSpy).not.toHaveBeenCalled();
      done();
    });
  });

  it("signIn() - should run the login process - error - OAuth", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loadingSpy = spyOn(loginPage.isLoading, "set").and.callThrough();
    const fetchUserSpy = spyOn(loginPage.authService, "fetchUser").and.returnValue(
      throwError(() => Error("User doesn't exist yet")),
    );
    const routerSpy = spyOn(loginPage["router"], "navigate");
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const mockObservable = of(mockUserCredential);

    loginPage.signIn(mockObservable, "apple").add(() => {
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(fetchUserSpy).toHaveBeenCalledWith(true);
      expect(routerSpy).toHaveBeenCalledWith(["/signup"]);
      expect(alertsSpy).not.toHaveBeenCalled();
      done();
    });
  });

  it("signIn() - should run the login process - error - username and password", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loadingSpy = spyOn(loginPage.isLoading, "set").and.callThrough();
    const fetchUserSpy = spyOn(loginPage.authService, "fetchUser").and.returnValue(of(mockUser));
    const routerSpy = spyOn(loginPage["router"], "navigate");
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const mockObservable = throwError(() => Error("User doesn't exist yet"));

    loginPage.signIn(mockObservable, "username").add(() => {
      expect(loadingSpy).not.toHaveBeenCalled();
      expect(fetchUserSpy).not.toHaveBeenCalled();
      expect(routerSpy).not.toHaveBeenCalled();
      expect(alertsSpy).toHaveBeenCalledWith({
        type: "Error",
        message: "Cannot find user with these details. Did you mean to register?",
      });
      done();
    });
  });

  it("signUp() - should run the signup process - success", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const routerSpy = spyOn(loginPage["router"], "navigate");
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const mockObservable = of(mockUserCredential);

    loginPage.signUp(mockObservable).add(() => {
      expect(routerSpy).toHaveBeenCalledWith(["/signup"]);
      expect(alertsSpy).not.toHaveBeenCalled();
      done();
    });
  });

  it("signUp() - should run the signup process - error", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const routerSpy = spyOn(loginPage["router"], "navigate");
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const mockObservable = throwError(() => Error("ERROR!"));

    loginPage.signUp(mockObservable).add(() => {
      expect(routerSpy).not.toHaveBeenCalled();
      expect(alertsSpy).toHaveBeenCalledWith({
        type: "Error",
        message: `An error occurred. Error: ERROR!`,
      });
      done();
    });
  });

  it("signInWithPopup() - should allow logging in with popup - apple", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    const loginSpy = spyOn(loginPage, "signInWithPopup").and.callThrough();
    const mockObservable = of(mockUserCredential);
    const serviceLoginSpy = spyOn(loginPage.authService, "loginWithPopup").and.returnValue(
      mockObservable,
    );
    const signInSpy = spyOn(loginPage, "signIn");
    loginPage.authService.authenticated.set(false);

    fixture.detectChanges();

    // check that the user isn't logged in before the click
    expect(loginPage.authService.authenticated()).toBeFalse();
    expect(loginPageDOM.querySelector("#loginBox")).toBeTruthy();
    expect(loginPageDOM.querySelector("#logoutBox")).toBeNull();

    // trigger click on the login button
    loginPageDOM.querySelectorAll(".loginButton")[0].click();
    fixture.detectChanges();

    // check the login methods were called
    expect(loginSpy).toHaveBeenCalledWith("apple");
    expect(serviceLoginSpy).toHaveBeenCalledWith("apple");
    expect(signInSpy).toHaveBeenCalledWith(mockObservable, "apple");
    done();
  });

  it("signInWithPopup() - should allow logging in with popup - google", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    const loginSpy = spyOn(loginPage, "signInWithPopup").and.callThrough();
    const mockObservable = of(mockUserCredential);
    const serviceLoginSpy = spyOn(loginPage.authService, "loginWithPopup").and.returnValue(
      mockObservable,
    );
    const signInSpy = spyOn(loginPage, "signIn");
    loginPage.authService.authenticated.set(false);

    fixture.detectChanges();

    // check that the user isn't logged in before the click
    expect(loginPage.authService.authenticated()).toBeFalse();
    expect(loginPageDOM.querySelector("#loginBox")).toBeTruthy();
    expect(loginPageDOM.querySelector("#logoutBox")).toBeNull();

    // trigger click on the login button
    loginPageDOM.querySelectorAll(".loginButton")[1].click();
    fixture.detectChanges();

    // check the login methods were called
    expect(loginSpy).toHaveBeenCalledWith("google");
    expect(serviceLoginSpy).toHaveBeenCalledWith("google");
    expect(signInSpy).toHaveBeenCalledWith(mockObservable, "google");
    done();
  });

  it("should switch to the signup page if the user clicks sign up", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    fixture.detectChanges();

    expect(loginPage.isNewUser()).toBeFalse();
    expect(loginPageDOM.querySelectorAll(".internalButton")[1].textContent.trim()).toBe(
      "Create one now.",
    );
    expect(loginPageDOM.querySelector("#logIn").textContent).toBe("Sign in");

    loginPageDOM.querySelectorAll(".internalButton")[1].click();
    fixture.detectChanges();

    expect(loginPage.isNewUser()).toBeTrue();
    expect(loginPageDOM.querySelectorAll(".internalButton")[0].textContent.trim()).toBe(
      "Log in now.",
    );
    expect(loginPageDOM.querySelector("#logIn").textContent).toBe("Sign up");
    done();
  });

  it("signInWithPopup() - should let users register with OAuth", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    loginPage.isNewUser.set(true);
    const loginSpy = spyOn(loginPage, "signInWithPopup").and.callThrough();
    const mockObservable = of(mockUserCredential);
    const serviceLoginSpy = spyOn(loginPage.authService, "loginWithPopup").and.returnValue(
      mockObservable,
    );
    const signUpSpy = spyOn(loginPage, "signUp");
    fixture.detectChanges();

    // trigger click on the login button
    loginPageDOM.querySelectorAll(".loginButton")[0].click();
    fixture.detectChanges();

    expect(loginSpy).toHaveBeenCalled();
    expect(serviceLoginSpy).toHaveBeenCalled();
    expect(signUpSpy).toHaveBeenCalledWith(mockObservable);
    done();
  });

  it("sendUsernameAndPassword() - should prevent submitting invalid email and password", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    const sendSpy = spyOn(loginPage, "sendUsernameAndPassword").and.callThrough();
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const signUpSpy = spyOn(loginPage.authService, "signUpWithEmail");
    const signInSpy = spyOn(loginPage.authService, "loginWithEmail");
    loginPage.authService.authenticated.set(false);
    fixture.detectChanges();

    loginPageDOM.querySelector("#username").value = "ab";
    loginPageDOM.querySelector("#username").dispatchEvent(new Event("input"));
    loginPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(sendSpy).toHaveBeenCalled();
    expect(signUpSpy).not.toHaveBeenCalled();
    expect(signInSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Invalid login details. Invalid email. A password is required to log in or sign up.",
    });
    done();
  });

  it("sendUsernameAndPassword() - should prevent submitting empty email and password", () => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    const sendSpy = spyOn(loginPage, "sendUsernameAndPassword").and.callThrough();
    const alertsSpy = spyOn(loginPage["alertsService"], "createAlert");
    const signUpSpy = spyOn(loginPage.authService, "signUpWithEmail");
    const signInSpy = spyOn(loginPage.authService, "loginWithEmail");
    fixture.detectChanges();

    loginPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(sendSpy).toHaveBeenCalled();
    expect(signUpSpy).not.toHaveBeenCalled();
    expect(signInSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message:
        "Invalid login details. An email is required to log in or sign up. A password is required to log in or sign up.",
    });
  });

  it("sendUsernameAndPassword() - should log users in with username and password - existing users", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    const mockObservable = of(mockUserCredential);
    const sendSpy = spyOn(loginPage, "sendUsernameAndPassword").and.callThrough();
    const loginSpy = spyOn(loginPage.authService, "loginWithEmail").and.returnValue(mockObservable);
    const signInSpy = spyOn(loginPage, "signIn");
    fixture.detectChanges();

    loginPageDOM.querySelector("#username").value = "ab@c.com";
    loginPageDOM.querySelector("#username").dispatchEvent(new Event("input"));
    loginPageDOM.querySelector("#password").value = "123456";
    loginPageDOM.querySelector("#password").dispatchEvent(new Event("input"));
    loginPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(sendSpy).toHaveBeenCalledWith();
    expect(loginSpy).toHaveBeenCalledWith("ab@c.com", "123456");
    expect(signInSpy).toHaveBeenCalledWith(mockObservable, "username");
    done();
  });

  it("sendUsernameAndPassword() - should sign users up with username and password", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    loginPage.isNewUser.set(true);
    const mockObservable = of(mockUserCredential);
    const sendSpy = spyOn(loginPage, "sendUsernameAndPassword").and.callThrough();
    const signUpServiceSpy = spyOn(loginPage.authService, "signUpWithEmail").and.returnValue(
      mockObservable,
    );
    const signUpSpy = spyOn(loginPage, "signUp");
    fixture.detectChanges();

    loginPageDOM.querySelector("#username").value = "ab@c.com";
    loginPageDOM.querySelector("#username").dispatchEvent(new Event("input"));
    loginPageDOM.querySelector("#password").value = "123456";
    loginPageDOM.querySelector("#password").dispatchEvent(new Event("input"));
    loginPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(sendSpy).toHaveBeenCalledWith();
    expect(signUpServiceSpy).toHaveBeenCalledWith("ab@c.com", "123456");
    expect(signUpSpy).toHaveBeenCalledWith(mockObservable);
    done();
  });

  it("should show the reset form if the user chooses to", () => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    loginPage.isNewUser.set(false);
    fixture.detectChanges();

    expect(loginPage.resetMode).toBeFalse();
    expect(loginPageDOM.querySelector("app-reset-pw-form")).toBeNull();

    loginPageDOM.querySelectorAll(".internalButton")[0].click();
    fixture.detectChanges();

    expect(loginPage.resetMode).toBeTrue();
    expect(loginPageDOM.querySelector("app-reset-pw-form")).toBeTruthy();
  });

  it("should hide the reset form when it's exited", () => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(false);
    loginPage.resetMode = true;
    loginPage.lastFocusedElement = document.querySelectorAll("a")[0];
    fixture.detectChanges();

    expect(loginPage.resetMode).toBeTrue();
    expect(loginPageDOM.querySelector("app-reset-pw-form")).toBeTruthy();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("app-reset-pw-form"))
      .componentInstance as PasswordResetForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    expect(loginPage.resetMode).toBeFalse();
    expect(loginPageDOM.querySelector("app-reset-pw-form")).toBeNull();
  });

  it("should show logout page if user is authenticated", (done: DoneFn) => {
    const fixture = TestBed.createComponent(LoginPage);
    const loginPage = fixture.componentInstance;
    const loginPageDOM = fixture.nativeElement;
    loginPage.authService.authenticated.set(true);
    loginPage.authService.userData.set({ ...mockUser });

    fixture.detectChanges();

    expect(loginPageDOM.querySelector("#loginBox")).toBeNull();
    expect(loginPageDOM.querySelector("#logoutBox")).toBeTruthy();
    expect(loginPageDOM.querySelectorAll(".errorMessage")[0].textContent).toContain(
      "You are already logged in",
    );
    expect(loginPageDOM.querySelectorAll(".errorMessage")[1].textContent).toContain(
      `You are currently logged in as ${mockUser.displayName}`,
    );
    done();
  });

  // Check that the logout button triggers the AuthService's logout method
  it("should trigger the AuthService upon clicking logout", (done: DoneFn) => {
    const authService = TestBed.inject(AuthService);
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
