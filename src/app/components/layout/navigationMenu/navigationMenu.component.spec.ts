/*
  Navigation Menu
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
import {
  provideRouter,
  RouterLink,
  RouterOutlet,
  withComponentInputBinding,
} from "@angular/router";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BehaviorSubject, of } from "rxjs";
import { provideZoneChangeDetection, signal } from "@angular/core";
import { MockComponent, MockProvider } from "ng-mocks";
import { setViewport } from "@web/test-runner-commands";

import { AppNavMenu } from "./navigationMenu.component";
import { NotificationsTab } from "@app/components/layout/notifications/notifications.component";
import { AuthService } from "@app/services/auth.service";
import { SWManager } from "@app/services/sWManager.service";
import { mockAuthedUser } from "@tests/mockData";
import { ItemsService } from "@app/services/items.service";
import { NotificationService } from "@app/services/notifications.service";
import { SearchForm } from "@app/components/layout/searchForm/searchForm.component";

describe("AppNavMenu", () => {
  beforeEach(() => {
    const MockNotificationsTab = MockComponent(NotificationsTab);
    const MockSearchForm = MockComponent(SearchForm);
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
      isUserDataResolved: new BehaviorSubject(false),
      checkForLoggedInUser: () => of(),
      canUser: (_permission) => true,
    });
    const MockItemsService = MockProvider(ItemsService, {
      sendSearch: (_search) => undefined,
    });
    const MockNotificationsService = MockProvider(NotificationService, {
      checkInitialPermissionState: (_enabled) => new Promise(() => true),
      getCachedSubscription: () => undefined,
      startAutoRefresh: (_rate) => undefined,
      newNotifications: signal(0),
    });
    const MockSWManager = MockProvider(SWManager, {
      registerSW: () => undefined,
      updateSW: () => undefined,
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        FontAwesomeModule,
        MockNotificationsTab,
        AppNavMenu,
        MockSearchForm,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([], withComponentInputBinding()),
        MockAuthService,
        MockItemsService,
        MockSWManager,
        MockNotificationsService,
      ],
    }).compileComponents();
  });

  // Check that the app is created
  it("should create the menu", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    expect(navMenu).toBeTruthy();
  });

  // Check that there are valid navigation links
  it("should contain valid navigation links", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenuHtml = fixture.debugElement.nativeElement;

    let navMenu = navMenuHtml.querySelector("#navLinks");
    expect(navMenu).toBeDefined();
    expect(navMenu!.children.length).not.toBe(0);

    // check each navingation item to ensure it contains a link
    let navMenuItems = navMenu!.children;
    for (var i = 0; i < navMenuItems.length; i++) {
      expect(navMenuItems.item(i)).toBeDefined();
      expect(navMenuItems!.item(i)!.children.item(0)!.getAttribute("href")).toBeDefined();
      expect(navMenuItems!.item(i)!.children.item(0)!.getAttribute("href")).not.toBe("");
    }
  });

  // Check that the notifications tab is hidden
  it("has hidden notifications tab", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(navMenu.showNotifications()).toBe(false);
    expect(navMenuHtml.querySelector("app-notifications")).toBeNull();
  });

  // Check that the notifications tab appears when the button is clicked
  it("has a notifications tab that appears when its icon is clicked", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    fixture.detectChanges();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;

    // Check the tab is initially hidden
    expect(navMenu.showNotifications()).toBe(false);
    expect(navMenuHtml.querySelector("app-notifications")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#notificationsBtn").click();
    fixture.detectChanges();

    // Check the tab is now visible
    expect(navMenu.showNotifications()).toBe(true);
    expect(navMenuHtml.querySelector("app-notifications")).toBeDefined();
  });

  // Check that the search panel is hidden
  it("has hidden search", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;

    expect(navMenu.showSearch()).toBe(false);
    expect(navMenuHtml.querySelector("#siteHeader").children.length).toEqual(2);
  });

  // Check that the search panel appears when the button is clicked
  it("has a search which appears when the icon is clicked", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    fixture.detectChanges();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const siteHeader = navMenuHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(navMenu.showSearch()).toBe(false);
    expect(siteHeader.querySelector("app-search-form")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#searchBtn").click();
    fixture.detectChanges();

    // Check the panel is now visible
    expect(navMenu.showSearch()).toBe(true);
    expect(siteHeader.querySelector("app-search-form")).toBeDefined();
  });

  // Check that the font size panel is hidden
  it("should have a hidden font size panel", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;

    expect(navMenu.showTextPanel()).toBe(false);
    expect(navMenuHtml.querySelector("#siteHeader").children.length).toEqual(2);
  });

  // Check that the font size panel appears when the button is clicked
  it("has a font size which appears when the icon is clicked", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    fixture.detectChanges();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const siteHeader = navMenuHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(navMenu.showTextPanel()).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#textSize").click();
    fixture.detectChanges();

    // Check the panel is now visible
    expect(navMenu.showTextPanel()).toBe(true);
    expect(siteHeader.querySelector("#textPanel")).toBeDefined();
  });

  // Check that the font size panel is hidden when the button is clicked again
  it("has a font size which is hidden when the icon is clicked again", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    fixture.detectChanges();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const siteHeader = navMenuHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(navMenu.showTextPanel()).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#textSize").click();

    // Check the panel is now visible
    expect(navMenu.showTextPanel()).toBe(true);
    expect(siteHeader.querySelector("#textPanel")).toBeDefined();

    // Simulate another click on the button
    navMenuHtml.querySelector("#textSize").click();

    // check the panel is hidden again
    expect(navMenu.showTextPanel()).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();
  });

  // Check that the font size panel changes the site's font size
  it("has a font size that changes according to user choice", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppNavMenu);
    fixture.detectChanges();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const fontButton = navMenuHtml.querySelector("#textSize");
    const menuSpy = spyOn(navMenu, "checkMenuSize");

    // open the text panel
    fontButton.click();
    fixture.detectChanges();

    const fontPanelButtons = navMenuHtml.querySelector("#textPanel").querySelectorAll(".appButton");

    // wrap tests in a promise to make sure they run fully and by the order
    // step 1: regular size
    new Promise((resolve) => {
      // change the font size to the smallest
      fontPanelButtons[0]!.click();
      fixture.detectChanges();

      // check the font size was changed
      expect(document.querySelector("html")!.style.fontSize).toBe("75%");
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(1);
      resolve(undefined);
      // step 3: smaller size
    })
      .then(() => {
        // change the font size to the smaller
        fontPanelButtons[1]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("87.5%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(2);
        // step 4: regular size
      })
      .then(() => {
        // change the font size to the normal
        fontPanelButtons[2]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("100%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(3);
        // step 5: larger size
      })
      .then(() => {
        // change the font size to the larger
        fontPanelButtons[3]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("150%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(4);
        // step 6: largest size
      })
      .then(() => {
        // change the font size to the largest
        fontPanelButtons[4]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("200%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(5);
        done();
      });
  });

  // check the menu is shown if the screen is wide enough
  it("should show the menu if the screen is wide enough", async () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    await setViewport({ width: 700, height: 640 });
    fixture.detectChanges();

    expect(navMenu.showMenu()).toBeTrue();
    expect(navMenuHtml.querySelector("#navLinks")!.classList).not.toContain("hidden");
    expect(navMenuHtml.querySelector("#menuBtn")!.classList).toContain("hidden");
  });

  // TODO: Figure out why this isn't working in CI.
  // check the menu is hidden if the screen isn't wide enough
  // it("should hide the menu if the screen isn't wide enough", async () => {
  //   const fixture = TestBed.createComponent(AppNavMenu);
  //   const navMenu = fixture.componentInstance;
  //   const navMenuHtml = fixture.nativeElement;
  //   await setViewport({ width: 600, height: 640 });
  //   fixture.detectChanges();

  //   expect(navMenu.showMenu()).toBeFalse();
  //   expect(navMenuHtml.querySelector("#navLinks")!.classList).toContain("hidden");
  // });

  // check the menu is hidden when clicked again
  // it("should show/hide the menu when the menu button is clicked", async () => {
  //   const fixture = TestBed.createComponent(AppNavMenu);
  //   const navMenu = fixture.componentInstance;
  //   const navMenuHtml = fixture.nativeElement;
  //   await setViewport({ width: 600, height: 640 });
  //   fixture.detectChanges();

  //   // pre-click check
  //   expect(navMenu.showMenu()).toBeFalse();
  //   expect(navMenuHtml.querySelector("#navLinks")!.classList).toContain("hidden");
  //   expect(navMenuHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

  //   // trigger click
  //   navMenuHtml.querySelector("#menuBtn").click();
  //   fixture.detectChanges();

  //   // post-click check
  //   expect(navMenu.showMenu()).toBeTrue();
  //   expect(navMenuHtml.querySelector("#navLinks")!.classList).not.toContain("hidden");
  //   expect(navMenuHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

  //   // trigger another click
  //   navMenuHtml.querySelector("#menuBtn").click();
  //   fixture.detectChanges();

  //   // post-click check
  //   expect(navMenu.showMenu()).toBeFalse();
  //   expect(navMenuHtml.querySelector("#navLinks")!.classList).toContain("hidden");
  //   expect(navMenuHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");
  // });

  // should hide the nav menu if it gets too long
  it("changeTextSize - should hide nav menu if it gets too long", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const checkSpy = spyOn(navMenu, "checkMenuSize").and.callThrough();
    fixture.detectChanges();

    const navMenuDiv = navMenuHtml.querySelector("#navMenu");
    const navLinks = navMenuHtml.querySelector("#navLinks");
    navLinks.style.width = "600px";
    navMenuDiv.style.maxWidth = "600px";
    navMenuDiv.style.display = "flex";
    navMenu.changeTextSize("largest");
    fixture.detectChanges();

    expect(checkSpy).toHaveBeenCalled();
    expect(navLinks.classList).toContain("hidden");
    expect(navMenuHtml.querySelector("#menuBtn").classList).not.toContain("hidden");
  });

  // should hide the menu if it gets too long and show it again if it's not too long
  it("should show the menu again if it's not too long again", () => {
    const fixture = TestBed.createComponent(AppNavMenu);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const checkSpy = spyOn(navMenu, "checkMenuSize").and.callThrough();
    fixture.detectChanges();

    const navMenuDiv = navMenuHtml.querySelector("#navMenu");
    const navLinks = navMenuHtml.querySelector("#navLinks");
    navLinks.style.width = "1000px";
    navMenuDiv.style.maxWidth = "1000px";
    navMenuDiv.style.display = "flex";
    navMenu.changeTextSize("largest");
    fixture.detectChanges();

    // Validate it's hidden before un-hiding it
    expect(navMenuHtml.querySelector("#menuBtn").classList).not.toContain("hidden");

    navLinks.style.width = "500px";
    navMenu.changeTextSize("smaller");
    fixture.detectChanges();

    expect(checkSpy).toHaveBeenCalled();
    expect(navLinks.classList).not.toContain("hidden");
    expect(navMenu.showMenu()).toBeTrue();
  });

  it("should send an email verification request", () => {
    const MockAuthService = TestBed.inject(AuthService);
    MockAuthService.userData.set({ ...mockAuthedUser, emailVerified: false });
    const verifySpy = spyOn(MockAuthService, "sendVerificationEmail");

    const fixture = TestBed.createComponent(AppNavMenu);
    const componentHtml = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(componentHtml.querySelector("#notVerified")).toBeDefined();

    componentHtml.querySelector("#notVerified").querySelector(".link").click();
    fixture.detectChanges();

    expect(verifySpy).toHaveBeenCalled();
  });
});
