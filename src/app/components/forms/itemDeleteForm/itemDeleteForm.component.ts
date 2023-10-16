/*
	Popup
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
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { tap } from "rxjs";

// App-related import
import { AdminService } from "@app/services/admin.service";
import { ApiClientService } from "@app/services/apiClient.service";
import { SWManager } from "@app/services/sWManager.service";
import { AlertsService } from "@app/services/alerts.service";

@Component({
  selector: "item-delete-form",
  templateUrl: "./itemDeleteForm.component.html",
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
    private adminService: AdminService,
    private apiClient: ApiClientService,
    private swManager: SWManager,
    private alertsService: AlertsService,
  ) {}

  /*
  Function Name: deleteItem()
  Function Description: Sends a request to delete a post or a message to the items service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem() {
    // if it's a single item, make the request to delete it
    if (this.toDelete == "Post" || this.toDelete == "Message" || this.toDelete == "Thread") {
      let url: string;
      let store: "posts" | "messages" | "threads";

      if (this.toDelete == "Post") {
        url = `posts/${this.itemToDelete}`;
        store = "posts";
      } else {
        url = `messages/${this.messType}/${this.itemToDelete}`;
        store = this.toDelete == "Message" ? "messages" : "threads";
      }

      this.deleteSingleItem(url, store);
    }
    // if the user is attempting to delete all of the user's posts
    else if (this.toDelete == "All posts") {
      this.deleteMultipleItems(`users/all/${this.itemToDelete}/posts`, "posts").subscribe(
        (response) => {
          // delete the posts from idb
          this.swManager.deleteItems("posts", "userId", response.userID);
        },
      );
    }
    // if the user is attempting to delete all of their messages of a specific type
    else if (
      this.toDelete == "All inbox" ||
      this.toDelete == "All outbox" ||
      this.toDelete == "All threads"
    ) {
      const mailbox_type = this.toDelete!.split(" ")[1];
      const params = { userID: this.itemToDelete };

      this.deleteMultipleItems(`messages/${mailbox_type}`, "messages", params).subscribe(
        (response) => {
          // delete all messages from idb
          // if the mailbox to be cleared is the threads mailbox, delete everything
          if (mailbox_type == "threads") {
            this.swManager.clearStore("messages");
            this.swManager.clearStore("threads");
          } else if (mailbox_type == "inbox") {
            this.swManager.deleteItems("messages", "forId", response.userID);
          } else if (mailbox_type == "outbox") {
            this.swManager.deleteItems("messages", "fromId", response.userID);
          }
        },
      );
    }

    this.editMode.emit(false);
  }

  /**
   * Deletes a single item (be it a post, a message or a thread).
   * @param url - the url to send the request to.
   * @returns an observable of the response.
   */
  deleteSingleItem(url: string, idbStore: "posts" | "messages" | "threads") {
    return this.apiClient
      .delete<{ success: boolean; deleted: number }>(url)
      .subscribe((response) => {
        this.alertsService.createSuccessAlert(
          `${this.toDelete} ${response.deleted} was deleted. Refresh to view the updated ${
            this.toDelete?.toLowerCase() || ""
          } list.`,
          true,
        );
        this.alertsService.toggleOfflineAlert();

        // delete the item from idb
        this.swManager.deleteItem(idbStore, response.deleted);

        if (this.toDelete == "Thread") {
          this.swManager.deleteItems("messages", "threadID", response.deleted);
        }
      });
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to the admin service to delete a post and
                        dismiss the report (if selected by the user).
  Parameters: closeReport (boolean) - whether or not to close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(closeReport: boolean) {
    this.adminService.deletePost(this.itemToDelete!, this.reportData, closeReport);
    this.editMode.emit(false);
  }

  /**
   * Deletes multiple items.
   * @param url - the url to send the request to.
   * @param itemType - the type of items to delete (for the success message).
   * @param params - any query parameters to send with the request.
   * @returns an observable of the response.
   */
  deleteMultipleItems(url: string, itemType: string, params?: { [key: string]: any }) {
    return this.apiClient
      .delete<{ success: boolean; userID: number; deleted: number }>(url, params)
      .pipe(
        tap(() => this.alertsService.toggleOfflineAlert()),
        tap((response) =>
          this.alertsService.createSuccessAlert(
            `${response.deleted} ${itemType} were deleted. Refresh to view the updated page.`,
            true,
          ),
        ),
      );
  }
}
