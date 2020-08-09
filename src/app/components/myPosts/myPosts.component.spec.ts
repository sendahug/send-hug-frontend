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
import { MyPosts } from './myPosts.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
import { UserPage } from '../userPage/userPage.component';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';

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
        ServiceWorkerModule.register('sw.js')
      ],
      declarations: [
        AppComponent,
        UserPage,
        MyPosts,
        PopUp,
        Loader
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
    const upFixture = TestBed.createComponent(UserPage);
    const userPage = upFixture.componentInstance;
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(userPage).toBeTruthy();
    expect(myPosts).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    TestBed.createComponent(AppComponent);
    TestBed.createComponent(UserPage);
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;

    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeFalse();
  });

  // Check that the component gets the user ID correctly
  it('should get the correct user ID', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const userPage = TestBed.createComponent(UserPage).componentInstance;
    userPage.userId = 1;
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;

    expect(myPosts.userID).toBe(1);
    expect(myPosts.user).toBe('other');
  }));

  // Check that the popup gets the correct user's posts
  it('should get the correct user\'s posts', fakeAsync(() => {
    const itemsService = TestBed.get(ItemsService);
    const getPostsSpy = spyOn(itemsService, 'getUserPosts').and.callThrough();
    TestBed.createComponent(AppComponent);
    const userPage = TestBed.createComponent(UserPage).componentInstance;
    userPage.userId = 1;
    let fixture = TestBed.createComponent(MyPosts);
    let myPosts = fixture.componentInstance;
    let myPostsDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    // expectations for another user
    expect(getPostsSpy).toHaveBeenCalled();
    expect(getPostsSpy).toHaveBeenCalledWith(1);
    expect(myPosts.itemsService.userPosts.other.length).toBe(5);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(5);
    expect(myPosts.itemsService.userPosts.self.length).toBe(0);

    // reset the 'other' array to set the service up for another call
    myPosts.itemsService.userPosts.other = [];
    userPage.userId = 4;
    fixture = TestBed.createComponent(MyPosts);
    myPosts = fixture.componentInstance;
    myPostsDOM = fixture.nativeElement;

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
    TestBed.createComponent(UserPage);
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    const myPostsDOM = fixture.debugElement.nativeElement;
    const editSpy = spyOn(myPosts, 'editPost').and.callThrough();

    fixture.detectChanges();
    tick();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(editSpy).not.toHaveBeenCalled();

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
    TestBed.createComponent(UserPage);
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    const myPostsDOM = fixture.debugElement.nativeElement;
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
    TestBed.createComponent(UserPage);
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    const myPostsDOM = fixture.debugElement.nativeElement;
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
    const userPage = TestBed.createComponent(UserPage).componentInstance;
    userPage.userId = 1;
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    const myPostsDOM = fixture.debugElement.nativeElement;
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
    const userPage = TestBed.createComponent(UserPage).componentInstance;
    userPage.userId = 1;
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    const myPostsDOM = fixture.debugElement.nativeElement;
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
    const userPage = TestBed.createComponent(UserPage).componentInstance;
    userPage.userId = 1;
    const fixture = TestBed.createComponent(MyPosts);
    const myPosts = fixture.componentInstance;
    const myPostsDOM = fixture.debugElement.nativeElement;
    const nextPageSpy = spyOn(myPosts, 'nextPage').and.callThrough();
    const prevPageSpy = spyOn(myPosts, 'prevPage').and.callThrough();
    const getPostsSpy = spyOn(myPosts.itemsService, 'getUserPosts').and.callThrough();
    fixture.detectChanges();

    // expectations for page 1
    expect(nextPageSpy).not.toHaveBeenCalled();
    expect(prevPageSpy).not.toHaveBeenCalled();
    expect(getPostsSpy).toHaveBeenCalledTimes(1);
    expect(myPosts.itemsService.userPostsPage.other).toBe(1);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(5);

    // change the page
    myPostsDOM.querySelectorAll('.nextButton')[0].click();
    fixture.detectChanges();
    tick();

    // expectations for page 2
    expect(nextPageSpy).toHaveBeenCalled();
    expect(prevPageSpy).not.toHaveBeenCalled();
    expect(getPostsSpy).toHaveBeenCalledTimes(2);
    expect(myPosts.itemsService.userPostsPage.other).toBe(2);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(2);

    // change the page
    myPostsDOM.querySelectorAll('.prevButton')[0].click();
    fixture.detectChanges();
    tick();

    // expectations for page 1 (again)
    expect(prevPageSpy).toHaveBeenCalled();
    expect(nextPageSpy).toHaveBeenCalledTimes(1);
    expect(getPostsSpy).toHaveBeenCalledTimes(3);
    expect(myPosts.itemsService.userPostsPage.other).toBe(1);
    expect(myPostsDOM.querySelectorAll('.itemList')[0].children.length).toBe(5);
  }));
});
