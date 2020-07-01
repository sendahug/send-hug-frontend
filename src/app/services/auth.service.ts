/*
	Auth Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// Other essential imports
import { BehaviorSubject } from 'rxjs';
import * as Auth0 from 'auth0-js';

// App-related imports
import { User } from '../interfaces/user.interface';
import { AlertsService } from './alerts.service';
import { SWManager } from './sWManager.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Auth0 variable
  auth0 = new Auth0.WebAuth({
    clientID: environment.production ? prodEnv.auth0.clientID! : environment.auth0.clientID,
    domain: environment.production ? prodEnv.auth0.domain! : environment.auth0.domain,
    responseType: 'token',
    redirectUri: environment.production ? prodEnv.auth0.redirectUri! : environment.auth0.redirectUri,
    audience: environment.production ? prodEnv.auth0.audience! : environment.auth0.audience
  })

  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;
  // authentication information
  token: string = '';
  authHeader: HttpHeaders = new HttpHeaders;
  authenticated: boolean = false;
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
    releaseDate: undefined
  }
  // documents whether the user just logged in or they're still logged in following
  // their previous login
  loggedIn = false;
  tokenExpired = false;
  isUserDataResolved = new BehaviorSubject(false);

  // CTOR
  constructor(
    private Http:HttpClient,
    private alertsService:AlertsService,
    private serviceWorkerM:SWManager
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
    this.auth0.authorize();
  }

  /*
  Function Name: checkHash()
  Function Description: Checks the URL hash for a token.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkHash() {
    // if there's a token in the hash, parse it
    if(window.location.hash) {
      // Parses the token (in the URL hash).
      this.auth0.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (authResult) {
          window.location.hash = '';
          if(authResult.accessToken) {
            // parses the token payload
            this.token = authResult.accessToken;
            let payload = this.parseJWT(authResult.accessToken);
            this.loggedIn = true;
            // gets the user's data
            this.getUserData(payload);
          }
        }
        else if (err) {
          return 'Error: ' + err;
        }
      })
    }
    // if there's no token in the hash, check localStorage to see if there's
    // an active token there
    this.getToken();
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
    // if there's a JWT
    if(jwtPayload) {
      // attempts to get the user's data
      this.Http.get(`${this.serverUrl}/users/all/${jwtPayload.sub}`, {
        headers: new HttpHeaders({'Authorization': `Bearer ${this.token}`})
        // if successful, get the user data
      }).subscribe((response:any) => {
        let data = response.user;
        this.userData = {
          id: data.id,
          auth0Id: jwtPayload.sub,
          displayName: data.displayName,
          receivedHugs: data.receivedH,
          givenHugs: data.givenH,
          postsNum: data.posts,
          loginCount: data.loginCount,
          role: data.role,
          jwt: this.token,
          blocked: data.blocked,
          releaseDate: data.releaseDate
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

        // if there's a currently operating IDB database, get it
        if(this.serviceWorkerM.currentDB) {
          this.serviceWorkerM.currentDB.then(db => {
            // start a new transaction
            let tx = db.transaction('users', 'readwrite');
            let store = tx.objectStore('users');
            // adds the user's data to the users store
            let user = {
              id: data.id,
              auth0Id: jwtPayload.sub,
              displayName: data.displayName,
              receivedHugs: data.receivedH,
              givenHugs: data.givenH,
              postsNum: data.posts,
              loginCount: data.loginCount,
              role: data.role,
              blocked: data.blocked,
              releaseDate: data.releaseDate
            }
            store.put(user);
          })
        }
        // if there's an error, check the error type
      }, (err) => {
        let statusCode = err.status;

        // if a user with that ID doens't exist, try to create it
        if(statusCode == 404) {
          this.createUser(jwtPayload);
        }
        else {
          // if the user is offline, show the offline header message
          if(!navigator.onLine) {
            this.alertsService.toggleOfflineAlert();
          }
          // otherwise just create an error alert
          else {
            this.alertsService.createErrorAlert(err);
          }

          this.isUserDataResolved.next(true);
        }
      })
    }
    // If there's no currently-saved token
    else {
      jwtPayload = this.getToken();
    }
  }

  /*
  Function Name: createUser()
  Function Description: Sends a request to the server to create a new user.
                        Since getting a user's data requires permissions, a success
                        response to this request means the JWT is valid and verified,
                        so the user has successfully authenticated. This method is
                        only triggered if the user doesn't already exist.
  Parameters: jwtPayload (any) - The JWT payload.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createUser(jwtPayload:any) {
    // post request to create the user
    this.Http.post(`${this.serverUrl}/users`, {
      id: jwtPayload.sub,
      displayName: 'user' + Math.round(Math.random() * 100)
    }, {
      headers: new HttpHeaders({'Authorization': `Bearer ${this.token}`})
      //if the request succeeds, get the user's data
    }).subscribe((response:any) => {
      let data = response.user;
      this.userData = {
        id: data.id,
        auth0Id: jwtPayload.sub,
        displayName: data.displayName,
        receivedHugs: data.receivedH,
        givenHugs: data.givenH,
        postsNum: data.postsNum,
        loginCount: data.loginCount,
        role: data.role,
        jwt: this.token,
        blocked: data.blocked,
        releaseDate: data.releaseDate
      }
      // set the authentication-variables accordingly
      this.authenticated = true;
      this.authHeader = new HttpHeaders({'Authorization': `Bearer ${this.token}`});
      this.setToken();
      this.isUserDataResolved.next(true);

      // if there's a currently operating IDB database, get it
      if(this.serviceWorkerM.currentDB) {
        this.serviceWorkerM.currentDB.then(db => {
          // start a new transaction
          let tx = db.transaction('users', 'readwrite');
          let store = tx.objectStore('users');
          // adds the user's data to the users store
          let user = {
            id: data.id,
            auth0Id: jwtPayload.sub,
            displayName: data.displayName,
            receivedHugs: data.receivedH,
            givenHugs: data.givenH,
            postsNum: data.posts,
            loginCount: data.loginCount,
            role: data.role,
            blocked: data.blocked,
            releaseDate: data.releaseDate
          }
          store.put(user);
        })
      }
      // error handling
    }, (err) => {
      this.isUserDataResolved.next(true);

      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
    });
  }

  /*
  Function Name: logout()
  Function Description: Activates Auth0 logout.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  logout() {
    this.auth0.logout({
      returnTo: environment.production ? prodEnv.auth0.logoutUri! : environment.auth0.logoutUri,
      clientID: environment.production ? prodEnv.auth0.clientID! : environment.auth0.clientID
    });

    //clears the user's data
    this.authenticated = false;
    this.token = '';
    this.userData = {
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
      releaseDate: undefined
    }
    localStorage.setItem("ACTIVE_JWT", '');

    // clears all the messages data (as that's private per user)
    this.serviceWorkerM.clearStore('messages');

    // if the user has been logged out through their token expiring
    if(this.tokenExpired) {
      this.alertsService.createAlert({
        type: 'Notification',
        message: `Your session had become inactive and you have been safely logged out.
                  Log back in to continue.`
      }, false, '/user')
    }
  }

  /*
  Function Name: setToken()
  Function Description: Sets the token in local storage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setToken() {
    localStorage.setItem("ACTIVE_JWT", this.token);
  }

  /*
  Function Name: getToken()
  Function Description: Gets the currently active token from localStorage.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getToken() {
    let jwt = localStorage.getItem("ACTIVE_JWT");
    if(jwt) {
      // Parses the token and checks its expiration
      let payload = this.parseJWT(jwt);
      let expiration = payload['exp'] as number * 1000;
      // If app auth token is not expired, request new token
      if(expiration > Date.now()) {
        this.token = jwt;
        this.loggedIn = false;
        // gets the user's data and refreshes the token at the same time in
        // order to save time getting the information to the UI
        this.getUserData(payload);
        this.refreshToken();
      }
      // If it expired, clears the user's data
      else {
        this.tokenExpired = true;
        this.logout();
      }
    }
  }

  /*
  Function Name: refreshToken()
  Function Description: Attempts to silently refresh the token.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  refreshToken() {
    this.auth0.checkSession({}, (err, authResult) => {
      // if refreshing the token was successful, parse the JWT and get the
      // token variable to the new token
      if(authResult && authResult.accessToken) {
        this.token = authResult.accessToken;
        let payload = this.parseJWT(authResult.accessToken);
        this.getUserData(payload);
      }
      // if there was an error refreshing the token
      else if(err) {
        return 'Error: ' + err;
      }
    })
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
    this.Http.patch(`${this.serverUrl}/users/all/${this.userData.id}`, {
      displayName: this.userData.displayName,
      receivedH: this.userData.receivedHugs,
      givenH: this.userData.givenHugs,
      posts: this.userData.postsNum,
      loginCount: this.userData.loginCount + 1
    }, {
      headers: this.authHeader
    }).subscribe((_response:any) => {

    }, (err: HttpErrorResponse) => {
      // if the user is offline, show the offline header message
      if(!navigator.onLine) {
        this.alertsService.toggleOfflineAlert();
      }
      // otherwise just create an error alert
      else {
        this.alertsService.createErrorAlert(err);
      }
    });
  }

  /*
  Function Name: canUser()
  Function Description: Check whether the user has permission to perform an action.
  Parameters: permission (string) - The required permission.
  ----------------
  Programmer: Shir Bar Lev.
  */
  canUser(permission: string) {
    // if there's an active token, check the logged in user's permissions
    if(this.token) {
      let canUserDo:boolean;
      let tokenPayload = this.parseJWT(this.token);
      let permissions = tokenPayload['permissions'];

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
