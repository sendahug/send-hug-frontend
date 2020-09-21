/*
  Site Map
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

import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from "../../app.component";
import { SiteMap } from "./siteMap.component";
import { routes } from '../../app-routing.module';
import { NotificationsTab } from '../notifications/notifications.component';

describe('AboutApp', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        ServiceWorkerModule.register('sw.js', { enabled: false }),
        FontAwesomeModule
      ],
      declarations: [
        AppComponent,
        SiteMap,
        NotificationsTab
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();
  });

  // Check the page is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(siteMap).toBeTruthy();
  });

  // Check that there are valid navigation links
  it('should contain valid navigation links', () => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector('#routeList');
    expect(routeList).toBeTruthy();
    expect(routeList!.children.length).not.toBe(0);
    expect(siteMap.routes).toBeDefined();

    // check each navingation item to ensure it contains a link
    let navLinks = routeList!.querySelectorAll('.routerLink');
    for(var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i]).toBeDefined();
      expect(navLinks[i]!.getAttribute('href')).toBeDefined();
      expect(navLinks[i]!.getAttribute('href')).not.toBe('');
    }
  });
});
