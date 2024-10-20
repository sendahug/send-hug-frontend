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
import { CommonModule } from "@angular/common";
import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-pop-up",
  templateUrl: "./popUp.component.html",
  styleUrl: "./popUp.component.less",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
})
export class PopUp implements OnInit, AfterViewInit, AfterViewChecked {
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  focusableElements: any;
  checkFocusBinded = this.checkFocus.bind(this);
  lastFocusedElement: HTMLElement | null = null;
  @ViewChild("exitButton") exitButton!: ElementRef;
  // icons
  faTimes = faTimes;

  // CTOR
  constructor() {}

  /**
   * Angular's OnInit lifecycle hook. It sets the current active element as the
   * last focused element (to be restored when the popup is closed).
   */
  ngOnInit() {
    this.lastFocusedElement = document.activeElement as HTMLElement | null;
  }

  /**
   * Angular's AfterViewInit hook. It sets the popup's exit button as the
   * active element.
   */
  ngAfterViewInit(): void {
    this.exitButton.nativeElement.focus();
  }

  /**
   * Angular's AfterViewChecked lifecycle hook. It gets all focusable elements within the
   * popup and adds a listener for keyboard navigation to trap the focus within the popup.
   */
  ngAfterViewChecked() {
    let modal = document.getElementById("modalBox");
    this.focusableElements = modal!.querySelectorAll(`a, button:not([disabled]),
          input:not([disabled]), textarea:not([disabled]), select:not([disabled]),
          details, iframe, object, embed, [tabindex]:not([tabindex="-1"]`);
    modal!.addEventListener("keydown", this.checkFocusBinded);
  }

  /**
   * Checks the currently focused element to ensure that the user's focus
   * remains within the popup. Runs every time the user enters a key.
   * @param e - the keyboard input event.
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

  /**
   * Emits an event to disable edit mode. Exiting edit mode is
   * done by the parent component upon getting the 'false' value.
   * The user's focus is also moved back to the last focused element
   * before opening the popup.
   */
  exitEdit() {
    let modal = document.getElementById("modalBox");
    modal!.removeEventListener("keydown", this.checkFocusBinded);
    this.lastFocusedElement?.focus();
    this.editMode.emit(false);
  }
}
