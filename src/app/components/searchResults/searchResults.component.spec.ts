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
import { ActivatedRoute, Router } from "@angular/router";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { By } from '@angular/platform-browser';

import { SearchResults } from './searchResults.component';
import { PopUp } from '../popUp/popUp.component';
import { Loader } from '../loader/loader.component';
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
        Loader
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

  // Check that the popup variables are set to false
  it('should have all popup variables set to false', () => {
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

    expect(searchResults.editMode).toBeFalse();
    expect(searchResults.delete).toBeFalse();
    expect(searchResults.report).toBeFalse();
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
          Loader
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
    it('should show error message if there are no user results', fakeAsync(() => {
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
      tick();

      expect(searchResultsDOM.querySelector('#userSearchResults')).toBeNull();
      expect(searchResultsDOM.querySelector('#uSearchResErr')).toBeTruthy();
    }));

    // Check that the result list is shown when there are results
    it('should show a list of users with links to their pages', fakeAsync(() => {
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
      tick();

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
    }));
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
          Loader
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
    it('should show error message if there are no post results', fakeAsync(() => {
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
      tick();

      expect(searchResultsDOM.querySelector('#postSearchResults')).toBeNull();
      expect(searchResultsDOM.querySelector('#pSearchResErr')).toBeTruthy();
    }));

    // Check that the result list is shown when there are results
    it('should show a list of posts', fakeAsync(() => {
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
      tick();

      expect(searchResults.itemsService.postSearchResults).toBeTruthy();
      expect(searchResults.itemsService.postSearchResults.length).toBe(1);
      expect(searchResultsDOM.querySelector('#postSearchResults')).toBeTruthy();
      expect(searchResultsDOM.querySelectorAll('.searchResult').length).toBe(1);
      expect(searchResultsDOM.querySelectorAll('.searchResult')[0]).toBeTruthy();
      expect(searchResultsDOM.querySelector('#pSearchResErr')).toBeNull();
    }));

    // Check that the popup is opened when clicking 'edit'
    it('should open the popup upon editing', fakeAsync(() => {
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
      const authService = searchResults.authService;

      const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

      // before the click
      expect(searchResults.editMode).toBeFalse();
      expect(authSpy).toHaveBeenCalled();

      // trigger click
      searchResultsDOM.querySelector('#postSearchResults').querySelectorAll('.editButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(searchResults.editMode).toBeTrue();
      expect(searchResults.editType).toBe('post');
      expect(searchResultsDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that the popup is opened when clicking 'delete'
    it('should open the popup upon deleting', fakeAsync(() => {
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
      const authService = searchResults.authService;

      const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

      // before the click
      expect(searchResults.editMode).toBeFalse();
      expect(authSpy).toHaveBeenCalled();

      // trigger click
      searchResultsDOM.querySelector('#postSearchResults').querySelectorAll('.deleteButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(searchResults.editMode).toBeTrue();
      expect(searchResults.delete).toBeTrue();
      expect(searchResults.toDelete).toBe('Post');
      expect(searchResults.itemToDelete).toBe(7);
      expect(searchResultsDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that the popup is opened when clicking 'report'
    it('should open the popup upon reporting', fakeAsync(() => {
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
      const authService = searchResults.authService;

      const authSpy = spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

      // before the click
      expect(searchResults.editMode).toBeFalse();
      expect(authSpy).toHaveBeenCalled();

      // trigger click
      searchResultsDOM.querySelector('#postSearchResults').querySelectorAll('.reportButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(searchResults.editMode).toBeTrue();
      expect(searchResults.delete).toBeFalse();
      expect(searchResults.report).toBeTrue();
      expect(searchResults.reportType).toBe('Post');
      expect(searchResultsDOM.querySelector('app-pop-up')).toBeTruthy();
    }));

    // Check that sending a hug triggers the posts service
    it('should trigger posts service on hug', fakeAsync(() => {
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
      const postsService = searchResults['postsService'];
      const spy = spyOn(postsService, 'sendHug').and.callThrough();

      fixture.detectChanges();
      tick();

      //  before the click
      expect(searchResults.itemsService.postSearchResults[0].givenHugs).toBe(0);
      expect(searchResultsDOM.querySelector('#postSearchResults').querySelectorAll('.badge')[0].textContent).toBe('0');
      fixture.detectChanges();

      // simulate click
      searchResultsDOM.querySelector('#postSearchResults').querySelectorAll('.hugButton')[0].click();
      fixture.detectChanges();
      tick();

      // after the click
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.count()).toBe(1);
      expect(searchResults.itemsService.postSearchResults[0].givenHugs).toBe(1);
      expect(searchResultsDOM.querySelector('#postSearchResults').querySelectorAll('.badge')[0].textContent).toBe('1');
    }));

    // Check that a different page gets different results
    it('changes page when clicked', fakeAsync(() => {
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
      tick();

      // expectations for page 2
      expect(routeSpy).toHaveBeenCalled();
      expect(searchResults.itemsService.postSearchPage).toBe(2);
      expect(searchResultsDOM.querySelector('#postSearchResults').firstElementChild.children.length).toBe(2);

      // change the page
      searchResultsDOM.querySelectorAll('.prevButton')[0].click();
      fixture.detectChanges();
      tick();

      // expectations for page 1
      expect(routeSpy).toHaveBeenCalledTimes(2);
      expect(searchResults.itemsService.postSearchPage).toBe(1);
      expect(searchResultsDOM.querySelector('#postSearchResults').firstElementChild.children.length).toBe(1);
    }));

    // Check the posts' menu is shown if there's enough room for them
    it('should show the posts\'s menu if wide enough', fakeAsync(() => {
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
      tick();

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
    }));

    // check the posts' menu isn't shown if there isn't enough room for it
    it('shouldn\'t show the posts\'s menu if not wide enough', fakeAsync(() => {
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
      tick();

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
    }));

    // check a menu is shown when clickinng the options button
    it('should show the post\'s menu when clicked', fakeAsync(() => {
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
      const toggleSpy = spyOn(searchResults, 'toggleOptions').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

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
      tick();

      // check the first post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith(7);
      expect(searchResults.showMenuNum).toBe(7);
      expect(firstElement.querySelectorAll('.buttonsContainer')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('float');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    }));

    // check only the selected menu is shown when clicking a button
    it('should show the correct post\'s menu when clicked', fakeAsync(() => {
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
      const toggleSpy = spyOn(searchResults, 'toggleOptions').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

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
      tick();

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
      expect(toggleSpy).toHaveBeenCalledWith(5);
      expect(searchResults.showMenuNum).toBe(5);
    }));

    // check that clicking the same menu button again hides it
    it('should hide the post\'s menu when clicked again', fakeAsync(() => {
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
      const toggleSpy = spyOn(searchResults, 'toggleOptions').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

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
      tick();

      // check the first post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith(7);
      expect(searchResults.showMenuNum).toBe(7);
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');

      // click the options buton for the first new post again
      searchResultsDOM.querySelectorAll('.searchResult')[0]!.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();
      tick();

      // check the menu is hidden
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledTimes(2);
      expect(toggleSpy).toHaveBeenCalledWith(7);
      expect(searchResults.showMenuNum).toBeNull();
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
    }));

    // check that clicking another menu button also closes the previous one
    // and opens the new one
    it('should hide the previous post\'s menu when another post\'s menu button is clicked', fakeAsync(() => {
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
      const toggleSpy = spyOn(searchResults, 'toggleOptions').and.callThrough();
      spyOn(authService, 'canUser').and.returnValue(true);
      fixture.detectChanges();
      tick();

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
      tick();

      // check the first post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledWith(6);
      expect(searchResults.showMenuNum).toBe(6);
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
      expect(firstElement.querySelectorAll('.menuButton')[0].classList).not.toContain('hidden');
      expect(searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.subMenu')[0].classList).toContain('hidden');

      // click the options button for another post
      searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.menuButton')[0].click();
      fixture.detectChanges();
      tick();

      // check the first post's menu is hidden and the new post's menu is shown
      expect(toggleSpy).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalledTimes(2);
      expect(toggleSpy).toHaveBeenCalledWith(5);
      expect(searchResults.showMenuNum).toBe(5);
      expect(firstElement.querySelectorAll('.subMenu')[0].classList).toContain('hidden');
      expect(searchResultsDOM.querySelectorAll('.searchResult')[1]!.querySelectorAll('.subMenu')[0].classList).not.toContain('hidden');
    }));

    // Check the popup exits when 'false' is emitted
    it('should change mode when the event emitter emits false', fakeAsync(() => {
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
      const changeSpy = spyOn(searchResults, 'changeMode').and.callThrough();
      searchResults.itemsService['authService'].login();

      fixture.detectChanges();
      tick();

      // start the popup
      searchResults.lastFocusedElement = document.querySelectorAll('a')[0];
      searchResults.editMode = true;
      searchResults.delete = true;
      searchResults.toDelete = 'Post';
      searchResults.itemToDelete = 2;
      fixture.detectChanges();
      tick();

      // exit the popup
      const popup = fixture.debugElement.query(By.css('app-pop-up')).componentInstance as PopUp;
      popup.exitEdit();
      fixture.detectChanges();
      tick();

      // check the popup is exited
      expect(changeSpy).toHaveBeenCalled();
      expect(searchResults.editMode).toBeFalse();
      expect(document.activeElement).toBe(document.querySelectorAll('a')[0]);
    }))
  });
});
