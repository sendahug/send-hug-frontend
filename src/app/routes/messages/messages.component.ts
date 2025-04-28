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
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { from, map, switchMap, tap } from "rxjs";
import { CommonModule } from "@angular/common";

// App-related imports
import { AuthService } from "@app/services/auth.service";
import { APIParams, type MessageType } from "@app/interfaces/types";
import { FullThread, ParsedThread } from "@app/interfaces/thread.interface";
import { type MessageGet } from "@app/interfaces/message.interface";
import { SWManager } from "@app/services/sWManager.service";
import { ApiClientService } from "@app/services/apiClient.service";
import { LoaderComponent } from "@common/loader/loader.component";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { MessageComponent } from "@app/components/messaging/message/message.component";
import { ThreadComponent } from "@app/components/messaging/thread/thread.component";
import { MessagesResponse, ThreadResponse } from "@app/interfaces/api";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrl: "./messages.component.less",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoaderComponent,
    ItemDeleteFormComponent,
    MessageComponent,
    ThreadComponent,
  ],
})
export class AppMessagesComponent {
  readonly messType = signal<MessageType>("inbox");
  readonly idbFilterAttribute = computed(() => {
    if (this.messType() == "thread") {
      return "threadID";
    } else if (this.messType() == "outbox") {
      return "fromId";
    } else {
      return "forId";
    }
  });
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly isLoading = signal(false);
  readonly isIdbFetchLoading = signal(false);
  readonly threadId = signal<number | undefined>(undefined);
  readonly messages = signal<MessageGet[]>([]);
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
  readonly previousPageButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentPage() <= 1,
  }));
  readonly nextPageButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.totalPages() <= this.currentPage(),
  }));
  // loader sub-component variable
  readonly loadingMessage = computed(() =>
    this.messType() == "threads" ? "Fetching threads..." : "Fetching messages...",
  );
  readonly loaderClass = computed(() =>
    !this.isIdbFetchLoading() && this.isLoading() ? "header" : "",
  );
  // edit popup sub-component variables
  readonly deleteMode = signal(false);
  readonly toDelete = signal<string | undefined>(undefined);
  readonly itemToDelete = signal<number | undefined>(undefined);

  // CTOR
  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    private swManager: SWManager,
    private apiClient: ApiClientService,
  ) {
    let messageType;
    this.threadId.set(Number(this.route.snapshot.paramMap.get("id")));
    this.currentPage.set(1);

    this.route.url.subscribe((params) => {
      messageType = params[0].path;
    });

    this.messType.set(messageType || "inbox");

    if ((this.messType() as MessageType) == "threads") {
      this.fetchThreads();
    } else {
      this.fetchMessages();
    }
  }

  /**
   * Fetches the messages to display from IDB and then
   * from the server.
   */
  fetchMessages() {
    this.isLoading.set(true);
    this.isIdbFetchLoading.set(true);

    const fetchFromIdb$ = this.fetchMessagesFromIdb();
    const fetchParams: APIParams = {
      page: this.currentPage(),
      type: this.messType(),
    };

    if (this.messType() == "thread") fetchParams["threadID"] = this.threadId()!;

    fetchFromIdb$
      .pipe(switchMap(() => this.apiClient.get<MessagesResponse>("messages", fetchParams)))
      .subscribe({
        next: (data) => {
          this.messages.set(data.messages);
          this.totalPages.set(data.total_pages);
          this.isLoading.set(false);
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
    const filterValue =
      this.messType() == "thread" ? this.threadId()! : this.authService.userData()!.id!;

    return from(
      this.swManager.fetchMessages(this.idbFilterAttribute(), filterValue, 5, this.currentPage()),
    ).pipe(
      tap((data) => {
        this.messages.set(data.messages);
        this.totalPages.set(data.pages);
        this.isIdbFetchLoading.set(false);
      }),
      map((data) => {
        return {
          messages: data.messages,
          total_pages: data.pages,
          current_page: this.currentPage(),
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
    this.isLoading.set(true);
    this.isIdbFetchLoading.set(true);

    const fetchFromIdb$ = this.fetchThreadsFromIdb();

    fetchFromIdb$
      .pipe(
        switchMap(() =>
          this.apiClient.get<ThreadResponse>("messages", {
            page: this.currentPage(),
            type: this.messType(),
          }),
        ),
      )
      .subscribe({
        next: (data) => {
          this.userThreads.set(data.messages);
          this.totalPages.set(data.total_pages);
          this.isLoading.set(false);
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
    return from(this.swManager.queryThreads(this.currentPage())).pipe(
      tap((data) => {
        this.userThreads.set(data.messages);
        this.totalPages.set(data.pages);
        this.isIdbFetchLoading.set(false);
      }),
      map((data) => {
        return {
          messages: data.messages,
          total_pages: data.pages,
          current_page: this.currentPage(),
          success: true,
        } as ThreadResponse;
      }),
    );
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of messages. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.currentPage.set(this.currentPage() + 1);
    if (this.messType() == "threads") {
      this.fetchThreads();
    } else {
      this.fetchMessages();
    }
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of messages. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.currentPage.set(this.currentPage() - 1);
    if (this.messType() == "threads") {
      this.fetchThreads();
    } else {
      this.fetchMessages();
    }
  }

  /*
  Function Name: deleteAllMessages()
  Function Description: Deletes all of the user's messages in a specific mailbox.
  Parameters: type (string) - The type of messages to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllMessages(type: string) {
    this.deleteMode.set(true);
    this.toDelete.set(`All ${type}`);
    this.itemToDelete.set(this.authService.userData()!.id);
  }

  /**
   * Deletes the deleted item once they've been deleted
   * in the backend.
   * @param deletedId the ID of the message deleted (if it's a single message)
   *                  of the user ID (if it's a 'clear mailbox' situation).
   */
  updateMessageList(deletedId: number) {
    if (this.messType().toLowerCase() == "threads") {
      this.userThreads.set(this.userThreads().filter((thread) => thread.id != deletedId));
    } else {
      this.messages.set(this.messages().filter((message) => message.id != deletedId));
    }
  }

  /**
   * Clears the current mailbox (and IndexedDB) once they've been deleted in the back-end.
   */
  clearMailbox() {
    if (this.messType().toLowerCase() == "threads") {
      this.userThreads.set([]);
      this.swManager.clearStore("messages");
      this.swManager.clearStore("threads");
    } else {
      this.messages.set([]);

      if (this.messType() == "inbox") {
        this.swManager.deleteItems("messages", "forId", this.authService.userData()!.id);
      } else if (this.messType() == "outbox") {
        this.swManager.deleteItems("messages", "fromId", this.authService.userData()!.id);
      }
    }
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the edit popup.
  Parameters: edit (boolean) - indicating whether edit mode should be active.
                               When the user finishes editing, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(edit: boolean) {
    this.deleteMode.set(edit);
  }
}
