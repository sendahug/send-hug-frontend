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

// App imports
import { MainPage } from "./mainPage.component";
import { Loader } from '../loader/loader.component';
import { PopUp } from '../popUp/popUp.component';
import { SinglePost } from '../post/post.component';
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
        PopUp,
        SinglePost
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
  it('should get posts via the posts service', (done: DoneFn) => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(mainPage.postsService.newItemsArray.length).toEqual(2);
    expect(mainPageDOM.querySelector('#newItemsList').children.length).toBe(2);
    expect(mainPage.postsService.sugItemsArray.length).toEqual(2);
    expect(mainPageDOM.querySelector('#sugItemsList').children.length).toBe(2);
    done();
  });

  // Check the posts' menu is shown if there's enough room for them
  it('should show the posts\'s menu if wide enough', (done: DoneFn) => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPageDOM = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    // change the elements' width to make sure there's enough room for the menu
    let sub = mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '';
    sub.style.display = 'flex';
    fixture.detectChanges();

    // check all menus are shown
    let posts = mainPageDOM.querySelectorAll('.newItem');
    // new posts
    posts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).toContain('hidden');
    });
    done();
  });

  // check the posts' menu isn't shown if there isn't enough room for it
  it('shouldn\'t show the posts\'s menu if not wide enough', (done: DoneFn) => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPageDOM = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // check all menus aren't shown
    let posts = mainPageDOM.querySelectorAll('.newItem');
    // new posts
    posts.forEach((element:HTMLLIElement) => {
      expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    });
    done();
  });

  // check a menu is shown when clickinng the options button
  it('should show the post\'s menu when clicked', (done: DoneFn) => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const toggleSpy = spyOn(mainPage, 'openMenu').and.callThrough();
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

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith('nPost1');
    expect(mainPage.showMenuNum).toBe('nPost1');
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    done();
  });

  // check that clicking the same menu button again hides it
  it('should hide the post\'s menu when clicked again', (done: DoneFn) => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    const toggleSpy = spyOn(mainPage, 'openMenu').and.callThrough();
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

    // check the first post's menu is shown
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith('nPost1');
    expect(mainPage.showMenuNum).toBe('nPost1');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // click the options buton for the first new post again
    mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();

    // check the menu is hidden
    expect(toggleSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledTimes(2);
    expect(toggleSpy).toHaveBeenCalledWith('nPost1');
    expect(mainPage.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    done();
  });

  // check only the selected menu is shown when clicking a button
  it('should show the correct post\'s menu when clicked', (done: DoneFn) => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    let sub = mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    const clickElement = mainPageDOM.querySelectorAll('.newItem')[1]!;
    expect(mainPage.showMenuNum).toBeNull();
    expect(clickElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(clickElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

    // trigger click
    clickElement.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();

    // check only the second post's menu is shown
    let posts = mainPageDOM.querySelectorAll('.newItem');

    // new posts
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
    expect(mainPage.showMenuNum).toBe('nPost2');
    done();
  });

  // check that clicking another menu button also closes the previous one
  // and opens the new one
  it('should hide the previous post\'s menu when another post\'s menu button is clicked', (done: DoneFn) => {
    spyOn(TestBed.inject(AuthService), 'canUser').and.returnValue(true);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    // change the elements' width to make sure there isn't enough room for the menu
    const firstElement = mainPageDOM.querySelectorAll('.newItem')[0]!;
    let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
    sub.style.maxWidth = '40px';
    sub.style.display = 'flex';
    (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
    fixture.detectChanges();

    // pre-click check
    expect(mainPage.showMenuNum).toBeNull();
    expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

    // click the options buton for the first new post
    mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();

    // check the first post's menu is shown
    expect(mainPage.showMenuNum).toBe('nPost1');
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

    // click the options button for another post
    mainPageDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.menuButton')[0].click();
    fixture.detectChanges();

    // check the first post's menu is hidden and the new post's menu is shown
    expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.newItem')[0]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
    expect(mainPageDOM.querySelectorAll('.newItem')[1]!.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    done();
  });
})
