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
import { ActivatedRoute, UrlSegment } from "@angular/router";
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
  // Check that a call is made to get open reports
  it('should get open reports', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const reportSpy = spyOn(adminService, 'getOpenReports');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    adminDashboard.screen = 'reports';

    fixture.detectChanges();
    tick();

    expect(reportSpy).toHaveBeenCalled();
    expect(adminDashboard.adminService.userReports.length).toBe(1);
    expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').count()).toBe(1);
    expect(adminDashboard.adminService.postReports.length).toBe(1);
    expect(adminDashboardDOM.querySelectorAll('.tableContainer')[1].querySelectorAll('tbody tr').count()).toBe(1);
  }));

  // Check that you can block users
  it('should block a user', fakeAsync(() => {

  }));

  // Check that user editing triggers the popup
  it('should edit a user\'s display name', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const editServiceSpy = spyOn(adminService, 'editUser');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    const editSpy = spyOn(adminDashboard, 'editUser');
    adminDashboard.screen = 'reports';

    // before the click
    expect(adminDashboard.editMode).toBeFalse();

    // trigger click
    const userTable = adminDashboardDOM.querySelectorAll('.tableContainer')[0];
    userTable.querySelectorAll('.adminButton')[1].click();
    fixture.detectChanges();
    tick();

    // check expectations
    expect(editSpy).toHaveBeenCalled();
    expect(editServiceSpy).toHaveBeenCalled();
    expect(adminDashboard.editMode).toBeTrue();
    expect(adminDashboard.editType).toBe('other user');
    expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that post editing triggers the popup
  it('should edit a post\'s text', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const editServiceSpy = spyOn(adminService, 'editPost');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    const editSpy = spyOn(adminDashboard, 'editPost');
    adminDashboard.screen = 'reports';

    // before the click
    expect(adminDashboard.editMode).toBeFalse();

    // trigger click
    const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
    postTable.querySelectorAll('.adminButton')[0].click();
    fixture.detectChanges();
    tick();

    // check expectations
    expect(editSpy).toHaveBeenCalled();
    expect(editServiceSpy).toHaveBeenCalled();
    expect(adminDashboard.editMode).toBeTrue();
    expect(adminDashboard.editType).toBe('admin post');
    expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that deleting a post triggers the popup
  it('should delete a post', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const deleteServiceSpy = spyOn(adminService, 'deletePost');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    const deleteSpy = spyOn(adminDashboard, 'deletePost');
    adminDashboard.screen = 'reports';

    // before the click
    expect(adminDashboard.editMode).toBeFalse();

    // trigger click
    const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
    postTable.querySelectorAll('.adminButton')[1].click();
    fixture.detectChanges();
    tick();

    // check expectations
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteServiceSpy).toHaveBeenCalled();
    expect(adminDashboard.editMode).toBeTrue();
    expect(adminDashboard.editType).toBe('admin post');
    expect(adminDashboardDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that you can dismiss reports
  it('should dismiss report', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const dismissServiceSpy = spyOn(adminService, 'deletePost');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    const dismissSpy = spyOn(adminDashboard, 'deletePost');
    adminDashboard.screen = 'reports';

    // trigger click
    const postTable = adminDashboardDOM.querySelectorAll('.tableContainer')[1];
    postTable.querySelectorAll('.adminButton')[2].click();
    fixture.detectChanges();
    tick();

    // check expectations
    expect(dismissSpy).toHaveBeenCalled();
    expect(dismissServiceSpy).toHaveBeenCalled();
    expect(dismissServiceSpy).toHaveBeenCalledWith(1);
  }));

  // BLOCKS PAGE
  // ==================================================================
  // Check that a call is made to get blocked users
  it('should get blocked users', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const blockSpy = spyOn(adminService, 'getBlockedUsers');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    adminDashboard.screen = 'blocks';

    tick();

    expect(blockSpy).toHaveBeenCalled();
    expect(adminDashboard.adminService.blockedUsers.length).toBe(1);
    expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').count()).toBe(1);
  }));

  // Check that you can block a user
  it('should block a user', fakeAsync(() => {

  }));

  // Check that you can unblock a user
  it('should unblock a user', fakeAsync(() => {

  }));

  // Check that blocks are calculated correctly
  it('should calculate block length', () => {

  });

  // FILTERS PAGE
  // ==================================================================
  // Check that a call is made to get filtered phrases
  it('should get filtered phrases', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const filterSpy = spyOn(adminService, 'getFilters');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    adminDashboard.screen = 'filters';

    tick();

    expect(filterSpy).toHaveBeenCalled();
    expect(adminDashboard.adminService.filteredPhrases.length).toBe(2);
    expect(adminDashboardDOM.querySelectorAll('.tableContainer')[0].querySelectorAll('tbody tr').count()).toBe(2);
  }));

  // Check that you can add a filter
  it('should add a new filter', fakeAsync(() => {
    // set up the spy and the component
    const adminService = TestBed.get(AdminService);
    const addServiceSpy = spyOn(adminService, 'addFilter');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    const addSpy = spyOn(adminDashboard, 'addFilter');
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
    const adminService = TestBed.get(AdminService);
    const removeServiceSpy = spyOn(adminService, 'removeFilter');
    const fixture = TestBed.createComponent(AdminDashboard);
    const adminDashboard = fixture.componentInstance;
    const adminDashboardDOM = fixture.nativeElement;
    const removeSpy = spyOn(adminDashboard, 'removeFilter');
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
