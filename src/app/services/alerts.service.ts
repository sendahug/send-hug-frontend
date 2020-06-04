// Angular imports
import { Injectable } from '@angular/core';

// App-related imports
import { AlertMessage } from '../interfaces/alert.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor() {
  }

  // add a new alert
  createAlert(alert:AlertMessage, reload:boolean = false, navigate?:string) {
    // checks if there's already an alert, in which case it's removed
    if(document.querySelector('.alertMessage')) {
      document.querySelector('.alertMessage')!.remove();
    }

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

  // close the alert
  closeAlert() {
    document.querySelector('.alertMessage')!.remove();
  }

  // reloads the page
  reloadPage() {
    document.querySelector('.alertMessage')!.remove();
    window.location.reload();
  }

  // creates an alert div element
  buildAlertElement(alert:AlertMessage) {
    let alertMessage = document.createElement('div');
    alertMessage.className = `alertMessage ${alert.type}`;

    let alertHeadline = document.createElement('h3');
    alertHeadline.className = `alertType`;
    alertHeadline.textContent = alert.type;
    alertMessage.append(alertHeadline);

    let alertText = document.createElement('div');
    alertText.className = 'alertText';
    alertText.textContent = alert.message;
    alertMessage.append(alertText);

    let closeButton = document.createElement('button');
    closeButton.className = 'appButton';
    closeButton.id = 'alertButton';
    closeButton.textContent = 'Close';
    alertMessage.append(closeButton);

    return alertMessage;
  }

  // add reload button
  addReloadButton(alertMessage:HTMLDivElement) {
    let reloadButton = document.createElement('button');
    reloadButton.className = 'appButton';
    reloadButton.id = 'reloadBtn';
    reloadButton.textContent = 'Reload Page';
    alertMessage.append(reloadButton);
  }

  // navigate to another page
  addNavigateButton(alertMessage:HTMLDivElement) {
    let navButton = document.createElement('a');
    navButton.href = '/';
    navButton.className = 'appButton';
    navButton.id = 'navButton';
    navButton.textContent = `Home Page`;
    alertMessage.append(navButton);
  }
}
