/*
	Alerts Service
	Send a Hug Service
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
import { Injectable, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

// App-related imports
import { AlertConfig, AlertMessage, MessageType } from "@app/interfaces/alert.interface";

@Injectable({
  providedIn: "root",
})
export class AlertsService {
  // Alert-component variables
  alertMessage = signal("");
  shouldDisplayAlert = signal(false);
  alertType = signal<MessageType>("Success");
  shouldDisplayReloadBtn = signal(false);
  shouldDisplayNavBtn = signal(false);
  navBtnTarget = signal("/");
  navBtnText = signal("Home Page");
  // ServiceWorker variables
  waitingServiceWorker: ServiceWorker | undefined;
  isSWRelated = false;
  // offline-related variables
  isOffline = new BehaviorSubject(false);

  // CTOR
  constructor() {}

  /**
   * Create a new alert and display it to the user, including required
   * buttons/links.
   * @param alert (AlertMessage) - The alert message to display (based on the alert interface).
   * @param config (AlertConfig) - Further configuration for the alert, including whether
   *                               to allow navigation and reloading (optional).
   */
  createAlert(alert: AlertMessage, config: AlertConfig = {}) {
    this.alertType.set(alert.type);
    this.alertMessage.set(alert.message);
    this.shouldDisplayAlert.set(true);

    // if reload option is required
    this.shouldDisplayReloadBtn.set(config.reload || false);

    // if return to homepage option is required
    if (config.navigate) {
      this.shouldDisplayNavBtn.set(true);
      this.navBtnText.set(config.navText || "Home Page");
      this.navBtnTarget.set(config.navTarget || "/");
    } else {
      this.shouldDisplayNavBtn.set(false);
    }
  }

  /*
  Function Name: closeAlert()
  Function Description: Removes the alert and reloads the page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reloadPage() {
    this.shouldDisplayAlert.set(false);

    // if the 'reload' came from a ServiceWorker-related popup, tell
    // the SW to skip waiting and activate the new SW
    if (this.isSWRelated && this.waitingServiceWorker) {
      this.waitingServiceWorker.postMessage({ action: "skip waiting" });
      // wait for the new serviceworker to take over, and when it does,
      // reload the page
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
    // otherwise this isn't a SW-related reload, so just refresh
    else {
      window.location.reload();
    }
  }

  // CONVENIENCE METHODS
  // ==============================================================
  /**
   *  Creates an alert for the user to know their action succeeded.
   * @param message (string) - the alert text.
   * @param config (AlertConfig) - Further configuration for the alert, including whether
   *                               to allow navigation and reloading (optional).
   */
  createSuccessAlert(message: string, config: AlertConfig = {}) {
    // an alert message
    let alert: AlertMessage = {
      type: "Success",
      message: message,
    };

    this.isSWRelated = false;
    this.createAlert(alert, config);
  }

  /*
  Function Name: createErrorAlert()
  Function Description: Checks what type of error occurred and returns an alert.
  Parameters: err (HttpErrorResponse) - The HTTP error response from the server.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createErrorAlert(err: HttpErrorResponse) {
    // an alert message
    let alert: AlertMessage = {
      type: "Error",
      message: err.error.message,
    };

    // if it's an auth error, the structure is slightly different
    if (err.status == 403 || err.status == 401) {
      alert.message = err.error.message.description;
    }
    // if it's a validation error, the structure is slightly differen
    else if (err.status == 400 && typeof err.error.message == "object") {
      alert.message = err.error.message.description;
    }
    // if it's a 'server unavilable' error, it's (currently) sent by the
    // service worker, so it's a different structure
    else if (err.status == 503) {
      alert.message = err.statusText;
    }
    // otherwise, if zone.js / angular is overriding service worker responses with
    // 'unknown error' (detected by the user being offline), return the 'you're offline' response
    else if (err.status == 0 && !navigator.onLine) {
      alert.message =
        "The server isn't available at the moment. Try again when you're connected to the internet.";
    }

    this.isSWRelated = false;
    this.createAlert(alert, { reload: false, navigate: false });
  }

  /*
  Function Name: createSWAlert()
  Function Description: Creates a notification alert triggered by a new ServiceWorker
                        waiting to take control over the page.
  Parameters: worker (ServiceWorker) - The waiting SW.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createSWAlert(worker: ServiceWorker) {
    // set SW-related variables and creates a notification alert
    let alert: AlertMessage = {
      type: "Notification",
      message: `A new version of the site is available. Click the reload button to update!`,
    };
    this.waitingServiceWorker = worker;
    this.isSWRelated = true;
    this.createAlert(alert, { reload: true });
  }

  /*
  Function Name: toggleOfflineAlert()
  Function Description: Show/hide the message telling the user they're offline.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleOfflineAlert() {
    // if the user is offline, show it
    if (!navigator.onLine) {
      this.isOffline.next(true);
    }
    // otherwise hide it
    else {
      this.isOffline.next(false);
    }
  }
}
