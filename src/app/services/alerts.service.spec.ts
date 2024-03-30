/*
	Alerts Service
	Send a Hug Service Tests
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
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { APP_BASE_HREF } from "@angular/common";
import { HttpEventType, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import {} from "jasmine";

import { AlertsService } from "./alerts.service";

describe("AlertsService", () => {
  let alertsService: AlertsService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [],
      providers: [AlertsService, { provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    alertsService = TestBed.inject(AlertsService);
  });

  // Check the service is created
  it("should be created", () => {
    expect(alertsService).toBeTruthy();
  });

  // Check that the service creates an alert
  it("createAlert() - should create an alert", () => {
    expect(alertsService.alertMessage()).toBe("");
    expect(alertsService.shouldDisplayAlert()).toBe(false);
    expect(alertsService.alertType()).toBe("Success");

    alertsService.createAlert({
      type: "Error",
      message: "error",
    });

    expect(alertsService.alertMessage()).toBe("error");
    expect(alertsService.shouldDisplayAlert()).toBe(true);
    expect(alertsService.alertType()).toBe("Error");
  });

  it("createAlert() - should create an alert with reload", () => {
    expect(alertsService.shouldDisplayReloadBtn()).toBe(false);

    alertsService.createAlert(
      {
        type: "Error",
        message: "error",
      },
      { reload: true },
    );

    expect(alertsService.shouldDisplayReloadBtn()).toBe(true);
  });

  it("createAlert() - should create an alert with navigation", () => {
    expect(alertsService.shouldDisplayNavBtn()).toBe(false);

    alertsService.createAlert(
      {
        type: "Error",
        message: "error",
      },
      { navigate: true, navText: "Home", navTarget: "/string" },
    );

    expect(alertsService.shouldDisplayNavBtn()).toBe(true);
  });

  it("createAlert() - should create an alert with default navigation text and target", () => {
    expect(alertsService.shouldDisplayNavBtn()).toBe(false);

    alertsService.createAlert(
      {
        type: "Error",
        message: "error",
      },
      { navigate: true },
    );

    expect(alertsService.shouldDisplayNavBtn()).toBe(true);
    expect(alertsService.navBtnText()).toBe("Home Page");
    expect(alertsService.navBtnTarget()).toBe("/");
  });

  // Check the service creates a success alert
  it("createSuccessAlert() - should create a success alert", () => {
    const alertSpy = spyOn(alertsService, "createAlert");

    alertsService.createSuccessAlert("string", { reload: false });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      {
        type: "Success",
        message: "string",
      },
      { reload: false },
    );
  });

  // Check the service creates an error alert
  it("createErrorAlert() - should create error alert", () => {
    const alertSpy = spyOn(alertsService, "createAlert");

    alertsService.createErrorAlert({
      status: 404,
      message: "",
      error: {
        message: "Not found",
      },
      statusText: "",
      url: "",
      type: HttpEventType.Response,
      name: new HttpErrorResponse({}).name,
      ok: false,
      headers: new HttpHeaders(),
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Not found",
    });
    expect(alertsService.isSWRelated).toBeFalse();
  });

  it("createErrorAlert() - should create error alert with 403 status", () => {
    const alertSpy = spyOn(alertsService, "createAlert");

    alertsService.createErrorAlert({
      status: 403,
      message: "",
      error: {
        message: {
          description: "Forbidden",
        },
      },
      statusText: "",
      url: "",
      type: HttpEventType.Response,
      name: new HttpErrorResponse({}).name,
      ok: false,
      headers: new HttpHeaders(),
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Forbidden",
    });
    expect(alertsService.isSWRelated).toBeFalse();
  });

  it("createErrorAlert() - should create error alert with 400 status", () => {
    const alertSpy = spyOn(alertsService, "createAlert");

    alertsService.createErrorAlert({
      status: 400,
      message: "",
      error: {
        message: {
          description: "Bad request",
        },
      },
      statusText: "",
      url: "",
      type: HttpEventType.Response,
      name: new HttpErrorResponse({}).name,
      ok: false,
      headers: new HttpHeaders(),
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Bad request",
    });
    expect(alertsService.isSWRelated).toBeFalse();
  });

  it("createErrorAlert() - should create error alert with 503 status", () => {
    const alertSpy = spyOn(alertsService, "createAlert");

    alertsService.createErrorAlert({
      status: 503,
      message: "",
      error: {
        message: "Service Unavailable",
      },
      statusText: "Service Unavailable",
      url: "",
      type: HttpEventType.Response,
      name: new HttpErrorResponse({}).name,
      ok: false,
      headers: new HttpHeaders(),
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Service Unavailable",
    });
    expect(alertsService.isSWRelated).toBeFalse();
  });

  // Check the service toggles the offline alert
  it("toggleOfflineAlert() - should add offline alert", () => {
    const onlineSpy = spyOnProperty(Navigator.prototype, "onLine").and.returnValue(true);
    alertsService.toggleOfflineAlert();

    // expect the isOffline subject's current value to be false
    expect(alertsService.isOffline.value).toBe(false);

    // change the 'Navigator.onLine' value to false
    onlineSpy.and.returnValue(false);
    alertsService.toggleOfflineAlert();

    // check the alert is on
    expect(alertsService.isOffline.value).toBe(true);

    // change the 'Navigator.onLine' value to true
    onlineSpy.and.returnValue(true);
    alertsService.toggleOfflineAlert();

    // check the alert is gone
    expect(alertsService.isOffline.value).toBe(false);
  });
});
