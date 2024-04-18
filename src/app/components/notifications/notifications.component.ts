/*
	Admin Dashboard
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
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// App-relateed imports
import { AuthService } from "@common/services/auth.service";
import { NotificationService } from "@app/services/notifications.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
})
export class NotificationsTab implements OnInit {
  // indicates whether notifications panel is still required
  @Output() NotificationsMode = new EventEmitter<boolean>();
  focusableElements: any;
  checkFocusBinded = this.checkFocus.bind(this);
  // icons
  faTimes = faTimes;

  // CTOR
  constructor(
    private authService: AuthService,
    public notificationService: NotificationService,
  ) {
    // if the user is authenticated, get all notifications from
    // the last time the user checked them
    this.authService.isUserDataResolved.subscribe((value) => {
      if (value) {
        this.notificationService.getNotifications(false);
      }
    });
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It adds the 'modal' keyword to the header (which
                        is used to ensure the header remains under the modal box) and
                        puts the exit button in focus.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    document.getElementById("exitButton")!.focus();
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
  Function Name: togglePushNotifications()
  Function Description: Enables and disables push notifications.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  togglePushNotifications() {
    // if notifications are enabled, disable them
    if (this.notificationService.pushStatus) {
      this.notificationService.pushStatus = false;
      this.notificationService.updateUserSettings();
      this.notificationService.unsubscribeFromStream();
    }
    // otherwise enable them
    else {
      this.notificationService.pushStatus = true;
      this.notificationService.updateUserSettings();
      this.notificationService.subscribeToStream();
    }
  }

  /*
  Function Name: togglePushNotifications()
  Function Description: Enables and disables automatically refreshing the user's
                        notifications in the background.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleAutoRefresh() {
    // if auto-refresh is enabled, disable it
    if (this.notificationService.refreshStatus) {
      this.notificationService.refreshStatus = false;
      this.notificationService.refreshRateSecs = 0;
      this.notificationService.updateUserSettings();
      this.notificationService.stopAutoRefresh();
    }
    // otherwise enable it
    else {
      this.notificationService.refreshStatus = true;
      this.notificationService.refreshRateSecs = 20;
      this.notificationService.updateUserSettings();
      this.notificationService.startAutoRefresh();
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
  Function Name: exitNotifications()
  Function Description: Emits an event to disable notifications window. Exiting notifications window is
                        done by the parent component upon getting the 'false' value.
                        The user's focus is also moved back to the skip link.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  exitNotifications() {
    let modal = document.getElementById("modalBox");
    modal!.removeEventListener("keydown", this.checkFocusBinded);
    if (document.getElementById("skipLink")) {
      document.getElementById("skipLink")!.focus();
    }
    this.NotificationsMode.emit(false);
  }
}
