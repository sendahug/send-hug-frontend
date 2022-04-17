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
import { ReportForm } from './reportForm.component';
import { AuthService } from '../../../services/auth.service';
import { MockAuthService } from '../../../services/auth.service.mock';
import { ItemsService } from '../../../services/items.service';
import { MockItemsService } from '../../../services/items.service.mock';
import { AlertsService } from '../../../services/alerts.service';
import { MockAlertsService } from '../../../services/alerts.service.mock';
import { Report } from '../../../interfaces/report.interface';


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
         ReportForm,
       ],
       providers: [
         { provide: APP_BASE_HREF, useValue: '/' },
         { provide: AuthService, useClass: MockAuthService },
         { provide: ItemsService, useClass: MockItemsService },
         { provide: AlertsService, useClass: MockAlertsService }
       ]
     }).compileComponents();
   });

   // Check that the reported post is shown
   it('shows the reported post', () => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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

   // Check that the reported user's display name is shown
   it('shows the reported user\'s name', () => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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

   it('correctly sets the selected reason - posts', () => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
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
     const otherTextField = document.getElementById('rOption3Text') as HTMLInputElement;

     fixture.detectChanges();

     popUp.setSelected('0');
     expect(popUp.selectedReason).toEqual('The post is Inappropriate');
     expect(otherTextField.required).toBe(false);
     expect(otherTextField.disabled).toBe(true);
     expect(otherTextField.getAttribute('aria-required')).toEqual('false');

     popUp.setSelected('1');
     expect(popUp.selectedReason).toEqual('The post is Spam');
     expect(otherTextField.required).toBe(false);
     expect(otherTextField.disabled).toBe(true);
     expect(otherTextField.getAttribute('aria-required')).toEqual('false');

     popUp.setSelected('2');
     expect(popUp.selectedReason).toEqual('The post is Offensive');
     expect(otherTextField.required).toBe(false);
     expect(otherTextField.disabled).toBe(true);
     expect(otherTextField.getAttribute('aria-required')).toEqual('false');

     popUp.setSelected('3');
     expect(popUp.selectedReason).toEqual('other');
     expect(otherTextField.required).toBe(true);
     expect(otherTextField.disabled).toBe(false);
     expect(otherTextField.getAttribute('aria-required')).toEqual('true');
   });

   it('correctly sets the selected reason - users', () => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
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
     const otherTextField = document.getElementById('rOption3Text') as HTMLInputElement;

     fixture.detectChanges();

     popUp.setSelected('0');
     expect(popUp.selectedReason).toEqual('The user is posting Spam');
     expect(otherTextField.required).toBe(false);
     expect(otherTextField.disabled).toBe(true);
     expect(popUp.getAttribute('aria-required')).toEqual('false');

     popUp.setSelected('1');
     expect(popUp.selectedReason).toEqual('The user is posting harmful / dangerous content');
     expect(otherTextField.required).toBe(false);
     expect(otherTextField.disabled).toBe(true);
     expect(popUp.getAttribute('aria-required')).toEqual('false');

     popUp.setSelected('2');
     expect(popUp.selectedReason).toEqual('The user is behaving in an abusive manner');
     expect(otherTextField.required).toBe(false);
     expect(otherTextField.disabled).toBe(true);
     expect(popUp.getAttribute('aria-required')).toEqual('false');

     popUp.setSelected('3');
     expect(popUp.selectedReason).toEqual('other');
     expect(otherTextField.required).toBe(true);
     expect(otherTextField.disabled).toBe(false);
     expect(popUp.getAttribute('aria-required')).toEqual('true');
   });

   // Check that if the user chooses 'other' as reason they can't submit an
   // empty reason
   it('requires text if the chosen reason is other - invalid', (done: DoneFn) => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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
     const validateSpy = spyOn(popUp, 'validateOtherField').and.returnValue(false);
     const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
     const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport');
     fixture.detectChanges();

     // select option 4
     popUpDOM.querySelector('#pRadioOption3').click();
     fixture.detectChanges();

     // try to submit it without text in the textfield
     popUpDOM.querySelectorAll('.reportButton')[0].click();
     fixture.detectChanges();

     // check the report wasn't sent and the user was alerted
     expect(validateSpy).toHaveBeenCalledWith('hi');
     expect(toggleSpy).not.toHaveBeenCalled();
     expect(reportServiceSpy).not.toHaveBeenCalled();
     done();
   });

   it('requires text if the chosen reason is other - valid', (done: DoneFn) => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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
     const validateSpy = spyOn(popUp, 'validateOtherField').and.returnValue(true);
     const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
     const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport');
     const reportReason = 'because';
     fixture.detectChanges();

     // select option 4
     popUpDOM.querySelector('#pRadioOption3').click();
     popUpDOM.querySelector('#rOption3Text').value = reportReason;
     fixture.detectChanges();

     // try to submit it without text in the textfield
     popUpDOM.querySelectorAll('.reportButton')[0].click();
     fixture.detectChanges();

     // check the report wasn't sent and the user was alerted
     expect(validateSpy).toHaveBeenCalledWith(reportReason);
     expect(toggleSpy).toHaveBeenCalledWith(true, reportReason);
     expect(popUp.selectedReason).toEqual(reportReason);
     expect(reportServiceSpy).toHaveBeenCalled();
     done();
   });

   it('creates the report and sends it to the itemsService - post', (done: DoneFn) => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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
     const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport');
     fixture.detectChanges();

     // select option 1
     popUpDOM.querySelector('#pRadioOption0').click();
     fixture.detectChanges();

     // try to submit it without text in the textfield
     popUpDOM.querySelectorAll('.reportButton')[0].click();
     fixture.detectChanges();

     // check the report wasn't sent and the user was alerted
     const report: Report = {
       type: 'Post',
       userID: 2,
       postID: 1,
       reporter: 0,
       reportReason: 'The post is Inappropriate',
       dismissed: false,
       closed: false
     }
     expect(reportServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(report));
   });

   it('creates the report and sends it to the itemsService - user', (done: DoneFn) => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
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
     const reportServiceSpy = spyOn(popUp['itemsService'], 'sendReport');
     fixture.detectChanges();

     // select option 1
     popUpDOM.querySelector('#pRadioOption0').click();
     fixture.detectChanges();

     // try to submit it without text in the textfield
     popUpDOM.querySelectorAll('.reportButton')[0].click();
     fixture.detectChanges();

     // check the report wasn't sent and the user was alerted
     const report: Report = {
       type: 'User',
       userID: 3,
       postID: undefined,
       reporter: 0,
       reportReason: 'The post is Inappropriate',
       dismissed: false,
       closed: false
     }
     expect(reportServiceSpy).toHaveBeenCalledWith(jasmine.objectContaining(report));
   });

   it('should raise validation error on empty otherText', () => {
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
     const createAlertSpy = spyOn(popUp['alertsService'], 'createAlert');
     const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
     const otherText = popUpDOM.querySelector('#rOption3Text');

     const res = popUp.validateOtherField(otherText);

     expect(res).toBe(false);
     expect(toggleSpy).toHaveBeenCalledWith(false);
     expect(createAlertSpy).toHaveBeenCalledWith({ message: 'The \'other\' field cannot be empty.', type: 'Error' });
   });

   it('should raise validation error on long reasons', () => {
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
     const createAlertSpy = spyOn(popUp['alertsService'], 'createAlert');
     const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
     const otherText = popUpDOM.querySelector('#rOption3Text');
     let otherReason = '';

     for(let i = 100; i < 200; i++) {
       otherReason += i * 10;
     }

     popUpDOM.querySelector('#pRadioOption3').click();
     popUpDOM.querySelector('#rOption3Text').value = otherReason;
     fixture.detectChanges();

     const res = popUp.validateOtherField(otherText);

     expect(res).toBe(false);
     expect(toggleSpy).toHaveBeenCalledWith(false);
     expect(createAlertSpy).toHaveBeenCalledWith({ type: 'Error', message: 'Report reason cannot be over 120 characters! Please shorten the message and try again.' });
   });

   it('should return valid for valid posts', () => {
     TestBed.createComponent(AppComponent);
     TestBed.inject(AuthService).login();
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
     const createAlertSpy = spyOn(popUp['alertsService'], 'createAlert');
     const toggleSpy = spyOn(popUp, 'toggleErrorIndicator');
     const otherText = popUpDOM.querySelector('#rOption3Text');
     const reportReason = 'because';

     otherText.value = reportReason;
     fixture.detectChanges();

     const res = popUp.validateOtherField(otherText);

     expect(res).toBe(true);
     expect(toggleSpy).not.toHaveBeenCalled();
     expect(createAlertSpy).not.toHaveBeenCalled();
   });

   it('should toggle error indicator on', () => {
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
     const otherText = popUpDOM.querySelector('#rOption3Text');

     popUp.toggleErrorIndicator(false, otherText);

     expect(otherText.classList).toContain('missing');
     expect(otherText.getAttribute('aria-invalid')).toEqual('true');
   });

   it('should toggle error indicator off', () => {
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
     const otherText = popUpDOM.querySelector('#rOption3Text');

     popUp.toggleErrorIndicator(true, otherText);

     expect(otherText.classList).not.toContain('missing');
     expect(otherText.getAttribute('aria-invalid')).toEqual('false');
   });

   it('should toggle missing off if it\'s on', () => {
     const fixture = TestBed.createComponent(ReportForm);
     const popUp = fixture.componentInstance;
     const popUpDOM = fixture.nativeElement;
     const otherText = popUpDOM.querySelector('#rOption3Text');

     popUp.toggleErrorIndicator(false, otherText);

     expect(otherText.classList).toContain('missing');

     popUp.toggleErrorIndicator(true, otherText);

     expect(otherText.classList).not.toContain('missing');
   });
});
