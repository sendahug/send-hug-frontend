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
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";

import { AdminFilters } from "./adminFilters.component";
import { PopUp } from "../popUp/popUp.component";
import { AuthService } from "../../services/auth.service";
import { Loader } from "../loader/loader.component";
import { mockAuthedUser } from "@tests/mockData";
import { ApiClientService } from "@app/services/apiClient.service";

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
        ReactiveFormsModule,
      ],
      declarations: [AdminFilters, PopUp, Loader],
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
    const apiClientSpy = spyOn(TestBed.inject(ApiClientService), "get").and.returnValue(
      of({
        words: [...mockFilteredPhrases],
        total_pages: 1,
        success: true,
      }),
    );
    const fixture = TestBed.createComponent(AdminFilters);
    const adminFilters = fixture.componentInstance;
    const adminFiltersDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(apiClientSpy).toHaveBeenCalledWith("filters", { page: "1" });
    expect(adminFilters.filteredPhrases.length).toBe(2);
    expect(adminFilters.totalPages).toBe(1);
    expect(
      adminFiltersDOM.querySelectorAll(".tableContainer")[0].querySelectorAll("tbody tr").length,
    ).toBe(2);
    done();
  });

  // Check that you can add a filter
  it("should add a new filter", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminFilters);
    const adminFilters = fixture.componentInstance;
    const adminFiltersDOM = fixture.nativeElement;
    const addSpy = spyOn(adminFilters, "addFilter").and.callThrough();
    const apiClientSpy = spyOn(adminFilters["apiClient"], "post").and.returnValue(
      of({ success: true, added: { id: 3, filter: "text" } }),
    );
    const alertsSpy = spyOn(adminFilters["alertsService"], "createSuccessAlert");
    spyOn(adminFilters, "fetchFilters");
    adminFilters.filteredPhrases = [...mockFilteredPhrases];
    adminFilters.totalPages = 1;
    adminFilters.isLoading = false;
    fixture.detectChanges();

    // add filter to the text-field and click the button
    adminFiltersDOM.querySelector("#filter").value = "text";
    adminFiltersDOM.querySelector("#filter").dispatchEvent(new Event("input"));
    adminFiltersDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(addSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalledWith("filters", { word: "text" });
    expect(alertsSpy).toHaveBeenCalledWith(
      `The phrase text was added to the list of filtered words! Refresh to see the updated list.`,
      true,
    );
    done();
  });

  it("should not try to add a new filter if there's no filter in the text field", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminFilters);
    const adminFilters = fixture.componentInstance;
    const adminFiltersDOM = fixture.nativeElement;
    const addSpy = spyOn(adminFilters, "addFilter").and.callThrough();
    const apiClientSpy = spyOn(adminFilters["apiClient"], "post");
    const alertSpy = spyOn(adminFilters["alertsService"], "createAlert");
    spyOn(adminFilters, "fetchFilters");
    adminFilters.filteredPhrases = [...mockFilteredPhrases];
    adminFilters.totalPages = 1;
    adminFilters.isLoading = false;
    fixture.detectChanges();

    // click the button
    adminFiltersDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(addSpy).toHaveBeenCalled();
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "A filtered phrase is required in order to add to the filters list.",
    });
    done();
  });

  // Check that you can remove a filter
  it("should remove a filter", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      success: true,
      deleted: {
        filter: "word1",
        id: 1,
      },
    };

    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminFilters);
    const adminFilters = fixture.componentInstance;
    const adminFiltersDOM = fixture.nativeElement;
    const removeSpy = spyOn(adminFilters, "removeFilter").and.callThrough();
    const alertSpy = spyOn(adminFilters["alertsService"], "createSuccessAlert");
    const deleteSpy = spyOn(adminFilters["apiClient"], "delete").and.returnValue(of(mockResponse));
    spyOn(adminFilters, "fetchFilters");
    adminFilters.filteredPhrases = [...mockFilteredPhrases];
    adminFilters.totalPages = 1;
    adminFilters.isLoading = false;

    fixture.detectChanges();

    // simulate click on the 'remove' button
    adminFiltersDOM.querySelectorAll(".adminButton")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(removeSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith("filters/1");
    expect(alertSpy).toHaveBeenCalledWith(
      `The phrase ${mockResponse.deleted.filter} was removed from the list of filtered words. Refresh to see the updated list.`,
      true,
    );
    done();
  });

  it("should go to the next page", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminFilters);
    const adminFilters = fixture.componentInstance;
    const adminFiltersDOM = fixture.nativeElement;
    const nextPageSpy = spyOn(adminFilters, "nextPage").and.callThrough();
    const fetchSpy = spyOn(adminFilters, "fetchFilters");
    adminFilters.filteredPhrases = [...mockFilteredPhrases];
    adminFilters.totalPages = 2;
    adminFilters.isLoading = false;

    fixture.detectChanges();

    // simulate click on the 'next' button
    adminFiltersDOM.querySelectorAll(".pagination > button")[1].click();
    fixture.detectChanges();

    // check expectations
    expect(nextPageSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });

  it("should go to the previous page", (done: DoneFn) => {
    // set up the spy and the component
    const fixture = TestBed.createComponent(AdminFilters);
    const adminFilters = fixture.componentInstance;
    const adminFiltersDOM = fixture.nativeElement;
    const prevPageSpy = spyOn(adminFilters, "prevPage").and.callThrough();
    const fetchSpy = spyOn(adminFilters, "fetchFilters");
    adminFilters.filteredPhrases = [...mockFilteredPhrases];
    adminFilters.totalPages = 2;
    adminFilters.isLoading = false;
    adminFilters.currentPage = 2;

    fixture.detectChanges();

    // simulate click on the 'previous' button
    adminFiltersDOM.querySelectorAll(".pagination > button")[0].click();
    fixture.detectChanges();

    // check expectations
    expect(prevPageSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalled();
    done();
  });
});
