/*
	SWManager
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';

// App-related imports
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class SWManager {
  // CTOR
  constructor(private alertsService:AlertsService) {

  }

  /*
  Function Name: registerSW()
  Function Description: Registers the ServiceWorker and then uses the ServiceWorkerRegistration
                        object to check for any updates to the currently active
                        ServiceWorker, as well as any ServiceWorker that is being installed.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  registerSW() {
    // if the service worker feature is supported in the current browser
    if('serviceWorker' in navigator) {
      // register the service worker
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        if(reg.waiting) {
          this.alertsService.createSWAlert(reg.waiting);
        }
        // if there's a service worker installing
        else if(reg.installing) {
          let installingSW = reg.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          reg.addEventListener('updatefound', () => {
            // gets the SW that was found and is now being installed
            let installingSW = reg.installing!;
            this.checkSWChange(installingSW);
          })
        }
      });
    }
  }

  /*
  Function Name: checkSWChange()
  Function Description: Upon a change in the state of the ServiceWorker, checks
                        the SW's state. If it's installed, it's ready to be activated,
                        so it triggers an alert for the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkSWChange(worker:ServiceWorker) {
    // wait for 'statechange' event on the SW being installed,
    // which means the SW has been installed and is ready to be activated
    worker.addEventListener('statechange', () => {
      if(worker.state == 'installed') {
        this.alertsService.createSWAlert(worker);
      }
    })
  }
}
