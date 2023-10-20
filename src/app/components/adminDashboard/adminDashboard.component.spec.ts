/*
  Admin Dashboard
  Send a Hug Component Tests
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { RouterTestingModule } from "@angular/router/testing";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { AdminDashboard } from "./adminDashboard.component";
import { PopUp } from "../popUp/popUp.component";
import { AdminService } from "../../services/admin.service";
import { AuthService } from "../../services/auth.service";
import { Loader } from "../loader/loader.component";
import { mockAuthedUser } from "@tests/mockData";

const mockFilteredPhrases = [
  {
    filter: "word",
    id: 1,
  },
  {
    filter: "word2",
    id: 2,
  },
];

describe("AdminDashboard", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [AdminDashboard, PopUp, Loader],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    // make sure the test goes through with admin permission
    const authService = TestBed.inject(AuthService) as AuthService;
    spyOn(authService, "canUser").and.returnValue(true);
    authService.isUserDataResolved.next(true);
    authService.authenticated = true;
    authService.userData = { ...mockAuthedUser };
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    expect(adminDashboard).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it("should have all popup variables set to false", () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    expect(adminDashboard.editMode).toBeFalse();
    expect(adminDashboard.delete).toBeFalse();
    expect(adminDashboard.report).toBeFalse();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const changeSpy = spyOn(adminDashboard, "changeMode").and.callThrough();

    fixture.detectChanges();

    // start the popup
    adminDashboard.lastFocusedElement = document.querySelectorAll("a")[0];
    adminDashboard.editType = "other user";
    adminDashboard.toEdit = "displayName";
    adminDashboard.editMode = true;
    adminDashboard.reportData.reportID = 5;
    adminDashboard.reportData.userID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("app-pop-up")).componentInstance as PopUp;
    popup.exitEdit();
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminDashboard.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });

  // FILTERS PAGE
  // ==================================================================
  describe("Filters Page", () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register("sw.js", { enabled: false }),
          FontAwesomeModule,
        ],
        declarations: [AdminDashboard, PopUp, Loader],
        providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      }).compileComponents();

      // make sure the test goes through with admin permission
      const authService = TestBed.inject(AuthService);
      spyOn(authService, "canUser").and.returnValue(true);
      authService.isUserDataResolved.next(true);
      authService.authenticated = true;
      authService.userData = { ...mockAuthedUser };
    });

    // Check that a call is made to get filtered phrases
    it("should get filtered phrases", (done: DoneFn) => {
      // set up the spy and the component
      const adminService = TestBed.inject(AdminService);
      const filterSpy = spyOn(adminService, "getFilters");
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminService.filteredPhrases = [...mockFilteredPhrases];
      adminService.isFiltersResolved.next(true);
      adminService.totalPages.filteredPhrases = 1;
      adminDashboard.screen = "filters";

      fixture.detectChanges();

      expect(filterSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.filteredPhrases.length).toBe(2);
      expect(
        adminDashboardDOM.querySelectorAll(".tableContainer")[0].querySelectorAll("tbody tr")
          .length,
      ).toBe(2);
      done();
    });

    // Check that you can add a filter
    it("should add a new filter", (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const addSpy = spyOn(adminDashboard, "addFilter").and.callThrough();
      const adminService = adminDashboard.adminService;
      const addServiceSpy = spyOn(adminService, "addFilter");
      spyOn(adminService, "getFilters");
      adminService.filteredPhrases = [...mockFilteredPhrases];
      adminService.isFiltersResolved.next(true);
      adminService.totalPages.filteredPhrases = 1;
      adminDashboard.screen = "filters";

      fixture.detectChanges();

      // add filter to the text-field and click the button
      adminDashboardDOM.querySelector("#filter").value = "text";
      adminDashboardDOM.querySelectorAll(".sendData")[0].click();
      fixture.detectChanges();

      // check expectations
      expect(addSpy).toHaveBeenCalled();
      expect(addServiceSpy).toHaveBeenCalled();
      expect(addServiceSpy).toHaveBeenCalledWith("text");
      done();
    });

    // Check that you can remove a filter
    it("should remove a filter", (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const removeSpy = spyOn(adminDashboard, "removeFilter").and.callThrough();
      const adminService = adminDashboard.adminService;
      const removeServiceSpy = spyOn(adminService, "removeFilter");
      spyOn(adminService, "getFilters");
      adminService.filteredPhrases = [...mockFilteredPhrases];
      adminService.isFiltersResolved.next(true);
      adminService.totalPages.filteredPhrases = 1;
      adminDashboard.screen = "filters";

      fixture.detectChanges();

      // simulate click on the 'remove' button
      adminDashboardDOM.querySelectorAll(".adminButton")[0].click();
      fixture.detectChanges();

      // check expectations
      expect(removeSpy).toHaveBeenCalled();
      expect(removeServiceSpy).toHaveBeenCalled();
      expect(removeServiceSpy).toHaveBeenCalledWith(1);
      done();
    });
  });
});
