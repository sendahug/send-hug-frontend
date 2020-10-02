/*
	Loader
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from '../../app.component';
import { Loader } from './loader.component';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AdminService } from '../../services/admin.service';
import { MockAdminService } from '../../services/admin.service.mock';
import { BehaviorSubject } from 'rxjs';
import { NotificationsTab } from '../notifications/notifications.component';

describe('Loader', () => {
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
        Loader,
        NotificationsTab
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AdminService, useClass: MockAdminService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(Loader);
    const loader  = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(loader).toBeTruthy();
  });

  // Check that the component checks for loading target
  it('should check what target the parent component is', () => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader  = fixture.componentInstance;
    const loadingSpy = spyOn(loader, 'checkLoadingTarget').and.callThrough();

    fixture.detectChanges();

    expect(loader).toBeTruthy();
    expect(loadingSpy).toHaveBeenCalled();
  });

  // Check that the component displays a loading message
  it('should display a loading message', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader  = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;
    loader.waitingFor = 'user';
    loader['authService'].isUserDataResolved.next(false);
    fixture.detectChanges();
    tick();

    expect(loader.message).toBeDefined();
    expect(loader.message).toBe('Fetching user data...');
    expect(loaderDOM.querySelector('#loadingMessage')).toBeTruthy();
    expect(loaderDOM.querySelector('#loadingMessage').textContent).toBe(loader.message);
  }));

  // Check that the component is displaying different loading messages
  // for different components
  it('should display different messages for different components', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader  = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // array of potential waitingFor targets and their loading messages
    const waitingForOptions = [
      'user', 'inbox messages', 'threads messages', 'thread messages', 'main page',
      'user posts', 'search', 'admin reports', 'admin blocks', 'admin filters'
    ]
    const loadingMessagesOptions = [
      'Fetching user data...', 'Fetching messages...', 'Fetching threads...',
      'Fetching messages...', 'Fetching posts...', 'Fetching user posts...',
      'Searching...', 'Getting user and post reports...', 'Getting blocked users...',
      'Getting filtered phrases...'
    ]
    const observables = [
      loader['authService'].isUserDataResolved,
      loader['itemsService'].idbResolved.inbox,
      loader['itemsService'].idbResolved.threads,
      loader['itemsService'].idbResolved.thread,
      loader['postsService'].isMainPageResolved,
      loader['itemsService'].idbResolved.userPosts,
      loader['itemsService'].isSearchResolved,
      loader['adminService'].isReportsResolved,
      loader['adminService'].isBlocksResolved,
      loader['adminService'].isFiltersResolved
    ]

    // check that the loading message changes according to the target
    waitingForOptions.forEach((target, index) => {
      loader.waitingFor = target;
      loader.ngOnChanges();
      observables[index].next(false);
      fixture.detectChanges();
      tick();
      expect(loader.message).toBe(loadingMessagesOptions[index]);
      expect(loaderDOM.querySelector('#loadingMessage').textContent).toBe(loader.message);
    });
  }));

  // Check that the component subscribes to the correct observable
  it('subscribes to the correct observable', fakeAsync(() => {
    // set up spies
    TestBed.createComponent(AppComponent);
    let previousSpies: jasmine.Spy<any>[] = [];
    let currentObservable: jasmine.Spy;
    const waitingForOptions = [
      'other user', 'inbox messages', 'outbox messages', 'threads messages',
      'thread messages', 'main page', 'new posts', 'suggested posts', 'user posts',
      'search', 'admin reports', 'admin blocks', 'admin filters'
    ]

    // set up the component and all possible spies
    const fixture = TestBed.createComponent(Loader);
    const loader  = fixture.componentInstance;
    let spies = [
      spyOn(loader['itemsService'].idbResolved.user as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['itemsService'].idbResolved.inbox as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['itemsService'].idbResolved.outbox as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['itemsService'].idbResolved.threads as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['itemsService'].idbResolved.thread as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['postsService'].isMainPageResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['postsService'].isPostsResolved.fullNewItems as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['postsService'].isPostsResolved.fullSuggestedItems as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['itemsService'].idbResolved.userPosts as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['itemsService'].isSearchResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['adminService'].isReportsResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['adminService'].isBlocksResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(loader['adminService'].isFiltersResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough()
    ];

    // reset the spies
    spies.forEach(spy => {
      spy.calls.reset();
    });

    // check each of the potential waitingFor targets and their
    // associated observables
    waitingForOptions.forEach((target) => {
      // get current target's observable
      currentObservable = spies.shift()!;
      previousSpies.push(currentObservable);

      // set up the loader
      loader.waitingFor = target;
      loader.ngOnChanges();
      fixture.detectChanges();
      tick();

      // check that each of the previous spies was called once, in its
      // relevant if
      previousSpies.forEach(item => {
        expect(item).toHaveBeenCalled();
        expect(item!.calls.count()).toBe(1);
      })

      // check that the other spies haven't beeen called at all
      spies.forEach(element => {
        expect(element).not.toHaveBeenCalled();
      });
    });

    // check the user target separately; this is essential because the
    // AuthService's isUserDataResolved subject is required for several of the other
    // data getters and thus needs to be reset and run separately
    const authSpy = spyOn(loader['authService'].isUserDataResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough();
    loader.waitingFor = 'user';
    // ensure data isn't marked as already fetched
    // so that the loader can subscribe to the BehaviorSubject
    loader['authService'].isUserDataResolved.next(false);
    authSpy.calls.reset();
    loader.ngOnChanges();
    fixture.detectChanges();
    tick();
    // check the auth spy was called for this target
    expect(authSpy).toHaveBeenCalled();
    // check that each of the previous spies was called once, in its
    // relevant if
    previousSpies.forEach(item => {
      expect(item).toHaveBeenCalled();
      expect(item!.calls.count()).toBe(1);
    })
  }));

  // Check that the loader says on until the BehaviorSubject is false
  it('stays on until the BehaviorSubject emits false', fakeAsync(() => {
    // set up the component
    const fixture = TestBed.createComponent(Loader);
    const loader  = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // set up spies
    TestBed.createComponent(AppComponent);
    let subjects = [
      loader['authService'].isUserDataResolved,
      loader['itemsService'].idbResolved.user,
      loader['itemsService'].idbResolved.inbox,
      loader['itemsService'].idbResolved.outbox,
      loader['itemsService'].idbResolved.threads,
      loader['itemsService'].idbResolved.thread,
      loader['postsService'].isMainPageResolved,
      loader['postsService'].isPostsResolved.fullNewItems,
      loader['itemsService'].idbResolved.userPosts,
      loader['itemsService'].isSearchResolved,
      loader['adminService'].isReportsResolved,
      loader['adminService'].isBlocksResolved,
      loader['adminService'].isFiltersResolved
    ];
    const waitingForOptions = [
      'user', 'other user', 'inbox messages', 'outbox messages', 'threads messages',
      'thread messages', 'main page', 'new posts', 'user posts',
      'search', 'admin reports', 'admin blocks', 'admin filters'
    ]

    // check each loading target
    waitingForOptions.forEach((target, index) => {
      // set up the target's spy to return false
      subjects[index].next(false);
      loader.waitingFor = target;
      loader.ngOnChanges();
      fixture.detectChanges();
      tick();
      // check that the visibility is true
      expect(loader.visible).toBeTrue();
      expect(loaderDOM.querySelector('#loading')).toBeTruthy();
      // change the BehaviorSubject's value to true
      subjects[index].next(true);
      fixture.detectChanges();
      tick();
      // check that the visibility is false
      expect(loader.visible).toBeFalse();
      expect(loaderDOM.querySelector('#loading')).toBeNull();
    })
  }));
});
