/*
	Items Service
	Send a Hug Service Tests
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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { of } from "rxjs";

import { ItemsService } from "./items.service";
import { CommonTestModules } from "@tests/commonModules";

describe("ItemsService", () => {
  let itemsService: ItemsService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ...CommonTestModules],
      providers: [ItemsService],
    }).compileComponents();

    itemsService = TestBed.inject(ItemsService);
    // set the user data as if the user is logged in
    itemsService["authService"].userData.set({
      id: 4,
      auth0Id: "",
      displayName: "name",
      receivedH: 2,
      givenH: 2,
      posts: 2,
      loginCount: 3,
      role: {
        id: 1,
        name: "admin",
        permissions: [],
      },
      jwt: "",
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
      firebaseId: "",
    });
    itemsService["authService"].authenticated.set(true);
    itemsService["authService"].isUserDataResolved.next(true);
  });

  // Check the service is created
  it("should be created", () => {
    expect(itemsService).toBeTruthy();
  });

  it("sendHug() - should send a hug for a post", () => {
    const mockPost = {
      id: 1,
      userId: 4,
      user: "name",
      text: "text",
      date: new Date(),
      givenHugs: 0,
    };
    const apiClientSpy = spyOn(itemsService["apiClient"], "post").and.returnValue(
      of({ success: true }),
    );
    const successAlertSpy = spyOn(itemsService["alertsService"], "createSuccessAlert");
    itemsService.sendHug(mockPost.id);

    expect(apiClientSpy).toHaveBeenCalledWith(`posts/${mockPost.id}/hugs`, {});
    expect(successAlertSpy).toHaveBeenCalledWith("Your hug was sent!");
    expect(itemsService.receivedAHug.value).toBe(mockPost.id);
  });

  // Check the service correctly sends a message
  it("sendMessage() - should send a message", () => {
    // mock response
    const mockResponse = {
      message: {
        date: "Mon, 08 Jun 2020 14:43:15 GMT",
        from: {
          displayName: "user",
        },
        fromId: 4,
        for: {
          displayName: "user2",
        },
        forId: 1,
        id: 9,
        messageText: "hang in there",
        threadID: 1,
      },
      success: true,
    };

    const message = {
      from: {
        displayName: "user",
      },
      fromId: 4,
      for: {
        displayName: "user2",
      },
      forId: 1,
      messageText: "hang in there",
      date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
    };
    const apiClientSpy = spyOn(itemsService["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertSpy = spyOn(itemsService["alertsService"], "createSuccessAlert");
    const addSpy = spyOn(itemsService["serviceWorkerM"], "addItem");
    itemsService.sendMessage(message);

    expect(apiClientSpy).toHaveBeenCalledWith("messages", message);
    expect(alertSpy).toHaveBeenCalledWith("Your message was sent!", {
      navigate: true,
      navTarget: "/",
      navText: "Home Page",
    });
    expect(addSpy).toHaveBeenCalledWith("messages", {
      ...mockResponse.message,
      isoDate: new Date(message.date).toISOString(),
    });
  });

  // Check that the service runs the search and handles results correctly
  it("sendSearch() - should run a search", () => {
    // mock response
    const mockResponse = {
      current_page: 1,
      post_results: 7,
      posts: [
        {
          date: "Mon, 01 Jun 2020 15:20:11 GMT",
          givenHugs: 0,
          id: 7,
          text: "test",
          user: "shirb",
          userId: 1,
        },
        {
          date: "Mon, 01 Jun 2020 15:19:41 GMT",
          givenHugs: 0,
          id: 6,
          text: "test",
          user: "shirb",
          userId: 1,
        },
        {
          date: "Mon, 01 Jun 2020 15:18:37 GMT",
          givenHugs: 0,
          id: 5,
          text: "test",
          user: "shirb",
          userId: 1,
        },
        {
          date: "Mon, 01 Jun 2020 15:17:56 GMT",
          givenHugs: 0,
          id: 4,
          text: "test",
          user: "shirb",
          userId: 1,
        },
        {
          date: "Mon, 01 Jun 2020 15:15:12 GMT",
          givenHugs: 0,
          id: 3,
          text: "testing",
          user: "shirb",
          userId: 1,
        },
      ],
      success: true,
      total_pages: 2,
      user_results: 2,
      users: [
        {
          id: 6,
          displayName: "tests",
          receivedHugs: 2,
          givenHugs: 4,
          postsNum: 1,
          role: "user",
        },
        {
          id: 7,
          displayName: "testing",
          receivedHugs: 2,
          givenHugs: 4,
          postsNum: 1,
          role: "user",
        },
      ],
    };
    const apiClientSpy = spyOn(itemsService["apiClient"], "post").and.returnValue(of(mockResponse));

    itemsService.sendSearch("test");
    // wait until the search is resolved
    itemsService.isSearchResolved.subscribe((value) => {
      if (value) {
        expect(itemsService.userSearchResults.length).toBe(2);
        expect(itemsService.postSearchResults.length).toBe(5);
        expect(itemsService.numUserResults).toBe(2);
        expect(itemsService.numPostResults).toBe(7);
        expect(itemsService.postSearchPage()).toBe(1);
        expect(itemsService.totalPostSearchPages()).toBe(2);
        expect(itemsService.isSearching).toBeFalse();
        expect(apiClientSpy).toHaveBeenCalledWith("", { search: "test" }, { page: "1" });
      }
    });
  });
});
