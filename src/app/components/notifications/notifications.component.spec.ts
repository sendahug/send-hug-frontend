/*
	Admin Dashboard
	Send a Hug Component Tests
---------------------------------------------------
MIT License

Copyright (c) 2020 Send A Hug

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

import 'zone.js/dist/zone';
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import { TestBed, tick, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from '../../app.component';
import { NotificationsTab } from './notifications.component';
import { NotificationService } from '../../services/notifications.service';
import { MockNotificationService } from '../../services/notifications.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('Notifications', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js', { enabled: false }),
        FontAwesomeModule
      ],
      declarations: [
        AppComponent,
        NotificationsTab
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(notificationsTab).toBeTruthy();
  });

  // Check that the component checks whether the user is authenticated
  it('should check whether the user is logged in', () => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const notificationSpy = spyOn(notificationsService, 'getNotifications').and.callThrough();
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService.isUserDataResolved, 'subscribe').and.callThrough();

    // set up the component
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;

    expect(notificationsTab['authService'].isUserDataResolved).toBeTruthy();
    expect(notificationSpy).toHaveBeenCalled();
    expect(authSpy).toHaveBeenCalled()
    expect(notificationsTab.notificationService.pushStatus).toBeFalse();
    expect(notificationsTab.notificationService.refreshStatus).toBeFalse();
  });

  // Check that the button toggles push notifications
  it('has a button that toggles push notifications', fakeAsync(() => {
    // set up the component and its spies
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const toggleSpy = spyOn(notificationsTab, 'togglePushNotifications').and.callThrough();
    const notificationsService = notificationsTab.notificationService;
    const settingsSpy = spyOn(notificationsService, 'updateUserSettings').and.callThrough();
    const subscribeSpy = spyOn(notificationsService, 'subscribeToStream').and.callThrough();
    const unsubscribeSpy = spyOn(notificationsService, 'unsubscribeFromStream').and.callThrough();

    fixture.detectChanges();
    tick();

    // before the click
    expect(notificationsTab.notificationService.pushStatus).toBeFalse();

    // simulate click
    notifTabDOM.querySelector('#nButtons').children.item(0).click();
    fixture.detectChanges();
    tick();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(notificationsTab.notificationService.pushStatus).toBeTrue();
    expect(settingsSpy).toHaveBeenCalled();
    expect(subscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).not.toHaveBeenCalled();

    // simulate another click
    notifTabDOM.querySelectorAll('.NotificationButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(notificationsTab.notificationService.pushStatus).toBeFalse();
    expect(settingsSpy.calls.count()).toBe(2);
    expect(subscribeSpy.calls.count()).toBe(1);
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy.calls.count()).toBe(1);
  }));

  // Check that the button toggles auto refresh
  it('has a button that toggles auto-refresh', fakeAsync(() => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(notificationsService, 'updateUserSettings').and.callThrough();
    const startRefreshSpy = spyOn(notificationsService, 'startAutoRefresh').and.callThrough();
    const stopRefreshSpy = spyOn(notificationsService, 'stopAutoRefresh').and.callThrough();

    // set up the component
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const toggleSpy = spyOn(notificationsTab, 'toggleAutoRefresh').and.callThrough();
    fixture.detectChanges();
    tick();

    // before the click
    expect(notificationsTab.notificationService.refreshStatus).toBeFalse();

    // simulate click
    notifTabDOM.querySelectorAll('.NotificationButton')[1].click();
    fixture.detectChanges();
    tick();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(notificationsTab.notificationService.refreshStatus).toBeTrue();
    expect(notificationsTab.notificationService.refreshRateSecs).toBe(20);
    expect(settingsSpy).toHaveBeenCalled();
    expect(startRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy).not.toHaveBeenCalled();

    // simulate another click
    notifTabDOM.querySelectorAll('.NotificationButton')[1].click();
    fixture.detectChanges();
    tick();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(notificationsTab.notificationService.refreshStatus).toBeFalse();
    expect(notificationsTab.notificationService.refreshRateSecs).toBe(0);
    expect(settingsSpy.calls.count()).toBe(2);
    expect(startRefreshSpy.calls.count()).toBe(1);
    expect(stopRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy.calls.count()).toBe(1);
  }));

  // Check that the exit button emits the correct boolean
  it('emits false upon clicking the exit button', fakeAsync(() => {
    // set up the component
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const emitterSpy = spyOn(notificationsTab.NotificationsMode, 'emit');
    fixture.detectChanges();
    tick();

    // click the exit button
    notifTabDOM.querySelector('#exitButton').click();
    fixture.detectChanges();
    tick();

    expect(emitterSpy).toHaveBeenCalledWith(false);
  }));
});
