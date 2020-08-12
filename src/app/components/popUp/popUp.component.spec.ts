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
      popUpDOM.querySelector('#adPostText').value = 'hi there';
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
      popUpDOM.querySelector('#adPostText').value = 'hi there';
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
      popUpDOM.querySelector('#adPostText').value = '';
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#adPostText').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // DISPLAY NAME EDIT
  // ==================================================================
  describe('Display Name Edit', () => {
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

    // Check that the user's current display name is shown in the textfield
    it('shows the user\'s current display name', () => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#userEdit')).toBeTruthy();
      expect(popUpDOM.querySelector('#displayName')).toBeTruthy();
      expect(popUpDOM.querySelector('#displayName').value).toBe('name');
    });

    // Check that once the user click's the 'update' button, a request is made to change
    // the user's display name
    it('makes a request to change the display name upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      const updateSpy = spyOn(popUp, 'updateDisplayN').and.callThrough();
      const updateServiceSpy = spyOn(popUp.authService, 'updateUserData').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the user's name
      popUpDOM.querySelector('#displayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check the call is made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(popUp.authService.userData.displayName).toBe('new name');
    }));

    // Check that empty display names are prevented
    it('prevents empty display names', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      const updateSpy = spyOn(popUp, 'updateDisplayN').and.callThrough();
      const updateServiceSpy = spyOn(popUp.authService, 'updateUserData').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the user's name
      popUpDOM.querySelector('#displayName').value = '';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#displayName').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // DISPLAY NAME EDIT - ADMIN PAGE
  // ==================================================================
  describe('Display Name Edit - Admin Page', () => {
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

    // Check that the user's current display name is shown in the textfield
    it('shows the user\'s current display name', () => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };

      fixture.detectChanges();

      expect(popUpDOM.querySelector('#otherUserEdit')).toBeTruthy();
      expect(popUpDOM.querySelector('#uDisplayName')).toBeTruthy();
      expect(popUpDOM.querySelector('#uDisplayName').value).toBe('name');
    });

    // Check that a request is made to the admin service to update the user's
    // display name upon clicking 'update'
    it('makes a request to change the display name upon submitting', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };
      const updateSpy = spyOn(popUp, 'editUser').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editUser').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check the call was made
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
    }));

    // Check that the closeReport boolean is adjusted depending on what the
    // user chose
    it('makes a request to close the report if that\'s what the user chose', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };
      const updateSpy = spyOn(popUp, 'editUser').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editUser').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is true
      const user = {
        userID: 4,
        displayName: 'new name'
      };
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(user, true, 3);

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = 'new name';
      popUpDOM.querySelectorAll('.updateItem')[1].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is false
      expect(updateSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalled();
      expect(updateServiceSpy).toHaveBeenCalledWith(user, false, 3);
    }));

    // Check that empty display names are prevented
    it('prevents empty display names', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toEdit = 'other user';
      popUp.delete = false;
      popUp.report = false;
      popUp.editedItem = {
        id: 4,
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
      };
      popUp.reportData = {
        reportID: 3,
        userID: 4
      };
      const updateSpy = spyOn(popUp, 'editUser').and.callThrough();
      const updateServiceSpy = spyOn(popUp['adminService'], 'editUser').and.callThrough();

      fixture.detectChanges();
      tick();

      // change the display name
      popUpDOM.querySelector('#uDisplayName').value = '';
      popUpDOM.querySelectorAll('.updateItem')[0].click();
      fixture.detectChanges();
      tick();

      // check the empty display name isn't passed on and the user is alerted
      expect(updateSpy).toHaveBeenCalled();
      expect(popUpDOM.querySelectorAll('.alertMessage')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#uDisplayName').classList).toContain('missing');
      expect(updateServiceSpy).not.toHaveBeenCalled();
    }));
  });

  // DELETE
  // ==================================================================
  describe('Item Delete', () => {
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

    // Check that a warning is shown before deleting an item
    it('shows a warning when deleting something', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toDelete = 'Post';
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 2;

      fixture.detectChanges();
      tick();

      expect(popUpDOM.querySelector('#deleteItem')).toBeTruthy();
      expect(popUpDOM.querySelector('#deleteItem').querySelectorAll('.warning')[0]).toBeTruthy();
      expect(popUpDOM.querySelector('#deleteItem').querySelectorAll('.warning')[0].textContent).toContain('This action is irreversible!');
    }));

    // Check that the correct method is called depending on the item that's being deleted
    it('calls the correct method upon confirmation', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.delete = true;
      popUp.report = false;
      const deleteItems = [
        'Post', 'Message', 'Thread', 'All posts', 'All inbox', 'All outbox', 'All threads'
      ];
      const requredArgs = [
        1, [1, 'inbox'], [2, 'thread'], 4, ['All inbox', 4], ['All outbox', 4], ['All threads', 4]
      ];
      let methodSpies = [
        spyOn(popUp['postsService'], 'deletePost').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteMessage').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteThread').and.callThrough(),
        spyOn(popUp['postsService'], 'deleteAllPosts').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteAll').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteAll').and.callThrough(),
        spyOn(popUp['itemsService'], 'deleteAll').and.callThrough()
      ];
      let currentSpy: jasmine.Spy;
      let calledSpies: jasmine.Spy[] = [];

      deleteItems.forEach((item) => {
        // set up the popup
        popUp.toDelete = item;
        popUp.itemToDelete = 1;
        if(popUp.toDelete == 'Message') {
          popUp.messType = 'inbox';
        }
        else if(popUp.toDelete == 'Thread') {
          popUp.messType = 'thread';
        }

        currentSpy = methodSpies.shift()!;
        calledSpies.push(currentSpy);

        popUpDOM.querySelectorAll('.popupDeleteBtn')[0].click();
        fixture.detectChanges();
        tick();

        // check the other spies weren't called
        methodSpies.forEach((spy) => {
          expect(spy).not.toHaveBeenCalled();
        });

        // check the current and previous spies were each called once
        calledSpies.forEach((spy) => {
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    }));

    // Check that a request to close the report is made if the item is deleted from
    // the admin dashboard
    it('makes a request to close the report if that\'s what the user chose - Admin delete', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toDelete = 'ad post';
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 2;
      popUp.reportData = {
        reportID: 4,
        postID: 4
      };
      const deleteSpy = spyOn(popUp, 'deletePost').and.callThrough();
      const deleteServiceSpy = spyOn(popUp['adminService'], 'deletePost').and.callThrough();

      fixture.detectChanges();
      tick();

      // click 'delete and close report'
      popUpDOM.querySelectorAll('.popupDeleteBtn')[0].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is true
      const report = {
        reportID: 4,
        postID: 4
      };
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith(true);
      expect(deleteServiceSpy).toHaveBeenCalled();
      expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, true);

      // click 'delete and close report'
      popUpDOM.querySelectorAll('.popupDeleteBtn')[1].click();
      fixture.detectChanges();
      tick();

      // check that the closeReport boolean is false
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith(false);
      expect(deleteServiceSpy).toHaveBeenCalled();
      expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, false);
    }));

    // Check that the popup is exited and the item isn't deleted if the user picks 'never mind'
    it('should emit false and keep the item if the user chooses not to delete', fakeAsync(() => {
      TestBed.createComponent(AppComponent);
      TestBed.get(AuthService).login();
      const fixture = TestBed.createComponent(PopUp);
      const popUp = fixture.componentInstance;
      const popUpDOM = fixture.nativeElement;
      popUp.toDelete = 'Post';
      popUp.delete = true;
      popUp.report = false;
      popUp.itemToDelete = 2;
      const exitSpy = spyOn(popUp, 'exitEdit').and.callThrough();
      const deleteSpy = spyOn(popUp, 'deleteItem').and.callThrough();

      fixture.detectChanges();
      tick();

      // click the 'never mind button'
      popUpDOM.querySelectorAll('.popupDeleteBtn')[1].click();
      fixture.detectChanges();
      tick();

      // check the exit method was called
      popUp.editMode.subscribe((event:boolean) => {
        expect(event).toBeFalse();
      });
      expect(exitSpy).toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    }));
  });
});
