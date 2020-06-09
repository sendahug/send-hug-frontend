/*
	Alerts Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';

// App-related imports
import { AlertMessage } from '../interfaces/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
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
    document.getElementById('alertContainer')!.append(alertMessage);
    document.getElementById('alertButton')!.addEventListener('click', this.closeAlert);

    // if reload option is required
    if(reload) {
      this.addReloadButton(alertMessage);
      document.getElementById('reloadBtn')!.addEventListener('click', this.reloadPage);
    }
    // if return to homepage option is required
    else if(navigate == '/') {
      this.addNavigateButton(alertMessage);
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
    window.location.reload();
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
  addNavigateButton(alertMessage:HTMLDivElement) {
    let navButton = document.createElement('a');
    navButton.href = '/';
    navButton.className = 'appButton';
    navButton.id = 'navButton';
    navButton.textContent = `Home Page`;
    alertMessage.append(navButton);
  }
}
