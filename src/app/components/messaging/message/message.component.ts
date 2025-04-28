/*
	Message Component
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
import { Component, signal, computed, Output, Input, EventEmitter } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

// App-related imports
import { type MessageGet } from "@app/interfaces/message.interface";
import { UserIconComponent } from "@common/userIcon/userIcon.component";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { MessageType } from "@app/interfaces/types";

@Component({
  selector: "app-single-message",
  templateUrl: "./message.component.html",
  styleUrl: "./message.component.less",
  standalone: true,
  imports: [CommonModule, RouterLink, UserIconComponent, ItemDeleteFormComponent],
})
export class MessageComponent {
  // TODO: Replace these with `input()`/`output()` once we figure out coverage
  @Input() currentUser!: number;
  @Input()
  set message(newMessage: MessageGet) {
    this._message.set(newMessage);
  }
  readonly _message = signal<MessageGet>({} as MessageGet);
  @Input() messType!: MessageType;
  @Output() messageDeleted = new EventEmitter<number>();
  readonly userIconToShow = computed(() => {
    if (this.messType == "thread") return this._message().from;

    return this._message().forId == this.currentUser ? this._message().from : this._message().for;
  });
  readonly displayFor = computed(
    () => this._message().fromId == this.currentUser || this.messType == "thread",
  );
  readonly displayFrom = computed(
    () => this._message().forId == this.currentUser || this.messType == "thread",
  );
  readonly deleteMode = signal(false);
  // Delete Popup Constants
  readonly deleteEndpoint = computed(() => `messages/${this.messType}`);
  readonly itemType = "Message";

  /**
   * Opens the delete popup to delete the current message.
   */
  deleteMessage() {
    this.deleteMode.set(true);
  }

  /**
   * Remove the edit popup.
   * @param edit - indicating whether edit mode should be active.
   *               When the user finishes editing, the event emitter
   *               in the popup component sends 'false' to this function
   *               to remove the popup.
   */
  changeMode(edit: boolean) {
    this.deleteMode.set(edit);
  }
}
