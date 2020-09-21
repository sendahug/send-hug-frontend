/*
	User Page
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
import { ActivatedRoute } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserPage } from './userPage.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
import { MyPosts } from '../myPosts/myPosts.component';
import { HeaderMessage } from '../headerMessage/headerMessage.component';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('UserPage', () => {
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
        UserPage,
        PopUp,
        Loader,
        MyPosts,
        HeaderMessage
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    expect(userPage).toBeTruthy();
  });

  // Check that the component checks for a logged in user
  it('should check for a logged in user', () => {
    const authService = TestBed.get(AuthService);
    const authSpy = spyOn(authService, 'checkHash').and.callThrough();
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;

    expect(authSpy).toHaveBeenCalled();
    expect(userPage).toBeTruthy();
  });

  // Check that the popup variables are set to false
  it('should have the popup variables set to false', () => {
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;

    expect(userPage.editMode).toBeFalse();
    expect(userPage.report).toBeFalse();
  });

  // Check that when there's no ID the component defaults to the logged in user
  it('should show the logged in user if not provided with ID', fakeAsync(() => {
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    const userData = userPage.authService.userData;
    expect(userPage.userId).toBeUndefined();
    expect(userPage.itemsService.isOtherUser).toBeFalse();
    expect(userPageDOM.querySelectorAll('.displayName')[0].firstElementChild.textContent).toBe(userData.displayName);
    expect(userPageDOM.querySelector('#roleElement').querySelectorAll('.pageData')[0].textContent).toBe(userData.role);
    expect(userPageDOM.querySelector('#rHugsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.receivedHugs));
    expect(userPageDOM.querySelector('#gHugsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.givenHugs));
    expect(userPageDOM.querySelector('#postsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.postsNum));
    expect(userPageDOM.querySelector('#logout')).toBeTruthy();
  }));

  // Check that when the ID is the user's ID, it shows the user's own page
  it('should show the logged in user if it\'s the user\'s own ID', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    const routeSpy = spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    const userData = userPage.authService.userData;
    expect(routeSpy).toHaveBeenCalled();
    expect(userPage.userId).toBe(4);
    expect(userPage.itemsService.isOtherUser).toBeFalse();
    expect(userPageDOM.querySelectorAll('.displayName')[0].firstElementChild.textContent).toBe(userData.displayName);
    expect(userPageDOM.querySelector('#roleElement').querySelectorAll('.pageData')[0].textContent).toBe(userData.role);
    expect(userPageDOM.querySelector('#rHugsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.receivedHugs));
    expect(userPageDOM.querySelector('#gHugsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.givenHugs));
    expect(userPageDOM.querySelector('#postsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.postsNum));
    expect(userPageDOM.querySelector('#logout')).toBeTruthy();
    expect(userPageDOM.querySelectorAll('.reportButton')[0]).toBeUndefined();
  }));

  // Check that when the ID is another user's ID, it shows their page
  it('should show another user\'s page if that was the provided ID', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    const routeSpy = spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    const userData = userPage.itemsService.otherUserData;
    expect(routeSpy).toHaveBeenCalled();
    expect(userPage.userId).toBe(1);
    expect(userPage.itemsService.isOtherUser).toBeTrue();
    expect(userPageDOM.querySelectorAll('.displayName')[0].firstElementChild.textContent).toContain(userData.displayName);
    expect(userPageDOM.querySelector('#roleElement').querySelectorAll('.pageData')[0].textContent).toBe(userData.role);
    expect(userPageDOM.querySelector('#rHugsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.receivedHugs));
    expect(userPageDOM.querySelector('#gHugsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.givenHugs));
    expect(userPageDOM.querySelector('#postsElement').querySelectorAll('.pageData')[0].textContent).toBe(String(userData.postsNum));
    expect(userPageDOM.querySelector('#logout')).toBeNull();
    expect(userPageDOM.querySelectorAll('.reportButton')[0]).toBeTruthy();
  }));

  // Check that the 'please login page' is shown if the user's logged out
  it('should show login page if user is not authenticated', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    userPage.authService.authenticated = false;

    fixture.detectChanges();
    tick();

    expect(userPage.itemsService.isOtherUser).toBeFalse();
    expect(userPageDOM.querySelector('#profileContainer')).toBeNull();
    expect(userPageDOM.querySelector('#loginBox')).toBeTruthy();
  }));

  // Check that the login button triggers the AuthService's login method
  it('should trigger the AuthService upon clicking login', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    const loginSpy = spyOn(userPage, 'login').and.callThrough();
    const serviceLoginSpy = spyOn(userPage.authService, 'login').and.callThrough();
    userPage.authService.authenticated = false;

    fixture.detectChanges();
    tick();

    // check that the user isn't logged in before the click
    expect(userPage.authService.authenticated).toBeFalse();
    expect(userPageDOM.querySelector('#loginBox')).toBeTruthy();

    // trigger click on the login button
    userPageDOM.querySelector('#logIn').click();
    fixture.detectChanges();
    tick();

    // check the login methods were called
    expect(loginSpy).toHaveBeenCalled();
    expect(serviceLoginSpy).toHaveBeenCalled();
  }));

  // Check that the logout button triggers the AuthService's logout method
  it('should trigger the AuthService upon clicking logout', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    const logoutSpy = spyOn(userPage, 'logout').and.callThrough();
    const serviceLogoutSpy = spyOn(userPage.authService, 'logout').and.callThrough();

    fixture.detectChanges();
    tick();

    // check the user is logged in
    expect(userPage.authService.authenticated).toBeTrue();
    expect(userPageDOM.querySelector('#profileContainer')).toBeTruthy();

    // trigger click on the logout button
    userPageDOM.querySelector('#logout').click();
    fixture.detectChanges();
    tick();

    // check the logout methods were called
    expect(logoutSpy).toHaveBeenCalled();
    expect(serviceLogoutSpy).toHaveBeenCalled();
  }));

  // Check that the popup is triggered on edit
  it('should open the popup upon editing', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    // before the click
    expect(userPage.editMode).toBeFalse();

    // trigger click
    userPageDOM.querySelector('#editName').click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(userPage.editMode).toBeTrue();
    expect(userPage.editType).toBe('user');
    expect(userPage.report).toBeFalse();
    expect(userPageDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  //Check that the popup is opened when clicking 'report'
  it('should open the popup upon reporting', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    // before the click
    expect(userPage.editMode).toBeFalse();
    expect(userPage.report).toBeFalse();

    // trigger click
    userPageDOM.querySelectorAll('.reportButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(userPage.editMode).toBeTrue();
    expect(userPage.editType).toBeUndefined();
    expect(userPage.report).toBeTrue();
    expect(userPageDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that sending a hug triggers the items service
  it('should trigger items service on hug', fakeAsync(() => {
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    const fixture = TestBed.createComponent(UserPage);
    const userPage = fixture.componentInstance;
    const userPageDOM = fixture.nativeElement;
    const itemsService = userPage.itemsService;
    const hugSpy = spyOn(userPage, 'sendHug').and.callThrough();
    const serviceHugSpy = spyOn(itemsService, 'sendUserHug').and.callThrough();
    userPage.itemsService['authService'].login();

    fixture.detectChanges();
    tick();

    // before the click
    expect(hugSpy).not.toHaveBeenCalled();
    expect(serviceHugSpy).not.toHaveBeenCalled();
    expect(userPage.itemsService.isOtherUser).toBeTrue();
    expect(userPage.itemsService['authService'].userData.givenHugs).toBe(2);
    expect(userPage.itemsService.otherUserData.receivedHugs).toBe(3);
    expect(userPageDOM.querySelector('#rHugsElement').querySelectorAll('.pageData')[0].textContent).toBe('3');

    // simulate click
    userPageDOM.querySelectorAll('.hugButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(hugSpy).toHaveBeenCalled();
    expect(serviceHugSpy).toHaveBeenCalled();
    expect(userPage.itemsService.isOtherUser).toBeTrue();
    expect(userPage.itemsService['authService'].userData.givenHugs).toBe(3);
    expect(userPage.itemsService.otherUserData.receivedHugs).toBe(4);
    expect(userPageDOM.querySelector('#rHugsElement').querySelectorAll('.pageData')[0].textContent).toBe('4');
  }));
});
