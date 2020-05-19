import { Injectable } from '@angular/core';
import * as Auth0 from 'auth0-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Auth0 variable
  auth0 = new Auth0.WebAuth({
    clientID: '',
    domain: '',
    responseType: 'token',
    redirectUri: '',
    audience: '',
    scope: ''
  })

  userProfile: any;
  token: string = '';
  authenticated: boolean = false;

  constructor() {

  }

  // Handles login redirect and authorise request.
  login() {
    this.auth0.authorize();
  }

  // Checks the hash for a token.
  checkHash() {
    // Parses the token (in the URL hash).
    this.auth0.parseHash({ hash: window.location.hash }, (err, authResult) => {
      if (authResult) {
        window.location.hash = '';
        this.getUserInfo(authResult);
      }
      else if (err) {
        return 'Error: ' + err;
      }
    })
  }

  // Gets the user information from the web token.
  getUserInfo(authResult:any) {
    // Gets the user information from the parsed token.
    this.auth0.client.userInfo(authResult.accessToken, (err, uProfile) => {
      if (err) {
        return 'Error: ' + err;
      }

      // If there's a profile, gets its data
      if (uProfile) {
        this.userProfile = uProfile;
        this.token = authResult.accessToken;
        this.authenticated = true;
      }
    })
  }

  // Handles log out redirects.
  logout() {
    this.auth0.logout({
      returnTo: '',
      clientID: ''
    });
    this.authenticated = false;
    this.token = '';
  }
}
