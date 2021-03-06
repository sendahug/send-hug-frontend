/*
	New Item
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
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from '../../app.component';
import { NewItem } from './newItem.component';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AlertsService } from '../../services/alerts.service';
import { MockAlertsService } from '../../services/alerts.service.mock';
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { of } from 'rxjs';
import { NotificationsTab } from '../notifications/notifications.component';

describe('NewItem', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js', { enabled: false }),
        FontAwesomeModule
      ],
      declarations: [
        AppComponent,
        NewItem,
        NotificationsTab
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(NewItem);
    const newItem = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(newItem).toBeTruthy();
  });

  // NEW POST
  // ==================================================================
  describe('New Post', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false }),
          FontAwesomeModule
        ],
        declarations: [
          AppComponent,
          NewItem,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the type of new item is determined by the parameter type
    it('has a type determined by the type parameter - post', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Post'} as UrlSegment]);
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();

      fixture.detectChanges();

      expect(newItem.itemType).toBe('Post');
      expect(newItemDOM.querySelector('#newPost')).toBeTruthy();
      expect(newItemDOM.querySelector('#newMessage')).toBeNull();
      expect(newItemDOM.querySelectorAll('.formElement')[0].querySelectorAll('.pageData')[0].textContent).toBe('name');
      done();
    });

    // Check that it triggers the posts service when creating a new post
    it('triggers the posts service when creating a new post', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Post'} as UrlSegment]);
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newPostSpy = spyOn(newItem, 'sendPost').and.callThrough();
      const postsService = newItem['postsService'];
      const newPostServiceSpy = spyOn(postsService, 'sendPost').and.callThrough();
      newItem['authService'].login();

      fixture.detectChanges();

      // fill in post's text and trigger a click
      const postText = 'new post';
      newItemDOM.querySelector('#postText').value = postText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      const newPost = {
        userId: 4,
        user: 'name',
        text: postText,
        givenHugs: 0
      };
      expect(newPostSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(newPost));
      done();
    });

    // Check that an empty post triggers an alert
    it('should prevent empty posts', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Post'} as UrlSegment]);
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newPostSpy = spyOn(newItem, 'sendPost').and.callThrough();
      const postsService = newItem['postsService'];
      const newPostServiceSpy = spyOn(postsService, 'sendPost').and.callThrough();
      const alertsService = newItem['alertService'];
      const alertSpy = spyOn(alertsService, 'createAlert').and.callThrough();
      newItem['authService'].login();

      fixture.detectChanges();

      // fill in post's text and trigger a click
      const postText = '';
      newItemDOM.querySelector('#postText').value = postText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      expect(newPostSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).not.toHaveBeenCalled();

      fixture.detectChanges();

      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0].querySelectorAll('.alertText')[0].textContent).toBe('A post cannot be empty. Please fill the field and try again.');
      done();
    });

    // Check that a user can't post if they're blocked
    it('should prevent blocked users from posting', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Post'} as UrlSegment]);
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();
      newItem['authService'].userData.blocked = true;
      newItem['authService'].userData.releaseDate = new Date((new Date()).getTime() + 864E5 * 7);

      fixture.detectChanges();

      const alert = `You are currently blocked until ${newItem['authService'].userData.releaseDate}. You cannot post new posts.`;
      expect(newItemDOM.querySelectorAll('.newItem')[0]).toBeUndefined();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0].textContent).toContain(alert);
      done();
    });

    // Check that a user can't post if they're logged out
    it('should prevent logged out users from posting', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Post'} as UrlSegment]);
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newPostSpy = spyOn(newItem, 'sendPost').and.callThrough();
      const postsService = newItem['postsService'];
      const newPostServiceSpy = spyOn(postsService, 'sendPost').and.callThrough();
      const alertsService = newItem['alertService'];
      const alertSpy = spyOn(alertsService, 'createAlert').and.callThrough();
      newItem['authService'].authenticated = false;

      fixture.detectChanges();

      // fill in post's text and trigger a click
      const postText = 'textfield';
      newItemDOM.querySelector('#postText').value = postText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      expect(newPostSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).not.toHaveBeenCalled();

      fixture.detectChanges();

      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      done();
    });
  });

  // NEW MESSAGE
  // ==================================================================
  describe('New Message', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false }),
          FontAwesomeModule
        ],
        declarations: [
          AppComponent,
          NewItem,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the type of new item is determined by the parameter type
    it('has a type determined by the type parameter - message', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Message'} as UrlSegment]);
      const queryParamsSpy = spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param:string) => {
        if(param == 'user') {
          return 'hello';
        }
        else if(param == 'userID') {
          return '2';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();

      fixture.detectChanges();

      expect(queryParamsSpy).toHaveBeenCalled();
      expect(newItem.itemType).toBe('Message');
      expect(newItem.user).toBe('hello');
      expect(newItem.forID).toBe(2);
      expect(newItemDOM.querySelector('#newPost')).toBeNull();
      expect(newItemDOM.querySelector('#newMessage')).toBeTruthy();
      expect(newItemDOM.querySelector('#messageFor').value).toBe('hello');
      done();
    });

    // Check that it triggers the items service when creating a new message
    it('triggers the items service when creating a new message', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Message'} as UrlSegment]);
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param:string) => {
        if(param == 'user') {
          return 'hello';
        }
        else if(param == 'userID') {
          return '2';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newMessageSpy = spyOn(newItem, 'sendMessage').and.callThrough();
      const itemsService = newItem['itemsService'];
      const newMessServiceSpy = spyOn(itemsService, 'sendMessage').and.callThrough();
      newItem['authService'].login();

      fixture.detectChanges();

      // fill in message's text and trigger a click
      const messageText = 'hello';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      const newMessage = {
        from: {
          displayName: 'name'
        },
        fromId: 4,
        forId: 2,
        messageText: messageText
      };
      expect(newMessageSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(newMessage));
      done();
    });

    // Check that an empty message triggers an alert
    it('should prevent empty messages', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Message'} as UrlSegment]);
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param:string) => {
        if(param == 'user') {
          return 'hello';
        }
        else if(param == 'userID') {
          return '2';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newMessageSpy = spyOn(newItem, 'sendMessage').and.callThrough();
      const itemsService = newItem['itemsService'];
      const newMessServiceSpy = spyOn(itemsService, 'sendMessage').and.callThrough();
      const alertsService = newItem['alertService'];
      const alertSpy = spyOn(alertsService, 'createAlert').and.callThrough();
      newItem['authService'].login();

      fixture.detectChanges();

      // fill in message's text and trigger a click
      const messageText = '';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      expect(newMessageSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).not.toHaveBeenCalled();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0].querySelectorAll('.alertText')[0].textContent).toBe('A message cannot be empty. Please fill the field and try again.');
      done();
    });

    // Check that a user can't send a message if they're logged out
    it('should prevent logged out users from messaging', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Message'} as UrlSegment]);
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param:string) => {
        if(param == 'user') {
          return 'hello';
        }
        else if(param == 'userID') {
          return '2';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newMessageSpy = spyOn(newItem, 'sendMessage').and.callThrough();
      const itemsService = newItem['itemsService'];
      const newMessServiceSpy = spyOn(itemsService, 'sendMessage').and.callThrough();
      const alertsService = newItem['alertService'];
      const alertSpy = spyOn(alertsService, 'createAlert').and.callThrough();
      newItem['authService'].authenticated = false;

      fixture.detectChanges();

      // fill in message's text and trigger a click
      const messageText = 'text';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      expect(newMessageSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).not.toHaveBeenCalled();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      done();
    });

    // Check that an error is thrown if there's no user ID and user data
    it('should throw an error if there\'s no user ID and user', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Message'} as UrlSegment]);
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((_param:string) => {
        return '';
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();

      fixture.detectChanges();

      expect(newItemDOM.querySelectorAll('.newItem')[0]).toBeUndefined();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0].textContent).toContain('User ID and display name are required for sending a message');
      done();
    });

    // Check that a user can't message themselves
    it('should prevent users messaging themselves', (done: DoneFn) => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Message'} as UrlSegment]);
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param:string) => {
        if(param == 'user') {
          return 'name';
        }
        else if(param == 'userID') {
          return '4';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newMessageSpy = spyOn(newItem, 'sendMessage').and.callThrough();
      const itemsService = newItem['itemsService'];
      const newMessServiceSpy = spyOn(itemsService, 'sendMessage').and.callThrough();
      const alertsService = newItem['alertService'];
      const alertSpy = spyOn(alertsService, 'createAlert').and.callThrough();
      newItem['authService'].login();

      fixture.detectChanges();

      // fill in message's text and trigger a click
      const messageText = 'text';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      expect(newMessageSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).not.toHaveBeenCalled();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0].querySelectorAll('.alertText')[0].textContent).toBe('You can\'t send a message to yourself!');
      done();
    });
  });
});
