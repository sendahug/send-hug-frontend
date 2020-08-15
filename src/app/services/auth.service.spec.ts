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

import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';
import { SWManager } from './sWManager.service';
import { MockSWManager } from './sWManager.service.mock';

describe('AuthService', () => {
  let httpController: HttpTestingController;
  let authService: AuthService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ServiceWorkerModule.register('/sw.js', { enabled: false })
      ],
      providers: [
        AuthService,
        { provide: SWManager, useClass: MockSWManager },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();

    TestBed.get(AuthService).login();
    authService = TestBed.get(AuthService);
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(authService).toBeTruthy();
  });
});
