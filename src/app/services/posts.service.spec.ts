import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import {} from 'jasmine';

import { PostsService } from './posts.service';
import { AuthService } from './auth.service';
import { MockAuthService } from './auth.service.mock';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';
import { SWManager } from './sWManager.service';
import { MockSWManager } from './sWManager.service.mock';

describe('PostsService', () => {
  let httpController: HttpTestingController;
  let postsService: PostsService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PostsService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService },
        { provide: SWManager, useClass: MockSWManager }
      ]
    }).compileComponents();

    postsService = TestBed.get(PostsService);
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(postsService).toBeTruthy();
  });
});
