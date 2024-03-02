/*
	Main Page
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
import { of } from "rxjs";

// App imports
import { MainPage } from "./mainPage.component";
import { Loader } from "../loader/loader.component";
import { PopUp } from "../popUp/popUp.component";
import { SinglePost } from "../post/post.component";
import { ApiClientService } from "../../services/apiClient.service";
import { SWManager } from "../../services/sWManager.service";

const newItems = [
  {
    date: new Date("2020-06-27 19:17:31.072"),
    givenHugs: 0,
    id: 1,
    text: "test",
    userId: 1,
    user: "test",
    sentHugs: [],
  },
  {
    date: new Date("2020-06-28 19:17:31.072"),
    givenHugs: 0,
    id: 2,
    text: "test2",
    userId: 1,
    user: "test",
    sentHugs: [],
  },
];
const suggestedItems = [
  {
    date: new Date("2020-06-28 19:17:31.072"),
    givenHugs: 0,
    id: 2,
    text: "test2",
    userId: 1,
    user: "test",
    sentHugs: [],
  },
  {
    date: new Date("2020-06-27 19:17:31.072"),
    givenHugs: 0,
    id: 1,
    text: "test",
    userId: 1,
    user: "test",
    sentHugs: [],
  },
];

describe("MainPage", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [MainPage, Loader, PopUp, SinglePost],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    expect(mainPage).toBeTruthy();
  });

  it("should requests posts upon creation", () => {
    const fetchSpy = spyOn(MainPage.prototype, "fetchPosts");
    TestBed.createComponent(MainPage);

    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should fetch posts from the server", (done: DoneFn) => {
    // Inject services
    const apiClient = TestBed.inject(ApiClientService);
    const swManager = TestBed.inject(SWManager);

    // set up mock data
    const mockNetworkResponse = { recent: newItems, suggested: suggestedItems, success: true };

    // set up spies
    const idbSpy = spyOn(MainPage.prototype, "fetchFromIdb").and.returnValue(
      of({ recent: [], suggested: [], success: true }),
    );
    const apiClientSpy = spyOn(apiClient, "get").and.returnValue(of(mockNetworkResponse));
    const updateInterfaceSpy = spyOn(MainPage.prototype, "updatePostsInterface");
    const addItemsSpy = spyOn(swManager, "addFetchedItems");

    TestBed.createComponent(MainPage);

    expect(idbSpy).toHaveBeenCalled();
    expect(apiClientSpy).toHaveBeenCalledWith("");
    expect(updateInterfaceSpy).toHaveBeenCalledWith(mockNetworkResponse);
    expect(addItemsSpy).toHaveBeenCalledWith(
      "posts",
      [...mockNetworkResponse.recent, ...mockNetworkResponse.suggested],
      "date",
    );

    done();
  });

  it("should fetch posts from Idb", (done: DoneFn) => {
    // Just to make sure it doesn't get called during the test
    spyOn(MainPage.prototype, "fetchPosts");

    // Inject services
    const swManager = TestBed.inject(SWManager);

    // set up mock data
    const mockNewPosts = { posts: newItems, success: true, pages: 1 };
    const mockSuggestedPosts = { posts: suggestedItems, success: true, pages: 1 };

    // set up spies
    const idbSpy = spyOn(swManager, "fetchPosts").and.callFake(
      (sortBy, _perPage, _userID, _page, _reverseOrder) => {
        return new Promise((resolve, _reject) => {
          if (sortBy == "date") {
            resolve(mockNewPosts);
          } else {
            resolve(mockSuggestedPosts);
          }
        });
      },
    );
    const updateInterfaceSpy = spyOn(MainPage.prototype, "updatePostsInterface");

    const mainPage = TestBed.createComponent(MainPage);

    mainPage.componentInstance.fetchFromIdb().subscribe((_data) => {
      expect(idbSpy).toHaveBeenCalledWith("date", 10, undefined, 1, true);
      expect(idbSpy).toHaveBeenCalledWith("hugs", 10, undefined, 1, false);
      expect(idbSpy).toHaveBeenCalledTimes(2);
      expect(updateInterfaceSpy).toHaveBeenCalledOnceWith({
        recent: mockNewPosts.posts,
        suggested: mockSuggestedPosts.posts,
        success: true,
      });
      done();
    });
  });

  it("should update the interface with the fetched posts", (done: DoneFn) => {
    // Just to make sure it doesn't get called during the test
    spyOn(MainPage.prototype, "fetchPosts");
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const isLoadingSpy = spyOn(mainPage.isLoading, "set").and.callThrough();

    // set up mock data
    const mockData = { recent: newItems, suggested: suggestedItems, success: true };
    fixture.detectChanges();

    // check the variables start empty
    expect(mainPage.newPosts()).toEqual([]);
    expect(mainPage.suggestedPosts()).toEqual([]);
    expect(mainPage.isLoading()).toBeFalse();

    // call the method
    mainPage.updatePostsInterface(mockData);
    fixture.detectChanges();

    // check the new values
    expect(mainPage.newPosts()).toEqual(newItems);
    expect(mainPage.suggestedPosts()).toEqual(suggestedItems);
    expect(mainPage.isLoading()).toBeFalse();
    expect(isLoadingSpy).toHaveBeenCalledWith(false);

    const newPosts = mainPageDOM.querySelectorAll(".newItem");
    expect(newPosts.length).toBe(2);
    expect(newPosts[0].querySelector(".itemText").textContent).toContain("test");

    const suggestedPosts = mainPageDOM.querySelectorAll(".sugItem");
    expect(suggestedPosts.length).toBe(2);
    expect(suggestedPosts[0].querySelector(".itemText").textContent).toContain("test2");

    done();
  });

  it("should show an error if posts are undefined", (done: DoneFn) => {
    // Just to make sure it doesn't get called during the test
    spyOn(MainPage.prototype, "fetchPosts");
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const newPostsSetSpy = spyOn(mainPage.newPosts, "set").and.callThrough();

    // set up mock data
    const mockData = { recent: undefined as any, suggested: suggestedItems, success: true };
    fixture.detectChanges();

    // check the variables start empty
    expect(mainPage.newPosts()).toEqual([]);
    expect(mainPage.suggestedPosts()).toEqual([]);

    // call the method
    mainPage.updatePostsInterface(mockData);
    fixture.detectChanges();

    // check the new posts are still an empty array
    expect(mainPage.newPosts()).toEqual([]);
    expect(mainPage.suggestedPosts()).toEqual(suggestedItems);
    expect(newPostsSetSpy).not.toHaveBeenCalled();

    const errorMessage = mainPageDOM.querySelectorAll(".errorMessage");
    expect(errorMessage.length).toBe(1);
    expect(errorMessage[0].textContent).toContain("There are no recent items");

    done();
  });
});
