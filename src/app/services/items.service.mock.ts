/*
	Items Service
	Send a Hug Mock Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

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
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { Message } from '../interfaces/message.interface';
import { Thread } from '../interfaces/thread.interface';
import { OtherUser } from '../interfaces/otherUser.interface';
import { Report } from '../interfaces/report.interface';
import { MockAuthService } from './auth.service.mock';
import { MockAlertsService } from './alerts.service.mock';
import { MockSWManager } from './sWManager.service.mock';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MockItemsService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  // User posts variables
  userPosts: {
    self: Post[],
    other: Post[]
  } = {
    self: [],
    other: []
  };
  userPostsPage = {
    self: 1,
    other: 1
  };
  totalUserPostsPages = {
    self: 1,
    other: 1
  };
  isUserPostsResolved = {
    self: new BehaviorSubject(false),
    other: new BehaviorSubject(false)
  };
  // User variables
  otherUserData: OtherUser = {
    id: 0,
    displayName: '',
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    role: ''
  };
  isOtherUser = false;
  isOtherUserResolved = new BehaviorSubject(false);
  previousUser:number = 0;
  // User messages variables
  userMessages: {
    inbox: Message[],
    outbox: Message[],
    threads: Thread[]
  } = {
    inbox: [],
    outbox: [],
    threads: []
  }
  userMessagesPage = {
    inbox: 1,
    outbox: 1,
    threads: 1
  }
  totalUserMessagesPages = {
    inbox: 1,
    outbox: 1,
    threads: 1
  }
  isUserMessagesResolved = {
    inbox: new BehaviorSubject(false),
    outbox: new BehaviorSubject(false),
    threads: new BehaviorSubject(false)
  }
  activeThread = 0;
  threadMessages: Message[] = [];
  threadPage: number;
  totalThreadPages: number;
  isThreadResolved = new BehaviorSubject(false);
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
    thread: new BehaviorSubject(false)
  }

  // CTOR
  constructor(
    private authService:MockAuthService,
    private alertsService:MockAlertsService,
    private serviceWorkerM:MockSWManager
  ) {
      // default assignment
      this.threadPage = 1;
      this.totalThreadPages = 1;
  }

  // POST-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getUserPosts()
  Function Description: Gets a paginated list of the user's posts.
  Parameters: userID (number) - the ID of the user whose posts need to be fetched.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getUserPosts(userID:number) {
    const user = (userID == this.authService.userData.id) ? 'self' : 'other';
    this.isUserPostsResolved[user].next(false);
    this.idbResolved.userPosts.next(false);

    if(user == 'other') {
      if(this.userPostsPage.other == 1) {
        this.userPosts.other = [
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 1,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: 'shirb'
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 2,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: 'shirb'
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 3,
            sentHugs: [],
            text: "testing",
            userId: 1,
            user: 'shirb'
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 4,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: 'shirb'
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 5,
            sentHugs: [],
            text: "test",
            userId: 1,
            user: 'shirb'
          }
        ];

        this.userPostsPage.other = 1;
      }
      else if(this.userPostsPage.other == 2) {
        this.userPosts.other = [
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 9,
            sentHugs: [],
            text: "testing",
            userId: 1,
            user: 'shirb'
          },
          {
            date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
            givenHugs: 1,
            id: 10,
            sentHugs: [],
            text: "another test",
            userId: 1,
            user: 'shirb'
          }
        ];

        this.userPostsPage.other = 2;
      }


      this.totalUserPostsPages.other = 2;
      this.isUserPostsResolved[user].next(true);
      this.idbResolved.userPosts.next(true);
    }
    else {
      this.userPosts.self = [
        {
          date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
          givenHugs: 1,
          id: 7,
          sentHugs: [],
          text: "test",
          userId: 4,
          user: 'name'
        },
        {
          date: new Date("Mon, 01 Jun 2020 15:05:01 GMT"),
          givenHugs: 1,
          id: 6,
          sentHugs: [],
          text: "test",
          userId: 4,
          user: 'name'
        }
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
  sendUserHug(userID:number) {
    // update the users' data
    this.otherUserData.receivedHugs += 1;
    this.authService.userData.givenHugs += 1;
    this.alertsService.createSuccessAlert('Your hug was sent!', true);
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
  getUser(userID:number) {
    this.isOtherUserResolved.next(false);
    this.idbResolved.user.next(false);

    this.otherUserData = {
      id: 1,
      displayName: "shirb",
      receivedHugs: 3,
      givenHugs: 3,
      role: 'user',
      postsNum: 10
    }

    this.isOtherUserResolved.next(true);
    this.idbResolved.user.next(true);
    this.getUserPosts(userID);
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
  getMailboxMessages(type: 'inbox' | 'outbox', userID:number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userMessagesPage[type] ? this.userMessagesPage[type] : 1;
    this.idbResolved[type].next(false);
    this.isUserMessagesResolved[type].next(false);


    if(type == 'inbox') {
      if(this.userMessagesPage.inbox == 1) {
        this.userMessages[type] = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 1,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          },
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 14,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          }
        ];
        this.userMessagesPage[type] = 1;
      }
      else {
        this.userMessages[type] = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 1,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          },
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 14,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          },
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 25,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          }
        ];
        this.userMessagesPage[type] = 2;
      }
      this.totalUserMessagesPages[type] = 2;
      this.isUserMessagesResolved[type].next(true);
      this.idbResolved[type].next(true);
    }
    else {
      if(this.userMessagesPage.outbox == 1) {
        this.userMessages[type] = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 18,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          },
          {
            date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
            for: "shirb",
            forId: 1,
            from: "user14",
            fromId: 4,
            id: 9,
            messageText: "hang in there",
            threadID: 3
          }
        ];
        this.userMessagesPage[type] = 1;
      }
      else {
        this.userMessages[type] = [
          {
            date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
            for: "user14",
            forId: 4,
            from: "user14",
            fromId: 4,
            id: 18,
            messageText: "Your post (ID 19) was deleted due to violating our community rules.",
            threadID: 4
          }
        ];
        this.userMessagesPage[type] = 2;
      }
      this.totalUserMessagesPages[type] = 2;
      this.isUserMessagesResolved[type].next(true);
      this.idbResolved[type].next(true);
    }
  }

  /*
  Function Name: getThreads()
  Function Description: Get the user's threads.
  Parameters: userID (number) - the ID of the user whose threads to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getThreads(userID:number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userMessagesPage.threads ? this.userMessagesPage.threads : 1;
    this.idbResolved.threads.next(false);
    this.isUserMessagesResolved.threads.next(false);

    this.userMessages.threads = [
      {
        id: 3,
        user: "shirb",
        userID: 1,
        numMessages: 1,
        latestMessage: new Date("Mon, 08 Jun 2020 14:43:15 GMT")
      }
    ];
    if(this.userMessagesPage.threads == 1) {
      this.userMessagesPage.threads = 1;
    }
    else {
      this.userMessagesPage.threads = 2;
    }
    this.totalUserMessagesPages.threads = 2;
    this.isUserMessagesResolved.threads.next(true);
    this.idbResolved.threads.next(true);
  }

  /*
  Function Name: getThread()
  Function Description: Get the messages in a specific thread.
  Parameters: userID (number) - the ID of the user whose messages to fetch.
              threadId (number) - the ID of the thread to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getThread(userID:number, threadId:number) {
    this.activeThread = threadId;
    this.idbResolved.thread.next(false);
    this.isThreadResolved.next(false);

    this.threadMessages = [
      {
        date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
        for: "shirb",
        forId: 1,
        from: "user14",
        fromId: 4,
        id: 9,
        messageText: "hang in there",
        threadID: 3
      },
      {
        date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
        for: "shirb",
        forId: 1,
        from: "user14",
        fromId: 4,
        id: 10,
        messageText: "hi",
        threadID: 3
      }
    ];
    this.totalThreadPages = 1;
    this.threadPage = 1;
    this.isThreadResolved.next(true);
    this.idbResolved.thread.next(true);
  }

  /*
  Function Name: sendMessage()
  Function Description: Send a message.
  Parameters: message (Message) - the message to send.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendMessage(message: Message) {
    this.alertsService.createSuccessAlert('Your message was sent!', false);
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a message.
  Parameters: messageId (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageId:number, messType:string) {
    this.alertsService.createSuccessAlert(`Message ${messageId} was deleted! Refresh to view the updated message list.`, true);
  }

  /*
  Function Name: deleteThread()
  Function Description: Delete a thread.
  Parameters: threadId (number) - the ID of the thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId:number, messType:string) {
    this.alertsService.createSuccessAlert(`Message ${threadId} was deleted! Refresh to view the updated message list.`, true);
  }

  /*
  Function Name: deleteAll()
  Function Description: Delete all of a user's messages in a specific mailbox.
  Parameters: type (string) - Type of mailbox to clear.
              userID (number) - The ID of the user whose mailbox to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAll(type:string, userID:number) {
    const mailbox_type = type.substring(4, type.length);
    this.alertsService.createSuccessAlert(`${mailbox_type} messages were deleted! Refresh to view the updated mailbox.`, true);
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
  sendSearch(searchQuery:string) {
    this.isSearching = true;
    this.isSearchResolved.next(false);
    const params = new HttpParams().set('page', `${this.postSearchPage}`);

    this.userSearchResults = [
      {
        id: 6,
        displayName: 'tests',
        receivedHugs: 2,
        givenHugs: 4,
        postsNum: 1,
        role: 'user'
      },
      {
        id: 7,
        displayName: 'testing',
        receivedHugs: 2,
        givenHugs: 4,
        postsNum: 1,
        role: 'user'
      }
    ];
    if(this.postSearchPage == 1) {
      this.postSearchResults = [
        {
          date: new Date("Mon, 01 Jun 2020 15:20:11 GMT"),
          givenHugs: 0,
          id: 7,
          text: "test",
          user: "shirb",
          userId: 1,
          sentHugs: []
        }
      ];
      this.postSearchPage = 1;
    }
    else if(this.postSearchPage == 2) {
      this.postSearchResults = [
        {
          date: new Date("Mon, 01 Jun 2020 15:19:41 GMT"),
          givenHugs: 0,
          id: 6,
          text: "test",
          user: "shirb",
          userId: 1,
          sentHugs: []
        },
        {
          date: new Date("Mon, 01 Jun 2020 15:18:37 GMT"),
          givenHugs: 0,
          id: 5,
          text: "test",
          user: "shirb",
          userId: 1,
          sentHugs: []
        }
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
  sendReport(report:Report) {
    if(report.type == 'Post') {
      this.alertsService.createSuccessAlert(`Post number ${report.postID} was successfully reported.`, false, '/');
    }
    else {
      this.alertsService.createSuccessAlert(`User ${report.userID} was successfully reported.`, false, '/');
    }
  }
}
