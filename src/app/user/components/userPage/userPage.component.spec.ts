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
import { ActivatedRoute, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";

import { UserPage } from "./userPage.component";
import { AuthService } from "@common/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { OtherUser } from "@app/interfaces/otherUser.interface";
import { iconCharacters } from "@app/interfaces/types";
import { MockDisplayNameForm, MockReportForm } from "@tests/mockForms";
import { User } from "@app/interfaces/user.interface";
import { AppCommonModule } from "@app/common/common.module";

describe("UserPage", () => {
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
      declarations: [UserPage],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    expect(userPage).toBeTruthy();
  });

  // Check that the component checks for a logged in user
  it("should check for a logged in user", () => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;

    expect(authSpy).toHaveBeenCalled();
    expect(userPage).toBeTruthy();
  });

  // Check that the popup variables are set to false
  it("should have the popup variables set to false", () => {
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;

    expect(userPage.editMode).toBeFalse();
    expect(userPage.reportMode).toBeFalse();
  });

  // Check that when there's no ID the component defaults to the logged in user
  it("should show the logged in user if not provided with ID", (done: DoneFn) => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();

    const userData = userPage.authService.userData();
    expect(userPage.userId).toBeUndefined();
    expect(userPage.isOtherUserProfile()).toBeFalse();
    expect(userPageDOM.querySelectorAll(".displayName")[0].firstElementChild.textContent).toBe(
      userData?.displayName,
    );
    expect(
      userPageDOM.querySelector("#roleElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(userData?.role.name);
    expect(
      userPageDOM.querySelector("#rHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData?.receivedH));
    expect(
      userPageDOM.querySelector("#gHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData?.givenH));
    expect(
      userPageDOM.querySelector("#postsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData?.posts));
    expect(userPageDOM.querySelector("#logout")).toBeTruthy();
    done();
  });

  // Check that when the ID is the user's ID, it shows the user's own page
  it("should show the logged in user if it's the user's own ID", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    const routeSpy = spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("4");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();

    const userData = userPage.authService.userData();
    expect(routeSpy).toHaveBeenCalled();
    expect(userPage.userId).toBe(4);
    expect(userPage.isOtherUserProfile()).toBeFalse();
    expect(userPageDOM.querySelectorAll(".displayName")[0].firstElementChild.textContent).toBe(
      userData?.displayName,
    );
    expect(
      userPageDOM.querySelector("#roleElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(userData?.role.name);
    expect(
      userPageDOM.querySelector("#rHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData?.receivedH));
    expect(
      userPageDOM.querySelector("#gHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData?.givenH));
    expect(
      userPageDOM.querySelector("#postsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData?.posts));
    expect(userPageDOM.querySelector("#logout")).toBeTruthy();
    expect(userPageDOM.querySelectorAll(".reportButton")[0]).toBeUndefined();
    done();
  });

  // Check that when the ID is another user's ID, it shows their page
  it("should show another user's page if that was the provided ID", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    const routeSpy = spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    userPage.otherUser.set({
      id: 1,
      displayName: "shirb",
      receivedH: 3,
      givenH: 3,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      posts: 10,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    userPage.isIdbFetchResolved.set(true);
    userPage.isServerFetchResolved.set(true);

    fixture.detectChanges();

    const userData = userPage.otherUser() as OtherUser;
    expect(routeSpy).toHaveBeenCalled();
    expect(userPage.userId).toBe(1);
    expect(userPage.isOtherUserProfile()).toBeTrue();
    expect(userPageDOM.querySelectorAll(".displayName")[0].firstElementChild.textContent).toContain(
      userData.displayName,
    );
    expect(
      userPageDOM.querySelector("#roleElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(userData.role.name);
    expect(
      userPageDOM.querySelector("#rHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData.receivedH));
    expect(
      userPageDOM.querySelector("#gHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData.givenH));
    expect(
      userPageDOM.querySelector("#postsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe(String(userData.posts));
    expect(userPageDOM.querySelector("#logout")).toBeNull();
    expect(userPageDOM.querySelectorAll(".reportButton")[0]).toBeTruthy();
    done();
  });

  // Check that the 'please login page' is shown if the user's logged out
  it("should show login page if user is not authenticated", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("4");
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(false);
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    userPage.authService.authenticated.set(false);

    fixture.detectChanges();

    expect(userPage.isOtherUserProfile()).toBeFalse();
    expect(userPageDOM.querySelector("#profileContainer")).toBeNull();
    expect(userPageDOM.querySelector("#loginBox")).toBeTruthy();
    done();
  });

  // Check that the login button triggers the AuthService's login method
  it("should trigger the AuthService upon clicking login", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("4");
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(false);
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    const loginSpy = spyOn(userPage, "login").and.callThrough();
    const serviceLoginSpy = spyOn(userPage.authService, "login");
    userPage.authService.authenticated.set(false);

    fixture.detectChanges();

    // check that the user isn't logged in before the click
    expect(userPage.authService.authenticated()).toBeFalse();
    expect(userPageDOM.querySelector("#loginBox")).toBeTruthy();

    // trigger click on the login button
    userPageDOM.querySelector("#logIn").click();
    fixture.detectChanges();

    // check the login methods were called
    expect(loginSpy).toHaveBeenCalled();
    expect(serviceLoginSpy).toHaveBeenCalled();
    done();
  });

  // Check that the logout button triggers the AuthService's logout method
  it("should trigger the AuthService upon clicking logout", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("4");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    const logoutSpy = spyOn(userPage, "logout").and.callThrough();
    const serviceLogoutSpy = spyOn(userPage.authService, "logout");

    fixture.detectChanges();

    // check the user is logged in
    expect(userPage.authService.authenticated()).toBeTrue();
    expect(userPageDOM.querySelector("#profileContainer")).toBeTruthy();

    // trigger click on the logout button
    userPageDOM.querySelector("#logout").click();
    fixture.detectChanges();

    // check the logout methods were called
    expect(logoutSpy).toHaveBeenCalled();
    expect(serviceLogoutSpy).toHaveBeenCalled();
    done();
  });

  it("should fetch user data from the server", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const mockUser = {
      id: 1,
      displayName: "shirb",
      receivedH: 3,
      givenH: 3,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      posts: 10,
      selectedIcon: "kitty" as iconCharacters,
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    };

    const idbSpy = spyOn(userPage, "fetchOtherUserFromIdb").and.returnValue(of(undefined));
    const apiClientSpy = spyOn(userPage["apiClient"], "get").and.returnValue(
      of({ user: mockUser }),
    );
    const addItemSpy = spyOn(userPage["swManager"], "addItem");

    userPage.fetchOtherUsersData();

    expect(idbSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalledWith("users/all/1");
    expect(addItemSpy).toHaveBeenCalledWith("users", mockUser);
    expect(userPage.otherUser() as OtherUser).toEqual(mockUser);
    expect(userPage.isServerFetchResolved()).toBeTrue();
  });

  it("should fetch user data from Idb", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const mockUser = {
      id: 1,
      displayName: "shirb",
      receivedH: 3,
      givenH: 3,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      posts: 10,
      selectedIcon: "kitty" as iconCharacters,
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    };

    const swSpy = spyOn(userPage["swManager"], "queryUsers").and.returnValue(
      new Promise((resolve) => resolve(mockUser)),
    );

    userPage.fetchOtherUserFromIdb().subscribe((userData) => {
      expect(swSpy).toHaveBeenCalledWith(1);
      expect(userPage.isIdbFetchResolved()).toBeTrue();
      expect(userPage.otherUser()).toEqual(mockUser);
      expect(userData).toEqual(mockUser);
      done();
    });
  });

  // Check that the popup is triggered on edit
  it("should open the popup upon editing", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("4");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();

    // before the click
    expect(userPage.editMode).toBeFalse();

    // trigger click
    userPageDOM.querySelector("#editName").click();
    fixture.detectChanges();

    // after the click
    expect(userPage.editMode).toBeTrue();
    expect(userPage.userToEdit).toEqual({
      displayName: userPage.authService.userData()!.displayName,
      id: userPage.authService.userData()!.id as number,
    });
    expect(userPageDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  //Check that the popup is opened when clicking 'report'
  it("should open the popup upon reporting", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    userPage.otherUser.set({
      id: 1,
      displayName: "shirb",
      receivedH: 3,
      givenH: 3,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      posts: 10,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    userPage.isIdbFetchResolved.set(true);
    userPage.isServerFetchResolved.set(true);

    fixture.detectChanges();

    // before the click
    expect(userPage.reportMode).toBeFalse();

    // trigger click
    userPageDOM.querySelectorAll(".reportButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(userPage.reportMode).toBeTrue();
    expect(userPage.reportType).toEqual("User");
    expect(userPage.reportedItem as OtherUser).toEqual(userPage.otherUser() as OtherUser);
    expect(userPageDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that sending a hug triggers the items service
  it("should trigger items service on hug", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    const hugSpy = spyOn(userPage, "sendHug").and.callThrough();
    const apiClientSpy = spyOn(userPage["apiClient"], "post").and.returnValue(of({}));
    const alertsSpy = spyOn(userPage["alertsService"], "createSuccessAlert");
    const updateSpy = spyOn(userPage["authService"], "updateUserData").and.callThrough();
    spyOn(userPage["authService"]["apiClient"], "patch").and.returnValue(
      of({
        success: true,
        updated: { ...mockAuthedUser },
      }),
    );
    userPage.otherUser.set({
      id: 1,
      displayName: "shirb",
      receivedH: 3,
      givenH: 3,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      posts: 10,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    userPage.isIdbFetchResolved.set(true);
    userPage.isServerFetchResolved.set(true);

    fixture.detectChanges();

    // before the click
    expect(hugSpy).not.toHaveBeenCalled();
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(userPage.isOtherUserProfile()).toBeTrue();
    expect(userPage["authService"].userData()?.givenH).toBe(2);
    expect(userPage.otherUser()!.receivedH).toBe(3);
    expect(
      userPageDOM.querySelector("#rHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe("3");

    // simulate click
    userPageDOM.querySelectorAll(".hugButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(hugSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(userPage["authService"].userData()?.givenH).toBe(3);
    expect(userPage.otherUser()!.receivedH).toBe(4);
    expect(
      userPageDOM.querySelector("#rHugsElement").querySelectorAll(".pageData")[0].textContent,
    ).toBe("4");
    expect(alertsSpy).toHaveBeenCalledWith("Your hug was sent!");
    done();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false - display name edit", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const changeSpy = spyOn(userPage, "changeMode").and.callThrough();

    fixture.detectChanges();

    // start the popup
    userPage.lastFocusedElement = document.querySelectorAll("a")[0];
    userPage.userToEdit = {
      displayName: userPage.authService.userData()!.displayName,
      id: userPage.authService.userData()!.id as number,
    };
    userPage.editMode = true;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("display-name-edit-form"))
      .componentInstance as MockDisplayNameForm;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(userPage.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  it("should change mode when the event emitter emits false - report", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, "get").and.returnValue("1");
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    userPage.otherUser.set({
      id: 1,
      displayName: "shirb",
      receivedH: 3,
      givenH: 3,
      role: {
        id: 1,
        name: "user",
        permissions: [],
      },
      posts: 10,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    const changeSpy = spyOn(userPage, "changeMode").and.callThrough();

    fixture.detectChanges();

    // start the popup
    userPage.lastFocusedElement = document.querySelectorAll("a")[0];
    userPage.reportedItem = userPage.otherUser() as User;
    userPage.reportMode = true;
    userPage.reportType = "User";
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("report-form"))
      .componentInstance as MockReportForm;
    popup.reportMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(userPage.reportMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });
});
