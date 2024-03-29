/*
	New Item
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
import { ActivatedRoute, UrlSegment } from "@angular/router";

import { NewItem } from "./newItem.component";
import { AuthService } from "../../services/auth.service";
import { mockAuthedUser } from "@tests/mockData";

describe("NewItem", () => {
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
      declarations: [NewItem],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated = true;
    authService.userData = { ...mockAuthedUser };
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    expect(newItem).toBeTruthy();
  });

  // NEW POST
  // ==================================================================
  // Check that the type of new item is determined by the parameter type
  it("New Post - has a type determined by the type parameter - post", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(newItem.itemType).toBe("Post");
    expect(newItemDOM.querySelector("#newPost")).toBeTruthy();
    expect(newItemDOM.querySelector("#newMessage")).toBeNull();
    expect(
      newItemDOM.querySelectorAll(".formElement")[0].querySelectorAll(".pageData")[0].textContent,
    ).toBe("name");
    done();
  });

  // Check that it triggers the items service when creating a new post
  it("New Post - triggers the items service when creating a new post", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newPostSpy = spyOn(newItem, "sendPost").and.callThrough();
    const newPostServiceSpy = spyOn(newItem["itemsService"], "sendPost");

    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "new post";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    const newPost = {
      userId: 4,
      user: "name",
      text: postText,
      givenHugs: 0,
    };
    expect(newPostSpy).toHaveBeenCalled();
    expect(newPostServiceSpy).toHaveBeenCalled();
    expect(newPostServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(newPost));
    done();
  });

  // Check that an empty post triggers an alert
  it("New Post - should prevent empty posts", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newPostSpy = spyOn(newItem, "sendPost").and.callThrough();
    const newPostServiceSpy = spyOn(newItem["itemsService"], "sendPost");
    const alertsService = newItem["alertService"];
    const alertSpy = spyOn(alertsService, "createAlert");

    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newPostSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    expect(newPostServiceSpy).not.toHaveBeenCalled();
    done();
  });

  // Check that a user can't post if they're blocked
  it("New Post - should prevent blocked users from posting", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    newItem["authService"].userData.blocked = true;
    newItem["authService"].userData.releaseDate = new Date(new Date().getTime() + 864e5 * 7);

    fixture.detectChanges();

    const alert = `You are currently blocked until ${newItem["authService"].userData.releaseDate}. You cannot post new posts.`;
    expect(newItemDOM.querySelectorAll(".newItem")[0]).toBeUndefined();
    expect(newItemDOM.querySelectorAll(".errorMessage")[0]).toBeTruthy();
    expect(newItemDOM.querySelectorAll(".errorMessage")[0].textContent).toContain(alert);
    done();
  });

  // Check that a user can't post if they're logged out
  it("New Post - should prevent logged out users from posting", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newPostSpy = spyOn(newItem, "sendPost").and.callThrough();
    const newPostServiceSpy = spyOn(newItem["itemsService"], "sendPost");
    const alertsService = newItem["alertService"];
    const alertSpy = spyOn(alertsService, "createAlert");
    newItem["authService"].authenticated = false;

    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "textfield";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newPostSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "You're currently logged out. Log back in to post a new post.",
    });
    expect(newPostServiceSpy).not.toHaveBeenCalled();
    done();
  });

  // NEW MESSAGE
  // ==================================================================
  // Check that the type of new item is determined by the parameter type
  it("New Message - has a type determined by the type parameter - message", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Message" } as UrlSegment]);
    const queryParamsSpy = spyOn(paramMap.snapshot.queryParamMap, "get").and.callFake(
      (param: string) => {
        if (param == "user") {
          return "hello";
        } else if (param == "userID") {
          return "2";
        } else {
          return null;
        }
      },
    );
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(queryParamsSpy).toHaveBeenCalled();
    expect(newItem.itemType).toBe("Message");
    expect(newItem.user).toBe("hello");
    expect(newItem.forID).toBe(2);
    expect(newItemDOM.querySelector("#newPost")).toBeNull();
    expect(newItemDOM.querySelector("#newMessage")).toBeTruthy();
    expect(newItemDOM.querySelector("#messageFor").value).toBe("hello");
    done();
  });

  // Check that it triggers the items service when creating a new message
  it("New Message - triggers the items service when creating a new message", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Message" } as UrlSegment]);
    spyOn(paramMap.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "user") {
        return "hello";
      } else if (param == "userID") {
        return "2";
      } else {
        return null;
      }
    });
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newMessageSpy = spyOn(newItem, "sendMessage").and.callThrough();
    const newMessServiceSpy = spyOn(newItem["itemsService"], "sendMessage");

    fixture.detectChanges();

    // fill in message's text and trigger a click
    const messageText = "hello";
    newItemDOM.querySelector("#messageText").value = messageText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    const newMessage = {
      from: {
        displayName: "name",
      },
      fromId: 4,
      forId: 2,
      messageText: messageText,
    };
    expect(newMessageSpy).toHaveBeenCalled();
    expect(newMessServiceSpy).toHaveBeenCalled();
    expect(newMessServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(newMessage));
    done();
  });

  // Check that an empty message triggers an alert
  it("New Message - should prevent empty messages", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Message" } as UrlSegment]);
    spyOn(paramMap.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "user") {
        return "hello";
      } else if (param == "userID") {
        return "2";
      } else {
        return null;
      }
    });
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newMessageSpy = spyOn(newItem, "sendMessage").and.callThrough();
    const newMessServiceSpy = spyOn(newItem["itemsService"], "sendMessage");
    const alertSpy = spyOn(newItem["alertService"], "createAlert");

    fixture.detectChanges();

    // fill in message's text and trigger a click
    const messageText = "";
    newItemDOM.querySelector("#messageText").value = messageText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newMessageSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    expect(newMessServiceSpy).not.toHaveBeenCalled();
    done();
  });

  // Check that a user can't send a message if they're logged out
  it("New Message - should prevent logged out users from messaging", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Message" } as UrlSegment]);
    spyOn(paramMap.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "user") {
        return "hello";
      } else if (param == "userID") {
        return "2";
      } else {
        return null;
      }
    });
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newMessageSpy = spyOn(newItem, "sendMessage").and.callThrough();
    const newMessServiceSpy = spyOn(newItem["itemsService"], "sendMessage");
    const alertSpy = spyOn(newItem["alertService"], "createAlert");
    newItem["authService"].authenticated = false;

    fixture.detectChanges();

    // fill in message's text and trigger a click
    const messageText = "text";
    newItemDOM.querySelector("#messageText").value = messageText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newMessageSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "You're currently logged out. Log back in to send a message.",
    });
    expect(newMessServiceSpy).not.toHaveBeenCalled();
    done();
  });

  // Check that an error is thrown if there's no user ID and user data
  it("New Message - should throw an error if there's no user ID and user", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Message" } as UrlSegment]);
    spyOn(paramMap.snapshot.queryParamMap, "get").and.callFake((_param: string) => {
      return "";
    });
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(newItemDOM.querySelectorAll(".newItem")[0]).toBeUndefined();
    expect(newItemDOM.querySelectorAll(".errorMessage")[0]).toBeTruthy();
    expect(newItemDOM.querySelectorAll(".errorMessage")[0].textContent).toContain(
      "User ID and display name are required for sending a message",
    );
    done();
  });

  // Check that a user can't message themselves
  it("New Message - should prevent users messaging themselves", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Message" } as UrlSegment]);
    spyOn(paramMap.snapshot.queryParamMap, "get").and.callFake((param: string) => {
      if (param == "user") {
        return "name";
      } else if (param == "userID") {
        return "4";
      } else {
        return null;
      }
    });
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newMessageSpy = spyOn(newItem, "sendMessage").and.callThrough();
    const newMessServiceSpy = spyOn(newItem["itemsService"], "sendMessage");
    const alertSpy = spyOn(newItem["alertService"], "createAlert");

    fixture.detectChanges();

    // fill in message's text and trigger a click
    const messageText = "text";
    newItemDOM.querySelector("#messageText").value = messageText;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newMessageSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    expect(newMessServiceSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "You can't send a message to yourself!",
    });
    done();
  });
});
