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
import { ActivatedRoute } from "@angular/router";

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
        ServiceWorkerModule.register('sw.js')
      ],
      declarations: [
        AppComponent,
        NewItem
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
          ServiceWorkerModule.register('sw.js')
        ],
        declarations: [
          AppComponent,
          NewItem
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
    it('has a type determined by the type parameter - post', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute);
      const routeSpy = spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Post');
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();

      fixture.detectChanges();
      tick();

      expect(routeSpy).toHaveBeenCalled();
      expect(newItem.itemType).toBe('Post');
      expect(newItemDOM.querySelector('#newPost')).toBeTruthy();
      expect(newItemDOM.querySelector('#newMessage')).toBeNull();
      expect(newItemDOM.querySelectorAll('.formElement')[0].querySelectorAll('.pageData')[0].textContent).toBe('name');
    }));

    // Check that it triggers the posts service when creating a new post
    it('triggers the posts service when creating a new post', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute);
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Post');
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      const newPostSpy = spyOn(newItem, 'sendPost').and.callThrough();
      const postsService = newItem['postsService'];
      const newPostServiceSpy = spyOn(postsService, 'sendPost').and.callThrough();
      newItem['authService'].login();

      fixture.detectChanges();
      tick();

      // fill in post's text and trigger a click
      const postText = 'new post';
      newItemDOM.querySelector('#postText').value = postText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      const newPost = {
        userId: 4,
        user: 'name',
        text: postText,
        date: new Date(),
        givenHugs: 0
      };
      expect(newPostSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).toHaveBeenCalledWith(newPost);
    }));

    // Check that an empty post triggers an alert
    it('should prevent empty posts', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute);
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Post');
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
      tick();

      // fill in post's text and trigger a click
      const postText = '';
      newItemDOM.querySelector('#postText').value = postText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(newPostSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).not.toHaveBeenCalled();

      fixture.detectChanges();
      tick();

      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0].querySelectorAll('.alertText')[0].textContent).toBe('A post cannot be empty. Please fill the field and try again.');
    }));

    // Check that a user can't post if they're blocked
    it('should prevent blocked users from posting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute);
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Post');
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();
      newItem['authService'].userData.blocked = true;
      newItem['authService'].userData.releaseDate = new Date((new Date()).getTime() + 864E5 * 7);

      fixture.detectChanges();
      tick();

      const alert = `You are currently blocked until ${newItem['authService'].userData.releaseDate}. You cannot post new posts.`;
      expect(newItemDOM.querySelectorAll('.newItem')[0]).toBeUndefined();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0].textContent).toContain(alert);
    }));

    // Check that a user can't post if they're logged out
    it('should prevent logged out users from posting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute);
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Post');
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
      tick();

      // fill in post's text and trigger a click
      const postText = 'textfield';
      newItemDOM.querySelector('#postText').value = postText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(newPostSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newPostServiceSpy).not.toHaveBeenCalled();

      fixture.detectChanges();
      tick();

      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
    }));
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
          ServiceWorkerModule.register('sw.js')
        ],
        declarations: [
          AppComponent,
          NewItem
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
    it('has a type determined by the type parameter - message', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute) as ActivatedRoute;
      const routeSpy = spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Message');
      const queryParamsSpy = spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param) => {
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
      tick();

      expect(routeSpy).toHaveBeenCalled();
      expect(queryParamsSpy).toHaveBeenCalled();
      expect(newItem.itemType).toBe('Message');
      expect(newItem.user).toBe('hello');
      expect(newItem.forID).toBe(2);
      expect(newItemDOM.querySelector('#newPost')).toBeNull();
      expect(newItemDOM.querySelector('#newMessage')).toBeTruthy();
      expect(newItemDOM.querySelector('#messageFor').value).toBe('hello');
    }));

    // Check that it triggers the items service when creating a new message
    it('triggers the items service when creating a new message', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute) as ActivatedRoute;
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Message');
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param) => {
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
      tick();

      // fill in message's text and trigger a click
      const messageText = 'hello';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      const newMessage = {
        from: 'name',
        fromId: 4,
        forId: 2,
        messageText: messageText,
        date: new Date()
      };
      expect(newMessageSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).toHaveBeenCalledWith(newMessage);
    }));

    // Check that an empty message triggers an alert
    it('should prevent empty messages', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute) as ActivatedRoute;
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Message');
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param) => {
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
      tick();

      // fill in message's text and trigger a click
      const messageText = '';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(newMessageSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).not.toHaveBeenCalled();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0].querySelectorAll('.alertText')[0].textContent).toBe('A message cannot be empty. Please fill the field and try again.');
    }));

    // Check that a user can't send a message if they're logged out
    it('should prevent logged out users from messaging', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute) as ActivatedRoute;
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Message');
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param) => {
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
      tick();

      // fill in message's text and trigger a click
      const messageText = 'text';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(newMessageSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).not.toHaveBeenCalled();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
    }));

    // Check that an error is thrown if there's no user ID and user data
    it('should throw an error if there\'s no user ID and user', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute) as ActivatedRoute;
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Message');
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((_param) => {
        return '';
      });
      const fixture = TestBed.createComponent(NewItem);
      const newItem = fixture.componentInstance;
      const newItemDOM = fixture.nativeElement;
      newItem['authService'].login();

      fixture.detectChanges();
      tick();

      expect(newItemDOM.querySelectorAll('.newItem')[0]).toBeUndefined();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.errorMessage')[0].textContent).toContain('User ID and display name are required for sending a message');
    }));

    // Check that a user can't message themselves
    it('should prevent users messaging themselves', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const paramMap = TestBed.get(ActivatedRoute) as ActivatedRoute;
      spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('Message');
      spyOn(paramMap.snapshot.queryParamMap, 'get').and.callFake((param) => {
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
      tick();

      // fill in message's text and trigger a click
      const messageText = 'text';
      newItemDOM.querySelector('#messageText').value = messageText;
      newItemDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(newMessageSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
      expect(newMessServiceSpy).not.toHaveBeenCalled();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(newItemDOM.querySelectorAll('.alertMessage')[0].querySelectorAll('.alertText')[0].textContent).toBe('You can\'t send a message to yourself!');
    }));
  });
});
