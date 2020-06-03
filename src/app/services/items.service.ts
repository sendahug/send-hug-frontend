// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { Message } from '../interfaces/message.interface';
import { AlertMessage } from '../interfaces/alert.interface';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private serverUrl = 'http://localhost:5000'
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
  // User messages variables
  userMessages: Message[] = [];
  userMessagesPage: number;
  totalUserMessagesPages: number;

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
      this.userMessagesPage = 1;
      this.totalUserPostsPages = 1;
      this.totalUserMessagesPages = 1;
  }

  // POST-RELATED METHODS
  // ==============================================================
  // Gets ten recent and ten suggested items
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

  // Gets a list of new items.
  getNewItems(page:number) {
    const Url = this.serverUrl + '/posts/new';
    const params = new HttpParams().set('page', `${page}`);
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

  // Gets a list of suggested items
  getSuggestedItems(page:number) {
    const Url = this.serverUrl + '/posts/suggested';
    const params = new HttpParams().set('page', `${page}`);
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

  // Gets the user's posts
  getUserPosts(userID:number) {
    const Url = this.serverUrl + `/users/${userID}/posts`;
    const params = new HttpParams().set('page', `${this.userPostsPage}`);
    this.Http.get(Url, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let data = response.posts;
      this.userPosts = data;
      this.totalUserPostsPages = response.total_pages;
      this.userPostsPage = response.page;
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // Post a new post
  sendPost(post: Post) {
    const Url = this.serverUrl + '/posts';
    this.Http.post(Url, post, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your post was published!');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // Delete a post
  deletePost(post_id:number) {
    const Url = this.serverUrl + `/posts/${post_id}`;
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert(`Post ${response.deleted} was deleted.`);
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // Edit a post
  editPost(post: Post) {
    const Url = this.serverUrl + `/posts/${post.id}`;
    this.Http.patch(Url, post, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your post was edited. Refresh to view the updated post.');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // Send a hug
  sendHug(item: any) {
    const Url = this.serverUrl + `/posts/${item.id}`;
    item.givenHugs += 1;
    this.Http.patch(Url, item, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your hug was sent!');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // MESSAGE-RELATED METHODS
  // ==============================================================
  // Get the user's messages
  getMessages(userID:number) {
    let params = new HttpParams()
      .set('userID', `${userID}`)
      .set('page', `${this.userMessagesPage}`);
    // try to get the user's messages
    this.Http.get('http://localhost:5000/messages', {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      let messages = response.messages;
      this.userMessages = [];
      messages.forEach((element: Message) => {
        this.userMessages.push(element);
      });
      this.userMessagesPage = response.page;
      this.totalUserMessagesPages = response.total_pages;
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // Send a message
  sendMessage(message: Message) {
    const Url = this.serverUrl + '/messages';
    this.Http.post(Url, message, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      if(response.success == true) {
        this.createSuccessAlert('Your message was sent!');
      }
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // delete a message
  deleteMessage(messageId:number) {
    const Url = this.serverUrl + `/messages/${messageId}`

    // try to delete the message
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((response:any) => {
      this.createSuccessAlert(`Message ${response.deleted} was deleted!`);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      this.createErrorAlert(err);
    })
  }

  // Creates an alert for the user to know their action succeeded
  createSuccessAlert(message:string) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Success',
      message: message
    }

    this.alertsService.createAlert(alert);
  }

  // Checks what type of error occurred and returns an alert
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
