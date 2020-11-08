/*
	SWManager
	Send a Hug Service Tests
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

import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import {} from 'jasmine';

import { MyDB, SWManager } from './sWManager.service';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';
import { IDBPDatabase } from "idb";

function populateDB(dbPromise: Promise<IDBPDatabase<MyDB>>, store: 'posts' | 'messages' | 'users' | 'threads' | 'all') {
  const items = {
    posts: [
      {
        'date': new Date('2020-06-27 19:17:31.072'),
        'givenHugs': 0,
        'id': 1,
        'text': 'test',
        'userId': 1,
        'user': 'test',
        'sentHugs': [],
        'isoDate': '348310300'
      },
      {
        'date': new Date('2020-06-28 19:17:31.072'),
        'givenHugs': 2,
        'id':2,
        'text': 'test2',
        'userId': 1,
        'user': 'test',
        'sentHugs': [],
        'isoDate': '348310577'
      },
      {
        'date': new Date('2020-06-27 19:17:31.072'),
        'givenHugs': 1,
        'id': 3,
        'text': 'test3',
        'userId': 3,
        'user': 'test6',
        'sentHugs': [],
        'isoDate': '348310857'
      }
    ],
    messages: [
      {
        date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
        for: "user14",
        forId: 1,
        from: "user14",
        fromId: 4,
        id: 1,
        messageText: "test.",
        threadID: 4,
        isoDate: '67398730863'
      },
      {
        date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
        for: "user14",
        forId: 4,
        from: "user14",
        fromId: 1,
        id: 14,
        messageText: "message",
        threadID: 4,
        isoDate: '67398730824'
      },
      {
        date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
        for: "shirb",
        forId: 1,
        from: "user14",
        fromId: 4,
        id: 9,
        messageText: "hang in there",
        threadID: 3,
        isoDate: '67398730578'
      }
    ],
    users: [
      {
        id: 1,
        displayName: "shirb",
        receivedHugs: 3,
        givenHugs: 3,
        role: 'user',
        postsNum: 10
      },
      {
        id: 4,
        displayName: "user14",
        receivedHugs: 3,
        givenHugs: 3,
        role: 'user',
        postsNum: 10
      }
    ],
    threads: [
      {
        id: 3,
        user1: "shirb",
        user1Id: 1,
        user2: "user14",
        user2Id: 4,
        numMessages: 1,
        latestMessage: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
        isoDate: '37289456'
      },
      {
        id: 5,
        user1: "lalala",
        user1Id: 2,
        user2: "user14",
        user2Id: 4,
        numMessages: 2,
        latestMessage: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
        isoDate: '37289456'
      }
    ]
  }

  dbPromise.then(db => {
    // if there's a specific store to populate, populate it
    if(store != 'all') {
      items[store].forEach((item:any) => {
        db.put(store, item);
      });
    }
    // otherwise, populate all stores
    else {
      items.messages.forEach(message => {
        db.put('messages', message);
      });
      items.posts.forEach(post => {
        db.put('posts', post);
      });
      items.threads.forEach(thread => {
        db.put('threads', thread);
      });
      items.users.forEach(user => {
        db.put('users', user);
      });
    }
  });
}

describe('SWManagerService', () => {
  let httpController: HttpTestingController;
  let sWManagerService: SWManager;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SWManager,
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();

    sWManagerService = TestBed.inject(SWManager);
    httpController = TestBed.inject(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(sWManagerService).toBeTruthy();
  });

  // check the database is built according to the schema
  it('openDatabase() - should create a new database according to the schema', () => {
    return sWManagerService.openDatabase().then(db => {
      expect(db).toBeDefined();
      expect(db.objectStoreNames).toContain('posts');
      expect(db.objectStoreNames).toContain('users');
      expect(db.objectStoreNames).toContain('messages');
      expect(db.objectStoreNames).toContain('threads');
      // posts store
      const postStore = db.transaction('posts').objectStore('posts');
      expect(postStore.keyPath).toBe('id');
      expect(postStore.indexNames).toContain('date');
      expect(postStore.indexNames).toContain('user');
      expect(postStore.indexNames).toContain('hugs');
      // users store
      const userStore = db.transaction('users').objectStore('users');
      expect(userStore.keyPath).toBe('id');
      // messages store
      const messStore = db.transaction('messages').objectStore('messages');
      expect(messStore.keyPath).toBe('id');
      expect(messStore.indexNames).toContain('date');
      expect(messStore.indexNames).toContain('thread');
      // threads store
      const threadStore = db.transaction('threads').objectStore('threads');
      expect(threadStore.keyPath).toBe('id');
      expect(threadStore.indexNames).toContain('latest');
    });
  });

  // Check suggested posts are sorted correctly
  it('sortPosts() - should sort posts by hugs and dates correctly', () => {
    const posts = [
      {
        'date': new Date('2020-06-27 19:17:31.072'),
        'givenHugs': 0,
        'id': 1,
        'text': 'test',
        'userId': 1,
        'user': 'test',
        'sentHugs': [],
        'isoDate': '348310300'
      },
      {
        'date': new Date('2020-06-28 19:17:31.072'),
        'givenHugs': 1,
        'id':2,
        'text': 'test2',
        'userId': 1,
        'user': 'test',
        'sentHugs': [],
        'isoDate': '348310577'
      },
      {
        'date': new Date('2020-06-27 19:17:31.072'),
        'givenHugs': 0,
        'id': 3,
        'text': 'test3',
        'userId': 3,
        'user': 'test6',
        'sentHugs': [],
        'isoDate': '348310857'
      }
    ];

    const orderedPosts = sWManagerService.sortPosts(posts);

    expect(orderedPosts[0].id).toBe(1);
    expect(orderedPosts[1].id).toBe(3);
    expect(orderedPosts[2].id).toBe(2);
    expect(Number(orderedPosts[0].isoDate)).toBeLessThan(Number(orderedPosts[1].isoDate));
    expect(orderedPosts[2].givenHugs).toBeGreaterThan(orderedPosts[1].givenHugs);
  });

  // Query Posts Method Tests
  describe('queryPosts()', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          SWManager,
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      sWManagerService = TestBed.inject(SWManager);
      sWManagerService.currentDB = sWManagerService.openDatabase();
      populateDB(sWManagerService.currentDB, 'posts');
      httpController = TestBed.inject(HttpTestingController);
    });

    // try to get main page's new posts
    it('should get new posts correctly', () => {
      const postsPromise = sWManagerService.queryPosts('main new');

      return postsPromise!.then((posts: any) => {
        // check all the posts are there and they're ordered in reverse date order
        expect(posts).toBeDefined();
        expect(posts!.length).toBe(3);
        expect(Number(posts![0].isoDate)).toBeGreaterThan(Number(posts![1].isoDate));
        expect(Number(posts![1].isoDate)).toBeGreaterThan(Number(posts![2].isoDate));
      })
    });

    // try to get main page's suggested posts
    it('should get suggested posts correctly', () => {
      const postsPromise = sWManagerService.queryPosts('main suggested');

      return postsPromise!.then((posts: any) => {
        // check all the posts are there and they're ordered in reverse date order
        expect(posts).toBeDefined();
        expect(posts!.length).toBe(3);
        expect(posts![1].givenHugs).toBeGreaterThan(posts![0].givenHugs);
        expect(posts![2].givenHugs).toBeGreaterThan(posts![1].givenHugs);
      })
    });

    // try to get new posts
    it('should get new posts correctly - page 1', () => {
      const postsPromise = sWManagerService.queryPosts('new posts', undefined, 1);

      return postsPromise!.then((posts: any) => {
        // check all the posts are there and they're ordered in reverse date order
        expect(posts).toBeDefined();
        expect(posts!.posts.length).toBe(3);
        expect(Number(posts!.posts[0].isoDate)).toBeGreaterThan(Number(posts!.posts[1].isoDate));
        expect(Number(posts!.posts[1].isoDate)).toBeGreaterThan(Number(posts!.posts[2].isoDate));
      })
    });

    // try to get new posts page 2 (doesn't exist)
    it('should get new posts correctly - page 2', () => {
      const postsPromise = sWManagerService.queryPosts('new posts', undefined, 2);

      return postsPromise!.then((posts: any) => {
        // check all the posts are there and they're ordered in reverse date order
        expect(posts).toBeDefined();
        expect(posts!.posts.length).toBe(0);
      })
    });

    // try to get suggested posts
    it('should get suggested posts correctly - page 1', () => {
      const postsPromise = sWManagerService.queryPosts('suggested posts', undefined, 1);

      return postsPromise!.then((posts: any) => {
        // check all the posts are there and they're ordered in reverse date order
        expect(posts).toBeDefined();
        expect(posts!.posts.length).toBe(3);
        expect(posts!.posts[1].givenHugs).toBeGreaterThan(posts!.posts[0].givenHugs);
        expect(posts!.posts[2].givenHugs).toBeGreaterThan(posts!.posts[1].givenHugs);
      })
    });

    // try to get suggested posts page 2 (doesn't exist)
    it('should get suggested posts correctly - page 2', () => {
      const postsPromise = sWManagerService.queryPosts('suggested posts', undefined, 2);

      return postsPromise!.then((posts: any) => {
        // check all the posts are there and they're ordered in reverse date order
        expect(posts).toBeDefined();
        expect(posts!.posts.length).toBe(0);
      })
    });

    // try to get user's posts
    it('should get a user\'s posts correctly', () => {
      const postsPromise = sWManagerService.queryPosts('user posts', 1, 1);

      return postsPromise!.then((posts: any) => {
        expect(posts).toBeDefined();
        expect(posts!.posts.length).toBe(2);
        expect(posts!.posts[0].id).toBe(1);
        expect(posts!.posts[1].id).toBe(2);
      });
    });

    // try to get another user's posts
    it('should get other users\' posts', () => {
      const postsPromise = sWManagerService.queryPosts('user posts', 3, 1);

      return postsPromise!.then((posts: any) => {
        expect(posts).toBeDefined();
        expect(posts!.posts.length).toBe(1);
        expect(posts!.posts[0].id).toBe(3);
      });
    });
  });

  // Query Messages Method Tests
  describe('queryMessages()', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          SWManager,
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      sWManagerService = TestBed.inject(SWManager);
      sWManagerService.currentDB = sWManagerService.openDatabase();
      populateDB(sWManagerService.currentDB, 'messages');
      httpController = TestBed.inject(HttpTestingController);
    });

    // try to get inbox messages - page 1
    it('should get inbox messages correctly', () => {
      const messPromise = sWManagerService.queryMessages('inbox', 4, 1);

      return messPromise!.then(messages => {
        // check all the posts are there and they're ordered in reverse date order
        expect(messages).toBeDefined();
        expect(messages!.posts.length).toBe(1);
        expect(messages!.posts[0].id).toBe(14);
      })
    });

    // try to get inbox messages - page 2 (doesn't exist)
    it('should get inbox messages correctly - page 2', () => {
      const messPromise = sWManagerService.queryMessages('inbox', 4, 2);

      return messPromise!.then(messages => {
        // check all the posts are there and they're ordered in reverse date order
        expect(messages).toBeDefined();
        expect(messages!.posts.length).toBe(0);
      })
    });

    // try to get outbox messages - page 1
    it('should get outbox messages correctly', () => {
      const messPromise = sWManagerService.queryMessages('outbox', 4, 1);

      return messPromise!.then(messages => {
        // check all the posts are there and they're ordered in reverse date order
        expect(messages).toBeDefined();
        expect(messages!.posts.length).toBe(2);
        expect(messages!.posts[0].id).toBe(1);
        expect(messages!.posts[1].id).toBe(9);
      })
    });

    // try to get outbox messages - page 2 (doesn't exist)
    it('should get outbox messages correctly - page 2', () => {
      const messPromise = sWManagerService.queryMessages('outbox', 4, 2);

      return messPromise!.then(messages => {
        // check all the posts are there and they're ordered in reverse date order
        expect(messages).toBeDefined();
        expect(messages!.posts.length).toBe(0);
      })
    });

    // try to get thread - page 1
    it('should get thread correctly', () => {
      const messPromise = sWManagerService.queryMessages('thread', 4, 1, 3);

      return messPromise!.then(messages => {
        // check all the posts are there and they're ordered in reverse date order
        expect(messages).toBeDefined();
        expect(messages!.posts.length).toBe(1);
        expect(messages!.posts[0].id).toBe(9);
      })
    });

    // try to get thread - page 2
    it('should get thread correctly', () => {
      const messPromise = sWManagerService.queryMessages('thread', 4, 2);

      return messPromise!.then(messages => {
        // check all the posts are there and they're ordered in reverse date order
        expect(messages).toBeDefined();
        expect(messages!.posts.length).toBe(0);
      })
    });
  });

  // Query Threads Method Tests
  describe('queryThreads()', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          SWManager,
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      sWManagerService = TestBed.inject(SWManager);
      sWManagerService.currentDB = sWManagerService.openDatabase();
      populateDB(sWManagerService.currentDB, 'threads');
      httpController = TestBed.inject(HttpTestingController);
    });

    // try to get threads
    it('should get threads in the correct order - page 1', () => {
      const messPromise = sWManagerService.queryThreads(1);

      return messPromise!.then(threads => {
        // check all the posts are there and they're ordered in reverse date order
        expect(threads).toBeDefined();
        expect(threads!.posts.length).toBe(2);
        expect(threads!.posts[0].id).toBe(5);
        expect(threads!.posts[1].id).toBe(3);
      })
    });

    // try to get threads page 2 (doesn't exist)
    it('should get threads - page 2', () => {
      const messPromise = sWManagerService.queryThreads(2);

      return messPromise!.then(threads => {
        // check all the posts are there and they're ordered in reverse date order
        expect(threads).toBeDefined();
        expect(threads!.posts.length).toBe(0);
      })
    });
  });

  // Query Users Method Tests
  describe('queryUsers()', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ],
        providers: [
          SWManager,
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      sWManagerService = TestBed.inject(SWManager);
      sWManagerService.currentDB = sWManagerService.openDatabase();
      populateDB(sWManagerService.currentDB, 'users');
      httpController = TestBed.inject(HttpTestingController);
    });

    // try to get different users
    it('should get the correct user', () => {
      // fetch one user
      return sWManagerService.queryUsers(1)!.then(user => {
        expect(user).toBeDefined();
        expect(user!.id).toBe(1);
        expect(user!.displayName).toBe('shirb');
      // fetch another user
      }).then(() => {
        return sWManagerService.queryUsers(4);
      }).then((user) => {
        expect(user).toBeDefined();
        expect(user!.id).toBe(4);
        expect(user!.displayName).toBe('user14');
      })
    });

    // try to get a user that doesn't exist in IDB
    it('should get a user that doesn\'t exist', () => {
      return sWManagerService.queryUsers(5)!.then(user => {
        expect(user).toBeUndefined();
      })
    })
  });
});
