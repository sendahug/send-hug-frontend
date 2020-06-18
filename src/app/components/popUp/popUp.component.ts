/*
	Popup
	Send a Hug Component
*/

// Angular imports
import { Component, Input, Output, EventEmitter } from '@angular/core';

// App-related import
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './popUp.component.html'
})
export class PopUp {
  // type of item to edit
  @Input()
  toEdit!: string;
  // item to edit
  @Input()
  editedItem!: any;
  // indicates whether edit mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Input() delete = false;
  @Input() toDelete: string | undefined;
  @Input() itemToDelete: any;

  // CTOR
  constructor(public authService:AuthService,
    private itemsService:ItemsService) {

  }

  /*
  Function Name: updateDisplayN()
  Function Description: Sends a request via the auth service to edit the user's display name.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newDisplayName (string) - A string containing the user's new name.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateDisplayN(e:Event, newDisplayName:string) {
    e.preventDefault();
    this.authService.userData.displayName = newDisplayName;
    this.authService.updateUserData();
    this.editMode.emit(false);
  }

  /*
  Function Name: updatePost()
  Function Description: Sends a request to edit a post's text to the items service.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newText (string) - A string containing the new text for the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updatePost(e:Event, newText:string) {
    e.preventDefault();
    this.editedItem.text = newText;
    this.itemsService.editPost(this.editedItem);
    this.editMode.emit(false);
  }

  /*
  Function Name: deleteItem()
  Function Description: Sends a request to delete a post or a message to the items service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem() {
    // if it's a post, send a request to delete the post
    if(this.toDelete == 'Post') {
      this.itemsService.deletePost(this.itemToDelete);
    }
    // if it's a message, send a request to delete the message
    else if(this.toDelete == 'Message') {
      this.itemsService.deleteMessage(this.itemToDelete);
    }
    // if it's a thread, send a request to delete the thread
    else if(this.toDelete == 'Thread') {
      this.itemsService.deleteThread(this.itemToDelete);
    }
    this.editMode.emit(false);
  }

  /*
  Function Name: exitEdit()
  Function Description: Emits an event to disable edit mode. Exiting edit mode is
                        done by the parent component upon getting the 'false' value.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  exitEdit() {
    this.editMode.emit(false);
  }
}
