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
    loginCount: 0,
    jwt: ''
  }

  // CTOR
  constructor(private Http:HttpClient) {
    this.getToken();
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
          this.getUserData(payload);
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

  // Gets the user's information from the database
  getUserData(jwtPayload:any) {
    let params = new HttpParams().set('userID', jwtPayload.sub)

    // attempts to get the user's data
    this.Http.get('http://localhost:5000/users', {
      headers: this.authHeader,
      params: params
      // if successful, get the user data
    }).subscribe((response:any) => {
      let data = response.data.user;
      this.userData = {
        id: data.id,
        auth0Id: jwtPayload.sub,
        displayName: data.displayName,
        receivedHugs: data.receivedH,
        givenHugs: data.givenH,
        postsNum: data.postsNum,
        loginCount: data.loginCount,
        jwt: this.token
      }
      this.authenticated = true;
      this.setToken();
      // if there's an error, check the error type
    }, (err) => {
      let statusCode = err.status;

      // if a user with that ID doens't exist, try to create it
      if(statusCode == 404) {
        this.createUser(jwtPayload);
      }
    })
  }

  // If the user doesn't exist, send a request to the server to
  // add it to the database
  createUser(jwtPayload:any) {
    // post request to create the user
    this.Http.post('http://localhost:5000/users', {
      id: jwtPayload.sub,
      displayName: 'user' + Math.round(Math.random() * 100)
    }, {
      headers: this.authHeader
      //if the request succeeds, get the user's data
    }).subscribe((response:any) => {
      this.getUserData(jwtPayload);
      // error handling
    }, (err) => {
      console.log(err);
    });
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

  // Sets the token in local storage
  setToken() {
    localStorage.setItem("ACTIVE_JWT", this.token);
  }

  // Gets the currently active token from localStorage
  getToken() {
    let jwt = localStorage.getItem("ACTIVE_JWT");
    if(jwt) {
      // Parses the token and checks its expiration
      let payload = this.parseJWT(jwt);
      let expiration = payload['exp'];
      // If app auth token is not expired, request new token
      if(expiration > Date.now()) {
        this.auth0.checkSession({}, (err, authResult) => {
          if(authResult.accessToken) {
            this.token = authResult.accessToken;
            let payload = this.parseJWT(authResult.accessToken);
            this.getUserData(payload);
          }
          else if(err) {
            return 'Error: ' + err;
          }
        })
      }
      // If it's still valid, parses the JWT and gets the user's details
      else {
        this.token = jwt;
        let payload = this.parseJWT(jwt);
        this.getUserData(payload);
      }
    }
  }

  // sends a request to the server to update the login count in the database
  updateLoginCount() {
    this.Http.patch(`http://localhost:5000/users/${this.userData.id}`, {
      receivedH: this.userData.receivedHugs,
      givenH: this.userData.givenHugs,
      posts: this.userData.postsNum,
      loginCount: this.userData.loginCount + 1
    }).subscribe((response:any) => {
      console.log(response);
    });
  }
}
