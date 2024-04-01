/*
	PostEditForm
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
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

// App-related import
import { Post } from "@app/interfaces/post.interface";
import { ItemsService } from "@app/services/items.service";
import { AdminService } from "@app/services/admin.service";
import { ValidationService } from "@app/services/validation.service";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "post-edit-form",
  templateUrl: "./postEditForm.component.html",
})
export class PostEditForm implements OnInit {
  // item to edit
  @Input() editedItem!: Post;
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Input() reportData: any;
  @Input() isAdmin = false;
  postEditForm = this.fb.group({
    postText: ["", [Validators.required, Validators.minLength(1)]],
  });

  // CTOR
  constructor(
    private itemsService: ItemsService,
    private adminService: AdminService,
    private validationService: ValidationService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.postEditForm.get("postText")?.setValue(this.editedItem.text);
  }

  /*
  Function Name: editPost()
  Function Description: Edits a post's text from admin dashboard.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              closeReport (optional boolean) - whether to also close the report if the sender
                                               is the admin's report page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(e: Event, closeReport: boolean | null) {
    e.preventDefault();

    const serviceToUse = closeReport === null ? "itemsService" : "adminService";
    const newText = this.postEditForm.get("postText")?.value || "";

    // if the post is valid, edit the text
    if (
      this.postEditForm.valid &&
      this.validationService.validateItem("post", newText, "postText")
    ) {
      // if there isn't a value for closeReport, it means it's sent from the regular edit
      if (closeReport === null) {
        this.editedItem.text = newText;
        this.itemsService.editPost(this.editedItem);
        // otherwise if there's a value it's coming from admin dashboard editing
      } else {
        let post = {
          text: newText,
          id: this.reportData.postID,
        };

        this.adminService.editPost(post, closeReport, this.reportData.reportID);
      }

      // check whether the post's data was updated in the database
      this[serviceToUse].isUpdated.subscribe((value: Boolean) => {
        // if it has, close the popup; otherwise, leave it on so that the user
        // can fix whatever errors they have and try again
        if (value) {
          this.editMode.emit(false);
        }
      });
    }
  }
}
