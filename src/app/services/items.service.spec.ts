/*
	Items Service
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

import { ItemsService } from './items.service';
import { AuthService } from './auth.service';
import { MockAuthService } from './auth.service.mock';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';
import { SWManager } from './sWManager.service';
import { MockSWManager } from './sWManager.service.mock';
import { Report } from "../interfaces/report.interface";

describe('ItemsService', () => {
  let httpController: HttpTestingController;
  let itemsService: ItemsService;

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
        ItemsService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService },
        { provide: SWManager, useClass: MockSWManager }
      ]
    }).compileComponents();

    itemsService = TestBed.inject(ItemsService);
    httpController = TestBed.inject(HttpTestingController);
    // set the user data as if the user is logged in
    itemsService['authService'].userData = {
      id: 4,
      auth0Id: '',
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
      jwt: '',
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false
    };
    itemsService['authService'].authenticated = true;
    itemsService['authService'].isUserDataResolved.next(true);
    itemsService['authService'].login();
  });

  // Check the service is created
  it('should be created', () => {
    expect(itemsService).toBeTruthy();
  });

  // Check that the service gets the user's post
  it('getUserPosts() - should get user posts', () => {
    // mock response
    const mockResponse = {
      page: 1,
      posts: [
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 14,
          text: "new here",
          userId: 1
        },
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 15,
          text: "hi everyone",
          userId: 1
        }
      ],
      success: true,
      total_pages: 1
    };

    itemsService['authService'].userData = {
      id: 4,
      auth0Id: '',
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
      jwt: '',
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false
    };
    itemsService['authService'].authenticated = true;
    itemsService['authService'].isUserDataResolved.next(true);
    itemsService['authService'].login();
    const querySpy = spyOn(itemsService['serviceWorkerM'], 'queryPosts');
    const addSpy = spyOn(itemsService['serviceWorkerM'], 'addItem');
    const cleanSpy = spyOn(itemsService['serviceWorkerM'], 'cleanDB');
    itemsService.getUserPosts(1);
    // wait for the fetch to be resolved
    itemsService.isUserPostsResolved.other.subscribe((value) => {
      if(value) {
        expect(itemsService.userPosts.other.length).toBe(2);
        expect(itemsService.totalUserPostsPages.other).toBe(1);
        expect(itemsService.userPostsPage.other).toBe(1);
        expect(itemsService.previousUser).toBe(1);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/users/all/1/posts?page=1');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(querySpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
  });

  // Check that the service correctly tells the difference between the logged in user
  // and other users
  it('getUserPosts() - should tell the difference between self and other user', () => {
    // mock response for 'other user'
    const mockOtherResponse = {
      page: 1,
      posts: [
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 14,
          text: "new here",
          userId: 1
        },
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 15,
          text: "hi everyone",
          userId: 1
        }
      ],
      success: true,
      total_pages: 1
    };
    // mock response for 'self'
    // mock response
    const mockSelfResponse = {
      page: 1,
      posts: [
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 12,
          text: "new here",
          userId: 4
        },
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 10,
          text: "hi everyone",
          userId: 4
        },
        {
          date: "Mon, 08 Jun 2020 14:43:05 GMT",
          givenHugs: 0,
          id: 11,
          text: "hi everyone",
          userId: 4
        }
      ],
      success: true,
      total_pages: 1
    };

    // run the test for the user's own profile
    new Promise(() => {
      // login and get the user's own posts
      itemsService['authService'].userData = {
        id: 4,
        auth0Id: '',
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
        jwt: '',
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false
      };
      itemsService['authService'].authenticated = true;
      itemsService['authService'].isUserDataResolved.next(true);
      itemsService['authService'].login();
      itemsService.getUserPosts(4);
      // wait for the fetch to be resolved
      itemsService.isUserPostsResolved.other.subscribe((value) => {
        if(value) {
          // check the items service correctly identified it as 'self' and didn't
          // touch the 'other' variables
          expect(itemsService.userPosts.self.length).toBe(3);
          expect(itemsService.userPosts.other.length).toBe(0);
          expect(itemsService.totalUserPostsPages.self).toBe(1);
          expect(itemsService.userPostsPage.self).toBe(1);
          expect(itemsService.previousUser).toBe(0);
        }
      });

      const selfReq = httpController.expectOne('http://localhost:5000/users/all/4/posts?page=1');
      expect(selfReq.request.method).toEqual('GET');
      selfReq.flush(mockSelfResponse);
    // and once it's done, run the 'other' tests
    }).then(() => {
      // for comparison, then fetch another user's posts
      itemsService.getUserPosts(1);
      // wait for the fetch to be resolved
      itemsService.isUserPostsResolved.self.subscribe((value) => {
        if(value) {
          expect(itemsService.userPosts.other.length).toBe(2);
          expect(itemsService.totalUserPostsPages.other).toBe(1);
          expect(itemsService.userPostsPage.other).toBe(1);
          expect(itemsService.previousUser).toBe(1);
          expect(itemsService.userPosts.other[0].id).not.toEqual(itemsService.userPosts.self[0].id);
          expect(itemsService.userPosts.other[1].id).not.toEqual(itemsService.userPosts.self[1].id);
        }
      });

      const otherReq = httpController.expectOne('http://localhost:5000/users/all/1/posts?page=1');
      expect(otherReq.request.method).toEqual('GET');
      otherReq.flush(mockOtherResponse);
    });
  });

  // Check that the service sends the user a hug
  it('sendUserHug() - should send a hug to a user', () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        displayName: "user_14",
        givenH: 0,
        id: 2,
        posts: 2,
        receivedH: 1,
        role: "user"
      }
    };

    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    itemsService['authService'].userData = {
      id: 4,
      auth0Id: '',
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
      jwt: '',
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false
    };
    itemsService['authService'].authenticated = true;
    itemsService['authService'].isUserDataResolved.next(true);
    itemsService['authService'].login();
    itemsService.otherUserData = {
      id: 2,
      displayName: 'user_14',
      receivedHugs: 0,
      givenHugs: 0,
      postsNum: 2,
      role: 'user'
    };
    itemsService.sendUserHug(2);

    const req = httpController.expectOne('http://localhost:5000/users/all/2');
    expect(req.request.method).toEqual('PATCH');
    req.flush(mockResponse);

    expect(itemsService['authService'].userData.givenHugs).toBe(3);
    expect(itemsService.otherUserData.receivedHugs).toBe(1);
    expect(alertSpy).toHaveBeenCalled();
  });

  // Check that the service gets other users' data
  it('getUser() - should get user data', () => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        displayName: "user_14",
        givenH: 0,
        id: 2,
        posts: 2,
        receivedH: 1,
        role: "user"
      }
    };

    const postsSpy = spyOn(itemsService, 'getUserPosts');
    const querySpy = spyOn(itemsService['serviceWorkerM'], 'queryUsers');
    const addSpy = spyOn(itemsService['serviceWorkerM'], 'addItem');
    itemsService.getUser(2);

    const req = httpController.expectOne('http://localhost:5000/users/all/2');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    // wait for the fetch to be resolved
    itemsService.isOtherUserResolved.subscribe((value) => {
      if(value) {
        expect(itemsService.otherUserData.id).toBe(2);
        expect(itemsService.otherUserData.displayName).toBe('user_14');
        expect(itemsService.otherUserData.receivedHugs).toBe(1);
        expect(itemsService.otherUserData.givenHugs).toBe(0);
        expect(itemsService.otherUserData.role).toBe('user');
        expect(itemsService.otherUserData.postsNum).toBe(2);
        expect(postsSpy).toHaveBeenCalled();
        expect(postsSpy).toHaveBeenCalledWith(2);
      }
    });

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith(2);
    expect(addSpy).toHaveBeenCalled();
  });

  // Check that the service gets the user's inbox
  it('getMailboxMessages() - should get inbox messages', () => {
    // mock response
    const mockResponse = {
      current_page: 1,
      messages: [
        {
          date: "Mon, 08 Jun 2020 14:44:55 GMT",
          for: "user_14",
          forId: 4,
          from: "shirb",
          fromId: 1,
          id: 6,
          messageText: "hiiii"
        },
        {
          date: "Mon, 08 Jun 2020 14:50:19 GMT",
          for: "user_14",
          forId: 4,
          from: "user52",
          fromId: 5,
          id: 8,
          messageText: "hi there :)"
        }
      ],
      success: true,
      total_pages: 1
    };

    const querySpy = spyOn(itemsService['serviceWorkerM'], 'queryMessages');
    const addSpy = spyOn(itemsService['serviceWorkerM'], 'addItem');
    const cleanSpy = spyOn(itemsService['serviceWorkerM'], 'cleanDB');
    itemsService.getMailboxMessages('inbox', 4);
    // wait for the fetch to be resolved
    itemsService.isUserMessagesResolved.inbox.subscribe((value) => {
      if(value) {
        expect(itemsService.userMessages.inbox.length).toBe(2);
        expect(itemsService.userMessages.inbox[0].id).toBe(6);
        expect(itemsService.userMessagesPage.inbox).toBe(1);
        expect(itemsService.totalUserMessagesPages.inbox).toBe(1);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/messages?userID=4&page=1&type=inbox');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(querySpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
  });

  // Check that the service gets the user's outbox
  it('getMailboxMessages() - should get outbox messages', () => {
    // mock response
    const mockResponse = {
      current_page: 1,
      messages: [
        {
          date: "Mon, 08 Jun 2020 14:44:55 GMT",
          for: "shirb",
          forId: 1,
          from: "user_14",
          fromId: 4,
          id: 9,
          messageText: "hiiii"
        },
        {
          date: "Mon, 08 Jun 2020 14:50:19 GMT",
          for: "user52",
          forId: 5,
          from: "user_14",
          fromId: 4,
          id: 10,
          messageText: "hi there :)"
        }
      ],
      success: true,
      total_pages: 1
    };

    const querySpy = spyOn(itemsService['serviceWorkerM'], 'queryMessages');
    const addSpy = spyOn(itemsService['serviceWorkerM'], 'addItem');
    const cleanSpy = spyOn(itemsService['serviceWorkerM'], 'cleanDB');
    itemsService.getMailboxMessages('outbox', 4);
    // wait for the fetch to be resolved
    itemsService.isUserMessagesResolved.inbox.subscribe((value) => {
      if(value) {
        expect(itemsService.userMessages.outbox.length).toBe(2);
        expect(itemsService.userMessages.outbox[0].id).toBe(9);
        expect(itemsService.userMessagesPage.outbox).toBe(1);
        expect(itemsService.totalUserMessagesPages.outbox).toBe(1);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/messages?userID=4&page=1&type=outbox');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(querySpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
  });

  // Check the service tells the difference between inbox and outbox
  it('getMailboxMessages() - should tell the difference between outbox and inbox', () => {
    // mock response
    const mockInboxResponse = {
      current_page: 1,
      messages: [
        {
          date: "Mon, 08 Jun 2020 14:44:55 GMT",
          for: "user_14",
          forId: 4,
          from: "shirb",
          fromId: 1,
          id: 6,
          messageText: "hiiii"
        },
        {
          date: "Mon, 08 Jun 2020 14:50:19 GMT",
          for: "user_14",
          forId: 4,
          from: "user52",
          fromId: 5,
          id: 8,
          messageText: "hi there :)"
        }
      ],
      success: true,
      total_pages: 1
    };

    // mock response
    const mockOutboxResponse = {
      current_page: 1,
      messages: [
        {
          date: "Mon, 08 Jun 2020 14:44:55 GMT",
          for: "shirb",
          forId: 1,
          from: "user_14",
          fromId: 4,
          id: 9,
          messageText: "hiiii"
        },
        {
          date: "Mon, 08 Jun 2020 14:50:19 GMT",
          for: "user52",
          forId: 5,
          from: "user_14",
          fromId: 4,
          id: 10,
          messageText: "hi there :)"
        }
      ],
      success: true,
      total_pages: 1
    };

    // inbox request
    itemsService.getMailboxMessages('inbox', 4);
    // wait for the fetch to be resolved
    itemsService.isUserMessagesResolved.inbox.subscribe((value) => {
      if(value) {
        expect(itemsService.userMessages.inbox.length).toBe(2);
        expect(itemsService.userMessagesPage.inbox).toBe(1);
        expect(itemsService.totalUserMessagesPages.inbox).toBe(1);
      }
    });

    // outbox request
    itemsService.getMailboxMessages('outbox', 4);
    // wait for the fetch to be resolved
    itemsService.isUserMessagesResolved.outbox.subscribe((value) => {
      if(value) {
        expect(itemsService.userMessages.outbox.length).toBe(2);
        expect(itemsService.userMessagesPage.outbox).toBe(1);
        expect(itemsService.totalUserMessagesPages.outbox).toBe(1);
        // check there's a difference
        expect(itemsService.userMessages.inbox[0].id).not.toEqual(itemsService.userMessages.outbox[0].id);
        expect(itemsService.userMessages.inbox[1].id).not.toEqual(itemsService.userMessages.outbox[1].id);
      }
    });

    const inboxReq = httpController.expectOne('http://localhost:5000/messages?userID=4&page=1&type=inbox');
    expect(inboxReq.request.method).toEqual('GET');
    inboxReq.flush(mockInboxResponse);

    const outboxReq = httpController.expectOne('http://localhost:5000/messages?userID=4&page=1&type=outbox');
    expect(outboxReq.request.method).toEqual('GET');
    outboxReq.flush(mockOutboxResponse);
  });

  // Check the service correctly gets the user's threads
  it('getThreads() - should get the user\'s threads', () => {
    // mock response
    const mockResponse = {
      current_page: 1,
      messages: [
        {
          id: 1,
          user1: 'user',
          user1Id: 2,
          user2: 'user2',
          user2Id: 4,
          numMessages: 2,
          latestMessage: "Mon, 08 Jun 2020 14:50:19 GMT"
        },
        {
          id: 3,
          user1: 'user',
          user1Id: 1,
          user2: 'user2',
          user2Id: 4,
          numMessages: 2,
          latestMessage: "Mon, 08 Jun 2020 14:50:19 GMT"
        }
      ],
      success: true,
      total_pages: 1
    };

    const querySpy = spyOn(itemsService['serviceWorkerM'], 'queryThreads');
    const addSpy = spyOn(itemsService['serviceWorkerM'], 'addItem');
    const cleanSpy = spyOn(itemsService['serviceWorkerM'], 'cleanDB');
    itemsService.getThreads(4);
    // wait for the fetch to be resolved
    itemsService.isUserMessagesResolved.threads.subscribe((value) => {
      if(value) {
        expect(itemsService.userMessages.threads.length).toBe(2);
        expect(itemsService.userMessages.threads[0].id).toBe(1);
        expect(itemsService.userMessagesPage.threads).toBe(1);
        expect(itemsService.totalUserMessagesPages.threads).toBe(1);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/messages?userID=4&page=1&type=threads');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith(1);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
  });

  // Check the service correctly gets the requested thread
  it('getThread() - should get a specific thread', () => {
    // mock response
    const mockResponse = {
      current_page: 1,
      messages: [
        {
          date: "Mon, 08 Jun 2020 14:44:55 GMT",
          for: "shirb",
          forId: 1,
          from: "user_14",
          fromId: 4,
          id: 9,
          messageText: "hiiii",
          threadID: 1
        },
        {
          date: "Mon, 08 Jun 2020 14:50:19 GMT",
          for: "shirb",
          forId: 1,
          from: "user_14",
          fromId: 4,
          id: 10,
          messageText: "hi there :)",
          threadID: 1
        }
      ],
      success: true,
      total_pages: 1
    };

    const querySpy = spyOn(itemsService['serviceWorkerM'], 'queryMessages');
    const addSpy = spyOn(itemsService['serviceWorkerM'], 'addItem');
    const cleanSpy = spyOn(itemsService['serviceWorkerM'], 'cleanDB');
    itemsService.getThread(4, 1);
    // wait for the fetch to be resolved
    itemsService.isThreadResolved.subscribe((value) => {
      if(value) {
        expect(itemsService.threadMessages.length).toBe(2);
        expect(itemsService.threadMessages[0].id).toBe(9);
        expect(itemsService.threadMessages[0].threadID).toBe(1);
        expect(itemsService.threadPage).toBe(1);
        expect(itemsService.totalThreadPages).toBe(1);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/messages?userID=4&page=1&type=thread&threadID=1');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    expect(querySpy).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith('thread', 4, 1, 1);
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(cleanSpy).toHaveBeenCalled();
  });

  // Check the service correctly sends a message
  it('sendMessage() - should send a message', () => {
    // mock response
    const mockResponse = {
      message: {
        date: "Mon, 08 Jun 2020 14:43:15 GMT",
        forId: 1,
        fromId: 4,
        id: 9,
        messageText: "hang in there",
        threadID: 1
      },
      success: true
    };

    const message = {
      from: 'user',
      fromId: 4,
      for: 'user2',
      forId: 1,
      messageText: 'hang in there',
      date: new Date("Mon, 08 Jun 2020 14:43:15 GMT")
    };
    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    itemsService.sendMessage(message);

    const req = httpController.expectOne('http://localhost:5000/messages');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Your message was sent!', false, '/');
  });

  // Check that the service deletes a message
  it('deleteMessage() - should delete a message', () => {
    // mock response
    const mockResponse = {
      deleted: "6",
      success: true
    };

    // make the request
    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    const deleteSpy = spyOn(itemsService['serviceWorkerM'], 'deleteItem');
    itemsService.deleteMessage(6, 'inbox');

    const req = httpController.expectOne('http://localhost:5000/messages/inbox/6');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(`Message 6 was deleted! Refresh to view the updated message list.`, true);
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith('messages', 6);
  });

  // Check that the service deletes a thread
  it('deleteThread() - should delete a thread', () => {
    // mock response
    const mockResponse = {
      deleted: "2",
      success: true
    };

    // make the request
    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    const deleteSpy = spyOn(itemsService['serviceWorkerM'], 'deleteItem');
    const deleteMultiSpy = spyOn(itemsService['serviceWorkerM'], 'deleteItems');
    itemsService.deleteThread(2);

    const req = httpController.expectOne('http://localhost:5000/messages/threads/2');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(`Thread 2 was deleted! Refresh to view the updated message list.`, true);
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith('threads', 2);
    expect(deleteMultiSpy).toHaveBeenCalled();
    expect(deleteMultiSpy).toHaveBeenCalledWith('messages', 'threadID', 2);
  });

  // Check that the service clears the mailbox - inbox
  it('deleteAll() - should clear a mailbox - inbox', () => {
    // mock response
    const mockResponse = {
      deleted: "2",
      success: true,
      userID: "4"
    };

    // make the request
    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    const deleteSpy = spyOn(itemsService['serviceWorkerM'], 'deleteItems');
    itemsService.deleteAll('all inbox', 4);

    const req = httpController.expectOne('http://localhost:5000/messages/inbox?userID=4');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(`2 messages were deleted! Refresh to view the updated mailbox.`, true);
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith('messages', 'forId', 4);
  });

  // Check that the service clears the mailbox - outbox
  it('deleteAll() - should clear a mailbox - outbox', () => {
    // mock response
    const mockResponse = {
      deleted: "2",
      success: true,
      userID: "4"
    };

    // make the request
    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    const deleteSpy = spyOn(itemsService['serviceWorkerM'], 'deleteItems');
    itemsService.deleteAll('all outbox', 4);

    const req = httpController.expectOne('http://localhost:5000/messages/outbox?userID=4');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(`2 messages were deleted! Refresh to view the updated mailbox.`, true);
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith('messages', 'fromId', 4);
  });

  // Check that the service clears the mailbox - threads
  it('deleteAll() - should clear a mailbox - threads', () => {
    // mock response
    const mockResponse = {
      deleted: "2",
      success: true,
      userID: "4"
    };

    // make the request
    const alertSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    const clearSpy = spyOn(itemsService['serviceWorkerM'], 'clearStore');
    itemsService.deleteAll('all threads', 4);

    const req = httpController.expectOne('http://localhost:5000/messages/threads?userID=4');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(`2 messages were deleted! Refresh to view the updated mailbox.`, true);
    expect(clearSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalledTimes(2);
    expect(clearSpy).toHaveBeenCalledWith('messages');
    expect(clearSpy).toHaveBeenCalledWith('threads');
  });

  // Check that the service runs the search and handles results correctly
  it('sendSearch() - should run a search', () => {
    // mock response
    const mockResponse = {
      current_page: 1,
      post_results: 7,
      posts: [
        {
          date: "Mon, 01 Jun 2020 15:20:11 GMT",
          givenHugs: 0,
          id: 7,
          text: "test",
          user: "shirb",
          userId: 1
        },
        {
          date: "Mon, 01 Jun 2020 15:19:41 GMT",
          givenHugs: 0,
          id: 6,
          text: "test",
          user: "shirb",
          userId: 1
        },
        {
          date: "Mon, 01 Jun 2020 15:18:37 GMT",
          givenHugs: 0,
          id: 5,
          text: "test",
          user: "shirb",
          userId: 1
        },
        {
          date: "Mon, 01 Jun 2020 15:17:56 GMT",
          givenHugs: 0,
          id: 4,
          text: "test",
          user: "shirb",
          userId: 1
        },
        {
          date: "Mon, 01 Jun 2020 15:15:12 GMT",
          givenHugs: 0,
          id: 3,
          text: "testing",
          user: "shirb",
          userId: 1
        }
      ],
      success: true,
      total_pages: 2,
      user_results: 2,
      users: [
        {
          id: 6,
          displayName: 'tests',
          receivedHugs: 2,
          givenHugs: 4,
          postsNum: 1,
          role: 'user'
        },
        {
          id: 7,
          displayName: 'testing',
          receivedHugs: 2,
          givenHugs: 4,
          postsNum: 1,
          role: 'user'
        }
      ]
    };

    itemsService.sendSearch('test');
    // wait until the search is resolved
    itemsService.isSearchResolved.subscribe((value) => {
      if(value) {
        expect(itemsService.userSearchResults.length).toBe(2);
        expect(itemsService.postSearchResults.length).toBe(5);
        expect(itemsService.numUserResults).toBe(2);
        expect(itemsService.numPostResults).toBe(7);
        expect(itemsService.postSearchPage).toBe(1);
        expect(itemsService.totalPostSearchPages).toBe(2);
        expect(itemsService.isSearching).toBeFalse();
      }
    });

    const req = httpController.expectOne('http://localhost:5000?page=1');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  // Check the service sends a report
  it('sendReport() - should send a report', () => {
    // mock response
    const mockResponse = {
      report: {
        closed: false,
        date: "Tue Jun 23 2020 14:59:31 GMT+0300",
        dismissed: false,
        id: 36,
        reportReason: "reason",
        reporter: 2,
        type: "User",
        userID: 5
      },
      "success": true
    };

    // request data
    const report:Report = {
      type: 'User',
      userID: 5,
      reporter: 2,
      reportReason: 'reason',
      date: new Date("Tue Jun 23 2020 14:59:31 GMT+0300"),
      dismissed: false,
      closed: false
    };
    const alertsSpy = spyOn(itemsService['alertsService'], 'createSuccessAlert');
    itemsService.sendReport(report);

    const req = httpController.expectOne('http://localhost:5000/reports');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);

    expect(alertsSpy).toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith(`User 5 was successfully reported.`, false, '/');
  });
});
