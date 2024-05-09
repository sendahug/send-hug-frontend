/*
	Sign Up Page
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
import { ReactiveFormsModule } from "@angular/forms";
import { User as FirebaseUser } from "firebase/auth";
import { of } from "rxjs";

import { SignUpPage } from "./signUpPage.component";
import { AppCommonModule } from "@app/common/common.module";
import { getMockFirebaseUser, mockAuthedUser } from "@tests/mockData";

describe("SignUpPage", () => {
  let mockFirebaseUser: FirebaseUser;

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
      declarations: [SignUpPage],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    mockFirebaseUser = getMockFirebaseUser();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    expect(signUpPage).toBeTruthy();
  });

  it("should show the signup form if the user isn't logged in", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(false);
    fixture.detectChanges();

    expect(signUpPageDOM.querySelector("#loginBox")).toBeDefined();
    expect(signUpPageDOM.querySelector("#logoutBox")).toBeNull();
  });

  it("should prevent users not logged in with firebase from signing up", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(false);
    const signUpSpy = spyOn(signUpPage, "signUp").and.callThrough();
    const currentUserSpy = spyOn(
      signUpPage["authService"],
      "getCurrentFirebaseUser",
    ).and.returnValue(null);
    const createUserSpy = spyOn(signUpPage["authService"], "createUser");
    const alertsSpy = spyOn(signUpPage["alertsService"], "createAlert");
    fixture.detectChanges();

    signUpPageDOM.querySelector("#displayName").value = "name";
    signUpPageDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    signUpPageDOM.querySelector("#acceptedTerms").click();
    signUpPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(signUpSpy).toHaveBeenCalled();
    expect(currentUserSpy).toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message:
        "Error creating a new user. You're not currently logged in with Firebase. Did you forget to log in or register?",
    });
  });

  it("should prevent signed in users from registering again", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    signUpPage["authService"].authenticated.set(true);
    signUpPage["authService"].userData.set({ ...mockAuthedUser });
    const currentUserSpy = spyOn(
      signUpPage["authService"],
      "getCurrentFirebaseUser",
    ).and.returnValue(mockFirebaseUser);
    const createUserSpy = spyOn(signUpPage["authService"], "createUser");
    const alertsSpy = spyOn(signUpPage["alertsService"], "createAlert");
    signUpPage.signUpForm.controls.displayName.setValue("name");
    signUpPage.signUpForm.controls.acceptedTerms.setValue(true);
    fixture.detectChanges();

    signUpPage.signUp();

    expect(currentUserSpy).toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message:
        "Error creating a new user. You cannot create another user when you're already registered!",
    });
  });

  it("should prevent invalid sign up forms from being submitted - display name too long", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(false);
    const signUpSpy = spyOn(signUpPage, "signUp").and.callThrough();
    const currentUserSpy = spyOn(
      signUpPage["authService"],
      "getCurrentFirebaseUser",
    ).and.returnValue(mockFirebaseUser);
    const createUserSpy = spyOn(signUpPage["authService"], "createUser");
    const alertsSpy = spyOn(signUpPage["alertsService"], "createAlert");
    fixture.detectChanges();

    let nameStr = "";
    for (let i = 0; i <= 20; i++) {
      nameStr += "abc";
    }

    signUpPageDOM.querySelector("#displayName").value = nameStr;
    signUpPageDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    signUpPageDOM.querySelector("#acceptedTerms").click();
    signUpPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(signUpSpy).toHaveBeenCalled();
    expect(currentUserSpy).toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message:
        "Error creating a new user. Display name is too long. Please shorten it and try again. ",
    });
  });

  it("should prevent invalid sign up forms from being submitted - no display name", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(false);
    const signUpSpy = spyOn(signUpPage, "signUp").and.callThrough();
    const currentUserSpy = spyOn(
      signUpPage["authService"],
      "getCurrentFirebaseUser",
    ).and.returnValue(mockFirebaseUser);
    const createUserSpy = spyOn(signUpPage["authService"], "createUser");
    const alertsSpy = spyOn(signUpPage["alertsService"], "createAlert");
    fixture.detectChanges();

    signUpPageDOM.querySelector("#acceptedTerms").click();
    signUpPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(signUpSpy).toHaveBeenCalled();
    expect(currentUserSpy).toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Error creating a new user. A display name is required. ",
    });
  });

  it("should prevent invalid sign up forms from being submitted - terms not accepted", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(false);
    const signUpSpy = spyOn(signUpPage, "signUp").and.callThrough();
    const currentUserSpy = spyOn(
      signUpPage["authService"],
      "getCurrentFirebaseUser",
    ).and.returnValue(mockFirebaseUser);
    const createUserSpy = spyOn(signUpPage["authService"], "createUser");
    const alertsSpy = spyOn(signUpPage["alertsService"], "createAlert");
    fixture.detectChanges();

    signUpPageDOM.querySelector("#displayName").value = "name";
    signUpPageDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    signUpPageDOM.querySelector("#acceptedTerms").click();
    signUpPageDOM.querySelector("#acceptedTerms").click();
    signUpPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(signUpSpy).toHaveBeenCalled();
    expect(currentUserSpy).toHaveBeenCalled();
    expect(createUserSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message:
        "Error creating a new user. You must accept the terms and conditions before creating an account.",
    });
  });

  it("should create a new user via the AuthService", (done: DoneFn) => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(false);
    const signUpSpy = spyOn(signUpPage, "signUp").and.callThrough();
    spyOn(signUpPage["authService"], "getCurrentFirebaseUser").and.returnValue(mockFirebaseUser);
    const createUserSpy = spyOn(signUpPage["authService"], "createUser").and.returnValue(
      of({ ...mockAuthedUser }),
    );
    const routerSpy = spyOn(signUpPage["router"], "navigate");
    fixture.detectChanges();

    signUpPageDOM.querySelector("#displayName").value = "name";
    signUpPageDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    signUpPageDOM.querySelector("#acceptedTerms").click();
    signUpPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    expect(signUpSpy).toHaveBeenCalled();
    expect(createUserSpy).toHaveBeenCalledWith("name");
    expect(routerSpy).toHaveBeenCalledWith(["/user"]);
    done();
  });

  it("should show an error message if the user is logged in", () => {
    const fixture = TestBed.createComponent(SignUpPage);
    const signUpPage = fixture.componentInstance;
    const signUpPageDOM = fixture.nativeElement;
    signUpPage["authService"].authenticated.set(true);
    signUpPage["authService"].userData.set({ ...mockAuthedUser });
    fixture.detectChanges();

    expect(signUpPageDOM.querySelector("#loginBox")).toBeNull();
    expect(signUpPageDOM.querySelector("#logoutBox")).toBeDefined();
  });
});
