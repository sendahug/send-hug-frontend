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
import { AlertMessage } from '../interfaces/alert.interface';
import { Thread } from '../interfaces/thread.interface';
import { OtherUser } from '../interfaces/otherUser.interface';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  newItemsArray: Post[] = [];
  sugItemsArray: Post[] = [];
  // Full list variables
  fullItemsList: {
    fullNewItems: Post[],
    fullSuggestedItems: Post[]
  } = {
    fullNewItems: [],
    fullSuggestedItems: []
  }
  fullItemsPage = {
    fullNewItems: 0,
    fullSuggestedItems: 0
  }
  totalFullItemsPage = {
    fullNewItems: 0,
    fullSuggestedItems: 0
  }
  // User posts variables
  userPosts: Post[] = [];
  userPostsPage: number;
  totalUserPostsPages: number;
  isUserPostsResolved = new BehaviorSubject(false);
  // User variables
  userData: OtherUser = {
    id: 0,
    displayName: '',
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    role: ''
  };
  isOtherUser = false;
  isOtherUserResolved = new BehaviorSubject(false);
  // User messages variables
  userMessages: {
    inbox: Message[],
    outbox: Message[]
  } = {
    inbox: [],
    outbox: []
  }
  userMessagesPage = {
    inbox: 0,
    outbox: 0
  }
  totalUserMessagesPages = {
    inbox: 0,
    outbox: 0
  }
  isUserInboxResolved = new BehaviorSubject(false);
  isUserOutboxResolved = new BehaviorSubject(false);
  userThreads: Thread[] = [];
  userThreadsPage: number;
  totalUserThreadsPage: number;
  isUserThreadsResolved = new BehaviorSubject(false);
  activeThread = 0;
  threadMessages: Message[] = [];
  threadPage: number;
  totalThreadPages: number;
  isThreadResolved = new BehaviorSubject(false);

  // CTOR
  constructor(
    private Http: HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService) {
      // default assignment
      this.fullItemsPage.fullNewItems = 1;
      this.fullItemsPage.fullSuggestedItems = 1;
      this.totalFullItemsPage.fullNewItems = 1;
      this.totalFullItemsPage.fullSuggestedItems = 1;
      this.userPostsPage = 1;
      this.totalUserPostsPages = 1;
      this.userMessagesPage.inbox = 1;
      this.totalUserMessagesPages.inbox = 1;
      this.userMessagesPage.outbox = 1;
      this.totalUserMessagesPages.outbox = 1;
      this.userThreadsPage = 1;
      this.totalUserThreadsPage = 1;
      this.threadPage = 1;
      this.totalThreadPages = 1;
  }

  // POST-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getItems()
  Function Description: Gets ten recent posts and ten suggested posts for the
                        main page (MainPage component).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getItems() {
    this.Http.get(this.serverUrl).subscribe((response:any) => {
      let data = response;
      this.newItemsArray = data.recent;
      this.sugItemsArray = data.suggested;
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: getNewItems()
  Function Description: Gets a paginated list of new items.
  Parameters: page (number) - Current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getNewItems(page:number) {
    // URL and page query parameter
    const Url = this.serverUrl + '/posts/new';
    const params = new HttpParams().set('page', `${page}`);

    // HTTP request
    this.Http.get(Url, {
      params: params
    }).subscribe((response: any) => {
      let data = response.posts;
      this.fullItemsList.fullNewItems = data;
      this.fullItemsPage.fullNewItems = page;
      this.totalFullItemsPage.fullNewItems = response.total_pages;
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: getSuggestedItems()
  Function Description: Gets a paginated list of suggested items.
  Parameters: page (number) - Current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getSuggestedItems(page:number) {
    // URL and page query parameter
    const Url = this.serverUrl + '/posts/suggested';
    const params = new HttpParams().set('page', `${page}`);

    // HTTP request
    this.Http.get(Url, {
      params: params
    }).subscribe((response: any) => {
      let data = response.posts;
      this.fullItemsList.fullSuggestedItems = data;
      this.fullItemsPage.fullSuggestedItems = page;
      this.totalFullItemsPage.fullSuggestedItems = response.total_pages;
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: getUserPosts()
  Function Description: Gets a paginated list of the user's posts.
  Parameters: userID (number) - the ID of the user whose posts need to be fetched.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getUserPosts(userID:number) {
    const Url = this.serverUrl + `/users/${userID}/posts`;
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userPostsPage ? this.userPostsPage : 1;
    const params = new HttpParams().set('page', `${currentPage}`);

    // HTTP request
    this.Http.get(Url, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let data = response.posts;
      this.userPosts = data;
      this.totalUserPostsPages = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userPostsPage = this.totalUserPostsPages ? response.page : 0;
      this.isUserPostsResolved.next(true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserPostsResolved.next(true);
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: sendPost()
  Function Description: Create a new post.
  Parameters: post (Post) - the post to attempt to add to the database.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendPost(post: Post) {
    const Url = this.serverUrl + '/posts';
    this.Http.post(Url, post, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your post was published! Return to home page to view the post.', false, '/');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: deletePost()
  Function Description: Delete a post from the database.
  Parameters: post_id (number) - the ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(post_id:number) {
    const Url = this.serverUrl + `/posts/${post_id}`;
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert(`Post ${response.deleted} was deleted. Refresh to view the updated post list.`, true);
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: editPost()
  Function Description: Edit an existing post. This is used only for editing the post's text.
  Parameters: post (Post) - the updated data of the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post: Post) {
    const Url = this.serverUrl + `/posts/${post.id}`;
    this.Http.patch(Url, post, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your post was edited. Refresh to view the updated post.', true);
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written.
  Parameters: item (Post) - the post for which to send a hug.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(item: any) {
    const Url = this.serverUrl + `/posts/${item.id}`;
    item.givenHugs += 1;
    this.Http.patch(Url, item, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your hug was sent!', false);
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
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
    const Url = this.serverUrl + `/users/${userID}`

    // Get the user's data from the server
    this.Http.get(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      let user = response.user;
      this.userData = {
        id: user.id,
        displayName: user.displayName,
        receivedHugs: user.receivedH,
        givenHugs: user.givenH,
        role: user.role,
        postsNum: user.posts
      }
      this.isOtherUserResolved.next(true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isOtherUserResolved.next(true);
      this.createErrorAlert(err);
    });
  }

  // MESSAGE-RELATED METHODS
  // ==============================================================
  /*
  Function Name: getMessages()
  Function Description: Checks which mailbox was requested and forwards the request
                        to the appropriate getter function.
  Parameters: type (string) - Type of mailbox to fetch.
              userID (number) - the ID of the user whose messages to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getMessages(type:string, userID:number) {
    if(type == 'inbox') {
      this.getInboxMessages(userID);
    }
    else if(type == 'outbox') {
      this.getOutboxMessages(userID);
    }
    else if(type == 'threads') {
      this.getThreads(userID);
    }
  }

  /*
  Function Name: getInboxMessages()
  Function Description: Get the user's incoming messages.
  Parameters: userID (number) - the ID of the user whose messages to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getInboxMessages(userID:number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userMessagesPage.inbox ? this.userMessagesPage.inbox : 1;
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${currentPage}`)
      .set('type', 'inbox');
    // try to get the user's messages
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let messages = response.messages;
      this.userMessages.inbox = [];
      messages.forEach((element: Message) => {
        this.userMessages.inbox.push(element);
      });
      this.totalUserMessagesPages.inbox = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userMessagesPage.inbox = this.totalUserMessagesPages.inbox ? response.current_page : 0;
      this.isUserInboxResolved.next(true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserInboxResolved.next(true);
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: getOutboxMessages()
  Function Description: Get the user's outgoing messages.
  Parameters: userID (number) - the ID of the user whose messages to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getOutboxMessages(userID:number) {
    // if the current page is 0, send page 1 to the server (default)
    const currentPage = this.userMessagesPage.outbox ? this.userMessagesPage.outbox : 1;
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${currentPage}`)
      .set('type', 'outbox');
    // try to get the user's messages
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let messages = response.messages;
      this.userMessages.outbox = [];
      messages.forEach((element: Message) => {
        this.userMessages.outbox.push(element);
      });
      this.totalUserMessagesPages.outbox = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userMessagesPage.outbox = this.totalUserMessagesPages.outbox ? response.current_page : 0;
      this.isUserOutboxResolved.next(true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserOutboxResolved.next(true);
      this.createErrorAlert(err);
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
    const currentPage = this.userThreadsPage ? this.userThreadsPage : 1;
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${currentPage}`)
      .set('type', 'threads');
    // try to get the user's messages
    this.Http.get(`${this.serverUrl}/messages`, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let threads = response.messages;
      this.userThreads = [];
      threads.forEach((element: any) => {
        let thread: Thread = {
          id: element.id,
          user: (element.user1 == this.authService.userData.displayName) ? element.user2 : element.user1,
          userID: (element.user1Id == this.authService.userData.id) ? element.user2Id : element.user1Id,
          numMessages: element.numMessages,
          latestMessage: element.latestMessage
        }
        this.userThreads.push(thread);
      });
      this.totalUserThreadsPage = response.total_pages;
      // if there are 0 pages, current page is also 0; otherwise it's whatever
      // the server returns
      this.userThreadsPage = this.totalUserThreadsPage ? response.current_page : 0;
      this.isUserThreadsResolved.next(true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isUserThreadsResolved.next(true);
      this.createErrorAlert(err);
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
    // try to get the user's messages
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
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.isThreadResolved.next(true);
      this.createErrorAlert(err);
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
        this.createSuccessAlert('Your message was sent!', false, '/');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a message.
  Parameters: messageId (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageId:number) {
    const Url = this.serverUrl + `/messages/${messageId}`

    // try to delete the message
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.createSuccessAlert(`Message ${response.deleted} was deleted! Refresh to view the updated message list.`, true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  /*
  Function Name: deleteThread()
  Function Description: Delete a thread.
  Parameters: threadId (number) - the ID of the thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId:number) {
    const Url = this.serverUrl + `/messages?threadID=${threadId}`

    // try to delete the thread
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.createSuccessAlert(`Message ${response.deleted} was deleted! Refresh to view the updated message list.`, true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // ALERT METHODS
  // ==============================================================
  /*
  Function Name: createSuccessAlert()
  Function Description: Creates an alert for the user to know their action succeeded.
  Parameters: message (string) - the alert text.
              reload (boolean) - whether a reload button is required; defaults to false.
              navigate (string) - Optional parameter indicating the navigation target (if needed).
  ----------------
  Programmer: Shir Bar Lev.
  */
  createSuccessAlert(message:string, reload:boolean = false, navigate?:string) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Success',
      message: message
    }

    this.alertsService.createAlert(alert, reload, navigate);
  }

  /*
  Function Name: createErrorAlert()
  Function Description: Checks what type of error occurred and returns an alert.
  Parameters: err (HttpErrorResponse) - The HTTP error response from the server.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createErrorAlert(err:HttpErrorResponse) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Error',
      message: err.error.message
    }

    // if it's an auth error, the structure is slightly different
    if(err.status == 403 || err.status == 401) {
      alert.message = err.error.message.description;
    }

    this.alertsService.createAlert(alert);
  }
}
