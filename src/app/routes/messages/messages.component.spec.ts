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
  ActivatedRoute,
  provideRouter,
  RouterLink,
  withComponentInputBinding,
} from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppMessagesComponent } from "./messages.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { FullThread } from "@app/interfaces/thread.interface";
import { type MessageGet } from "@app/interfaces/message.interface";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { ApiClientService } from "@app/services/apiClient.service";
import { LoaderComponent } from "@common/loader/loader.component";
import { MessageComponent } from "@app/components/messaging/message/message.component";
import { ThreadComponent } from "@app/components/messaging/thread/thread.component";
import { PaginatedListComponent } from "@app/components/common/paginatedList/paginatedList.component";
import { MockItemDeleteFormComponent } from "@tests/mockForms";
import { SWManager } from "@app/services/sWManager.service";

describe("AppMessagesComponent", () => {
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
    const MockSWManager = MockProvider(SWManager, {
      fetchMessages: () => new Promise((resolve) => resolve({ messages: [], pages: 1 })),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MockItemDeleteFormComponent,
        LoaderComponent,
        ThreadComponent,
        RouterLink,
        CommonModule,
        AppMessagesComponent,
        MessageComponent,
        PaginatedListComponent,
        FontAwesomeModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter(
          [
            {
              path: "messages",
              component: AppMessagesComponent,
              data: {
                name: "Mailbox",
                mapRoutes: [{ path: "threads", name: "Threads" }],
              },
            },
          ],
          withComponentInputBinding(),
        ),
        MockAuthService,
        MockAPIClient,
        MockSWManager,
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
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging).toBeTruthy();
  });

  // Check that the popup variables are set to false
  it("should have all popup variables set to false", () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging.deleteMode()).toBeFalse();
  });

  it("should fetch threads from the server when mounted", () => {
    const threadsFetchSpy = spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging.currentThreadsPage()).toBe(1);
    expect(appMessaging.currentMessagesPage()).toBe(1);
    expect(threadsFetchSpy).toHaveBeenCalledWith();
  });

  it("should set default pages and thread ID if the query parameters aren't provided", async () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, "get").and.callFake((name) => {
      if (name === "threadsPage") {
        return null;
      } else if (name == "messagesPage") {
        return null;
      } else {
        return null;
      }
    });
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    await fixture.whenStable();

    expect(appMessaging.currentMessagesPage()).toBe(1);
    expect(appMessaging.currentThreadsPage()).toBe(1);
    expect(appMessaging.threadId()).toBe(undefined);
    expect(appMessaging.userThreads()).toEqual([]);
  });

  it("should set pages and thread ID based on the query parameters", async () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, "get").and.callFake((name) => {
      if (name === "threadsPage") {
        return "2";
      } else if (name == "messagesPage") {
        return "2";
      } else {
        return "4";
      }
    });
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    spyOn(AppMessagesComponent.prototype, "fetchMessages");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    await fixture.whenStable();

    expect(appMessaging.currentMessagesPage()).toBe(2);
    expect(appMessaging.currentThreadsPage()).toBe(2);
    expect(appMessaging.threadId()).toBe(4);
  });

  it("should fetch threads from the server on load", async () => {
    const apiClient = TestBed.inject(ApiClientService);
    const apiClientSpy = spyOn(apiClient, "get").and.returnValue(
      of({ messages: mockThreads, total_pages: 2, current_page: 1, success: true }),
    );
    const swManager = TestBed.inject(SWManager);
    const swManagerSpy = spyOn(swManager, "addFetchedItems");
    const idbFetchSpy = spyOn(
      AppMessagesComponent.prototype,
      "fetchThreadsFromIdb",
    ).and.returnValue(of({ messages: [], total_pages: 1, current_page: 1, success: true }));

    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    await fixture.whenStable();

    // after
    expect(idbFetchSpy).toHaveBeenCalledWith();
    expect(apiClientSpy).toHaveBeenCalledWith("threads", {
      page: 1,
    });

    expect(appMessaging.userThreads()).toEqual(mockThreads);
    expect(appMessaging.totalThreadsPages()).toBe(2);
    expect(appMessaging.currentThreadsPage()).toBe(1);
    expect(swManagerSpy).toHaveBeenCalledWith("threads", mockThreads, "latestMessage");
  });

  it("should fetch threads from IDB", (done: DoneFn) => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const idbSpy = spyOn(appMessaging["swManager"], "queryThreads").and.returnValue(
      new Promise((resolve) => resolve({ messages: mockThreads, pages: 2 })),
    );

    appMessaging.fetchThreadsFromIdb().subscribe((response) => {
      expect(idbSpy).toHaveBeenCalledWith(1);
      expect(appMessaging.userThreads()).toEqual(mockThreads);
      expect(appMessaging.totalThreadsPages()).toBe(2);
      expect(response).toEqual({
        messages: mockThreads,
        total_pages: 2,
        current_page: 1,
        success: true,
      });
      done();
    });
  });

  it("API messages fetch - should add the thread ID param to the fetch if the message type is thread", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    appMessaging.threadId.set(4);
    const idbFetchSpy = spyOn(appMessaging, "fetchMessagesFromIdb").and.returnValue(
      of({ messages: [], total_pages: 1, current_page: 1, success: true }),
    );
    const apiClientSpy = spyOn(appMessaging["apiClient"], "get").and.returnValue(
      of({ messages: mockMessages, total_pages: 2, current_page: 1, success: true }),
    );
    await fixture.whenStable();

    expect(appMessaging.currentMessagesPage()).toBe(1);
    expect(appMessaging.totalMessagesPages()).toBe(1);

    appMessaging.fetchMessages();
    await fixture.whenStable();

    expect(idbFetchSpy).toHaveBeenCalledWith();
    expect(apiClientSpy).toHaveBeenCalledWith("messages", {
      page: 1,
      threadID: 4,
    });

    expect(appMessaging.currentMessagesPage()).toBe(1);
    expect(appMessaging.totalMessagesPages()).toBe(2);
  });

  it("IDB messages fetch - should set the filter value to the thread ID if the message type is thread", (done: DoneFn) => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    appMessaging.threadId.set(2);
    const idbSpy = spyOn(appMessaging["swManager"], "fetchMessages").and.returnValue(
      new Promise((resolve) => resolve({ messages: mockMessages, pages: 2 })),
    );

    appMessaging.fetchMessagesFromIdb().subscribe((response) => {
      expect(idbSpy).toHaveBeenCalledWith("threadID", 2, 5, 1);
      expect(appMessaging.messages()).toEqual(mockMessages);
      expect(appMessaging.totalMessagesPages()).toBe(2);
      expect(response).toEqual({
        messages: mockMessages,
        total_pages: 2,
        current_page: 1,
        success: true,
      });
      done();
    });
  });

  it("should update the current page and re-fetch messages - messages", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const fetchSpy = spyOn(appMessaging, "fetchMessages");
    const updateSpy = spyOn(appMessaging, "updateCurrentPage").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.threadId.set(2);
    appMessaging.messages.set(mockMessages);
    appMessaging.totalMessagesPages.set(2);
    appMessaging.isMessagesIdbFetchLoading.set(false);
    await fixture.whenStable();

    const paginatedList = fixture.debugElement.query(By.css("app-paginated-list#messagesList"))
      .componentInstance as PaginatedListComponent;
    paginatedList.pageChange.emit(2);
    await fixture.whenStable();

    expect(updateSpy).toHaveBeenCalledWith(2, "thread");
    expect(appMessaging.currentMessagesPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {
          threadId: 2,
          messagesPage: 2,
        },
      }),
    );
  });

  it("should update the current page and re-fetch messages - threads", async () => {
    const fetchSpy = spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateCurrentPage").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.totalThreadsPages.set(2);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    await fixture.whenStable();

    const paginatedList = fixture.debugElement.query(By.css("app-paginated-list#threadsList"))
      .componentInstance as PaginatedListComponent;
    paginatedList.pageChange.emit(2);
    await fixture.whenStable();

    expect(updateSpy).toHaveBeenCalledWith(2, "threads");
    expect(appMessaging.currentThreadsPage()).toBe(2);
    expect(fetchSpy).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {
          threadsPage: 2,
        },
      }),
    );
  });

  it("should trigger the popup upon deleting all - threads", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    await fixture.whenStable();

    // before the click
    expect(appMessaging.deleteMode()).toBeFalse();

    // trigger click
    appMessagingDOM.querySelectorAll(".deleteAll")[0].click();
    await fixture.whenStable();

    // after the click
    expect(appMessaging.deleteMode()).toBeTrue();
    expect(appMessaging.deleteEndpoint()).toBe("threads");
    expect(appMessaging.itemType()).toBe("Thread");
    expect(appMessagingDOM.querySelector("item-delete-form")).toBeTruthy();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const changeSpy = spyOn(appMessaging, "changeMode").and.callThrough();
    appMessaging.messages.set(mockMessages);
    appMessaging.isMessagesIdbFetchLoading.set(false);

    // start the popup
    appMessaging.deleteMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.editMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false);
    expect(appMessaging.deleteMode()).toBeFalse();
  });

  it("should update the message list post delete - single message", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    spyOn(AppMessagesComponent.prototype, "fetchMessages");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateMessageList").and.callThrough();
    appMessaging.messages.set(mockMessages);
    appMessaging.isMessagesIdbFetchLoading.set(false);
    appMessaging.threadId.set(4);
    await fixture.whenStable();

    const message = fixture.debugElement.query(By.css("app-single-message"))
      .componentInstance as MessageComponent;
    message.messageDeleted.emit(1);
    await fixture.whenStable();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(1, "thread");
    expect(appMessaging.messages().length).toBe(1);
    expect(appMessaging.messages()[0].id).not.toBe(1);
  });

  it("should update the message list post delete - single thread", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "updateMessageList").and.callThrough();
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    await fixture.whenStable();

    const thread = fixture.debugElement.query(By.css("app-single-thread"))
      .componentInstance as ThreadComponent;
    thread.messageDeleted.emit(3);
    await fixture.whenStable();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(3, "threads");
    expect(appMessaging.userThreads().length).toBe(0);
  });

  it("should update the message list post delete - all threads", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const updateSpy = spyOn(appMessaging, "clearMailbox").and.callThrough();
    const deleteSpy = spyOn(appMessaging["swManager"], "clearStore");
    const closeThreadSpy = spyOn(appMessaging, "closeThread");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);

    // start the popup
    appMessaging.deleteMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.deleted.emit(3);
    popup.editMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith();
    expect(deleteSpy.calls.first().args).toEqual(["messages"]);
    expect(deleteSpy.calls.mostRecent().args).toEqual(["threads"]);
    expect(appMessaging.userThreads().length).toBe(0);
    expect(closeThreadSpy).toHaveBeenCalledTimes(1);
    expect(appMessaging.currentThreadsPage()).toBe(1);
  });

  /** @todo This one is more of an integration test, isn't it? Probably better off in e2e. */
  it("should show the selected thread", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const messagesFetchSpy = spyOn(appMessaging, "fetchMessages");
    const showThreadSpy = spyOn(appMessaging, "showThread").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    await fixture.whenStable();

    appMessagingDOM.querySelectorAll(".viewButton")[0].click();

    expect(showThreadSpy).toHaveBeenCalledWith(3);
    expect(appMessaging.threadId()).toBe(3);
    expect(messagesFetchSpy).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {
          threadId: 3,
        },
      }),
    );
  });

  it("should preserve threads page query param if it's not 1", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const messagesFetchSpy = spyOn(appMessaging, "fetchMessages");
    const showThreadSpy = spyOn(appMessaging, "showThread").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    appMessaging.totalThreadsPages.set(2);
    appMessaging.currentThreadsPage.set(2);
    await fixture.whenStable();

    appMessagingDOM.querySelectorAll(".viewButton")[0].click();

    expect(showThreadSpy).toHaveBeenCalledWith(3);
    expect(appMessaging.threadId()).toBe(3);
    expect(messagesFetchSpy).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {
          threadId: 3,
          threadsPage: 2,
        },
      }),
    );
  });

  it("should close the thread and reset the thread ID", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    spyOn(AppMessagesComponent.prototype, "fetchMessages");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const closeThreadSpy = spyOn(appMessaging, "closeThread").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    appMessaging.threadId.set(3);
    appMessaging.currentThreadsPage.set(2);
    appMessaging.totalThreadsPages.set(2);
    await fixture.whenStable();

    appMessagingDOM.querySelector(".messagesLink").click();

    expect(closeThreadSpy).toHaveBeenCalledWith();
    expect(appMessaging.threadId()).toBe(undefined);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {
          threadsPage: 2,
        },
      }),
    );
  });

  it("should close the thread and reset the query parameters if the page is 1", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    spyOn(AppMessagesComponent.prototype, "fetchMessages");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const closeThreadSpy = spyOn(appMessaging, "closeThread").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    appMessaging.threadId.set(3);
    appMessaging.currentThreadsPage.set(1);
    appMessaging.totalThreadsPages.set(2);
    await fixture.whenStable();

    appMessagingDOM.querySelector(".messagesLink").click();

    expect(closeThreadSpy).toHaveBeenCalledWith();
    expect(appMessaging.threadId()).toBe(undefined);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {},
      }),
    );
  });

  it("should close the thread and reset the thread ID when clicking the back button", async () => {
    spyOn(AppMessagesComponent.prototype, "fetchThreads");
    spyOn(AppMessagesComponent.prototype, "fetchMessages");
    const fixture = TestBed.createComponent(AppMessagesComponent);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    const closeThreadSpy = spyOn(appMessaging, "closeThread").and.callThrough();
    const navigateSpy = spyOn(appMessaging["router"], "navigate");
    appMessaging.userThreads.set(mockThreads);
    appMessaging.isThreadsIdbFetchLoading.set(false);
    appMessaging.threadId.set(3);
    appMessaging.currentThreadsPage.set(2);
    appMessaging.totalThreadsPages.set(2);
    await fixture.whenStable();

    appMessagingDOM.querySelector(".textlessButton").click();

    expect(closeThreadSpy).toHaveBeenCalledWith();
    expect(appMessaging.threadId()).toBe(undefined);
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {
          threadsPage: 2,
        },
      }),
    );
  });
});
