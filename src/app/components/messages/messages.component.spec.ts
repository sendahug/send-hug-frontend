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
import { ActivatedRoute } from '@angular/router';

import { AppComponent } from '../../app.component';
import { AppMessaging } from './messages.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('AppMessaging', () => {
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
        AppMessaging,
        PopUp,
        Loader
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(appMessaging).toBeTruthy();
  });
});
