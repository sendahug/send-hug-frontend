/*
	Full List
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-full-list',
  templateUrl: './fullList.component.html'
})
export class FullList {
  // current page and type of list
  type:any;
  page:any;
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report:boolean;
  reportedItem: Post | undefined;
  reportType = 'Post';
  waitFor = '';

  // CTOR
  constructor(private route:ActivatedRoute,
    private router:Router,
    public authService:AuthService,
    public postsService:PostsService
  ) {
      // get the type of list and the current page
      this.type = this.route.snapshot.paramMap.get('type');
      this.page = Number(this.route.snapshot.queryParamMap.get('page'));

      // if the type is new items, get the new items
      if(this.type == 'New') {
        this.waitFor = 'new posts';
        this.postsService.getNewItems(this.page);
      }
      // if the type is suggested items, get the suggested items
      else if(this.type == 'Suggested') {
        this.waitFor = 'suggested posts';
        this.postsService.getSuggestedItems(this.page);
      }

      this.editMode = false;
      this.delete = false;
      this.report = false;
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written. The hug
                        itself is sent by the items service.
  Parameters: itemID (number) - ID of the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(itemID:number) {
    let item = {}
    // if the type of list is 'new posts', find the ID in the list of new posts
    if(this.type == 'New') {
      item = this.postsService.fullItemsList.fullNewItems.filter(e => e.id == itemID)[0];
    }
    // if the type of list is 'suggested posts', find the ID in the list of suggested posts
    else if(this.type == 'Suggested') {
      item = this.postsService.fullItemsList.fullSuggestedItems.filter(e => e.id == itemID)[0];
    }

    this.postsService.sendHug(item);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    // if the list is the new posts list, get the next page of new posts
    if(this.type == 'New') {
      this.page += 1;
      this.postsService.fullItemsPage.fullNewItems += 1;
      this.postsService.getNewItems(this.postsService.fullItemsPage.fullNewItems);
    }
    // if the list is the suggested posts list, get the next page of suggested posts
    else if(this.type == 'Suggested') {
      this.page += 1;
      this.postsService.fullItemsPage.fullSuggestedItems += 1;
      this.postsService.getSuggestedItems(this.postsService.fullItemsPage.fullSuggestedItems);
    }

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    // if the list is the new posts list, get the previous page of new posts
    if(this.type == 'New') {
      this.page -= 1;
      this.postsService.fullItemsPage.fullNewItems -= 1;
      this.postsService.getNewItems(this.postsService.fullItemsPage.fullNewItems);
    }
    // if the list is the suggested posts list, get the previous page of suggested posts
    else if(this.type == 'Suggested') {
      this.page -= 1;
      this.postsService.fullItemsPage.fullSuggestedItems -= 1;
      this.postsService.getSuggestedItems(this.postsService.fullItemsPage.fullSuggestedItems);
    }

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }

  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: post (Post) - Post to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post:Post) {
    this.editType = 'post';
    this.postToEdit = post;
    this.editMode = true;
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
  changeMode(edit:boolean) {
    this.editMode = edit;
  }

  /*
  Function Name: deletePost()
  Function Description: Send a request to the items service to delete a post.
  Parameters: post_id (number) - ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID:number) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = postID;
  }

  /*
  Function Name: reportPost()
  Function Description: Opens the popup to report a post.
  Parameters: post (Post) - the Post to report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost(post:Post) {
	  this.editMode = true;
	  this.delete = false;
	  this.report = true;
	  this.reportedItem = post;
  }
}
