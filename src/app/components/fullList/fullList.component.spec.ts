/*
	Full List
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
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { FullList } from './fullList.component';
import { PopUp } from '../popUp/popUp.component';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { Loader } from '../loader/loader.component';

describe('FullList', () => {
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
        FullList,
        PopUp,
        Loader
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
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    expect(fullList).toBeTruthy();
  });

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    expect(fullList.editMode).toBeFalse();
    expect(fullList.delete).toBeFalse();
    expect(fullList.report).toBeFalse();
  });

  // Check that sending a hug triggers the posts service
  it('should trigger posts service on hug', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const postsService = fullList.postsService;
    const spy = spyOn(postsService, 'sendHug').and.callThrough();

    fixture.detectChanges();
    tick();

    //  before the click
    const fullItems = fullListDOM.querySelector('#fullItems');
    expect(fullList.postsService.fullItemsList.fullNewItems[0].givenHugs).toBe(0);
    expect(fullItems.querySelectorAll('.badge')[0].textContent).toBe('0');
    fixture.detectChanges();

    // simulate click
    fullListDOM.querySelectorAll('.hugButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
    expect(fullList.postsService.fullItemsList.fullNewItems[0].givenHugs).toBe(1);
    expect(fullItems.querySelectorAll('.badge')[0].textContent).toBe('1');
  }));

  // Check that the popup is opened when clicking 'edit'
  it('should open the popup upon editing', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;

    const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // before the click
    expect(fullList.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const fullItems = fullListDOM.querySelector('#fullItems');
    fullItems.querySelectorAll('.editButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(fullList.editMode).toBeTrue();
    expect(fullList.editType).toBe('post');
    expect(fullListDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'delete'
  it('should open the popup upon deleting', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;

    const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // before the click
    expect(fullList.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const fullItems = fullListDOM.querySelector('#fullItems');
    fullItems.querySelectorAll('.deleteButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(fullList.editMode).toBeTrue();
    expect(fullList.delete).toBeTrue();
    expect(fullList.toDelete).toBe('Post');
    expect(fullList.itemToDelete).toBe(1);
    expect(fullListDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check that the popup is opened when clicking 'report'
  it('should open the popup upon reporting', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;

    const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
    const reportSpy = spyOn(fullList, 'reportPost').and.callThrough();
    fixture.detectChanges();
    tick();

    // before the click
    expect(fullList.editMode).toBeFalse();
    expect(fullList.delete).toBeFalse();
    expect(fullList.report).toBeFalse();
    expect(authSpy).toHaveBeenCalled();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    const fullItems = fullListDOM.querySelector('#fullItems');
    fullItems.querySelectorAll('.reportButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(fullList.editMode).toBeTrue();
    expect(fullList.delete).toBeFalse();
    expect(fullList.report).toBeTrue();
    expect(fullList.reportType).toBe('Post');
    expect(reportSpy).toHaveBeenCalled();
    expect(fullListDOM.querySelector('app-pop-up')).toBeTruthy();
  }));

  // Check the posts' menu is shown if there's enough room for them
  it('should show the posts\'s menu if wide enough', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const viewCheckedSpy = spyOn(fullList, 'ngAfterViewChecked').and.callThrough();
    spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // change the elements' width to make sure there's enough room for the menu
    let sub = fullListDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '';
    sub.style.display = 'flex';
    fixture.detectChanges();

    // check all menus are shown
    let posts = fullListDOM.querySelectorAll('.newItem');
    posts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).toContain('hidden');
    })
    expect(viewCheckedSpy).toHaveBeenCalled();
  }));

  // check the posts' menu isn't shown if there isn't enough room for it
  it('shouldn\'t show the posts\'s menu if not wide enough', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const viewCheckedSpy = spyOn(fullList, 'ngAfterViewChecked').and.callThrough();
    spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = fullListDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // check all menus aren't shown
    let posts = fullListDOM.querySelectorAll('.newItem');
    posts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    });
    expect(viewCheckedSpy).toHaveBeenCalled();
  }));

  // check a menu is shown when clickinng the options button
  it('should show the post\'s menu when clicked', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, 'toggleOptions').and.callThrough();
    spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = fullListDOM.querySelectorAll('.newItem')[0]!;
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post
    firstElement.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith(1);
    expect(fullList.showMenuNum).toBe(1);
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
  }));

  // check only the selected menu is shown when clicking a button
  it('should show the correct post\'s menu when clicked', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, 'toggleOptions').and.callThrough();
    spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = fullListDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    const clickElement = fullListDOM.querySelectorAll('.newItem')[1]!;
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(clickElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(clickElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // trigger click
    clickElement.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check only the second post's menu is shown
    let posts = fullListDOM.querySelectorAll('.newItem');
    posts.forEach((element:HTMLLIElement) => {
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
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith(2);
    expect(fullList.showMenuNum).toBe(2);
  }));

  // check that clicking the same menu button again hides it
  it('should hide the post\'s menu when clicked again', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, 'toggleOptions').and.callThrough();
    spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = fullListDOM.querySelectorAll('.newItem')[0]!;
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post
    fullListDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith(1);
    expect(fullList.showMenuNum).toBe(1);
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post again
    fullListDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the menu is hidden
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith(1);
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
  }));

  // check that clicking another menu button also closes the previous one
  // and opens the new one
  it('should hide the previous post\'s menu when another post\'s menu button is clicked', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.debugElement.nativeElement;
    const authService = fullList.authService;
    const toggleSpy = spyOn(fullList, 'toggleOptions').and.callThrough();
    spyOn(authService, 'canUser').and.returnValue(true);
    fixture.detectChanges();
    tick();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = fullListDOM.querySelectorAll('.newItem')[0]!
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(toggleSpy).not.toHaveBeenCalled();
    expect(fullList.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    expect(fullListDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

    // click the options buton for the first new post
    fullListDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith(1);
    expect(fullList.showMenuNum).toBe(1);
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    expect(fullListDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

    // click the options button for another post
    fullListDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();
    tick();

    // check the first post's menu is hidden and the new post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith(2);
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(fullListDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
  }));

  // Check the popup exits when 'false' is emitted
  it('should change mode when the event emitter emits false', fakeAsync(() => {
    const paramMap = TestBed.inject(ActivatedRoute);
    paramMap.url = of([{path: 'New'} as UrlSegment]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const changeSpy = spyOn(fullList, 'changeMode').and.callThrough();

    fixture.detectChanges();
    tick();

    // start the popup
    fullList.lastFocusedElement = document.querySelectorAll('a')[0];
    fullList.editMode = true;
    fullList.delete = true;
    fullList.toDelete = 'Post';
    fullList.itemToDelete = 1;
    fixture.detectChanges();
    tick();

    // exit the popup
    const popup = fixture.debugElement.query(By.css('app-pop-up')).componentInstance as PopUp;
    popup.exitEdit();
    fixture.detectChanges();
    tick();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(fullList.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll('a')[0]);
  }))

  // FULL NEW LIST
  // ==================================================================
  describe('Full New List', () => {
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
          FullList,
          PopUp,
          Loader
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that the type parameter has an affect on the page
    it('has a type determined by the type parameter - new', fakeAsync(() => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'New'} as UrlSegment]);
      const postsService = TestBed.inject(PostsService);
      const newPostsSpy = spyOn(postsService, 'getNewItems').and.callThrough();
      const sugPostsSpy = spyOn(postsService, 'getSuggestedItems').and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;

      fixture.detectChanges();
      tick();

      expect(fullList.waitFor).toBe('new posts');
      expect(newPostsSpy).toHaveBeenCalled();
      expect(sugPostsSpy).not.toHaveBeenCalled();
      expect(postsService.fullItemsList).toBeTruthy();
      expect(postsService.fullItemsList.fullNewItems.length).toBe(2);
      expect(postsService.fullItemsList.fullSuggestedItems.length).toBe(0);
    }));

    // Check that a different page gets different results
    it('changes page when clicked', fakeAsync(() => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'New'} as UrlSegment]);
      const pageSpy = spyOn(paramMap.snapshot.queryParamMap, 'get').and.returnValue('1');
      const newPostsSpy = spyOn(TestBed.inject(PostsService), 'getNewItems').and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;
      const fullListDOM = fixture.nativeElement;
      fixture.detectChanges();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector('#fullItems').children.length).toBe(2);
      expect(newPostsSpy).toHaveBeenCalled();
      expect(newPostsSpy).toHaveBeenCalledTimes(1);

      // change the page
      fullListDOM.querySelectorAll('.nextButton')[0].click();
      fixture.detectChanges();
      tick();

      // expectations for page 2
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(2);
      expect(fullListDOM.querySelector('#fullItems').children.length).toBe(1);
      expect(newPostsSpy).toHaveBeenCalledTimes(2);

      // change the page again
      fullListDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();
      tick();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector('#fullItems').children.length).toBe(2);
      expect(newPostsSpy).toHaveBeenCalledTimes(3);
    }));
  });

  // FULL SUGGESTED LIST
  // ==================================================================
  describe('Full Suggested List', () => {
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
          FullList,
          PopUp,
          Loader
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that the type parameter has an affect on the page
    it('has a type determined by the type parameter - suggested', fakeAsync(() => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Suggested'} as UrlSegment]);
      const postsService = TestBed.inject(PostsService);
      const newPostsSpy = spyOn(postsService, 'getNewItems').and.callThrough();
      const sugPostsSpy = spyOn(postsService, 'getSuggestedItems').and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;

      fixture.detectChanges();
      tick();

      expect(fullList.waitFor).toBe('suggested posts');
      expect(sugPostsSpy).toHaveBeenCalled();
      expect(newPostsSpy).not.toHaveBeenCalled();
      expect(postsService.fullItemsList).toBeTruthy();
      expect(postsService.fullItemsList.fullNewItems.length).toBe(0);
      expect(postsService.fullItemsList.fullSuggestedItems.length).toBe(2);
    }));

    // Check that a different page gets different results
    it('changes page when clicked', fakeAsync(() => {
      // set up spies
      const paramMap = TestBed.inject(ActivatedRoute);
      paramMap.url = of([{path: 'Suggested'} as UrlSegment]);
      const pageSpy = spyOn(paramMap.snapshot.queryParamMap, 'get').and.returnValue('1');
      const sugPostsSpy = spyOn(TestBed.inject(PostsService), 'getSuggestedItems').and.callThrough();

      // create the component
      const fixture = TestBed.createComponent(FullList);
      const fullList = fixture.componentInstance;
      const fullListDOM = fixture.nativeElement;
      fixture.detectChanges();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector('#fullItems').children.length).toBe(2);
      expect(sugPostsSpy).toHaveBeenCalled();
      expect(sugPostsSpy).toHaveBeenCalledTimes(1);

      // change the page
      fullListDOM.querySelectorAll('.nextButton')[0].click();
      fixture.detectChanges();
      tick();

      // expectations for page 2
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(2);
      expect(fullListDOM.querySelector('#fullItems').children.length).toBe(1);
      expect(sugPostsSpy).toHaveBeenCalledTimes(2);

      // change the page
      fullListDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();
      tick();

      // expectations for page 1
      expect(pageSpy).toHaveBeenCalled();
      expect(fullList.page).toBe(1);
      expect(fullListDOM.querySelector('#fullItems').children.length).toBe(2);
      expect(sugPostsSpy).toHaveBeenCalledTimes(3);
    }));
  });
});
