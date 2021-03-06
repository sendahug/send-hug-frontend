/*
	Posts Service Mock for testing
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
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { MockAlertsService } from './alerts.service.mock';

@Injectable({
  providedIn: 'root'
})
export class MockPostsService {
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
    private alertsService:MockAlertsService
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

    // mock data
    this.newItemsArray = [
      {
        'date': new Date('2020-06-27 19:17:31.072'),
        'givenHugs': 0,
        'id': 1,
        'text': 'test',
        'userId': 1,
        'user': 'test',
        'sentHugs': []
      },
      {
        'date': new Date('2020-06-28 19:17:31.072'),
        'givenHugs': 0,
        'id':2,
        'text': 'test2',
        'userId': 1,
        'user': 'test',
        'sentHugs': []
      }
    ];
    this.sugItemsArray = [
      {
        'date': new Date('2020-06-28 19:17:31.072'),
        'givenHugs': 0,
        'id': 2,
        'text': 'test2',
        'userId': 1,
        'user': 'test',
        'sentHugs': []
      },
      {
        'date': new Date('2020-06-27 19:17:31.072'),
        'givenHugs': 0,
        'id': 1,
        'text': 'test',
        'userId': 1,
        'user': 'test',
        'sentHugs': []
      }
    ];
    this.isMainPageResolved.next(true);
  }

  /*
  Function Name: getNewItems()
  Function Description: Gets a paginated list of new items.
  Parameters: page (number) - Current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getNewItems(page:number) {
    this.isPostsResolved.fullNewItems.next(false);

    if(page == 1) {
      this.fullItemsList.fullNewItems = [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        },
        {
          'date': new Date('2020-06-28 19:17:31.072'),
          'givenHugs': 0,
          'id':2,
          'text': 'test2',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ];
      this.fullItemsPage.fullNewItems = 1;
      this.totalFullItemsPage.fullNewItems = 2;
      this.isPostsResolved.fullNewItems.next(true);
    }
    else if(page == 2) {
      this.fullItemsList.fullNewItems = [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ];
      this.fullItemsPage.fullNewItems = 2;
      this.totalFullItemsPage.fullNewItems = 2;
      this.isPostsResolved.fullNewItems.next(true);
    }
    else {
      let err:HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'Not found'
      })
      this.alertsService.createErrorAlert(err);
    }
  }

  /*
  Function Name: getSuggestedItems()
  Function Description: Gets a paginated list of suggested items.
  Parameters: page (number) - Current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getSuggestedItems(page:number) {
    this.isPostsResolved.fullSuggestedItems.next(false);

    if(page == 1) {
      this.fullItemsList.fullSuggestedItems = [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        },
        {
          'date': new Date('2020-06-28 19:17:31.072'),
          'givenHugs': 0,
          'id':2,
          'text': 'test2',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ];
      this.fullItemsPage.fullSuggestedItems = 1;
      this.totalFullItemsPage.fullSuggestedItems = 2;
      this.isPostsResolved.fullSuggestedItems.next(true);
    }
    else if(page == 2) {
      this.fullItemsList.fullSuggestedItems = [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ];
      this.fullItemsPage.fullSuggestedItems = 2;
      this.totalFullItemsPage.fullSuggestedItems = 2;
      this.isPostsResolved.fullSuggestedItems.next(true);
    }
    else {
      let err:HttpErrorResponse = new HttpErrorResponse({
        status: 404,
        statusText: 'Not found'
      })
      this.alertsService.createErrorAlert(err);
    }
  }

  /*
  Function Name: sendPost()
  Function Description: Create a new post.
  Parameters: post (Post) - the post to attempt to add to the database.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendPost(post: Post) {
    this.alertsService.createSuccessAlert('Your post was published! Return to home page to view the post.', false, '/');
  }

  /*
  Function Name: deletePost()
  Function Description: Delete a post from the database.
  Parameters: post_id (number) - the ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(post_id:number) {
    this.alertsService.createSuccessAlert(`Post ${post_id} was deleted. Refresh to view the updated post list.`, true);
  }

  /*
  Function Name: deleteAllPosts()
  Function Description: Delete all of a user's posts.
  Parameters: userID (number) - the ID of the user whose posts to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllPosts(userID:number) {
    this.alertsService.createSuccessAlert(`User ${userID}'s posts were deleted successfully. Refresh to view the updated profile.`, true);
  }

  /*
  Function Name: editPost()
  Function Description: Edit an existing post. This is used only for editing the post's text.
  Parameters: post (Post) - the updated data of the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post: Post) {
    this.isUpdated.next(false);

    this.alertsService.createSuccessAlert('Your post was edited. Refresh to view the updated post.', true);
    this.isUpdated.next(true);
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written.
  Parameters: item (Post) - the post for which to send a hug.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(item: any) {
    item.givenHugs += 1;
    this.alertsService.createSuccessAlert('Your hug was sent!', false);

    // Check which array the item is in
    this.disableHugButton(this.newItemsArray, '.newItem', item.id);
    this.disableHugButton(this.sugItemsArray, '.sugItem', item.id);
    this.disableHugButton(this.fullItemsList.fullNewItems, '.newItem', item.id);
    this.disableHugButton(this.fullItemsList.fullSuggestedItems, '.newItem', item.id);
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
