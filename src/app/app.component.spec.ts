/*
  App Component
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
import { RouterModule } from "@angular/router";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "./app.component";
import { NotificationsTab } from "./components/notifications/notifications.component";
import { AuthService } from "./common/services/auth.service";
import { SWManager } from "./common/services/sWManager.service";
import { NotificationService } from "./services/notifications.service";
import { mockAuthedUser } from "@tests/mockData";
import { AppAlert } from "./components/appAlert/appAlert.component";
import { AppCommonModule } from "./common/common.module";

declare const viewport: any;

describe("AppComponent", () => {
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
        AppCommonModule,
      ],
      declarations: [AppComponent, NotificationsTab, AppAlert],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    spyOn(authService, "checkHash");
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });

    const swManager = TestBed.inject(SWManager);
    spyOn(swManager, "registerSW");
    spyOn(swManager, "updateSW");

    const notificationService = TestBed.inject(NotificationService);
    spyOn(notificationService, "getNotifications");
    spyOn(notificationService, "startAutoRefresh");
  });

  // Check that the app is created
  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Check that there are valid navigation links
  it("should contain valid navigation links", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const componentHtml = fixture.debugElement.nativeElement;

    let navMenu = componentHtml.querySelector("#navLinks");
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
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const componentHtml = fixture.debugElement.nativeElement;

    expect(component.showNotifications).toBe(false);
    expect(componentHtml.querySelector("#mainContent").children.length).toEqual(2);
  });

  // Check that the notifications tab appears when the button is clicked
  it("has a notifications tab that appears when its icon is clicked", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const mainContent = componentHtml.querySelector("#mainContent");

    // Check the tab is initially hidden
    expect(component.showNotifications).toBe(false);
    expect(mainContent.querySelector("app-notifications")).toBeNull();

    // Simulate a click on the button
    componentHtml.querySelector("#notificationsBtn").click();

    // Check the tab is now visible
    expect(component.showNotifications).toBe(true);
    expect(mainContent.querySelector("app-notifications")).toBeDefined();
  });

  // Check that the search panel is hidden
  it("has hidden search", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const componentHtml = fixture.debugElement.nativeElement;

    expect(component.showSearch).toBe(false);
    expect(componentHtml.querySelector("#siteHeader").children.length).toEqual(2);
  });

  // Check that the search panel appears when the button is clicked
  it("has a search which appears when the icon is clicked", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const siteHeader = componentHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(component.showSearch).toBe(false);
    expect(siteHeader.querySelector("#search")).toBeNull();

    // Simulate a click on the button
    componentHtml.querySelector("#searchBtn").click();

    // Check the panel is now visible
    expect(component.showSearch).toBe(true);
    expect(siteHeader.querySelector("#search")).toBeDefined();
  });

  // Check that clicking 'search' triggers the ItemsService
  it("should pass search query to the ItemsService when clicking search", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const searchSpy = spyOn(component, "searchApp").and.callThrough();
    const searchServiceSpy = spyOn(component["itemsService"], "sendSearch");
    spyOn(component["router"], "navigate");

    // open search panel and run search
    componentHtml.querySelector("#searchBtn").click();
    fixture.detectChanges();
    // tick();
    componentHtml.querySelector("#searchQuery").value = "search";
    componentHtml.querySelector("#searchQuery").dispatchEvent(new Event("input"));
    componentHtml.querySelectorAll(".sendData")[0].click();

    // check the spies were triggered
    expect(searchSpy).toHaveBeenCalled();
    expect(searchServiceSpy).toHaveBeenCalled();
    expect(searchServiceSpy).toHaveBeenCalledWith("search");
    done();
  });

  // Check that an empty search query isn't allowed
  it("should prevent empty searches", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const searchSpy = spyOn(component, "searchApp").and.callThrough();
    const searchServiceSpy = spyOn(component["itemsService"], "sendSearch");
    const alertsSpy = spyOn(component["alertsService"], "createAlert");

    // open search panel and run search
    componentHtml.querySelector("#searchBtn").click();
    fixture.detectChanges();

    componentHtml.querySelector("#searchQuery").value = "";
    componentHtml.querySelectorAll(".sendData")[0].click();

    // check one spy was triggered and one wasn't
    expect(searchSpy).toHaveBeenCalled();
    expect(searchServiceSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      message: "Search query is empty! Please write a term to search for.",
      type: "Error",
    });
    done();
  });

  // Check that the font size panel is hidden
  it("should have a hidden font size panel", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const componentHtml = fixture.debugElement.nativeElement;

    expect(component.showTextPanel).toBe(false);
    expect(componentHtml.querySelector("#siteHeader").children.length).toEqual(2);
  });

  // Check that the font size panel appears when the button is clicked
  it("has a font size which appears when the icon is clicked", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const siteHeader = componentHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(component.showTextPanel).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();

    // Simulate a click on the button
    componentHtml.querySelector("#textSize").click();

    // Check the panel is now visible
    expect(component.showTextPanel).toBe(true);
    expect(siteHeader.querySelector("#textPanel")).toBeDefined();
  });

  // Check that the font size panel is hidden when the button is clicked again
  it("has a font size which is hidden when the icon is clicked again", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const siteHeader = componentHtml.querySelector("#siteHeader");

    // Check the panel is initially hidden
    expect(component.showTextPanel).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();

    // Simulate a click on the button
    componentHtml.querySelector("#textSize").click();

    // Check the panel is now visible
    expect(component.showTextPanel).toBe(true);
    expect(siteHeader.querySelector("#textPanel")).toBeDefined();

    // Simulate another click on the button
    componentHtml.querySelector("#textSize").click();

    // check the panel is hidden again
    expect(component.showTextPanel).toBe(false);
    expect(siteHeader.querySelector("#textPanel")).toBeNull();
  });

  // Check that the font size panel changes the site's font size
  it("has a font size that changes according to user choice", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const fontButton = componentHtml.querySelector("#textSize");
    const menuSpy = spyOn(component, "checkMenuSize");

    // open the text panel
    fontButton.click();
    fixture.detectChanges();

    const fontPanelButtons = componentHtml
      .querySelector("#textPanel")
      .querySelectorAll(".appButton");

    // wrap tests in a promise to make sure they run fully and by the order
    // step 1: regular size
    new Promise(() => {
      // change the font size to the smallest
      fontPanelButtons[0]!.click();
      fixture.detectChanges();

      // check the font size was changed
      expect(document.getElementsByTagName("html")[0]!.style.fontSize).toBe("75%");
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(1);
      // step 3: smaller size
    })
      .then(() => {
        // change the font size to the smaller
        fontPanelButtons[1]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.getElementsByTagName("html")[0]!.style.fontSize).toBe("87.5%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(2);
        // step 4: regular size
      })
      .then(() => {
        // change the font size to the normal
        fontPanelButtons[2]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.getElementsByTagName("html")[0]!.style.fontSize).toBe("100%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(3);
        // step 5: larger size
      })
      .then(() => {
        // change the font size to the larger
        fontPanelButtons[3]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.getElementsByTagName("html")[0]!.style.fontSize).toBe("150%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(4);
        // step 6: largest size
      })
      .then(() => {
        // change the font size to the largest
        fontPanelButtons[4]!.click();
        fixture.detectChanges();

        // check the font size was changed
        expect(document.getElementsByTagName("html")[0]!.style.fontSize).toBe("200%");
        expect(menuSpy).toHaveBeenCalled();
        expect(menuSpy).toHaveBeenCalledTimes(5);
      });
    done();
  });

  // check the menu is shown if the screen is wide enough
  it("should show the menu if the screen is wide enough", () => {
    const fixture = TestBed.createComponent(AppComponent);
    viewport.set(700);
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    fixture.detectChanges();

    expect(component.showMenu()).toBeTrue();
    expect(componentHtml.querySelector("#navLinks")!.classList).not.toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).toContain("hidden");
  });

  // check the menu is hidden if the screen isn't wide enough
  it("should hide the menu if the screen isn't wide enough", () => {
    const fixture = TestBed.createComponent(AppComponent);
    viewport.set(500);
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    fixture.detectChanges();

    expect(component.showMenu()).toBeFalse();
    expect(componentHtml.querySelector("#navLinks")!.classList).toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");
  });

  // check the menu is shown when clicking the menu button
  it("should show the menu when the menu button is clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    viewport.set(500);
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    fixture.detectChanges();

    // pre-click check
    expect(component.showMenu()).toBeFalse();
    expect(componentHtml.querySelector("#navLinks")!.classList).toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

    // trigger click
    componentHtml.querySelector("#menuBtn").click();
    fixture.detectChanges();

    // post-click check
    expect(component.showMenu()).toBeTrue();
    expect(componentHtml.querySelector("#navLinks")!.classList).not.toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");
    done();
  });

  // check the menu is hidden when clicked again
  it("should hide the menu when the menu button is clicked again", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    viewport.set(500);
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    fixture.detectChanges();

    // pre-click check
    expect(component.showMenu()).toBeFalse();
    expect(componentHtml.querySelector("#navLinks")!.classList).toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

    // trigger click
    componentHtml.querySelector("#menuBtn").click();
    fixture.detectChanges();

    // post-click check
    expect(component.showMenu()).toBeTrue();
    expect(componentHtml.querySelector("#navLinks")!.classList).not.toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");

    // trigger another click
    componentHtml.querySelector("#menuBtn").click();
    fixture.detectChanges();

    // post-click check
    expect(component.showMenu()).toBeFalse();
    expect(componentHtml.querySelector("#navLinks")!.classList).toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn")!.classList).not.toContain("hidden");
    done();
  });

  // should hide the nav menu if it gets too long
  it("should hide nav menu if it gets too long", () => {
    const fixture = TestBed.createComponent(AppComponent);
    viewport.set(600);
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const checkSpy = spyOn(component, "checkMenuSize").and.callThrough();
    fixture.detectChanges();

    const navMenu = componentHtml.querySelector("#navMenu");
    const navLinks = componentHtml.querySelector("#navLinks");
    navLinks.style.width = "600px";
    navMenu.style.maxWidth = "600px";
    navMenu.style.display = "flex";
    component.changeTextSize("largest");
    fixture.detectChanges();

    expect(checkSpy).toHaveBeenCalled();
    expect(navLinks.classList).toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn").classList).not.toContain("hidden");
  });

  // should hide the menu if it gets too long and show it again if it's not too long
  it("should show the menu again if it's not to long again", () => {
    const fixture = TestBed.createComponent(AppComponent);
    viewport.set(600);
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const checkSpy = spyOn(component, "checkMenuSize").and.callThrough();
    fixture.detectChanges();

    const navMenu = componentHtml.querySelector("#navMenu");
    const navLinks = componentHtml.querySelector("#navLinks");
    navLinks.style.width = "600px";
    navMenu.style.maxWidth = "600px";
    navMenu.style.display = "flex";
    component.changeTextSize("largest");
    fixture.detectChanges();

    expect(checkSpy).toHaveBeenCalled();
    expect(navLinks.classList).toContain("hidden");
    expect(componentHtml.querySelector("#menuBtn").classList).not.toContain("hidden");

    navLinks.style.width = "500px";
    component.changeTextSize("smaller");
    fixture.detectChanges();

    expect(checkSpy).toHaveBeenCalled();
    expect(navLinks.classList).not.toContain("hidden");
    expect(component.showMenu()).toBeTrue();
  });

  // check the 'share' button is hidden
  it("shouldn't show the share button if it's not supported", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;

    // because tests run on Chrome, 'share' doesn't exist in navigator
    expect(component.canShare).toBeFalse();
    expect(
      componentHtml.querySelector("#siteFooter").querySelectorAll("textlessButton")[0],
    ).toBeUndefined();
  });

  // check the share method is called when the button is clicked
  it("should call the share method when the button is clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const componentHtml = fixture.nativeElement;
    const shareSpy = spyOn(component, "shareSite");

    component.canShare = true;
    fixture.detectChanges();

    componentHtml.querySelector("#siteFooter").querySelectorAll(".textlessButton")[0].click();
    fixture.detectChanges();

    expect(shareSpy).toHaveBeenCalled();
    done();
  });
});
