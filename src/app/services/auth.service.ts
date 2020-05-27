// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Auth0 from 'auth0-js';

// App-related imports
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Auth0 variable
  auth0 = new Auth0.WebAuth({
    clientID: environment.auth0.clientID,
    domain: environment.auth0.domain,
    responseType: 'token',
    redirectUri: environment.auth0.redirectUri,
    audience: environment.auth0.audience
  })

  token: string = '';
  authHeader = new HttpHeaders({'Authorization': `Bearer ${this.token}`})
  authenticated: boolean = false;
  userProfile: any;
  userData: User = {
    id: 0,
    auth0Id: '',
    displayName: '',
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    jwt: ''
  }

  // CTOR
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
        // parses the token payload
        if(authResult.accessToken) {
          this.token = authResult.accessToken;
          let payload = this.parseJWT(authResult.accessToken);
          this.checkUserLogin(payload);
        }
      }
      else if (err) {
        return 'Error: ' + err;
      }
    })
  }

  // Parse the token payload
  parseJWT(token:string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  // Checks the user's logins; if it's the first time, sends a post
  // request to the server to create a new user
  checkUserLogin(jwtPayload:any) {
    // if it's the user's first login, adds their data to the database
    if(jwtPayload['http://localhost:3000login_count'] == 0) {
      this.Http.post('http://localhost:5000/users', {
        id: jwtPayload.sub,
        displayName: 'user' + Math.round(Math.random() * 100)
      }, {
        headers: this.authHeader
      }).subscribe((response:any) => {
        if(response.data.success == true) {
          this.getUserData(jwtPayload);
        }
      })
    }
    // if not, gets the user's data from the database
    else {
      this.getUserData(jwtPayload);
    }
  }

  // Gets the user's information from the database
  getUserData(jwtPayload:any) {
    let params = new HttpParams().set('userID', jwtPayload.sub)

    this.Http.get('http://localhost:5000/users', {
      headers: this.authHeader,
      params: params
    }).subscribe((response:any) => {
      let data = response.data.user;
      this.userData = {
        id: data.id,
        auth0Id: jwtPayload.sub,
        displayName: data.displayName,
        receivedHugs: data.receivedH,
        givenHugs: data.givenH,
        postsNum: data.postsNum,
        jwt: this.token
      }
      this.authenticated = true;
    })
  }

  // Handles log out redirects.
  logout() {
    this.auth0.logout({
      returnTo: environment.auth0.logoutUri,
      clientID: environment.auth0.clientID
    });
    this.authenticated = false;
    this.token = '';
  }
}
