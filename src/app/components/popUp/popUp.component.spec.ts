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
  it('should navigate using tab and shift+tab', (done: DoneFn) => {
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
    done();
  });

  // check the focus is trapped
  it('should trap focus in the modal', (done: DoneFn) => {
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
    done();
  });

  // Check that the event emitter emits false if the user clicks 'exit'
  it('exits the popup if the user decides not to edit', (done: DoneFn) => {
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

    popUp.editMode.subscribe((event:boolean) => {
      expect(event).toBeFalse();
    });
    expect(exitSpy).toHaveBeenCalled();
    done();
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
    it('correctly identifies the chosen radio button', (done: DoneFn) => {
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

      // select option 1
      popUpDOM.querySelector('#pRadioOption0').click();
      fixture.detectChanges();

      // check the first option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('0');

      // select option 2
      popUpDOM.querySelector('#pRadioOption1').click();
      fixture.detectChanges();

      // check the second option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('1');

      // select option 3
      popUpDOM.querySelector('#pRadioOption2').click();
      fixture.detectChanges();

      // check the third option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('2');

      // select option 4
      popUpDOM.querySelector('#pRadioOption3').click();
      fixture.detectChanges();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');
      done();
    });

    // Check that if the user chooses 'other' as reason they can't submit an
    // empty reason
    it('requires text if the chosen reason is other', (done: DoneFn) => {
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

      // select option 4
      popUpDOM.querySelector('#pRadioOption3').click();
      fixture.detectChanges();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');

      // try to submit it without text in the textfield
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();

      // check the report wasn't sent and the user was alerted
      expect(reportSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#rOption3Text').classList).toContain('missing');
      expect(reportServiceSpy).not.toHaveBeenCalled();
      done();
    });

    // Check that the popup triggers creating a report via the Items Service
    it('creates and sends a report to the itemsService',(done: DoneFn) => {
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

      // select report reason and hit report
      popUpDOM.querySelector('#pRadioOption0').click();
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();

      const report:any = {
        type: 'Post',
        userID: 2,
        postID: 1,
        reporter: 4,
        reportReason: 'The post is Inappropriate',
        dismissed: false,
        closed: false
      }
      expect(reportSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(report));
      done();
    });
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
        role: 'user',
        selectedIcon: 'kitty',
        iconColours: {
          character: '#BA9F93',
          lbg: '#e2a275',
          rbg: '#f8eee4',
          item: '#f4b56a'
        }
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#reportUser')).toBeTruthy();
      expect(popUpDOM.querySelectorAll('.uReportText')).toBeTruthy();
      expect(popUpDOM.querySelector('#uReportText').textContent).toBe('string');
    });

    // Check that the correct radio button is set as selected
    it('correctly identifies the chosen radio button', (done: DoneFn) => {
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
        role: 'user',
        selectedIcon: 'kitty',
        iconColours: {
          character: '#BA9F93',
          lbg: '#e2a275',
          rbg: '#f8eee4',
          item: '#f4b56a'
        }
      };
      const selectSpy = spyOn(popUp, 'setSelected').and.callThrough();

      fixture.detectChanges();

      // select option 1
      popUpDOM.querySelector('#uRadioOption0').click();
      fixture.detectChanges();

      // check the first option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('0');

      // select option 2
      popUpDOM.querySelector('#uRadioOption1').click();
      fixture.detectChanges();

      // check the second option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('1');

      // select option 3
      popUpDOM.querySelector('#uRadioOption2').click();
      fixture.detectChanges();

      // check the third option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('2');

      // select option 4
      popUpDOM.querySelector('#uRadioOption3').click();
      fixture.detectChanges();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');
      done();
    });

    // Check that if the user chooses 'other' as reason they can't submit an
    // empty reason
    it('requires text if the chosen reason is other', (done: DoneFn) => {
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
        role: 'user',
        selectedIcon: 'kitty',
        iconColours: {
          character: '#BA9F93',
          lbg: '#e2a275',
          rbg: '#f8eee4',
          item: '#f4b56a'
        }
      };
      const selectSpy = spyOn(popUp, 'setSelected').and.callThrough();
      const reportSpy = spyOn(popUp, 'reportUser').and.callThrough();
      const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport').and.callThrough();
      fixture.detectChanges();

      // select option 4
      popUpDOM.querySelector('#uRadioOption3').click();
      fixture.detectChanges();

      // check the fourth option was selected
      expect(selectSpy).toHaveBeenCalled();
      expect(selectSpy).toHaveBeenCalledWith('3');

      // try to submit it without text in the textfield
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();

      // check the report wasn't sent and the user was alerted
      expect(reportSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#uOption3Text').classList).toContain('missing');
      expect(reportServiceSpy).not.toHaveBeenCalled();
      done();
    });

    // Check that the popup triggers creating a report via the Items Service
    it('creates and sends a report to the itemsService', (done: DoneFn) => {
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
        role: 'user',
        selectedIcon: 'kitty',
        iconColours: {
          character: '#BA9F93',
          lbg: '#e2a275',
          rbg: '#f8eee4',
          item: '#f4b56a'
        }
      };
      const reportSpy = spyOn(popUp, 'reportUser').and.callThrough();
      const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport').and.callThrough();
      fixture.detectChanges();

      expect(popUpDOM.querySelector('#uRadioOption0')).toBeTruthy();
      expect(popUpDOM.querySelectorAll('.reportButton')[0]).toBeTruthy();

      // select report reason and hit report
      popUpDOM.querySelector('#uRadioOption0').click();
      popUpDOM.querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();

      const report = {
        type: 'User',
        userID: 3,
        reporter: 4,
        reportReason: 'The user is posting Spam',
        dismissed: false,
        closed: false
      }
      expect(reportSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalled();
      expect(reportServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(report));
      done();
    });
  });
});
