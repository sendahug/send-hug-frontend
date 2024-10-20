/*
  Site Map
  Send a Hug Component Tests
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { Component, signal } from "@angular/core";
import { provideRouter, Route, Router, RouterLink, Routes } from "@angular/router";
import { provideZoneChangeDetection } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

import { SiteMap } from "./siteMap.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";

// Mock Component for testing the sitemap
// ==================================================
@Component({
  selector: "app-mock",
  template: `
    <!-- If the user is logged in, displays a user page. -->
    <div id="profileContainer">hi</div>
  `,
  standalone: true,
})
class MockComp {
  waitFor = "user";
  userId: number | undefined;

  constructor() {
    this.userId = 4;
  }
}

describe("SiteMap", () => {
  let routes: Routes = [];

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
      isUserDataResolved: new BehaviorSubject(true),
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    // Routes
    routes = [
      { path: "", component: MockComp, data: { name: "Home Page" } },
      {
        path: "user",
        children: [
          { path: "", pathMatch: "prefix", component: MockComp, data: { name: "Your Page" } },
          {
            path: ":id",
            pathMatch: "prefix",
            component: MockComp,
            data: { name: "Other User's Page" },
          },
        ],
        data: { name: "User Page", mapRoutes: [{ path: "", name: "Your Page" }] },
      },
      { path: "settings", component: MockComp, data: { name: "Settings Page" } },
      { path: "sitemap", component: SiteMap, data: { name: "Site Map" } },
      { path: "**", component: MockComp, data: { name: "Error Page" } },
      {
        path: "admin",
        children: [
          { path: "", pathMatch: "prefix", component: MockComp, data: { name: "Main Page" } },
          {
            path: "reports",
            pathMatch: "prefix",
            component: MockComp,
            data: { name: "Reports Page" },
          },
          {
            path: "blocks",
            pathMatch: "prefix",
            component: MockComp,
            data: { name: "Blocks Page" },
          },
          {
            path: "filters",
            pathMatch: "prefix",
            component: MockComp,
            data: { name: "Filters Page" },
          },
        ],
        data: {
          name: "Admin Dashboard",
          mapRoutes: [
            { path: "", name: "Main Page" },
            { path: "reports", name: "Reports Page" },
            { path: "blocks", name: "Blocks Page" },
            { path: "filters", name: "Filters Page" },
          ],
        },
      },
      {
        path: "messages",
        children: [
          { path: "", pathMatch: "prefix", redirectTo: "inbox", data: { name: "Inbox" } },
          { path: "inbox", pathMatch: "prefix", component: MockComp, data: { name: "Inbox" } },
          { path: "outbox", pathMatch: "prefix", component: MockComp, data: { name: "Outbox" } },
          { path: "threads", pathMatch: "prefix", component: MockComp, data: { name: "Threads" } },
          {
            path: "thread/:id",
            pathMatch: "prefix",
            component: MockComp,
            data: { name: "Thread" },
          },
        ],
        data: {
          name: "Mailbox",
          mapRoutes: [
            { path: "inbox", name: "Inbox" },
            { path: "outbox", name: "Outbox" },
            { path: "threads", name: "Threads" },
          ],
        },
      },
      { path: "login", component: MockComp, data: { name: "Login Page" } },
    ];

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterLink, MockComp, SiteMap],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        MockAuthService,
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    router.config = [...routes];
  });

  // Check the page is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    expect(siteMap).toBeTruthy();
  });

  // Check that there are valid navigation links
  it("should contain valid navigation links", () => {
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector("#routeList");
    expect(routeList).toBeTruthy();
    expect(routeList!.children.length).not.toBe(0);
    expect(siteMap.routes).toBeDefined();

    // check each navigation item to ensure it contains a link
    let navLinks = routeList!.querySelectorAll(".routerLink");
    for (var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i]).toBeDefined();
      expect(navLinks[i]!.getAttribute("href")).toBeDefined();
      expect(navLinks[i]!.getAttribute("href")).not.toBe("");
    }
  });

  // Check that the admin board links are shown if the user has permission
  it("should show admin board links if the user has permission", () => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    authService.authenticated.set(true);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector("#routeList");
    let navLinks = routeList!.querySelectorAll(".routerLink");
    let adminPath: Route = {
      path: "admin",
      children: [
        { path: "", pathMatch: "prefix", component: MockComp, data: { name: "Main Page" } },
        {
          path: "reports",
          pathMatch: "prefix",
          component: MockComp,
          data: { name: "Reports Page" },
        },
        { path: "blocks", pathMatch: "prefix", component: MockComp, data: { name: "Blocks Page" } },
        {
          path: "filters",
          pathMatch: "prefix",
          component: MockComp,
          data: { name: "Filters Page" },
        },
      ],
      data: {
        name: "Admin Dashboard",
        mapRoutes: [
          { path: "", name: "Main Page" },
          { path: "reports", name: "Reports Page" },
          { path: "blocks", name: "Blocks Page" },
          { path: "filters", name: "Filters Page" },
        ],
      },
    };

    // check the admin pages' linkes appear
    expect(authSpy).toHaveBeenCalled();
    expect(siteMap.routes).toContain(adminPath);
    expect(navLinks[4].textContent).toBe("Main Page");
    expect(navLinks[4].parentElement.parentElement.children.length).toBe(4);
    expect(
      navLinks[4].parentElement.parentElement.parentElement.firstElementChild.textContent,
    ).toBe("Admin Dashboard");
  });

  // Check that the admin board links aren't shown if the user doesn't have permission
  it("should hide admin board links if the user doesn't have permission", () => {
    const authService = TestBed.inject(AuthService);
    const authSpy = spyOn(authService, "canUser").and.returnValue(false);
    authService.authenticated.set(true);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector("#routeList");
    let navLinks = routeList!.querySelectorAll(".routerLink");
    let adminPath: Route = {
      path: "admin",
      children: [
        { path: "", pathMatch: "prefix", component: MockComp, data: { name: "Main Page" } },
        {
          path: "reports",
          pathMatch: "prefix",
          component: MockComp,
          data: { name: "Reports Page" },
        },
        { path: "blocks", pathMatch: "prefix", component: MockComp, data: { name: "Blocks Page" } },
        {
          path: "filters",
          pathMatch: "prefix",
          component: MockComp,
          data: { name: "Filters Page" },
        },
      ],
      data: { name: "Admin Dashboard" },
    };

    // check the admin pages' links don't appear
    expect(authSpy).toHaveBeenCalled();
    expect(siteMap.routes).not.toContain(adminPath);
    expect(navLinks.length).toBeLessThan(routes.length);
    for (var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe("Main Page");
      expect(navLinks[i].textContent).not.toBe("Reports Page");
      expect(navLinks[i].textContent).not.toBe("Blocks Page");
      expect(navLinks[i].textContent).not.toBe("Filters Page");
    }
  });

  it("should remove the login route if the user is authenticated", () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "authenticated").and.returnValue(true);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector("#routeList");
    let navLinks = routeList!.querySelectorAll(".routerLink");
    let loginPath: Route = { path: "login", component: MockComp, data: { name: "Login Page" } };

    expect(siteMap.routes).not.toContain(loginPath);
    for (var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe("Login Page");
    }
  });

  it("should keep the login route if the user is not authenticated", () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, "authenticated").and.returnValue(false);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector("#routeList");
    let navLinks = routeList!.querySelectorAll(".routerLink");
    let loginPath: Route = { path: "login", component: MockComp, data: { name: "Login Page" } };

    expect(siteMap.routes).toContain(loginPath);
    expect(navLinks[navLinks.length - 1].textContent).toBe("Login Page");
  });

  it("should update the site map if the user authenticates after the component is created", () => {
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(false);
    const fixture = TestBed.createComponent(SiteMap);
    const siteMap = fixture.componentInstance;
    const siteMapDOM = fixture.nativeElement;
    fixture.detectChanges();

    let routeList = siteMapDOM.querySelector("#routeList");
    let navLinks = routeList!.querySelectorAll(".routerLink");
    let loginPath: Route = { path: "login", component: MockComp, data: { name: "Login Page" } };
    let userPath: Route = {
      path: "user",
      children: [
        { path: "", pathMatch: "prefix", component: MockComp, data: { name: "Your Page" } },
        {
          path: ":id",
          pathMatch: "prefix",
          component: MockComp,
          data: { name: "Other User's Page" },
        },
      ],
      data: { name: "User Page", mapRoutes: [{ path: "", name: "Your Page" }] },
    };

    expect(siteMap.routes).toContain(loginPath);
    expect(siteMap.routes).not.toContain(userPath);
    expect(navLinks[navLinks.length - 1].textContent).toBe("Login Page");
    for (var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe(userPath.children![0].data!["name"]);
    }

    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    authService.isUserDataResolved.next(true);
    fixture.detectChanges();

    navLinks = routeList!.querySelectorAll(".routerLink");
    expect(siteMap.routes).not.toContain(loginPath);
    expect(siteMap.routes).toContain(userPath);
    expect(navLinks[1].textContent).toBe(userPath.children![0].data!["name"]);
    for (var i = 0; i < navLinks.length; i++) {
      expect(navLinks[i].textContent).not.toBe(loginPath.data!["name"]);
    }
  });
});
