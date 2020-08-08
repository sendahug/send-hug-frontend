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
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register('sw.js')
      ],
      declarations: [
        AppComponent,
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
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(adminDashboard).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;

    expect(adminDashboard.editMode).toBeFalse();
    expect(adminDashboard.delete).toBeFalse();
    expect(adminDashboard.report).toBeFalse();
  });

  // Check that clicking the navigation buttons changes the screen
  it('should change screen when navigating to another page', fakeAsync(() => {
    // make sure the test goes through with admin permission
    const authService = TestBed.get(AuthService);
    spyOn(authService, 'canUser').and.returnValue(true);
    // set up the component
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;

    // check the initial screen is the main screen
    expect(adminDashboard.screen).toBe('main');

    // click the second nav button
    adminDashboardDOM.querySelectorAll('.adminNavItem')[1].click();
    fixture.detectChanges();
    tick();

    // check the screen is now the reports screen
    expect(adminDashboard.screen).toBe('reports');

    // click the third nav button
    adminDashboardDOM.querySelectorAll('.adminNavItem')[2].click();
    fixture.detectChanges();
    tick();

    // check the screen is now the blocks screen
    expect(adminDashboard.screen).toBe('blocks');

    // click the fourth nav button
    adminDashboardDOM.querySelectorAll('.adminNavItem')[3].click();
    fixture.detectChanges();
    tick();

    // check the screen is now the filters screen
    expect(adminDashboard.screen).toBe('filters');
  }));

  // REPORTS PAGE
  // ==================================================================
  describe('Reports Page', () => {
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
      const authService = TestBed.get(AuthService) as AuthService;
      spyOn(authService, 'canUser').and.returnValue(true);
      authService.isUserDataResolved.next(true);
    });

    // Check that a call is made to get open reports
    it('should get open reports', fakeAsync(() => {
      // set up the spy and the component
      const adminService = TestBed.get(AdminService);
      const reportSpy = spyOn(adminService, 'getOpenReports').and.callThrough();
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminDashboard.screen = 'reports';

      fixture.detectChanges();
      tick();

      expect(reportSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.userReports.length).toBe(1);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').length).toBe(1);
      expect(adminDashboard.adminService.postReports.length).toBe(1);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[1].querySelectorAll('tbody tr').length).toBe(1);
    }));

    // Check that you can block users
    it('should block a user', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const blockSpy = spyOn(adminDashboard, 'blockUser').and.callThrough();
      const checkBlockSpy = spyOn(adminDashboard, 'checkBlock').and.callThrough();
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const releaseDate = new Date((new Date()).getTime() + 864E5 * 1);
      adminDashboard.screen = 'reports';

      fixture.detectChanges();
      tick();

      // trigger a click
      const userTable = adminDashboardDOM.querySelectorAll('.tableContainer')[0];
      userTable.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(blockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalledWith(10, 'oneDay', 1);
      expect(setBlockSpy).toHaveBeenCalled();
      expect(setBlockSpy).toHaveBeenCalledWith(10, 'oneDay', 1);
      expect(blockServiceSpy).toHaveBeenCalled();
      expect(blockServiceSpy).toHaveBeenCalledWith(10, releaseDate, 1);
    }));

    // Check that user editing triggers the popup
    it('should edit a user\'s display name', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const editSpy = spyOn(adminDashboard, 'editUser').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();
      tick();

      // before the click
      expect(adminDashboard.editMode).toBeFalse();

      // trigger click
      const userTable = adminDashboardDOM.querySelectorAll('.tableContainer')[0];
      userTable.querySelectorAll('.adminButton')[1].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(editSpy).toHaveBeenCalled();
      expect(adminDashboard.editMode).toBeTrue();
      expect(adminDashboard.editType).toBe('other user');
      expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that post editing triggers the popup
    it('should edit a post\'s text', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const editSpy = spyOn(adminDashboard, 'editPost').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();
      tick();

      // before the click
      expect(adminDashboard.editMode).toBeFalse();

      // trigger click
      const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
      postTable.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(editSpy).toHaveBeenCalled();
      expect(adminDashboard.editMode).toBeTrue();
      expect(adminDashboard.editType).toBe('admin post');
      expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that deleting a post triggers the popup
    it('should delete a post', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const deleteSpy = spyOn(adminDashboard, 'deletePost').and.callThrough();
      adminDashboard.screen = 'reports';

      fixture.detectChanges();
      tick();

      // before the click
      expect(adminDashboard.editMode).toBeFalse();

      // trigger click
      const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
      postTable.querySelectorAll('.adminButton')[1].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(deleteSpy).toHaveBeenCalled();
      expect(adminDashboard.editMode).toBeTrue();
      expect(adminDashboard.editType).toBe('ad post');
      expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that you can dismiss reports
    it('should dismiss report', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const dismissSpy = spyOn(adminDashboard, 'dismissReport').and.callThrough();
      const adminService = adminDashboard.adminService;
      const dismissServiceSpy = spyOn(adminService, 'dismissReport').and.callThrough();

      adminDashboard.screen = 'reports';

      fixture.detectChanges();
      tick();

      // trigger click
      const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
      postTable.querySelectorAll('.adminButton')[2].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(dismissSpy).toHaveBeenCalled();
      expect(dismissServiceSpy).toHaveBeenCalled();
      expect(dismissServiceSpy).toHaveBeenCalledWith(2);
    }));
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
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js')
        ],
        declarations: [
          AppComponent,
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
      const authService = TestBed.get(AuthService) as AuthService;
      spyOn(authService, 'canUser').and.returnValue(true);
      authService.isUserDataResolved.next(true);
    });

    // Check that a call is made to get blocked users
    it('should get blocked users', fakeAsync(() => {
      // set up the spy and the component
      const adminService = TestBed.get(AdminService);
      const blockSpy = spyOn(adminService, 'getBlockedUsers').and.callThrough();
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();
      tick();

      expect(blockSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.blockedUsers.length).toBe(1);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').length).toBe(1);
    }));

    // Check that you can block a user
    it('should block a user', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const blockSpy = spyOn(adminDashboard, 'block').and.callThrough();
      const checkBlockSpy = spyOn(adminDashboard, 'checkBlock').and.callThrough();
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const releaseDate = new Date((new Date()).getTime() + 864E5 * 1);
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();
      tick();

      // trigger a click
      adminDashboardDOM.querySelector('#blockID').value = 5;
      adminDashboardDOM.querySelector('#blockLength').value = 'oneDay';
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(blockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalled();
      expect(checkBlockSpy).toHaveBeenCalledWith(5, 'oneDay');
      expect(setBlockSpy).toHaveBeenCalled();
      expect(setBlockSpy).toHaveBeenCalledWith(5, 'oneDay', undefined);
      expect(blockServiceSpy).toHaveBeenCalled();
      expect(blockServiceSpy).toHaveBeenCalledWith(5, releaseDate);
    }));

    // Check that you can unblock a user
    it('should unblock a user', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const unblockSpy = spyOn(adminDashboard, 'unblock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const unblockServiceSpy = spyOn(adminService, 'unblockUser').and.callThrough();
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();
      tick();

      // trigger a click
      adminDashboardDOM.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(unblockSpy).toHaveBeenCalled();
      expect(unblockSpy).toHaveBeenCalledWith(15);
      expect(unblockServiceSpy).toHaveBeenCalled();
      expect(unblockServiceSpy).toHaveBeenCalledWith(15);
    }));

    // Check that blocks are calculated correctly
    it('should calculate block length', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const setBlockSpy = spyOn(adminDashboard, 'setBlock').and.callThrough();
      const adminService = adminDashboard.adminService;
      const blockServiceSpy = spyOn(adminService, 'blockUser').and.callThrough();
      const releaseDates = [
        new Date((new Date()).getTime() + 864E5 * 1),
        new Date((new Date()).getTime() + 864E5 * 7),
        new Date((new Date()).getTime() + 864E5 * 30),
        new Date((new Date()).getTime() + 864E5 * 36500)
      ];
      const blockLengths = [
        'oneDay', 'oneWeek', 'oneMonth', 'forever'
      ];
      const users = [ 6, 7, 8, 9 ];
      adminDashboard.screen = 'blocks';

      fixture.detectChanges();
      tick();

      blockLengths.forEach((length, index) => {
        // trigger a click
        adminDashboardDOM.querySelector('#blockID').value = users[index];
        adminDashboardDOM.querySelector('#blockLength').value = length;
        adminDashboardDOM.querySelectorAll('.sendData')[0].click();
        fixture.detectChanges();
        tick();

        expect(setBlockSpy).toHaveBeenCalledWith(users[index], length);
        expect(blockServiceSpy).toHaveBeenCalledWith(users[index], releaseDates[index])
      });
    }));
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
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js')
        ],
        declarations: [
          AppComponent,
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
      const authService = TestBed.get(AuthService) as AuthService;
      spyOn(authService, 'canUser').and.returnValue(true);
      authService.isUserDataResolved.next(true);
    });

    // Check that a call is made to get filtered phrases
    it('should get filtered phrases', fakeAsync(() => {
      // set up the spy and the component
      const adminService = TestBed.get(AdminService);
      const filterSpy = spyOn(adminService, 'getFilters').and.callThrough();
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      adminDashboard.screen = 'filters';

      fixture.detectChanges();
      tick();

      expect(filterSpy).toHaveBeenCalled();
      expect(adminDashboard.adminService.filteredPhrases.length).toBe(2);
      expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').length).toBe(2);
    }));

    // Check that you can add a filter
    it('should add a new filter', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const addSpy = spyOn(adminDashboard, 'addFilter').and.callThrough();
      const adminService = adminDashboard.adminService;
      const addServiceSpy = spyOn(adminService, 'addFilter').and.callThrough();
      adminDashboard.screen = 'filters';

      fixture.detectChanges();
      tick();

      // add filter to the text-field and click the button
      adminDashboardDOM.querySelector('#filter').value = 'text';
      adminDashboardDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(addSpy).toHaveBeenCalled();
      expect(addServiceSpy).toHaveBeenCalled();
      expect(addServiceSpy).toHaveBeenCalledWith('text');
    }));

    // Check that you can remove a filter
    it('should remove a filter', fakeAsync(() => {
      // set up the spy and the component
      const fixture = TestBed.createComponent(AdminDashboard);
      const adminDashboard = fixture.componentInstance;
      const adminDashboardDOM = fixture.nativeElement;
      const removeSpy = spyOn(adminDashboard, 'removeFilter').and.callThrough();
      const adminService = adminDashboard.adminService;
      const removeServiceSpy = spyOn(adminService, 'removeFilter').and.callThrough();
      adminDashboard.screen = 'filters';

      fixture.detectChanges();
      tick();

      // simulate click on the 'remove' button
      adminDashboardDOM.querySelectorAll('.adminButton')[0].click();
      fixture.detectChanges();
      tick();

      // check expectations
      expect(removeSpy).toHaveBeenCalled();
      expect(removeServiceSpy).toHaveBeenCalled();
      expect(removeServiceSpy).toHaveBeenCalledWith('word');
    }));
  });
});
