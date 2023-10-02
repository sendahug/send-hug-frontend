/*
	Items Service
	Send a Hug Service
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
import { Injectable, WritableSignal, computed, signal } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

// App-related imports
import { Post } from "../interfaces/post.interface";
import { Message } from "../interfaces/message.interface";
import { FullThread } from "../interfaces/thread.interface";
import { OtherUser } from "../interfaces/otherUser.interface";
import { Report } from "../interfaces/report.interface";
import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { SWManager } from "./sWManager.service";
import { environment } from "../../environments/environment";
import { MessageType } from "../interfaces/types";

type FetchStamp = {
  source: "Server" | "IDB" | "";
  date: number;
};


@Injectable({
  providedIn: "root",
})
export class ItemsService {
  readonly serverUrl = environment.backend.domain;
  // User variables
  otherUserData: OtherUser = {
    id: 0,
    displayName: "",
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    role: "",
    selectedIcon: "kitty",
    iconColours: {
      character: "",
      lbg: "",
      rbg: "",
      item: "",
    },
  };
  isOtherUser = false;
  isOtherUserResolved = new BehaviorSubject(false);
  previousUser: number = 0;
  // User messages variables
  activeThread = 0;
  userMessages: Message[] = [];
  userThreads: WritableSignal<FullThread[]> = signal([]);
  userThreadsFormatted = computed(() => {
    return this.userThreads().map((thread: FullThread) => {
      return {
        id: thread.id,
        user:
        thread.user1Id == this.authService.userData.id
            ? thread.user2
            : thread.user1,
        userID:
        thread.user1Id == this.authService.userData.id ? thread.user2Id : thread.user1Id,
        numMessages: thread.numMessages,
        latestMessage: thread.latestMessage,
      };
    });
  });
  currentMessagesPage = 1;
  totalMessagesPages = 1;
  isMessagesResolved = new BehaviorSubject(false);
  isMessagesIdbResolved = new BehaviorSubject(false);
  lastFetchTarget?: MessageType;
  lastFetchSource: "Server" | "IDB" | "" = "";
  lastFetchDate: number = 0;
  // search variables
  isSearching = false;
  userSearchResults: OtherUser[] = [];
  numUserResults = 0;
  numPostResults = 0;
  postSearchResults: Post[] = [];
  postSearchPage = 1;
  totalPostSearchPages = 1;
  isSearchResolved = new BehaviorSubject(false);
  // idb variables
  idbResolved = {
    user: new BehaviorSubject(false),
    userPosts: new BehaviorSubject(false),
  };
  // latest fetch
  lastFetched: { [key: string]: FetchStamp } = {
    userPostsself: {
      source: "",
      date: 0,
    },
    userPostsother: {
      source: "",
      date: 0,
    },
  };

  // CTOR
  constructor(
    private Http: HttpClient,
    private authService: AuthService,
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
  ) {}

  // POST-RELATED METHODS
  // ==============================================================
  /*
  Function Name: sendUserHug()
  Function Description: Send a hug to a user.
  Parameters: userID (number) - the ID of the user.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendUserHug(userID: number) {
    const Url = this.serverUrl + `/users/all/${userID}/hugs`;
    // update the users' data
    this.otherUserData.receivedHugs += 1;
    this.authService.userData.givenHugs += 1;

    this.Http.post(
      Url,
      {},
      {
        headers: this.authService.authHeader,
      },
    ).subscribe({
      next: (_response: any) => {
        this.alertsService.createSuccessAlert("Your hug was sent!", true);
        this.alertsService.toggleOfflineAlert();
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  // USER-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getUser()
  Function Description: Gets the data of a specific user.
  Parameters: userID (number) - the ID of the user to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getUser(userID: number) {
    const Url = this.serverUrl + `/users/all/${userID}`;
    if (this.previousUser != 0 && this.previousUser != userID) {
      this.otherUserData = {
        id: 0,
        displayName: "",
        receivedHugs: 0,
        givenHugs: 0,
        postsNum: 0,
        role: "",
        selectedIcon: "kitty",
        iconColours: {
          character: "",
          lbg: "",
          rbg: "",
          item: "",
        },
      };
      this.isOtherUserResolved.next(false);
      this.idbResolved.user.next(false);
    }

    // get the user's data from IDB
    this.serviceWorkerM.queryUsers(userID)?.then((data: any) => {
      // if the user's data exists in the IDB database
      if (data) {
        this.otherUserData = data;
        this.idbResolved.user.next(true);
      }
    });

    // try to get the user's data from the server
    this.Http.get(Url, {
      headers: this.authService.authHeader,
    }).subscribe({
      next: (response: any) => {
        let user = response.user;
        this.otherUserData = {
          id: user.id,
          displayName: user.displayName,
          receivedHugs: user.receivedH,
          givenHugs: user.givenH,
          role: user.role,
          postsNum: user.posts,
          selectedIcon: user.selectedIcon,
          iconColours: {
            character: user.iconColours.character,
            lbg: user.iconColours.lbg,
            rbg: user.iconColours.rbg,
            item: user.iconColours.item,
          },
        };
        this.isOtherUserResolved.next(true);
        this.idbResolved.user.next(true);
        this.alertsService.toggleOfflineAlert();

        // adds the user's data to the users store
        this.serviceWorkerM.addItem("users", this.otherUserData);
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        this.isOtherUserResolved.next(true);
        this.idbResolved.user.next(true);

        // if the server is unavilable due to the user being offline, tell the user
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  // MESSAGE-RELATED METHODS
  // ==============================================================
  getMessages(type: MessageType, page: number, threadId?: number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = page ? page : 1;

    if (type == "thread" && !threadId) {
      this.alertsService.createAlert({
        message: "Thread ID must be provided",
        type: "Error",
      });
      return;
    }

    if (!this.authService.userData || !this.authService.userData.id) return;

    let params = new HttpParams()
      .set("userID", `${this.authService.userData.id}`)
      .set("page", `${currentPage}`)
      .set("type", type);
    this.isMessagesResolved.next(false);
    this.isMessagesIdbResolved.next(false);

    if (type == "thread") {
      params = params.set("threadID", `${threadId}`);
      this.activeThread = threadId as number;
    }

    // get the posts from IDB
    // TODO: IF THREADS THEN DO THE OTHER THING
    if (type == "threads") {
      this.serviceWorkerM.queryThreads(page)?.then((data) => {
        // if there are posts in cache, display them
        if (data.messages.length) {
          // if the latest fetch is none, the last fetch was from IDB and before or
          // the last fetch was performed more than 10 seconds ago (meaning the user)
          // changed/refreshed the page, update the latest fetch and the displayed
          // posts
          if (
            !this.lastFetchDate ||
            (this.lastFetchDate < Date.now() && this.lastFetchSource == "IDB") ||
            this.lastFetchDate + 10000 < Date.now() ||
            (page != this.currentMessagesPage && page != 1) ||
            this.lastFetchTarget != type
          ) {
            this.lastFetchSource = "IDB";
            this.lastFetchDate = Date.now();
            this.userThreads.set(data.messages);
            this.totalMessagesPages = data.pages;
            this.lastFetchTarget = type;
            this.isMessagesIdbResolved.next(true);
          }
        }
      });
    } else {
      this.serviceWorkerM.queryMessages(type, this.authService.userData.id!, page, threadId)?.then((data: any) => {
        // if there are posts in cache, display them
        if (data.messages.length) {
          // if the latest fetch is none, the last fetch was from IDB and before or
          // the last fetch was performed more than 10 seconds ago (meaning the user)
          // changed/refreshed the page, update the latest fetch and the displayed
          // posts
          if (
            !this.lastFetchDate ||
            (this.lastFetchDate < Date.now() && this.lastFetchSource == "IDB") ||
            this.lastFetchDate + 10000 < Date.now() ||
            (page != this.currentMessagesPage && page != 1) ||
            this.lastFetchTarget != type
          ) {
            this.lastFetchSource = "IDB";
            this.lastFetchDate = Date.now();
            this.userMessages = [...data.messages];
            this.totalMessagesPages = data.pages;
            this.lastFetchTarget = type;
            this.isMessagesIdbResolved.next(true);
          }
        }
      });
    }

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params,
    }).subscribe({
      next: (response: any) => {
        this,this.totalMessagesPages = response.total_pages;
        // if there are 0 pages, current page is also 0; otherwise it's whatever
        // the server returns
        this.currentMessagesPage = this.totalMessagesPages ? response.current_page : 0;
        this.lastFetchSource = "Server";
        this.lastFetchDate = Date.now();
        this.isMessagesResolved.next(true);
        this.isMessagesIdbResolved.next(true);
        this.alertsService.toggleOfflineAlert();

        // add each message in the messages list to the store
        if (type == "threads") {
          const messages = response.messages;
          this.userThreads.set([...messages]);
          messages.forEach((element: FullThread) => {
            const thread: FullThread = {
              ...element,
              isoDate: new Date(element.latestMessage).toISOString(),
            };
            this.serviceWorkerM.addItem("threads", thread);
          });
          this.serviceWorkerM.cleanDB("threads");
        } else {
          const messages = response.messages;
          this.userMessages = [...messages];
          messages.forEach((element: Message) => {
            const message: Message = {
              ...element,
              isoDate: new Date(element.date).toISOString(),
            };
            this.serviceWorkerM.addItem("messages", message);
          });
          this.serviceWorkerM.cleanDB("messages");
        }
      },
      // if there was an error, alert the user
      error: (err: HttpErrorResponse) => {
        this.isMessagesResolved.next(true);
        this.isMessagesIdbResolved.next(true);

        // if the server is unavilable due to the user being offline, tell the user
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    })
  }

  /*
  Function Name: sendMessage()
  Function Description: Send a message.
  Parameters: message (Message) - the message to send.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendMessage(message: Message) {
    const Url = this.serverUrl + "/messages";
    this.Http.post(Url, message, {
      headers: this.authService.authHeader,
    }).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert("Your message was sent!", false, "/");
        this.alertsService.toggleOfflineAlert();

        let isoDate = new Date(response.message.date).toISOString();
        let message = {
          date: response.message.date,
          for: response.message.for!,
          forId: response.message.forId,
          from: response.message.from,
          fromId: response.message.fromId,
          id: Number(response.message.id!),
          isoDate: isoDate,
          messageText: response.message.messageText,
          threadID: response.message.threadID!,
        };
        this.serviceWorkerM.addItem("messages", message);
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a message.
  Parameters: messageId (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageId: number, messType: string) {
    const Url = this.serverUrl + `/messages/${messType}/${messageId}`;

    // try to delete the message
    this.Http.delete(Url, {
      headers: this.authService.authHeader,
    }).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `Message ${response.deleted} was deleted! Refresh to view the updated message list.`,
          true,
        );
        this.alertsService.toggleOfflineAlert();

        // delete the message from idb
        this.serviceWorkerM.deleteItem("messages", messageId);
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  /*
  Function Name: deleteThread()
  Function Description: Delete a thread.
  Parameters: threadId (number) - the ID of the thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId: number) {
    const Url = this.serverUrl + `/messages/threads/${threadId}`;

    // try to delete the thread
    this.Http.delete(Url, {
      headers: this.authService.authHeader,
    }).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `Thread ${response.deleted} was deleted! Refresh to view the updated message list.`,
          true,
        );
        this.alertsService.toggleOfflineAlert();

        // delete the thread and its messages from idb
        this.serviceWorkerM.deleteItems("messages", "threadID", threadId);
        this.serviceWorkerM.deleteItem("threads", threadId);
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  /*
  Function Name: deleteAll()
  Function Description: Delete all of a user's messages in a specific mailbox.
  Parameters: type (string) - Type of mailbox to clear.
              userID (number) - The ID of the user whose mailbox to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAll(type: string, userID: number) {
    const mailbox_type = type.substring(4, type.length);
    const Url = this.serverUrl + `/messages/${mailbox_type}`;
    const params = new HttpParams().set("userID", `${userID}`);

    // try to delete this mailbox
    this.Http.delete(Url, {
      params: params,
      headers: this.authService.authHeader,
    }).subscribe({
      next: (response: any) => {
        this.alertsService.createSuccessAlert(
          `${response.deleted} messages were deleted! Refresh to view the updated mailbox.`,
          true,
        );
        this.alertsService.toggleOfflineAlert();

        // delete all messages from idb
        // if the mailbox to be cleared is the threads mailbox, delete everything
        if (mailbox_type == "threads") {
          this.serviceWorkerM.clearStore("messages");
          this.serviceWorkerM.clearStore("threads");
        } else if (mailbox_type == "inbox") {
          this.serviceWorkerM.deleteItems("messages", "forId", userID);
        } else if (mailbox_type == "outbox") {
          this.serviceWorkerM.deleteItems("messages", "fromId", userID);
        }
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  // SEARCH-RELATED METHODS
  // ==============================================================
  /*
  Function Name: sendSearch()
  Function Description: Sends a search query to the database.
  Parameters: searchQuery (string) - String to search for.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendSearch(searchQuery: string) {
    this.isSearching = true;
    const params = new HttpParams().set("page", `${this.postSearchPage}`);

    this.Http.post(
      this.serverUrl,
      {
        search: searchQuery,
      },
      {
        params: params,
      },
    ).subscribe({
      next: (response: any) => {
        this.userSearchResults = response.users;
        this.postSearchResults = response.posts;
        this.postSearchPage = response.current_page;
        this.totalPostSearchPages = response.total_pages;
        this.numUserResults = response.user_results;
        this.numPostResults = response.post_results;
        this.isSearching = false;
        this.isSearchResolved.next(true);
        this.alertsService.toggleOfflineAlert();
      },
      error: (err: HttpErrorResponse) => {
        this.isSearchResolved.next(true);
        this.isSearching = false;

        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }

  // REPORT METHODS
  // ==============================================================
  /*
  Function Name: sendReport()
  Function Description: Sends a new post/user report to the database.
  Parameters: report (Report) - the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendReport(report: Report) {
    const Url = this.serverUrl + "/reports";

    // sends the report
    this.Http.post(Url, report, {
      headers: this.authService.authHeader,
    }).subscribe({
      next: (response: any) => {
        // if successful, alert the user
        let sent_report: Report = response.report;
        if (sent_report.type == "Post") {
          this.alertsService.createSuccessAlert(
            `Post number ${sent_report.postID} was successfully reported.`,
            false,
            "/",
          );
        } else {
          this.alertsService.createSuccessAlert(
            `User ${sent_report.userID} was successfully reported.`,
            false,
            "/",
          );
        }
        this.alertsService.toggleOfflineAlert();
        // if there's an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
    });
  }
}
