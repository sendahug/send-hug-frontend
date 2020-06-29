/*
	SWManager
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';

// Other imports
import { openDB, IDBPDatabase } from 'idb';

// App-related imports
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class SWManager {
  activeServiceWorkerReg: ServiceWorkerRegistration | undefined;
  currentDB: Promise<IDBPDatabase> | undefined;
  databaseVersion = 2;

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
      upgrade(db, oldVersion, _newVersion, transaction) {
        switch(oldVersion) {
          // if there was no previous version
          case 0:
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
          // if the previous version the user had is 1
          case 1:
            // change posts store's date index to order by ISO date string
            let postsStore = transaction.objectStore('posts');
            postsStore.deleteIndex('date');
            postsStore.createIndex('date', 'isoDate');

            // change messages store's date index to order by ISO date string
            let messagesStore = transaction.objectStore('messages');
            messagesStore.deleteIndex('date');
            messagesStore.createIndex('date', 'isoDate');

            // change threads store's date index to order by ISO date string
            let threadsStore = transaction.objectStore('threads');
            threadsStore.deleteIndex('latest');
            threadsStore.createIndex('latest', 'isoDate');
        }
      }
    });
  }

  /*
  Function Name: queryDatabase()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: target (string) - The target of the query.
              params - An array of parameters build in the following form:
                        { name: 'name', value: 1 }
                        This includes:
                          - currentUser (number) - the ID of the user currently logged in.
                          - page (number) - current page of results the user is in.
                          - threadID (number) - the ID of the thread for which to fetch messages.
                          - userID (number) - user ID of the user whose data to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryDatabase(target:string, ...params:any[]) {
    // checks that there's IDB database currently working
    if(this.currentDB) {
      return this.currentDB.then(function(db) {
        // if the target is any of the single-message mailboxes, get the data
        // from the messages objectStore
        if(target == 'inbox' || target == 'outbox' || target == 'thread') {
          let messageStore = db.transaction('messages').store.index('date');
          return messageStore.getAll();
        }
        // if the target is the threads mailbox, get the data from
        // the threads objectStore
        else if(target == 'threads') {
          let threadsStore = db.transaction('threads').store.index('latest');
          return threadsStore.getAll();
        }
        // if the target is a user, get the data of the specific user from the
        // users objectStore
        else if(target == 'user') {
          let userStore = db.transaction('users').store;
          let userID = params.find((e:any) => e.name == 'userID');
          return userStore.get(userID.value);
        }
        // if the target is the main page's new posts, get the data from
        // the posts store
        else if(target == 'main new' || target == 'new posts') {
          let postsStore = db.transaction('posts').store.index('date');
          return postsStore.getAll();
        }
        // if the target is the main page's suggested posts, get the data from
        // the posts store
        else if(target == 'main suggested' || target == 'suggested posts') {
          let postsStore = db.transaction('posts').store.index('hugs');
          return postsStore.getAll();
        }
        // if the target is a specific user's posts, get the data from
        // the posts store
        else if(target == 'user posts') {
          let postsStore = db.transaction('posts').store.index('user');
          let userID = params.find((e:any) => e.name == 'userID');
          return postsStore.getAll(userID.value);
        }
      // once the data is fetched, operate on it
      }).then(function(data) {
        // if the target is a user, return it as-is
        if(target == 'user') {
          return data;
        }
        // otherwise, the target requires pagination, so get pages data and
        // then get the relevant messages
        else {
          // get the current page and the start index for the paginated list
          // if the target is one of the main page's lists, each list should contain
          // 10 posts; otherwise each list should contain 5 items
          let currentPage = params.find((e:any) => e.name == 'page');
          let startIndex = (target == 'main new' || target == 'main suggested') ?
                            0 : (currentPage.value - 1) * 5;

          // if the target is inbox, keep only messages sent to the user and
          // return paginated inbox messages
          if(target == 'inbox') {
            let currentUser = params.find((e:any) => e.name == 'currentUser');
            let inbox = data.filter((e:any) => e.forId == currentUser.value);
            let orderedInbox = inbox.reverse();

            return orderedInbox.slice(startIndex, (startIndex + 5));
          }
          // if the target is outbox, keep only messages sent from the user and
          // return paginated outbox messages
          else if(target == 'outbox') {
            let currentUser = params.find((e:any) => e.name == 'currentUser');
            let outbox = data.filter((e:any) => e.fromId == currentUser.value);
            let orderedOutbox = outbox.reverse();

            return orderedOutbox.slice(startIndex, (startIndex + 5));
          }
          // if the target is threads, return paginated threads list
          else if(target == 'threads') {
            let orderedThreads = data.reverse();

            return orderedThreads.slice(startIndex, (startIndex + 5));
          }
          // if the target is a specific thread, keep only messages belonging to
          // that thread nad return paginated messages
          else if(target == 'thread') {
            let threadID = params.find((e:any) => e.name == 'threadID');
            let thread = data.filter((e:any) => e.threadID == threadID.value);
            let orderedThread = thread.reverse();

            return orderedThread.slice(startIndex, (startIndex+5));
          }
          // if the target is the main page's new posts, reverse the order of
          // the posts (to show the latest posts) and return paginated posts
          else if(target == 'main new') {
            let newPosts = data.reverse();

            return newPosts.slice(startIndex, (startIndex + 10));
          }
          // if the target is the main page's new posts, return paginated posts
          else if(target == 'main suggested') {
            return data.slice(startIndex, (startIndex + 10));
          }
          // if the target is the fullList's new posts, reverse the order of
          // the posts (to show the latest posts) and return paginated posts
          else if(target == 'new posts') {
            let newPosts = data.reverse();

            return newPosts.slice(startIndex, (startIndex + 5));
          }
          // if the target is the fullList's suggested posts or a specific user's,
          // posts, return paginated posts (as-is).
          else if(target == 'suggested posts' || target == 'user posts') {
            return data.slice(startIndex, (startIndex + 5));
          }
        }
      })
    }
  }

  /*
  Function Name: clearStore()
  Function Description: Deletes all records from an IDB store.
  Parameters: storeID (string) - the name of the store to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  clearStore(storeID:string) {
    // checks that there's IDB database currently working
    if(this.currentDB) {
      // gets the current database, and then gets the given store and clears it
      this.currentDB.then(function(db) {
        let store = db.transaction(storeID).objectStore(storeID);
        return store.clear();
      // if there's an error, log it
      }).catch(function(err) {
        console.log(err);
      });
    }
  }
}
