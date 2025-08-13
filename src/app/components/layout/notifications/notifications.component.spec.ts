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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { computed, provideZonelessChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject, of, Subscription } from "rxjs";

import { NotificationsTabComponent } from "./notifications.component";
import { NotificationService } from "@app/services/notifications.service";
import { AuthService, ToggleButtonOption } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { AppAlertComponent } from "@app/components/appAlert/appAlert.component";
import { ApiClientService } from "@app/services/apiClient.service";

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
      newNotifications: signal(0),
      getNotifications: (_page) =>
        of({
          notifications: [],
          success: true,
          newCount: 0,
          total_pages: 1,
          current_page: 1,
          totalItems: 1,
        }),
    });
    const MockAPIClient = MockProvider(ApiClientService);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FontAwesomeModule,
        RouterLink,
        NotificationsTabComponent,
        AppAlertComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter([]),
        MockAuthService,
        MockNotificationService,
        MockAPIClient,
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;

    expect(notificationsTab).toBeTruthy();
  });

  // Check that the component checks whether the user is authenticated
  it("should check whether the user is logged in", () => {
    const authService = TestBed.inject(AuthService);
    authService.isUserDataResolved.next(false);
    const authSpy = spyOn(authService.isUserDataResolved, "subscribe").and.callThrough();

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notificationSpy = spyOn(notificationsTab, "getNotifications");
    authService.isUserDataResolved.next(true);

    expect(notificationsTab["authService"].isUserDataResolved).toBeTruthy();
    expect(notificationSpy).toHaveBeenCalledWith();
    expect(authSpy).toHaveBeenCalledTimes(1);
  });

  // Check that the button toggles push notifications
  it("has a button that toggles push notifications", async () => {
    // set up the component and its spies
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const toggleSpy = spyOn(notificationsTab, "togglePushNotifications").and.callThrough();
    const notificationsService = notificationsTab["notificationService"];
    const settingsSpy = spyOn(notificationsTab["authService"], "updateUserData");
    const subscribeSpy = spyOn(notificationsService, "subscribeToStream");
    const unsubscribeSpy = spyOn(notificationsService, "unsubscribeFromStream");
    await fixture.whenStable();

    // before the click
    expect(notificationsTab["authService"].pushEnabled()).toBeFalse();

    // simulate click
    notifTabDOM.querySelectorAll(".NotificationButton")[0].click();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalledWith();
    expect(settingsSpy).toHaveBeenCalledWith({ pushEnabled: true });
    expect(subscribeSpy).toHaveBeenCalledWith();
    expect(unsubscribeSpy).not.toHaveBeenCalled();

    // simulate another click
    spyOn(notificationsTab["authService"], "pushEnabled").and.returnValue(true);
    notifTabDOM.querySelectorAll(".NotificationButton")[0].click();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsSpy.calls.count()).toBe(2);
    expect(settingsSpy).toHaveBeenCalledWith({ pushEnabled: false });
    expect(subscribeSpy.calls.count()).toBe(1);
    expect(unsubscribeSpy).toHaveBeenCalledWith();
    expect(unsubscribeSpy.calls.count()).toBe(1);
  });

  // Check that the button toggles auto refresh
  it("has a button that toggles auto-refresh", async () => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(TestBed.inject(AuthService), "updateUserData");
    const startRefreshSpy = spyOn(notificationsService, "startAutoRefresh");
    const stopRefreshSpy = spyOn(notificationsService, "stopAutoRefresh");

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const toggleSpy = spyOn(notificationsTab, "toggleAutoRefresh").and.callThrough();
    await fixture.whenStable();

    // before the click
    expect(notificationsTab["authService"].autoRefresh()).toBeFalse();

    // simulate click
    notifTabDOM.querySelectorAll(".NotificationButton")[1].click();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalledWith();
    expect(settingsSpy).toHaveBeenCalledWith({ refreshRate: 20, autoRefresh: true });
    expect(startRefreshSpy).toHaveBeenCalledWith(20);
    expect(stopRefreshSpy).not.toHaveBeenCalled();

    // simulate another click
    spyOn(notificationsTab["authService"], "autoRefresh").and.returnValue(true);
    notifTabDOM.querySelectorAll(".NotificationButton")[1].click();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsSpy).toHaveBeenCalledWith({ autoRefresh: false });
    expect(settingsSpy.calls.count()).toBe(2);
    expect(startRefreshSpy.calls.count()).toBe(1);
    expect(stopRefreshSpy).toHaveBeenCalledWith();
    expect(stopRefreshSpy.calls.count()).toBe(1);
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
          read: true,
        },
      ],
      newCount: 1,
      current_page: 2,
      total_pages: 2,
      totalItems: 1,
    };

    const notificationService = TestBed.inject(NotificationService);
    const getSpy = spyOn(notificationService, "getNotifications").and.returnValue(of(mockResponse));

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    fixture
      .whenStable()
      .then(() => {
        notificationsTab.getNotifications()!.add(() => {
          expect(getSpy).toHaveBeenCalledWith(1, undefined);
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
      })
      .catch(done.fail);
  });

  it("getNotifications() - gets only read notifications", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      notifications: [],
      newCount: 1,
      current_page: 2,
      total_pages: 2,
      totalItems: 1,
    };

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    notificationsTab.displayUnread.set(false);
    const getSpy = spyOn(
      notificationsTab["notificationService"],
      "getNotifications",
    ).and.returnValue(of(mockResponse));
    fixture
      .whenStable()
      .then(() => {
        notificationsTab.getNotifications()!.add(() => {
          expect(getSpy).toHaveBeenCalledWith(1, true);
          done();
        });
      })
      .catch(done.fail);
  });

  it("getNotifications() - gets only unread notifications", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      notifications: [],
      newCount: 1,
      current_page: 2,
      total_pages: 2,
      totalItems: 1,
    };

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    notificationsTab.displayRead.set(false);
    const getSpy = spyOn(
      notificationsTab["notificationService"],
      "getNotifications",
    ).and.returnValue(of(mockResponse));
    fixture
      .whenStable()
      .then(() => {
        notificationsTab.getNotifications()!.add(() => {
          expect(getSpy).toHaveBeenCalledWith(1, false);
          done();
        });
      })
      .catch(done.fail);
  });

  it("getNotifications() - returns without making a call", () => {
    jasmine.clock().install();

    // mock response
    const mockResponse = {
      success: true,
      notifications: [],
      newCount: 1,
      current_page: 2,
      total_pages: 2,
      totalItems: 1,
    };

    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    notificationsTab.displayUnread.set(false);
    notificationsTab.displayRead.set(false);
    const getSpy = spyOn(
      notificationsTab["notificationService"],
      "getNotifications",
    ).and.returnValue(of(mockResponse));
    fixture.detectChanges();

    notificationsTab.getNotifications();

    jasmine.clock().tick(100);

    expect(getSpy).not.toHaveBeenCalled();

    jasmine.clock().uninstall();
  });

  it("should focus on the exit button when the component is created", async () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notifTabDOM = fixture.nativeElement;
    await fixture.whenStable();

    expect(document.activeElement).toBe(notifTabDOM.querySelector("#exitButton"));
  });

  // check tab and tab+shift let the user navigate
  /** @todo: Figure out why this test isn't working */
  // it("should navigate using tab and shift+tab", async () => {
  //   const fixture = TestBed.createComponent(NotificationsTabComponent);
  //   const notificationsTab = fixture.componentInstance;
  //   const notifTabDOM = fixture.nativeElement;
  //   await fixture.whenStable();

  //   // spies
  //   const spies = [
  //     spyOn(notifTabDOM.querySelector("#exitButton"), "focus").and.callThrough(),
  //     spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[0], "focus").and.callThrough(),
  //     spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[1], "focus").and.callThrough(),
  //     spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[2], "focus").and.callThrough(),
  //     spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[3], "focus").and.callThrough(),
  //     spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[4], "focus").and.callThrough(),
  //   ];

  //   spies.forEach((spy) => {
  //     spy.calls.reset();
  //   });

  //   // step 1: focus on the exit button
  //   notifTabDOM.querySelector("#exitButton").focus();

  //   // step 2: tab event tests
  //   // trigger tab event
  //   document.getElementById("modalBox")!.dispatchEvent(
  //     new KeyboardEvent("keydown", {
  //       key: "tab",
  //     }),
  //   );
  //   await fixture.whenStable();
  //   console.log("step 2", document.activeElement);

  //   // check the focus shifted to the next element
  //   expect(spies[0]).not.toHaveBeenCalled();
  //   expect(spies[1]).toHaveBeenCalledTimes(1);
  //   expect(spies[2]).not.toHaveBeenCalled();
  //   expect(spies[3]).not.toHaveBeenCalled();
  //   expect(spies[4]).not.toHaveBeenCalled();
  //   expect(spies[5]).not.toHaveBeenCalled();

  //   // step 3: shift + tab event tests
  //   // trigger shift + tab event
  //   document.getElementById("modalBox")!.dispatchEvent(
  //     new KeyboardEvent("keydown", {
  //       key: "tab",
  //       shiftKey: true,
  //     }),
  //   );
  //   await fixture.whenStable();
  //   console.log("step 3", document.activeElement);

  //   // check the focus shifted to the previous element
  //   expect(spies[0]).toHaveBeenCalledTimes(1);
  //   expect(spies[1]).toHaveBeenCalledTimes(1);
  //   expect(spies[2]).not.toHaveBeenCalled();
  //   expect(spies[3]).not.toHaveBeenCalled();
  //   expect(spies[4]).not.toHaveBeenCalled();
  //   expect(spies[5]).not.toHaveBeenCalled();
  // });

  // check the focus is trapped
  it("should trap focus in the modal when navigating using the keyboard", async () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(notificationsTab, "checkFocusBinded").and.callThrough();
    await fixture.whenStable();

    // spies
    const spies = [
      spyOn(notifTabDOM.querySelector("#exitButton"), "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[0], "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[1], "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[2], "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[3], "focus").and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll(".NotificationButton")[4], "focus").and.callThrough(),
    ];
    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // step 1: check the last element is focused
    // focus on the last element
    notifTabDOM.querySelectorAll(".NotificationButton")[4].focus();
    await fixture.whenStable();

    // check the last element has focus
    expect(spies[0]).not.toHaveBeenCalled();
    expect(spies[1]).not.toHaveBeenCalled();
    expect(spies[2]).not.toHaveBeenCalled();
    expect(spies[3]).not.toHaveBeenCalled();
    expect(spies[4]).not.toHaveBeenCalled();
    expect(spies[5]).toHaveBeenCalledWith();

    // step 2: check what happens when clicking tab
    // trigger tab event
    document.getElementById("modalBox")!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "tab",
        shiftKey: false,
      }),
    );
    await fixture.whenStable();

    // check the focus shifted to the first element
    expect(focusBindedSpy).toHaveBeenCalledTimes(1);
    expect(spies[0]).toHaveBeenCalledWith();
    expect(spies[1]).not.toHaveBeenCalled();
    expect(spies[2]).not.toHaveBeenCalled();
    expect(spies[3]).not.toHaveBeenCalled();
    expect(spies[4]).not.toHaveBeenCalled();
    expect(spies[5]).toHaveBeenCalledWith();

    // check what happens when clicking shift + tab
    // trigger shift + tab event
    document.getElementById("modalBox")!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "tab",
        shiftKey: true,
      }),
    );
    await fixture.whenStable();

    // check the focus shifted to the last element
    expect(focusBindedSpy).toHaveBeenCalledTimes(2);
    expect(spies[0]).toHaveBeenCalledTimes(1);
    expect(spies[1]).not.toHaveBeenCalled();
    expect(spies[2]).not.toHaveBeenCalled();
    expect(spies[3]).not.toHaveBeenCalled();
    expect(spies[4]).not.toHaveBeenCalled();
    expect(spies[5]).toHaveBeenCalledTimes(2);
  });

  it("nextPage() - should continue to the next page", async () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const getNotificationsSpy = spyOn(notificationsTab, "getNotifications");
    notificationsTab.totalPages.set(2);
    await fixture.whenStable();

    // before
    expect(notificationsTab.currentPage()).toBe(1);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(0);

    // click the next button
    notifTabDOM.querySelectorAll(".nextButton")[0].click();

    // after
    expect(notificationsTab.currentPage()).toBe(2);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(1);
  });

  it("prevPage() - should go to the previous page", async () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const getNotificationsSpy = spyOn(notificationsTab, "getNotifications");
    notificationsTab.totalPages.set(2);
    notificationsTab.currentPage.set(2);
    await fixture.whenStable();

    // before
    expect(notificationsTab.currentPage()).toBe(2);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(0);

    notifTabDOM.querySelectorAll(".prevButton")[0].click();

    // after
    expect(notificationsTab.currentPage()).toBe(1);
    expect(getNotificationsSpy).toHaveBeenCalledTimes(1);
  });

  it("toggleUnread() - should toggle the visibility of unread messages", async () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const getNotificationsSpy = spyOn(notificationsTab, "getNotifications");
    await fixture.whenStable();

    // before
    expect(notificationsTab.displayUnread()).toBeTrue();
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[2].textContent.trim()).toBe(
      "Hide unread",
    );

    notifTabDOM.querySelectorAll(".NotificationButton")[2].click();
    await fixture.whenStable();

    // after
    expect(notificationsTab.displayUnread()).toBeFalse();
    expect(getNotificationsSpy).toHaveBeenCalledWith();
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[2].textContent.trim()).toBe(
      "Show unread",
    );
  });

  it("toggleRead() - should toggle the visibility of read messages", async () => {
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const getNotificationsSpy = spyOn(notificationsTab, "getNotifications");
    await fixture.whenStable();

    // before
    expect(notificationsTab.displayRead()).toBeTrue();
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[3].textContent.trim()).toBe(
      "Hide read",
    );

    notifTabDOM.querySelectorAll(".NotificationButton")[3].click();
    await fixture.whenStable();

    // after
    expect(notificationsTab.displayRead()).toBeFalse();
    expect(getNotificationsSpy).toHaveBeenCalledWith();
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[3].textContent.trim()).toBe(
      "Show read",
    );
  });

  it("markAll() - should mark all notifications read", async () => {
    const apiClient = TestBed.inject(ApiClientService);
    const apiClientSpy = spyOn(apiClient, "patch").and.returnValue(
      of({
        success: true,
        updated: "all",
        read: true,
      }),
    );

    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    notificationsTab["notificationService"].newNotifications.set(10);
    notificationsTab.notifications.set([
      {
        id: 2,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: false,
      },
      {
        id: 3,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: false,
      },
      {
        id: 4,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: false,
      },
    ]);
    await fixture.whenStable();

    // before
    let notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(3);
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[4].textContent.trim()).toBe(
      "Mark all read",
    );

    notifTabDOM.querySelectorAll(".NotificationButton")[4].click();
    await fixture.whenStable();

    // after
    notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(0);
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[4].textContent.trim()).toBe(
      "Mark all unread",
    );

    expect(notificationsTab["notificationService"].newNotifications()).toBe(0);
    expect(apiClientSpy).toHaveBeenCalledWith("notifications", {
      notification_ids: "all",
      read: true,
    });
    notificationsTab.notifications().forEach((notification) => {
      expect(notification.read).toBeTrue();
    });
  });

  it("markAll() - should mark all notifications unread", async () => {
    const apiClient = TestBed.inject(ApiClientService);
    const apiClientSpy = spyOn(apiClient, "patch").and.returnValue(
      of({
        success: true,
        updated: "all",
        read: false,
      }),
    );

    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    notificationsTab["notificationService"].newNotifications.set(0);
    notificationsTab.totalItems.set(3);
    notificationsTab.notifications.set([
      {
        id: 2,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: true,
      },
      {
        id: 3,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: true,
      },
      {
        id: 4,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: true,
      },
    ]);
    await fixture.whenStable();

    // before
    let notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(0);
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[4].textContent.trim()).toBe(
      "Mark all unread",
    );

    notifTabDOM.querySelectorAll(".NotificationButton")[4].click();
    await fixture.whenStable();

    // after
    notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(3);
    expect(notifTabDOM.querySelectorAll(".NotificationButton")[4].textContent.trim()).toBe(
      "Mark all read",
    );

    expect(notificationsTab["notificationService"].newNotifications()).toBe(3);
    expect(apiClientSpy).toHaveBeenCalledWith("notifications", {
      notification_ids: "all",
      read: false,
    });
    notificationsTab.notifications().forEach((notification) => {
      expect(notification.read).toBeFalse();
    });
  });

  it("mark() - should mark a notification read", async () => {
    const apiClient = TestBed.inject(ApiClientService);
    const apiClientSpy = spyOn(apiClient, "patch").and.returnValue(
      of({
        success: true,
        updated: [2],
        read: true,
      }),
    );

    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    notificationsTab["notificationService"].newNotifications.set(2);
    notificationsTab.totalItems.set(3);
    notificationsTab.notifications.set([
      {
        id: 2,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: false,
      },
      {
        id: 3,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: false,
      },
    ]);
    await fixture.whenStable();

    // before
    let notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(2);
    expect(notifTabDOM.querySelectorAll(".readToggle")[0].textContent.trim()).toBe("Mark Read");

    notifTabDOM.querySelectorAll(".readToggle")[0].click();
    await fixture.whenStable();

    // after
    notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(1);
    expect(notifTabDOM.querySelectorAll(".readToggle")[0].textContent.trim()).toBe("Mark Unread");
    expect(notificationsTab["notificationService"].newNotifications()).toBe(1);
    expect(apiClientSpy).toHaveBeenCalledWith("notifications", {
      notification_ids: [2],
      read: true,
    });

    expect(notificationsTab.notifications()[0].read).toBeTrue();
  });

  it("mark() - should mark a notification unread", async () => {
    const apiClient = TestBed.inject(ApiClientService);
    const apiClientSpy = spyOn(apiClient, "patch").and.returnValue(
      of({
        success: true,
        updated: [2],
        read: false,
      }),
    );

    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    notificationsTab["notificationService"].newNotifications.set(1);
    notificationsTab.totalItems.set(3);
    notificationsTab.notifications.set([
      {
        id: 2,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: true,
      },
      {
        id: 3,
        fromId: 2,
        from: "test",
        forId: 4,
        for: "testing",
        type: "hug",
        text: "test sent you a hug",
        date: new Date(),
        read: false,
      },
    ]);
    await fixture.whenStable();

    // before
    let notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(1);
    expect(notifTabDOM.querySelectorAll(".readToggle")[0].textContent.trim()).toBe("Mark Unread");

    notifTabDOM.querySelectorAll(".readToggle")[0].click();
    await fixture.whenStable();

    // after
    notificationBadges = notifTabDOM.querySelectorAll(".badge");

    expect(notificationBadges.length).toBe(2);
    expect(notifTabDOM.querySelectorAll(".readToggle")[0].textContent.trim()).toBe("Mark Read");
    expect(notificationsTab["notificationService"].newNotifications()).toBe(2);
    expect(apiClientSpy).toHaveBeenCalledWith("notifications", {
      notification_ids: [2],
      read: false,
    });

    expect(notificationsTab.notifications()[0].read).toBeFalse();
  });

  // Check that the exit button emits the correct boolean
  it("emits false upon clicking the exit button", async () => {
    // set up the component
    const fixture = TestBed.createComponent(NotificationsTabComponent);
    const notificationsTab = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    spyOn(notificationsTab, "getNotifications");
    const emitterSpy = spyOn(notificationsTab.NotificationsMode, "emit");
    await fixture.whenStable();

    // click the exit button
    notifTabDOM.querySelector("#exitButton").click();

    expect(emitterSpy).toHaveBeenCalledWith(false);
  });
});
