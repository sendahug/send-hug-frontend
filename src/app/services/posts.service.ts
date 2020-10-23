/*
	Posts Service
	Send a Hug Service
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
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { SWManager } from './sWManager.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  newItemsArray: Post[] = [];
  sugItemsArray: Post[] = [];
  isMainPageResolved = new BehaviorSubject(false);
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
  isPostsResolved = {
    fullNewItems: new BehaviorSubject(false),
    fullSuggestedItems: new BehaviorSubject(false)
  }
  isUpdated = new BehaviorSubject(false);

  // CTOR
  constructor(
    private Http: HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService,
    private serviceWorkerM:SWManager
  ) {
      // default assignment
      this.fullItemsPage.fullNewItems = 1;
      this.fullItemsPage.fullSuggestedItems = 1;
      this.totalFullItemsPage.fullNewItems = 1;
      this.totalFullItemsPage.fullSuggestedItems = 1;
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
    this.isMainPageResolved.next(false);

    // get the recent and suggested posts from IDB
    this.serviceWorkerM.queryPosts('main new')?.then((data:any) => {
      // if there are posts in cache, display them
      if(data.length) {
        this.newItemsArray = data;
        this.isMainPageResolved.next(true);
      }
    });
    this.serviceWorkerM.queryPosts('main suggested')?.then((data:any) => {
      // if there are posts in cache, display them
      if(data.length) {
        this.sugItemsArray = data;
        this.isMainPageResolved.next(true);
      }
    })

    // attempt to get more updated recent / suggested posts from the server
    this.Http.get(this.serverUrl).subscribe((response:any) => {
      let data = response;
      this.newItemsArray = data.recent;
      this.sugItemsArray = data.suggested;
      this.isMainPageResolved.next(true);
      this.alertsService.toggleOfflineAlert();

      // add each post in the 'recent' list to posts store
      data.recent.forEach((element:Post) => {
        let isoDate = new Date(element.date).toISOString();
        let post = {
          'date': element.date,
          'givenHugs': element.givenHugs,
          'id': element.id!,
          'isoDate': isoDate,
          'text': element.text,
          'userId': Number(element.userId),
          'user': element.user,
          'sentHugs': element.sentHugs!
        }
        this.serviceWorkerM.addItem('posts', post);
      });
      // add each post in the 'suggested' list to posts store
      data.suggested.forEach((element:Post) => {
        let isoDate = new Date(element.date).toISOString();
        let post = {
          'date': element.date,
          'givenHugs': element.givenHugs,
          'id': element.id!,
          'isoDate': isoDate,
          'text': element.text,
          'userId': Number(element.userId),
          'user': element.user,
          'sentHugs': element.sentHugs!
        }
        this.serviceWorkerM.addItem('posts', post);
      });
      this.serviceWorkerM.cleanDB('posts');
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      // if the server is unavilable due to the user being offline, tell the user
      if(!navigator.onLine) {
        this.isMainPageResolved.next(true);
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.isMainPageResolved.next(true);
        this.alertsService.createErrorAlert(err);
      }
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
    this.isPostsResolved.fullNewItems.next(false);

    // get the recent posts from IDB
    this.serviceWorkerM.queryPosts('new posts', undefined, page)?.then((data:any) => {
      // if there are posts in cache, display them
      if(data.length) {
        this.fullItemsList.fullNewItems = data;
        this.isPostsResolved.fullNewItems.next(true);
      }
    });

    // then try to get the recent posts from the server
    this.Http.get(Url, {
      params: params
    }).subscribe((response: any) => {
      let data = response.posts;
      this.fullItemsList.fullNewItems = data;
      this.fullItemsPage.fullNewItems = page;
      this.totalFullItemsPage.fullNewItems = response.total_pages;
      this.isPostsResolved.fullNewItems.next(true);
      this.alertsService.toggleOfflineAlert();

      // add each post in the 'recent' list to posts store
      data.forEach((element:Post) => {
        let isoDate = new Date(element.date).toISOString();
        let post = {
          'date': element.date,
          'givenHugs': element.givenHugs,
          'id': element.id!,
          'isoDate': isoDate,
          'text': element.text,
          'userId': Number(element.userId),
          'user': element.user,
          'sentHugs': element.sentHugs!
        }
        this.serviceWorkerM.addItem('posts', post);
      });
      this.serviceWorkerM.cleanDB('posts');
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      // if the server is unavilable due to the user being offline, tell the user
      if(!navigator.onLine) {
        this.isPostsResolved.fullNewItems.next(true);
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.isPostsResolved.fullNewItems.next(true);
        this.alertsService.createErrorAlert(err);
      }
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
    this.isPostsResolved.fullSuggestedItems.next(false);

    // get the recent posts from IDB
    this.serviceWorkerM.queryPosts('suggested posts', undefined, page)?.then((data:any) => {
      // if there are posts in cache, display them
      if(data.length) {
        this.fullItemsList.fullSuggestedItems = data;
        this.isPostsResolved.fullSuggestedItems.next(true);
      }
    });

    // HTTP request
    this.Http.get(Url, {
      params: params
    }).subscribe((response: any) => {
      let data = response.posts;
      this.fullItemsList.fullSuggestedItems = data;
      this.fullItemsPage.fullSuggestedItems = page;
      this.totalFullItemsPage.fullSuggestedItems = response.total_pages;
      this.isPostsResolved.fullSuggestedItems.next(true);
      this.alertsService.toggleOfflineAlert();

      // add each post in the 'recent' list to posts store
      data.forEach((element:Post) => {
        let isoDate = new Date(element.date).toISOString();
        let post = {
          'date': element.date,
          'givenHugs': element.givenHugs,
          'id': element.id!,
          'isoDate': isoDate,
          'text': element.text,
          'userId': Number(element.userId),
          'user': element.user,
          'sentHugs': element.sentHugs!
        }
        this.serviceWorkerM.addItem('posts', post);
      });
      this.serviceWorkerM.cleanDB('posts');
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      // if the server is unavilable due to the user being offline, tell the user
      if(!navigator.onLine) {
        this.isPostsResolved.fullSuggestedItems.next(true);
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.isPostsResolved.fullSuggestedItems.next(true);
        this.alertsService.createErrorAlert(err);
      }
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
    // if the user isn't blocked, let them post
    if(!this.authService.userData.blocked) {
      const Url = this.serverUrl + '/posts';
      this.Http.post(Url, post, {
        headers: this.authService.authHeader
      }).subscribe((response:any) => {
        this.alertsService.createSuccessAlert('Your post was published! Return to home page to view the post.', false, '/');
        this.alertsService.toggleOfflineAlert();

        let isoDate = new Date(response.posts.date).toISOString();
        let iDBPost = {
          'date': response.posts.date,
          'givenHugs': response.posts.givenHugs,
          'id': response.posts.id!,
          'isoDate': isoDate,
          'text': response.posts.text,
          'userId': Number(response.posts.userId),
          'user': response.posts.user,
          'sentHugs': response.posts.sentHugs!
        };
        this.serviceWorkerM.addItem('posts', iDBPost);
      // if there was an error, alert the user
      }, (err:HttpErrorResponse) => {
        // if the user is offline, show the offline header message
        if(!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      })
    }
    // if they're blocked, alert them they cannot post while blocked
    else {
      this.alertsService.createAlert({ type: 'Error', message: `You cannot post new posts while you're blocked. You're blocked until ${this.authService.userData.releaseDate}.` });
    }
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
      this.alertsService.createSuccessAlert(`Post ${response.deleted} was deleted. Refresh to view the updated post list.`, true);
      this.alertsService.toggleOfflineAlert();

      // delete the post from idb
      this.serviceWorkerM.deleteItem('posts', post_id);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
    })
  }

  /*
  Function Name: deleteAllPosts()
  Function Description: Delete all of a user's posts.
  Parameters: userID (number) - the ID of the user whose posts to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllPosts(userID:number) {
    const Url = this.serverUrl + `/users/all/${userID}/posts`;
    // send delete request
    this.Http.delete(Url, {
      headers: this.authService.authHeader
    }).subscribe((_response:any) => {
      this.alertsService.createSuccessAlert(`User ${userID}'s posts were deleted successfully. Refresh to view the updated profile.`, true);
      this.alertsService.toggleOfflineAlert();

      // delete the posts from idb
      this.serviceWorkerM.deleteItems('posts', 'userId', userID);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
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
    this.isUpdated.next(false);

    // send update request
    this.Http.patch(Url, post, {
      headers: this.authService.authHeader
    }).subscribe((_response:any) => {
      this.alertsService.createSuccessAlert('Your post was edited. Refresh to view the updated post.', true);
      this.alertsService.toggleOfflineAlert();
      this.isUpdated.next(true);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
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
    }).subscribe((_response:any) => {
      this.alertsService.createSuccessAlert('Your hug was sent!', false);
      this.alertsService.toggleOfflineAlert();

      // Check which array the item is in
      this.disableHugButton(this.newItemsArray, '.newItem', item.id);
      this.disableHugButton(this.sugItemsArray, '.sugItem', item.id);
      this.disableHugButton(this.fullItemsList.fullNewItems, '.newItem', item.id);
      this.disableHugButton(this.fullItemsList.fullSuggestedItems, '.newItem', item.id);
    // if there was an error, alert the user
    }, (err:HttpErrorResponse) => {
      item.givenHugs -= 1;
      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
    })
  }

  /*
  Function Name: disableHugButton()
  Function Description: Finds the post that got a new hug in all the posts lists and
                        disables the hug button (if the post exists) to prevent attempting
                        to send multiple hugs on one post.
  Parameters: checkList (Array) - the array to check for the existence of the post.
              itemClass (string) - the css class given to the items belonging to the list.
              itemID (number) - the ID of the item to look for.
  ----------------
  Programmer: Shir Bar Lev.
  */
  disableHugButton(checkList: any[], itemClass:string, itemID:number) {
    // Check if the post is in the given array
    let currentPostIndex = checkList.findIndex(e => e.id == itemID);
    if(currentPostIndex > 0) {
      // if it is, disable the send-hug button
      let post = document.querySelectorAll(itemClass)[currentPostIndex];
      post.querySelectorAll('.fa-hand-holding-heart').forEach((element) => {
        (element.parentElement as HTMLButtonElement).disabled = true;
      })
    }
  }
}
