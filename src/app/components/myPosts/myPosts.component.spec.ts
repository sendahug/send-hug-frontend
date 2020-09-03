/*
	My Posts
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
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from '../../app.component';
import { MyPosts } from './myPosts.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
import { HeaderMessage } from '../headerMessage/headerMessage.component';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Mock User Page for testing the sub-component
// ==================================================
@Component({
  selector: 'app-user-mock',
  template: `
  <!-- If the user is logged in, displays a user page. -->
  <div *ngIf="authService.authenticated" id="profileContainer">
  		<app-my-posts
  					  [userID]="userId"></app-my-posts>
  </div>

  <!-- If the user isn't logged in, prompts the user to log in. -->
  <div  id="loginBox" *ngIf="!authService.authenticated">
  	<div class="errorMessage">You are not currently logged in. To view user information, log in.</div>

  	<button id="logIn" class="appButton" (click)="login()">Login</button>
  </div>
  `
})
class MockUserPage {
  waitFor = "user";
  userId: number | undefined;
  userDataSubscription:Subscription | undefined;

  constructor(
    private route:ActivatedRoute,
    public authService: AuthService,
    public itemsService:ItemsService,
    private postsService:PostsService
  ) {
    this.authService.checkHash();

    // if there's a user ID, set the user ID to it
    if(this.route.snapshot.paramMap.get('id')) {
      this.userId = Number(this.route.snapshot.paramMap.get('id'));
      // If the user ID from the URL params is different than the logged in
      // user's ID, the user is trying to view another user's profile
      if(this.userId != this.authService.userData.id) {
        this.itemsService.isOtherUser = true;
        this.waitFor = 'other user';
        // set the userDataSubscription to the subscription to isUserDataResolved
        this.userDataSubscription = this.authService.isUserDataResolved.subscribe((value) => {
          // if the user is logged in, fetch the profile of the user whose ID
          // is used in the URL param
          if(value == true) {
            this.itemsService.getUser(this.userId!);
            // also unsubscribe from this to avoid sending the same request
            // multiple times
            if(this.userDataSubscription) {
              this.userDataSubscription.unsubscribe();
            }
          }
        });
      }
      // otherwise they're trying to view their own profile
      else {
        this.itemsService.isOtherUser = false;
        this.waitFor = 'user';
      }
    }
    else {
      this.itemsService.isOtherUser = false;
      this.waitFor = 'user';
    }

  }
}

// Sub-component testing
// ==================================================
describe('MyPosts', () => {
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
        MockUserPage,
        MyPosts,
        PopUp,
        Loader,
        HeaderMessage
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PostsService, useClass: MockPostsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    expect(appComponent).toBeTruthy();
    expect(userPage).toBeTruthy();
    expect(myPosts).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    TestBed.createComponent(AppComponent);
    const upFixture = TestBed.createComponent(MockUserPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeFalse();
  });

  // Check that the component gets the user ID correctly
  it('should get the correct user ID', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const upFixture = TestBed.createComponent(MockUserPage);
    const userPage = upFixture.componentInstance;
    userPage.userId = 1;
    upFixture.detectChanges();
    tick();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.userID).toBe(1);
    expect(myPosts.user).toBe('other');
  }));

  // Check that the popup gets the correct user's posts
  it('should get the correct user\'s posts', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    let pathSpy = spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    let itemsService = TestBed.get(ItemsService) as ItemsService;
    let getPostsSpy = spyOn(itemsService, 'getUserPosts').and.callThrough();
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;

    fixture.detectChanges();
    tick();

    // expectations for another user
    expect(getPostsSpy).toHaveBeenCalled();
    expect(getPostsSpy).toHaveBeenCalledWith(1);
    expect(myPosts.itemsService.userPosts.other.length).toBe(5);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(5);

    // reset the testing environment
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
        MockUserPage,
        MyPosts,
        PopUp,
        Loader,
        HeaderMessage
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PostsService, useClass: MockPostsService }
      ]
    }).compileComponents();

    TestBed.createComponent(AppComponent);
    pathSpy.and.returnValue('4');
    itemsService = TestBed.get(ItemsService) as ItemsService;
    getPostsSpy = spyOn(itemsService, 'getUserPosts').and.callThrough();
    itemsService['authService'].login();
    fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;

    fixture.detectChanges();
    tick();

    // expectations for the logged in user
    expect(getPostsSpy).toHaveBeenCalledWith(4);
    expect(myPosts.itemsService.userPosts.other.length).toBe(0);
    expect(myPosts.itemsService.userPosts.self.length).toBe(2);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(2);
  }));

  // Check that the popup is opened when clicking 'edit'
  it('should open the popup upon editing', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const itemsService = TestBed.get(ItemsService) as ItemsService;
    const getSpy = spyOn(itemsService, 'getUserPosts').and.callThrough();
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const editSpy = spyOn(myPosts, 'editPost').and.callThrough();
    fixture.detectChanges();
    tick();

    // before the click
    expect(getSpy).toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledWith(4);
    expect(myPosts.user).toBe('self');
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.userID).toBe(4);
    expect(editSpy).not.toHaveBeenCalled();

    fixture.detectChanges();
    tick();

    expect(myPosts.itemsService.userPosts.self.length).toBe(2)
    expect(myPostsDOM.querySelectorAll('.userPost')[0]).toBeTruthy();

    // trigger click
    myPostsDOM.querySelectorAll('.editButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.editType).toBe('post');
    expect(myPostsDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'delete'
  it('should open the popup upon deleting', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const itemsService = TestBed.get(ItemsService) as ItemsService;
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const deleteSpy = spyOn(myPosts, 'deletePost').and.callThrough();

    fixture.detectChanges();
    tick();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.delete).toBeFalse();
    expect(deleteSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelectorAll('.deleteButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.delete).toBeTrue();
    expect(myPosts.toDelete).toBe('Post');
    expect(myPosts.itemToDelete).toBe(7);
    expect(myPostsDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'delete all'
  it('should open the popup upon deleting all', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('4');
    const itemsService = TestBed.get(ItemsService) as ItemsService;
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const deleteSpy = spyOn(myPosts, 'deleteAllPosts').and.callThrough();

    fixture.detectChanges();
    tick();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.delete).toBeFalse();
    expect(deleteSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelector('#deleteAll').click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.delete).toBeTrue();
    expect(myPosts.toDelete).toBe('All posts');
    expect(myPosts.itemToDelete).toBe(myPosts.authService.userData.id);
    expect(myPostsDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'report'
  it('should open the popup upon reporting', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    const itemsService = TestBed.get(ItemsService) as ItemsService;
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const reportSpy = spyOn(myPosts, 'reportPost').and.callThrough();

    fixture.detectChanges();
    tick();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.report).toBeFalse();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    myPostsDOM.querySelectorAll('.reportButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeTrue();
    expect(myPosts.reportType).toBe('Post');
    expect(myPostsDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that sending a hug triggers the posts service
  it('should trigger posts service on hug', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    const itemsService = TestBed.get(ItemsService) as ItemsService;
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const hugSpy = spyOn(myPosts, 'sendHug').and.callThrough();
    const hugServiceSpy = spyOn(myPosts['postsService'], 'sendHug').and.callThrough();

    fixture.detectChanges();
    tick();

    //  before the click
    expect(myPosts.itemsService.userPosts.other[0].givenHugs).toBe(1);
    expect(myPostsDOM.querySelectorAll('.badge')[0].textContent).toBe('1');
    fixture.detectChanges();

    // simulate click
    myPostsDOM.querySelectorAll('.hugButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(hugSpy).toHaveBeenCalled();
    expect(hugSpy).toHaveBeenCalledWith(1);
    expect(hugServiceSpy).toHaveBeenCalled();
    expect(myPosts.itemsService.userPosts.other[0].givenHugs).toBe(2);
    expect(myPostsDOM.querySelectorAll('.badge')[0].textContent).toBe('2');
  }));

  // Check that a different page gets different results
  it('changes page (with its associated posts) when clicked', fakeAsync(() => {
    // create the component
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    spyOn(paramMap.snapshot.paramMap, 'get').and.returnValue('1');
    const itemsService = TestBed.get(ItemsService) as ItemsService;
    const getPostsSpy = spyOn(itemsService, 'getUserPosts').and.callThrough();
    itemsService['authService'].login();
    let fixture = TestBed.createComponent(MockUserPage);
    fixture.detectChanges();
    tick();
    let myPosts = fixture.debugElement.children[0].children[0].componentInstance;
    let myPostsDOM = fixture.debugElement.children[0].children[0].nativeElement;
    const nextPageSpy = spyOn(myPosts, 'nextPage').and.callThrough();
    const prevPageSpy = spyOn(myPosts, 'prevPage').and.callThrough();
    fixture.detectChanges();

    // expectations for page 1
    expect(nextPageSpy).not.toHaveBeenCalled();
    expect(prevPageSpy).not.toHaveBeenCalled();
    // Explanation: getPosts is actually called TWICE even on the first profile
    // page view - once as a result of AuthService's login (which calls getPosts), and
    // once as a result of viewing a user's profile page
    expect(getPostsSpy).toHaveBeenCalledTimes(2);
    expect(myPosts.itemsService.userPostsPage.other).toBe(1);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(5);

    // change the page
    myPostsDOM.querySelectorAll('.nextButton')[0].click();
    fixture.detectChanges();
    tick();

    // expectations for page 2
    expect(nextPageSpy).toHaveBeenCalled();
    expect(prevPageSpy).not.toHaveBeenCalled();
    expect(getPostsSpy).toHaveBeenCalledTimes(3);
    expect(myPosts.itemsService.userPostsPage.other).toBe(2);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(2);

    // change the page
    myPostsDOM.querySelectorAll('.prevButton')[0].click();
    fixture.detectChanges();
    tick();

    // expectations for page 1 (again)
    expect(prevPageSpy).toHaveBeenCalled();
    expect(nextPageSpy).toHaveBeenCalledTimes(1);
    expect(getPostsSpy).toHaveBeenCalledTimes(4);
    expect(myPosts.itemsService.userPostsPage.other).toBe(1);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(5);
  }));
});
