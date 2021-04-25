/*
	Settings Page
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
import { SettingsPage } from './settings.component';
import { IconEditor } from '../iconEditor/iconEditor.component';
import { NotificationService } from '../../services/notifications.service';
import { MockNotificationService } from '../../services/notifications.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { NotificationsTab } from '../notifications/notifications.component';

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
        ServiceWorkerModule.register('sw.js', { enabled: false }),
        FontAwesomeModule
      ],
      declarations: [
        AppComponent,
        SettingsPage,
        NotificationsTab,
        IconEditor
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
  it('displays an error when not authenticated', (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    settingsPage.authService.authenticated = false;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(settingsPage.authService.authenticated).toBeFalse();
      expect(settingsDOM.querySelectorAll('.errorMessage')[0]).toBeTruthy();
      expect(settingsDOM.querySelectorAll('.errorMessage')[0].textContent).toBe('You do not have permission to view thie page!');
      expect(settingsDOM.querySelector('#notificationSettings')).toBeNull();
    });
    done();
  });

  // Check that the button toggles push notifications
  it('has a button that toggles push notifications', (done: DoneFn) => {
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

    // before the click
    expect(settingsPage.notificationService.pushStatus).toBeFalse();

    // simulate click
    settingsDOM.querySelectorAll('.NotificationButton')[0].click();
    fixture.detectChanges();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsPage.notificationService.pushStatus).toBeTrue();
    expect(settingsSpy).toHaveBeenCalled();
    expect(subscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).not.toHaveBeenCalled();

    // simulate another click
    settingsDOM.querySelectorAll('.NotificationButton')[0].click();
    fixture.detectChanges();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsPage.notificationService.pushStatus).toBeFalse();
    expect(settingsSpy.calls.count()).toBe(2);
    expect(subscribeSpy.calls.count()).toBe(1);
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy.calls.count()).toBe(1);
    done();
  });

  // Check that the button toggles auto refresh
  it('has a button that toggles auto-refresh', (done: DoneFn) => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
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

    // before the click
    expect(settingsPage.notificationService.refreshStatus).toBeFalse();

    // simulate click
    settingsDOM.querySelectorAll('.NotificationButton')[1].click();
    fixture.detectChanges();

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

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsPage.notificationService.refreshStatus).toBeFalse();
    expect(settingsPage.notificationService.refreshRateSecs).toBe(0);
    expect(settingsSpy.calls.count()).toBe(2);
    expect(startRefreshSpy.calls.count()).toBe(1);
    expect(stopRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy.calls.count()).toBe(1);
    done();
  });

  // Check that changing the refresh rate changes the set rate
  it('changes the refresh rate', (done: DoneFn) => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(notificationsService, 'updateUserSettings').and.callThrough();

    // set up the component
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage  = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const updateSpy = spyOn(settingsPage, 'updateRefreshRate').and.callThrough();
    settingsPage.authService.authenticated = true;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // check the original refresh rate
      expect(settingsPage.notificationService.refreshRateSecs).toBe(20);
      expect(updateSpy).not.toHaveBeenCalled();

      // change the rate
      settingsDOM.querySelectorAll('input')[0].value = 30;
      settingsDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      // check the rate changed
      expect(settingsPage.notificationService.refreshRateSecs).toBe(30);
      expect(updateSpy).toHaveBeenCalled();
      expect(settingsSpy).toHaveBeenCalled();
    });
    done();
  });
});
