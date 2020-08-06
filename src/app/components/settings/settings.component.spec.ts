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

import { AppComponent } from '../../app.component';
import { SettingsPage } from './settings.component';
import { NotificationService } from '../../services/notifications.service';
import { MockNotificationService } from '../../services/notifications.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('SettingsPage', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js')
      ],
      declarations: [
        AppComponent,
        SettingsPage
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: MockAuthService },
        { provide: NotificationService, useClass: MockNotificationService }
      ]
    }).compileComponents();

    TestBed.inject(MockAuthService);
  });

  // Check that the app is created
  it('should create the app', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(settingsPage).toBeTruthy();
  });

  // Check that the user has to be logged in to interact with the component
  it('displays an error when not authenticated', fakeAsync(() => {
    const authService = TestBed.get(AuthService);
    const authSpy = spyOnProperty(authService, 'getAuthenticated', 'get').and.returnValue(false);
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    expect(authService.getAuthenticated).toBeFalse();
    expect(authSpy).toHaveBeenCalled();
    expect(settingsDOM.querySelectorAll('.errorMessage')[0]).toBeTruthy();
    expect(settingsDOM.querySelectorAll('.errorMessage')[0].textContent).toBe('You do not have permission to view thie page!');
    expect(settingsDOM.querySelector('#notificationSettings')).toBeNull();
  }));

  // Check that the button toggles push notifications
  it('has a button that toggles push notifications', fakeAsync(() => {
    // set up the component and its spies
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage  = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const toggleSpy = spyOn(settingsPage, 'togglePushNotifications').and.callThrough();
    const notificationsService = settingsPage.notificationService;
    const settingsSpy = spyOn(notificationsService, 'updateUserSettings').and.callThrough();
    const subscribeSpy = spyOn(notificationsService, 'subscribeToStream').and.callThrough();
    const unsubscribeSpy = spyOn(notificationsService, 'unsubscribeFromStream').and.callThrough();

    fixture.detectChanges();
    tick();

    // before the click
    expect(settingsPage.notificationService.pushStatus).toBeFalse();

    // simulate click
    settingsDOM.querySelectorAll('.NotificationButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsPage.notificationService.pushStatus).toBeTrue();
    expect(settingsSpy).toHaveBeenCalled();
    expect(subscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).not.toHaveBeenCalled();

    // simulate another click
    settingsDOM.querySelectorAll('.NotificationButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsPage.notificationService.pushStatus).toBeFalse();
    expect(settingsSpy.calls.count()).toBe(2);
    expect(subscribeSpy.calls.count()).toBe(1);
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy.calls.count()).toBe(1);
  }));

  // Check that the button toggles auto refresh
  it('has a button that toggles auto-refresh', fakeAsync(() => {
    // set up spies
    const notificationsService = TestBed.get(NotificationService);
    const settingsSpy = spyOn(notificationsService, 'updateUserSettings').and.callThrough();
    const startRefreshSpy = spyOn(notificationsService, 'startAutoRefresh').and.callThrough();
    const stopRefreshSpy = spyOn(notificationsService, 'stopAutoRefresh').and.callThrough();

    // set up the component
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage  = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const toggleSpy = spyOn(settingsPage, 'toggleAutoRefresh').and.callThrough();
    fixture.detectChanges();
    tick();

    // before the click
    expect(settingsPage.notificationService.refreshStatus).toBeFalse();

    // simulate click
    settingsDOM.querySelectorAll('.NotificationButton')[1].click();
    fixture.detectChanges();
    tick();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsPage.notificationService.refreshStatus).toBeTrue();
    expect(settingsPage.notificationService.refreshRateSecs).toBe(20);
    expect(settingsSpy).toHaveBeenCalled();
    expect(startRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy).not.toHaveBeenCalled();

    // simulate another click
    settingsDOM.querySelectorAll('.NotificationButton')[1].click();
    fixture.detectChanges();
    tick();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsPage.notificationService.refreshStatus).toBeFalse();
    expect(settingsPage.notificationService.refreshRateSecs).toBe(0);
    expect(settingsSpy.calls.count()).toBe(2);
    expect(startRefreshSpy.calls.count()).toBe(1);
    expect(stopRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy.calls.count()).toBe(1);
  }));

  // Check that changing the refresh rate changes the set rate
  it('changes the refresh rate', fakeAsync(() => {
    // set up spies
    const notificationsService = TestBed.get(NotificationService);
    const settingsSpy = spyOn(notificationsService, 'updateUserSettings').and.callThrough();

    // set up the component
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage  = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const updateSpy = spyOn(settingsPage, 'updateRefreshRate').and.callThrough();

    fixture.detectChanges();
    tick();

    // check the original refresh rate
    expect(settingsPage.notificationService.refreshRateSecs).toBe(20);
    expect(updateSpy).not.toHaveBeenCalled();

    // change the rate
    settingsDOM.querySelector('#notificationRate').textContent = 30;
    settingsDOM.querySelectorAll('.sendData')[0].click();
    fixture.detectChanges();
    tick();

    // check the rate changed
    expect(settingsPage.notificationService.refreshRateSecs).toBe(30);
    expect(updateSpy).toHaveBeenCalled();
    expect(settingsSpy).toHaveBeenCalled();
  }));
});
