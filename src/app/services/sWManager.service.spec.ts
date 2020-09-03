/*
	SWManager
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
*/

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

import { SWManager } from './sWManager.service';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';

describe('SWManagerService', () => {
  let httpController: HttpTestingController;
  let sWManagerService: SWManager;

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
        SWManager,
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();

    sWManagerService = TestBed.get(SWManager);
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(sWManagerService).toBeTruthy();
  });
});
