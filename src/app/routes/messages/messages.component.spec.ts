/*
	Messages Page
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
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {
  ActivatedRoute,
  provideRouter,
  RouterLink,
  UrlSegment,
  withComponentInputBinding,
} from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA, provideZoneChangeDetection, signal } from "@angular/core";
import { MockComponent, MockProvider } from "ng-mocks";

import { AppMessaging } from "./messages.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { FullThread } from "@app/interfaces/thread.interface";
import { type MessageGet } from "@app/interfaces/message.interface";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { ApiClientService } from "@app/services/apiClient.service";
import { LoaderComponent } from "@common/loader/loader.component";
import { MessageComponent } from "@app/components/messaging/message/message.component";
import { ThreadComponent } from "@app/components/messaging/thread/thread.component";

describe("AppMessaging", () => {
  let mockMessages: MessageGet[];
  let mockThreads: FullThread[];

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
      isUserDataResolved: new BehaviorSubject(true),
    });
    const MockAPIClient = MockProvider(ApiClientService);
    const MockItemDeleteFormComponent = MockComponent(ItemDeleteFormComponent);
    const MockLoaderComponent = MockComponent(LoaderComponent);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MockItemDeleteFormComponent,
        MockLoaderComponent,
        ThreadComponent,
        RouterLink,
        CommonModule,
        AppMessaging,
        MessageComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
          [
            {
              path: "messages",
              children: [
                { path: "", pathMatch: "prefix", redirectTo: "inbox", data: { name: "Inbox" } },
                {
                  path: "inbox",
                  pathMatch: "prefix",
                  component: AppMessaging,
                  data: { name: "Inbox" },
                },
                {
                  path: "outbox",
                  pathMatch: "prefix",
                  component: AppMessaging,
                  data: { name: "Outbox" },
                },
                {
                  path: "threads",
                  pathMatch: "prefix",
                  component: AppMessaging,
                  data: { name: "Threads" },
                },
                {
                  path: "thread/:id",
                  pathMatch: "prefix",
                  component: AppMessaging,
                  data: { name: "Thread" },
                },
              ],
              data: {
                name: "Mailbox",
                mapRoutes: [
                  { path: "inbox", name: "Inbox" },
                  { path: "outbox", name: "Outbox" },
                  { path: "threads", name: "Threads" },
                ],
              },
            },
          ],
          withComponentInputBinding(),
        ),
        MockAuthService,
        MockAPIClient,
      ],
    }).compileComponents();

    mockMessages = [
      {
        date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
        for: {
          displayName: "user14",
        },
        forId: 4,
        from: {
          displayName: "user14",
        },
        fromId: 4,
        id: 1,
        messageText: "Your post (ID 19) was deleted due to violating our community rules.",
        threadID: 4,
      },
      {
        date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
        for: {
          displayName: "user14",
        },
        forId: 4,
        from: {
          displayName: "user14",
        },
        fromId: 4,
        id: 14,
        messageText: "Your post (ID 19) was deleted due to violating our community rules.",
        threadID: 4,
      },
    ];

    mockThreads = [
      {
        id: 3,
        user1: {
          displayName: "shirb",
          selectedIcon: "kitty",
          iconColours: {
            character: "#BA9F93",
            lbg: "#e2a275",
            rbg: "#f8eee4",
            item: "#f4b56a",
          },
        },
        user1Id: 1,
        user2: {
          displayName: "test",
          selectedIcon: "kitty",
          iconColours: {
            character: "#BA9F93",
            lbg: "#e2a275",
            rbg: "#f8eee4",
            item: "#f4b56a",
          },
        },
        user2Id: 4,
        numMessages: 1,
        latestMessage: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
      },
    ];
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging).toBeTruthy();
  });

  // Check that the component loads the inbox if no mailbox is specified
  it("should load the inbox by default", () => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging.messType()).toBe("inbox");
  });

  // Check that the popup variables are set to false
  it("should have all popup variables set to false", () => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging.deleteMode()).toBeFalse();
  });

  it("should fetch messages from the server", () => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const idbFetchSpy = spyOn(appMessaging, "fetchMessagesFromIdb").and.returnValue(
      of({ messages: [], total_pages: 1, current_page: 1, success: true }),
    );
    const apiClientSpy = spyOn(appMessaging["apiClient"], "get").and.returnValue(
      of({ messages: mockMessages, total_pages: 2, current_page: 1, success: true }),
    );
    const swManagerSpy = spyOn(appMessaging["swManager"], "addFetchedItems");

    // before
    expect(appMessaging.messages()).toEqual([]);
    expect(appMessaging.totalPages()).toBe(1);
    expect(appMessaging.currentPage()).toBe(1);

    fixture.detectChanges();

    appMessaging.fetchMessages();

    // after
    expect(idbFetchSpy).toHaveBeenCalledWith();
    expect(apiClientSpy).toHaveBeenCalledWith("messages", {
      page: 1,
      type: "inbox",
    });

    expect(appMessaging.messages()).toEqual(mockMessages);
    expect(appMessaging.totalPages()).toBe(2);
    expect(appMessaging.currentPage()).toBe(1);
    expect(swManagerSpy).toHaveBeenCalledWith("messages", mockMessages, "date");
  });

  it("should add the thread ID param to the fetch if the message type is thread", () => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    appMessaging.messType.set("thread");
    appMessaging.threadId.set(4);
    const idbFetchSpy = spyOn(appMessaging, "fetchMessagesFromIdb").and.returnValue(
      of({ messages: [], total_pages: 1, current_page: 1, success: true }),
    );
    const apiClientSpy = spyOn(appMessaging["apiClient"], "get").and.returnValue(
      of({ messages: mockMessages, total_pages: 2, current_page: 1, success: true }),
    );

    fixture.detectChanges();

    appMessaging.fetchMessages();

    expect(idbFetchSpy).toHaveBeenCalledWith();
    expect(apiClientSpy).toHaveBeenCalledWith("messages", {
      page: 1,
      type: "thread",
      threadID: 4,
    });
  });

  it("should fetch messages from IDB - inbox", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const idbSpy = spyOn(appMessaging["swManager"], "fetchMessages").and.returnValue(
      new Promise((resolve) => resolve({ messages: mockMessages, pages: 2 })),
    );

    fixture.detectChanges();

    appMessaging.fetchMessagesFromIdb().subscribe((response) => {
      expect(idbSpy).toHaveBeenCalledWith("forId", 4, 5, 1);
      expect(appMessaging.messages()).toEqual(mockMessages);
      expect(appMessaging.totalPages()).toBe(2);
      expect(response).toEqual({
        messages: mockMessages,
        total_pages: 2,
        current_page: 1,
        success: true,
      });
      done();
    });
  });

  it("should fetch messages from IDB - outbox", (done: DoneFn) => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "outbox" } as UrlSegment]);

    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const idbSpy = spyOn(appMessaging["swManager"], "fetchMessages").and.returnValue(
      new Promise((resolve) => resolve({ messages: mockMessages, pages: 2 })),
    );

    fixture.detectChanges();

    appMessaging.fetchMessagesFromIdb().subscribe((response) => {
      expect(idbSpy).toHaveBeenCalledWith("fromId", 4, 5, 1);
      expect(appMessaging.messages()).toEqual(mockMessages);
      expect(appMessaging.totalPages()).toBe(2);
      expect(response).toEqual({
        messages: mockMessages,
        total_pages: 2,
        current_page: 1,
        success: true,
      });
      done();
    });
  });

  it("should set the filter value to the thread ID if the message type is thread", (done: DoneFn) => {
    TestBed.inject(ActivatedRoute).url = of([
      { path: "thread" } as UrlSegment,
      { path: "2" } as UrlSegment,
    ]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    appMessaging.messType.set("thread");
    appMessaging.threadId.set(2);
    const idbSpy = spyOn(appMessaging["swManager"], "fetchMessages").and.returnValue(
      new Promise((resolve) => resolve({ messages: mockMessages, pages: 2 })),
    );

    fixture.detectChanges();

    appMessaging.fetchMessagesFromIdb().subscribe((response) => {
      expect(idbSpy).toHaveBeenCalledWith("threadID", 2, 5, 1);
      expect(appMessaging.messages()).toEqual(mockMessages);
      expect(appMessaging.totalPages()).toBe(2);
      expect(response).toEqual({
        messages: mockMessages,
        total_pages: 2,
        current_page: 1,
        success: true,
      });
      done();
    });
  });

  it("should fetch threads from the server", () => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    appMessaging.messType.set("threads");
    const idbFetchSpy = spyOn(appMessaging, "fetchThreadsFromIdb").and.returnValue(
      of({ messages: [], total_pages: 1, current_page: 1, success: true }),
    );
    const apiClientSpy = spyOn(appMessaging["apiClient"], "get").and.returnValue(
      of({ messages: mockThreads, total_pages: 2, current_page: 1, success: true }),
    );
    const swManagerSpy = spyOn(appMessaging["swManager"], "addFetchedItems");

    // before
    expect(appMessaging.userThreads()).toEqual([]);
    expect(appMessaging.totalPages()).toBe(1);
    expect(appMessaging.currentPage()).toBe(1);

    fixture.detectChanges();

    appMessaging.fetchThreads();

    // after
    expect(idbFetchSpy).toHaveBeenCalledWith();
    expect(apiClientSpy).toHaveBeenCalledWith("messages", {
      page: 1,
      type: "threads",
    });

    expect(appMessaging.userThreads()).toEqual(mockThreads);
    expect(appMessaging.totalPages()).toBe(2);
    expect(appMessaging.currentPage()).toBe(1);
    expect(swManagerSpy).toHaveBeenCalledWith("threads", mockThreads, "latestMessage");
  });

  it("should fetch threads from IDB", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const idbSpy = spyOn(appMessaging["swManager"], "queryThreads").and.returnValue(
      new Promise((resolve) => resolve({ messages: mockThreads, pages: 2 })),
    );
    fixture.detectChanges();

    appMessaging.fetchThreadsFromIdb().subscribe((response) => {
      expect(idbSpy).toHaveBeenCalledWith(1);
      expect(appMessaging.userThreads()).toEqual(mockThreads);
      expect(appMessaging.totalPages()).toBe(2);
      expect(response).toEqual({
        messages: mockThreads,
        total_pages: 2,
        current_page: 1,
        success: true,
      });
      done();
    });
  });

  it("should navigate to the next page - messages", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "inbox" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const fetchSpy = spyOn(appMessaging, "fetchMessages");
    appMessaging.messages.set(mockMessages);
    appMessaging.totalPages.set(2);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    appMessagingDOM.querySelectorAll(".nextButton")[0].click();
    fixture.detectChanges();

    expect(appMessaging.currentPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should navigate to the next page - threads", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "threads" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const fetchSpy = spyOn(appMessaging, "fetchThreads");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.totalPages.set(2);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    appMessagingDOM.querySelectorAll(".nextButton")[0].click();
    fixture.detectChanges();

    expect(appMessaging.currentPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should navigate to the previous page", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "inbox" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const fetchSpy = spyOn(appMessaging, "fetchMessages");
    appMessaging.messages.set(mockMessages);
    appMessaging.totalPages.set(2);
    appMessaging.currentPage.set(2);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    appMessagingDOM.querySelectorAll(".prevButton")[0].click();
    fixture.detectChanges();

    expect(appMessaging.currentPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  it("should navigate to the previous page - threads", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "threads" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const fetchSpy = spyOn(appMessaging, "fetchThreads");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.totalPages.set(2);
    appMessaging.currentPage.set(2);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    appMessagingDOM.querySelectorAll(".prevButton")[0].click();
    fixture.detectChanges();

    expect(appMessaging.currentPage()).toBe(1);
    expect(fetchSpy).toHaveBeenCalledWith();
  });

  // // Check that deleting all messages triggers the popup
  it("should trigger the popup upon deleting all", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "inbox" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    appMessaging.messages.set(mockMessages);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    // before the click
    expect(appMessaging.deleteMode()).toBeFalse();

    // trigger click
    appMessagingDOM.querySelectorAll(".deleteAll")[0].click();
    fixture.detectChanges();

    // after the click
    expect(appMessaging.deleteMode()).toBeTrue();
    expect(appMessaging.toDelete()).toBe("All inbox");
    expect(appMessaging.itemToDelete()).toBe(4);
    expect(appMessagingDOM.querySelector("item-delete-form")).toBeTruthy();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "inbox" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const changeSpy = spyOn(appMessaging, "changeMode").and.callThrough();
    appMessaging.messages.set(mockMessages);
    appMessaging.isIdbFetchLoading.set(false);

    // start the popup
    appMessaging.deleteMode.set(true);
    appMessaging.toDelete.set("Thread");
    appMessaging.itemToDelete.set(1);
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false);
    expect(appMessaging.deleteMode()).toBeFalse();
  });

  it("should update the message list post delete - single message", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "inbox" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateMessageList").and.callThrough();
    spyOn(appMessaging, "fetchMessages");
    appMessaging.messages.set(mockMessages);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css("app-single-message"))
      .componentInstance as MessageComponent;
    message.messageDeleted.emit(1);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(1);
    expect(appMessaging.messages().length).toBe(1);
    expect(appMessaging.messages()[0].id).not.toBe(1);
  });

  it("should update the message list post delete - single thread", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "Threads" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateMessageList").and.callThrough();
    spyOn(appMessaging, "fetchMessages");
    appMessaging.messType.set("threads");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isIdbFetchLoading.set(false);
    fixture.detectChanges();

    const thread = fixture.debugElement.query(By.css("app-single-thread"))
      .componentInstance as ThreadComponent;
    thread.messageDeleted.emit(3);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(3);
    expect(appMessaging.userThreads().length).toBe(0);
  });

  it("should update the message list post delete - all messages", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "inbox" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateMessageList").and.callThrough();
    spyOn(appMessaging, "fetchMessages");
    appMessaging.messages.set(mockMessages);
    appMessaging.isIdbFetchLoading.set(false);

    // start the popup
    appMessaging.deleteMode.set(true);
    appMessaging.toDelete.set("All inbox");
    appMessaging.itemToDelete.set(1);
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.deleted.emit(1);
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(1);
    expect(appMessaging.messages().length).toBe(0);
  });

  it("should update the message list post delete - all threads", () => {
    TestBed.inject(ActivatedRoute).url = of([{ path: "Threads" } as UrlSegment]);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateMessageList").and.callThrough();
    spyOn(appMessaging, "fetchMessages");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isIdbFetchLoading.set(false);

    // start the popup
    appMessaging.deleteMode.set(true);
    appMessaging.toDelete.set("All threads");
    appMessaging.itemToDelete.set(3);
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.deleted.emit(3);
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(3);
    expect(appMessaging.userThreads().length).toBe(0);
  });
});
