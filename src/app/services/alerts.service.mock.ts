/*
	Alerts Service
	Send a Hug Mock Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

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
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { AlertMessage } from '../interfaces/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class MockAlertsService {
  // ServiceWorker variables
  waitingServiceWorker: ServiceWorker | undefined;
  isSWRelated = false;
  // offline-related variables
  isOffline = new BehaviorSubject(false);

  // CTOR
  constructor() {
  }

  /*
  Function Name: createAlert()
  Function Description: Create a new alert and display it to the user. Checks to
                        ensure there's only one active alert and displays required
                        buttons/links.
  Parameters: alert (AlertMessage) - The alert message to display (based on the alert interface).
              reload (boolean) - Indicating whether a reload button is required.
              navigate (string) - Optional parameter indicating whether there needs to
                                  be a navigation link in the alert.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createAlert(alert:AlertMessage, reload:boolean = false, navigate?:string) {
    // checks if there's already an alert, in which case it's removed
    if(document.querySelector('.alertMessage')) {
      document.querySelector('.alertMessage')!.remove();
    }

    // builds the alert and adds it to the DOM; also adds an event listener to
    // the 'close' button.
    let alertMessage = this.buildAlertElement(alert);
    document.getElementsByTagName('div')[document.getElementsByTagName('div').length - 1]!.append(alertMessage);
    document.getElementById('alertButton')!.addEventListener('click', this.closeAlert);

    // if reload option is required
    if(reload) {
      this.addReloadButton(alertMessage);
      // add an event listener and bind 'this' to the AlertsService
      document.getElementById('reloadBtn')!.addEventListener('click', this.reloadPage.bind(this));
    }
    // if return to homepage option is required
    else if(navigate) {
      this.addNavigateButton(alertMessage, navigate);
    }
  }

  /*
  Function Name: closeAlert()
  Function Description: Removes the alert.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  closeAlert() {
    this.isSWRelated = false;
    document.querySelector('.alertMessage')!.remove();
  }

  /*
  Function Name: closeAlert()
  Function Description: Removes the alert and reloads the page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reloadPage() {
    document.querySelector('.alertMessage')!.remove();

    // if the 'reload' came from a ServiceWorker-related popup, tell
    // the SW to skip waiting and activate the new SW
    if(this.isSWRelated && this.waitingServiceWorker) {
      this.waitingServiceWorker.postMessage({ action: 'skip waiting'});
      // wait for the new serviceworker to take over, and when it does,
      // reload the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      })
    }
    // otherwise this isn't a SW-related reload, so just refresh
    else {
      window.location.reload();
    }
  }

  /*
  Function Name: buildAlertElement()
  Function Description: Builds the alert div element to add to the DOM.
  Parameters: alert (AlertMessage) - The alert message to display (based on the alert interface).
  ----------------
  Programmer: Shir Bar Lev.
  */
  buildAlertElement(alert:AlertMessage) {
    // alert div
    let alertMessage = document.createElement('div');
    alertMessage.className = `alertMessage ${alert.type}`;
    alertMessage.setAttribute('role', 'alert');

    let icon = document.createElement('i');
    let className: string;
    switch(alert.type) {
      case 'Success':
        className = 'far fa-check-circle';
        break;
      case 'Error':
        className = 'far fa-times-circle';
        break;
      case 'Notification':
        className = 'far fa-bel';
        break;
    }
    icon.className = `alertIcon ${className}`;
    alertMessage.append(icon);

    // alert title
    let alertHeadline = document.createElement('h3');
    alertHeadline.className = `alertType`;
    alertHeadline.textContent = alert.type;
    alertMessage.append(alertHeadline);

    // alert text
    let alertText = document.createElement('div');
    alertText.className = 'alertText';
    alertText.textContent = alert.message;
    alertMessage.append(alertText);

    // 'close alert' button
    let closeButton = document.createElement('button');
    closeButton.className = 'appButton';
    closeButton.id = 'alertButton';
    closeButton.textContent = 'Close';
    alertMessage.append(closeButton);

    return alertMessage;
  }

  /*
  Function Name: addReloadButton()
  Function Description: Adds a 'reload page' button to the alert message div.
  Parameters: alertMessage (HTMLDivElement) - The alert message div.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addReloadButton(alertMessage:HTMLDivElement) {
    let reloadButton = document.createElement('button');
    reloadButton.className = 'appButton';
    reloadButton.id = 'reloadBtn';
    reloadButton.textContent = 'Reload Page';
    alertMessage.append(reloadButton);
  }

  /*
  Function Name: addNavigateButton()
  Function Description: Adds a 'navigate to page' button to the alert message div.
  Parameters: alertMessage (HTMLDivElement) - The alert message div.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addNavigateButton(alertMessage:HTMLDivElement, location:string) {
    let navButton = document.createElement('a');
    navButton.href = location;
    navButton.className = 'appButton';
    navButton.id = 'navButton';
    navButton.textContent = `Home Page`;
    alertMessage.append(navButton);
  }

  // ALERT METHODS
  // ==============================================================
  /*
  Function Name: createSuccessAlert()
  Function Description: Creates an alert for the user to know their action succeeded.
  Parameters: message (string) - the alert text.
              reload (boolean) - whether a reload button is required; defaults to false.
              navigate (string) - Optional parameter indicating the navigation target (if needed).
  ----------------
  Programmer: Shir Bar Lev.
  */
  createSuccessAlert(message:string, reload:boolean = false, navigate?:string) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Success',
      message: message
    }

    this.isSWRelated = false;
    this.createAlert(alert, reload, navigate);
  }

  /*
  Function Name: createErrorAlert()
  Function Description: Checks what type of error occurred and returns an alert.
  Parameters: err (HttpErrorResponse) - The HTTP error response from the server.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createErrorAlert(err:HttpErrorResponse) {
    // an alert message
    let alert:AlertMessage = {
      type: 'Error',
      message: err.statusText
    }

    this.isSWRelated = false;
    this.createAlert(alert);
  }

  /*
  Function Name: createSWAlert()
  Function Description: Creates a notification alert triggered by a new ServiceWorker
                        waiting to take control over the page.
  Parameters: worker (ServiceWorker) - The waiting SW.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createSWAlert(worker:ServiceWorker) {
    // set SW-related variables and creates a notification alert
    let alert:AlertMessage = { type: 'Notification', message: `A new version of the site is available. Click the reload button to update!` };
    this.waitingServiceWorker = worker;
    this.isSWRelated = true;
    this.createAlert(alert, true);
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
    if(!navigator.onLine) {
      this.isOffline.next(true);
    }
    // otherwise hide it
    else {
      this.isOffline.next(false);
    }
  }
}
