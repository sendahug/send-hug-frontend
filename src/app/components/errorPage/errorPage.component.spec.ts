/*
	Error Page
	Send a Hug Component Tests
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

import 'zone.js/dist/zone';
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import { TestBed, tick, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF, Location } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// App imports
import { AppComponent } from '../../app.component';
import { ErrorPage } from "./errorPage.component";
import { NotificationsTab } from '../notifications/notifications.component';

class MockLocation {
  back() {
    return 'went back!';
  }
};

describe('ErrorPage', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js', { enabled: false }),
        FontAwesomeModule
      ],
      declarations: [
        AppComponent,
        ErrorPage,
        NotificationsTab
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Location, useClass: MockLocation }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(ErrorPage);
    const errorPage = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(errorPage).toBeTruthy();
  });

  // Check that the error page has the right error message
  it('should have an error message', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(ErrorPage);
    const errorPage = fixture.componentInstance;
    const errorPageDOM = fixture.nativeElement;
    const error = {
      title: 'Sorry!',
      message: `The page you were looking for doesn\'t exist.`,
      code: 404
    };

    fixture.detectChanges();
    tick();

    expect(errorPage.error).toEqual(error);
    expect(errorPageDOM.querySelectorAll('h3')[0].textContent).toBe(error.title);
    expect(errorPageDOM.querySelector('#errorCode').textContent).toContain(error.code);
  }));

  // Check that the 'back' method is called when clicking the back button
  it('should call back method when clicking the back button', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(ErrorPage);
    const errorPage = fixture.componentInstance;
    const errorPageDOM = fixture.nativeElement;
    const backSpy = spyOn(errorPage, 'goBack').and.callThrough();
    const mockLocationSpy = spyOn(errorPage['location'], 'back').and.callThrough();

    fixture.detectChanges();
    tick();

    // click the back button
    errorPageDOM.querySelector('#backBtn').click();
    fixture.detectChanges();
    tick();

    expect(backSpy).toHaveBeenCalled();
    expect(mockLocationSpy).toHaveBeenCalled();
  }));
});
