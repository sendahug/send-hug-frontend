/*
  App Component
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
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import {
  ActivatedRoute,
  provideRouter,
  Router,
  RouterLink,
  RouterOutlet,
  withComponentInputBinding,
} from "@angular/router";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { BehaviorSubject, of, throwError } from "rxjs";
import { provideZoneChangeDetection, signal } from "@angular/core";
import { MockComponent, MockProvider } from "ng-mocks";

import { AppComponent } from "./app.component";
import { AuthService } from "@app/services/auth.service";
import { SWManager } from "@app/services/sWManager.service";
import { NotificationService } from "./services/notifications.service";
import { mockAuthedUser } from "@tests/mockData";
import { AppAlert } from "./components/appAlert/appAlert.component";
import { AlertsService } from "@app/services/alerts.service";
import { AppNavMenu } from "./components/layout/navigationMenu/navigationMenu.component";

describe("AppComponent", () => {
  beforeEach(() => {
    const MockNavBar = MockComponent(AppNavMenu);
    const MockAppAlert = MockComponent(AppAlert);
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
      isUserDataResolved: new BehaviorSubject(false),
      checkForLoggedInUser: () => of(),
      canUser: (_permission) => true,
    });
    const MockNotificationsService = MockProvider(NotificationService, {
      checkInitialPermissionState: (_enabled) => new Promise(() => true),
      getCachedSubscription: () => undefined,
      startAutoRefresh: (_rate) => undefined,
      newNotifications: signal(0),
    });
    const MockSWManager = MockProvider(SWManager, {
      registerSW: () => undefined,
      updateSW: () => undefined,
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterOutlet, RouterLink, MockAppAlert, MockNavBar, AppComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([], withComponentInputBinding()),
        MockAuthService,
        MockNotificationsService,
        MockSWManager,
      ],
    }).compileComponents();
  });

  // Check that the app is created
  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Check that the component checks for a logged in user
  it("should check for a logged in user and raise an error if user doesn't exist", () => {
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(false);
    const authSpy = spyOn(authService, "checkForLoggedInUser").and.returnValue(
      throwError(() => Error("User doesn't exist yet")),
    );
    const alertsService = TestBed.inject(AlertsService);
    const alertSpy = spyOn(alertsService, "createAlert");
    TestBed.createComponent(AppComponent);

    expect(authSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      {
        type: "Error",
        message: "User doesn't exist yet. Did you mean to finish registering?",
      },
      {
        navigate: true,
        navTarget: "/signup",
        navText: "Finish Registering",
      },
    );
  });

  it("should check for a logged in user and raise an error if something else happens", () => {
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(false);
    const authSpy = spyOn(authService, "checkForLoggedInUser").and.returnValue(
      throwError(() => Error("ERROR!!!")),
    );
    const alertsService = TestBed.inject(AlertsService);
    const alertSpy = spyOn(alertsService, "createAlert");
    TestBed.createComponent(AppComponent);

    expect(authSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: `An error occurred. ERROR!!!`,
    });
  });

  it("should check for a logged in user - enable push and auto-refresh", fakeAsync(() => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "checkForLoggedInUser").and.returnValue(
      of({ ...mockAuthedUser, pushEnabled: true, autoRefresh: true }),
    );

    const notificationService = TestBed.inject(NotificationService);
    const checkStateSpy = spyOn(notificationService, "checkInitialPermissionState").and.returnValue(
      new Promise((resolve) => resolve("granted")),
    );
    const getSubscriptionSpy = spyOn(notificationService, "getCachedSubscription");
    const startRefreshSpy = spyOn(notificationService, "startAutoRefresh");
    const getNotificationsSpy = spyOn(notificationService, "getNotifications").and.returnValue(
      of(),
    );

    TestBed.createComponent(AppComponent);

    tick();

    expect(authSpy).toHaveBeenCalled();
    expect(checkStateSpy).toHaveBeenCalled();
    expect(getSubscriptionSpy).toHaveBeenCalled();
    expect(startRefreshSpy).toHaveBeenCalled();
    expect(getNotificationsSpy).toHaveBeenCalled();
  }));

  it("should check for a logged in user - don't enable push and auto-refresh", fakeAsync(() => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "checkForLoggedInUser").and.returnValue(
      of({ ...mockAuthedUser, pushEnabled: false, autoRefresh: false }),
    );

    const notificationService = TestBed.inject(NotificationService);
    const checkStateSpy = spyOn(notificationService, "checkInitialPermissionState").and.returnValue(
      new Promise((resolve) => resolve("granted")),
    );
    const getSubscriptionSpy = spyOn(notificationService, "getCachedSubscription");
    const startRefreshSpy = spyOn(notificationService, "startAutoRefresh");
    spyOn(notificationService, "getNotifications").and.returnValue(of());

    TestBed.createComponent(AppComponent);

    tick();

    expect(authSpy).toHaveBeenCalled();
    expect(checkStateSpy).toHaveBeenCalled();
    expect(getSubscriptionSpy).not.toHaveBeenCalled();
    expect(startRefreshSpy).not.toHaveBeenCalled();
  }));

  it("should check for a logged in user - push permission not granted", fakeAsync(() => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "checkForLoggedInUser").and.returnValue(
      of({ ...mockAuthedUser, pushEnabled: true }),
    );

    const notificationService = TestBed.inject(NotificationService);
    const checkStateSpy = spyOn(notificationService, "checkInitialPermissionState").and.returnValue(
      new Promise((resolve) => resolve("denied")),
    );
    const getSubscriptionSpy = spyOn(notificationService, "getCachedSubscription");
    spyOn(notificationService, "getNotifications").and.returnValue(of());

    TestBed.createComponent(AppComponent);

    tick(100);

    expect(authSpy).toHaveBeenCalled();
    expect(checkStateSpy).toHaveBeenCalled();
    expect(getSubscriptionSpy).not.toHaveBeenCalled();
  }));

  it("should navigate to another page if the user is logged in and there's a redirect", fakeAsync(() => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "checkForLoggedInUser").and.returnValue(
      of({ ...mockAuthedUser, pushEnabled: true, autoRefresh: false }),
    );

    const notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, "checkInitialPermissionState").and.returnValue(
      new Promise((resolve) => resolve("granted")),
    );
    spyOn(notificationService, "getCachedSubscription");
    spyOn(notificationService, "getNotifications").and.returnValue(of());

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, "navigate");

    const route = TestBed.inject(ActivatedRoute);
    const paramMapSpy = spyOn(route.snapshot.queryParamMap, "get").and.returnValue("test");

    TestBed.createComponent(AppComponent);

    tick();

    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(["/test"]);
    expect(paramMapSpy).toHaveBeenCalledWith("redirect");
  }));

  // check the 'share' button is hidden
  it("shouldn't show the share button if it's not supported", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;

    // because tests run on Chrome, 'share' doesn't exist in navigator
    expect(component.canShare).toBeFalse();
    expect(
      componentHtml.querySelector("#siteFooter").querySelectorAll("textlessButton")[0],
    ).toBeUndefined();
  });

  // check the share method is called when the button is clicked
  it("should call the share method when the button is clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const shareSpy = spyOn(component, "shareSite");

    component.canShare = true;
    fixture.detectChanges();

    componentHtml.querySelector("#siteFooter").querySelectorAll(".textlessButton")[0].click();
    fixture.detectChanges();

    expect(shareSpy).toHaveBeenCalled();
    done();
  });
});
