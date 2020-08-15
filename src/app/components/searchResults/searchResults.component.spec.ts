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

import { AppComponent } from '../../app.component';
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
        ServiceWorkerModule.register('sw.js', { enabled: false })
      ],
      declarations: [
        AppComponent,
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
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(searchResults).toBeTruthy();
  });

  // Check that the component is getting the search query correctly
  it('should get the search query from the URL query param', () => {
    TestBed.createComponent(AppComponent);
    const route = TestBed.get(ActivatedRoute);
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
    TestBed.createComponent(AppComponent);
    const route = TestBed.get(ActivatedRoute);
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
    TestBed.createComponent(AppComponent);
    const route = TestBed.get(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
      if(param == 'query') {
        return 'search';
      }
      else {
        return null;
      }
    });
    const searchSpy = spyOn(TestBed.get(ItemsService), 'sendSearch').and.callThrough();
    TestBed.get(ItemsService).isSearching = false;
    const fixture = TestBed.createComponent(SearchResults);
    const searchResults = fixture.componentInstance;

    expect(searchResults.searchQuery).toBe('search');
    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy).toHaveBeenCalledWith('search');
  });

  // Check that if there's a running search, the search method isn't triggered
  it('shouldn\'t trigger a search if there is one running', () => {
    TestBed.createComponent(AppComponent);
    const route = TestBed.get(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
      if(param == 'query') {
        return 'search';
      }
      else {
        return null;
      }
    });
    const searchSpy = spyOn(TestBed.get(ItemsService), 'sendSearch').and.callThrough();
    TestBed.get(ItemsService).isSearching = true;
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
          ServiceWorkerModule.register('sw.js', { enabled: false })
        ],
        declarations: [
          AppComponent,
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
          ServiceWorkerModule.register('sw.js', { enabled: false })
        ],
        declarations: [
          AppComponent,
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
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
      TestBed.createComponent(AppComponent);
      const route = TestBed.get(ActivatedRoute);
      const paramSpy = spyOn(route.snapshot.queryParamMap, 'get').and.callFake((param: string) => {
        if(param == 'query') {
          return 'search';
        }
        else {
          return null;
        }
      });
      const router = TestBed.get(Router);
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
  });
});
