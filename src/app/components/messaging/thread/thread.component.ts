/*
	Thread Component
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
import { Component, signal, computed, output, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

// App-related imports
import { UserIcon } from "@common/userIcon/userIcon.component";
import { ItemDeleteForm } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { ParsedThread } from "@app/interfaces/thread.interface";

@Component({
  selector: "app-single-thread",
  templateUrl: "./thread.component.html",
  styleUrl: "./thread.component.less",
  standalone: true,
  imports: [CommonModule, RouterLink, UserIcon, ItemDeleteForm],
})
export class AppSingleThread {
  // TODO: Replace this with `input()` once we figure out coverage
  @Input()
  set thread(newMessage: ParsedThread) {
    this._thread.set(newMessage);
  }
  _thread = signal<ParsedThread>({} as ParsedThread);
  messageDeleted = output<number>();
  deleteMode = signal(false);
  // Both the fields below are currently kept in for consistency but can be removed
  toDelete = signal("Thread");
  itemToDelete = computed<number>(() => this._thread().id);

  constructor() {}

  /**
   * Opens the delete popup to delete the current thread.
   */
  deleteThread() {
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
