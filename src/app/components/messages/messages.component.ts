/*
	Messages Page
	Send a Hug Component
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

// Angular imports
import { Component, OnInit, AfterViewChecked, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { from, map, switchMap, tap } from "rxjs";

// App-related imports
import { AuthService } from "@app/services/auth.service";
import { iconElements, MessageType } from "@app/interfaces/types";
import { FullThread, ParsedThread } from "@app/interfaces/thread.interface";
import { UserIconColours } from "@app/interfaces/user.interface";
import { Message } from "@app/interfaces/message.interface";
import { SWManager } from "@app/services/sWManager.service";
import { ApiClientService } from "@app/services/apiClient.service";

interface MessagesResponse {
  success: boolean;
  messages: Message[];
  total_pages: number;
  current_page: number;
}

interface ThreadResponse {
  success: boolean;
  messages: FullThread[];
  total_pages: number;
  current_page: number;
}

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
})
export class AppMessaging implements OnInit, AfterViewChecked {
  messType: MessageType = "inbox";
  idbFilterAttribute = computed(() => {
    if (this.messType == "thread") {
      return "threadID";
    } else if (this.messType == "outbox") {
      return "fromId";
    } else {
      return "forId";
    }
  });
  currentPage = signal(1);
  totalPages = signal(1);
  isLoading = signal(false);
  isIdbFetchLoading = signal(false);
  threadId?: number;
  messages = signal<Message[]>([]);
  userThreads = signal<FullThread[]>([]);
  userThreadsFormatted = computed<ParsedThread[]>(() => {
    return this.userThreads().map((thread: FullThread) => {
      return {
        id: thread.id,
        user: thread.user1Id == this.authService.userData.id ? thread.user2 : thread.user1,
        userID: thread.user1Id == this.authService.userData.id ? thread.user2Id : thread.user1Id,
        numMessages: thread.numMessages,
        latestMessage: thread.latestMessage,
      };
    });
  });
  previousPageButtonClass = computed(() => ({
    "appButton prevButton": true,
    disabled: this.currentPage() <= 1,
  }));
  nextPageButtonClass = computed(() => ({
    "appButton nextButton": true,
    disabled: this.totalPages() <= this.currentPage(),
  }));
  // loader sub-component variable
  waitFor = `${this.messType} messages`;
  // edit popup sub-component variables
  postToEdit: any;
  editType: string | undefined;
  editMode: boolean;
  delete: boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  lastFocusedElement: any;

  // CTOR
  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    private swManager: SWManager,
    private apiClient: ApiClientService,
  ) {
    let messageType;
    this.threadId = Number(this.route.snapshot.paramMap.get("id"));
    this.editMode = false;
    this.delete = false;
    this.currentPage.set(1);

    this.route.url.subscribe((params) => {
      messageType = params[0].path;
    });

    if (messageType) {
      this.messType = messageType;
      this.waitFor = `${this.messType} messages`;
    } else {
      this.messType = "inbox";
    }

    // subscribe to the subject following user data
    this.authService.isUserDataResolved.subscribe((value) => {
      // if the value is true, user data has been fetched, so the app can
      // now fetch the user's messages
      if (value == true) {
        if (this.messType == "threads") {
          this.fetchThreads();
        } else {
          this.fetchMessages();
        }
      }
    });
  }

  ngOnInit() {}

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is checked by Angular. It updates the user's icon according to the colours
                        chosen by the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    // wait for the DOM to load
    if (document.querySelectorAll(".userIcon")[0]) {
      // If it's the threads mailbox, get the icon details of the other user in the thread
      if (this.messType == "threads") {
        this.userThreadsFormatted().forEach((thread: ParsedThread) => {
          this.setUpUserIcon(thread.id, thread.user.iconColours);
        });
      } else {
        this.messages().forEach((message: any) => {
          switch (this.messType) {
            // If it's the inbox, get the the icon details of the user sending the message
            case "inbox" || "thread":
              this.setUpUserIcon(message.id, message.from.iconColours);
              break;
            // If it's the outbox, get the icon details of the user for which the message is meant
            case "outbox":
              this.setUpUserIcon(message.id, message.for.iconColours);
              break;
          }
        });
      }
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
    const fetchParams: { [key: string]: any } = {
      page: this.currentPage(),
      userID: this.authService.userData.id!,
      type: this.messType,
    };

    if (this.messType == "thread") fetchParams["threadID"] = this.threadId!;

    fetchFromIdb$
      .pipe(switchMap(() => this.apiClient.get<MessagesResponse>("messages", fetchParams)))
      .subscribe({
        next: (data) => {
          this.messages.set(data.messages);
          this.totalPages.set(data.total_pages);
          this.isLoading.set(false);
          this.swManager.addFetchedItems("messages", [...data.messages], "date");
        },
      });
  }

  /**
   * Generates the observable for fetching the data from IndexedDB.
   * @returns an observable that handles fetching
   *          messages from IndexedDB and transforming them.
   */
  fetchMessagesFromIdb() {
    const filterValue = this.messType == "thread" ? this.threadId! : this.authService.userData.id!;

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
            userID: this.authService.userData.id!,
            type: this.messType,
          }),
        ),
      )
      .subscribe({
        next: (data) => {
          this.userThreads.set(data.messages);
          this.totalPages.set(data.total_pages);
          this.isLoading.set(false);
          this.swManager.addFetchedItems("threads", [...data.messages], "latestMessage");
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

  /**
   * Updates the user's icon with the right colours
   * @param messageId the ID of the message
   * @param userIconColours the user's icon colours
   */
  setUpUserIcon(messageId: number, userIconColours: UserIconColours) {
    Object.keys(userIconColours).forEach((key) => {
      document
        .querySelectorAll(`#${this.messType}${messageId} .userIcon`)[0]
        .querySelectorAll(`.${key as iconElements}`)
        .forEach((element) => {
          (element as SVGPathElement).setAttribute(
            "style",
            `fill:${userIconColours[key as iconElements]};`,
          );
        });
    });
  }

  /*
  Function Name: login()
  Function Description: Activates Auth0 login via the authentication service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  login() {
    this.authService.login();
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a specific message from the user's messages, via
                        the items service.
  Parameters: messageID (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageID: number) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = "Message";
    this.itemToDelete = messageID;
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
    if (this.messType == "threads") {
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
    if (this.messType == "threads") {
      this.fetchThreads();
    } else {
      this.fetchMessages();
    }
  }

  /*
  Function Name: changeMailbox()
  Function Description: Changes the currently active mailbox (inbox or outbox).
  Parameters: newType (string) - The mailbox to change to.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMailbox(newType: string) {
    // if the user was looking at a specific thread, to get the mailbox type
    // we need to go two levels up
    if (this.messType == "thread") {
      this.router.navigate(["../../" + newType], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
    // otherwise we need to go one level up to change mailbox
    else {
      this.router.navigate(["../" + newType], {
        relativeTo: this.route,
        replaceUrl: true,
      });
    }
  }

  /*
  Function Name: loadThread()
  Function Description: Shows the messages for the specific thread.
  Parameters: threadId (number) - The thread to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  loadThread(threadId: number) {
    this.router.navigate(["../thread/" + threadId], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  /*
  Function Name: deleteThread()
  Function Description: Deletes a thread and all of its messages
  Parameters: threadId (number) - The thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId: number) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = "Thread";
    this.itemToDelete = threadId;
  }

  /*
  Function Name: deleteAllMessages()
  Function Description: Deletes all of the user's messages in a specific mailbox.
  Parameters: type (string) - The type of messages to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllMessages(type: string) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = `All ${type}`;
    this.itemToDelete = this.authService.userData.id;
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
    this.editMode = edit;
    this.lastFocusedElement.focus();
  }
}
