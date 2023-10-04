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
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

// App-related imports
import { Post } from "../interfaces/post.interface";
import { Message } from "../interfaces/message.interface";
import { Thread } from "../interfaces/thread.interface";
import { OtherUser } from "../interfaces/otherUser.interface";
import { Report } from "../interfaces/report.interface";
import { AuthService } from "./auth.service";
import { AlertsService } from "./alerts.service";
import { SWManager } from "./sWManager.service";
import { environment } from "../../environments/environment";

type FetchStamp = {
  source: "Server" | "IDB" | "";
  date: number;
};

@Injectable({
  providedIn: "root",
})
export class ItemsService {
  readonly serverUrl = environment.backend.domain;
  // User posts variables
  userPosts: {
    self: Post[];
    other: Post[];
  } = {
    self: [],
    other: [],
  };
  userPostsPage = {
    self: 1,
    other: 1,
  };
  totalUserPostsPages = {
    self: 1,
    other: 1,
  };
  isUserPostsResolved = {
    self: new BehaviorSubject(false),
    other: new BehaviorSubject(false),
  };
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
  userMessages: {
    inbox: Message[];
    outbox: Message[];
    threads: Thread[];
    thread: Message[];
  } = {
    inbox: [],
    outbox: [],
    threads: [],
    thread: [],
  };
  userMessagesPage = {
    inbox: 1,
    outbox: 1,
    threads: 1,
    thread: 1,
  };
  totalUserMessagesPages = {
    inbox: 1,
    outbox: 1,
    threads: 1,
    thread: 1,
  };
  isUserMessagesResolved = {
    inbox: new BehaviorSubject(false),
    outbox: new BehaviorSubject(false),
    threads: new BehaviorSubject(false),
    thread: new BehaviorSubject(false),
  };
  activeThread = 0;
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
    inbox: new BehaviorSubject(false),
    outbox: new BehaviorSubject(false),
    threads: new BehaviorSubject(false),
    thread: new BehaviorSubject(false),
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
    inbox: {
      source: "",
      date: 0,
    },
    outbox: {
      source: "",
      date: 0,
    },
    threads: {
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
  Function Name: getUserPosts()
  Function Description: Gets a paginated list of the user's posts.
  Parameters: userID (number) - the ID of the user whose posts need to be fetched.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getUserPosts(userID: number, page: number) {
    const user = userID == this.authService.userData.id ? "self" : "other";
    const Url = this.serverUrl + `/users/all/${userID}/posts`;

    // if the user is viewing another user's profile
    if (user == "other") {
      // if this isn't the first profile the user is viewing (meaning the default
      // values may have been changed) and the user isn't still viewing the same
      // user's profile (e.g., they were trying to change a page on the user posts
      // component), reset the values of the required variables
      if (this.previousUser != 0 && this.previousUser != userID) {
        this.userPostsPage[user] = 1;
        this.totalUserPostsPages[user] = 1;
        this.userPosts[user] = [];
        this.isUserPostsResolved[user].next(false);
        this.idbResolved.userPosts.next(false);
      }
    }
    // if the user is viewing their own profile, set the postsResolved to false
    else {
      this.isUserPostsResolved[user].next(false);
      this.idbResolved.userPosts.next(false);
    }

    // if the current page is 0, send page 1 to the server (default)
    const currentPage = page ? page : 1;
    const params = new HttpParams().set("page", `${currentPage}`);
    // change the ID of the previous user to the profile currently open
    this.previousUser = userID;

    // get the recent posts from IDB
    this.serviceWorkerM.fetchPosts("user", 5, userID, currentPage, false)?.then((data: any) => {
      // if there are posts in cache, display them
      if (data.posts.length) {
        // if the latest fetch is none, the last fetch was from IDB and before,
        // the last fetch was performed more than 10 seconds ago (meaning the user
        // changed/refreshed the page) or it's a different page, update the latest fetch and the displayed
        // posts
        if (
          this.lastFetched["userPosts" + user].date == 0 ||
          (this.lastFetched["userPosts" + user].date < Date.now() &&
            this.lastFetched["userPosts" + user].source == "IDB") ||
          this.lastFetched["userPosts" + user].date + 10000 < Date.now() ||
          (page != this.userPostsPage[user] && page != 1) ||
          this.previousUser != userID
        ) {
          this.lastFetched["userPosts" + user].source = "IDB";
          this.lastFetched["userPosts" + user].date = Date.now();
          this.userPosts[user] = data.posts;
          this.totalUserPostsPages[user] = data.pages;
          this.idbResolved.userPosts.next(true);
        }
      }
    });

    // try to get the posts from the server
    this.Http.get(Url, {
      headers: this.authService.authHeader,
      params: params,
    }).subscribe({
      next: (response: any) => {
        let data = response.posts;
        this.userPosts[user] = data;
        this.totalUserPostsPages[user] = response.total_pages;
        // if there are 0 pages, current page is also 0; otherwise it's whatever
        // the server returns
        this.userPostsPage[user] = this.totalUserPostsPages[user] ? response.page : 0;
        this.lastFetched["userPosts" + user].source = "Server";
        this.lastFetched["userPosts" + user].date = Date.now();
        this.isUserPostsResolved[user].next(true);
        this.idbResolved.userPosts.next(true);
        this.alertsService.toggleOfflineAlert();

        // add each post to the database
        data.forEach((element: Post) => {
          let isoDate = new Date(element.date).toISOString();
          let post = {
            date: element.date,
            givenHugs: element.givenHugs,
            id: element.id!,
            isoDate: isoDate,
            text: element.text,
            userId: Number(element.userId),
            user: element.user,
            sentHugs: element.sentHugs!,
          };

          this.serviceWorkerM.addItem("posts", post);
        });
        this.serviceWorkerM.cleanDB("posts");
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        this.isUserPostsResolved[user].next(true);
        this.idbResolved.userPosts.next(false);

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
  /*
  Function Name: getMailboxMessages()
  Function Description: Get the user's incoming messages.
  Parameters: type ('inbox' | 'outbox') - Type of messages to fetch.
              userID (number) - the ID of the user whose messages to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getMailboxMessages(type: "inbox" | "outbox", userID: number, page: number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = page ? page : 1;

    if (!["inbox", "outbox"].includes(type)) {
      this.alertsService.createAlert({
        message: "Mailbox type must be either inbox or outbox",
        type: "Error",
      });
      return;
    }

    let params = new HttpParams()
      .set("userID", `${userID}`)
      .set("page", `${currentPage}`)
      .set("type", type);
    this.idbResolved[type].next(false);

    // get the user's messages from IDB
    this.serviceWorkerM
      .queryMessages(type, this.authService.userData.id!, currentPage)
      ?.then((data: any) => {
        // if there's messages data in the IDB database
        if (data.messages.length) {
          // if the latest fetch is none, the last fetch was from IDB and before,
          // the last fetch was performed more than 10 seconds ago (meaning the user
          // changed/refreshed the page) or it's a different page, update the latest fetch and the displayed
          // posts
          if (
            this.lastFetched[type].date == 0 ||
            (this.lastFetched[type].date < Date.now() && this.lastFetched[type].source == "IDB") ||
            this.lastFetched[type].date + 10000 < Date.now() ||
            (page != this.userMessagesPage[type] && page != 1)
          ) {
            this.lastFetched[type].source = "IDB";
            this.lastFetched[type].date = Date.now();
            this.userMessages[type] = [];
            // add the messages to the appropriate array
            data.posts.forEach((element: Message) => {
              this.userMessages[type].push(element);
            });
            this.totalUserMessagesPages[type] = data.pages;
            this.idbResolved[type].next(true);
          }
        }
      });

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params,
    }).subscribe({
      next: (response: any) => {
        let messages = response.messages;
        this.userMessages[type] = [];
        messages.forEach((element: Message) => {
          this.userMessages[type].push(element);
        });
        this.totalUserMessagesPages[type] = response.total_pages;
        // if there are 0 pages, current page is also 0; otherwise it's whatever
        // the server returns
        this.userMessagesPage[type] = this.totalUserMessagesPages[type] ? response.current_page : 0;
        this.lastFetched[type].source = "Server";
        this.lastFetched[type].date = Date.now();
        this.isUserMessagesResolved[type].next(true);
        this.idbResolved[type].next(true);
        this.alertsService.toggleOfflineAlert();

        // add each message in the messages list to the store
        messages.forEach((element: Message) => {
          let isoDate = new Date(element.date).toISOString();
          let message = {
            date: element.date,
            for: {
              displayName: element.for!.displayName,
              selectedIcon:
                element.forId == this.authService.userData.id
                  ? this.authService.userData.selectedIcon
                  : element.for!.selectedIcon,
              iconColours:
                element.forId == this.authService.userData.id
                  ? this.authService.userData.iconColours
                  : element.for!.iconColours,
            },
            forId: element.forId,
            from: {
              displayName: element.from!.displayName,
              selectedIcon:
                element.forId == this.authService.userData.id
                  ? this.authService.userData.selectedIcon
                  : element.from!.selectedIcon,
              iconColours:
                element.forId == this.authService.userData.id
                  ? this.authService.userData.iconColours
                  : element.from!.iconColours,
            },
            fromId: element.fromId,
            id: Number(element.id!),
            isoDate: isoDate,
            messageText: element.messageText,
            threadID: element.threadID!,
          };
          this.serviceWorkerM.addItem("messages", message);
        });
        this.serviceWorkerM.cleanDB("messages");
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        this.isUserMessagesResolved[type].next(true);
        this.idbResolved[type].next(true);

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

  /*
  Function Name: getThreads()
  Function Description: Get the user's threads.
  Parameters: userID (number) - the ID of the user whose threads to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getThreads(userID: number, page: number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = page ? page : 1;
    let params = new HttpParams()
      .set("userID", `${userID}`)
      .set("page", `${currentPage}`)
      .set("type", "threads");
    this.idbResolved.threads.next(false);

    // get the user's messages from IDB
    this.serviceWorkerM.queryThreads(currentPage)?.then((data: any) => {
      // if there's threads data in the IDB database
      if (data.messages.length) {
        // if the latest fetch is none, the last fetch was from IDB and before,
        // the last fetch was performed more than 10 seconds ago (meaning the user
        // changed/refreshed the page) or it's a different page, update the latest fetch and the displayed
        // posts
        if (
          this.lastFetched.threads.date == 0 ||
          (this.lastFetched.threads.date < Date.now() &&
            this.lastFetched.threads.source == "IDB") ||
          this.lastFetched.threads.date + 10000 < Date.now() ||
          (page != this.userMessagesPage.threads && page != 1)
        ) {
          this.lastFetched.threads.source = "IDB";
          this.lastFetched.threads.date = Date.now();
          this.userMessages.threads = [];
          // add the threads to the appropriate array
          data.posts.forEach((element: any) => {
            let thread: Thread = {
              id: element.id,
              user:
                element.user1.displayName == this.authService.userData.displayName
                  ? element.user2
                  : element.user1,
              userID:
                element.user1Id == this.authService.userData.id ? element.user2Id : element.user1Id,
              numMessages: element.numMessages,
              latestMessage: element.latestMessage,
            };
            this.userMessages.threads.push(thread);
          });
          this.totalUserMessagesPages.threads = data.pages;
          this.idbResolved.threads.next(true);
        }
      }
    });

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params,
    }).subscribe({
      next: (response: any) => {
        let threads = response.messages;
        this.userMessages.threads = [];
        threads.forEach((element: any) => {
          let thread: Thread = {
            id: element.id,
            user:
              element.user1 == this.authService.userData.displayName
                ? element.user2
                : element.user1,
            userID:
              element.user1Id == this.authService.userData.id ? element.user2Id : element.user1Id,
            numMessages: element.numMessages,
            latestMessage: element.latestMessage,
          };
          this.userMessages.threads.push(thread);
        });
        this.totalUserMessagesPages.threads = response.total_pages;
        // if there are 0 pages, current page is also 0; otherwise it's whatever
        // the server returns
        this.userMessagesPage.threads = this.totalUserMessagesPages.threads
          ? response.current_page
          : 0;
        this.lastFetched.threads.source = "Server";
        this.lastFetched.threads.date = Date.now();
        this.isUserMessagesResolved.threads.next(true);
        this.idbResolved.threads.next(true);
        this.alertsService.toggleOfflineAlert();

        // add each message in the threads list to the store
        threads.forEach((element: any) => {
          let isoDate = new Date(element.latestMessage).toISOString();
          let thread = {
            latestMessage: element.latestMessage,
            user1: {
              displayName: element.user1!.displayName,
              selectedIcon: element.user1!.selectedIcon,
              iconColours: element.user1!.iconColours,
            },
            user1Id: element.user1Id,
            user2: {
              displayName: element.user2!.displayName,
              selectedIcon: element.user2!.selectedIcon,
              iconColours: element.user2!.iconColours,
            },
            user2Id: element.user2Id,
            numMessages: element.numMessages!,
            isoDate: isoDate,
            id: element.id,
          };
          this.serviceWorkerM.addItem("threads", thread);
        });
        this.serviceWorkerM.cleanDB("threads");
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        this.isUserMessagesResolved.threads.next(true);
        this.idbResolved.threads.next(true);

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

  /*
  Function Name: getThread()
  Function Description: Get the messages in a specific thread.
  Parameters: userID (number) - the ID of the user whose messages to fetch.
              threadId (number) - the ID of the thread to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getThread(userID: number, threadId: number) {
    this.activeThread = threadId;
    this.idbResolved.thread.next(false);
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userMessagesPage.thread ? this.userMessagesPage.thread : 1;
    let params = new HttpParams()
      .set("userID", `${userID}`)
      .set("page", `${currentPage}`)
      .set("type", "thread")
      .set("threadID", `${threadId}`);

    // get the user's messages from IDB
    this.serviceWorkerM
      .queryMessages("thread", this.authService.userData.id!, currentPage, threadId)
      ?.then((data: any) => {
        // if there's messages data in the IDB database
        if (data.messages.length) {
          this.userMessages.thread = [];
          // add the messages to the appropriate array
          data.posts.forEach((element: Message) => {
            this.userMessages.thread.push(element);
          });
          this.totalUserMessagesPages.thread = data.pages;
          this.idbResolved.thread.next(true);
        }
      });

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params,
    }).subscribe({
      next: (response: any) => {
        let messages = response.messages;
        this.userMessages.thread = [];
        messages.forEach((element: Message) => {
          this.userMessages.thread.push(element);
        });
        this.totalUserMessagesPages.thread = response.total_pages;
        // if there are 0 pages, current page is also 0; otherwise it's whatever
        // the server returns
        this.userMessagesPage.thread = this.totalUserMessagesPages.thread
          ? response.current_page
          : 0;
        this.isUserMessagesResolved.thread.next(true);
        this.idbResolved.thread.next(true);
        this.alertsService.toggleOfflineAlert();

        // add each message in the messages list to the store
        messages.forEach((element: Message) => {
          let isoDate = new Date(element.date).toISOString();
          let message = {
            date: element.date,
            for: {
              displayName: element.for!.displayName,
              selectedIcon: element.for!.selectedIcon,
              iconColours: element.for!.iconColours,
            },
            forId: element.forId,
            from: {
              displayName: element.from!.displayName,
              selectedIcon: element.from!.selectedIcon,
              iconColours: element.from!.iconColours,
            },
            fromId: element.fromId,
            id: element.id!,
            isoDate: isoDate,
            messageText: element.messageText,
            threadID: element.threadID!,
          };
          this.serviceWorkerM.addItem("messages", message);
        });
        this.serviceWorkerM.cleanDB("messages");
        // if there was an error, alert the user
      },
      error: (err: HttpErrorResponse) => {
        this.isUserMessagesResolved.thread.next(true);
        this.idbResolved.thread.next(true);

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
