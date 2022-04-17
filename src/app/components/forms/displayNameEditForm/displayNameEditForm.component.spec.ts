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

import { AppComponent } from '../../../app.component';
import { DisplayNameEditForm } from './displayNameEditForm.component';
import { AuthService } from '../../../services/auth.service';
import { MockAuthService } from '../../../services/auth.service.mock';
import { AdminService } from '../../../services/admin.service';
import { MockAdminService } from '../../../services/admin.service.mock';
import { AlertsService } from '../../../services/alerts.service';
import { MockAlertsService } from '../../../services/alerts.service.mock';

// DISPLAY NAME EDIT
// ==================================================================
describe('DisplayNameEditForm', () => {
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
        DisplayNameEditForm,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AdminService, useClass: MockAdminService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(popUp).toBeTruthy();
  });

  it('should set editedItem depending on toEdit', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    popUp.toEdit = 'user';
    popUp.ngOnInit();

    expect(popUp.editedItem).toEqual(popUp.authService.userData.displayName);

    popUp.toEdit = 'other user';
    popUp.editedItem = 'test';
    popUp.ngOnInit();

    expect(popUp.editedItem).toEqual('test');
  });

  it('should make the request to authService to change the name', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = 'user';
    popUp.editedItem = {
      id: 4,
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
    };
    const newName = 'new name';

    const validateSpy = spyOn(popUp, 'validateDisplayName').and.returnValue(true);
    const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
    const updateSpy = spyOn(popUp.authService, 'updateUserData');
    const emitSpy = spyOn(popUp.editMode, 'emit');

    popUpDOM.querySelector('#displayName').value = newName;
    popUpDOM.querySelectorAll('.updateItem')[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith(newName);
    expect(toggleSpy).toHaveBeenCalledWith(true);
    expect(popUp.authService.userData.displayName).toEqual(newName);
    expect(updateSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should make the request to adminService to change the name - close report', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = 'other user';
    popUp.editedItem = {
      id: 4,
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
    };
    popUp.reportData = {
      reportID: 1
    };
    const newName = 'new name';

    const validateSpy = spyOn(popUp, 'validateDisplayName').and.returnValue(true);
    const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
    const updateSpy = spyOn(popUp['adminService'], 'editUser');
    const emitSpy = spyOn(popUp.editMode, 'emit');

    popUpDOM.querySelector('#displayName').value = newName;
    popUpDOM.querySelectorAll('.updateItem')[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith(newName);
    expect(toggleSpy).toHaveBeenCalledWith(true);
    expect(updateSpy).toHaveBeenCalled({
      userID: 4,
      displayName: newName,
    }, true, 1);
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should make the request to adminService to change the name - don\'t close report', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = 'other user';
    popUp.editedItem = {
      id: 4,
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
    };
    popUp.reportData = {
      reportID: 1
    };
    const newName = 'new name';

    const validateSpy = spyOn(popUp, 'validateDisplayName').and.returnValue(true);
    const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
    const updateSpy = spyOn(popUp['adminService'], 'editUser');
    const emitSpy = spyOn(popUp.editMode, 'emit');

    popUpDOM.querySelector('#displayName').value = newName;
    popUpDOM.querySelectorAll('.updateItem')[1].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith(newName);
    expect(toggleSpy).toHaveBeenCalledWith(true);
    expect(updateSpy).toHaveBeenCalled({
      userID: 4,
      displayName: newName,
    }, false, 1);
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should raise validation error on empty names', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;

    const createAlertSpy = spyOn(popUp['alertsService'], 'createAlert');
    const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');

    const res = popUp.validateDisplayName("");

    expect(res).toBe(false);
    expect(toggleSpy).toHaveBeenCalledWith(false);
    expect(createAlertSpy).toHaveBeenCalledWith({ type: 'Error', message: 'New display name cannot be empty! Please fill the field and try again.' });
  });

  it('should raise validation error on long names', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;

    const createAlertSpy = spyOn(popUp['alertsService'], 'createAlert');
    const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
    let newName = "";

    for(let i = 0; i < 50; i++) {
      newName += i;
    }

    const res = popUp.validateDisplayName(newName);

    expect(res).toBe(false);
    expect(toggleSpy).toHaveBeenCalledWith(false);
    expect(createAlertSpy).toHaveBeenCalledWith({ type: 'Error', message: 'New display name cannot be over 60 characters! Please shorten the name and try again.' });
  });

  it('should return valid for valid names', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;

    const createAlertSpy = spyOn(popUp['alertsService'], 'createAlert');
    const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
    let newName = "my name";

    const res = popUp.validateDisplayName(newName);

    expect(res).toBe(true);
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(createAlertSpy).not.toHaveBeenCalled();
  });

  it('should toggle error indicator on', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const textField = popUpDOM.querySelector('#displayName');

    popUp.toggleErrorIndicator(false);

    expect(textField.classList).toContain('missing');
    expect(textField.getAttribute('aria-invalid')).toEqual('true');
  });

  it('should toggle error indicator off', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const textField = popUpDOM.querySelector('#displayName');

    popUp.toggleErrorIndicator(true);

    expect(textField.classList).not.toContain('missing');
    expect(textField.getAttribute('aria-invalid')).toEqual('false');
  });

  it('should toggle missing off if it\'s on', () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const textField = popUpDOM.querySelector('#displayName');

    popUp.toggleErrorIndicator(false);

    expect(textField.classList).toContain('missing');

    popUp.toggleErrorIndicator(true);

    expect(textField.classList).not.toContain('missing');
  });
});
