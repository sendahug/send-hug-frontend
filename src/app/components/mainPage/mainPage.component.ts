/*
	Main Page
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './mainPage.component.html'
})
export class MainPage implements OnInit {
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string = 'post';
  editMode:boolean;

  // CTOR
  constructor(
    public itemsService: ItemsService,
    public authService:AuthService
  ) {
    this.itemsService.getItems();
    this.editMode = false;
  }

  ngOnInit() {

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
    let item = {};

    // if the item is in the new list, gets it from there
    if(this.itemsService.newItemsArray.filter(e => e.id == itemID)) {
      item = this.itemsService.newItemsArray.filter(e => e.id == itemID)[0];
    }
    // if not, the item must be in the suggested list, so it gets it from there
    else {
      item = this.itemsService.sugItemsArray.filter(e => e.id == itemID)[0];
    }

    this.itemsService.sendHug(item);
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
  deletePost(postID:number) {
    this.itemsService.deletePost(postID);
  }
}
