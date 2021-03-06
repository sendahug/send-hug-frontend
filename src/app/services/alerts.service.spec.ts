/*
	Alerts Service
	Send a Hug Service Tests
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
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { Component } from "@angular/core";
import { APP_BASE_HREF } from '@angular/common';
import { HttpEventType, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import {} from 'jasmine';

import { AlertsService } from './alerts.service';

@Component({
  selector: 'app-root',
  template: `
    <div id="noInternet" *ngIf="alertsService.isOffline.value" role="banner">You are not currently connected to the internet. For updated data, reconnect to the internet and try again.</div>
    <div id="alertContainer"></div>
    `
})
class Sample {
  constructor(private alertsService:AlertsService) {

  }
}

describe('AlertsService', () => {
  let alertsService: AlertsService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        Sample
      ],
      providers: [
        AlertsService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();

    alertsService = TestBed.inject(AlertsService);
  });

  // Check the service is created
  it('should be created', () => {
    expect(alertsService).toBeTruthy();
  });

  // Check that the service creates an alert
  it('createAlert() - should create an alert', () => {
    const fixture = TestBed.createComponent(Sample);
    const componentDOM = fixture.nativeElement;
    const buildSpy = spyOn(alertsService, 'buildAlertElement').and.callFake((alert) => {
      const div = document.createElement('div');
      div.className = `alertMessage ${alert.type}`

      let closeButton = document.createElement('button');
      closeButton.className = 'appButton';
      closeButton.id = 'alertButton';
      closeButton.textContent = 'Close';
      div.append(closeButton);

      return div;
    });
    alertsService.createAlert({
      type: 'Error',
      message: 'error'
    });

    fixture.detectChanges();

    expect(buildSpy).toHaveBeenCalled();
    expect(componentDOM.querySelector('#alertContainer').firstElementChild).toBeTruthy();
  });

  // Check the service closes the alert
  it('closeAlert() - should close the alert', () => {
    const fixture = TestBed.createComponent(Sample);
    const componentDOM = fixture.nativeElement;

    alertsService.createAlert({
      message: 'message',
      type: 'Notification'
    });

    fixture.detectChanges();

    // check the alert was created in order to remove it
    expect(componentDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();

    alertsService.closeAlert();
    fixture.detectChanges();

    // check the alert was closed
    expect(componentDOM.querySelectorAll('.alertMessage')[0]).toBeUndefined();
  });

  // Check the service builds the alert element correctly
  it('buildAlertElement() - should build the alert element', () => {
    const alert = alertsService.buildAlertElement({
      type: 'Success',
      message: 'message'
    });

    expect(alert.tagName.toLowerCase()).toBe('div');
    expect(alert.querySelector('h3')!.textContent).toBe('Success');
    expect(alert.querySelector('div')!.textContent).toBe('message');
    expect(alert.querySelector('button')!.id).toBe('alertButton');
  });

  // Check the service adds a reload button
  it('addReloadButton() - should add a reload button', () => {
    let alert = alertsService.buildAlertElement({
      type: 'Success',
      message: 'message'
    });

    alertsService.addReloadButton(alert);

    expect(alert.querySelectorAll('button').length).toBe(2);
    expect(alert.querySelector('#reloadBtn')).toBeTruthy();
    expect(alert.querySelector('#reloadBtn')!.textContent).toBe('Reload Page');
  });

  // Check the service adds a navigation button
  it('addNavigateButton() - should add navigation button', () => {
    let alert = alertsService.buildAlertElement({
      type: 'Success',
      message: 'message'
    });

    alertsService.addNavigateButton(alert, '/');

    expect(alert.querySelector('#navButton')).toBeTruthy();
    expect(alert.querySelector('#navButton')!.tagName.toLowerCase()).toBe('a');
    expect(alert.querySelector('#navButton')!.getAttribute('href')).toBe('/');
    expect(alert.querySelector('#navButton')!.textContent).toBe('Home Page');
  });

  // Check the service creates a success alert
  it('createSuccessAlert() - should create a success alert', () => {
    const alertSpy = spyOn(alertsService, 'createAlert');

    alertsService.createSuccessAlert('string', false);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: 'Success',
      message: 'string'
    }, false, undefined);
  });

  // Check the service creates an error alert
  it('createErrorAlert() - should create error alert', () => {
    const alertSpy = spyOn(alertsService, 'createAlert');

    alertsService.createErrorAlert({
      status: 404,
      message: '',
      error: {
        message: 'Not found'
      },
      statusText: '',
      url: '',
      type: HttpEventType.Response,
      name: new HttpErrorResponse({}).name,
      ok: false,
      headers: new HttpHeaders()
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: 'Error',
      message: 'Not found'
    });
    expect(alertsService.isSWRelated).toBeFalse();
  });

  // Check the service toggles the offline alert
  it('toggleOfflineAlert() - should add offline alert', () => {
    const fixture = TestBed.createComponent(Sample);
    const componentDOM = fixture.nativeElement;
    const onlineSpy = spyOnProperty(Navigator.prototype, 'onLine').and.returnValue(true);
    alertsService.toggleOfflineAlert();
    fixture.detectChanges();

    // expect the isOffline subject's current value to be false
    expect(alertsService.isOffline.value).toBe(false);
    expect(componentDOM.querySelector('#noInternet')).toBeNull();

    // change the 'Navigator.onLine' value to false
    onlineSpy.and.returnValue(false);
    alertsService.toggleOfflineAlert();
    fixture.detectChanges();

    // check the alert is on
    expect(alertsService.isOffline.value).toBe(true);
    expect(componentDOM.querySelector('#noInternet')).toBeTruthy();

    // change the 'Navigator.onLine' value to true
    onlineSpy.and.returnValue(true);
    alertsService.toggleOfflineAlert();
    fixture.detectChanges();

    // check the alert is gone
    expect(alertsService.isOffline.value).toBe(false);
    expect(componentDOM.querySelector('#noInternet')).toBeNull();
  });
});
