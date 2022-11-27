/*
	Post
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faComment, faEdit, faFlag } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingHeart, faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-single-post',
  templateUrl: './post.component.html'
})
export class SinglePost {
  @Input() post!: Post;
  @Input() type!: 'n' | 's';
  @Input() class!: string;
  @Output() showMenu = new EventEmitter<string>();
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report:boolean;
  reportedItem: Post | undefined;
  reportType: 'Post' | undefined;
  lastFocusedElement: any;
  waitFor = 'main page';
  // icons
  faComment = faComment;
  faEdit = faEdit;
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;
  faTimes = faTimes;
  faEllipsisV = faEllipsisV;

  // CTOR
  constructor(
    public itemsService: ItemsService,
    public authService:AuthService,
    public postsService:PostsService
  ) {
    this.editMode = false;
    this.delete = false;
    this.report = false;
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written. The hug
                        itself is sent by the items service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug() {
    this.postsService.sendHug(this.post);
  }


  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost() {
    this.lastFocusedElement = document.activeElement;
    this.editType = 'post';
    this.postToEdit = this.post;
    this.editMode = true;
    this.delete = false;
    this.report = false;
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
    this.lastFocusedElement.focus();
  }

  /*
  Function Name: deletePost()
  Function Description: Send a request to the items service to delete a post.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost() {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = this.post.id;
    this.report = false;
  }

  /*
  Function Name: reportPost()
  Function Description: Opens the popup to report a post.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost() {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.postToEdit = undefined;
    this.editType = undefined;
    this.delete = false;
    this.report = true;
    this.reportedItem = this.post;
    this.reportType = 'Post';
  }

  /*
  Function Name: toggleOptions()
  Function Description: Opens a floating sub menu that contains the message, report, edit (if
                        applicable) and delete (if applicable) options on smaller screens.
  Parameters: itemNum (number) - ID of the item for which to open the submenu.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleOptions() {
    this.showMenu.emit(`${this.type}Post${this.post.id}`);
  }
}
