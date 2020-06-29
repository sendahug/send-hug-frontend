/*
	Items Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { Message } from '../interfaces/message.interface';
import { Thread } from '../interfaces/thread.interface';
import { OtherUser } from '../interfaces/otherUser.interface';
import { Report } from '../interfaces/report.interface';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { SWManager } from './sWManager.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
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

  // CTOR
  constructor(
    private Http: HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService,
    private serviceWorkerM:SWManager
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
    const Url = this.serverUrl + `/users/all/${userID}/posts`;

    // if the user is viewing another user's profile
    if(user == 'other') {
      // if this isn't the first profile the user is viewing (meaning the default
      // values may have been changed) and the user isn't still viewing the same
      // user's profile (e.g., they were trying to change a page on the user posts
      // component), reset the values of the required variables
      if(this.previousUser != 0 && this.previousUser != userID) {
        this.userPostsPage[user] = 1;
        this.totalUserPostsPages[user] = 1;
        this.userPosts[user] = [];
        this.isUserPostsResolved[user].next(false);
      }
    }
    // if the user is viewing their own profile, set the postsResolved to false
    else {
      this.isUserPostsResolved[user].next(false);
    }

    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userPostsPage[user] ? this.userPostsPage[user] : 1;
    const params = new HttpParams().set('page', `${currentPage}`);
    // change the ID of the previous user to the profile currently open
    this.previousUser = userID;

    // get the recent posts from IDB
    this.serviceWorkerM.queryDatabase('user posts', {
      name: 'page', value: currentPage
    }, {
      name: 'userID', value: userID
    })?.then((data:any) => {
      this.userPosts[user] = data;
    });

    // try to get the posts from the server
    this.Http.get(Url, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let data = response.posts;
      this.userPosts[user] = data;
      this.totalUserPostsPages[user] = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userPostsPage[user] = this.totalUserPostsPages[user] ? response.page : 0;
      this.isUserPostsResolved[user].next(true);

      // if there's a currently operating IDB database, get it
      if(this.serviceWorkerM.currentDB) {
        this.serviceWorkerM.currentDB.then(db => {
          // start a new transaction
          let tx = db.transaction('posts', 'readwrite');
          let store = tx.objectStore('posts');
          // add each post in the list to posts store
          data.forEach((element:Post) => {
            store.put(element);
          });
        })
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserPostsResolved[user].next(true);
      this.alertsService.createErrorAlert(err);
    })
  }

  /*
  Function Name: sendUserHug()
  Function Description: Send a hug to a user.
  Parameters: userID (number) - the ID of the user.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendUserHug(userID:number) {
    const Url = this.serverUrl + `/users/all/${userID}`;
    // update the users' data
    this.otherUserData.receivedHugs += 1;
    this.authService.userData.givenHugs += 1;

    this.Http.patch(Url, {
      displayName: this.otherUserData.displayName,
      receivedH: this.otherUserData.receivedHugs,
      givenH: this.otherUserData.givenHugs,
      posts: this.otherUserData.postsNum
    }, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.alertsService.createSuccessAlert('Your hug was sent!', true);
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.alertsService.createErrorAlert(err);
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
  getUser(userID:number) {
    const Url = this.serverUrl + `/users/all/${userID}`;
    this.isOtherUserResolved.next(false);

    // get the user's data from IDB
    this.serviceWorkerM.queryDatabase('user', {
      name: 'userID', value: userID
    })?.then((data:any) => {
      this.otherUserData = data;
    });

    // try to get the user's data from the server
    this.Http.get(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      let user = response.user;
      this.otherUserData = {
        id: user.id,
        displayName: user.displayName,
        receivedHugs: user.receivedH,
        givenHugs: user.givenH,
        role: user.role,
        postsNum: user.posts
      }
      this.isOtherUserResolved.next(true);
      this.getUserPosts(userID);

      // if there's a currently operating IDB database, get it
      if(this.serviceWorkerM.currentDB) {
        this.serviceWorkerM.currentDB.then(db => {
          // start a new transaction
          let tx = db.transaction('users', 'readwrite');
          let store = tx.objectStore('users');
          // adds the user's data to the users store
          store.put(this.otherUserData);
        })
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isOtherUserResolved.next(true);
      this.alertsService.createErrorAlert(err);
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
  getMailboxMessages(type: 'inbox' | 'outbox', userID:number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userMessagesPage[type] ? this.userMessagesPage[type] : 1;
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${currentPage}`)
      .set('type', type);

    // get the user's messages from IDB
    this.serviceWorkerM.queryDatabase(type, {
      name: 'currentUser',
      value: this.authService.userData.id
    }, {
      name: 'page',
      value: currentPage
    })?.then((data:any) => {
      // add the messages to the appropriate array
      data.forEach((element:Message) => {
        this.userMessages[type].push(element);
      });
    });

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let messages = response.messages;
      this.userMessages[type] = [];
      messages.forEach((element: Message) => {
        this.userMessages[type].push(element);
      });
      this.totalUserMessagesPages[type] = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userMessagesPage[type] = this.totalUserMessagesPages[type] ? response.current_page : 0;
      this.isUserMessagesResolved[type].next(true);

      // if there's a currently operating IDB database, get it
      if(this.serviceWorkerM.currentDB) {
        this.serviceWorkerM.currentDB.then(db => {
          // start a new transaction
          let tx = db.transaction('messages', 'readwrite');
          let store = tx.objectStore('messages');
          // add each message in the messages list to the store
          messages.forEach((element:Message) => {
            store.put(element);
          });
        })
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserMessagesResolved[type].next(true);
      this.alertsService.createErrorAlert(err);
    })
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
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${currentPage}`)
      .set('type', 'threads');

    // get the user's messages from IDB
    this.serviceWorkerM.queryDatabase('threads')?.then((data:any) => {
      // add the threads to the appropriate array
      data.forEach((element: any) => {
        let thread: Thread = {
          id: element.id,
          user: (element.user1 == this.authService.userData.displayName) ? element.user2 : element.user1,
          userID: (element.user1Id == this.authService.userData.id) ? element.user2Id : element.user1Id,
          numMessages: element.numMessages,
          latestMessage: element.latestMessage
        }
        this.userMessages.threads.push(thread);
      });
    });

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let threads = response.messages;
      this.userMessages.threads = [];
      threads.forEach((element: any) => {
        let thread: Thread = {
          id: element.id,
          user: (element.user1 == this.authService.userData.displayName) ? element.user2 : element.user1,
          userID: (element.user1Id == this.authService.userData.id) ? element.user2Id : element.user1Id,
          numMessages: element.numMessages,
          latestMessage: element.latestMessage
        }
        this.userMessages.threads.push(thread);
      });
      this.totalUserMessagesPages.threads = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userMessagesPage.threads = this.totalUserMessagesPages.threads ? response.current_page : 0;
      this.isUserMessagesResolved.threads.next(true);

      // if there's a currently operating IDB database, get it
      if(this.serviceWorkerM.currentDB) {
        this.serviceWorkerM.currentDB.then(db => {
          // start a new transaction
          let tx = db.transaction('threads', 'readwrite');
          let store = tx.objectStore('threads');
          // add each message in the threads list to the store
          threads.forEach((element:Message) => {
            store.put(element);
          });
        })
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserMessagesResolved.threads.next(true);
      this.alertsService.createErrorAlert(err);
    })
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
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.threadPage ? this.threadPage : 1;
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${currentPage}`)
      .set('type', 'thread')
      .set('threadID', `${threadId}`);

    // get the user's messages from IDB
    this.serviceWorkerM.queryDatabase('thread', {
      name: 'threadID',
      value: threadId
    }, {
      name: 'page',
      value: currentPage
    })?.then((data:any) => {
      // add the messages to the appropriate array
      data.forEach((element: Message) => {
        this.threadMessages.push(element);
      });
    });

    // try to get the user's messages from the server
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let messages = response.messages;
      this.threadMessages = [];
      messages.forEach((element: Message) => {
        this.threadMessages.push(element);
      });
      this.totalThreadPages = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.threadPage = this.totalThreadPages ? response.current_page : 0;
      this.isThreadResolved.next(true);

      // if there's a currently operating IDB database, get it
      if(this.serviceWorkerM.currentDB) {
        this.serviceWorkerM.currentDB.then(db => {
          // start a new transaction
          let tx = db.transaction('messages', 'readwrite');
          let store = tx.objectStore('messages');
          // add each message in the messages list to the store
          messages.forEach((element:Message) => {
            store.put(element);
          });
        })
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isThreadResolved.next(true);
      this.alertsService.createErrorAlert(err);
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
    const Url = this.serverUrl + '/messages';
    this.Http.post(Url, message, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.alertsService.createSuccessAlert('Your message was sent!', false, '/');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.alertsService.createErrorAlert(err);
    })
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a message.
  Parameters: messageId (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageId:number, messType:string) {
    const Url = this.serverUrl + `/messages/${messType}/${messageId}`

    // try to delete the message
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.alertsService.createSuccessAlert(`Message ${response.deleted} was deleted! Refresh to view the updated message list.`, true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.alertsService.createErrorAlert(err);
    })
  }

  /*
  Function Name: deleteThread()
  Function Description: Delete a thread.
  Parameters: threadId (number) - the ID of the thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId:number, messType:string) {
    const Url = this.serverUrl + `/messages/${messType}/${threadId}`

    // try to delete the thread
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.alertsService.createSuccessAlert(`Message ${response.deleted} was deleted! Refresh to view the updated message list.`, true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.alertsService.createErrorAlert(err);
    })
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
    const Url = this.serverUrl + `/messages/${mailbox_type}`;
    const params = new HttpParams().set('userID', `${userID}`);

    // try to delete this mailbox
    this.Http.delete(Url, {
      params: params,
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.alertsService.createSuccessAlert(`${response.deleted} messages were deleted! Refresh to view the updated mailbox.`, true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.alertsService.createErrorAlert(err);
    })
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
    const params = new HttpParams().set('page', `${this.postSearchPage}`);

    this.Http.post(this.serverUrl, {
      search: searchQuery
    }, {
      params: params
    }).subscribe((response:any) => {
      this.userSearchResults = response.users;
      this.postSearchResults = response.posts;
      this.postSearchPage = response.current_page;
      this.totalPostSearchPages = response.total_pages;
      this.numUserResults = response.user_results;
      this.numPostResults = response.post_results;
      this.isSearchResolved.next(true);
      this.isSearching = false;
    }, (err:HttpErrorResponse) => {
      this.isSearchResolved.next(true);
      this.alertsService.createErrorAlert(err);
      this.isSearching = false;
    })
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
    const Url = this.serverUrl + '/reports';

    // sends the report
    this.Http.post(Url, report, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      // if successful, alert the user
      let sent_report: Report = response.report;
      if(sent_report.type == 'Post') {
        this.alertsService.createSuccessAlert(`Post number ${sent_report.postID} was successfully reported.`, false, '/');
      }
      else {
        this.alertsService.createSuccessAlert(`User ${sent_report.userID} was successfully reported.`, false, '/');
      }
    // if there's an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.alertsService.createErrorAlert(err);
    })
  }
}
