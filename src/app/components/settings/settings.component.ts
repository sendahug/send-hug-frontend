/*
	Settings Page
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
import { Component, AfterViewChecked } from "@angular/core";

// App-related imports
import { NotificationService } from "../../services/notifications.service";
import { AuthService } from "../../services/auth.service";
import { AlertsService } from "../../services/alerts.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
})
export class SettingsPage implements AfterViewChecked {
  editIcon = false;

  // CTOR
  constructor(
    public notificationService: NotificationService,
    public authService: AuthService,
    private alertsService: AlertsService,
  ) {}

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is checked by Angular. It updates the user's icon according to the colours
                        chosen by the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    Object.keys(this.authService.userData.iconColours).forEach((key) => {
      if (document.querySelectorAll(".userIcon")[0]) {
        document
          .querySelectorAll(".userIcon")[0]
          .querySelectorAll(`.${key as "character" | "lbg" | "rbg" | "item"}`)
          .forEach((element) => {
            (element as SVGPathElement).setAttribute(
              "style",
              `fill:${
                this.authService.userData.iconColours[key as "character" | "lbg" | "rbg" | "item"]
              };`,
            );
          });
      }
    });
  }

  /*
  Function Name: toggleIconEditor()
  Function Description: Opens/closes the icon editor.
  Parameters: edit (boolean) - optional; is sent by the IconEditor's EventEmitter to trigger
                                closing the edit panel.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleIconEditor(edit?: boolean) {
    if (edit) {
      this.editIcon = edit;
      document.getElementById("editIcon")!.focus();
    } else {
      this.editIcon = !this.editIcon;
    }
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
  Function Name: updateRefreshRate()
  Function Description: Updates the user's auto-refersh rate.
  Parameters: e (event) - the button click that triggers the method.
              newRate (number) - the new refresh rate in seconds.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateRefreshRate(e: Event, newRate: number) {
    e.preventDefault();

    // if there's a new rate, update user settings
    if (newRate) {
      this.notificationService.refreshRateSecs = Number(newRate);
      this.notificationService.updateUserSettings();
    }
    // if there's no rate or it's zero, alert the user it can't be
    else {
      this.alertsService.createAlert({
        type: "Error",
        message: "Refresh rate cannot be empty or zero. Please fill the field and try again.",
      });
      document.getElementById("notificationRate")!.classList.add("missing");
      document.getElementById("notificationRate")!.setAttribute("aria-invalid", "true");
    }
  }
}
