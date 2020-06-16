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
  editType: string = 'post';
  editMode:boolean;
  // loader sub-component variable
  waitFor = 'user posts';
  // The user whose posts to fetch
  @Input()
  userID:number | undefined;
  user: 'self' | 'other';

  // CTOR
  constructor(public itemsService:ItemsService,
    private authService:AuthService ) {
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
  }

  ngOnInit() {
    this.user = (this.userID) ? 'other' : 'self';
  }

  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: post (Post) - Post to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post:Post) {
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
    this.itemsService.deletePost(post_id);
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
    this.itemsService.getUserPosts(this.authService.userData.id!);
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
    this.itemsService.getUserPosts(this.authService.userData.id!);
  }
}
