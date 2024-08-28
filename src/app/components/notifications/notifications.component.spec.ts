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
import { provideRouter, RouterLink } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { computed, provideZoneChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject, of, Subscription } from "rxjs";

import { NotificationsTab } from "./notifications.component";
import { NotificationService } from "@app/services/notifications.service";
import { AuthService, ToggleButtonOption } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { AppAlert } from "@app/components/appAlert/appAlert.component";

describe("Notifications Tab", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();

    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
      isUserDataResolved: new BehaviorSubject(true),
      pushEnabled: computed(() => false),
      autoRefresh: computed(() => false),
      toggleBtn: computed(() => "Enable" as ToggleButtonOption),
      refreshBtn: computed(() => "Enable" as ToggleButtonOption),
      updateUserData: (_user) => mockSubscription,
    });
    const MockNotificationService = MockProvider(NotificationService, {
      notifications: [],
      getNotifications: (_page) =>
        of({
          notifications: [],
          success: true,
          newCount: 0,
          total_pages: 1,
          current_page: 1,
        }),
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, FontAwesomeModule, RouterLink, NotificationsTab, AppAlert],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        MockAuthService,
        MockNotificationService,
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;

    expect(notificationsTab).toBeTruthy();
  });

  // Check that the component checks whether the user is authenticated
  it("should check whether the user is logged in", () => {
    const authService = TestBed.inject(AuthService);
    authService.isUserDataResolved.next(false);
    const authSpy = spyOn(authService.isUserDataResolved, "subscribe").and.callThrough();

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notificationSpy = spyOn(notificationsTab, "getNotifications");
    authService.isUserDataResolved.next(true);

    expect(notificationsTab["authService"].isUserDataResolved).toBeTruthy();
    expect(notificationSpy).toHaveBeenCalled();
    expect(authSpy).toHaveBeenCalled();
  });

  // Check that the button toggles push notifications
  it("has a button that toggles push notifications", (done: DoneFn) => {
    // set up the component and its spies
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const toggleSpy = spyOn(notificationsTab, "togglePushNotifications").and.callThrough();
    const notificationsService = notificationsTab["notificationService"];
    const settingsSpy = spyOn(notificationsTab["authService"], "updateUserData");
    const subscribeSpy = spyOn(notificationsService, "subscribeToStream");
    const unsubscribeSpy = spyOn(notificationsService, "unsubscribeFromStream");
    fixture.detectChanges();

    // before the click
    expect(notificationsTab["authService"].pushEnabled()).toBeFalse();

    // simulate click
    notifTabDOM.querySelectorAll(".NotificationButton")[0].click();
    fixture.detectChanges();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsSpy).toHaveBeenCalledWith({ pushEnabled: true });
    expect(subscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).not.toHaveBeenCalled();

    // simulate another click
    spyOn(notificationsTab["authService"], "pushEnabled").and.returnValue(true);
    notifTabDOM.querySelectorAll(".NotificationButton")[0].click();
    fixture.detectChanges();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsSpy.calls.count()).toBe(2);
    expect(settingsSpy).toHaveBeenCalledWith({ pushEnabled: false });
    expect(subscribeSpy.calls.count()).toBe(1);
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy.calls.count()).toBe(1);
    done();
  });

  // Check that the button toggles auto refresh
  it("has a button that toggles auto-refresh", (done: DoneFn) => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(TestBed.inject(AuthService), "updateUserData");
    const startRefreshSpy = spyOn(notificationsService, "startAutoRefresh");
    const stopRefreshSpy = spyOn(notificationsService, "stopAutoRefresh");

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const toggleSpy = spyOn(notificationsTab, "toggleAutoRefresh").and.callThrough();
    fixture.detectChanges();

    // before the click
    expect(notificationsTab["authService"].autoRefresh()).toBeFalse();

    // simulate click
    notifTabDOM.querySelectorAll(".NotificationButton")[1].click();
    fixture.detectChanges();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsSpy).toHaveBeenCalled();
    expect(settingsSpy).toHaveBeenCalledWith({ refreshRate: 20, autoRefresh: true });
    expect(startRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy).not.toHaveBeenCalled();

    // simulate another click
    spyOn(notificationsTab["authService"], "autoRefresh").and.returnValue(true);
    notifTabDOM.querySelectorAll(".NotificationButton")[1].click();
    fixture.detectChanges();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsSpy).toHaveBeenCalledWith({ autoRefresh: false });
    expect(settingsSpy.calls.count()).toBe(2);
    expect(startRefreshSpy.calls.count()).toBe(1);
    expect(stopRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy.calls.count()).toBe(1);
    done();
  });

  it("getNotifications() - gets the notifications and updates the variables", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      notifications: [
        {
          id: 2,
          fromId: 2,
          from: "test",
          forId: 4,
          for: "testing",
          type: "hug",
          text: "test sent you a hug",
          date: new Date(),
        },
      ],
      newCount: 1,
      current_page: 2,
      total_pages: 2,
    };

    const notificationService = TestBed.inject(NotificationService);
    const getSpy = spyOn(notificationService, "getNotifications").and.returnValue(of(mockResponse));

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    fixture.detectChanges();

    notificationsTab.getNotifications().add(() => {
      expect(getSpy).toHaveBeenCalledWith(1);
      expect(notificationsTab.currentPage()).toBe(2);
      expect(notificationsTab.totalPages()).toBe(2);

      const prevPageButton = notifTabDOM.querySelectorAll(".prevButton")[0];
      const nextPageButton = notifTabDOM.querySelectorAll(".nextButton")[0];
      const pageCountDiv = notifTabDOM.querySelectorAll(".pageCount")[0];

      expect(prevPageButton.disabled).toBeFalse();
      expect(nextPageButton.disabled).toBeTrue();
      expect(pageCountDiv.textContent.toLowerCase()).toBe("page 2 of 2");
      done();
    });
  });

  // check tab and tab+shift let the user navigate
  // TODO: Figure out why this test isn't working
  it("should navigate using tab and shift+tab", (done: DoneFn) => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(notificationsTab, "checkFocusBinded").and.callThrough();
    fixture.detectChanges();

    // spies
    const spies = [
      spyOn(notifTabDOM.querySelector("#exitButton"), "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[0], "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[1], "focus").and.callThrough(),
    ];

    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // run the tests, with each stage wrapped in a promise to ensure they
    // happen by the correct order
    // step 1: check the first element is focused
    new Promise(() => {
      notificationsTab.ngOnInit();

      // check the first element has focus
      spies.forEach((spy, index: number) => {
        if (index == 0) {
          expect(spy).toHaveBeenCalled();
        } else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
      // step 2: tab event tests
    })
      .then(() => {
        // trigger tab event
        document.getElementById("modalBox")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "tab",
            shiftKey: false,
          }),
        );
        fixture.detectChanges();

        // check the focus shifted to the next element
        expect(focusBindedSpy).toHaveBeenCalled();
        spies.forEach((spy, index: number) => {
          if (index == 0) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else if (index == 1) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else {
            expect(spy).not.toHaveBeenCalled();
          }
        });
        // step 3: shift + tab event tests
      })
      .then(() => {
        // trigger shift + tab event
        document.getElementById("modalBox")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "tab",
            shiftKey: true,
          }),
        );
        fixture.detectChanges();

        // check the focus shifted to the previous element
        expect(focusBindedSpy).toHaveBeenCalled();
        expect(focusBindedSpy).toHaveBeenCalledTimes(2);
        spies.forEach((spy, index: number) => {
          if (index == 0) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(2);
          } else if (index == 1) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else {
            expect(spy).not.toHaveBeenCalled();
          }
        });
      });
    done();
  });

  // check the focus is trapped
  it("should trap focus in the modal", (done: DoneFn) => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(notificationsTab, "checkFocusBinded").and.callThrough();
    fixture.detectChanges();

    // spies
    const spies = [
      spyOn(notifTabDOM.querySelector("#exitButton"), "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[0], "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[1], "focus").and.callThrough(),
    ];
    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // step 1: check the last element is focused
    // focus on the last element
    notifTabDOM.querySelectorAll(".NotificationButton")[1].focus();

    // check the last element has focus
    spies.forEach((spy, index: number) => {
      if (index == 2) {
        expect(spy).toHaveBeenCalled();
      } else {
        expect(spy).not.toHaveBeenCalled();
      }
    });

    // step 2: check what happens when clicking tab
    // trigger tab event
    document.getElementById("modalBox")!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "tab",
        shiftKey: false,
      }),
    );
    fixture.detectChanges();

    // check the focus shifted to the first element
    expect(focusBindedSpy).toHaveBeenCalled();
    spies.forEach((spy, index: number) => {
      if (index != 1) {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      } else {
        expect(spy).not.toHaveBeenCalled();
      }
    });

    // check what happens when clicking shift + tab
    // trigger shift + tab event
    document.getElementById("modalBox")!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "tab",
        shiftKey: true,
      }),
    );
    fixture.detectChanges();

    // check the focus shifted to the last element
    expect(focusBindedSpy).toHaveBeenCalled();
    expect(focusBindedSpy).toHaveBeenCalledTimes(2);
    expect(spies[0]).toHaveBeenCalledTimes(1);
    expect(spies[1]).not.toHaveBeenCalled();
    expect(spies[2]).toHaveBeenCalledTimes(2);
    done();
  });

  it("nextPage() - should continue to the next page", (done: DoneFn) => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const getNotificationsSpy = spyOn(notificationsTab, "getNotifications");
    notificationsTab.totalPages.set(2);
    fixture.detectChanges();

    // before
    expect(notificationsTab.currentPage()).toBe(1);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(0);

    // click the next button
    notifTabDOM.querySelectorAll(".nextButton")[0].click();
    fixture.detectChanges();

    // after
    expect(notificationsTab.currentPage()).toBe(2);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(1);
    done();
  });

  it("prevPage() - should go to the previous page", (done: DoneFn) => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const getNotificationsSpy = spyOn(notificationsTab, "getNotifications");
    notificationsTab.totalPages.set(2);
    notificationsTab.currentPage.set(2);
    fixture.detectChanges();

    // before
    expect(notificationsTab.currentPage()).toBe(2);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(0);

    notifTabDOM.querySelectorAll(".prevButton")[0].click();
    fixture.detectChanges();

    // after
    expect(notificationsTab.currentPage()).toBe(1);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(1);
    done();
  });

  // Check that the exit button emits the correct boolean
  it("emits false upon clicking the exit button", (done: DoneFn) => {
    // set up the component
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    spyOn(notificationsTab, "getNotifications");
    const emitterSpy = spyOn(notificationsTab.NotificationsMode, "emit");
    fixture.detectChanges();

    // click the exit button
    notifTabDOM.querySelector("#exitButton").click();
    fixture.detectChanges();

    expect(emitterSpy).toHaveBeenCalledWith(false);
    done();
  });
});
