/*
	SWManager
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

// Other imports
import { openDB, IDBPDatabase, DBSchema } from 'idb';

// App-related imports
import { MockAlertsService } from './alerts.service.mock';

// IndexedDB Database schema
interface MyDB extends DBSchema {
  'posts': {
    key: number;
    value: {
      'date': Date;
      'givenHugs': number;
      'id': number;
      'isoDate': string;
      'text': string;
      'userId': number;
      'user': string;
      'sentHugs': number[];
    };
    indexes: { 'date': string, 'user': number, 'hugs': number };
  };
  'users': {
    key: number;
    value: {
      'id': number;
      'displayName': string;
      'givenHugs': number;
      'postsNum': number;
      'receivedHugs': number;
      'role': string;
    }
  };
  'messages': {
    key: number;
    value: {
      'date': Date;
      'for': string;
      'forId': number;
      'from': string;
      'fromId': number;
      'id': number;
      'isoDate': string;
      'messageText': string;
      'threadID': number;
    };
    indexes: { 'date': string, 'thread': number };
  };
  'threads': {
    key: number;
    value: {
      'latestMessage': Date;
      'user1': string;
      'user1Id': number;
      'user2': string;
      'user2Id': number;
      'numMessages': number;
      'isoDate': string;
      'id': number;
    };
    indexes: { 'latest': string };
  }
}

@Injectable({
  providedIn: 'root'
})
export class MockSWManager {
  activeServiceWorkerReg: ServiceWorkerRegistration | undefined;
  currentDB: Promise<IDBPDatabase<MyDB>> | undefined;
  databaseVersion = 3;

  // CTOR
  constructor(private alertsService:MockAlertsService) {

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
    return 'registered'
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
	  return 'opened';
  }

  /*
  Function Name: queryPosts()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: target (string) - The target of the query.
              userID (number) - ID of the user whose posts to fetch.
              page (number) - the current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryPosts(target: string, userID?: number, page?:number) {
    if(this.currentDB) {
      return this.currentDB.then(function(db) {
        let postsStore = db.transaction('posts').store;

        // if the target is the main page's new posts, get the data from
        // the posts store
        if(target == 'main new' || target == 'new posts') {
          let newPosts = postsStore.index('date');
          return newPosts.getAll();
        }
        // if the target is the main page's suggested posts, get the data from
        // the posts store
        else if(target == 'main suggested' || target == 'suggested posts') {
          let suggestedPosts = postsStore.index('hugs');
          return suggestedPosts.getAll();
        }
        // if the target is a specific user's posts, get the data from
        // the posts store
        else if(target == 'user posts') {
          let userPosts = postsStore.index('user');
          return userPosts.getAll(userID);
        }
      }).then((posts) => {
        // if there are any posts, check each post
        if(posts) {
          posts.forEach(element => {
            // if there's no display name for that post, get it through the
            // queryUsers method and add it
            if(!element.user) {
              this.queryUsers(element.userId)!.then((userData) => {
                element.user = userData!.displayName;
              })
            }
          });
        }
        return posts;
      }).then(function(posts) {
        // get the current page and the start index for the paginated list
        // if the target is one of the main page's lists, each list should contain
        // 10 posts; otherwise each list should contain 5 items
        let currentPage = page ? page: 1;
        let startIndex = (target == 'main new' || target == 'main suggested') ?
                          0 : (currentPage - 1) * 5;

        // if the target is the main page's new posts, reverse the order of
        // the posts (to show the latest posts) and return paginated posts
        if(target == 'main new') {
          let newPosts = posts!.reverse();

          return newPosts.slice(startIndex, (startIndex + 10));
        }
        // if the target is the main page's new posts, return paginated posts
        else if(target == 'main suggested') {
          return posts!.slice(startIndex, (startIndex + 10));
        }
        // if the target is the fullList's new posts, reverse the order of
        // the posts (to show the latest posts) and return paginated posts
        else if(target == 'new posts') {
          let newPosts = posts!.reverse();
          let pages = Math.ceil(newPosts.length / 5);

          return {
            posts: newPosts.slice(startIndex, (startIndex + 5)),
            pages: pages
          };
        }
        // if the target is the fullList's suggested posts or a specific user's,
        // posts, return paginated posts (as-is).
        else if(target == 'suggested posts' || target == 'user posts') {
          let pages = Math.ceil(posts!.length / 5);

          return {
            posts: posts!.slice(startIndex, (startIndex + 5)),
            pages: pages
          };
        }
      })
    }
  }

  /*
  Function Name: queryMessages()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: target (string) - The target of the query.
              currentUser (number) - ID of the current user.
              page (number) - the current page.
              threadID (number) - the ID of the thread for which to fetch messages.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryMessages(target:string, currentUser:number, page:number, threadID?:number) {
    return this.currentDB?.then(function(db) {
      // if the target is any of the single-message mailboxes, get the data
      // from the messages objectStore
      let messagesStore = db.transaction('messages').store.index('date');
      return messagesStore.getAll();
    }).then(function(messages) {
      // get the current page and the start index for the paginated list
      // if the target is one of the main page's lists, each list should contain
      // 10 posts; otherwise each list should contain 5 items
      let startIndex = (target == 'main new' || target == 'main suggested') ?
                        0 : (page - 1) * 5;

      // if the target is inbox, keep only messages sent to the user and
      // return paginated inbox messages
      if(target == 'inbox') {
        let inbox = messages.filter((e:any) => e.forId == currentUser);
        let orderedInbox = inbox.reverse();

        return orderedInbox.slice(startIndex, (startIndex + 5));
      }
      // if the target is outbox, keep only messages sent from the user and
      // return paginated outbox messages
      else if(target == 'outbox') {
        let outbox = messages.filter((e:any) => e.fromId == currentUser);
        let orderedOutbox = outbox.reverse();

        return orderedOutbox.slice(startIndex, (startIndex + 5));
      }
      // if the target is a specific thread, keep only messages belonging to
      // that thread nad return paginated messages
      else if(target == 'thread') {
        let thread = messages.filter((e:any) => e.threadID == threadID);
        let orderedThread = thread.reverse();

        return orderedThread.slice(startIndex, (startIndex+5));
      }
    })
  }

  /*
  Function Name: queryThreads()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: currentPage (number) - the current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryThreads(currentPage:number) {
    return this.currentDB?.then(function(db) {
      let threadsStore = db.transaction('threads').store.index('latest');
      return threadsStore.getAll();
    }).then(function(threads) {
      let startIndex = currentPage * 5;
      let orderedThreads = threads.reverse();

      return orderedThreads.slice(startIndex, (startIndex + 5));
    })
  }

  /*
  Function Name: queryUsers()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: userID (number) - the ID of the user whose data to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryUsers(userID:number) {
    return this.currentDB?.then(function(db) {
      let userStore = db.transaction('users').store;
      return userStore.get(userID);
    }).then(function(data) {
      return data;
    })
  }

  /*
  Function Name: addItem()
  Function Description: Add an item to one of the stores.
  Parameters: store - the store to which to add an item
              item - the item to add
  ----------------
  Programmer: Shir Bar Lev.
  */
  addItem(store: 'posts' | 'messages' | 'users' | 'threads', item: any) {
    return this.currentDB?.then((db) => {
      // start a new transaction
      let dbStore = db.transaction(store).store;
      dbStore.put(item);
    });
  }

  /*
  Function Name: deleteItem()
  Function Description: Delete an item from one of the stores.
  Parameters: store - the store from which to delete an item
              itemID - the ID of the item to delete
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem(store: 'posts' | 'messages' | 'users' | 'threads', itemID: number ) {
    return this.currentDB?.then((db) => {
      // start a new transaction
      let tx = db.transaction(store, 'readwrite');
      let dbStore = tx.objectStore(store);
      // delete the relevant item
      dbStore.delete(itemID);
    });
  }

  /*
  Function Name: deleteItems()
  Function Description: Delete multiple items from one of the stores.
  Parameters: store - the store from which to delete the items
              parentType - the category to which the item's condition belongs. For example, when
                            deleting all messages in a thread, the parent will be 'threadID'.
              parentID - ID to match when deleting.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItems(store: 'posts' | 'messages' | 'users' | 'threads', parentType: string, parentID: number) {
    return this.currentDB?.then((db) => {
      // start a new transaction
      let tx = db.transaction(store, 'readwrite');
      let dbStore = tx.objectStore(store);
      // open a cursor and delete any items with the matching parent's ID
      // open a cursor and delete any messages with the deleted thread's ID
      dbStore.openCursor().then(function checkItem(cursor):any {
        if(!cursor) return;
        // @ts-ignore
        if(cursor.value[parentType] == parentID) {
          cursor.delete();
        }
        return cursor.continue().then(checkItem);
      })
    });
  }

  /*
  Function Name: clearStore()
  Function Description: Deletes all records from an IDB store.
  Parameters: storeID (string) - the name of the store to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  clearStore(storeID: 'posts' | 'messages' | 'users' | 'threads') {
	  return storeID;
  }

  /*
  Function Name: cleanDB()
  Function Description: Cleans the oldest posts/messages/threads.
  Parameters: storeID (string) - the name of the store to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  cleanDB(storeID: 'posts' | 'messages' | 'threads') {
	return storeID;
  }
}
