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

import { HeaderMessage } from './headerMessage.component';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { BehaviorSubject } from 'rxjs';

describe('HeaderMessage', () => {
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
        HeaderMessage
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ItemsService, useClass: MockItemsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage  = fixture.componentInstance;
    expect(headerMessage).toBeTruthy();
  });

  // Check that the component checks for loading target
  it('should check what target the parent component is', () => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage  = fixture.componentInstance;
    const loadingSpy = spyOn(headerMessage, 'checkLoadingTarget').and.callThrough();
    headerMessage.waitingFor = 'other user';

    fixture.detectChanges();
    headerMessage.ngOnInit();

    expect(headerMessage).toBeTruthy();
    expect(loadingSpy).toHaveBeenCalled();
  });

  // Check that the component displays a loading message
  it('should display a loading message', (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage  = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;
    headerMessage.waitingFor = 'other user';
    headerMessage['itemsService'].isOtherUserResolved.next(false);

    fixture.detectChanges();

    expect(headerMessage.message).toBeDefined();
    expect(headerMessage.message).toBe('Fetching user data from the server...');
    expect(headerMessDOM.querySelector('#loadingMessage')).toBeTruthy();
    expect(headerMessDOM.querySelector('#loadingMessage').textContent).toBe(headerMessage.message);
    done();
  });

  // Check that the component is displaying different loading messages
  // for different components
  it('should display different messages for different components', (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage  = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;
    headerMessage.user = 'other';

    // array of potential waitingFor targets and their loading messages
    const waitingForOptions = [
      'other user', 'inbox messages', 'threads messages', 'thread messages',
      'user posts'
    ]
    const loadingMessagesOptions = [
      'Fetching user data from the server...', 'Fetching messages from the server...',
      'Fetching threads from the server...', 'Fetching messages from the server...',
      'Fetching user posts from the server...'
    ]
    const observables = [
      headerMessage['itemsService'].isOtherUserResolved,
      headerMessage['itemsService'].isUserMessagesResolved.inbox,
      headerMessage['itemsService'].isUserMessagesResolved.threads,
      headerMessage['itemsService'].isUserMessagesResolved.thread,
      headerMessage['itemsService'].isUserPostsResolved.other
    ]

    // check that the loading message changes according to the target
    waitingForOptions.forEach((target, index) => {
      headerMessage.waitingFor = target;
      headerMessage.ngOnChanges();
      observables[index].next(false);
      fixture.detectChanges();
      expect(headerMessage.message).toBe(loadingMessagesOptions[index]);
      expect(headerMessDOM.querySelector('#loadingMessage').textContent).toBe(headerMessage.message);
    });
    done();
  });

  // Check that the loader says on until the BehaviorSubject is false
  it('stays on until the BehaviorSubject emits false', (done: DoneFn) => {
    // set up the component
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage  = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;
    headerMessage.user = 'other';

    // set up spies
    let subjects = [
      headerMessage['itemsService'].isOtherUserResolved,
      headerMessage['itemsService'].isUserMessagesResolved.inbox,
      headerMessage['itemsService'].isUserMessagesResolved.threads,
      headerMessage['itemsService'].isUserMessagesResolved.thread,
      headerMessage['itemsService'].isUserPostsResolved.other
    ];
    const waitingForOptions = [
      'other user', 'inbox messages', 'threads messages', 'thread messages',
      'user posts'
    ]

    // check each loading target
    waitingForOptions.forEach((target, index) => {
      // set up the target's spy to return false
      subjects[index].next(false);
      headerMessage.waitingFor = target;
      headerMessage.ngOnChanges();
      fixture.detectChanges();
      // check that the visibility is true
      expect(headerMessage.visible).toBeTrue();
      expect(headerMessDOM.querySelector('#headerMessage')).toBeTruthy();
      // change the BehaviorSubject's value to true
      subjects[index].next(true);
      fixture.detectChanges();
      // check that the visibility is false
      expect(headerMessage.visible).toBeFalse();
      expect(headerMessDOM.querySelector('#headerMessage')).toBeNull();
    })
    done();
  });

  // Check that the component subscribes to the correct observable
  it('subscribes to the correct observable', (done: DoneFn) => {
    // set up required variables
    let previousSpies: jasmine.Spy<any>[] = [];
    let currentObservable: jasmine.Spy;
    const waitingForOptions = [
      'other user', 'inbox messages', 'outbox messages', 'threads messages',
      'thread messages', 'user posts'
    ];

    // set up the component and all possible spies
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage  = fixture.componentInstance;
    let spies = [
      spyOn(headerMessage['itemsService'].isOtherUserResolved as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(headerMessage['itemsService'].isUserMessagesResolved.inbox as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(headerMessage['itemsService'].isUserMessagesResolved.outbox as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(headerMessage['itemsService'].isUserMessagesResolved.threads as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(headerMessage['itemsService'].isUserMessagesResolved.thread as BehaviorSubject<boolean>, 'subscribe').and.callThrough(),
      spyOn(headerMessage['itemsService'].isUserPostsResolved.other as BehaviorSubject<boolean>, 'subscribe').and.callThrough()
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
      headerMessage.waitingFor = target;
      headerMessage.user = 'other';
      headerMessage.ngOnChanges();
      fixture.detectChanges();

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
    done();
  });
});
