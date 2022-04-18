/*
	Popup
	Send a Hug Component
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
import { Component, Input, Output, EventEmitter } from '@angular/core';

// App-related import
import { AuthService } from '../../../services/auth.service';
import { ItemsService } from '../../../services/items.service';
import { PostsService } from '../../../services/posts.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'item-delete-form',
  templateUrl: './itemDeleteForm.component.html'
})
export class ItemDeleteForm {
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  // type of item to delete
  @Input() toDelete: string | undefined;
  // the item to delete itself
  @Input() itemToDelete: number | undefined;
  @Input() messType: string | undefined;
  @Input() reportData: any;

  // CTOR
  constructor(
    public authService:AuthService,
    private itemsService:ItemsService,
    private postsService:PostsService,
    private adminService:AdminService,
  ) {

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
      this.postsService.deletePost(this.itemToDelete!);
    }
    // if it's a message, send a request to delete the message
    else if(this.toDelete == 'Message') {
      this.itemsService.deleteMessage(this.itemToDelete!, this.messType!);
    }
    // if it's a thread, send a request to delete the thread
    else if(this.toDelete == 'Thread') {
      this.itemsService.deleteThread(this.itemToDelete!);
    }
    // if the user is attempting to delete all of the user's posts
    else if(this.toDelete == 'All posts') {
      this.postsService.deleteAllPosts(this.itemToDelete!);
    }
    // if the user is attempting to delete all of their messages of a specific type
    else if(this.toDelete == 'All inbox' || this.toDelete == 'All outbox' || this.toDelete == 'All threads') {
      this.itemsService.deleteAll(this.toDelete, this.itemToDelete!);
    }

    this.editMode.emit(false);
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to the admin service to delete a post and
                        dismiss the report (if selected by the user).
  Parameters: closeReport (boolean) - whether or not to close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(closeReport:boolean) {
    this.adminService.deletePost(this.itemToDelete!, this.reportData, closeReport);
    this.editMode.emit(false);
  }
}
