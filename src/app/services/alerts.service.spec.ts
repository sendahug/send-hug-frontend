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
  template: `<div id="alertContainer"></div>`
})
class Sample {

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

    alertsService = TestBed.get(AlertsService);
  });

  // Check the service is created
  it('should be created', () => {
    expect(alertsService).toBeTruthy();
  });

  // Check that the service creates an alert
  it('createAlert() - should create an alert', () => {
    const fixture = TestBed.createComponent(Sample);
    const componentDOM = fixture.nativeElement;
    const buildSpy = spyOn(alertsService, 'buildAlertElement').and.returnValue(new HTMLDivElement());
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
    expect(componentDOM.querySelector('#alertContainer')).toBeNull();
  });

  // Check the service reloads the page
  it('reloadPage() - should reload the page', () => {
    const fixture = TestBed.createComponent(Sample);
    const componentDOM = fixture.nativeElement;
    const reloadSpy = spyOn(window.location, 'reload');

    alertsService.createAlert({
      message: 'message',
      type: 'Notification'
    }, true);
    alertsService.isSWRelated = false;

    fixture.detectChanges();

    // check the alert was created in order to remove it
    expect(componentDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();

    alertsService.reloadPage();
    fixture.detectChanges();

    // check the alert was closed and the reload was called
    expect(componentDOM.querySelectorAll('.alertMessage')[0]).toBeUndefined();
    expect(componentDOM.querySelector('#alertContainer')).toBeNull();
    expect(reloadSpy).toHaveBeenCalled();
  });

  // Check the service reloads the page and alerts the ServiceWorker
  it('reloadPage() - should reload the page and alert the ServiceWorker', () => {

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
    }, false);
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

  //
  it('createSWAlert() - should create service worker alert', () => {

  });

  //
  it('toggleOfflineAlert() - should add offline alert', () => {

  });

  //
  it('toggleOfflineAlert() - should remove offline alert', () => {

  });
});
