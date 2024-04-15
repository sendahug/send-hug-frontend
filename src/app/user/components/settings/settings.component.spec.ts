/*
	Settings Page
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
import { RouterModule } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";

import { SettingsPage } from "./settings.component";
import { IconEditor } from "@user//components/iconEditor/iconEditor.component";
import { NotificationService } from "@app/services/notifications.service";
import { AuthService } from "@common/services/auth.service";
import { AlertsService } from "@common/services/alerts.service";
import { mockAuthedUser } from "@tests/mockData";
import { AppCommonModule } from "@app/common/common.module";

describe("SettingsPage", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
        ReactiveFormsModule,
        AppCommonModule,
      ],
      declarations: [SettingsPage, IconEditor],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData = { ...mockAuthedUser };

    const notificationService = TestBed.inject(NotificationService);
    notificationService.pushStatus = false;
    notificationService.refreshStatus = false;
  });

  // Check that the app is created
  it("should create the app", () => {
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    expect(settingsPage).toBeTruthy();
  });

  // Check that the user has to be logged in to interact with the component
  it("displays an error when not authenticated", (done: DoneFn) => {
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    settingsPage.authService.authenticated.set(false);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(settingsPage.authService.authenticated()).toBeFalse();
      expect(settingsDOM.querySelectorAll(".errorMessage")[0]).toBeTruthy();
      expect(settingsDOM.querySelectorAll(".errorMessage")[0].textContent).toBe(
        "You do not have permission to view thie page!",
      );
      expect(settingsDOM.querySelector("#notificationSettings")).toBeNull();
    });
    done();
  });

  it("should show the icon editor", (done: DoneFn) => {
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    settingsPage.authService.authenticated.set(false);

    fixture.detectChanges();

    settingsPage.toggleIconEditor(true);

    expect(settingsPage.editIcon).toBeTrue();
    done();
  });

  it("should hide the icon editor", (done: DoneFn) => {
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    settingsPage.authService.authenticated.set(false);

    fixture.detectChanges();

    settingsPage.toggleIconEditor(false);

    expect(settingsPage.editIcon).toBeFalse();
    done();
  });

  it("pre-fills the form based on the user's settings", (done: DoneFn) => {
    const authService = TestBed.inject(AuthService);
    authService.isUserDataResolved.next(false);

    // set up the component and its spies
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    fixture.detectChanges();

    expect(settingsPage.editSettingsForm.controls.enableAutoRefresh.value).toBeFalse();
    expect(settingsPage.editSettingsForm.controls.notificationRate.value).toBe(20);

    authService.userData!.autoRefresh = true;
    authService.userData!.refreshRate = 60;
    authService.isUserDataResolved.next(true);
    fixture.detectChanges();

    expect(settingsPage.editSettingsForm.controls.enableAutoRefresh.value).toBeTrue();
    expect(settingsPage.editSettingsForm.controls.notificationRate.value).toBe(60);
    done();
  });

  // Check that the checkbox toggles push notifications
  it("has a checkbox that toggles push notifications", (done: DoneFn) => {
    const notificationsService = TestBed.inject(NotificationService);
    notificationsService.refreshStatus = false;

    // set up the component and its spies
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const toggleSpy = spyOn(settingsPage, "updateSettings").and.callThrough();
    const settingsSpy = spyOn(notificationsService, "updateUserSettings");
    const subscribeSpy = spyOn(notificationsService, "subscribeToStream");
    const unsubscribeSpy = spyOn(notificationsService, "unsubscribeFromStream");

    fixture.detectChanges();

    // before the click
    expect(settingsPage.notificationService.pushStatus).toBeFalse();

    // simulate click
    settingsDOM.querySelector("#enableNotifications").click();
    settingsDOM.querySelector("#enableNotifications").dispatchEvent(new Event("input"));
    settingsDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsPage.notificationService.pushStatus).toBeTrue();
    expect(settingsSpy).toHaveBeenCalled();
    expect(subscribeSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).not.toHaveBeenCalled();

    // simulate another click
    settingsDOM.querySelector("#enableNotifications").click();
    settingsDOM.querySelector("#enableNotifications").dispatchEvent(new Event("input"));
    settingsDOM.querySelectorAll(".sendData")[0].click();
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

  // Check that the checkbox toggles auto refresh
  it("has a checkbox that toggles auto-refresh", (done: DoneFn) => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(notificationsService, "updateUserSettings");
    const startRefreshSpy = spyOn(notificationsService, "startAutoRefresh");
    const stopRefreshSpy = spyOn(notificationsService, "stopAutoRefresh");

    // set up the component
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const toggleSpy = spyOn(settingsPage, "updateSettings").and.callThrough();
    fixture.detectChanges();

    // before the click
    expect(settingsPage.notificationService.refreshStatus).toBeFalse();

    // simulate click
    settingsDOM.querySelector("#enableAutoRefresh").click();
    settingsDOM.querySelector("#enableAutoRefresh").dispatchEvent(new Event("input"));
    settingsDOM.querySelector("#notificationRate").value = 30;
    settingsDOM.querySelector("#notificationRate").dispatchEvent(new Event("input"));
    settingsDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // after the first click, check 'subscribe' was called
    expect(toggleSpy).toHaveBeenCalled();
    expect(settingsPage.notificationService.refreshStatus).toBeTrue();
    expect(settingsPage.notificationService.refreshRateSecs).toBe(30);
    expect(settingsSpy).toHaveBeenCalled();
    expect(startRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy).not.toHaveBeenCalled();

    // simulate another click
    settingsDOM.querySelector("#enableAutoRefresh").click();
    settingsDOM.querySelector("#enableAutoRefresh").dispatchEvent(new Event("input"));
    settingsDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // after the second click, chcek 'unsubscribe' was called
    expect(toggleSpy.calls.count()).toBe(2);
    expect(settingsPage.notificationService.refreshStatus).toBeFalse();
    expect(settingsPage.notificationService.refreshRateSecs).toBe(30);
    expect(settingsSpy.calls.count()).toBe(2);
    expect(startRefreshSpy.calls.count()).toBe(1);
    expect(stopRefreshSpy).toHaveBeenCalled();
    expect(stopRefreshSpy.calls.count()).toBe(1);
    done();
  });

  // Check that changing the refresh rate changes the set rate
  it("changes the refresh rate", (done: DoneFn) => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(notificationsService, "updateUserSettings");

    // set up the component
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const updateSpy = spyOn(settingsPage, "updateSettings").and.callThrough();
    settingsPage.authService.authenticated.set(true);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // check the original refresh rate
      expect(settingsPage.notificationService.refreshRateSecs).toBe(20);
      expect(updateSpy).not.toHaveBeenCalled();

      // change the rate
      settingsDOM.querySelector("#enableAutoRefresh").click();
      settingsDOM.querySelector("#enableAutoRefresh").dispatchEvent(new Event("input"));
      settingsDOM.querySelector("#notificationRate").value = 30;
      settingsDOM.querySelector("#notificationRate").dispatchEvent(new Event("input"));
      settingsDOM.querySelectorAll(".sendData")[0].click();
      fixture.detectChanges();

      // check the rate changed
      expect(settingsPage.notificationService.refreshRateSecs).toBe(30);
      expect(updateSpy).toHaveBeenCalled();
      expect(settingsSpy).toHaveBeenCalled();
    });
    done();
  });

  it("shows an error if there's no rate", (done: DoneFn) => {
    // set up spies
    const notificationsService = TestBed.inject(NotificationService);
    const settingsSpy = spyOn(notificationsService, "updateUserSettings");

    // set up the component
    const fixture = TestBed.createComponent(SettingsPage);
    const settingsPage = fixture.componentInstance;
    const settingsDOM = fixture.nativeElement;
    const alertsSpy = spyOn(TestBed.inject(AlertsService), "createAlert");
    settingsPage.authService.authenticated.set(true);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // check the original refresh rate
      expect(settingsPage.notificationService.refreshRateSecs).toBe(20);

      // change the rate
      settingsDOM.querySelector("#enableAutoRefresh").click();
      settingsDOM.querySelector("#enableAutoRefresh").dispatchEvent(new Event("input"));
      settingsDOM.querySelector("#notificationRate").value = 0;
      settingsDOM.querySelector("#notificationRate").dispatchEvent(new Event("input"));
      settingsDOM.querySelectorAll(".sendData")[0].click();
      fixture.detectChanges();

      // check the rate changed
      expect(settingsPage.notificationService.refreshRateSecs).not.toBe(0);
      expect(settingsSpy).not.toHaveBeenCalled();
      expect(alertsSpy).toHaveBeenCalledWith({
        type: "Error",
        message: "Refresh rate cannot be empty or zero. Please fill the field and try again.",
      });
      expect(document.getElementById("notificationRate")!.className).toContain("ng-invalid");
      expect(document.getElementById("notificationRate")!.getAttribute("aria-invalid")).toEqual(
        "true",
      );
    });
    done();
  });
});