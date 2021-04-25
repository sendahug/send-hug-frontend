/*
	Search Results
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
import { ActivatedRoute, Router } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SearchResults } from './searchResults.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
import { SinglePost } from '../post/post.component';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';

describe('SearchResults', () => {
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
        SearchResults,
        PopUp,
        Loader,
        SinglePost
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PostsService, useClass: MockPostsService },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;
    expect(searchResults).toBeTruthy();
  });

  // Check that the component is getting the search query correctly
  it('should get the search query from the URL query param', () => {
    const route = TestBed.inject(ActivatedRoute);
    const routeSpy = spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
      if(param == 'query') {
        return 'search';
      }
      else {
        return null;
      }
    });
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;
    const searchResultsDOM = fixture.nativeElement;
    fixture.detectChanges();

    expect(routeSpy).toHaveBeenCalled();
    expect(searchResults.searchQuery).toBe('search');
    expect(searchResultsDOM.querySelector('#resultSummary').textContent).toContain('"search"');
  });

  // Check that a search is triggered if there's no running search
  it('should trigger a search if there\'s no running search', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
      if(param == 'query') {
        return 'search';
      }
      else {
        return null;
      }
    });
    const searchSpy = spyOn(TestBed.inject(ItemsService), 'sendSearch').and.callThrough();
    TestBed.inject(ItemsService).isSearching = false;
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;

    expect(searchResults.searchQuery).toBe('search');
    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalledWith('search');
  });

  // Check that if there's a running search, the search method isn't triggered
  it('shouldn\'t trigger a search if there is one running', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
      if(param == 'query') {
        return 'search';
      }
      else {
        return null;
      }
    });
    const searchSpy = spyOn(TestBed.inject(ItemsService), 'sendSearch').and.callThrough();
    TestBed.inject(ItemsService).isSearching = true;
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;

    expect(searchResults.searchQuery).toBe('search');
    expect(searchSpy).not.toHaveBeenCalled();
  });

  // USER SEARCH RESULTS
  // ==================================================================
  describe('User Results', () => {
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
          SearchResults,
          PopUp,
          Loader,
          SinglePost
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that an error message is shown if there are no results
    it('should show error message if there are no user results', (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.userSearchResults = [];
      searchResults.itemsService.numUserResults = 0;

      fixture.detectChanges();

      expect(searchResultsDOM.querySelector('#userSearchResults')).toBeNull();
      expect(searchResultsDOM.querySelector('#uSearchResErr')).toBeTruthy();
      done();
    });

    // Check that the result list is shown when there are results
    it('should show a list of users with links to their pages', (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'test';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;

      fixture.detectChanges();

      expect(searchResults.itemsService.userSearchResults).toBeTruthy();
      expect(searchResults.itemsService.userSearchResults.length).toBe(2);
      expect(searchResultsDOM.querySelector('#userSearchResults')).toBeTruthy();
      expect(searchResultsDOM.querySelectorAll('.searchResultUser').length).toBe(2);
      searchResultsDOM.querySelectorAll('.searchResultUser').forEach((item: HTMLElement) => {
          expect(item.firstElementChild).toBeTruthy();
          expect(item.firstElementChild!.getAttribute('href')).toContain('/user');
          expect(item.firstElementChild!.textContent).toContain('test');
      });
      expect(searchResultsDOM.querySelector('#uSearchResErr')).toBeNull();
      done();
    });
  });

  // POST SEARCH RESULTS
  // ==================================================================
  describe('Post Results', () => {
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
          SearchResults,
          PopUp,
          Loader,
          SinglePost
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AuthService, useClass: MockAuthService }
        ]
      }).compileComponents();
    });

    // Check that an error message is shown if there are no results
    it('should show error message if there are no post results', (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      searchResults.itemsService.postSearchResults = [];
      searchResults.itemsService.numPostResults = 0;

      fixture.detectChanges();

      expect(searchResultsDOM.querySelector('#postSearchResults')).toBeNull();
      expect(searchResultsDOM.querySelector('#pSearchResErr')).toBeTruthy();
      done();
    });

    // Check that the result list is shown when there are results
    it('should show a list of posts', (done: DoneFn) => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'test';
        }
        else {
          return null;
        }
      });
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;

      fixture.detectChanges();

      expect(searchResults.itemsService.postSearchResults).toBeTruthy();
      expect(searchResults.itemsService.postSearchResults.length).toBe(1);
      expect(searchResultsDOM.querySelector('#postSearchResults')).toBeTruthy();
      expect(searchResultsDOM.querySelectorAll('.searchResult').length).toBe(1);
      expect(searchResultsDOM.querySelectorAll('.searchResult')[0]).toBeTruthy();
      expect(searchResultsDOM.querySelector('#pSearchResErr')).toBeNull();
      done();
    });

    // Check that a different page gets different results
    it('changes page when clicked', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });
      const router = TestBed.inject(Router);
      const routeSpy = spyOn(router, 'navigate');

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      fixture.detectChanges();

      // expectations for page 1
      expect(searchResults.itemsService.postSearchPage).toBe(1);
      expect(searchResultsDOM.querySelector('#postSearchResults').firstElementChild.children.length).toBe(1);

      // change the page
      searchResultsDOM.querySelectorAll('.nextButton')[0].click();
      fixture.detectChanges();

      // expectations for page 2
      expect(routeSpy).toHaveBeenCalled();
      expect(searchResults.itemsService.postSearchPage).toBe(2);
      expect(searchResultsDOM.querySelector('#postSearchResults').firstElementChild.children.length).toBe(2);

      // change the page
      searchResultsDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();

      // expectations for page 1
      expect(routeSpy).toHaveBeenCalledTimes(2);
      expect(searchResults.itemsService.postSearchPage).toBe(1);
      expect(searchResultsDOM.querySelector('#postSearchResults').firstElementChild.children.length).toBe(1);
      done();
    });

    // Check the posts' menu is shown if there's enough room for them
    it('should show the posts\'s menu if wide enough', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      const authService = searchResults.authService;
      const viewCheckedSpy = spyOn(searchResults, 'ngAfterViewChecked').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();

      // change the elements' width to make sure there's enough room for the menu
      let sub = searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
      sub.style.maxWidth = '';
      sub.style.display = 'flex';
      fixture.detectChanges();

      // check all menus are shown
      let posts = searchResultsDOM.querySelectorAll('.searchResult');
      posts.forEach((element:HTMLLIElement) => {
        expect(element.querySelectorAll('.buttonsContainer')[0].classList).not.toContain('float');
        expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
        expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('float');
        expect(element.querySelectorAll('.menuButton')[0].classList).toContain('hidden');
      })
      expect(viewCheckedSpy).toHaveBeenCalled();
      done();
    });

    // check the posts' menu isn't shown if there isn't enough room for it
    it('shouldn\'t show the posts\'s menu if not wide enough', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      const authService = searchResults.authService;
      const viewCheckedSpy = spyOn(searchResults, 'ngAfterViewChecked').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();

      // change the elements' width to make sure there isn't enough room for the menu
      let sub = searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
      sub.style.maxWidth = '40px';
      sub.style.display = 'flex';
      (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
      fixture.detectChanges();

      // check all menus aren't shown
      let posts = searchResultsDOM.querySelectorAll('.searchResult');
      posts.forEach((element:HTMLLIElement) => {
        expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
        expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
        expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
        expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      });
      expect(viewCheckedSpy).toHaveBeenCalled();
      done();
    });

    // check a menu is shown when clickinng the options button
    it('should show the post\'s menu when clicked', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      const authService = searchResults.authService;
      const toggleSpy = spyOn(searchResults, 'openMenu').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();

      // change the elements' width to make sure there isn't enough room for the menu
      const firstElement = searchResultsDOM.querySelectorAll('.searchResult')[0]!;
      let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
      sub.style.maxWidth = '40px';
      sub.style.display = 'flex';
      (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
      fixture.detectChanges();

      // pre-click check
      expect(toggleSpy).not.toHaveBeenCalled();
      expect(searchResults.showMenuNum).toBeNull();
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

      // click the options buton for the first new post
      firstElement.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();

      // check the first post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith('nPost7');
      expect(searchResults.showMenuNum).toBe('nPost7');
      expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      done();
    });

    // check only the selected menu is shown when clicking a button
    it('should show the correct post\'s menu when clicked', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });
      TestBed.inject(ItemsService).postSearchPage = 2;

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      const authService = searchResults.authService;
      const toggleSpy = spyOn(searchResults, 'openMenu').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();

      // change the elements' width to make sure there isn't enough room for the menu
      let sub = searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;
      sub.style.maxWidth = '40px';
      sub.style.display = 'flex';
      (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
      fixture.detectChanges();

      // pre-click check
      const clickElement = searchResultsDOM.querySelectorAll('.searchResult')[1]!;
      expect(toggleSpy).not.toHaveBeenCalled();
      expect(searchResults.showMenuNum).toBeNull();
      expect(clickElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(clickElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

      // trigger click
      clickElement.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();

      // check only the second post's menu is shown
      let posts = searchResultsDOM.querySelectorAll('.searchResult');
      posts.forEach((element:HTMLLIElement) => {
        expect(element.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
        expect(element.querySelectorAll('.subMenu')[0].classList).toContain('float');
        expect(element.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
        // if it's the second element, check the menu isn't hidden
        if(element.firstElementChild!.id == 'nPost5') {
          expect(element.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
        }
        // otherwise check it's hidden
        else {
          expect(element.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
        }
      });
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith('nPost5');
      expect(searchResults.showMenuNum).toBe('nPost5');
      done();
    });

    // check that clicking the same menu button again hides it
    it('should hide the post\'s menu when clicked again', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      const authService = searchResults.authService;
      const toggleSpy = spyOn(searchResults, 'openMenu').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();

      // change the elements' width to make sure there isn't enough room for the menu
      const firstElement = searchResultsDOM.querySelectorAll('.searchResult')[0]!;
      let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
      sub.style.maxWidth = '40px';
      sub.style.display = 'flex';
      (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
      fixture.detectChanges();

      // pre-click check
      expect(toggleSpy).not.toHaveBeenCalled();
      expect(searchResults.showMenuNum).toBeNull();
      expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

      // click the options buton for the first new post
      searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();

      // check the first post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith('nPost7');
      expect(searchResults.showMenuNum).toBe('nPost7');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

      // click the options buton for the first new post again
      searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();

      // check the menu is hidden
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledTimes(2);
      expect(toggleSpy).toHaveBeenCalledWith('nPost7');
      expect(searchResults.showMenuNum).toBeNull();
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      done();
    });

    // check that clicking another menu button also closes the previous one
    // and opens the new one
    it('should hide the previous post\'s menu when another post\'s menu button is clicked', (done: DoneFn) => {
      // set up spies
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });
      TestBed.inject(ItemsService).postSearchPage = 2;

      // create the component
      const fixture = TestBed.createComponent(SearchResults);
      const searchResults = fixture.componentInstance;
      const searchResultsDOM = fixture.debugElement.nativeElement;
      const authService = searchResults.authService;
      const toggleSpy = spyOn(searchResults, 'openMenu').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();

      // change the elements' width to make sure there isn't enough room for the menu
      const firstElement = searchResultsDOM.querySelectorAll('.searchResult')[0]!
      let sub = firstElement.querySelectorAll('.subMenu')[0] as HTMLDivElement;
      sub.style.maxWidth = '40px';
      sub.style.display = 'flex';
      (sub.firstElementChild! as HTMLAnchorElement).style.width = '100px';
      fixture.detectChanges();

      // pre-click check
      expect(toggleSpy).not.toHaveBeenCalled();
      expect(searchResults.showMenuNum).toBeNull();
      expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      expect(searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

      // click the options buton for the first new post
      searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();

      // check the first post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith('nPost6');
      expect(searchResults.showMenuNum).toBe('nPost6');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      expect(searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

      // click the options button for another post
      searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();

      // check the first post's menu is hidden and the new post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledTimes(2);
      expect(toggleSpy).toHaveBeenCalledWith('nPost5');
      expect(searchResults.showMenuNum).toBe('nPost5');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      done();
    });
  });
});
