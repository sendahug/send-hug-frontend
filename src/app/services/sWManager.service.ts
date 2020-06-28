/*
	SWManager
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';

// Other imports
import { openDB, deleteDB, IDBPDatabase } from 'idb';

// App-related imports
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class SWManager {
  activeServiceWorkerReg: ServiceWorkerRegistration | undefined;
  currentDB: Promise<IDBPDatabase> | undefined;
  databaseVersion = 1;

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
        // if there's an active service worker, set the variable
        if(reg.active) {
          this.activeServiceWorkerReg = reg;
        }
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        else if(reg.waiting) {
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

      this.currentDB = this.openDatabase();
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

  /*
  Function Name: checkSWChange()
  Function Description: Checks whether there's a new ServiceWorker installing,
                        installed or waiting to be activated. This event fires up
                        every time the user navigates to another page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateSW() {
    if(this.activeServiceWorkerReg) {
      this.activeServiceWorkerReg.update().then(() => {
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        if(this.activeServiceWorkerReg!.waiting) {
          this.alertsService.createSWAlert(this.activeServiceWorkerReg!.waiting);
        }
        // if there's a service worker installing
        else if(this.activeServiceWorkerReg!.installing) {
          let installingSW = this.activeServiceWorkerReg!.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          this.activeServiceWorkerReg!.addEventListener('updatefound', () => {
            // gets the SW that was found and is now being installed
            let installingSW = this.activeServiceWorkerReg!.installing!;
            this.checkSWChange(installingSW);
          })
        }
      })
    }
  }

  /*
  Function Name: openDatabase()
  Function Description: Creates an IDBPromised database to contain data if the
                        user is offline.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openDatabase() {
    return openDB('send-hug', this.databaseVersion, {
      upgrade(db, _oldVersion, _newVersion, transaction) {
        // create store for posts
        let postStore = db.createObjectStore('posts', {
          keyPath: 'id'
        });
        postStore.createIndex('date', 'date');
        postStore.createIndex('user', 'userId');
        postStore.createIndex('hugs', 'givenHugs');

        // create store for users
        let userStore = db.createObjectStore('users', {
          keyPath: 'id'
        });

        // create store for messages
        let messageStore = db.createObjectStore('messages', {
          keyPath: 'id'
        });
        messageStore.createIndex('date', 'date');
        messageStore.createIndex('thread', 'threadID');

        // create store for threads
        let threadStore = db.createObjectStore('threads', {
          keyPath: 'id'
        });
        threadStore.createIndex('latest', 'latestMessage');
      }
    });
  }
}
