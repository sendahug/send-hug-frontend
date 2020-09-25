/*
	Main Page
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { By } from '@angular/platform-browser';

// App imports
import { MainPage } from "./mainPage.component";
import { Loader } from '../loader/loader.component';
import { PopUp } from '../popUp/popUp.component';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('MainPage', () => {
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
        MainPage,
        Loader,
        PopUp
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    expect(mainPage).toBeTruthy();
  });

  // Check that the a call to getItems() is made
  it('should get posts via the posts service', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.nativeElement;

    fixture.detectChanges();
    tick();

    expect(mainPage.postsService.newItemsArray.length).toEqual(2);
    expect(mainPageDOM.querySelector('#newItemsList').children.length).toBe(2);
    expect(mainPage.postsService.sugItemsArray.length).toEqual(2);
    expect(mainPageDOM.querySelector('#sugItemsList').children.length).toBe(2);
  }));

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;

    expect(mainPage.editMode).toBeFalse();
    expect(mainPage.delete).toBeFalse();
    expect(mainPage.report).toBeFalse();
  });

  // Check the posts' menu is shown if there's enough room for them
  it('should show the posts\'s menu if wide enough', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const viewCheckedSpy = spyOn(mainPage, 'ngAfterViewChecked').and.callThrough();
    fixture.detectChanges();

    // change the elements' width to make sure there's enough room for the menu
    let sub = mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '';
    sub.style.display = 'flex';
    fixture.detectChanges();

    // check all menus are shown
    let newPosts = mainPageDOM.querySelectorAll('.newItem');
    let sugPosts = mainPageDOM.querySelectorAll('.sugItem');
    // new posts
    newPosts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).toContain('hidden');
    });
    sugPosts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).toContain('hidden');
    });
    expect(viewCheckedSpy).toHaveBeenCalled();
  }));

  // check the posts' menu isn't shown if there isn't enough room for it
  it('shouldn\'t show the posts\'s menu if not wide enough', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const viewCheckedSpy = spyOn(mainPage, 'ngAfterViewChecked').and.callThrough();
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // check all menus aren't shown
    let newPosts = mainPageDOM.querySelectorAll('.newItem');
    let sugPosts = mainPageDOM.querySelectorAll('.sugItem');
    // new posts
    newPosts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    });
    sugPosts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    });
    expect(viewCheckedSpy).toHaveBeenCalled();
  }));

  // check a menu is shown when clickinng the options button
  it('should show the post\'s menu when clicked', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const toggleSpy = spyOn(mainPage, 'toggleOptions').and.callThrough();
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = mainPageDOM.querySelectorAll('.newItem')[0]!;
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(mainPage.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post
    mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith('new', 1);
    expect(mainPage.showMenuNum).toBe('nPost1');
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
  }));

  // check only the selected menu is shown when clicking a button
  it('should show the correct post\'s menu when clicked', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const toggleSpy = spyOn(mainPage, 'toggleOptions').and.callThrough();
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    const clickElement = mainPageDOM.querySelectorAll('.newItem')[1]!;
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(mainPage.showMenuNum).toBeNull();
    expect(clickElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(clickElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // trigger click
    clickElement.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check only the second post's menu is shown
    let newPosts = mainPageDOM.querySelectorAll('.newItem');
    let sugPosts = mainPageDOM.querySelectorAll('.sugItem');

    // new posts
    newPosts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      // if it's the second element, check the menu isn't hidden
      if(element.firstElementChild!.id == 'nPost2') {
        expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      }
      // otherwise check it's hidden
      else {
        expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      }
    });

    // suggested posts
    sugPosts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    });
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith('new', 2);
    expect(mainPage.showMenuNum).toBe('nPost2');
  }));

  // check that clicking the same menu button again hides it
  it('should hide the post\'s menu when clicked again', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const toggleSpy = spyOn(mainPage, 'toggleOptions').and.callThrough();
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = mainPageDOM.querySelectorAll('.newItem')[0]!;
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(mainPage.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post
    mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith('new', 1);
    expect(mainPage.showMenuNum).toBe('nPost1');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post again
    mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the menu is hidden
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith('new', 1);
    expect(mainPage.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
  }));

  // check that clicking another menu button also closes the previous one
  // and opens the new one
  it('should hide the previous post\'s menu when another post\'s menu button is clicked', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const toggleSpy = spyOn(mainPage, 'toggleOptions').and.callThrough();
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = mainPageDOM.querySelectorAll('.newItem')[0]!;
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(mainPage.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.sugItem')[0]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

    // click the options buton for the first new post
    mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith('new', 1);
    expect(mainPage.showMenuNum).toBe('nPost1');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.sugItem')[0]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

    // click the options button for another post
    mainPageDOM.querySelectorAll('.sugItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is hidden and the new post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith('suggested', 2);
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.sugItem')[0]!.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
  }));

  // Check that sending a hug triggers the posts service
  it('should trigger posts service on hug', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const postsService = mainPage.postsService;
    const spy = spyOn(postsService, 'sendHug').and.callThrough();

    fixture.detectChanges();
    tick();

    //  before the click
    const newItems = mainPageDOM.querySelector('#newItemsList');
    expect(mainPage.postsService.newItemsArray[0].givenHugs).toBe(0);
    expect(newItems.querySelectorAll('.badge')[0].textContent).toBe('0');
    fixture.detectChanges();

    // simulate click
    mainPageDOM.querySelectorAll('.hugButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
    expect(mainPage.postsService.newItemsArray[0].givenHugs).toBe(1);
    expect(newItems.querySelectorAll('.badge')[0].textContent).toBe('1');
  }));

  // Check that the popup is opened when clicking 'edit'
  it('should open the popup upon editing', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const authService = mainPage.authService;

    const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // before the click
    expect(mainPage.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const newItems = mainPageDOM.querySelector('#newItemsList');
    newItems.querySelectorAll('.editButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(mainPage.editMode).toBeTrue();
    expect(mainPage.editType).toBe('post');
    expect(mainPageDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'delete'
  it('should open the popup upon deleting', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const authService = mainPage.authService;

    const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // before the click
    expect(mainPage.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const newItems = mainPageDOM.querySelector('#newItemsList');
    newItems.querySelectorAll('.deleteButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(mainPage.editMode).toBeTrue();
    expect(mainPage.delete).toBeTrue();
    expect(mainPage.toDelete).toBe('Post');
    expect(mainPage.itemToDelete).toBe(1);
    expect(mainPageDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'report'
  it('should open the popup upon reporting', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const authService = mainPage.authService;

    const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
    const reportSpy = spyOn(mainPage, 'reportPost').and.callThrough();
    fixture.detectChanges();
    tick();

    // before the click
    expect(mainPage.editMode).toBeFalse();
    expect(mainPage.postToEdit).toBeUndefined();
    expect(mainPage.editType).toBeUndefined();
    expect(mainPage.delete).toBeFalse();
    expect(mainPage.report).toBeFalse();
    expect(mainPage.reportType).toBeUndefined();
    expect(authSpy).toHaveBeenCalled();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    const newItems = mainPageDOM.querySelector('#newItemsList');
    newItems.querySelectorAll('.reportButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(mainPage.editMode).toBeTrue();
    expect(mainPage.postToEdit).toBeUndefined();
    expect(mainPage.editType).toBeUndefined();
    expect(mainPage.delete).toBeFalse();
    expect(mainPage.report).toBeTrue();
    expect(mainPage.reportType).toBe('Post');
    expect(reportSpy).toHaveBeenCalled();
    expect(mainPageDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check the popup exits when 'false' is emitted
  it('should change mode when the event emitter emits false', fakeAsync(() => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const changeSpy = spyOn(mainPage, 'changeMode').and.callThrough();

    fixture.detectChanges();
    tick();

    // start the popup
    mainPage.editMode = true;
    mainPage.delete = true;
    mainPage.toDelete = 'Post';
    mainPage.itemToDelete = 1;
    mainPage.report = false;
    fixture.detectChanges();
    tick();

    // exit the popup
    const popup = fixture.debugElement.query(By.css('app-pop-up')).componentInstance as PopUp;
    popup.exitEdit();
    fixture.detectChanges();
    tick();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(mainPage.editMode).toBeFalse();
  }))
})
