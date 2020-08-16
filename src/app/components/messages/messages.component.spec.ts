/*
	Messages Page
	Send a Hug Component Tests
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

import 'zone.js/dist/zone';
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import { TestBed, tick, fakeAsync } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { AppComponent } from '../../app.component';
import { AppMessaging } from './messages.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
import { HeaderMessage } from '../headerMessage/headerMessage.component';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('AppMessaging', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js', { enabled: false })
      ],
      declarations: [
        AppComponent,
        AppMessaging,
        PopUp,
        Loader,
        HeaderMessage
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(appMessaging).toBeTruthy();
  });

  // Check that the component loads the inbox if no mailbox is specified
  it('should load the inbox by default', () => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging.messType).toBe('inbox');
  });

  // Check that the component checks whether the user is logged in
  it('should check if the user is logged in', () => {
    const authSpy = spyOn(TestBed.get(AuthService).isUserDataResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough();
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging).toBeTruthy();
    expect(authSpy).toHaveBeenCalled();
  });

  // Check that the popup variables are set to false
  it('should have all popup variables set to false', () => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;

    expect(appMessaging.editMode).toBeFalse();
    expect(appMessaging.delete).toBeFalse();
  });

  // Check that an error is shown if the user isn't logged in
  it('should show an error if the user isn\'t logged in', fakeAsync(() => {
    TestBed.get(AuthService).authenticated = false;
    // create the component and set up spies
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    appMessaging.authService.authenticated = false;

    fixture.detectChanges();
    tick();

    expect(appMessagingDOM.querySelector('#loginBox')).toBeTruthy();
    expect(appMessagingDOM.querySelector('#userInbox')).toBeNull();
  }));

  // Check that the login method triggers the auth service
  it('should trigger the auth service upon login', fakeAsync(() => {
    // set authenticated to false
    TestBed.get(AuthService).authenticated = false;
    // create the component and set up spies
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AppMessaging);
    const appMessaging = fixture.componentInstance;
    const appMessagingDOM = fixture.nativeElement;
    appMessaging.authService.authenticated = false;
    const loginSpy = spyOn(appMessaging, 'login').and.callThrough();
    const loginServiceSpy = spyOn(appMessaging.authService, 'login').and.callThrough();

    fixture.detectChanges();
    tick();

    // simulate click
    appMessagingDOM.querySelector('#logIn').click();
    fixture.detectChanges();
    tick();

    // check the spies are called
    expect(loginSpy).toHaveBeenCalled();
    expect(loginServiceSpy).toHaveBeenCalled();
    expect(appMessaging.authService.authenticated).toBeTrue();
  }));

  // INBOX
  // ==================================================================
  describe('Inbox', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false })
        ],
        declarations: [
          AppComponent,
          AppMessaging,
          PopUp,
          Loader,
          HeaderMessage
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that the inbox is loaded correctly
    it('should load the correct mailbox - inbox', () => {
      TestBed.get(ActivatedRoute).url = of([{path: 'inbox'}]);
      const getMessagesSpy = spyOn(TestBed.get(ItemsService), 'getMailboxMessages').and.callThrough();
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      appMessaging.login();

      fixture.detectChanges();

      expect(appMessaging.messType).toBe('inbox');
      expect(getMessagesSpy).toHaveBeenCalledWith('inbox', 4);
    });

    // Check each message has delete button and reply link
    it('should have the relevant buttons for each message', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'inbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0]).toBeTruthy();
      const messages = appMessagingDOM.querySelectorAll('.userMessage');
      expect(messages.length).toBe(2);
      messages.forEach((message:HTMLLIElement) => {
          expect(message.querySelectorAll('.messageButton')[0].tagName.toLowerCase()).toBe('a');
          expect(message.querySelectorAll('.messageButton')[0].textContent).toBe('Reply');
          expect(message.querySelectorAll('.messageButton')[0].getAttribute('href')).toContain('/new');
          expect(message.querySelectorAll('.deleteButton')[0].tagName.toLowerCase()).toBe('button');
          expect(message.querySelectorAll('.deleteButton')[0].textContent).toBe('Delete Message');
      });
    }));

    // Check deleting a single message triggers the poppup
    it('should trigger the popup upon delete', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'inbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      const messages = appMessagingDOM.querySelectorAll('.mailboxMessages')[0];
      messages.querySelectorAll('.deleteButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('Message');
      expect(appMessaging.itemToDelete).toBe(1);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that deleting all messages triggers the popup
    it('should trigger the popup upon deleting all', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'inbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      appMessagingDOM.querySelectorAll('.deleteAll')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('All inbox');
      expect(appMessaging.itemToDelete).toBe(4);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that a different page gets different results
    it('should change pages when clicked', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'inbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click, page 1
      expect(appMessaging.itemsService.userMessagesPage.inbox).toBe(1);
      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0].children.length).toBe(2);

      // trigger click
      appMessagingDOM.querySelectorAll('.nextButton')[0].click();
      fixture.detectChanges();
      tick();

      // after click, page 2
      expect(appMessaging.itemsService.userMessagesPage.inbox).toBe(2);
      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0].children.length).toBe(3);

      // trigger another click
      appMessagingDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();
      tick();

      // after click, page 1
      expect(appMessaging.itemsService.userMessagesPage.inbox).toBe(1);
      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0].children.length).toBe(2);
    }));
  });

  // OUTBOX
  // ==================================================================
  describe('Outbox', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false })
        ],
        declarations: [
          AppComponent,
          AppMessaging,
          PopUp,
          Loader,
          HeaderMessage
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that the outbox is loaded correctly
    it('should load the correct mailbox - outbox', () => {
      TestBed.get(ActivatedRoute).url = of([{path: 'outbox'}]);
      const getMessagesSpy = spyOn(TestBed.get(ItemsService), 'getMailboxMessages').and.callThrough();
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      appMessaging.login();

      fixture.detectChanges();

      expect(appMessaging.messType).toBe('outbox');
      expect(getMessagesSpy).toHaveBeenCalledWith('outbox', 4);
    });

    // Check each message has delete button and reply link
    it('should have the relevant buttons for each message', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'outbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0]).toBeTruthy();
      const messages = appMessagingDOM.querySelectorAll('.userMessage');
      expect(messages.length).toBe(2);
      messages.forEach((message:HTMLLIElement) => {
          expect(message.querySelectorAll('.deleteButton')[0].tagName.toLowerCase()).toBe('button');
          expect(message.querySelectorAll('.deleteButton')[0].textContent).toBe('Delete Message');
      });
    }));

    // Check deleting a single message triggers the poppup
    it('should trigger the popup upon delete', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'outbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      const messages = appMessagingDOM.querySelectorAll('.mailboxMessages')[0];
      messages.querySelectorAll('.deleteButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('Message');
      expect(appMessaging.itemToDelete).toBe(18);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that deleting all messages triggers the popup
    it('should trigger the popup upon deleting all', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'outbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      appMessagingDOM.querySelectorAll('.deleteAll')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('All outbox');
      expect(appMessaging.itemToDelete).toBe(4);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that a different page gets different results
    it('should change pages when clicked', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'outbox'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click, page 1
      expect(appMessaging.itemsService.userMessagesPage.outbox).toBe(1);
      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0].children.length).toBe(2);

      // trigger click
      appMessagingDOM.querySelectorAll('.nextButton')[0].click();
      fixture.detectChanges();
      tick();

      // after click, page 2
      expect(appMessaging.itemsService.userMessagesPage.outbox).toBe(2);
      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0].children.length).toBe(1);

      // trigger another click
      appMessagingDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();
      tick();

      // after click, page 1
      expect(appMessaging.itemsService.userMessagesPage.outbox).toBe(1);
      expect(appMessagingDOM.querySelectorAll('.mailboxMessages')[0].children.length).toBe(2);
    }));
  });

  // THREADS
  // ==================================================================
  describe('Threads', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false })
        ],
        declarations: [
          AppComponent,
          AppMessaging,
          PopUp,
          Loader,
          HeaderMessage
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that the threads mailbox is loaded correctly
    it('should load the correct mailbox - threads', () => {
      TestBed.get(ActivatedRoute).url = of([{path: 'threads'}]);
      const getMessagesSpy = spyOn(TestBed.get(ItemsService), 'getThreads').and.callThrough();
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      appMessaging.login();

      fixture.detectChanges();

      expect(appMessaging.messType).toBe('threads');
      expect(getMessagesSpy).toHaveBeenCalledWith(4);
    });

    // Check each message has delete button and view thread link
    it('should have the relevant buttons for each message', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'threads'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      expect(appMessagingDOM.querySelectorAll('.userThreads')[0]).toBeTruthy();
      const threads = appMessagingDOM.querySelectorAll('.userThread');
      expect(threads.length).toBe(1);
      threads.forEach((thread:HTMLLIElement) => {
          expect(thread.querySelectorAll('.viewButton')[0].tagName.toLowerCase()).toBe('button');
          expect(thread.querySelectorAll('.viewButton')[0].textContent).toBe('View Thread Messages');
          expect(thread.querySelectorAll('.deleteButton')[0].tagName.toLowerCase()).toBe('button');
          expect(thread.querySelectorAll('.deleteButton')[0].textContent).toBe('Delete Thread');
      });
    }));

    // Check deleting a single message triggers the poppup
    it('should trigger the popup upon delete', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'threads'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      const threads = appMessagingDOM.querySelectorAll('.userThreads')[0];
      threads.querySelectorAll('.deleteButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('Thread');
      expect(appMessaging.itemToDelete).toBe(3);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that deleting all messages triggers the popup
    it('should trigger the popup upon deleting all', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'threads'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      appMessagingDOM.querySelectorAll('.deleteAll')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('All threads');
      expect(appMessaging.itemToDelete).toBe(4);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that a different page gets different results
    it('should change pages when clicked', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'threads'}]);
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click, page 1
      expect(appMessaging.itemsService.userMessagesPage.threads).toBe(1);
      expect(appMessagingDOM.querySelectorAll('.userThreads')[0].children.length).toBe(1);

      // trigger click
      appMessagingDOM.querySelectorAll('.nextButton')[0].click();
      fixture.detectChanges();
      tick();

      // after click, page 2
      expect(appMessaging.itemsService.userMessagesPage.threads).toBe(2);
      expect(appMessagingDOM.querySelectorAll('.userThreads')[0].children.length).toBe(1);

      // trigger another click
      appMessagingDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();
      tick();

      // after click, page 1
      expect(appMessaging.itemsService.userMessagesPage.threads).toBe(1);
      expect(appMessagingDOM.querySelectorAll('.userThreads')[0].children.length).toBe(1);
    }));
  });

  // THREAD
  // ==================================================================
  describe('Thread', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false })
        ],
        declarations: [
          AppComponent,
          AppMessaging,
          PopUp,
          Loader,
          HeaderMessage
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that the specific thread is loaded correctly
    it('should load the correct mailbox - thread', () => {
      TestBed.get(ActivatedRoute).url = of([{path: 'thread'}]);
      const paramSpy = spyOn((TestBed.get(ActivatedRoute) as ActivatedRoute).snapshot.paramMap, 'get').and.returnValue('3');
      const getMessagesSpy = spyOn(TestBed.get(ItemsService), 'getThread').and.callThrough();
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      appMessaging.login();

      fixture.detectChanges();

      expect(paramSpy).toHaveBeenCalled();
      expect(appMessaging.messType).toBe('thread');
      expect(getMessagesSpy).toHaveBeenCalledWith(4, 3);
    });

    // Check each message has delete button and reply link
    it('should have the relevant buttons for each message', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'thread'}]);
      spyOn((TestBed.get(ActivatedRoute) as ActivatedRoute).snapshot.paramMap, 'get').and.returnValue('3');
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      expect(appMessagingDOM.querySelectorAll('.threadMessages')[0]).toBeTruthy();
      const messages = appMessagingDOM.querySelectorAll('.userMessage');
      expect(messages.length).toBe(2);
      messages.forEach((message:HTMLLIElement) => {
          expect(message.querySelectorAll('.messageButton')[0].tagName.toLowerCase()).toBe('a');
          expect(message.querySelectorAll('.messageButton')[0].textContent).toBe('Reply');
          expect(message.querySelectorAll('.messageButton')[0].getAttribute('href')).toContain('/new');
          expect(message.querySelectorAll('.deleteButton')[0].tagName.toLowerCase()).toBe('button');
          expect(message.querySelectorAll('.deleteButton')[0].textContent).toBe('Delete Message');
      });
    }));

    // Check deleting a single message triggers the poppup
    it('should trigger the popup upon delete', fakeAsync(() => {
      TestBed.get(ActivatedRoute).url = of([{path: 'thread'}]);
      spyOn((TestBed.get(ActivatedRoute) as ActivatedRoute).snapshot.paramMap, 'get').and.returnValue('3');
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(AppMessaging);
      const appMessaging = fixture.componentInstance;
      const appMessagingDOM = fixture.nativeElement;
      appMessaging.login();

      fixture.detectChanges();
      tick();

      // before the click
      expect(appMessaging.editMode).toBeFalse();
      expect(appMessaging.delete).toBeFalse();

      // trigger click
      const threads = appMessagingDOM.querySelectorAll('.threadMessages')[0];
      threads.querySelectorAll('.deleteButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(appMessaging.editMode).toBeTrue();
      expect(appMessaging.delete).toBeTrue();
      expect(appMessaging.toDelete).toBe('Message');
      expect(appMessaging.itemToDelete).toBe(9);
      expect(appMessagingDOM.querySelector('app-pop-up')).toBeTruthy();
    }));
  });
});
