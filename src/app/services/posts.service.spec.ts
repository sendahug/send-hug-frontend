import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import {} from 'jasmine';

import { PostsService } from './posts.service';
import { AuthService } from './auth.service';
import { MockAuthService } from './auth.service.mock';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';
import { SWManager } from './sWManager.service';
import { MockSWManager } from './sWManager.service.mock';

describe('PostsService', () => {
  let httpController: HttpTestingController;
  let postsService: PostsService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PostsService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertsService, useClass: MockAlertsService },
        { provide: SWManager, useClass: MockSWManager }
      ]
    }).compileComponents();

    postsService = TestBed.get(PostsService);
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(postsService).toBeTruthy();
  });

  // Check the service gets the main page items
  it('getItems() - should get items', () => {
    // mock response
    const mockResponse = {
      success: true,
      recent: [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        },
        {
          'date': new Date('2020-06-28 19:17:31.072'),
          'givenHugs': 0,
          'id':2,
          'text': 'test2',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ],
      suggested: [
        {
          'date': new Date('2020-06-28 19:17:31.072'),
          'givenHugs': 0,
          'id': 2,
          'text': 'test2',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        },
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ]
    };

    postsService.getItems();
    // wait for the fetch to be resolved
    postsService.isMainPageResolved.subscribe((value) => {
      if(value) {
        expect(postsService.newItemsArray.length).toBe(2);
        expect(postsService.newItemsArray[0].id).toBe(1);
        expect(postsService.sugItemsArray.length).toBe(2);
        expect(postsService.sugItemsArray[0].id).toBe(2);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  // Check the service gets the full new items
  it('getNewItems() - should get new items', () => {
    // mock page 1 response
    const mockP1Response = {
      success: true,
      total_pages: 2,
      posts: [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        },
        {
          'date': new Date('2020-06-28 19:17:31.072'),
          'givenHugs': 0,
          'id':2,
          'text': 'test2',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ]
    };

    // mock page 2 response
    const mockP2Response = {
      success: true,
      total_pages: 2,
      posts: [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 3,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ]
    };

    // fetch page 1
    postsService.getNewItems(1);
    // wait for the fetch to be resolved
    postsService.isPostsResolved.fullNewItems.subscribe((value) => {
      if(value) {
        expect(postsService.fullItemsPage.fullNewItems).toBe(1);
        expect(postsService.totalFullItemsPage.fullNewItems).toBe(2);
        expect(postsService.fullItemsList.fullNewItems.length).toBe(2);
        expect(postsService.fullItemsList.fullNewItems[0].id).toBe(1);
      }
    });

    // fetch page 2
    postsService.getNewItems(2);
    // wait for the fetch to be resolved
    postsService.isPostsResolved.fullNewItems.subscribe((value) => {
      if(value) {
        expect(postsService.fullItemsPage.fullNewItems).toBe(2);
        expect(postsService.totalFullItemsPage.fullNewItems).toBe(2);
        expect(postsService.fullItemsList.fullNewItems.length).toBe(1);
        expect(postsService.fullItemsList.fullNewItems[0].id).toBe(3);
      }
    });

    const p1Req = httpController.expectOne('http://localhost:5000/posts/new?page=1');
    expect(p1Req.request.method).toEqual('GET');
    p1Req.flush(mockP1Response);

    const p2Req = httpController.expectOne('http://localhost:5000/posts/new?page=2');
    expect(p2Req.request.method).toEqual('GET');
    p2Req.flush(mockP2Response);
  });

  // Check the service gets the full suggested items
  it('getSuggestedItems() - should get suggested items', () => {
    // mock page 1 response
    const mockP1Response = {
      success: true,
      total_pages: 2,
      posts: [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 1,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        },
        {
          'date': new Date('2020-06-28 19:17:31.072'),
          'givenHugs': 0,
          'id':2,
          'text': 'test2',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ]
    };

    // mock page 2 response
    const mockP2Response = {
      success: true,
      total_pages: 2,
      posts: [
        {
          'date': new Date('2020-06-27 19:17:31.072'),
          'givenHugs': 0,
          'id': 3,
          'text': 'test',
          'userId': 1,
          'user': 'test',
          'sentHugs': []
        }
      ]
    };

    // fetch page 1
    postsService.getSuggestedItems(1);
    // wait for the fetch to be resolved
    postsService.isPostsResolved.fullSuggestedItems.subscribe((value) => {
      if(value) {
        expect(postsService.fullItemsPage.fullSuggestedItems).toBe(1);
        expect(postsService.totalFullItemsPage.fullSuggestedItems).toBe(2);
        expect(postsService.fullItemsList.fullSuggestedItems.length).toBe(2);
        expect(postsService.fullItemsList.fullSuggestedItems[0].id).toBe(1);
      }
    });

    // fetch page 2
    postsService.getSuggestedItems(2);
    // wait for the fetch to be resolved
    postsService.isPostsResolved.fullSuggestedItems.subscribe((value) => {
      if(value) {
        expect(postsService.fullItemsPage.fullSuggestedItems).toBe(2);
        expect(postsService.totalFullItemsPage.fullSuggestedItems).toBe(2);
        expect(postsService.fullItemsList.fullSuggestedItems.length).toBe(1);
        expect(postsService.fullItemsList.fullSuggestedItems[0].id).toBe(3);
      }
    });

    const p1Req = httpController.expectOne('http://localhost:5000/posts/suggested?page=1');
    expect(p1Req.request.method).toEqual('GET');
    p1Req.flush(mockP1Response);

    const p2Req = httpController.expectOne('http://localhost:5000/posts/suggested?page=2');
    expect(p2Req.request.method).toEqual('GET');
    p2Req.flush(mockP2Response);
  });

  // Check the service creates a new post
  it('sendPost() - should send a post', () => {
    // mock response
    const mockResponse = {
      posts: {
        date: "Wed Jun 10 2020 10:30:05 GMT+0300",
        givenHugs: 0,
        id: 10,
        text: "test curl",
        userId: 4,
        user: 'user'
      },
      success: true
    };

    const newPost = {
      userId: 4,
      user: 'name',
      text: 'text',
      date: new Date(),
      givenHugs: 0
    };
    const spy = spyOn(postsService['alertsService'], 'createSuccessAlert');
    postsService['authService'].login();
    postsService.sendPost(newPost);

    const req = httpController.expectOne('http://localhost:5000/posts');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('Your post was published! Return to home page to view the post.', false, '/');
  });

  // Check the service prevents blocked users from sending posts
  it('sendPost() - should prevent blocked users from sending posts', () => {
    const newPost = {
      userId: 4,
      user: 'name',
      text: 'text',
      date: new Date(),
      givenHugs: 0
    };
    const spy = spyOn(postsService['alertsService'], 'createAlert');
    postsService['authService'].login();
    postsService['authService'].userData.blocked = true;
    postsService['authService'].userData.releaseDate = new Date((new Date()).getTime() + 864E5 * 1);
    postsService.sendPost(newPost);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ type: 'Error', message: `You cannot post new posts while you're blocked. You're blocked until ${postsService['authService'].userData.releaseDate}.` });
  });

  // Check the service deletes a post
  it('deletePost() - should delete a post', () => {
    // mock response
    const mockResponse = {
      success: true,
      deleted: 8
    };

    const spy = spyOn(postsService['alertsService'], 'createSuccessAlert');
    postsService.deletePost(8);

    const req = httpController.expectOne('http://localhost:5000/posts/8');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(`Post ${mockResponse.deleted} was deleted. Refresh to view the updated post list.`, true);
  });

  // Check the service deletes all of a user's posts
  it('deleteAllPosts() - should delete all of a user\'s posts', () => {
    // mock response
    const mockResponse = {
      deleted: 2,
      success: true,
      userID: 4
    };

    const spy = spyOn(postsService['alertsService'], 'createSuccessAlert');
    postsService.deleteAllPosts(4);

    const req = httpController.expectOne('http://localhost:5000/users/all/4/posts');
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(`User ${mockResponse.userID}'s posts were deleted successfully. Refresh to view the updated profile.`, true);
  });

  // Check the service edits a post
  it('editPost() - should edit a post', () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        date: "Mon, 08 Jun 2020 14:43:15 GMT",
        givenHugs: 0,
        id: 15,
        text: "test curl",
        userId: 4,
        user: 'name'
      }
    };

    const newPost = {
      date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
      givenHugs: 0,
      id: 15,
      text: "test curl",
      userId: 4,
      user: 'name'
    };
    const spy = spyOn(postsService['alertsService'], 'createSuccessAlert');
    postsService.editPost(newPost);
    // wait for the edit to be resolved
    postsService.isUpdated.subscribe((value) => {
      if(value) {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith('Your post was edited. Refresh to view the updated post.', true);
      }
    });

    const req = httpController.expectOne('http://localhost:5000/posts/15');
    expect(req.request.method).toEqual('PATCH');
    req.flush(mockResponse);
  });

  // Check the service sends a hug
  it('sendHug() - should send a hug', () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        date: "Mon, 08 Jun 2020 14:43:15 GMT",
        givenHugs: 1,
        id: 15,
        text: "test curl",
        userId: 4,
        user: 'name'
      }
    };

    const newPost = {
      date: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
      givenHugs: 0,
      id: 15,
      text: "test curl",
      userId: 4,
      user: 'name'
    };
    const alertSpy = spyOn(postsService['alertsService'], 'createSuccessAlert');
    const disableSpy = spyOn(postsService, 'disableHugButton');
    postsService.sendHug(newPost);

    const req = httpController.expectOne('http://localhost:5000/posts/15');
    expect(req.request.method).toEqual('PATCH');
    req.flush(mockResponse);

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Your hug was sent!', false);
    expect(disableSpy).toHaveBeenCalled();
    expect(disableSpy).toHaveBeenCalledTimes(4);
  });

  // Check the service disables the relevant hug button
  it('disableHugButton() - should disable the relevant hug button', () => {

  });
});
