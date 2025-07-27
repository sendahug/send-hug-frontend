/*
  Search Form
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
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { provideZonelessChangeDetection } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { Subscription } from "rxjs";

import { SearchFormComponent } from "./searchForm.component";
import { ItemsService } from "@app/services/items.service";

describe("SearchFormComponent", () => {
  beforeEach(() => {
    const MockItemsService = MockProvider(ItemsService, {
      sendSearch: (_search) => new Subscription(),
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, SearchFormComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter([], withComponentInputBinding()),
        MockItemsService,
      ],
    }).compileComponents();
  });

  // Check that the app is created
  it("should create the search form", () => {
    const fixture = TestBed.createComponent(SearchFormComponent);
    const searchForm = fixture.componentInstance;

    expect(searchForm).toBeTruthy();
  });

  // Check that clicking 'search' triggers the ItemsService
  it("should pass search query to the ItemsService when clicking search", () => {
    const fixture = TestBed.createComponent(SearchFormComponent);
    fixture.autoDetectChanges();
    const searchForm = fixture.componentInstance;
    const searchFormHtml = fixture.nativeElement;
    const searchSpy = spyOn(searchForm, "searchApp").and.callThrough();
    const searchServiceSpy = spyOn(searchForm["itemsService"], "sendSearch");
    const navigateSpy = spyOn(searchForm["router"], "navigate");
    const toggleSpy = spyOn(searchForm, "toggleSearch");

    searchFormHtml.querySelector("#searchQuery").value = "search";
    searchFormHtml.querySelector("#searchQuery").dispatchEvent(new Event("input"));
    searchFormHtml.querySelectorAll(".sendData")[0].click();

    // check the spies were triggered
    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchServiceSpy).toHaveBeenCalledWith("search");
    expect(navigateSpy).toHaveBeenCalledWith(["search"], {
      queryParams: {
        query: "search",
      },
    });

    expect(toggleSpy).toHaveBeenCalledWith();
  });

  // Check that an empty search query isn't allowed
  it("should prevent empty searches", () => {
    const fixture = TestBed.createComponent(SearchFormComponent);
    fixture.autoDetectChanges();
    const searchForm = fixture.componentInstance;
    const searchFormHtml = fixture.nativeElement;
    const searchSpy = spyOn(searchForm, "searchApp").and.callThrough();
    const searchServiceSpy = spyOn(searchForm["itemsService"], "sendSearch");
    const alertsSpy = spyOn(searchForm["alertsService"], "createAlert");
    const navigateSpy = spyOn(searchForm["router"], "navigate");
    const toggleSpy = spyOn(searchForm, "toggleSearch");

    // open search panel and run search
    searchFormHtml.querySelector("#searchQuery").value = "";
    searchFormHtml.querySelectorAll(".sendData")[0].click();

    // check one spy was triggered and one wasn't
    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchServiceSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      message: "Search query is empty! Please write a term to search for.",
      type: "Error",
    });

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(toggleSpy).not.toHaveBeenCalled();
  });

  it("toggleSearch() - emits false to close the search", () => {
    const fixture = TestBed.createComponent(SearchFormComponent);
    fixture.detectChanges();
    const searchForm = fixture.componentInstance;
    const searchFormHtml = fixture.nativeElement;
    const toggleSpy = spyOn(searchForm, "toggleSearch").and.callThrough();
    const emitSpy = spyOn(searchForm.showForm, "emit");

    searchFormHtml.querySelector("#exitButton").click();
    fixture.detectChanges();

    expect(toggleSpy).toHaveBeenCalledWith();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
