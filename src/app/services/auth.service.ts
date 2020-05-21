import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Auth0 from 'auth0-js';

import { User } from '../interfaces/user.interface';

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

  token: string = '';
  authenticated: boolean = false;
  userProfile: any;
  userData: User = {
    id: 0,
    auth0Id: '',
    email: '',
    username: '',
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    jwt: ''
  }

  constructor(private Http:HttpClient) {

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
        this.getSocialData();
      }
    })
  }

  // Gets the user's social data
  getSocialData() {
    let params = new HttpParams().set('userID', this.userProfile.sub)
    this.Http.get('localhost:3000/users', {
      params: params
    }).subscribe((response:any) => {
      let data = response.data.user;
      this.userData = {
        id: this.userProfile.id,
        auth0Id: this.userProfile.sub,
        email: this.userProfile.email,
        username: this.userProfile.username,
        receivedHugs: data.receivedH,
        givenHugs: data.givenH,
        postsNum: data.postsNum,
        jwt: this.token
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
