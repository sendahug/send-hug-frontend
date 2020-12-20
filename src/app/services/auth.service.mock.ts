/*
	Auth Service
	Send a Hug Mock Service
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

// Angular imports
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

// Other essential imports
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  readonly serverUrl = environment.backend.domain;
  // authentication information
  token: string = '';
  authHeader: HttpHeaders = new HttpHeaders;
  authenticated: boolean = false;

  public get getAuthenticated() : boolean {
    return this.authenticated;
  }

  public set getAuthenticated(v : boolean) {
    this.authenticated = v;
  }

  // user data
  userProfile: any;
  userData: User = {
    id: 0,
    auth0Id: '',
    displayName: '',
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    loginCount: 0,
    role: '',
    jwt: '',
    blocked: false,
    releaseDate: undefined,
    autoRefresh: false,
    refreshRate: 20,
    pushEnabled: false,
    selectedIcon: '',
    iconColours: {
      character: '',
      lbg: '',
      rbg: '',
      item: ''
    }
  }
  // documents whether the user just logged in or they're still logged in following
  // their previous login
  loggedIn = false;
  tokenExpired = false;
  isUserDataResolved = new BehaviorSubject(false);

  // CTOR
  constructor(
  ) {

  }

  /*
  Function Name: login()
  Function Description: Activates Auth0 login/authorize.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  login() {
    this.checkHash();
  }

  /*
  Function Name: checkHash()
  Function Description: Checks the URL hash for a token.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkHash() {
    this.getUserData('');
  }

  /*
  Function Name: parseJWT()
  Function Description: Parse the token payload.
  Parameters: token (string) - A string containing the JWT.
  ----------------
  Programmer: Shir Bar Lev.
  */
  parseJWT(token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  /*
  Function Name: getUserData()
  Function Description: Sends a request to the server to get the user's data.
                        Since getting a user's data requires permissions, a success
                        response to this request means the JWT is valid and verified,
                        so the user has successfully authenticated.
  Parameters: jwtPayload (any) - The JWT payload.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getUserData(jwtPayload:any) {
    this.userData = {
      id: 4,
      auth0Id: jwtPayload,
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
      pushEnabled: false,
      selectedIcon: 'kitty',
      iconColours: {
        character: '#BA9F93',
        lbg: '#e2a275',
        rbg: '#f8eee4',
        item: '#f4b56a'
      }
    }
    // set the authentication-variables accordingly
    this.authenticated = true;
    this.authHeader = new HttpHeaders({'Authorization': `Bearer ${this.token}`});
    this.setToken();
    this.isUserDataResolved.next(true);
    this.tokenExpired = false;

    // if the user just logged in, update the login count
    if(this.loggedIn) {
      this.updateUserData();
    }
  }

  /*
  Function Name: logout()
  Function Description: Activates Auth0 logout.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  logout() {
    return 'logged out!'
  }

  /*
  Function Name: setToken()
  Function Description: Sets the token in local storage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setToken() {
    return 'set'!
  }

  /*
  Function Name: updateUserData()
  Function Description: Sends a request to the server to update the login count
                        and display name in the database.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateUserData() {
    this.userData.loginCount += 1;
  }

  /*
  Function Name: canUser()
  Function Description: Check whether the user has permission to perform an action.
  Parameters: permission (string) - The required permission.
  ----------------
  Programmer: Shir Bar Lev.
  */
  canUser(permission: string) {
    const permissions = [
    "delete:any-post",
    "delete:messages",
    "patch:any-post",
    "patch:any-user",
    "post:message",
    "post:post",
    "read:messages",
    "read:user",
    "read:admin-board"
  ]
    // if there's an active token, check the logged in user's permissions
    if(this.token) {
      let canUserDo:boolean;

      // if it's within the user's permissions, return true;
      // otherwise return false
      canUserDo = permissions.includes(permission)
      return canUserDo;
    }
    // if there isn't, no user is logged in, so of course there's no permission
    else {
      return false;
    }
  }
}
