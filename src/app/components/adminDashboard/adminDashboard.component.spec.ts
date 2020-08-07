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

import { AppComponent } from '../../app.component';
import { AdminDashboard } from './adminDashboard.component';
import { PopUp } from '../popUp/popUp.component';
import { AdminService } from '../../services/admin.service';
import { MockAdminService } from '../../services/admin.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { AlertsService } from '../../services/alerts.service';
import { MockAlertsService } from '../../services/alerts.service.mock';
import { ActivatedRoute } from "@angular/router";
import { Loader } from '../loader/loader.component';

describe('AdminDashboard', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js')
      ],
      declarations: [
        AppComponent,
        AdminDashboard,
        PopUp,
        Loader
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AdminService, useClass: MockAdminService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(adminDashboard).toBeTruthy();
  });
});
