/*
  Auth Service
  Send a Hug Service Tests
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
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { ServiceWorkerModule } from "@angular/service-worker";
import {} from "jasmine";
import { User as FirebaseUser } from "firebase/auth";
import { HttpErrorResponse, HttpHeaders, HttpEventType } from "@angular/common/http";
import { isEmpty, of } from "rxjs";

import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { getMockFirebaseUser, mockAuthedUser } from "@tests/mockData";
import { User } from "@app/interfaces/user.interface";

describe("AuthService", () => {
  let httpController: HttpTestingController;
  let authService: AuthService;
  let mockFirebaseUser: FirebaseUser;
  let mockUser: User;
  let createAlertSpy: jasmine.Spy;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ServiceWorkerModule.register("/sw.js", { enabled: false }),
      ],
      providers: [AuthService],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);

    const alertsService = TestBed.inject(AlertsService);
    spyOn(alertsService, "createErrorAlert");
    spyOn(alertsService, "toggleOfflineAlert");
    createAlertSpy = spyOn(alertsService, "createAlert");
    createAlertSpy;

    mockFirebaseUser = getMockFirebaseUser();
    mockUser = { ...mockAuthedUser };
  });

  // Check the service is created
  it("should be created", () => {
    expect(authService).toBeTruthy();
  });

  it("getUserToken() - returns an empty observable if there's no logged in user", (done: DoneFn) => {
    const currentUserSpy = spyOn(authService, "getCurrentFirebaseUser").and.returnValue(null);
    const idTokenSpy = spyOn(authService, "getIdTokenForCurrentUser");

    authService
      .getUserToken()
      .pipe(isEmpty())
      .subscribe({
        next: (isEmptyObs) => {
          expect(currentUserSpy).toHaveBeenCalled();
          expect(idTokenSpy).not.toHaveBeenCalled();
          expect(isEmptyObs).toEqual(true);
          done();
        },
      });
  });

  it("getUserToken() - returns an observable with user data if there is one", (done: DoneFn) => {
    const currentUserSpy = spyOn(authService, "getCurrentFirebaseUser").and.returnValue(
      mockFirebaseUser,
    );
    const idTokenSpy = spyOn(authService, "getIdTokenForCurrentUser").and.returnValue(of("token"));

    authService.getUserToken().subscribe((user) => {
      expect(currentUserSpy).toHaveBeenCalled();
      expect(idTokenSpy).toHaveBeenCalled();
      expect(user).toEqual({
        ...mockFirebaseUser,
        jwt: "token",
      });
      done();
    });
  });

  // Check the service gets the user's data
  it("fetchUser() - gets the user's data", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        id: 4,
        auth0Id: "auth0",
        displayName: "name",
        receivedH: 2,
        givenH: 2,
        posts: 2,
        loginCount: 3,
        role: {
          id: 1,
          name: "admin",
          permissions: [],
        },
        jwt: "",
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false,
        selectedIcon: "kitty",
        iconColours: {
          character: "#BA9F93",
          lbg: "#e2a275",
          rbg: "#f8eee4",
          item: "#f4b56a",
        },
        firebaseId: "fb",
      },
    };
    const getTokenSpy = spyOn(authService, "getUserToken").and.returnValue(
      of({
        ...mockFirebaseUser,
        jwt: "token",
      }),
    );
    const isResolvedSpy = spyOn(authService.isUserDataResolved, "next").and.callThrough();
    const userDataSpy = spyOn(authService.userData, "set").and.callThrough();
    const setUserSpy = spyOn(authService, "setCurrentUser");

    authService.fetchUser().subscribe({
      next: (user) => {
        expect(getTokenSpy).toHaveBeenCalled();
        expect(authService.loggedIn).toBeFalse();
        expect(isResolvedSpy).toHaveBeenCalledWith(false);
        expect(userDataSpy).toHaveBeenCalledWith(undefined);
        expect(setUserSpy).toHaveBeenCalled();
        expect(user).toEqual({
          ...mockUser,
          jwt: "token",
          auth0Id: "",
        });
        done();
      },
    });

    // flush mock response
    const req = httpController.expectOne(`${authService.serverUrl}/users/all/fb`);
    expect(req.request.method).toEqual("GET");
    req.flush(mockResponse);
  });

  // Check the service triggers user creating if the user doesn't exist
  it("fetchUser() - throws a specific error if used doesn't exist", (done: DoneFn) => {
    // mock response
    const mockError = {
      message: {
        description: "User not found",
        statusCode: 401,
      },
    };
    const mockResponse: HttpErrorResponse = {
      message: "error",
      error: mockError,
      headers: new HttpHeaders(),
      ok: false,
      status: 401,
      statusText: "",
      url: "",
      type: HttpEventType.Response,
      name: "HttpErrorResponse",
    };
    const getTokenSpy = spyOn(authService, "getUserToken").and.returnValue(
      of({
        ...mockFirebaseUser,
        jwt: "token",
      }),
    );

    authService.fetchUser().subscribe({
      error: (err) => {
        expect(getTokenSpy).toHaveBeenCalled();
        expect(authService.isUserDataResolved.value).toBeFalse();
        expect(err.message).toBe("User doesn't exist yet");
        done();
      },
    });

    // flush mock response
    const req = httpController.expectOne(`${authService.serverUrl}/users/all/fb`);
    expect(req.request.method).toEqual("GET");
    req.flush(mockError, mockResponse);
  });

  // Check a new user is created
  it("createUser() - creates a new user - name provided", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        id: 4,
        auth0Id: "auth0",
        displayName: "name",
        receivedH: 2,
        givenH: 2,
        posts: 2,
        loginCount: 3,
        role: {
          id: 1,
          name: "admin",
          permissions: [],
        },
        jwt: "",
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false,
        selectedIcon: "kitty",
        iconColours: {
          character: "#BA9F93",
          lbg: "#e2a275",
          rbg: "#f8eee4",
          item: "#f4b56a",
        },
        firebaseId: "fb",
      },
    };
    const getTokenSpy = spyOn(authService, "getUserToken").and.returnValue(
      of({
        ...mockFirebaseUser,
        jwt: "token",
      }),
    );
    const isResolvedSpy = spyOn(authService.isUserDataResolved, "next").and.callThrough();
    const setUserSpy = spyOn(authService, "setCurrentUser");

    // check the user is logged out at first
    expect(authService.userData()).toBeUndefined();
    expect(authService.authenticated()).toBeFalse();

    authService.createUser("test").subscribe({
      next: (userData) => {
        expect(getTokenSpy).toHaveBeenCalled();
        expect(isResolvedSpy).toHaveBeenCalledWith(false);
        expect(setUserSpy).toHaveBeenCalled();
        expect(userData).toEqual({
          ...mockUser,
          auth0Id: "",
          jwt: "token",
        });
        done();
      },
    });

    // flush mock response
    const req = httpController.expectOne(`${authService.serverUrl}/users`);
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual({
      firebaseId: "fb",
      displayName: "test",
    });
    req.flush(mockResponse);
  });

  it("setCurrentUser() - sets the user's data locally", () => {
    const updateSpy = spyOn(authService, "updateUserData");
    const addSpy = spyOn(authService["serviceWorkerM"], "addItem");

    // before
    expect(authService.userData()).toBeUndefined();
    expect(authService.authenticated()).toBeFalse();
    expect(authService.isUserDataResolved.value).toBeFalse();

    authService.setCurrentUser({
      ...mockUser,
      jwt: "token",
    });

    // after
    expect(authService.userData()).toEqual({
      ...mockUser,
      jwt: "token",
    });
    expect(authService.authenticated()).toBeTrue();
    expect(authService.isUserDataResolved.value).toBeTrue();
    expect(addSpy).toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();
  });

  // Check the service updates user data if the user just logged in
  it("setCurrentUser() - calls updateUserData() if the user just logged in", () => {
    const updateSpy = spyOn(authService, "updateUserData");
    const addSpy = spyOn(authService["serviceWorkerM"], "addItem");
    authService.loggedIn = true;

    // before
    expect(authService.userData()).toBeUndefined();
    expect(authService.authenticated()).toBeFalse();
    expect(authService.isUserDataResolved.value).toBeFalse();

    authService.setCurrentUser({
      ...mockUser,
      jwt: "token",
    });

    // after
    expect(authService.userData()).toEqual({
      ...mockUser,
      jwt: "token",
    });
    expect(authService.authenticated()).toBeTrue();
    expect(authService.isUserDataResolved.value).toBeTrue();
    expect(addSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith({ loginCount: 4 });
  });

  // Check logout is triggered
  it("logout() - triggers logout", (done: DoneFn) => {
    // set the user data as if the user is logged in
    authService.userData.set({
      id: 4,
      auth0Id: "",
      displayName: "name",
      receivedH: 2,
      givenH: 2,
      posts: 2,
      loginCount: 3,
      role: {
        id: 1,
        name: "admin",
        permissions: [],
      },
      jwt: "",
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
      firebaseId: "",
    });
    authService.authenticated.set(true);
    authService.tokenExpired = false;
    const signOutSpy = spyOn(authService, "signOut").and.returnValue(of(undefined));
    const clearSpy = spyOn(authService["serviceWorkerM"], "clearStore");

    authService.logout().add(() => {
      expect(signOutSpy).toHaveBeenCalled();
      expect(authService.authenticated()).toBeFalse();
      expect(authService.userData()).toBeUndefined();
      expect(clearSpy).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it("logout() - triggers logout and alerts the user if the token expired", (done: DoneFn) => {
    // set the user data as if the user is logged in
    authService.userData.set({
      id: 4,
      auth0Id: "",
      displayName: "name",
      receivedH: 2,
      givenH: 2,
      posts: 2,
      loginCount: 3,
      role: {
        id: 1,
        name: "admin",
        permissions: [],
      },
      jwt: "",
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
      firebaseId: "",
    });
    authService.authenticated.set(true);
    authService.tokenExpired = true;
    const signOutSpy = spyOn(authService, "signOut").and.returnValue(of(undefined));
    const clearSpy = spyOn(authService["serviceWorkerM"], "clearStore");

    authService.logout().add(() => {
      expect(signOutSpy).toHaveBeenCalled();
      expect(authService.authenticated()).toBeFalse();
      expect(authService.userData()).toBeUndefined();
      expect(clearSpy).toHaveBeenCalledTimes(2);
      expect(createAlertSpy).toHaveBeenCalledWith(
        {
          type: "Notification",
          message: `Your session had become inactive and you have been safely logged out. Log back in to continue.`,
        },
        {
          navigate: true,
          navTarget: "/user",
          navText: "User Page",
        },
      );
      done();
    });
  });

  // Check the service makes an update request
  it("updateUserData() - updates the user's data", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 4,
        auth0Id: "auth0",
        displayName: "name",
        receivedH: 2,
        givenH: 2,
        posts: 2,
        loginCount: 3,
        role: "admin",
        jwt: "",
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false,
        firebaseId: "fb",
      },
    };

    authService.userData.set({
      id: 4,
      auth0Id: "auth0",
      displayName: "beep",
      receivedH: 2,
      givenH: 2,
      posts: 2,
      loginCount: 2,
      role: {
        id: 1,
        name: "admin",
        permissions: [],
      },
      jwt: "",
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
      firebaseId: "fb",
    });
    const getTokenSpy = spyOn(authService, "getUserToken").and.returnValue(
      of({
        ...mockFirebaseUser,
        jwt: "token",
      }),
    );
    const swSpy = spyOn(authService["serviceWorkerM"], "addItem");

    authService.updateUserData({ displayName: "name" }).add(() => {
      expect(authService.userData()!.displayName).toBe("name");
      expect(getTokenSpy).toHaveBeenCalled();
      expect(swSpy).toHaveBeenCalled();
      done();
    });

    // flush mock response
    const req = httpController.expectOne(`${authService.serverUrl}/users/all/4`);
    expect(req.request.method).toEqual("PATCH");
    req.flush(mockResponse);
  });

  // Check the service checks user permissions correctly
  it("canUser() - checks for user permissions", () => {
    authService.userData.set({
      id: 4,
      auth0Id: "auth0",
      displayName: "name",
      receivedH: 2,
      givenH: 2,
      posts: 2,
      loginCount: 2,
      role: {
        id: 1,
        name: "admin",
        permissions: [
          "block:user",
          "delete:any-post",
          "delete:messages",
          "patch:any-post",
          "patch:any-user",
          "post:message",
          "post:post",
          "post:report",
          "read:admin-board",
          "read:messages",
          "read:user",
        ],
      },
      jwt: "",
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
      firebaseId: "",
    });

    const res = authService.canUser("block:user");

    expect(res).toBeTrue();
  });

  // Check the service returns false if there's no logged in user
  it("canUser() - returns false if the user doesn't have permission", () => {
    authService.userData.set({
      id: 4,
      auth0Id: "auth0",
      displayName: "name",
      receivedH: 2,
      givenH: 2,
      posts: 2,
      loginCount: 2,
      role: {
        id: 1,
        name: "admin",
        permissions: [],
      },
      jwt: "",
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
      firebaseId: "",
    });

    const res = authService.canUser("block:user");

    expect(res).toBeFalse();
  });

  // Check the service returns false if there's no token
  it("canUser() - returns false if there's no saved token", () => {
    authService.userData.set(undefined);

    const response = authService.canUser("do something");

    expect(response).toBeFalse();
  });
});
