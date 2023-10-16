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
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  AfterViewChecked,
} from "@angular/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// App-related import
import { Post } from "@app/interfaces/post.interface";
import { OtherUser } from "@app/interfaces/otherUser.interface";

@Component({
  selector: "app-pop-up",
  templateUrl: "./popUp.component.html",
})
export class PopUp implements OnInit, OnChanges, AfterViewChecked {
  // type of item to edit
  @Input() toEdit: string | undefined;
  // item to edit
  @Input() editedItem: any;
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  // whether we're in delete (or edit) mode
  @Input() delete = false;
  // type of item to delete
  @Input() toDelete: string | undefined;
  // the item to delete itself
  @Input() itemToDelete: number | undefined;
  @Input() messType: string | undefined;
  // whether the user is reporting an item
  @Input() report = false;
  // reported post
  @Input() reportedItem: Post | OtherUser | undefined;
  // type of item to report
  @Input() reportType: "User" | "Post" | undefined;
  selectedReason: string | undefined;
  @Input() reportData: any;
  focusableElements: any;
  checkFocusBinded = this.checkFocus.bind(this);
  // icons
  faTimes = faTimes;

  // CTOR
  constructor() {}

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the mode the user is in (edit
                        or delete) and sets the component's variables accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    // if we're in delete mode, turn the values of edit variables to undefined
    if (this.delete) {
      this.toEdit = undefined;
      this.editedItem = undefined;
    }
    // if we're in edit mode, turn the values of delete variables to undefined
    else {
      this.toDelete = undefined;
      this.itemToDelete = undefined;
    }

    document.getElementById("exitButton")!.focus();
    if (document.getElementById("siteHeader")) {
      document.getElementById("siteHeader")!.className = "modal";
    }
  }

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the Component
                        has been added to the DOM. It gets all focusable elements within the
                        popup and sets the focus on the first element.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    let modal = document.getElementById("modalBox");
    this.focusableElements = modal!.querySelectorAll(`a, button:not([disabled]),
          input:not([disabled]), textarea:not([disabled]), select:not([disabled]),
          details, iframe, object, embed, [tabindex]:not([tabindex="-1"]`);
    modal!.addEventListener("keydown", this.checkFocusBinded);
  }

  /*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. It checks for the mode the user is in (edit
                        or delete) and sets the component's variables accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnChanges() {
    // if we're in delete mode, turn the values of edit variables to undefined
    if (this.delete) {
      this.toEdit = undefined;
      this.editedItem = undefined;
    }
    // if we're in edit mode, turn the values of delete variables to undefined
    else {
      this.toDelete = undefined;
      this.itemToDelete = undefined;
    }
  }

  /*
  Function Name: checkFocus()
  Function Description: Checks the currently focused element to ensure that the
                        user's focus remains within the popup.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkFocus(e: KeyboardEvent) {
    // if the pressed key is TAB
    if (e.key.toLowerCase() === "tab") {
      // if the user pressed SHIFT + TAB, which means they want to move backwards
      if (e.shiftKey) {
        // if the currently focused element in the first one in the popup,
        // move back to the last focusable element in the popup
        if (document.activeElement == this.focusableElements[0]) {
          this.focusableElements[this.focusableElements.length - 1].focus();
          e.preventDefault();
        }
      }
      // otherwise the user pressed just TAB, so they want to move forward
      else {
        // if the currently focused element in the last one in the popup,
        // move back to the first focusable element in the popup
        if (document.activeElement == this.focusableElements[this.focusableElements.length - 1]) {
          this.focusableElements[0].focus();
          e.preventDefault();
        }
      }
    }
  }

  /*
  Function Name: exitEdit()
  Function Description: Emits an event to disable edit mode. Exiting edit mode is
                        done by the parent component upon getting the 'false' value.
                        The user's focus is also moved back to the skip link.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  exitEdit() {
    let modal = document.getElementById("modalBox");
    modal!.removeEventListener("keydown", this.checkFocusBinded);
    if (document.getElementById("skipLink")) {
      document.getElementById("skipLink")!.focus();
    }
    if (document.getElementById("siteHeader")) {
      document.getElementById("siteHeader")!.className = "";
    }
    this.editMode.emit(false);
  }
}
