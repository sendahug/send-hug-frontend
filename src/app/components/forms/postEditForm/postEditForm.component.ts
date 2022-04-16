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
import { Post } from '../../../interfaces/post.interface';
import { PostsService } from '../../../services/posts.service';
import { AdminService } from '../../../services/admin.service';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'post-edit-form',
  templateUrl: './postEditForm.component.html'
})
export class PostEditForm {
  // type of item to edit
  @Input() toEdit: string | undefined;
  // item to edit
  @Input() editedItem!: Post;
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Input() reportData: any;

  // CTOR
  constructor(
    private postsService:PostsService,
    private adminService:AdminService,
    private alertsService:AlertsService
  ) {

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

    // if there's text in the textbox, change the post's text
    if(newText) {
      // if the new post text is longer than 480 characters, alert the user
      if(newText.length > 480) {
        this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be over 480 characters! Please shorten the post and try again.' });
        document.getElementById('postText')!.classList.add('missing');
        document.getElementById('postText')!.setAttribute('aria-invalid', 'true');
      }
      // otherwise edit the post
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('postText')!.classList.contains('missing')) {
          document.getElementById('postText')!.classList.remove('missing');
        }
        document.getElementById('postText')!.setAttribute('aria-invalid', 'false');

        this.editedItem.text = newText;
        this.postsService.editPost(this.editedItem);
        // check whether the post's data was updated in the database
        this.postsService.isUpdated.subscribe((_value: Boolean) => {
          // if it has, close the popup; otherwise, leave it on so that the user
          // can fix whatever errors they have and try again
          this.editMode.emit(false);
        })
      }
    }
    // otherwise alert the user that a post cannot be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be empty. Please fill the field and try again.' });
      document.getElementById('postText')!.classList.add('missing');
      document.getElementById('postText')!.setAttribute('aria-invalid', 'true');
    }
  }

  /*
  Function Name: editPost()
  Function Description: Edits a post's text from admin dashboard.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newText (string) - A string containing the new post's text.
              closeReport (boolean) - whether to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(e:Event, newText:string, closeReport:boolean) {
    e.preventDefault();

    // if there's text in the textbox, change the post's text
    if(newText) {
      // if the new post text is longer than 480 characters, alert the user
      if(newText.length > 480) {
        this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be over 480 characters! Please shorten the post and try again.' });
        document.getElementById('adPostText')!.classList.add('missing');
        document.getElementById('adPostText')!.setAttribute('aria-invalid', 'true');
      }
      // otherwise edit the post
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('adPostText')!.classList.contains('missing')) {
          document.getElementById('adPostText')!.classList.remove('missing');
        }
        document.getElementById('adPostText')!.setAttribute('aria-invalid', 'false');

        let post = {
          text: newText,
          id: this.reportData.postID
        }

        this.adminService.editPost(post, closeReport, this.reportData.reportID);
        // check whether the post's data was updated in the database
        this.adminService.isUpdated.subscribe((value: Boolean) => {
          // if it has, close the popup; otherwise, leave it on so that the user
          // can fix whatever errors they have and try again
          this.editMode.emit(false);
        })
      }
    }
    // otherwise alert the user that a post cannot be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be empty. Please fill the field and try again.' });
      document.getElementById('adPostText')!.classList.add('missing');
      document.getElementById('adPostText')!.setAttribute('aria-invalid', 'true');
    }
  }
}
