/*
  App Alert Component
  Send a Hug Component Tests
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { RouterTestingModule } from "@angular/router/testing";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppAlert } from "./appAlert.component";
import { AlertsService } from "@app/services/alerts.service";

describe("AppAlert", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [AppAlert],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check the page is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const appAlert = fixture.componentInstance;
    expect(appAlert).toBeTruthy();
  });

  it("should display the right title, icon and message (error)", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    const alertMessage = "Test alert message";
    alertsService.alertMessage.set(alertMessage);
    alertsService.alertType.set("Error");
    alertsService.shouldDisplayAlert.set(true);
    fixture.detectChanges();

    const alertElement = alertDOM.querySelectorAll(".alertMessage")[0];
    const alertIcon = alertDOM.querySelectorAll(".alertIcon")[0];
    const alertTitle = alertDOM.querySelectorAll(".alertType")[0];
    const alertText = alertDOM.querySelectorAll(".alertText")[0];

    expect(alertText.textContent).toContain(alertMessage);
    expect(alertIcon.classList).toContain("fa-times-circle");
    expect(alertTitle.textContent).toContain("Error");
    expect(alertElement.getAttribute("role")).toBe("alertdialog");
    expect(alertElement.getAttribute("aria-label")).toBe("An error has occurred");
    expect(alertElement.getAttribute("aria-live")).toBe("assertive");
  });

  it("should display the right title, icon and message (success)", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    const alertMessage = "Test alert message";
    alertsService.alertMessage.set(alertMessage);
    alertsService.alertType.set("Success");
    alertsService.shouldDisplayAlert.set(true);
    fixture.detectChanges();

    const alertElement = alertDOM.querySelectorAll(".alertMessage")[0];
    const alertIcon = alertDOM.querySelectorAll(".alertIcon")[0];
    const alertTitle = alertDOM.querySelectorAll(".alertType")[0];
    const alertText = alertDOM.querySelectorAll(".alertText")[0];

    expect(alertText.textContent).toContain(alertMessage);
    expect(alertIcon.classList).toContain("fa-check-circle");
    expect(alertTitle.textContent).toContain("Success");
    expect(alertElement.getAttribute("role")).toBe("alert");
    expect(alertElement.getAttribute("aria-live")).toBe("assertive");
  });

  it("should display the right title, icon and message (notification)", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    const alertMessage = "Test alert message";
    alertsService.alertMessage.set(alertMessage);
    alertsService.alertType.set("Notification");
    alertsService.shouldDisplayAlert.set(true);
    fixture.detectChanges();

    const alertElement = alertDOM.querySelectorAll(".alertMessage")[0];
    const alertIcon = alertDOM.querySelectorAll(".alertIcon")[0];
    const alertTitle = alertDOM.querySelectorAll(".alertType")[0];
    const alertText = alertDOM.querySelectorAll(".alertText")[0];

    expect(alertText.textContent).toContain(alertMessage);
    expect(alertIcon.classList).toContain("fa-bel");
    expect(alertTitle.textContent).toContain("Notification");
    expect(alertElement.getAttribute("role")).toBe("alert");
    expect(alertElement.getAttribute("aria-live")).toBe("assertive");
  });

  it("should close the alert", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const appAlert = fixture.componentInstance;
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    const closeSpy = spyOn(appAlert, "closeAlert").and.callThrough();
    alertsService.shouldDisplayAlert.set(true);
    fixture.detectChanges();

    alertDOM.querySelector("#alertButton").click();

    expect(closeSpy).toHaveBeenCalled();
    expect(alertsService.shouldDisplayAlert()).toBe(false);
  });

  it("should display reload button", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    alertsService.shouldDisplayReloadBtn.set(true);
    fixture.detectChanges();

    const reloadButton = alertDOM.querySelector("#reloadBtn");

    expect(reloadButton).toBeTruthy();
  });

  it("should display navigation button", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    alertsService.shouldDisplayNavBtn.set(true);
    alertsService.shouldDisplayAlert.set(true);
    fixture.detectChanges();

    const navButton = alertDOM.querySelector("#navButton");

    expect(navButton).toBeTruthy();
  });

  it("should make the request to reload the page", () => {
    const fixture = TestBed.createComponent(AppAlert);
    const alertDOM = fixture.nativeElement;
    const alertsService = fixture.debugElement.injector.get(AlertsService);
    const reloadSpy = spyOn(alertsService, "reloadPage");
    alertsService.shouldDisplayReloadBtn.set(true);
    alertsService.shouldDisplayAlert.set(true);
    fixture.detectChanges();

    alertDOM.querySelector("#reloadBtn").click();

    expect(reloadSpy).toHaveBeenCalled();
  });
});
