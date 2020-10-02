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

  // check tab and tab+shift let the user navigate
  it('should navigate using tab and shift+tab', fakeAsync(() => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(notificationsTab, 'checkFocusBinded').and.callThrough();
    fixture.detectChanges();
    tick();

    // spies
    const spies = [
      spyOn(notifTabDOM.querySelector('#exitButton'), 'focus').and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll('.NotificationButton')[0], 'focus').and.callThrough(),
      spyOn(notifTabDOM.querySelectorAll('.NotificationButton')[1], 'focus').and.callThrough()
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
      spies.forEach((spy, index:number) => {
        if(index == 0) {
          expect(spy).toHaveBeenCalled();
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // step 2: tab event tests
    }).then(() => {
      // trigger tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': false
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the next element
      expect(focusBindedSpy).toHaveBeenCalled();
      spies.forEach((spy, index:number) => {
        if(index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else if(index == 1) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // step 3: shift + tab event tests
    }).then(() => {
      // trigger shift + tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': true
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the previous element
      expect(focusBindedSpy).toHaveBeenCalled();
      expect(focusBindedSpy).toHaveBeenCalledTimes(2);
      spies.forEach((spy, index:number) => {
        if(index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(2);
        }
        else if(index == 1) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    })
  }));

  // check the focus is trapped
  it('should trap focus in the modal', fakeAsync(() => {
    const fixture = TestBed.createComponent(NotificationsTab);
    const notificationsTab  = fixture.componentInstance;
    const notifTabDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(notificationsTab, 'checkFocusBinded').and.callThrough();
    fixture.detectChanges();
    tick();

    // spies
    const spies = [
      spyOn(notifTabDOM.querySelector('#exitButton'), 'focus'),
      spyOn(notifTabDOM.querySelectorAll('.NotificationButton')[0], 'focus'),
      spyOn(notifTabDOM.querySelectorAll('.NotificationButton')[1], 'focus')
    ];
    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // run the tests, with each stage wrapped in a promise to ensure they
    // happen by the correct order
    // step 1: check the last element is focused
    new Promise(() => {
      // focus on the last element
      notifTabDOM.querySelectorAll('.NotificationButton')[1].focus();

      // check the last element has focus
      spies.forEach((spy, index:number) => {
        if(index == 2) {
          expect(spy).toHaveBeenCalled();
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // step 2: check what happens when clicking tab
    }).then(() => {
      // trigger tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': false
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the first element
      expect(focusBindedSpy).toHaveBeenCalled();
      spies.forEach((spy, index:number) => {
        if(index != 1) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // check what happens when clicking shift + tab
    }).then(() => {
      // trigger shift + tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': true
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the last element
      expect(focusBindedSpy).toHaveBeenCalled();
      expect(focusBindedSpy).toHaveBeenCalledTimes(2);
      spies.forEach((spy, index:number) => {
        if(index == 2) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(2);
        }
        else if(index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    })
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
