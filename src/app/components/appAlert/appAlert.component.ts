/*
	App Alert Component
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
import { Component, computed } from "@angular/core";

// App-related imports
import { AlertsService } from "@app/services/alerts.service";

@Component({
  selector: "app-alert",
  templateUrl: "./appAlert.component.html",
})
export class AppAlert {
  alertClass = computed(() => ({
    [`alertMessage ${this.alertsService.alertType()}`]: true,
    hidden: !this.alertsService.shouldDisplayAlert(),
  }));
  alertRole = computed(() =>
    this.alertsService.alertType() === "Error" ? "alertdialog" : "alert",
  );
  alertAriaLabel = computed(() =>
    this.alertsService.alertType() === "Error" ? "An error has occurred" : "",
  );
  alertAriaLive = computed(() => (this.alertsService.shouldDisplayAlert() ? "assertive" : "off"));
  alertIconClass = computed(() => {
    const iconBaseClass = "alertIcon";

    switch (this.alertsService.alertType()) {
      case "Success":
        return `${iconBaseClass} far fa-check-circle`;
      case "Error":
        return `${iconBaseClass} far fa-times-circle`;
      case "Notification":
        return `${iconBaseClass} far fa-bel`;
    }
  });

  constructor(protected alertsService: AlertsService) {}

  /**
   * Closes the alert message.
   */
  closeAlert() {
    this.alertsService.shouldDisplayAlert.set(false);
  }

  /**
   * Calls the alertsService to reload the page (and update the ServiceWorker
   * if the reload is due to the service worker update).
   */
  reloadPage() {
    this.alertsService.reloadPage();
  }
}
