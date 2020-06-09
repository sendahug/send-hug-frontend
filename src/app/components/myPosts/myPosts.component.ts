/*
	My Posts
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit } from '@angular/core';

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

  // CTOR
  constructor(public itemsService:ItemsService,
    private authService:AuthService ) {
      itemsService.getUserPosts(this.authService.userData.id!);
      this.editMode = false;
  }

  ngOnInit() {

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
    this.itemsService.userPostsPage += 1;
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
    this.itemsService.userPostsPage -= 1;
    this.itemsService.getUserPosts(this.authService.userData.id!);
  }
}
