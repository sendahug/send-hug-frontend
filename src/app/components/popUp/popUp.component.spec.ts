/*
	Popup
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
import { PopUp } from './popUp.component';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AdminService } from '../../services/admin.service';
import { MockAdminService } from '../../services/admin.service.mock';
import { AlertsService } from '../../services/alerts.service';
import { MockAlertsService } from '../../services/alerts.service.mock';
import { Report } from '../../interfaces/report.interface';
import { NotificationsTab } from '../notifications/notifications.component';

describe('Popup', () => {
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
        PopUp,
        NotificationsTab
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AdminService, useClass: MockAdminService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(popUp).toBeTruthy();
  });

  // check tab and tab+shift let the user navigate
  it('should navigate using tab and shift+tab', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(popUp, 'checkFocusBinded').and.callThrough();
    popUp.toEdit = 'admin post';
    popUp.delete = false;
    popUp.report = false;
    popUp.editedItem = 'hi';
    popUp.reportData = {
      reportID: 1,
      postID: 2
    };
    fixture.detectChanges();
    tick();

    // spies
    const spies = [
      spyOn(popUpDOM.querySelector('#exitButton'), 'focus').and.callThrough(),
      spyOn(popUpDOM.querySelector('#adPostText'), 'focus').and.callThrough(),
      spyOn(popUpDOM.querySelectorAll('.sendData')[0], 'focus').and.callThrough(),
      spyOn(popUpDOM.querySelectorAll('.sendData')[1], 'focus').and.callThrough()
    ];

    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // run the tests, with each stage wrapped in a promise to ensure they
    // happen by the correct order
    // step 1: check the first element is focused
    new Promise(() => {
      popUp.ngOnInit();

      // check the first element has focus
      spies.forEach((spy, index:number) => {
        if(index == 0) {
          expect(spy).toHaveBeenCalled();
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // step 2: tab event tests
    }).then(() => {
      // trigger tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': false
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the next element
      expect(focusBindedSpy).toHaveBeenCalled();
      spies.forEach((spy, index:number) => {
        if(index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else if(index == 1) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // step 3: shift + tab event tests
    }).then(() => {
      // trigger shift + tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': true
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the previous element
      expect(focusBindedSpy).toHaveBeenCalled();
      expect(focusBindedSpy).toHaveBeenCalledTimes(2);
      spies.forEach((spy, index:number) => {
        if(index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(2);
        }
        else if(index == 1) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    })
  }));

  // check the focus is trapped
  it('should trap focus in the modal', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(popUp, 'checkFocusBinded').and.callThrough();
    popUp.toEdit = 'admin post';
    popUp.delete = false;
    popUp.report = false;
    popUp.editedItem = 'hi';
    popUp.reportData = {
      reportID: 1,
      postID: 2
    };
    fixture.detectChanges();
    tick();

    // spies
    const spies = [
      spyOn(popUpDOM.querySelector('#exitButton'), 'focus').and.callThrough(),
      spyOn(popUpDOM.querySelector('#adPostText'), 'focus').and.callThrough(),
      spyOn(popUpDOM.querySelectorAll('.sendData')[0], 'focus').and.callThrough(),
      spyOn(popUpDOM.querySelectorAll('.sendData')[1], 'focus').and.callThrough()
    ];

    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // run the tests, with each stage wrapped in a promise to ensure they
    // happen by the correct order
    // step 1: check the last element is focused
    new Promise(() => {
      // focus on the last element
      popUpDOM.querySelectorAll('.sendData')[1].focus();

      // check the last element has focus
      spies.forEach((spy, index:number) => {
        if(index == 3) {
          expect(spy).toHaveBeenCalled();
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // step 2: check what happens when clicking tab
    }).then(() => {
      // trigger tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': false
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the first element
      expect(focusBindedSpy).toHaveBeenCalled();
      spies.forEach((spy, index:number) => {
        if(index == 3 || index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    // check what happens when clicking shift + tab
    }).then(() => {
      // trigger shift + tab event
      document.getElementById('modalBox')!.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'tab',
        'shiftKey': true
      }));
      fixture.detectChanges();
      tick();

      // check the focus shifted to the last element
      expect(focusBindedSpy).toHaveBeenCalled();
      expect(focusBindedSpy).toHaveBeenCalledTimes(2);
      spies.forEach((spy, index:number) => {
        if(index == 3) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(2);
        }
        else if(index == 0) {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        }
        else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
    })
  }));

  // Check that the event emitter emits false if the user clicks 'exit'
  it('exits the popup if the user decides not to edit', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = 'post';
    popUp.delete = false;
    popUp.report = false;
    popUp.editedItem = {
      id: 1,
      userId: 4,
      user: 'me',
      text: 'hi',
      date: new Date(),
      givenHugs: 0,
      sentHugs: []
    };
    const exitSpy = spyOn(popUp, 'exitEdit').and.callThrough();
    fixture.detectChanges();

    // click the exit button
    popUpDOM.querySelector('#exitButton').click();
    fixture.detectChanges();
    tick();

    popUp.editMode.subscribe((event:boolean) => {
      expect(event).toBeFalse();
    });
    expect(exitSpy).toHaveBeenCalled();
  }));

  // POST EDIT
  // ==================================================================
  describe('Post Edit', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the popup shows the post's text and author
    it('shows the post\'s text and writer', () => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelectorAll('form')[0].id).toBe('postEdit');
      expect(popUpDOM.querySelector('#postEdit').querySelectorAll('.pageData')[0].textContent).toBe('me');
      expect(popUpDOM.querySelector('#postText').value).toBe('hi');
    });

    // Check that upon confirming a requset is made to the PostsService
    it('makes a request to change the post text upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };
      const updateSpy = spyOn(popUp, 'updatePost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['postsService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#postText').value = 'hello there';
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check the request is made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
    }));

    // Check that saving the edited post is prevented if the post is empty
    it('prevents empty posts', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };
      const updateSpy = spyOn(popUp, 'updatePost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['postsService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#postText').value = '';
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#postText').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // POST EDIT - ADMIN PAGE
  // ==================================================================
  describe('Post Edit - Admin Page', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the post's text is shown
    it('shows the post text', () => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelectorAll('form')[0].id).toBe('adPostEdit');
      expect(popUpDOM.querySelector('#adPostText').value).toBe('hi');
    });

    // Check that a request is made to the AdminService upon clicking 'update'
    it('makes a request to change the post text upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const updateSpy = spyOn(popUp, 'editPost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editPost').and.callThrough();

      fixture.detectChanges();

      // change the post's text
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check the request is made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
    }));

    //
    it('makes a request to close the report if that\'s what the user chose', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const updateSpy = spyOn(popUp, 'editPost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#adPostText').value = 'hi there';
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is true
      let post:any = {
        text: 'hi there',
        id: 2,
        closeReport: 1
      };
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(post, true, 1);

      // change the post's text
      popUpDOM.querySelector('#adPostText').value = 'hi there';
      popUpDOM.querySelectorAll('.sendData')[1].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is false
      post = {
        text: 'hi there',
        id: 2
      };
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(post, false, 1);
    }));

    // Check that saving the edited post is prevented if the post is empty
    it('prevents empty posts', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const updateSpy = spyOn(popUp, 'editPost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#adPostText').value = '';
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#adPostText').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // DISPLAY NAME EDIT
  // ==================================================================
  describe('Display Name Edit', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the user's current display name is shown in the textfield
    it('shows the user\'s current display name', () => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#userEdit')).toBeTruthy();
      expect(popUpDOM.querySelector('#displayName')).toBeTruthy();
      expect(popUpDOM.querySelector('#displayName').value).toBe('name');
    });

    // Check that once the user click's the 'update' button, a request is made to change
    // the user's display name
    it('makes a request to change the display name upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      const updateSpy = spyOn(popUp, 'updateDisplayN').and.callThrough();
      const updateServiceSpy = spyOn(popUp.authService, 'updateUserData').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the user's name
      popUpDOM.querySelector('#displayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check the call is made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(popUp.authService.userData.displayName).toBe('new name');
    }));

    // Check that empty display names are prevented
    it('prevents empty display names', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      const updateSpy = spyOn(popUp, 'updateDisplayN').and.callThrough();
      const updateServiceSpy = spyOn(popUp.authService, 'updateUserData').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the user's name
      popUpDOM.querySelector('#displayName').value = '';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#displayName').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // DISPLAY NAME EDIT - ADMIN PAGE
  // ==================================================================
  describe('Display Name Edit - Admin Page', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the user's current display name is shown in the textfield
    it('shows the user\'s current display name', () => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'name';
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#otherUserEdit')).toBeTruthy();
      expect(popUpDOM.querySelector('#uDisplayName')).toBeTruthy();
      expect(popUpDOM.querySelector('#uDisplayName').value).toBe('name');
    });

    // Check that a request is made to the admin service to update the user's
    // display name upon clicking 'update'
    it('makes a request to change the display name upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'name';
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };
      const updateSpy = spyOn(popUp, 'editUser').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editUser').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check the call was made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
    }));

    // Check that the closeReport boolean is adjusted depending on what the
    // user chose
    it('makes a request to close the report if that\'s what the user chose', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'name';
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };
      const updateSpy = spyOn(popUp, 'editUser').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editUser').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is true
      let user:any = {
        userID: 4,
        displayName: 'new name',
        closeReport: 3
      };
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(user, true, 3);

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[1].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is false
      user = {
        userID: 4,
        displayName: 'new name'
      };
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(user, false, 3);
    }));

    // Check that empty display names are prevented
    it('prevents empty display names', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'name';
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };
      const updateSpy = spyOn(popUp, 'editUser').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editUser').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = '';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check the empty display name isn't passed on and the user is alerted
      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#uDisplayName').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // DELETE
  // ==================================================================
  describe('Item Delete', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that a warning is shown before deleting an item
    it('shows a warning when deleting something', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toDelete = 'Post';
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 2;

      fixture.detectChanges();
      tick();

      expect(popUpDOM.querySelector('#deleteItem')).toBeTruthy();
      expect(popUpDOM.querySelector('#deleteItem').querySelectorAll('.warning')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#deleteItem').querySelectorAll('.warning')[0].textContent).toContain('This action is irreversible!');
    }));

    // Check that the correct method is called depending on the item that's being deleted
    it('calls the correct method upon confirmation', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 1;
      const deleteItems = [
        'Post', 'Message', 'Thread', 'All posts', 'All inbox'
      ];
      let methodSpies = [
        spyOn(popUp['postsService'], 'deletePost').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteMessage').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteThread').and.callThrough(),
        spyOn(popUp['postsService'], 'deleteAllPosts').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteAll').and.callThrough()
      ];
      let currentSpy: jasmine.Spy;
      let calledSpies: jasmine.Spy[] = [];

      fixture.detectChanges();

      deleteItems.forEach((item) => {
        // set up the popup
        popUp.toDelete = item;
        if(popUp.toDelete == 'Message') {
          popUp.messType = 'inbox';
        }
        else if(popUp.toDelete == 'Thread') {
          popUp.messType = 'thread';
        }

        currentSpy = methodSpies.shift()!;
        calledSpies.push(currentSpy);

        popUpDOM.querySelectorAll('.popupDeleteBtn')[0].click();
        fixture.detectChanges();
        tick();

        // check the other spies weren't called
        methodSpies.forEach((spy) => {
          expect(spy).not.toHaveBeenCalled();
        });

        // check the current and previous spies were each called once
        calledSpies.forEach((spy) => {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    }));

    // Check that a request to close the report is made if the item is deleted from
    // the admin dashboard
    it('makes a request to close the report if that\'s what the user chose - Admin delete', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toDelete = 'ad post';
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 2;
      popUp.reportData = {
        reportID: 2,
        postID: 4
      };
      const deleteSpy = spyOn(popUp, 'deletePost').and.callThrough();
      const deleteServiceSpy = spyOn(popUp['adminService'], 'deletePost').and.callThrough();
      popUp['adminService'].getOpenReports();

      fixture.detectChanges();
      tick();

      // click 'delete and close report'
      popUpDOM.querySelectorAll('.popupDeleteBtn')[0].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is true
      const report = {
        reportID: 2,
        postID: 4
      };
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith(true);
      expect(deleteServiceSpy).toHaveBeenCalled();
      expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, true);

      // click 'delete and close report'
      popUpDOM.querySelectorAll('.popupDeleteBtn')[1].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is false
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith(false);
      expect(deleteServiceSpy).toHaveBeenCalled();
      expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, false);
    }));

    // Check that the popup is exited and the item isn't deleted if the user picks 'never mind'
    it('should emit false and keep the item if the user chooses not to delete', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toDelete = 'Post';
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 2;
      const exitSpy = spyOn(popUp, 'exitEdit').and.callThrough();
      const deleteSpy = spyOn(popUp, 'deleteItem').and.callThrough();

      fixture.detectChanges();
      tick();

      // click the 'never mind button'
      popUpDOM.querySelectorAll('.popupDeleteBtn')[1].click();
      fixture.detectChanges();
      tick();

      // check the exit method was called
      popUp.editMode.subscribe((event:boolean) => {
        expect(event).toBeFalse();
      });
      expect(exitSpy).toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    }));
  });

  // REPORT POST
  // ==================================================================
  describe('Report - Post', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the reported post is shown
    it('shows the reported post', () => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'Post';
      popUp.reportedItem = {
        id: 1,
        givenHugs: 0,
        sentHugs: [],
        user: 'name',
        userId: 2,
        text: 'hi',
        date: new Date()
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#reportItem')).toBeTruthy();
      expect(popUpDOM.querySelectorAll('.userPost')).toBeTruthy();
      expect(popUpDOM.querySelector('#reportText').textContent).toBe('hi');
    });

    // Check that the correct radio button is set as selected
    it('correctly identifies the chosen radio button', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'Post';
      popUp.reportedItem = {
        id: 1,
        givenHugs: 0,
        sentHugs: [],
        user: 'name',
        userId: 2,
        text: 'hi',
        date: new Date()
      };
      const selectSpy = spyOn(popUp, 'setSelected').and.callThrough();

      fixture.detectChanges();
      tick();

      // select option 1
      popUpDOM.querySelector('#pRadioOption0').click();
      fixture.detectChanges();
      tick();

      // check the first option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('0');

      // select option 2
      popUpDOM.querySelector('#pRadioOption1').click();
      fixture.detectChanges();
      tick();

      // check the second option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('1');

      // select option 3
      popUpDOM.querySelector('#pRadioOption2').click();
      fixture.detectChanges();
      tick();

      // check the third option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('2');

      // select option 4
      popUpDOM.querySelector('#pRadioOption3').click();
      fixture.detectChanges();
      tick();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');
    }));

    // Check that if the user chooses 'other' as reason they can't submit an
    // empty reason
    it('requires text if the chosen reason is other', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'Post';
      popUp.reportedItem = {
        id: 1,
        givenHugs: 0,
        sentHugs: [],
        user: 'name',
        userId: 2,
        text: 'hi',
        date: new Date()
      };
      const selectSpy = spyOn(popUp, 'setSelected').and.callThrough();
      const reportSpy = spyOn(popUp, 'reportPost').and.callThrough();
      const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport').and.callThrough();
      fixture.detectChanges();
      tick();

      // select option 4
      popUpDOM.querySelector('#pRadioOption3').click();
      fixture.detectChanges();
      tick();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');

      // try to submit it without text in the textfield
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();
      tick();

      // check the report wasn't sent and the user was alerted
      expect(reportSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#rOption3Text').classList).toContain('missing');
      expect(reportServiceSpy).not.toHaveBeenCalled();
    }));

    // Check that the popup triggers creating a report via the Items Service
    it('creates and sends a report to the itemsService', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'Post';
      popUp.reportedItem = {
        id: 1,
        givenHugs: 0,
        sentHugs: [],
        user: 'name',
        userId: 2,
        text: 'hi',
        date: new Date()
      };
      const reportSpy = spyOn(popUp, 'reportPost').and.callThrough();
      const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport').and.callThrough();
      fixture.detectChanges();
      tick();

      // select report reason and hit report
      popUpDOM.querySelector('#pRadioOption0').click();
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();
      tick();

      const report:Report = {
        type: 'Post',
        userID: 2,
        postID: 1,
        reporter: 4,
        reportReason: 'The post is Inappropriate',
        date: new Date(),
        dismissed: false,
        closed: false
      }
      expect(reportSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalledWith(report);
    }));
  });

  // REPORT USER
  // ==================================================================
  describe('report - user', () => {
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
          PopUp,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the reported user's display name is shown
    it('shows the reported user\'s name', () => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'User';
      popUp.reportedItem = {
        id: 3,
        displayName: 'string',
        receivedHugs: 3,
        givenHugs: 4,
        postsNum: 2,
        role: 'user'
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#reportUser')).toBeTruthy();
      expect(popUpDOM.querySelectorAll('.uReportText')).toBeTruthy();
      expect(popUpDOM.querySelector('#uReportText').textContent).toBe('string');
    });

    // Check that the correct radio button is set as selected
    it('correctly identifies the chosen radio button', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'User';
      popUp.reportedItem = {
        id: 3,
        displayName: 'string',
        receivedHugs: 3,
        givenHugs: 4,
        postsNum: 2,
        role: 'user'
      };
      const selectSpy = spyOn(popUp, 'setSelected').and.callThrough();

      fixture.detectChanges();
      tick();

      // select option 1
      popUpDOM.querySelector('#uRadioOption0').click();
      fixture.detectChanges();
      tick();

      // check the first option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('0');

      // select option 2
      popUpDOM.querySelector('#uRadioOption1').click();
      fixture.detectChanges();
      tick();

      // check the second option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('1');

      // select option 3
      popUpDOM.querySelector('#uRadioOption2').click();
      fixture.detectChanges();
      tick();

      // check the third option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('2');

      // select option 4
      popUpDOM.querySelector('#uRadioOption3').click();
      fixture.detectChanges();
      tick();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');
    }));

    // Check that if the user chooses 'other' as reason they can't submit an
    // empty reason
    it('requires text if the chosen reason is other', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'User';
      popUp.reportedItem = {
        id: 3,
        displayName: 'string',
        receivedHugs: 3,
        givenHugs: 4,
        postsNum: 2,
        role: 'user'
      };
      const selectSpy = spyOn(popUp, 'setSelected').and.callThrough();
      const reportSpy = spyOn(popUp, 'reportUser').and.callThrough();
      const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport').and.callThrough();
      fixture.detectChanges();
      tick();

      // select option 4
      popUpDOM.querySelector('#uRadioOption3').click();
      fixture.detectChanges();
      tick();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');

      // try to submit it without text in the textfield
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();
      tick();

      // check the report wasn't sent and the user was alerted
      expect(reportSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#uOption3Text').classList).toContain('missing');
      expect(reportServiceSpy).not.toHaveBeenCalled();
    }));

    // Check that the popup triggers creating a report via the Items Service
    it('creates and sends a report to the itemsService', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.inject(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.report = true;
      popUp.delete = false;
      popUp.reportType = 'User';
      popUp.reportedItem = {
        id: 3,
        displayName: 'string',
        receivedHugs: 3,
        givenHugs: 4,
        postsNum: 2,
        role: 'user'
      };
      const reportSpy = spyOn(popUp, 'reportUser').and.callThrough();
      const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport').and.callThrough();
      fixture.detectChanges();
      tick();

      expect(popUpDOM.querySelector('#uRadioOption0')).toBeTruthy();
      expect(popUpDOM.querySelectorAll('.reportButton')[0]).toBeTruthy();

      // select report reason and hit report
      popUpDOM.querySelector('#uRadioOption0').click();
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();
      tick();

      const report:Report = {
        type: 'User',
        userID: 3,
        reporter: 4,
        reportReason: 'The user is posting Spam',
        date: new Date(),
        dismissed: false,
        closed: false
      }
      expect(reportSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalledWith(report);
    }));
  });
});
