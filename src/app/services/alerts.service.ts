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
  createAlert(alert:AlertMessage) {
    let alertMessage = this.buildAlertElement(alert);

    document.getElementById('alertContainer')!.append(alertMessage);
    document.getElementById('alertButton')!.addEventListener('click', this.closeAlert);
  }

  // close the alert
  closeAlert() {
    document.querySelector('.alertMessage')!.remove();
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
}
