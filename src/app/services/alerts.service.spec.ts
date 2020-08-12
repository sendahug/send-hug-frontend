import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { Component } from "@angular/core";
import { APP_BASE_HREF } from '@angular/common';
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
});
