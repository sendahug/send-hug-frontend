/*
	Items Service
	Send a Hug Mock Service
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
import { HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

// App-related imports
import { Post } from "../interfaces/post.interface";
import { Message } from "../interfaces/message.interface";
import { FullThread, ParsedThread } from "../interfaces/thread.interface";
import { OtherUser } from "../interfaces/otherUser.interface";
import { Report } from "../interfaces/report.interface";
import { MockAuthService } from "./auth.service.mock";
import { MockAlertsService } from "./alerts.service.mock";
import { MockSWManager } from "./sWManager.service.mock";
import { environment } from "../../environments/environment";
import { MessageType } from "../interfaces/types";

@Injectable({
  providedIn: "root",
})
export class MockItemsService {
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
    inbox: new BehaviorSubject(false),
    outbox: new BehaviorSubject(false),
    threads: new BehaviorSubject(false),
    thread: new BehaviorSubject(false),
  };

  // CTOR
  constructor(
    private authService: MockAuthService,
    private alertsService: MockAlertsService,
    private serviceWorkerM: MockSWManager,
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
    this.isUserPostsResolved[user].next(false);
    this.idbResolved.userPosts.next(false);

    if (user == "other") {
      if (page == 1) {
        this.userPosts.other = [
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 1,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: "shirb",
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 2,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: "shirb",
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 3,
            sentHugs: [],
            text: "testing",
            userId: 1,
            user: "shirb",
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 4,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: "shirb",
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 5,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: "shirb",
          },
        ];

        this.userPostsPage.other = 1;
      } else if (page == 2) {
        this.userPosts.other = [
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 9,
            sentHugs: [],
            text: "testing",
            userId: 1,
            user: "shirb",
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 10,
            sentHugs: [],
            text: "another test",
            userId: 1,
            user: "shirb",
          },
        ];

        this.userPostsPage.other = 2;
      }

      this.totalUserPostsPages.other = 2;
      this.isUserPostsResolved[user].next(true);
      this.idbResolved.userPosts.next(true);
    } else {
      this.userPosts.self = [
        {
          date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
          givenHugs: 1,
          id: 7,
          sentHugs: [],
          text: "test",
          userId: 4,
          user: "name",
        },
        {
          date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
          givenHugs: 1,
          id: 6,
          sentHugs: [],
          text: "test",
          userId: 4,
          user: "name",
        },
      ];

      this.userPostsPage.self = 1;
      this.totalUserPostsPages.self = 2;
      this.isUserPostsResolved[user].next(true);
      this.idbResolved.userPosts.next(true);
    }
  }

  /*
  Function Name: sendUserHug()
  Function Description: Send a hug to a user.
  Parameters: userID (number) - the ID of the user.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendUserHug(userID: number) {
    // update the users' data
    this.otherUserData.receivedHugs += 1;
    this.authService.userData.givenHugs += 1;
    this.alertsService.createSuccessAlert("Your hug was sent!", true);
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
    this.isOtherUserResolved.next(false);
    this.idbResolved.user.next(false);

    this.otherUserData = {
      id: 1,
      displayName: "shirb",
      receivedHugs: 3,
      givenHugs: 3,
      role: "user",
      postsNum: 10,
      selectedIcon: "kitty",
      iconColours: {
        character: "#BA9F93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    };

    this.isOtherUserResolved.next(true);
    this.idbResolved.user.next(true);
    this.getUserPosts(userID, 1);
  }

  // MESSAGE-RELATED METHODS
  // ==============================================================
  getMessages(type: MessageType, page: number, threadId?: number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = page ? page : 1;
    this.isMessagesIdbResolved.next(false);
    this.isMessagesResolved.next(false);

    if (type == "inbox") {
      if (page == 1) {
        this.userMessages = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
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
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            fromId: 4,
            id: 14,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4,
          },
        ];
        this.currentMessagesPage = 1;
      } else {
        this.userMessages = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
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
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            fromId: 4,
            id: 14,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4,
          },
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            fromId: 4,
            id: 25,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4,
          },
        ];
        this.currentMessagesPage = 2;
      }
      this.totalMessagesPages = 2;
      this.isMessagesResolved.next(true);
      this.isMessagesIdbResolved.next(true);
    } else if (type == "outbox") {
      if (page == 1) {
        this.userMessages = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            fromId: 4,
            id: 18,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4,
          },
          {
            date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
            for: {
              displayName: "shirb",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 1,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            fromId: 4,
            id: 9,
            messageText: "hang in there",
            threadID: 3,
          },
        ];
        this.currentMessagesPage = 1;
      } else {
        this.userMessages = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            forId: 4,
            from: {
              displayName: "user14",
              selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
            },
            fromId: 4,
            id: 18,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4,
          },
        ];
        this.currentMessagesPage = 2;
      }
      this.totalMessagesPages = 2;
      this.isMessagesResolved.next(true);
      this.isMessagesIdbResolved.next(true);
    } else if (type == "threads") {
      this.userThreads.set([
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
            displayName: "shirb",
            selectedIcon: "kitty",
            iconColours: {
              character: "#BA9F93",
              lbg: "#e2a275",
              rbg: "#f8eee4",
              item: "#f4b56a",
            },
          },
          user2Id: 2,
          numMessages: 1,
          latestMessage: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
        },
      ]);
      this.currentMessagesPage = page == 1 ? 1 : 2;
      this.totalMessagesPages = 2;
      this.isMessagesResolved.next(true);
      this.isMessagesIdbResolved.next(true);
    } else {
      this.userMessages = [
        {
          date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
          for: {
            displayName: "shirb",
            selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
          },
          forId: 1,
          from: {
            displayName: "user14",
            selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
          },
          fromId: 4,
          id: 9,
          messageText: "hang in there",
          threadID: 3,
        },
        {
          date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
          for: {
            displayName: "shirb",
            selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
          },
          forId: 1,
          from: {
            displayName: "user14",
            selectedIcon: "kitty",
              iconColours: {
                character: "#BA9F93",
                lbg: "#e2a275",
                rbg: "#f8eee4",
                item: "#f4b56a",
              },
          },
          fromId: 4,
          id: 10,
          messageText: "hi",
          threadID: 3,
        },
      ];
      this.currentMessagesPage = 1;
      this.totalMessagesPages = 1;
      this.isMessagesResolved.next(true);
      this.isMessagesIdbResolved.next(true);
    }
  }

  /*
  Function Name: sendMessage()
  Function Description: Send a message.
  Parameters: message (Message) - the message to send.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendMessage(message: Message) {
    this.alertsService.createSuccessAlert("Your message was sent!", false);
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a message.
  Parameters: messageId (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageId: number, messType: string) {
    this.alertsService.createSuccessAlert(
      `Message ${messageId} was deleted! Refresh to view the updated message list.`,
      true,
    );
  }

  /*
  Function Name: deleteThread()
  Function Description: Delete a thread.
  Parameters: threadId (number) - the ID of the thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId: number, messType: string) {
    this.alertsService.createSuccessAlert(
      `Message ${threadId} was deleted! Refresh to view the updated message list.`,
      true,
    );
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
    this.alertsService.createSuccessAlert(
      `${mailbox_type} messages were deleted! Refresh to view the updated mailbox.`,
      true,
    );
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
    this.isSearchResolved.next(false);
    const params = new HttpParams().set("page", `${this.postSearchPage}`);

    this.userSearchResults = [
      {
        id: 6,
        displayName: "tests",
        receivedHugs: 2,
        givenHugs: 4,
        postsNum: 1,
        role: "user",
        selectedIcon: "kitty",
        iconColours: {
          character: "#BA9F93",
          lbg: "#e2a275",
          rbg: "#f8eee4",
          item: "#f4b56a",
        },
      },
      {
        id: 7,
        displayName: "testing",
        receivedHugs: 2,
        givenHugs: 4,
        postsNum: 1,
        role: "user",
        selectedIcon: "kitty",
        iconColours: {
          character: "#BA9F93",
          lbg: "#e2a275",
          rbg: "#f8eee4",
          item: "#f4b56a",
        },
      },
    ];
    if (this.postSearchPage == 1) {
      this.postSearchResults = [
        {
          date: new Date("Mon, 01 Jun 2020 15:20:11 GMT"),
          givenHugs: 0,
          id: 7,
          text: "test",
          user: "shirb",
          userId: 1,
          sentHugs: [],
        },
      ];
      this.postSearchPage = 1;
    } else if (this.postSearchPage == 2) {
      this.postSearchResults = [
        {
          date: new Date("Mon, 01 Jun 2020 15:19:41 GMT"),
          givenHugs: 0,
          id: 6,
          text: "test",
          user: "shirb",
          userId: 1,
          sentHugs: [],
        },
        {
          date: new Date("Mon, 01 Jun 2020 15:18:37 GMT"),
          givenHugs: 0,
          id: 5,
          text: "test",
          user: "shirb",
          userId: 1,
          sentHugs: [],
        },
      ];
      this.postSearchPage = 2;
    }

    this.totalPostSearchPages = 2;
    this.numUserResults = 2;
    this.numPostResults = 3;
    this.isSearchResolved.next(true);
    this.isSearching = false;
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
    if (report.type == "Post") {
      this.alertsService.createSuccessAlert(
        `Post number ${report.postID} was successfully reported.`,
        false,
        "/",
      );
    } else {
      this.alertsService.createSuccessAlert(
        `User ${report.userID} was successfully reported.`,
        false,
        "/",
      );
    }
  }
}
