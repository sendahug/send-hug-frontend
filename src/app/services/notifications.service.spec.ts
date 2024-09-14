/*
	Notifications Service
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

import { discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { ServiceWorkerModule } from "@angular/service-worker";
import { Subscription, of } from "rxjs";
import {} from "jasmine";
import { MockProvider } from "ng-mocks";

import { NotificationService } from "./notifications.service";
import { ApiClientService } from "./apiClient.service";

describe("NotificationService", () => {
  let notificationService: NotificationService;
  let pushSub: PushSubscription;

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAPIClient = MockProvider(ApiClientService);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [ServiceWorkerModule.register("/sw.js", { enabled: false })],
      providers: [NotificationService, MockAPIClient],
    }).compileComponents();

    notificationService = TestBed.inject(NotificationService);

    pushSub = {
      endpoint: "endpoint",
      options: {
        applicationServerKey: null,
        userVisibleOnly: true,
      },
      expirationTime: 100000,
      getKey(_name): ArrayBuffer | null {
        return null;
      },
      toJSON(): PushSubscriptionJSON {
        return {
          endpoint: "endpoint",
          expirationTime: 100000,
        };
      },
      unsubscribe() {
        return new Promise(Boolean);
      },
    };
  });

  // Check the service is created
  it("should be created", () => {
    expect(notificationService).toBeTruthy();
  });

  // Check the service auto-refreshes
  it("autoRefresh() - should run auto-refresh with interval", fakeAsync(() => {
    const notifSpy = spyOn(notificationService, "getNotifications").and.returnValue(
      of({
        success: true,
        notifications: [],
        newCount: 0,
        current_page: 1,
        total_pages: 1,
        totalItems: 1,
      }),
    );

    // before triggering the method
    expect(notificationService.refreshCounter).toBeUndefined();
    expect(notificationService.refreshSub).toBeUndefined();

    notificationService.startAutoRefresh(20);

    // after triggering the method
    expect(notificationService.refreshCounter).toBeDefined();
    expect(notificationService.refreshSub).toBeDefined();

    // wait for the first round of the interval to pass
    tick(20 * 1000);

    expect(notifSpy).toHaveBeenCalled();
    notificationService.refreshCounter!.subscribe((value) => {
      expect(value).toBeTruthy();
    });

    discardPeriodicTasks();
  }));

  // Check the service also stops auto-refresh
  it("stopAutoRefresh() - should stop auto-refresh", () => {
    // start auto-refresh
    notificationService.startAutoRefresh(20);

    const subSpy = spyOn(
      notificationService.refreshSub as Subscription,
      "unsubscribe",
    ).and.callThrough();
    notificationService.stopAutoRefresh();

    // check auto-refresh was stopped
    expect(notificationService.refreshCounter).toBeUndefined();
    expect(subSpy).toHaveBeenCalled();
  });

  it("stopAutoRefresh() - should do nothing if auto-refresh isn't on", () => {
    expect(notificationService.refreshSub).toBeUndefined();

    notificationService.stopAutoRefresh();

    expect(notificationService.refreshCounter).toBeUndefined();
    expect(notificationService.refreshSub).toBeUndefined();
  });

  // Check the service gets user notifications
  it("getNotifications() - should get user notifications", (done: DoneFn) => {
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
      newCount: 0,
    };

    const apiClientSpy = spyOn(notificationService["apiClient"], "get").and.returnValue(
      of(mockResponse),
    );

    notificationService.getNotifications().subscribe({
      next(_value) {
        expect(apiClientSpy).toHaveBeenCalledWith("notifications", { page: 1 });
        expect(notificationService.newNotifications()).toBe(0);
        done();
      },
    });
  });

  // Check that the service gets the user's notifications silently
  it("getNotifications() - should get user notifications with silent refresh", (done: DoneFn) => {
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
    };

    const apiClientSpy = spyOn(notificationService["apiClient"], "get").and.returnValue(
      of(mockResponse),
    );

    notificationService.getNotifications(2).subscribe({
      next(_value) {
        expect(apiClientSpy).toHaveBeenCalledWith("notifications", { page: 2 });
        expect(notificationService.newNotifications()).toBe(1);
        done();
      },
    });
  });

  it("checkInitialPermissionState() - returns a promise that resolves to undefined if pushEnabled is false", (done: DoneFn) => {
    notificationService.checkInitialPermissionState(false).then((value) => {
      expect(value).toBeUndefined();
      done();
    });
  });

  it("checkInitialPermissionState() - returns the permission state", (done: DoneFn) => {
    const stateSpy = spyOn(notificationService, "getPushPermissionState").and.returnValue(
      new Promise((resolve) => resolve("granted")),
    );
    const alertsSpy = spyOn(notificationService["alertsService"], "createAlert");
    const subscribeSpy = spyOn(notificationService, "subscribeToStream");

    notificationService.checkInitialPermissionState(true).then((value) => {
      expect(stateSpy).toHaveBeenCalled();
      expect(alertsSpy).not.toHaveBeenCalled();
      expect(subscribeSpy).not.toHaveBeenCalled();
      expect(value).toBe("granted");
      done();
    });
  });

  it("checkInitialPermissionState() - handles denied permission", (done: DoneFn) => {
    const stateSpy = spyOn(notificationService, "getPushPermissionState").and.returnValue(
      new Promise((resolve) => resolve("denied")),
    );
    const alertsSpy = spyOn(notificationService["alertsService"], "createAlert");

    notificationService.checkInitialPermissionState(true).then((value) => {
      expect(stateSpy).toHaveBeenCalled();
      expect(alertsSpy).toHaveBeenCalledWith({
        type: "Error",
        message:
          "Push notifications permission has been denied. Go to your browser settings, remove Send A Hug from the denied list, and then activate push notifications again.",
      });
      expect(value).toBe("denied");
      done();
    });
  });

  it("checkInitialPermissionState() - handles 'prompt' permission", (done: DoneFn) => {
    const stateSpy = spyOn(notificationService, "getPushPermissionState").and.returnValue(
      new Promise((resolve) => resolve("prompt")),
    );
    const subscribeSpy = spyOn(notificationService, "subscribeToStream");

    notificationService.checkInitialPermissionState(true).then((value) => {
      expect(stateSpy).toHaveBeenCalled();
      expect(subscribeSpy).toHaveBeenCalled();
      expect(value).toBe("prompt");
      done();
    });
  });

  // Check the service subscribes to push notifications stream
  /*it('subscribeToStream() - should subscribe to PushSubscription', () => {
    // mock response
    const mockResponse = {
      success: true,
      subscribed: 'name'
    };
    const pushSpy = spyOn(notificationService['swPush'], 'requestSubscription').and.returnValue(new Promise(() => {
      return pushSub
    }));
    const setSpy = spyOn(notificationService, 'setSubscription');
    const alertSpy = spyOn(notificationService['alertsService'], 'createSuccessAlert');

    expect('PushManager' in window).toBeTrue();

    notificationService.subscribeToStream();

  //  const req = httpController.expectOne(`${notificationService.serverUrl}/notifications`);
  //  expect(req.request.method).toEqual('POST');
  //  req.flush(mockResponse);

    expect(pushSpy).toHaveBeenCalled();

    expect(notificationService.notificationsSub).toEqual(pushSub);
    expect(notificationService.toggleBtn).toBe('Disable');
    expect(setSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
  });*/

  it("subscribeToStream() - should update the back-end with the subscription", (done: DoneFn) => {
    const requestSpy = spyOn(notificationService, "requestSubscription").and.returnValue(
      new Promise((resolve) =>
        resolve({
          ...pushSub,
        }),
      ),
    );
    const apiClientSpy = spyOn(notificationService["apiClient"], "post").and.returnValue(
      of({ subId: 2 }),
    );
    const alertsSpy = spyOn(notificationService["alertsService"], "createSuccessAlert");

    notificationService.subscribeToStream().then(() => {
      expect(requestSpy).toHaveBeenCalled();
      expect(apiClientSpy).toHaveBeenCalled();
      expect(alertsSpy).toHaveBeenCalledWith("Subscribed to push notifications successfully!");
      expect(notificationService.subId).toEqual(2);
      done();
    });
  });

  it("subscribeToStream() - should handle an error", (done: DoneFn) => {
    const requestSpy = spyOn(notificationService, "requestSubscription").and.rejectWith(
      new Error("ERROR"),
    );
    const apiClientSpy = spyOn(notificationService["apiClient"], "post");
    const successAlertsSpy = spyOn(notificationService["alertsService"], "createSuccessAlert");
    const alertsSpy = spyOn(notificationService["alertsService"], "createAlert");

    notificationService.subscribeToStream().then(() => {
      expect(requestSpy).toHaveBeenCalled();
      expect(apiClientSpy).not.toHaveBeenCalled();
      expect(successAlertsSpy).not.toHaveBeenCalled();
      expect(alertsSpy).toHaveBeenCalled();
      done();
    });
  });

  // Check the service unsubscribes from push notifications stream
  it("unsubscribeFromStream() - should unsubscribe from PushSubscription", (done: DoneFn) => {
    notificationService.notificationsSub = pushSub;
    const spy = spyOn(
      notificationService.notificationsSub as PushSubscription,
      "unsubscribe",
    ).and.returnValue(new Promise((resolve) => resolve(false)));

    notificationService.unsubscribeFromStream().then((val) => {
      expect(spy).toHaveBeenCalled();
      expect(val).toBeFalse();
      done();
    });
  });

  it("requestSubscription() - should request a subscription", (done: DoneFn) => {
    const requestSpy = spyOn(notificationService["swPush"], "requestSubscription").and.returnValue(
      new Promise((resolve) => resolve(pushSub)),
    );
    // setSubscription is protected, but we need to spy on it
    // @ts-ignore
    const setSpy = spyOn(notificationService, "setSubscription");

    notificationService.requestSubscription().then((sub) => {
      expect(requestSpy).toHaveBeenCalled();
      expect(notificationService.notificationsSub).toBe(sub as PushSubscription);
      expect(setSpy).toHaveBeenCalled();
      done();
    });
  });

  it("requestSubscription() - handles an error", (done: DoneFn) => {
    const requestSpy = spyOn(notificationService["swPush"], "requestSubscription").and.rejectWith(
      new Error("ERROR!"),
    );
    // setSubscription is protected, but we need to spy on it
    // @ts-ignore
    const setSpy = spyOn(notificationService, "setSubscription");
    const alertSpy = spyOn(notificationService["alertsService"], "createAlert");

    notificationService.requestSubscription().then((_sub) => {
      expect(requestSpy).toHaveBeenCalled();
      expect(setSpy).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      done();
    });
  });

  it("renewPushSubscription() - should renew the push subscription", fakeAsync(() => {
    notificationService.subscriptionDate = Date.now();
    notificationService.resubscribeCalls = 0;
    notificationService.subId = 1;
    const requestSpy = spyOn(notificationService, "requestSubscription").and.returnValue(
      new Promise((resolve) => resolve(pushSub)),
    );
    const apiClientSpy = spyOn(notificationService["apiClient"], "patch").and.returnValue(
      of({ subId: 1 }),
    );

    const mockEvent = new MessageEvent("event", { data: { action: "resubscribe" } });
    notificationService.renewPushSubscription(mockEvent);

    tick(100);

    expect(requestSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalled();
    expect(notificationService.resubscribeCalls).toEqual(1);
  }));

  it("renewPushSubscription() - should make resubscribeCalls 0 if it's been more than 24 hours", fakeAsync(() => {
    notificationService.subscriptionDate = Date.now() - 864e5 * 2;
    notificationService.resubscribeCalls = 1;
    notificationService.subId = 1;
    const requestSpy = spyOn(notificationService, "requestSubscription").and.returnValue(
      new Promise((resolve) => resolve(pushSub)),
    );
    const apiClientSpy = spyOn(notificationService["apiClient"], "patch").and.returnValue(
      of({ subId: 1 }),
    );

    const mockEvent = new MessageEvent("event", { data: { action: "resubscribe" } });
    notificationService.renewPushSubscription(mockEvent);

    tick(100);

    expect(requestSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalled();
    expect(notificationService.resubscribeCalls).toEqual(1);
  }));

  it("unsubscribeFromStream() - should do nothing ", (done: DoneFn) => {
    notificationService.notificationsSub = undefined;

    notificationService.unsubscribeFromStream().then((val) => {
      expect(val).toBeTrue();
      done();
    });
  });

  // // Check the service gets the subscription from local storage
  it("getSubscription() - should get push subscription from localStorage", () => {
    notificationService.notificationsSub = pushSub;
    const storageSpy = spyOn(localStorage, "getItem").and.returnValue(JSON.stringify(pushSub));
    // setSubscription is protected, but we need to spy on it
    // @ts-ignore
    const setSpy = spyOn(notificationService, "setSubscription");

    notificationService.getCachedSubscription();

    expect(storageSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalledWith("PUSH_SUBSCRIPTION");
    // since it's the same subscription as the one currently set, the set
    // method shouldn't be called
    expect(setSpy).not.toHaveBeenCalled();
  });

  // Check the service gets the subscription from localStorage and calls setSubscription()
  it("getSubscription() - should get push subscription from localStorage and call setSubscription", () => {
    const sub: PushSubscription = {
      endpoint: "fsfdsfg",
      options: {
        applicationServerKey: null,
        userVisibleOnly: true,
      },
      expirationTime: 100000,
      getKey(_name): ArrayBuffer | null {
        return null;
      },
      toJSON(): PushSubscriptionJSON {
        return {
          endpoint: "",
          expirationTime: 100000,
        };
      },
      unsubscribe() {
        return new Promise(Boolean);
      },
    };
    notificationService.notificationsSub = pushSub;
    const storageSpy = spyOn(localStorage, "getItem").and.returnValue(JSON.stringify(sub));
    // setSubscription is protected, but we need to spy on it
    // @ts-ignore
    const setSpy = spyOn(notificationService, "setSubscription");

    notificationService.getCachedSubscription();

    expect(storageSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalledWith("PUSH_SUBSCRIPTION");
    expect(setSpy).toHaveBeenCalled();
  });

  it("setSubscription() - sets the sub in localStorage", () => {
    const localStorageSpy = spyOn(localStorage, "setItem").and.callThrough();
    notificationService.notificationsSub = pushSub;

    notificationService["setSubscription"]();

    expect(localStorageSpy).toHaveBeenCalledWith("PUSH_SUBSCRIPTION", JSON.stringify(pushSub));
  });

  it("setSubscription() - does nothing if there's no sub", () => {
    const localStorageSpy = spyOn(localStorage, "setItem").and.callThrough();
    notificationService.notificationsSub = undefined;

    notificationService["setSubscription"]();

    expect(localStorageSpy).not.toHaveBeenCalled();
  });
});
