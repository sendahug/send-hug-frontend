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
import { PopUp } from './popUp.component';
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';
import { ItemsService } from '../../services/items.service';
import { MockItemsService } from '../../services/items.service.mock';
import { PostsService } from '../../services/posts.service';
import { MockPostsService } from '../../services/posts.service.mock';
import { AdminService } from '../../services/admin.service';
import { MockAdminService } from '../../services/admin.service.mock';
import { AlertsService } from '../../services/alerts.service';
import { MockAlertsService } from '../../services/alerts.service.mock';

describe('Popup', () => {
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
        PopUp
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AdminService, useClass: MockAdminService },
        { provide: AlertsService, useClass: MockAlertsService }
      ]
    }).compileComponents();
  });

  // Check that the component is created
  it('should create the component', () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(popUp).toBeTruthy();
  });

  // POST EDIT
  // ==================================================================
  describe('Post Edit', () => {
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
          PopUp
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the popup shows the post's text and author
    it('shows the post\'s text and writer', () => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelectorAll('form')[0].id).toBe('postEdit');
      expect(popUpDOM.querySelector('#postEdit').querySelectorAll('.pageData')[0].textContent).toBe('me');
      expect(popUpDOM.querySelector('#postText').value).toBe('hi');
    });

    // Check that upon confirming a requset is made to the PostsService
    it('makes a request to change the post text upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };
      const updateSpy = spyOn(popUp, 'updatePost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['postsService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#postText').value = 'hello there';
      fixture.detectChanges();
      tick();

      // check the request is made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
    }));

    // Check that saving the edited post is prevented if the post is empty
    it('prevents empty posts', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };
      const updateSpy = spyOn(popUp, 'updatePost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['postsService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#postText').value = '';
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#postText').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));

    // Check that the event emitter emits false if the user clicks 'exit'
    it('exits the popup if the user decides not to edit', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 1,
        userId: 4,
        user: 'me',
        text: 'hi',
        date: new Date(),
        givenHugs: 0,
        sentHugs: []
      };
      const exitSpy = spyOn(popUp, 'exitEdit').and.callThrough();
      fixture.detectChanges();

      // click the exit button
      popUpDOM.querySelector('#exitButton').click();
      fixture.detectChanges();
      tick();

      popUp.editMode.subscribe((event:boolean) => {
        expect(event).toBeFalse();
      });
      expect(exitSpy).toHaveBeenCalled();
    }));
  });

  // POST EDIT - ADMIN PAGE
  // ==================================================================
  describe('Post Edit - Admin Page', () => {
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
          PopUp
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: PostsService, useClass: MockPostsService },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AdminService, useClass: MockAdminService },
          { provide: AlertsService, useClass: MockAlertsService }
        ]
      }).compileComponents();
    });

    // Check that the post's text is shown
    it('shows the post text', () => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelectorAll('form')[0].id).toBe('adPostEdit');
      expect(popUpDOM.querySelector('#adPostText').value).toBe('hi');
    });

    // Check that a request is made to the AdminService upon clicking 'update'
    it('makes a request to change the post text upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const updateSpy = spyOn(popUp, 'editPost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editPost').and.callThrough();

      fixture.detectChanges();

      // change the post's text
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check the request is made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
    }));

    //
    it('makes a request to close the report if that\'s what the user chose', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const updateSpy = spyOn(popUp, 'updatePost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#postText').value = 'hi there';
      popUpDOM.querySelectorAll('.sendData')[0].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is true
      const post = {
        text: 'hi there',
        id: 5
      };
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(post, true, 2);

      // change the post's text
      popUpDOM.querySelector('#postText').value = 'hi there';
      popUpDOM.querySelectorAll('.sendData')[1].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is false
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(post, false, 2);
    }));

    // Check that saving the edited post is prevented if the post is empty
    it('prevents empty posts', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const updateSpy = spyOn(popUp, 'updatePost').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editPost').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the post's text
      popUpDOM.querySelector('#postText').value = '';
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#postText').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));

    // Check that the event emitter emits false if the user clicks 'exit'
    it('exits the popup if the user decides not to edit', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'admin post';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = 'hi';
      popUp.reportData = {
        reportID: 1,
        postID: 2
      };
      const exitSpy = spyOn(popUp, 'exitEdit').and.callThrough();
      fixture.detectChanges();

      // click the exit button
      popUpDOM.querySelector('#exitButton').click();
      fixture.detectChanges();
      tick();

      popUp.editMode.subscribe((event:boolean) => {
        expect(event).toBeFalse();
      });
      expect(exitSpy).toHaveBeenCalled();
    }));
  });
});
