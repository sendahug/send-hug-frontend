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

// App imports
import { AppComponent } from '../../app.component';
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
        ServiceWorkerModule.register('sw.js', { enabled: false })
      ],
      declarations: [
        AppComponent,
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
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(mainPage).toBeTruthy();
  });

  // Check that the a call to getItems() is made
  it('should get posts via the posts service', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
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
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;

    expect(mainPage.editMode).toBeFalse();
    expect(mainPage.delete).toBeFalse();
    expect(mainPage.report).toBeFalse();
  });

  // Check that sending a hug triggers the posts service
  it('should trigger posts service on hug', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
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
    fixture.detectChanges();
    tick();

    // before the click
    expect(mainPage.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const newItems = mainPageDOM.querySelector('#newItemsList');
    newItems.querySelectorAll('.reportButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(mainPage.editMode).toBeTrue();
    expect(mainPage.delete).toBeFalse();
    expect(mainPage.report).toBeTrue();
    expect(mainPage.reportType).toBe('Post');
    expect(mainPageDOM.querySelector('app-pop-up')).toBeTruthy();
  }));
})
