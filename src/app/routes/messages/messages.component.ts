/*
	Messages Page
	Send a Hug Component
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

// Angular imports
import { Component, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { from, map, switchMap, tap } from "rxjs";
import { CommonModule } from "@angular/common";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

// App-related imports
import { AuthService } from "@app/services/auth.service";
import { APIParams } from "@app/interfaces/types";
import { FullThread, ParsedThread } from "@app/interfaces/thread.interface";
import { type MessageGet } from "@app/interfaces/message.interface";
import { SWManager } from "@app/services/sWManager.service";
import { ApiClientService } from "@app/services/apiClient.service";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { MessageComponent } from "@app/components/messaging/message/message.component";
import { ThreadComponent } from "@app/components/messaging/thread/thread.component";
import { MessagesResponse, ThreadResponse } from "@app/interfaces/api";
import { PaginatedListComponent } from "@app/components/common/paginatedList/paginatedList.component";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrl: "./messages.component.less",
  standalone: true,
  imports: [
    CommonModule,
    ItemDeleteFormComponent,
    MessageComponent,
    ThreadComponent,
    PaginatedListComponent,
    FontAwesomeModule,
  ],
})
export class AppMessagesComponent {
  readonly idbFilterAttribute = signal<"threadID">("threadID");
  readonly threadId = signal<number | undefined>(undefined);
  readonly selectedThread = computed<FullThread | undefined>(
    () => this.userThreads().find((thread) => thread.id === this.threadId()) || undefined,
  );
  readonly threadTitle = computed(
    () =>
      this.userThreadsFormatted().find((thread) => thread.id === this.threadId())?.user.displayName,
  );
  // Messages
  readonly messages = signal<MessageGet[]>([]);
  readonly currentMessagesPage = signal(1);
  readonly totalMessagesPages = signal(1);
  readonly isMessagesLoading = signal(false);
  readonly isMessagesIdbFetchLoading = signal(false);
  // Threads
  readonly userThreads = signal<FullThread[]>([]);
  readonly userThreadsFormatted = computed<ParsedThread[]>(() => {
    return this.userThreads().map((thread: FullThread) => {
      return {
        id: thread.id,
        user: thread.user1Id == this.authService.userData()!.id ? thread.user2 : thread.user1,
        userID: thread.user1Id == this.authService.userData()!.id ? thread.user2Id : thread.user1Id,
        numMessages: thread.numMessages,
        latestMessage: thread.latestMessage,
      };
    });
  });
  readonly currentThreadsPage = signal(1);
  readonly totalThreadsPages = signal(1);
  readonly isThreadsLoading = signal(false);
  readonly isThreadsIdbFetchLoading = signal(false);
  readonly threadsListClass = computed(() => ({
    threadOpen: this.threadId(),
  }));
  readonly messagesContainerClass = computed(() => ({
    mailboxMessages: true,
    hidden: !this.threadId(),
  }));
  // delete all sub-component variables
  readonly deleteMode = signal(false);
  readonly deleteEndpoint = signal(`messages/threads`);
  readonly itemType = signal<"Thread">("Thread");
  readonly faChevronLeft = faChevronLeft;

  // CTOR
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private swManager: SWManager,
    private apiClient: ApiClientService,
  ) {
    const threadsPage = this.route.snapshot.queryParamMap.get("threadsPage");
    this.currentThreadsPage.set(Number(threadsPage) || 1);
    const messagesPage = this.route.snapshot.queryParamMap.get("messagesPage");
    this.currentMessagesPage.set(Number(messagesPage) || 1);
    this.fetchThreads();

    // Check if a thread ID is set in the parameters; if so, fetch the thread
    const threadId = this.route.snapshot.queryParamMap.get("threadId");

    if (threadId && Number(threadId)) {
      this.threadId.set(Number(threadId));
      this.fetchMessages();
    } else {
      this.threadId.set(undefined);
    }
  }

  /**
   * Fetches the messages to display from IDB and then
   * from the server.
   */
  fetchMessages() {
    this.isMessagesLoading.set(true);
    this.isMessagesIdbFetchLoading.set(true);

    const fetchFromIdb$ = this.fetchMessagesFromIdb();
    const fetchParams: APIParams = {
      page: this.currentMessagesPage(),
      type: "thread",
      threadID: this.threadId()!,
    };

    fetchFromIdb$
      .pipe(switchMap(() => this.apiClient.get<MessagesResponse>("messages", fetchParams)))
      .subscribe({
        next: (data) => {
          this.messages.set(data.messages);
          this.totalMessagesPages.set(data.total_pages);
          this.isMessagesLoading.set(false);
          this.swManager.addFetchedItems<MessageGet>("messages", [...data.messages], "date");
        },
      });
  }

  /**
   * Generates the observable for fetching the data from IndexedDB.
   * @returns an observable that handles fetching
   *          messages from IndexedDB and transforming them.
   */
  fetchMessagesFromIdb() {
    return from(
      this.swManager.fetchMessages(
        this.idbFilterAttribute(),
        this.threadId()!,
        5,
        this.currentMessagesPage(),
      ),
    ).pipe(
      tap((data) => {
        this.messages.set(data.messages);
        this.totalMessagesPages.set(data.pages);
        this.isMessagesIdbFetchLoading.set(false);
      }),
      map((data) => {
        return {
          messages: data.messages,
          total_pages: data.pages,
          current_page: this.currentMessagesPage(),
          success: true,
        } as MessagesResponse;
      }),
    );
  }

  /**
   * Fetches the threads to display from IDB and then
   * from the server.
   */
  fetchThreads() {
    this.isThreadsLoading.set(true);
    this.isThreadsIdbFetchLoading.set(true);

    const fetchFromIdb$ = this.fetchThreadsFromIdb();

    fetchFromIdb$
      .pipe(
        switchMap(() =>
          this.apiClient.get<ThreadResponse>("messages", {
            page: this.currentThreadsPage(),
            type: "threads",
          }),
        ),
      )
      .subscribe({
        next: (data) => {
          this.userThreads.set(data.messages);
          this.totalThreadsPages.set(data.total_pages);
          this.isThreadsLoading.set(false);
          this.swManager.addFetchedItems<FullThread>(
            "threads",
            [...data.messages],
            "latestMessage",
          );
        },
      });
  }

  /**
   * Generates the observable for fetching the data from IndexedDB.
   * @returns an observable that handles fetching
   *          threads from IndexedDB and transforming them.
   */
  fetchThreadsFromIdb() {
    return from(this.swManager.queryThreads(this.currentThreadsPage())).pipe(
      tap((data) => {
        this.userThreads.set(data.messages);
        this.totalThreadsPages.set(data.pages);
        this.isThreadsIdbFetchLoading.set(false);
      }),
      map((data) => {
        return {
          messages: data.messages,
          total_pages: data.pages,
          current_page: this.currentThreadsPage(),
          success: true,
        } as ThreadResponse;
      }),
    );
  }

  /**
   * Updates the current page of messages or threads to the
   * value given by the paginated list component.
   * @param page the page to set as current page
   * @param type the type of items to update the page for (threads/thread)
   */
  updateCurrentPage(page: number, type: "thread" | "threads") {
    const queryParams: {
      threadsPage?: number;
      messagesPage?: number;
      threadId?: number;
    } = {};

    if (type == "thread") {
      this.currentMessagesPage.set(page);
      queryParams["messagesPage"] = page;
      queryParams["threadId"] = this.threadId();
      this.fetchMessages();
    } else {
      this.currentThreadsPage.set(page);
      queryParams["threadsPage"] = page;
      this.fetchThreads();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true,
    });
  }

  /**
   * Deletes all of the user's messages in a specific mailbox.
   */
  deleteAllMessages() {
    this.deleteMode.set(true);
  }

  /**
   * Deletes the deleted item once they've been deleted
   * in the backend.
   * @param deletedId the ID of the message deleted (if it's a single message)
   *                  of the user ID (if it's a 'clear mailbox' situation).
   */
  updateMessageList(deletedId: number, type: "thread" | "threads") {
    if (type === "threads") {
      this.userThreads.set(this.userThreads().filter((thread) => thread.id != deletedId));
    } else {
      this.messages.set(this.messages().filter((message) => message.id != deletedId));
    }
  }

  /**
   * Clears the current mailbox (and IndexedDB) once they've been deleted in the back-end.
   */
  clearMailbox() {
    this.userThreads.set([]);
    this.swManager.clearStore("messages");
    this.swManager.clearStore("threads");
  }

  /**
   * Remove the edit popup.
   * @param edit indicating whether edit mode should be active.
   *             When the user finishes editing, the event emitter
   *             in the popup component sends 'false' to this function
   *             to remove the popup.
   */
  changeMode(edit: boolean) {
    this.deleteMode.set(edit);
  }

  /**
   * Fetch the messages in the given thread.
   * @param threadId the ID of the thread fo fetch.
   */
  showThread(threadId: number) {
    const queryParams: {
      threadsPage?: number;
      threadId: number;
    } = {
      threadId,
    };

    if (this.currentThreadsPage() != 1) queryParams["threadsPage"] = this.currentThreadsPage();

    this.threadId.set(threadId);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
    this.fetchMessages();
  }

  /**
   * Closes the currently open thread and returns to the threads list.
   */
  closeThread() {
    const queryParams: {
      threadsPage?: number;
    } = {};

    if (this.currentThreadsPage() != 1) queryParams["threadsPage"] = this.currentThreadsPage();

    this.threadId.set(undefined);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }
}
