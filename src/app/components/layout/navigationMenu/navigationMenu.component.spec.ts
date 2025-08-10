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
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BehaviorSubject, of, Subscription } from "rxjs";
import { computed, provideZonelessChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { setViewport } from "@web/test-runner-commands";
import { By } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { NavigationMenuComponent } from "./navigationMenu.component";
import { NotificationsTabComponent } from "@app/components/layout/notifications/notifications.component";
import { AuthService, ToggleButtonOption } from "@app/services/auth.service";
import { SWManager } from "@app/services/sWManager.service";
import { mockAuthedUser, getMockFirebaseUser } from "@tests/mockData";
import { ItemsService } from "@app/services/items.service";
import { NotificationService } from "@app/services/notifications.service";
import { SearchFormComponent } from "@app/components/layout/searchForm/searchForm.component";
import { AlertsService } from "@app/services/alerts.service";

describe("NavigationMenuComponent", () => {
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
      isUserDataResolved: new BehaviorSubject(false),
      toggleBtn: computed(() => "Enable" as ToggleButtonOption),
      refreshBtn: computed(() => "Enable" as ToggleButtonOption),
      refreshRate: computed(() => 0),
      checkForLoggedInUser: () => of(),
      canUser: (_permission) => true,
    });
    const MockItemsService = MockProvider(ItemsService, {
      sendSearch: (_search) => new Subscription(),
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

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        FontAwesomeModule,
        NotificationsTabComponent,
        NavigationMenuComponent,
        SearchFormComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter([], withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockAuthService,
        MockItemsService,
        MockSWManager,
        MockNotificationsService,
      ],
    }).compileComponents();
  });

  afterEach(async () => {
    // Reset the viewport to full size after each test
    // This ensures the viewport is in the right size for the tests
    // that require the full navigation menu
    await setViewport({ width: 780, height: 640 });
  });

  // Check that the app is created
  it("should create the menu", () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;

    expect(navMenu).toBeTruthy();
  });

  // Check that there are valid navigation links
  it("should contain valid navigation links", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenuHtml = fixture.debugElement.nativeElement;
    await fixture.whenStable();

    const navMenu = navMenuHtml.querySelector("#navLinks");

    expect(navMenu).toBeDefined();
    expect(navMenu!.children.length).not.toBe(0);

    // check each navingation item to ensure it contains a link
    const navMenuItems = navMenu!.children;
    for (let i = 0; i < navMenuItems.length; i++) {
      expect(navMenuItems.item(i)).toBeDefined();
      expect(navMenuItems!.item(i)!.children.item(0)!.getAttribute("href")).toBeDefined();
      expect(navMenuItems!.item(i)!.children.item(0)!.getAttribute("href")).not.toBe("");
    }
  });

  // Check that the notifications tab is hidden
  it("has hidden notifications tab", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;
    await fixture.whenStable();

    expect(navMenu.showNotifications()).toBe(false);
    expect(navMenuHtml.querySelector("app-notifications")).toBeNull();
  });

  // Check that the notifications tab appears when the button is clicked
  it("has a notifications tab that appears when its icon is clicked", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    await fixture.whenStable();

    // Check the tab is initially hidden
    expect(navMenu.showNotifications()).toBe(false);
    expect(navMenuHtml.querySelector("app-notifications")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#notificationsBtn").click();
    await fixture.whenStable();

    // Check the tab is now visible
    expect(navMenu.showNotifications()).toBe(true);
    expect(navMenuHtml.querySelector("app-notifications")).toBeDefined();
  });

  // Check that the search panel is hidden
  it("has hidden search", () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;

    expect(navMenu.showSearch()).toBe(false);
    expect(navMenuHtml.querySelector("#siteHeader").children.length).toEqual(3);
  });

  // Check that the search panel appears when the button is clicked
  it("has a search which appears when the icon is clicked", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    await fixture.whenStable();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const siteHeader = navMenuHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(navMenu.showSearch()).toBe(false);
    expect(siteHeader.querySelector("app-search-form")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#searchBtn").click();
    await fixture.whenStable();

    // Check the panel is now visible
    expect(navMenu.showSearch()).toBe(true);
    expect(siteHeader.querySelector("app-search-form")).toBeDefined();
  });

  // Check that the font size panel is hidden
  it("should have a hidden font size panel", () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;

    expect(navMenu.showTextPanel()).toBe(false);
    expect(navMenuHtml.querySelector("#siteHeader").children.length).toEqual(3);
  });

  // Check that the font size panel appears when the button is clicked
  it("has a font size which appears when the icon is clicked", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    await fixture.whenStable();
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const siteHeader = navMenuHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(navMenu.showTextPanel()).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();

    // Simulate a click on the button
    navMenuHtml.querySelector("#textSize").click();
    await fixture.whenStable();

    // Check the panel is now visible
    expect(navMenu.showTextPanel()).toBe(true);
    expect(siteHeader.querySelector("#textPanel")).toBeDefined();
  });

  // Check that the font size panel is hidden when the button is clicked again
  it("has a font size which is hidden when the icon is clicked again", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    await fixture.whenStable();
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
    const fixture = TestBed.createComponent(NavigationMenuComponent);
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
      expect(menuSpy).toHaveBeenCalledWith();
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
        expect(menuSpy).toHaveBeenCalledTimes(2);
        // step 4: regular size
      })
      .then(() => {
        // change the font size to the normal
        fontPanelButtons[2]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("100%");
        expect(menuSpy).toHaveBeenCalledTimes(3);
        // step 5: larger size
      })
      .then(() => {
        // change the font size to the larger
        fontPanelButtons[3]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("150%");
        expect(menuSpy).toHaveBeenCalledTimes(4);
        // step 6: largest size
      })
      .then(() => {
        // change the font size to the largest
        fontPanelButtons[4]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.querySelector("html")!.style.fontSize).toBe("200%");
        expect(menuSpy).toHaveBeenCalledTimes(5);
        done();
      })
      .catch(done.fail);
  });

  // check the menu is shown if the screen is wide enough
  it("should show the menu if the screen is wide enough", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    await setViewport({ width: 780, height: 640 });
    await fixture.whenStable();

    expect(navMenu.showMenu()).toBeTrue();
    expect(navMenuHtml.querySelector("#navLinks")!.classList).not.toBeNull();
    expect(navMenuHtml.querySelector("#menuBtn")!.classList).toContain("hidden");
  });

  // check the menu is hidden if the screen isn't wide enough
  it("should hide the menu if the screen isn't wide enough", async () => {
    await setViewport({ width: 400, height: 640 });

    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    await fixture.whenStable();

    expect(navMenu.showMenu()).toBeFalse();
    expect(navMenuHtml.querySelector("#navLinks")).toBeNull();
  });

  // check the menu is hidden when clicked again
  it("should show/hide the menu when the menu button is clicked", async () => {
    await setViewport({ width: 600, height: 640 });

    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    await fixture.whenStable();

    // pre-click check
    expect(navMenu.showMenu()).toBeFalse();
    expect(navMenuHtml.querySelector("#navLinks")).toBeNull();
    expect(navMenuHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

    // trigger click
    navMenuHtml.querySelector("#menuBtn").click();
    await fixture.whenStable();

    // post-click check
    expect(navMenu.showMenu()).toBeTrue();
    expect(navMenuHtml.querySelector("#navLinks")).not.toBeNull();
    expect(navMenuHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

    // trigger another click
    navMenuHtml.querySelector("#menuBtn").click();
    await fixture.whenStable();

    // post-click check
    expect(navMenu.showMenu()).toBeFalse();
    expect(navMenuHtml.querySelector("#navLinks")).toBeNull();
    expect(navMenuHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");
  });

  // should hide the nav menu if it gets too long
  it("changeTextSize - should hide nav menu if it gets too long", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const checkSpy = spyOn(navMenu, "checkMenuSize").and.callThrough();
    await fixture.whenStable();

    const navMenuDiv = navMenuHtml.querySelector("#navMenu");
    const navLinks = navMenuHtml.querySelector("#navLinks");
    navLinks.style.width = "600px";
    navMenuDiv.style.maxWidth = "600px";
    navMenuDiv.style.display = "flex";
    navMenu.changeTextSize("largest");
    await fixture.whenStable();

    expect(checkSpy).toHaveBeenCalledWith();
    expect(navMenuHtml.querySelector("#navLinks")).toBeNull();
    expect(navMenuHtml.querySelector("#menuBtn").classList).not.toContain("hidden");
  });

  // should hide the menu if it gets too long and show it again if it's not too long
  it("should show the menu again if it's not too long again", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.nativeElement;
    const checkSpy = spyOn(navMenu, "checkMenuSize").and.callThrough();
    await fixture.whenStable();

    const navMenuDiv = navMenuHtml.querySelector("#navMenu");
    const navLinks = navMenuHtml.querySelector("#navLinks");
    navLinks.style.width = "1000px";
    navMenuDiv.style.maxWidth = "1000px";
    navMenuDiv.style.display = "flex";
    navMenu.changeTextSize("largest");
    await fixture.whenStable();

    // Validate it's hidden before un-hiding it
    expect(navMenuHtml.querySelector("#menuBtn").classList).not.toContain("hidden");

    navLinks.style.width = "500px";
    navMenu.changeTextSize("smaller");
    await fixture.whenStable();

    expect(checkSpy).toHaveBeenCalledWith();
    expect(navLinks.classList).not.toContain("hidden");
    expect(navMenu.showMenu()).toBeTrue();
  });

  it("should send an email verification request", async () => {
    const MockAuthService = TestBed.inject(AuthService);
    MockAuthService.userData.set({ ...mockAuthedUser, emailVerified: false });
    const verifySpy = spyOn(MockAuthService, "sendVerificationEmail");

    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const componentHtml = fixture.debugElement.nativeElement;
    await fixture.whenStable();

    expect(componentHtml.querySelector("#notVerified")).toBeDefined();

    componentHtml.querySelector("#notVerified").querySelector(".link").click();

    expect(verifySpy).toHaveBeenCalledWith();
  });

  it("should sign out", async () => {
    const MockAuthService = TestBed.inject(AuthService);
    MockAuthService.authenticated.set(false);
    const firebaseUserSpy = spyOn(MockAuthService, "getCurrentFirebaseUser").and.returnValue(
      getMockFirebaseUser(),
    );

    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const component = fixture.componentInstance;
    const componentHtml = fixture.debugElement.nativeElement;
    const signOutRedirectSpy = spyOn(component, "signOutAndRedirect").and.callThrough();
    const signOutSpy = spyOn(MockAuthService, "logout");
    const routerSpy = spyOn(component["router"], "navigate");
    await fixture.whenStable();

    expect(componentHtml.querySelector("#signOutNavItem")).toBeDefined();
    expect(firebaseUserSpy).toHaveBeenCalledWith();

    componentHtml.querySelector("#signOutNavItem").click();
    await fixture.whenStable();

    expect(signOutRedirectSpy).toHaveBeenCalledWith();
    expect(signOutSpy).toHaveBeenCalledWith();
    expect(routerSpy).toHaveBeenCalledWith(["/"]);
  });

  it("shows the 'no internet' alert", async () => {
    const alertsService = TestBed.inject(AlertsService);
    alertsService.isOffline.next(true);

    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const componentHtml = fixture.debugElement.nativeElement;
    await fixture.whenStable();

    expect(componentHtml.querySelector("#noInternet")).toBeDefined();
    expect(componentHtml.querySelector("#headerBanner").children.length).toBe(1);
  });

  it("shows the 'email not verified' alert", async () => {
    const alertsService = TestBed.inject(AuthService);
    alertsService.userData.set({ ...mockAuthedUser, emailVerified: false });

    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const componentHtml = fixture.debugElement.nativeElement;
    await fixture.whenStable();

    expect(componentHtml.querySelector("#notVerified")).toBeDefined();
    expect(componentHtml.querySelector("#headerBanner").children.length).toBe(1);
  });

  it("closes the notifications tab", async () => {
    const fixture = TestBed.createComponent(NavigationMenuComponent);
    const navMenu = fixture.componentInstance;
    const navMenuHtml = fixture.debugElement.nativeElement;
    await fixture.whenStable();

    navMenu.showNotifications.set(true);
    const changeSpy = spyOn(navMenu, "changeMode").and.callThrough();
    await fixture.whenStable();

    // check the menu shows
    expect(navMenuHtml.querySelector("app-notifications")).toBeDefined();

    // emit the close event
    const popup = fixture.debugElement.query(By.css("app-notifications"))
      .componentInstance as NotificationsTabComponent;
    popup.NotificationsMode.emit(false);
    await fixture.whenStable();

    // check it was closed
    expect(changeSpy).toHaveBeenCalledWith(false);
    expect(navMenu.showNotifications()).toBeFalse();
    expect(navMenuHtml.querySelector("app-notifications")).toBeNull();
  });
});
