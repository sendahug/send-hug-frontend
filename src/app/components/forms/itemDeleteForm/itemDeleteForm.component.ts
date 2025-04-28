/*
	Popup
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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
import { Component, Output, EventEmitter, input } from "@angular/core";
import { tap } from "rxjs";
import { CommonModule } from "@angular/common";

// App-related import
import { AdminService } from "@app/services/admin.service";
import { ApiClientService } from "@app/services/apiClient.service";
import { SWManager } from "@app/services/sWManager.service";
import { AlertsService } from "@app/services/alerts.service";
import { PopUpComponent } from "@common/popUp/popUp.component";
import { TeleportDirective } from "@app/directives/teleport.directive";
import { APIParams, IdbStoreType, type MessageType } from "@app/interfaces/types";
import { ReportData } from "@app/interfaces/report.interface";

@Component({
  selector: "item-delete-form",
  templateUrl: "./itemDeleteForm.component.html",
  standalone: true,
  imports: [CommonModule, PopUpComponent, TeleportDirective],
})
export class ItemDeleteFormComponent {
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<number>();
  // type of item to delete
  readonly toDelete = input<string | undefined>();
  // the item to delete itself
  readonly itemToDelete = input<number | undefined>();
  readonly messType = input<MessageType | undefined>();
  readonly reportData = input<ReportData | undefined>();
  // New inputs
  readonly deleteEndpoint = input<string | undefined>();
  readonly itemType = input<"Post" | "Message" | "Thread" | undefined>();
  readonly itemId = input<number | undefined>();

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
    if (this.itemType() == "Post" || this.itemType() == "Message" || this.itemType() == "Thread") {
      this.deleteSingleItem();
    }
    // if the user is attempting to delete all of the user's posts
    else if (this.toDelete() == "All posts") {
      this.deleteMultipleItems(`users/${this.itemToDelete()}/posts`, "posts").subscribe(
        (response) => {
          // delete the posts from idb
          this.swManager.deleteItems("posts", "userId", response.userID);
          this.deleted.emit(response.userID);
          this.editMode.emit(false);
        },
      );
    }
    // if the user is attempting to delete all of their messages of a specific type
    else if (
      this.toDelete() == "All inbox" ||
      this.toDelete() == "All outbox" ||
      this.toDelete() == "All threads"
    ) {
      const mailbox_type = this.toDelete()!.split(" ")[1];

      this.deleteMultipleItems(`messages/${mailbox_type}`, "messages").subscribe((response) => {
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

        this.deleted.emit(this.itemToDelete());
        this.editMode.emit(false);
      });
    }
  }

  /**
   * Deletes a single item (be it a post, a message or a thread).
   * @returns a subscription generated by subscribing to the request observable.
   */
  deleteSingleItem() {
    if (!this.deleteEndpoint() || !this.itemId()) return;

    return this.apiClient
      .delete<{ success: boolean; deleted: number }>(`${this.deleteEndpoint()!}/${this.itemId()!}`)
      .pipe(
        tap((response) =>
          this.alertsService.createSuccessAlert(
            `${this.itemType()} ${response.deleted} was deleted.`,
          ),
        ),
      )
      .subscribe({
        next: (response) => {
          // delete the item from idb
          this.swManager.deleteItem(
            `${this.itemType()!.toLowerCase()}s` as IdbStoreType,
            response.deleted,
          );

          /**
           * @todo: This isn't the responsibility of this component,
           * this should be handled in the thread component.
           */
          if (this.itemType() == "Thread") {
            this.swManager.deleteItems("messages", "threadID", response.deleted);
          }

          this.deleted.emit(response.deleted);
          this.editMode.emit(false);
        },
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
    if (!this.reportData()) return;

    this.adminService.deletePost(this.itemToDelete()!, this.reportData()!, closeReport).add(() => {
      this.deleted.emit(this.itemToDelete());
      this.editMode.emit(false);
    });
  }

  /**
   * Deletes multiple items.
   * @param url - the url to send the request to.
   * @param itemType - the type of items to delete (for the success message).
   * @param params - any query parameters to send with the request.
   * @returns an observable of the response.
   */
  deleteMultipleItems(url: string, itemType: string, params?: APIParams) {
    return this.apiClient
      .delete<{ success: boolean; userID: number; deleted: number }>(url, params)
      .pipe(
        tap((response) =>
          this.alertsService.createSuccessAlert(`${response.deleted} ${itemType} were deleted.`),
        ),
      );
  }
}
