/*
	New Item
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
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { of } from "rxjs";
import { ActivatedRoute, RouterModule, UrlSegment } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { NewItem } from "./newItem.component";
import { AuthService } from "@app/common/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";

describe("NewItem", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
        ReactiveFormsModule,
      ],
      declarations: [NewItem],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
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
  it("sendPost() - should send a post", () => {
    const mockNewPost = {
      userId: 4,
      user: "name",
      text: "new post",
      givenHugs: 0,
    };
    const mockResponsePost = {
      ...mockNewPost,
      date: new Date("Tue Apr 09 2024 17:06:17 GMT+0100 (British Summer Time)"),
    };
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const apiClientSpy = spyOn(newItem["apiClient"], "post").and.returnValue(
      of({ success: true, posts: mockNewPost }),
    );
    const successAlertSpy = spyOn(newItem["alertService"], "createSuccessAlert");
    const addItemSpy = spyOn(newItem["swManager"], "addFetchedItems");
    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "new post";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(apiClientSpy).toHaveBeenCalledWith("posts", jasmine.objectContaining(mockNewPost));
    expect(successAlertSpy).toHaveBeenCalledWith(
      "Your post was published! Return to home page to view the post.",
      { navigate: true, navTarget: "/", navText: "Home Page" },
    );
    expect(addItemSpy).toHaveBeenCalledWith("posts", [mockNewPost], "date");
  });

  // Check that an empty post triggers an alert
  it("New Post - should prevent empty posts", (done: DoneFn) => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const newPostSpy = spyOn(newItem, "sendPost").and.callThrough();
    const apiClientSpy = spyOn(newItem["apiClient"], "post");
    const alertsService = newItem["alertService"];
    const alertSpy = spyOn(alertsService, "createAlert");

    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newPostSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
    expect(apiClientSpy).not.toHaveBeenCalled();
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
    const alertsService = newItem["alertService"];
    const alertSpy = spyOn(alertsService, "createAlert");
    newItem["authService"].authenticated.set(false);
    const apiClientSpy = spyOn(newItem["apiClient"], "post");
    const addItemSpy = spyOn(newItem["swManager"], "addFetchedItems");
    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "textfield";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(newPostSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "You're currently logged out. Log back in to post a new post.",
    });
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(addItemSpy).not.toHaveBeenCalled();
    done();
  });

  it("shouldn't show the post form if the user is blocked", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    newItem["authService"].userData!.blocked = true;
    newItem["authService"].userData!.releaseDate = new Date(
      "Tue Apr 09 2124 17:06:17 GMT+0100 (British Summer Time)",
    );
    fixture.detectChanges();

    expect(newItemDOM.querySelector("#postText")).toBeNull();
    const errorMessage = newItemDOM.querySelectorAll(".errorMessage")[0];
    expect(errorMessage.textContent).toContain(
      `You are currently blocked until ${newItem["authService"].userData?.releaseDate}. You cannot post new posts.`,
    );
  });

  it("sendPost() - should prevent sending a post if the user is blocked", () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{ path: "Post" } as UrlSegment]);
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    const newItemDOM = fixture.nativeElement;
    const apiClientSpy = spyOn(newItem["apiClient"], "post");
    const successAlertSpy = spyOn(newItem["alertService"], "createSuccessAlert");
    const addItemSpy = spyOn(newItem["swManager"], "addFetchedItems");
    const errorAlertSpy = spyOn(newItem["alertService"], "createAlert");
    newItem["authService"].userData!.blocked = false;
    newItem["authService"].userData!.releaseDate = new Date(
      "Tue Apr 09 2124 17:06:17 GMT+0100 (British Summer Time)",
    );
    fixture.detectChanges();

    // fill in post's text and trigger a click
    const postText = "new post";
    newItemDOM.querySelector("#postText").value = postText;
    newItemDOM.querySelector("#postText").dispatchEvent(new Event("input"));
    newItem["authService"].userData!.blocked = true;
    newItemDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(successAlertSpy).not.toHaveBeenCalled();
    expect(addItemSpy).not.toHaveBeenCalled();
    expect(errorAlertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: `You cannot post new posts while you're blocked. You're blocked until ${newItem["authService"].userData?.releaseDate}.`,
    });
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
    expect(newItem.newMessageForm.controls.messageFor.value).toBe("hello");
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
    newItemDOM.querySelector("#messageText").dispatchEvent(new Event("input"));
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
    newItemDOM.querySelector("#messageText").dispatchEvent(new Event("input"));
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
    newItem["authService"].authenticated.set(false);

    fixture.detectChanges();

    // fill in message's text and trigger a click
    const messageText = "text";
    newItemDOM.querySelector("#messageText").value = messageText;
    newItemDOM.querySelector("#messageText").dispatchEvent(new Event("input"));
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
    newItemDOM.querySelector("#messageText").dispatchEvent(new Event("input"));
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
