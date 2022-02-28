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

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
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
import { Component } from "@angular/core";
import { Routes } from "@angular/router";

import { AppComponent } from "../../app.component";
import { SiteMap } from "./siteMap.component";
import { NotificationsTab } from '../notifications/notifications.component';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

// Mock Component for testing the sitemap
// ==================================================
@Component({
  selector: 'app-mock',
  template: `
  <!-- If the user is logged in, displays a user page. -->
  <div id="profileContainer">
  		hi
  </div>
  `
})
class MockComp {
  waitFor = "user";
  userId: number | undefined;

  constructor(
  ) {
    this.userId = 4;
  }
}

// Routes
export const routes: Routes = [
  { path: '', component: MockComp, data: { name: 'Home Page' } },
  { path: 'user',
      children: [
        { path: '', pathMatch: 'prefix', component: MockComp, data: { name: 'Your Page' } },
        { path: ':id', pathMatch: 'prefix', component: MockComp, data: { name: 'Other User\'s Page' } }
      ], data: { name: 'User Page' }},
  { path: 'settings', component: MockComp, data: { name: 'Settings Page' } },
  { path: 'sitemap', component: SiteMap, data: { name: 'Site Map' } },
  { path: '**', component: MockComp, data: { name: 'Error Page' } },
  { path: 'admin',
      children: [
        { path: '', pathMatch: 'prefix', component: MockComp, data: { name: 'Main Page' } },
        { path: 'reports', pathMatch: 'prefix', component: MockComp, data: { name: 'Reports Page' } },
        { path: 'blocks', pathMatch: 'prefix', component: MockComp, data: { name: 'Blocks Page' } },
        { path: 'filters', pathMatch: 'prefix', component: MockComp, data: { name: 'Filters Page' } }
      ], data: { name: 'Admin Dashboard' }},
  { path: 'messages',
      children: [
        { path: '', pathMatch: 'prefix', redirectTo: 'inbox', data: { name: 'Inbox' } },
        { path: 'inbox', pathMatch: 'prefix', component: MockComp, data: { name: 'Inbox' } },
        { path: 'outbox', pathMatch: 'prefix', component: MockComp, data: { name: 'Outbox' } },
        { path: 'threads', pathMatch: 'prefix', component: MockComp, data: { name: 'Threads' } },
        { path: 'thread/:id', pathMatch: 'prefix', component: MockComp, data: { name: 'Thread' } }
      ], data: { name: 'Mailbox' }}
];

describe('SiteMap', () => {
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
        MockComp,
        NotificationsTab,
        SiteMap
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: MockAuthService }
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

    // check each navigation item to ensure it contains a link
    let navLinks = routeList!.querySelectorAll('.routerLink');
    for(var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i]).toBeDefined();
      expect(navLinks[i]!.getAttribute('href')).toBeDefined();
      expect(navLinks[i]!.getAttribute('href')).not.toBe('');
    }
  });

  // Check that the admin board links are shown if the user has permission
  it('should show admin board links if the user has permission', () => {
    const authSpy = spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector('#routeList');
    let navLinks = routeList!.querySelectorAll('.routerLink');
    let adminPath = { path: 'admin',
        children: [
          { path: '', pathMatch: 'prefix', component: MockComp, data: { name: 'Main Page' } },
          { path: 'reports', pathMatch: 'prefix', component: MockComp, data: { name: 'Reports Page' } },
          { path: 'blocks', pathMatch: 'prefix', component: MockComp, data: { name: 'Blocks Page' } },
          { path: 'filters', pathMatch: 'prefix', component: MockComp, data: { name: 'Filters Page' } }
        ], data: { name: 'Admin Dashboard' }};

    // check the admin pages' linkes appear
    expect(authSpy).toHaveBeenCalled();
    expect(siteMap.routes).toContain(adminPath);
    expect(navLinks[4].textContent).toBe('Main Page');
    expect(navLinks[4].parentElement.parentElement.children.length).toBe(4);
    expect(navLinks[4].parentElement.parentElement.parentElement.firstElementChild.textContent).toBe('Admin Dashboard');
  });

  // Check that the admin board links aren't shown if the user doesn't have permission
  it('should hide admin board links if the user doesn\'t have permission', () => {
    const authSpy = spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(false);
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector('#routeList');
    let navLinks = routeList!.querySelectorAll('.routerLink');
    let adminPath = { path: 'admin',
        children: [
          { path: '', pathMatch: 'prefix', component: MockComp, data: { name: 'Main Page' } },
          { path: 'reports', pathMatch: 'prefix', component: MockComp, data: { name: 'Reports Page' } },
          { path: 'blocks', pathMatch: 'prefix', component: MockComp, data: { name: 'Blocks Page' } },
          { path: 'filters', pathMatch: 'prefix', component: MockComp, data: { name: 'Filters Page' } }
        ], data: { name: 'Admin Dashboard' }};

    // check the admin pages' links don't appear
    expect(authSpy).toHaveBeenCalled();
    expect(siteMap.routes).not.toContain(adminPath);
    expect(navLinks[4].parentElement.parentElement.parentElement.firstElementChild.textContent).not.toBe('Admin Dashboard');
    for(var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe('Main Page');
      expect(navLinks[i].textContent).not.toBe('Reports Page');
      expect(navLinks[i].textContent).not.toBe('Blocks Page');
      expect(navLinks[i].textContent).not.toBe('Filters Page');
    }
  });

  // Check that the first and last messages routes are removed
  it('should remove the first and last children of the messages route', () => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(false);
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector('#routeList');
    let navLinks = routeList!.querySelectorAll('.routerLink');
    // the path as it should appear
    let messagesPath = { path: 'messages',
        children: [
          { path: 'inbox', pathMatch: 'prefix', component: MockComp, data: { name: 'Inbox' } },
          { path: 'outbox', pathMatch: 'prefix', component: MockComp, data: { name: 'Outbox' } },
          { path: 'threads', pathMatch: 'prefix', component: MockComp, data: { name: 'Threads' } }
        ], data: { name: 'Mailbox' }};
    // the full path
    let messagesFullPath = { path: 'messages',
        children: [
          { path: '', pathMatch: 'prefix', redirectTo: 'inbox', data: { name: 'Inbox' } },
          { path: 'inbox', pathMatch: 'prefix', component: MockComp, data: { name: 'Inbox' } },
          { path: 'outbox', pathMatch: 'prefix', component: MockComp, data: { name: 'Outbox' } },
          { path: 'threads', pathMatch: 'prefix', component: MockComp, data: { name: 'Threads' } },
          { path: 'thread/:id', pathMatch: 'prefix', component: MockComp, data: { name: 'Thread' } }
        ], data: { name: 'Mailbox' }};

    // check the first and last children were removed
    expect(siteMap.routes).not.toContain(messagesFullPath);
    expect(siteMap.routes).toContain(messagesPath);
    expect(navLinks[4].parentElement.parentElement.children.length).toBe(3);
    // check inbox doesn't appear twice
    expect(navLinks[3].textContent).not.toBe('Inbox');
    expect(navLinks[5].textContent).not.toBe('Inbox');
    // check thread doesn't appear at all
    for(var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe('Thread');
    }
  });

  // Check that the last route is removed from user routes
  it('should remove the last child of the user route', () => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(false);
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector('#routeList');
    let navLinks = routeList!.querySelectorAll('.routerLink');
    // the path as it should appear
    let userPath = { path: 'user',
        children: [
          { path: '', pathMatch: 'prefix', component: MockComp, data: { name: 'Your Page' } }
        ], data: { name: 'User Page' }};
    // the full path
    let userFullPath = { path: 'user',
        children: [
          { path: '', pathMatch: 'prefix', component: MockComp, data: { name: 'Your Page' } },
          { path: ':id', pathMatch: 'prefix', component: MockComp, data: { name: 'Other User\'s Page' } }
        ], data: { name: 'User Page' }};

    // check the final child was removed
    expect(siteMap.routes).not.toContain(userFullPath);
    expect(siteMap.routes).toContain(userPath);
    for(var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe('Other User\'s Page');
    }
  });
});
