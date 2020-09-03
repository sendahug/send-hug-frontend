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

import { AppComponent } from '../../app.component';
import { FullList } from './fullList.component';
import { PopUp } from '../popUp/popUp.component';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ActivatedRoute } from "@angular/router";
import { Loader } from '../loader/loader.component';
import { of } from 'rxjs';


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
        AppComponent,
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
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(fullList).toBeTruthy();
  });

  // Check that the type parameter has an affect on the page
  it('has a type determined by the type parameter - new', fakeAsync(() => {
    // set up spies
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'New'}]);
    const postsService = TestBed.get(PostsService);
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

  // Check that the type parameter has an affect on the page
  it('has a type determined by the type parameter - suggested', fakeAsync(() => {
    // set up spies
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'Suggested'}]);
    const postsService = TestBed.get(PostsService);
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
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'Suggested'}]);
    const pageSpy = spyOn(paramMap.snapshot.queryParamMap, 'get').and.returnValue('1');

    // create the component
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;
    const fullListDOM = fixture.nativeElement;
    fixture.detectChanges();

    // expectations for page 1
    expect(pageSpy).toHaveBeenCalled();
    expect(fullList.page).toBe(1);
    expect(fullListDOM.querySelector('#fullItems').children.length).toBe(2);

    // change the page
    fullListDOM.querySelectorAll('.nextButton')[0].click();
    fixture.detectChanges();
    tick();

    // expectations for page 2
    expect(pageSpy).toHaveBeenCalled();
    expect(fullList.page).toBe(2);
    expect(fullListDOM.querySelector('#fullItems').children.length).toBe(1);
  }));

  // Check that all the popup-related variables are set to false at first
  it('should have all popup variables set to false', () => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'New'}]);
    const fixture = TestBed.createComponent(FullList);
    const fullList = fixture.componentInstance;

    expect(fullList.editMode).toBeFalse();
    expect(fullList.delete).toBeFalse();
    expect(fullList.report).toBeFalse();
  });

  // Check that sending a hug triggers the posts service
  it('should trigger posts service on hug', fakeAsync(() => {
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'New'}]);
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
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'New'}]);
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
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'New'}]);
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
    TestBed.createComponent(AppComponent);
    const paramMap = TestBed.get(ActivatedRoute);
    paramMap.url = of([{path: 'New'}]);
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
    fullItems.querySelectorAll('.reportButton')[0].click();
    fixture.detectChanges();
    tick();

    // after the click
    expect(fullList.editMode).toBeTrue();
    expect(fullList.delete).toBeFalse();
    expect(fullList.report).toBeTrue();
    expect(fullList.reportType).toBe('Post');
    expect(fullListDOM.querySelector('app-pop-up')).toBeTruthy();
  }));
});
