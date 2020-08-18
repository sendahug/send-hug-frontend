import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { ServiceWorkerModule } from '@angular/service-worker';
import { Subscription } from "rxjs";
import {} from 'jasmine';

import { NotificationService } from './notifications.service';
import { AuthService } from './auth.service';
import { MockAuthService } from './auth.service.mock';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';

const pushSub:PushSubscription = {
  endpoint: 'endpoint',
  expirationTime: 100000,
  options: {
    applicationServerKey: null,
    userVisibleOnly: true
  },
  getKey(_name): ArrayBuffer | null {
    return null;
  },
  toJSON():PushSubscriptionJSON {
    return {
      endpoint: 'endpoint',
      expirationTime: 100000
    }
  },
  unsubscribe() {
    return new Promise(Boolean)
  }
};

describe('NotificationService', () => {
  let httpController: HttpTestingController;
  let notificationService: NotificationService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ServiceWorkerModule.register('/sw.js', { enabled: false })
      ],
      providers: [
        NotificationService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();

    notificationService = TestBed.get(NotificationService);
    notificationService['authService'].login();
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  // Check the service triggers auto-refresh
  it('startAutoRefresh() - should trigger auto-refresh', () => {
    const refreshSpy = spyOn(notificationService, 'autoRefresh');

    // before triggering the method
    expect(notificationService.refreshBtn).toBe('Enable');

    notificationService.refreshStatus = true;
    notificationService.startAutoRefresh();

    // after triggering the method
    expect(notificationService.refreshBtn).toBe('Disable');
    expect(refreshSpy).toHaveBeenCalled();
  });

  // Check the service auto-refreshes
  it('autoRefresh() - should run auto-refresh with interval', () => {
    const notifSpy = spyOn(notificationService, 'getNotifications');

    // before triggering the method
    expect(notificationService.refreshCounter).toBeUndefined();
    expect(notificationService.refreshSub).toBeUndefined();

    notificationService.autoRefresh();

    // after triggering the method
    expect(notificationService.refreshCounter).toBeDefined();
    expect(notificationService.refreshSub).toBeDefined();
    notificationService.refreshCounter!.subscribe((value) => {
      expect(value).toBeTruthy();
      expect(notifSpy).toHaveBeenCalled();
    });
  });

  // Check the service also stops auto-refresh
  it('stopAutoRefresh() - should stop auto-refresh', () => {
    notificationService.refreshStatus = true;
    notificationService.startAutoRefresh();

    // check auto-refresh is running
    expect(notificationService.refreshCounter).toBeTruthy();
    expect(notificationService.refreshSub).toBeTruthy();

    const subSpy = spyOn(notificationService.refreshSub as Subscription, 'unsubscribe').and.callThrough();
    notificationService.stopAutoRefresh();

    // check auto-refresh was stopped
    expect(notificationService.refreshCounter).toBeUndefined();
    expect(notificationService.refreshBtn).toBe('Enable');
    expect(subSpy).toHaveBeenCalled();
  });

  // Check the service gets user notifications
  it('getNotifications() - should get user notifications', () => {
    // mock response
    const mockResponse = {
      success: true,
      notifications: [
        {
          id: 2,
          fromId: 2,
          from: 'test',
          forId: 4,
          for: 'testing',
          type: 'hug',
          text: 'test sent you a hug',
          date: new Date()
        }
      ]
    };

    notificationService.getNotifications(false);

    const req = httpController.expectOne('http://localhost:5000/notifications?silentRefresh=false');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(notificationService.notifications.length).toBe(1);
    expect(notificationService.notifications[0].id).toBe(2);
    expect(notificationService.newNotifications).toBe(0);
  });

  // Check that the service gets the user's notifications silently
  it('getNotifications() - should get user notifications with silent refresh', () => {
    // mock response
    const mockResponse = {
      success: true,
      notifications: [
        {
          id: 2,
          fromId: 2,
          from: 'test',
          forId: 4,
          for: 'testing',
          type: 'hug',
          text: 'test sent you a hug',
          date: new Date()
        }
      ]
    };

    notificationService.getNotifications(true);

    const req = httpController.expectOne('http://localhost:5000/notifications?silentRefresh=true');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(notificationService.notifications.length).toBe(1);
    expect(notificationService.notifications[0].id).toBe(2);
    expect(notificationService.newNotifications).toBe(1);
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

  //  const req = httpController.expectOne('http://localhost:5000/notifications');
  //  expect(req.request.method).toEqual('POST');
  //  req.flush(mockResponse);

    expect(pushSpy).toHaveBeenCalled();

    expect(notificationService.notificationsSub).toEqual(pushSub);
    expect(notificationService.toggleBtn).toBe('Disable');
    expect(setSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
  });*/

  // Check the service unsubscribes from push notifications stream
  it('unsubscribeFromStream() - should unsubscribe from PushSubscription', () => {
    notificationService.notificationsSub = pushSub;
    notificationService.pushStatus = true;
    notificationService.toggleBtn = 'Disable';
    const spy = spyOn(notificationService.notificationsSub as PushSubscription, 'unsubscribe');

    notificationService.unsubscribeFromStream();

    expect(spy).toHaveBeenCalled();
    expect(notificationService.toggleBtn).toBe('Enable');
    expect(notificationService.pushStatus).toBeFalse();
  });

  // Check the service sets the subscription in local storage
  it('setSubscription() - should set push subscription in local storage', () => {
    notificationService.notificationsSub = pushSub;
    const spy = spyOn(localStorage, 'setItem');

    notificationService.setSubscription();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('PUSH_SUBSCRIPTION', JSON.stringify(notificationService.notificationsSub));
  });

  // Check the service gets the subscription from local storage
  it('getSubscription() - should get push subscription from localStorage', () => {
    notificationService.pushStatus = true;
    notificationService.notificationsSub = pushSub;
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(pushSub)
    );
    const setSpy = spyOn(notificationService, 'setSubscription');

    notificationService.getSubscription();

    expect(storageSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalledWith('PUSH_SUBSCRIPTION');
    // since it's the same subscription as the one currently set, the set
    // method shouldn't be called
    expect(setSpy).not.toHaveBeenCalled();
  });

  // Check the service gets the subscription from localStorage and calls setSubscription()
  it('getSubscription() - should get push subscription from localStorage and call setSubscription', () => {
    const sub:PushSubscription = {
      endpoint: 'fsfdsfg',
      expirationTime: 110000,
      options: {
        applicationServerKey: null,
        userVisibleOnly: true
      },
      getKey(_name): ArrayBuffer | null {
        return null;
      },
      toJSON():PushSubscriptionJSON {
        return {
          endpoint: '',
          expirationTime: 100000
        }
      },
      unsubscribe() {
        return new Promise(Boolean)
      }
    };
    notificationService.pushStatus = true;
    notificationService.notificationsSub = pushSub;
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(sub)
    );
    const setSpy = spyOn(notificationService, 'setSubscription');

    notificationService.getSubscription();

    expect(storageSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalledWith('PUSH_SUBSCRIPTION');
    expect(setSpy).toHaveBeenCalled();
  });

  // Check the service updates the user's settings
  it('updateUserSettings() - should update user settings', () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        auth0Id: "auth0",
        displayName: "user_14",
        givenH: 0,
        id: 4,
        loginCount: 2,
        receivedH: 0,
        role: "admin",
        autoRefresh: true,
        pushEnabled: false,
        refreshRate: 20
      }
    };

    notificationService.refreshStatus = true;
    notificationService.refreshRateSecs = 20;
    const spy = spyOn(notificationService['alertsService'], 'createSuccessAlert');
    notificationService.updateUserSettings();

    const req = httpController.expectOne('http://localhost:5000/users/all/4');
    expect(req.request.method).toEqual('PATCH');
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('Settings updated successfully!');
  });
});
