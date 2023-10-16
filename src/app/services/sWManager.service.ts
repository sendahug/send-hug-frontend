/*
	SWManager
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
import { Injectable } from "@angular/core";

// Other imports
import { openDB, IDBPDatabase, DBSchema } from "idb";

// App-related imports
import { AlertsService } from "@app/services/alerts.service";
import { IdbStoreType, iconCharacters } from "@app/interfaces/types";
import { Message } from "@app/interfaces/message.interface";
import { Post } from "@app/interfaces/post.interface";
import { FullThread } from "@app/interfaces/thread.interface";
import { OtherUser } from "@app/interfaces/otherUser.interface";

// IndexedDB Database schema
export interface MyDB extends DBSchema {
  posts: {
    key: number;
    value: {
      date: Date;
      givenHugs: number;
      id: number;
      isoDate: string;
      text: string;
      userId: number;
      user: string;
      sentHugs: number[];
    };
    indexes: { date: string; user: number; hugs: number };
  };
  users: {
    key: number;
    value: {
      id: number;
      displayName: string;
      givenH: number;
      posts: number;
      receivedH: number;
      role: string;
      selectedIcon: iconCharacters;
      iconColours: {
        character: String;
        lbg: String;
        rbg: String;
        item: String;
      };
    };
  };
  messages: {
    key: number;
    value: {
      date: Date;
      for: {
        displayName: string;
        selectedIcon?: iconCharacters;
        iconColours?: {
          character: String;
          lbg: String;
          rbg: String;
          item: String;
        };
      };
      forId: number;
      from: {
        displayName: string;
        selectedIcon?: iconCharacters;
        iconColours?: {
          character: String;
          lbg: String;
          rbg: String;
          item: String;
        };
      };
      fromId: number;
      id: number;
      isoDate: string;
      messageText: string;
      threadID: number;
    };
    indexes: { date: string; thread: number };
  };
  threads: {
    key: number;
    value: {
      latestMessage: Date;
      user1: {
        displayName: string;
        selectedIcon: iconCharacters;
        iconColours: {
          character: String;
          lbg: String;
          rbg: String;
          item: String;
        };
      };
      user1Id: number;
      user2: {
        displayName: string;
        selectedIcon: iconCharacters;
        iconColours: {
          character: String;
          lbg: String;
          rbg: String;
          item: String;
        };
      };
      user2Id: number;
      numMessages: number;
      isoDate: string;
      id: number;
    };
    indexes: { latest: string };
  };
}

// A post as represented in IDB. Differs from the existing User interface in attribute names.
interface IDBPost {
  date: Date;
  givenHugs: number;
  id: number;
  isoDate: string;
  text: string;
  userId: number;
  user: string;
  sentHugs: number[];
}

@Injectable({
  providedIn: "root",
})
export class SWManager {
  activeServiceWorkerReg: ServiceWorkerRegistration | undefined;
  currentDB: Promise<IDBPDatabase<MyDB>> | undefined;
  databaseVersion = 4;

  // CTOR
  constructor(private alertsService: AlertsService) {}

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
    if ("serviceWorker" in navigator) {
      // register the service worker
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // if there's an active service worker, set the variable
        if (reg.active) {
          this.activeServiceWorkerReg = reg;
        }
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        else if (reg.waiting) {
          this.alertsService.createSWAlert(reg.waiting);
        }
        // if there's a service worker installing
        else if (reg.installing) {
          let installingSW = reg.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          reg.addEventListener("updatefound", () => {
            // gets the SW that was found and is now being installed
            let installingSW = reg.installing!;
            this.checkSWChange(installingSW);
          });
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
  checkSWChange(worker: ServiceWorker) {
    // wait for 'statechange' event on the SW being installed,
    // which means the SW has been installed and is ready to be activated
    worker.addEventListener("statechange", () => {
      if (worker.state == "installed") {
        // if there's an active ServiceWorker, alert the user that there's
        // a new version of the site
        if (this.activeServiceWorkerReg && this.activeServiceWorkerReg!.active) {
          this.alertsService.createSWAlert(worker);
        }
        // otherwise, just tell the SW to take over
        else {
          worker.postMessage({ action: "skip waiting" });
        }
      }
    });
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
    if (this.activeServiceWorkerReg) {
      this.activeServiceWorkerReg.update().then(() => {
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        if (this.activeServiceWorkerReg!.waiting) {
          this.alertsService.createSWAlert(this.activeServiceWorkerReg!.waiting);
        }
        // if there's a service worker installing
        else if (this.activeServiceWorkerReg!.installing) {
          let installingSW = this.activeServiceWorkerReg!.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          this.activeServiceWorkerReg!.addEventListener("updatefound", () => {
            // gets the SW that was found and is now being installed
            let installingSW = this.activeServiceWorkerReg!.installing!;
            this.checkSWChange(installingSW);
          });
        }
      });
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
    return openDB<MyDB>("send-hug", this.databaseVersion, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        switch (oldVersion) {
          // if there was no previous version
          case 0:
            // create store for posts
            let postStore = db.createObjectStore("posts", {
              keyPath: "id",
            });
            postStore.createIndex("date", "date");
            postStore.createIndex("user", "userId");
            postStore.createIndex("hugs", "givenHugs");

            // create store for users
            db.createObjectStore("users", {
              keyPath: "id",
            });

            // create store for messages
            let messageStore = db.createObjectStore("messages", {
              keyPath: "id",
            });
            messageStore.createIndex("date", "date");
            messageStore.createIndex("thread", "threadID");

            // create store for threads
            let threadStore = db.createObjectStore("threads", {
              keyPath: "id",
            });
            threadStore.createIndex("latest", "latestMessage");
          // if the previous version the user had is 1
          case 1:
            // change posts store's date index to order by ISO date string
            let postsStore = transaction.objectStore("posts");
            postsStore.deleteIndex("date");
            postsStore.createIndex("date", "isoDate");

            // change messages store's date index to order by ISO date string
            let messagesStore = transaction.objectStore("messages");
            messagesStore.deleteIndex("date");
            messagesStore.createIndex("date", "isoDate");

            // change threads store's date index to order by ISO date string
            let threadsStore = transaction.objectStore("threads");
            threadsStore.deleteIndex("latest");
            threadsStore.createIndex("latest", "isoDate");
          // If the previous version is 3
          case 3:
            // Recreate the users store as the object type changed.
            db.deleteObjectStore("users");
            db.createObjectStore("users", {
              keyPath: "id",
            });
        }
      },
    });
  }

  /**
   * Fetches posts based on the given attributes.
   *
   * queryPosts (the original method) mapping:
   * (old target: new parameters)
   * -  main new: "date", 10, undefined, 1, true
   * -  main suggested: "hugs", 10, undefined, 1, false
   * -  new posts: "date", 5, undefined, page, true
   * -  suggested posts: "hugs", 5, undefined, page, false
   * -  user posts: "user", 5, userID, page, false
   *
   * @param sortBy - index to sort by
   * @param perPage - number of posts per page
   * @param userID (optional) - the user ID for which to fetch posts
   * @param page (optional) - the current page
   * @param reverseOrder (optional) - whether to reverse the posts' order
   * @returns A promise that resolves to an object containing the
   *          posts and the number of pages.
   */
  fetchPosts(
    sortBy: "date" | "user" | "hugs",
    perPage: number,
    userID?: number,
    page?: number,
    reverseOrder: boolean = false,
  ): Promise<{ posts: Post[]; pages: number }> {
    if (this.currentDB) {
      return this.currentDB
        .then((db) => {
          let postsStore = db.transaction("posts").store.index(sortBy);

          if (userID) {
            return postsStore.getAll(userID);
          } else {
            return postsStore.getAll();
          }
        })
        .then((posts) => {
          // if there are any posts, check each post
          posts.forEach((element) => {
            // if there's no display name for that post, get it through the
            // queryUsers method and add it
            if (!element.user) {
              this.queryUsers(element.userId)!.then((userData) => {
                // if the user exists in the database, get it
                if (userData) {
                  element.user = userData.displayName;
                }
              });
            }
          });
          return posts;
        })
        .then((posts) => {
          const currentPage = page ? page : 1;
          const startIndex = (currentPage - 1) * perPage;
          const pages = Math.ceil(posts!.length / 5);

          let finalPosts: Post[];

          if (sortBy == "hugs") {
            finalPosts = this.sortSuggestedPosts(posts);
          } else {
            finalPosts = reverseOrder ? posts.reverse() : posts;
          }

          return {
            posts: finalPosts.slice(startIndex, startIndex + perPage),
            pages,
          };
        });
    } else {
      return new Promise((resolve) => {
        resolve({ posts: [], pages: 1 });
      });
    }
  }

  /*
  Function Name: sortSuggestedPosts()
  Function Description: Orders suggested posts by number of hugs (ascending) and
                        date (descending).
  Parameters: posts (IDBPost[]) - list of posts to order
  ----------------
  Programmer: Shir Bar Lev.
  */
  sortSuggestedPosts(posts: IDBPost[]) {
    let postHugs: { [hugs: number]: IDBPost[] } = {};
    let orderedPosts: IDBPost[] = [];

    // split to arrays by number of hugs
    posts.forEach((post) => {
      // if this is the first post with a specific number of hugs, first set up
      // the relevant property
      if (!postHugs[post.givenHugs]) {
        postHugs[post.givenHugs] = [];
      }

      postHugs[post.givenHugs].push(post);
    });

    const hugsNumbers = Object.keys(postHugs);
    hugsNumbers.forEach((value: string) => {
      // sort each array by date
      postHugs[Number(value)].sort((postA, postB) => {
        // if post A is newer than B, put B first
        if (postA.isoDate > postB.isoDate) {
          return 1;
        }
        // if it's the other way around, put A first
        else if (postB.isoDate > postA.isoDate) {
          return -1;
        }
        // otherwise return 0
        else {
          return 0;
        }
      });
      // then push each post from the by-hugs arrays to a general array
      postHugs[Number(value)].forEach((post) => {
        orderedPosts.push(post);
      });
    });

    // return the suggested posts, ordered by number of hugs (ascending) and
    // date (descending)
    return orderedPosts;
  }

  /**
   * Fetch posts based on the given filters.
   *
   * queryMessages (the original method) mapping:
   * (old target: new parameters)
   * - inbox: "forId", currentUser, 5, page
   * - outbox: "fromId", currentUser, 5, page
   * - thread: "threadID", threadID, 5, page
   *
   * @param filterAttribute - the attribute to filter by.
   * @param filterValue - the value to match.
   * @param perPage - number of messages per page
   * @param page (optional) - the current page
   * @returns A promise that resolves into a list of messages and the number of pages.
   */
  fetchMessages(
    filterAttribute: "forId" | "fromId" | "threadID",
    filterValue: number,
    perPage: number,
    page?: number,
  ): Promise<{ messages: Message[]; pages: number }> {
    if (this.currentDB) {
      return this.currentDB
        .then(function (db) {
          let messagesStore = db.transaction("messages").store.index("date");
          return messagesStore.getAll();
        })
        .then((messages) => {
          const filteredMessages = messages
            .filter((message: Message) => message[filterAttribute] == filterValue)
            .reverse();
          const startIndex = (page || 1 - 1) * perPage;
          const pages = Math.ceil(filteredMessages.length / 5);

          return {
            messages: filteredMessages.slice(startIndex, startIndex + perPage),
            pages: pages,
          };
        });
    } else {
      return new Promise((resolve) => {
        resolve({ messages: [], pages: 1 });
      });
    }
  }

  /*
  Function Name: queryThreads()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: currentPage (number) - the current page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryThreads(currentPage: number): Promise<{ messages: FullThread[]; pages: number }> {
    if (this.currentDB) {
      return this.currentDB
        .then(function (db) {
          let threadsStore = db.transaction("threads").store.index("latest");
          return threadsStore.getAll();
        })
        .then(function (threads) {
          let startIndex = (currentPage - 1) * 5;
          let orderedThreads = threads.reverse();
          let pages = Math.ceil(orderedThreads!.length / 5);

          return {
            messages: orderedThreads.slice(startIndex, startIndex + 5),
            pages: pages,
          };
        });
    } else {
      return new Promise((resolve) => {
        resolve({ messages: [], pages: 1 });
      });
    }
  }

  /*
  Function Name: queryUsers()
  Function Description: Gets data matching the provided query from IndexedDB database.
  Parameters: userID (number) - the ID of the user whose data to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  queryUsers(userID: number): Promise<OtherUser | undefined> {
    if (this.currentDB) {
      return this.currentDB
        .then(function (db) {
          let userStore = db.transaction("users").store;
          return userStore.get(userID);
        })
        .then(function (data) {
          return data;
        });
    } else {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    }
  }

  /**
   * Adds an ISO date to each item in the list of items, and then adds
   * them to the store. It also cleans the store after adding all items.
   *
   * @param store - the type of store to add to
   * @param data - the data to add
   * @param dateParam - the name of the attribute that contains the date
   *                    to use (to convert to ISO Date) for each of the items.
   * @returns A promise that resolves to void.
   */
  addFetchedItems(store: IdbStoreType, data: any[], dateParam: string) {
    return this.currentDB
      ?.then((db) => {
        // start a new transaction
        let dbStore = db.transaction(store, "readwrite").objectStore(store);
        data.forEach((item) => {
          item["isoDate"] = new Date(item[dateParam]).toISOString();
          dbStore.put(item);
        });
      })
      .then(() => {
        if (store != "users") {
          this.cleanDB(store);
        }
      });
  }

  /*
  Function Name: addItem()
  Function Description: Add an item to one of the stores.
  Parameters: store - the store to which to add an item
              item - the item to add
  ----------------
  Programmer: Shir Bar Lev.
  */
  addItem(store: IdbStoreType, item: any) {
    return this.currentDB?.then((db) => {
      // start a new transaction
      let dbStore = db.transaction(store, "readwrite").objectStore(store);
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
  deleteItem(store: IdbStoreType, itemID: number) {
    return this.currentDB?.then((db) => {
      // start a new transaction
      let tx = db.transaction(store, "readwrite");
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
  deleteItems(store: IdbStoreType, parentType: string, parentID: number) {
    return this.currentDB?.then((db) => {
      // start a new transaction
      let tx = db.transaction(store, "readwrite");
      let dbStore = tx.objectStore(store);
      // open a cursor and delete any items with the matching parent's ID
      // open a cursor and delete any messages with the deleted thread's ID
      dbStore.openCursor().then(function checkItem(cursor): any {
        if (!cursor) return;
        // @ts-ignore
        if (cursor.value[parentType] == parentID) {
          cursor.delete();
        }
        return cursor.continue().then(checkItem);
      });
    });
  }

  /*
  Function Name: clearStore()
  Function Description: Deletes all records from an IDB store.
  Parameters: storeID (string) - the name of the store to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  clearStore(storeID: IdbStoreType) {
    // checks that there's IDB database currently working
    if (this.currentDB) {
      // gets the current database, and then gets the given store and clears it
      this.currentDB
        .then(function (db) {
          let store = db.transaction(storeID, "readwrite").objectStore(storeID);
          return store.clear();
          // if there's an error, log it
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  /*
  Function Name: cleanDB()
  Function Description: Cleans the oldest posts/messages/threads.
  Parameters: storeID (string) - the name of the store to clear.
  ----------------
  Programmer: Shir Bar Lev.
  */
  cleanDB(storeID: "posts" | "messages" | "threads") {
    if (this.currentDB) {
      this.currentDB.then(function (db) {
        // if the store to clear is posts or messages store
        if (storeID == "posts" || storeID == "messages") {
          // skip the latest 100 posts/messages
          db.transaction(storeID, "readwrite")
            .store.index("date")
            .openCursor(undefined, "prev")
            .then((cursor) => {
              return cursor?.advance(100);
              // if there are more than 100 items, clean out the oldest
            })
            .then(function clearItems(cursor): any {
              if (!cursor) return;
              cursor.delete();
              return cursor.continue().then(clearItems);
            });
        }
        // if the store to clean is the threads store
        else {
          // skip the latest 100 threads
          db.transaction(storeID, "readwrite")
            .store.index("latest")
            .openCursor(undefined, "prev")
            .then((cursor) => {
              return cursor?.advance(100);
              // if there are more than 100 items, clean out the oldest
            })
            .then(function clearItems(cursor): any {
              if (!cursor) return;
              cursor.delete();
              return cursor.continue().then(clearItems);
            });
        }
      });
    }
  }
}
