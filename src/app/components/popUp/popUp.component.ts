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

  constructor(public authService:AuthService,
    private itemsService:ItemsService) {

  }

  // edit the user's display name
  updateDisplayN(e:Event, newDisplayName:string) {
    e.preventDefault();
    this.authService.userData.displayName = newDisplayName;
    this.authService.updateUserData();
    this.editMode.emit(false);
  }

  // edit a post's text
  updatePost(e:Event, newText:string) {
    e.preventDefault();
    this.editedItem.text = newText;
    this.itemsService.editPost(this.editedItem);
    this.editMode.emit(false);
  }
}
