import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { ServiceWorkerModule } from '@angular/service-worker';
import {} from 'jasmine';

import { NotificationService } from './notifications.service';
import { AuthService } from './auth.service';
import { MockAuthService } from './auth.service.mock';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';

describe('NotificationService', () => {
  let httpController: HttpTestingController;
  let notificationService: NotificationService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ServiceWorkerModule
      ],
      providers: [
        NotificationService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();

    notificationService = TestBed.get(NotificationService);
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });
});
