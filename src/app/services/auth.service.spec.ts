import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { ServiceWorkerModule } from '@angular/service-worker';
import {} from 'jasmine';
import * as Auth0 from "auth0-js";
import { HttpErrorResponse, HttpHeaders, HttpEventType } from "@angular/common/http";

import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { MockAlertsService } from './alerts.service.mock';
import { SWManager } from './sWManager.service';
import { MockSWManager } from './sWManager.service.mock';

class MockAuth0 {
  WebAuth() {

  }

  authorize() {

  }

  checkSession = ({}, cb:Auth0.Auth0Callback<any, Auth0.Auth0Error>): void => {
    const authResult = {
      accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxUm1CQkZqRy1lMDBxNDVKUm1TMiJ9'
    };
    let err:Auth0.Auth0Error | null = null;
    cb(err, authResult);
  }

  parseHash = (_options: Auth0.ParseHashOptions, callback: Auth0.Auth0Callback<Auth0.Auth0DecodedHash, Auth0.Auth0ParseHashError>): void => {
    const authResult:Auth0.Auth0DecodedHash = {
      accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxUm1CQkZqRy1lMDBxNDVKUm1TMiJ9'
    };
    let err:Auth0.Auth0Error = {
      error: ''
    };
    callback(err, authResult);
  }

  logout() {

  }
}

const hash = '#access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxUm1CQkZqRy1lMDBxNDVKUm1TMiJ9&scope=openid%20profile%20email&expires_in=86390&token_type=Bearer&state=1c84KBfutr83655.sOdM~EYpFgEOF9US';

describe('AuthService', () => {
  let httpController: HttpTestingController;
  let authService: AuthService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
        platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ServiceWorkerModule.register('/sw.js', { enabled: false })
      ],
      providers: [
        AuthService,
        { provide: SWManager, useClass: MockSWManager },
        { provide: AlertsService, useClass: MockAlertsService },
        { provide: Auth0, useClass: MockAuth0 }
      ]
    }).compileComponents();

    authService = TestBed.get(AuthService);
    httpController = TestBed.get(HttpTestingController);
  });

  // Check the service is created
  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  // Check login is triggered
  it('login() - should trigger login', () => {
    const authSpy = spyOn(authService.auth0, 'authorize');

    authService.login();

    expect(authSpy).toHaveBeenCalled();
  });

  // Check the hash is checked and parsed
  it('checkHash() - parses the hash to get the token', () => {
    // set up spies
    //@ts-ignore
    const hashSpy = spyOn(authService.auth0, 'parseHash').and.callFake((_options: Auth0.ParseHashOptions, callback: Auth0.Auth0Callback<Auth0.Auth0DecodedHash, Auth0.Auth0ParseHashError>): void => {
      const authResult:Auth0.Auth0DecodedHash = {
        accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxUm1CQkZqRy1lMDBxNDVKUm1TMiJ9'
      };
      let err:Auth0.Auth0Error = {
        error: ''
      };
      callback(err, authResult);
    });
    const parseSpy = spyOn(authService, 'parseJWT').and.returnValue({
      token: 'fdsfd'
    });
    const getDataSpy = spyOn(authService, 'getUserData');

    // call checkHash
    window.location.hash = hash;
    authService.checkHash();

    // check expectations
    expect(hashSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(getDataSpy).toHaveBeenCalledWith({
      token: 'fdsfd'
    });
  });

  // Check getToken is called if there's no token in the hash
  it('checkHash() - calls getToken if there\'s no token in the hash', () => {
    // set up spies
    const parseSpy = spyOn(authService, 'parseJWT');
    const getSpy = spyOn(authService, 'getToken');

    // call checkHash
    window.location.hash = '';
    authService.checkHash();

    expect(parseSpy).not.toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalled();
  });

  // Check the token is parsed correctly
  it('parseJWT() - parses the JWT', () => {
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxUm1CQkZqRy1lMDBxNDVKUm1TMiJ9.eyJpc3MiOiJodHRwczovL2Rldi1zYmFjLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZWQ4ZTNkMGRlZjc1ZDBiZWZiYzdlNTAiLCJhdWQiOlsic2VuZGh1ZyIsImh0dHBzOi8vZGV2LXNiYWMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU5ODYyNzQyNywiZXhwIjoxNTk4NzEzODE3LCJhenAiOiJyZ1pMNEkwNHBlcDNQMkdSSUVWUXREa1djSGp2OXNydSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJwZXJtaXNzaW9ucyI6WyJibG9jazp1c2VyIiwiZGVsZXRlOmFueS1wb3N0IiwiZGVsZXRlOm1lc3NhZ2VzIiwicGF0Y2g6YW55LXBvc3QiLCJwYXRjaDphbnktdXNlciIsInBvc3Q6bWVzc2FnZSIsInBvc3Q6cG9zdCIsInBvc3Q6cmVwb3J0IiwicmVhZDphZG1pbi1ib2FyZCIsInJlYWQ6bWVzc2FnZXMiLCJyZWFkOnVzZXIiXX0.juNfvoBVoC4X8NXSvy8y3byEdTFnGVCZy3_frehLnXV50ehzUC9cl5dHbvQ8mTjK4SaPlHtJPUR4L8lZDt-p6OW0OwjFlPUmkNefmLxyeumTUMKZ-r_MUi3cH0IXssid3GlOAo0fJ1Xv6koyBTHtPLEDBqQAdSH5VnMupMqu1BHvbQSPoyMDQ2P1nkb0cFVX1yh0ApM3dZTJc01Fl55DwW1rD8ECvRncp-Y6h-inNG_rqBvYnxJoTlpwwCenyMdwf7dQ7D-M8Dvr2tmDvRPoVEs40p7WwdqLcFoauyf1t8LHbHyn4HVioFulckZCJRM9J5X-q8JO5GKsD0j45JwWaQ';

    const payload =  authService.parseJWT(token);

    expect(payload['sub']).toBe('auth0|5ed8e3d0def75d0befbc7e50');
    expect(payload['iss']).toBe('https://dev-sbac.auth0.com/');
  });

  // Check the service gets the user's data
  it('getUserData() - gets the user\'s data', () => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        id: 4,
        auth0Id: 'auth0',
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
        jwt: '',
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false
      }
    };

    const jwtPayload = {
      sub: 'auth0'
    };
    const setSpy = spyOn(authService, 'setToken');

    authService.getUserData(jwtPayload);
    // wait for user data to be resolved
    authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        expect(authService.userData.id).toBe(4);
        expect(authService.userData.displayName).toBe('name');
        expect(authService.authenticated).toBeTrue();
        expect(setSpy).toHaveBeenCalled();
      }
    });

    // flush mock response
    const req = httpController.expectOne('http://localhost:5000/users/all/auth0');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  // Check the service triggers user creating if the user doesn't exist
  it('getUserData() - calls createUser() if used doesn\'t exist', () => {
    // mock response
    const mockResponse:HttpErrorResponse = {
      message: '',
      error: {
        message: 'error'
      },
      headers: new HttpHeaders(),
      ok: false,
      status: 404,
      statusText: '',
      url: '',
      type: HttpEventType.Response,
      name: 'HttpErrorResponse'
    };

    const jwtPayload = {
      sub: 'auth0'
    };
    const createSpy = spyOn(authService, 'createUser');

    authService.getUserData(jwtPayload);

    // flush mock response
    const req = httpController.expectOne('http://localhost:5000/users/all/auth0');
    expect(req.request.method).toEqual('GET');
    req.flush(null, mockResponse);

    expect(authService.isUserDataResolved.value).toBeFalse();
    expect(createSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith(jwtPayload);
  });

  // Check the service updates user data if the user just logged in
  it('getUserData() - calls updateUserData() if the user just logged in', () => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        id: 4,
        auth0Id: 'auth0',
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
        jwt: '',
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false
      }
    };

    const jwtPayload = {
      sub: 'auth0'
    };
    const updateSpy = spyOn(authService, 'updateUserData');
    spyOn(authService, 'setToken');

    authService.loggedIn = true;
    authService.getUserData(jwtPayload);

    // flush mock response
    const req = httpController.expectOne('http://localhost:5000/users/all/auth0');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    // wait for user data to be resolved
    authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        expect(updateSpy).toHaveBeenCalled();
      }
    });
  });

  // Check the service gets a token if there's none
  it('getUserData() - calls getToken() if there\'s no saved token', () => {
    const getSpy = spyOn(authService, 'getToken');

    authService.getUserData('');

    expect(getSpy).toHaveBeenCalled();
  });

  // Check a new user is created
  it('createUser() - creates a new user', () => {
    // mock response
    const mockResponse = {
      success: true,
      user: {
        id: 5,
        auth0Id: 'auth0',
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
        jwt: '',
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false
      }
    };

    // check the user is logged out at first
    expect(authService.userData.id).toBe(0);
    expect(authService.authenticated).toBeFalse();

    const jwtPayload = {
      sub: 'auth0'
    };
    authService.createUser(jwtPayload);

    // wait for user data to be resolved
    authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        expect(authService.userData.id).toBe(5);
        expect(authService.userData.auth0Id).toBe('auth0');
        expect(authService.authenticated).toBeTrue();
      }
    });

    // flush mock response
    const req = httpController.expectOne('http://localhost:5000/users');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  // Check logout is triggered
  it('logout() - triggers logout', () => {
    // set the user data as if the user is logged in
    authService.userData = {
      id: 4,
      auth0Id: '',
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: 'admin',
      jwt: '',
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false
    };
    authService.authenticated = true;
    authService.tokenExpired = false;

    const authSpy = spyOn(authService.auth0, 'logout');
    const storageSpy = spyOn(localStorage, 'setItem');

    authService.logout();

    expect(authSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalled();
    expect(authService.userData.id).toBe(0);
  });

  // Check the service sets the token in localStorage
  it('setToken() - sets the token in localStorage', () => {
    authService.token = '!';
    const setSpy = spyOn(localStorage, 'setItem');

    authService.setToken();

    expect(setSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalledWith('ACTIVE_JWT', '!');
  });

  // Check the service gets the token from localStorage
  it('getToken() - gets the token from localStorage', () => {
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue('abcdef');
    const parseSpy = spyOn(authService, 'parseJWT').and.returnValue({
      "exp": 159871381700000
    });
    const getSpy = spyOn(authService, 'getUserData');
    const refreshSpy = spyOn(authService, 'refreshToken');

    authService.getToken();

    expect(storageSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalledWith('abcdef');
    expect(getSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
  });

  // Check the service triggers
  it('getToken() - triggers logout if the token expired', () => {
    const storageSpy = spyOn(localStorage, 'getItem').and.returnValue('abcdef');
    const parseSpy = spyOn(authService, 'parseJWT').and.returnValue({
      "exp": 159871
    });
    const getSpy = spyOn(authService, 'getUserData');
    const refreshSpy = spyOn(authService, 'refreshToken');
    const logoutSpy = spyOn(authService, 'logout');

    authService.getToken();

    expect(storageSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalledWith('abcdef');
    expect(logoutSpy).toHaveBeenCalled();
    expect(authService.tokenExpired).toBeTrue();
    expect(getSpy).not.toHaveBeenCalled();
    expect(refreshSpy).not.toHaveBeenCalled();
  });

  // Check the service refreshes the token
  it('refreshToken() - refreshes the token', () => {
    // set up spies
    const sessionSpy = spyOn(authService.auth0, 'checkSession').and.callFake(({}, cb:Auth0.Auth0Callback<any, Auth0.Auth0Error>): void => {
      const authResult = {
        accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxUm1CQkZqRy1lMDBxNDVKUm1TMiJ9'
      };
      let err:Auth0.Auth0Error | null = null;
      cb(err, authResult);
    });
    const parseSpy = spyOn(authService, 'parseJWT').and.returnValue({
      token: 'fdsfd'
    });
    const getDataSpy = spyOn(authService, 'getUserData');

    // call checkHash
    authService.refreshToken();

    // check expectations
    expect(sessionSpy).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(getDataSpy).toHaveBeenCalledWith({
      token: 'fdsfd'
    });
  });

  // Check the service makes an update request
  it('updateUserData() - updates the user\'s data', () => {
    // mock response
    const mockResponse = {
      success: true,
      updated: {
        id: 4,
        auth0Id: 'auth0',
        displayName: 'name',
        receivedHugs: 2,
        givenHugs: 2,
        postsNum: 2,
        loginCount: 3,
        role: 'admin',
        jwt: '',
        blocked: false,
        releaseDate: undefined,
        autoRefresh: false,
        refreshRate: 20,
        pushEnabled: false
      }
    };

    authService.userData = {
      id: 4,
      auth0Id: 'auth0',
      displayName: 'name',
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 2,
      role: 'admin',
      jwt: '',
      blocked: false,
      releaseDate: undefined,
      autoRefresh: false,
      refreshRate: 20,
      pushEnabled: false
    };
    authService.updateUserData();

    // flush mock response
    const req = httpController.expectOne('http://localhost:5000/users/all/4');
    expect(req.request.method).toEqual('PATCH');
    req.flush(mockResponse);
  });

  // Check the service checks user permissions correctly
  it('canUser() - checks for user permissions', () => {
    authService.token = 'abcdef';
    const parseSpy = spyOn(authService, 'parseJWT').and.returnValue({
      "permissions": [
        "block:user",
        "delete:any-post",
        "delete:messages",
        "patch:any-post",
        "patch:any-user",
        "post:message",
        "post:post",
        "post:report",
        "read:admin-board",
        "read:messages",
        "read:user"
      ]
    });

    const res = authService.canUser('block:user');

    expect(parseSpy).toHaveBeenCalled();
    expect(res).toBeTrue();
  });

  // Check the service returns false if there's no logged in user
  it('canUser() - returns false if the user doesn\'t have permission', () => {
    authService.token = '';

    const res = authService.canUser('block:user');

    expect(res).toBeFalse();
  });

  // Check the service returns false if there's no token
  it('canUser() - returns false if there\'s no saved token', () => {
    authService.token = '';

    const response = authService.canUser('do something');

    expect(response).toBeFalse();
  });
});
