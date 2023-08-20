/*
  Admin Dashboard
  Send a Hug Component Tests
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
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { AdminDashboard } from './adminDashboard.component';
import { PopUp } from '../popUp/popUp.component';
import { AdminService } from '../../services/admin.service';
import { MockAdminService } from '../../services/admin.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { AlertsService } from '../../services/alerts.service';
import { MockAlertsService } from '../../services/alerts.service.mock';
import { Loader } from '../loader/loader.component';

describe('AdminDashboard', () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js', { enabled: false }),
        FontAwesomeModule
      ],
      declarations: [
        AdminDashboard,
        PopUp,
        Loader,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AdminService, useClass: MockAdminService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    expect(adminDashboard).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    expect(adminDashboard.editMode).toBeFalse();
    expect(adminDashboard.delete).toBeFalse();
    expect(adminDashboard.report).toBeFalse();
  });

  // Check the popup exits when 'false' is emitted
  it('should change mode when the event emitter emits false', (done: DoneFn) => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const changeSpy = spyOn(adminDashboard, 'changeMode').and.callThrough();
    adminDashboard['authService'].login();

    fixture.detectChanges();

    // start the popup
    adminDashboard.lastFocusedElement = document.querySelectorAll('a')[0];
    adminDashboard.editType = 'other user';
    adminDashboard.toEdit = 'displayName';
    adminDashboard.editMode = true;
    adminDashboard.reportData.reportID = 5;
    adminDashboard.reportData.userID = 2;
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css('app-pop-up')).componentInstance as PopUp;
    popup.exitEdit();
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(adminDashboard.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll('a')[0]);
    done();
  });

  // REPORTS PAGE
  // ==================================================================
  describe('Reports Page', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false }),
          FontAwesomeModule
        ],
        declarations: [
          AdminDashboard,
          PopUp,
          Loader
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      // make sure the test goes through with admin permission
      const authService = TestBed.inject(AuthService) as AuthService;
      spyOn(authService, 'canUser').and.returnValue(true);
      authService.isUserDataResolved.next(true);
    });

    // Check that a call is made to get open reports
    it('should get open reports', (done: DoneFn) => {
      // set up the spy and the component
      const adminService = TestBed.inject(AdminService);
      const reportSpy = spyOn(adminService, 'getOpenReports').and.callThrough();
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminDashboard.screen = 'reports';

      fixture.detectChanges();

      expect(reportSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.userReports.length).toBe(1);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').length).toBe(1);
      expect(adminDashboard.adminService.postReports.length).toBe(1);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[1].querySelectorAll('tbody tr').length).toBe(1);
      done();
    });

    // Check that you can block users
    it('should block a user', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const blockSpy = spyOn(adminDashboard, 'blockUser').and.callThrough();
      const checkBlockSpy = spyOn(adminDashboard, 'checkBlock').and.callThrough();
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();

      // trigger a click
      const userTable = adminDashboardDOM.querySelectorAll('.tableContainer')[0];
      userTable.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();

      // check expectations
      expect(blockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalledWith(10, 'oneDay', 1);
      expect(setBlockSpy).toHaveBeenCalled();
      expect(setBlockSpy).toHaveBeenCalledWith(10, 'oneDay', 1);
      expect(blockServiceSpy).toHaveBeenCalled();
      expect(blockServiceSpy).toHaveBeenCalledWith(10, jasmine.any(Date), 1);
      done();
    });

    // Check that user editing triggers the popup
    it('should edit a user\'s display name', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const editSpy = spyOn(adminDashboard, 'editUser').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();

      // before the click
      expect(adminDashboard.editMode).toBeFalse();

      // trigger click
      const userTable = adminDashboardDOM.querySelectorAll('.tableContainer')[0];
      userTable.querySelectorAll('.adminButton')[1].click();
      fixture.detectChanges();

      // check expectations
      expect(editSpy).toHaveBeenCalled();
      expect(adminDashboard.editMode).toBeTrue();
      expect(adminDashboard.editType).toBe('other user');
      expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
      done();
    });

    // Check that post editing triggers the popup
    it('should edit a post\'s text', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const editSpy = spyOn(adminDashboard, 'editPost').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();

      // before the click
      expect(adminDashboard.editMode).toBeFalse();

      // trigger click
      const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
      postTable.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();

      // check expectations
      expect(editSpy).toHaveBeenCalled();
      expect(adminDashboard.editMode).toBeTrue();
      expect(adminDashboard.editType).toBe('admin post');
      expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
      done();
    });

    // Check that deleting a post triggers the popup
    it('should delete a post', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const deleteSpy = spyOn(adminDashboard, 'deletePost').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();

      // before the click
      expect(adminDashboard.editMode).toBeFalse();

      // trigger click
      const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
      postTable.querySelectorAll('.adminButton')[1].click();
      fixture.detectChanges();

      // check expectations
      expect(deleteSpy).toHaveBeenCalled();
      expect(adminDashboard.editMode).toBeTrue();
      expect(adminDashboard.toDelete).toBe('ad post');
      expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
      done();
    });

    // Check that you can dismiss reports
    it('should dismiss report', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const dismissSpy = spyOn(adminDashboard, 'dismissReport').and.callThrough();
      const adminService = adminDashboard.adminService;
      const dismissServiceSpy = spyOn(adminService, 'dismissReport').and.callThrough();

      adminDashboard.screen = 'reports';

      fixture.detectChanges();

      // trigger click
      const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
      postTable.querySelectorAll('.adminButton')[2].click();
      fixture.detectChanges();

      // check expectations
      expect(dismissSpy).toHaveBeenCalled();
      expect(dismissServiceSpy).toHaveBeenCalled();
      expect(dismissServiceSpy).toHaveBeenCalledWith(2);
      done();
    });
  });

  // BLOCKS PAGE
  // ==================================================================
  describe('Blocks Page', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false }),
          FontAwesomeModule
        ],
        declarations: [
          AdminDashboard,
          PopUp,
          Loader
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      // make sure the test goes through with admin permission
      const authService = TestBed.inject(AuthService);
      spyOn(authService, 'canUser').and.returnValue(true);
      authService.isUserDataResolved.next(true);
    });

    // Check that a call is made to get blocked users
    it('should get blocked users', (done: DoneFn) => {
      // set up the spy and the component
      const adminService = TestBed.inject(AdminService);
      const blockSpy = spyOn(adminService, 'getBlockedUsers').and.callThrough();
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      expect(blockSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.blockedUsers.length).toBe(1);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').length).toBe(1);
      done();
    });

    // Check that you can block a user
    it('should block a user', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const blockSpy = spyOn(adminDashboard, 'block').and.callThrough();
      const checkBlockSpy = spyOn(adminDashboard, 'checkBlock').and.callThrough();
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = 5;
      adminDashboardDOM.querySelector('#blockLength').value = 'oneDay';
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      // check expectations
      expect(blockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalledWith(5, 'oneDay');
      expect(setBlockSpy).toHaveBeenCalled();
      expect(setBlockSpy).toHaveBeenCalledWith(5, 'oneDay', undefined);
      expect(blockServiceSpy).toHaveBeenCalled();
      expect(blockServiceSpy).toHaveBeenCalledWith(5, jasmine.any(Date));
      done();
    });

    // Check that you can unblock a user
    it('should unblock a user', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const unblockSpy = spyOn(adminDashboard, 'unblock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const unblockServiceSpy = spyOn(adminService, 'unblockUser').and.callThrough();
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();

      // check expectations
      expect(unblockSpy).toHaveBeenCalled();
      expect(unblockSpy).toHaveBeenCalledWith(15);
      expect(unblockServiceSpy).toHaveBeenCalled();
      expect(unblockServiceSpy).toHaveBeenCalledWith(15);
      done();
    });

    // Check that blocks are calculated correctly - day
    it('should calculate block length - day', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const blockLengthNum = 864E5 * 1;
      const blockLengthStr = 'oneDay';
      const blockedUser = 6;
      const releaseDate = new Date((new Date()).getTime() + blockLengthNum);
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = blockedUser;
      adminDashboardDOM.querySelector('#blockLength').value = blockLengthStr;
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();

      fixture.detectChanges();

      expect(setBlockSpy).toHaveBeenCalledWith(blockedUser, blockLengthStr, undefined);
      expect(blockServiceSpy).toHaveBeenCalledWith(blockedUser, jasmine.any(Date));
      expect(blockServiceSpy.calls.mostRecent().args[1].getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
      done();
    });

    // Check that blocks are calculated correctly - week
    it('should calculate block length - week', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const blockLengthNum = 864E5 * 7;
      const blockLengthStr = 'oneWeek';
      const blockedUser = 7;
      const releaseDate = new Date((new Date()).getTime() + blockLengthNum);
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = blockedUser;
      adminDashboardDOM.querySelector('#blockLength').value = blockLengthStr;
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();

      fixture.detectChanges();

      expect(setBlockSpy).toHaveBeenCalledWith(blockedUser, blockLengthStr, undefined);
      expect(blockServiceSpy).toHaveBeenCalledWith(blockedUser, jasmine.any(Date));
      expect(blockServiceSpy.calls.mostRecent().args[1].getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
      done();
    });

    // Check that blocks are calculated correctly - month
    it('should calculate block length - month', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const blockLengthNum = 864E5 * 30;
      const blockLengthStr = 'oneMonth';
      const blockedUser = 8;
      const releaseDate = new Date((new Date()).getTime() + blockLengthNum);
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = blockedUser;
      adminDashboardDOM.querySelector('#blockLength').value = blockLengthStr;
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();

      fixture.detectChanges();

      expect(setBlockSpy).toHaveBeenCalledWith(blockedUser, blockLengthStr, undefined);
      expect(blockServiceSpy).toHaveBeenCalledWith(blockedUser, jasmine.any(Date));
      expect(blockServiceSpy.calls.mostRecent().args[1].getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
      done();
    });

    // Check that blocks are calculated correctly - forever
    it('should calculate block length - forever', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const blockLengthNum = 864E5 * 36500;
      const blockLengthStr = 'forever';
      const blockedUser = 9;
      const releaseDate = new Date((new Date()).getTime() + blockLengthNum);
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = blockedUser;
      adminDashboardDOM.querySelector('#blockLength').value = blockLengthStr;
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();

      fixture.detectChanges();

      expect(setBlockSpy).toHaveBeenCalledWith(blockedUser, blockLengthStr, undefined);
      expect(blockServiceSpy).toHaveBeenCalledWith(blockedUser, jasmine.any(Date));
      expect(blockServiceSpy.calls.mostRecent().args[1].getTime() / 1000).toBeCloseTo(releaseDate.getTime() / 1000, 1);
      done();
    });

    // Check that blocks are calculated correctly - extending a block
    it('should calculate block length - extending an existing block', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const releaseDate = new Date((new Date('2020-09-29 19:17:31.072')).getTime() + 864E5 * 7);
      const blockLengthStr = 'oneWeek';
      const blockedUser = 15;
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = blockedUser;
      adminDashboardDOM.querySelector('#blockLength').value = blockLengthStr;
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();

      fixture.detectChanges();

      expect(setBlockSpy).toHaveBeenCalledWith(blockedUser, blockLengthStr, undefined);
      expect(blockServiceSpy).toHaveBeenCalledWith(blockedUser, releaseDate);
      done();
    });
  });

  // FILTERS PAGE
  // ==================================================================
  describe('Filters Page', () => {
    // Before each test, configure testing environment
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false }),
          FontAwesomeModule
        ],
        declarations: [
          AdminDashboard,
          PopUp,
          Loader
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();

      // make sure the test goes through with admin permission
      const authService = TestBed.inject(AuthService);
      spyOn(authService, 'canUser').and.returnValue(true);
      authService.isUserDataResolved.next(true);
    });

    // Check that a call is made to get filtered phrases
    it('should get filtered phrases', (done: DoneFn) => {
      // set up the spy and the component
      const adminService = TestBed.inject(AdminService);
      const filterSpy = spyOn(adminService, 'getFilters').and.callThrough();
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminDashboard.screen = 'filters';

      fixture.detectChanges();

      expect(filterSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.filteredPhrases.length).toBe(2);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').length).toBe(2);
      done();
    });

    // Check that you can add a filter
    it('should add a new filter', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const addSpy = spyOn(adminDashboard, 'addFilter').and.callThrough();
      const adminService = adminDashboard.adminService;
      const addServiceSpy = spyOn(adminService, 'addFilter').and.callThrough();
      adminDashboard.screen = 'filters';

      fixture.detectChanges();

      // add filter to the text-field and click the button
      adminDashboardDOM.querySelector('#filter').value = 'text';
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();

      // check expectations
      expect(addSpy).toHaveBeenCalled();
      expect(addServiceSpy).toHaveBeenCalled();
      expect(addServiceSpy).toHaveBeenCalledWith('text');
      done();
    });

    // Check that you can remove a filter
    it('should remove a filter', (done: DoneFn) => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const removeSpy = spyOn(adminDashboard, 'removeFilter').and.callThrough();
      const adminService = adminDashboard.adminService;
      const removeServiceSpy = spyOn(adminService, 'removeFilter').and.callThrough();
      adminDashboard.screen = 'filters';

      fixture.detectChanges();

      // simulate click on the 'remove' button
      adminDashboardDOM.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();

      // check expectations
      expect(removeSpy).toHaveBeenCalled();
      expect(removeServiceSpy).toHaveBeenCalled();
      expect(removeServiceSpy).toHaveBeenCalledWith(1);
      done();
    });
  });
});
