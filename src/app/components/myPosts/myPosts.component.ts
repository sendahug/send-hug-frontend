/*
	My Posts
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit, Input } from '@angular/core';

// App-related imports
import { Post } from '../../interfaces/post.interface';
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './myPosts.component.html'
})
export class MyPosts implements OnInit {
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  // loader sub-component variable
  waitFor = 'user posts';
  // The user whose posts to fetch
  @Input()
  userID:number | undefined;
  user: 'self' | 'other';

  // CTOR
  constructor(public itemsService:ItemsService,
    public authService:AuthService ) {
      // if there's a user ID in the viewed profile, get that user's posts
      if(this.userID) {
        this.itemsService.getUserPosts(this.userID);
        this.user = 'other';
      }
      // if there isn't, it's the user's own profile, so get their posts
      else {
        itemsService.getUserPosts(this.authService.userData.id!);
        this.user = 'self';
      }

      this.editMode = false;
      this.delete = false;
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the requested user's
                        identity (myself or someone else).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    // if the user ID is different than the logged in user, it's someone else
    if(this.userID && this.userID != this.authService.userData.id) {
      this.user = 'other';
    }
    // otherwise, if it's the same ID or there's no ID, get the user's profile
    else {
      this.user = 'self';
    }
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
  deletePost(post_id:number) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = post_id;
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of user posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.itemsService.userPostsPage[this.user] += 1;
    if(this.user == 'self') {
      this.itemsService.getUserPosts(this.authService.userData.id!);
    }
    else {
      this.itemsService.getUserPosts(this.userID!);
    }
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of user posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.itemsService.userPostsPage[this.user] -= 1;
    if(this.user == 'self') {
      this.itemsService.getUserPosts(this.authService.userData.id!);
    }
    else {
      this.itemsService.getUserPosts(this.userID!);
    }
  }
}
