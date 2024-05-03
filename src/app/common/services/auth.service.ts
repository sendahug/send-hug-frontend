/*
	Auth Service
	Send a Hug Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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
import { Injectable, signal } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

// Other essential imports
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  mergeMap,
  Observable,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import * as Auth0 from "auth0-js";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  signOut,
  AuthProvider,
  UserCredential,
  getIdToken,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// App-related imports
import { User } from "@app/interfaces/user.interface";
import { AlertsService } from "@common/services/alerts.service";
import { SWManager } from "@common/services/sWManager.service";
import { environment } from "@env/environment";

interface UserUpdateResponse {
  success: boolean;
  updated: User;
}

interface GetUserResponse {
  success: boolean;
  user: User;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Auth0 variable
  auth0 = new Auth0.WebAuth({
    clientID: environment.auth0.clientID as string,
    domain: environment.auth0.domain as string,
    responseType: "token",
    redirectUri: environment.auth0.redirectUri,
    audience: environment.auth0.audience,
  });
  firebase = initializeApp({
    apiKey: environment.firebase.apiKey,
    authDomain: environment.firebase.authDomain,
    projectId: environment.firebase.projectId,
    storageBucket: environment.firebase.storageBucket,
    messagingSenderId: environment.firebase.messagingSenderId,
    appId: environment.firebase.appId,
    measurementId: environment.firebase.measurementId,
  });
  analytics = getAnalytics(this.firebase);
  auth = getAuth(this.firebase);

  readonly serverUrl = environment.backend.domain;
  // authentication information
  token: string = "";
  authenticated = signal<boolean>(false);
  // user data
  userData = signal<User | undefined>(undefined);
  // documents whether the user just logged in or they're still logged in following
  // their previous login
  loggedIn = false;
  tokenExpired = false;
  isUserDataResolved = new BehaviorSubject(false);

  // CTOR
  constructor(
    private Http: HttpClient,
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
  ) {}

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

  /**
   * Creates a new user with email and password.
   * @param email - the email to use for sign up.
   * @param password - the password to use.
   * @returns a observable of a user credentials.
   */
  signUpWithEmail(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Logs a user in with username and password.
   * @param email - the email to use for sign up.
   * @param password - the password to use.
   * @returns a observable of a user credentials.
   */
  loginWithEmail(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  /**
   * Logs in/signs up using an OAuth provider.
   * @param provider whether to use apple or google for oauth.
   */
  loginWithPopup(provider: "google" | "apple") {
    let authProvider: AuthProvider;

    switch (provider) {
      case "google":
        authProvider = new GoogleAuthProvider();
        break;
      case "apple":
        authProvider = new OAuthProvider("apple.com");
        break;
    }

    return from(signInWithPopup(this.auth, authProvider));
  }

  /**
   * Gets a JWT and adds it to the user credential object.
   * @param firebaseUserObservable observable of a user credentials.
   * @returns an observable of a user credentials + jwt.
   */
  addTokenToUser(firebaseUserObservable: Observable<UserCredential>) {
    return firebaseUserObservable.pipe(
      mergeMap((currentUser) => {
        return from(getIdToken(currentUser.user)).pipe(
          map((token) => ({
            ...currentUser,
            jwt: token,
          })),
        );
      }),
    );
  }

  /**
   * Fetches the logged in user's details.
   * @param firebaseUserObservable observable of a user credentials.
   * @returns an observable with the user's details from the back-end.
   */
  fetchUser(firebaseUserObservable: Observable<UserCredential>) {
    return this.addTokenToUser(firebaseUserObservable)
      .pipe(
        tap((firebaseUser) => {
          // turn the BehaviorSubject dealing with whether user data was resolved to
          // false only if there's no user data
          if (this.userData()?.id == 0 || !this.userData()?.id) {
            this.isUserDataResolved.next(false);
          }
          // if the JWTs don't match (shouldn't happen, but just in case), change the BehaviorSubject
          // and reset the user's data
          else if (this.userData()?.firebaseId != firebaseUser.user.uid) {
            this.isUserDataResolved.next(false);
            this.userData.set(undefined);
          }
        }),
      )
      .pipe(
        switchMap((firebaseUser) => {
          return this.Http.get<GetUserResponse>(
            `${this.serverUrl}/users/all/${firebaseUser.user.uid}`,
            {
              headers: new HttpHeaders({ Authorization: `Bearer ${firebaseUser.jwt}` }),
            },
          ).pipe(
            map((response) => {
              return {
                ...response.user,
                auth0Id: "",
                jwt: firebaseUser.jwt,
                firebaseId: firebaseUser.user.uid,
              };
            }),
          );
        }),
      )
      .pipe(tap((userData) => this.setCurrentUser(userData)))
      .pipe(
        catchError((err: HttpErrorResponse, caught) => {
          const statusCode = err.status;

          // if a user with that ID doens't exist, try to create it
          // because of the way we check permissions in that endpoint vs
          // the create users endpoint
          if (statusCode == 404 || statusCode == 401) {
            return throwError(() => Error("User doesn't exist yet"));
          } else {
            // if the user is offline, show the offline header message
            if (!navigator.onLine) {
              this.alertsService.toggleOfflineAlert();
            }
            // otherwise just create an error alert
            else {
              this.alertsService.createErrorAlert(err);
            }

            this.isUserDataResolved.next(true);
          }

          return caught;
        }),
      );
  }

  /**
   * Updates the AuthService's user-related attributes with the logged in user.
   * @param userData the user data returned by the back-end.
   */
  setCurrentUser(userData: User) {
    this.userData.set(userData);
    // set the authentication-variables accordingly
    this.authenticated.set(true);
    this.token = userData.jwt;
    this.setToken();
    this.isUserDataResolved.next(true);
    this.tokenExpired = false;

    // if the user just logged in, update the login count
    if (this.loggedIn) {
      this.updateUserData({ loginCount: userData.loginCount + 1 });
    }

    // adds the user's data to the users store
    let user = {
      id: userData.id,
      displayName: userData.displayName,
      receivedH: userData.receivedH,
      givenH: userData.givenH,
      posts: userData.posts,
      role: userData.role,
      selectedIcon: userData.selectedIcon,
      iconColours: {
        character: userData.iconColours?.character,
        lbg: userData.iconColours?.lbg,
        rbg: userData.iconColours?.rbg,
        item: userData.iconColours?.item,
      },
    };
    this.serviceWorkerM.addItem("users", user);
  }

  /**
   * Signs the user out in Firebase.
   */
  signOut() {
    return signOut(this.auth);
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
    if (window.location.hash) {
      // Parses the token (in the URL hash).
      this.auth0.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (authResult) {
          window.location.hash = "";
          if (authResult.accessToken) {
            // parses the token payload
            this.token = authResult.accessToken;
            let payload = this.parseJWT(authResult.accessToken);
            this.loggedIn = true;
            // gets the user's data
            this.getUserData(payload);
          }
        } else if (err) {
          return "Error: " + err;
        }
      });
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
  parseJWT(token: string) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

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
  getUserData(jwtPayload: any) {
    // turn the BehaviorSubject dealing with whether user data was resolved to
    // false only if there's no user data
    if (this.userData()?.id == 0 || !this.userData()?.id) {
      this.isUserDataResolved.next(false);
    }
    // if the JWTs don't match (shouldn't happen, but just in case), change the BehaviorSubject
    // and reset the user's data
    else if (this.userData()?.auth0Id != jwtPayload.sub) {
      this.isUserDataResolved.next(false);
      this.userData.set(undefined);
    }

    // if there's a JWT
    if (jwtPayload) {
      // attempts to get the user's data
      this.Http.get(`${this.serverUrl}/users/all/${jwtPayload.sub}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
        // if successful, get the user data
      }).subscribe({
        next: (response: any) => {
          const data = response.user;
          this.userData.set({
            ...data,
            auth0Id: jwtPayload.sub,
            jwt: this.token,
          });
          // set the authentication-variables accordingly
          this.authenticated.set(true);
          this.setToken();
          this.isUserDataResolved.next(true);
          this.tokenExpired = false;

          // if the user just logged in, update the login count
          if (this.loggedIn) {
            this.updateUserData({ loginCount: data.loginCount + 1 });
          }

          // adds the user's data to the users store
          let user = {
            id: data.id,
            auth0Id: jwtPayload.sub,
            displayName: data.displayName,
            receivedH: data.receivedH,
            givenH: data.givenH,
            posts: data.posts,
            loginCount: data.loginCount,
            role: data.role,
            blocked: data.blocked,
            releaseDate: data.releaseDate,
            autoRefresh: data.autoRefresh,
            pushEnabled: data.pushEnabled,
            selectedIcon: data.selectedIcon,
            iconColours: {
              character: data.iconColours?.character,
              lbg: data.iconColours?.lbg,
              rbg: data.iconColours?.rbg,
              item: data.iconColours?.item,
            },
          };
          this.serviceWorkerM.addItem("users", user);
          // if there's an error, check the error type
        },
        error: (err) => {
          let statusCode = err.status;

          // if a user with that ID doens't exist, try to create it
          // because of the way we check permissions in that endpoint vs
          // the create users endpoint
          if (statusCode == 404 || statusCode == 401) {
            this.createUser(jwtPayload);
          } else {
            // if the user is offline, show the offline header message
            if (!navigator.onLine) {
              this.alertsService.toggleOfflineAlert();
            }
            // otherwise just create an error alert
            else {
              this.alertsService.createErrorAlert(err);
            }

            this.isUserDataResolved.next(true);
          }
        },
      });
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
  createUser(jwtPayload: any) {
    this.isUserDataResolved.next(false);

    // post request to create the user
    this.Http.post(
      `${this.serverUrl}/users`,
      {
        id: jwtPayload.sub,
        displayName: "user" + Math.round(Math.random() * 100),
      },
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
        //if the request succeeds, get the user's data
      },
    ).subscribe({
      next: (response: any) => {
        const data = response.user;
        this.userData.set({
          ...data,
          auth0Id: jwtPayload.sub,
          jwt: this.token,
        });
        // set the authentication-variables accordingly
        this.authenticated.set(true);
        this.setToken();
        this.isUserDataResolved.next(true);

        // adds the user's data to the users store
        let user = {
          id: data.id,
          auth0Id: jwtPayload.sub,
          displayName: data.displayName,
          receivedH: data.receivedH,
          givenH: data.givenH,
          posts: data.posts,
          loginCount: data.loginCount,
          role: data.role,
          blocked: data.blocked,
          releaseDate: data.releaseDate,
          autoRefresh: data.autoRefresh,
          pushEnabled: data.pushEnabled,
        };
        this.serviceWorkerM.addItem("users", user);
        // error handling
      },
      error: (err) => {
        this.isUserDataResolved.next(true);

        // if the user is offline, show the offline header message
        if (!navigator.onLine) {
          this.alertsService.toggleOfflineAlert();
        }
        // otherwise just create an error alert
        else {
          this.alertsService.createErrorAlert(err);
        }
      },
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
      returnTo: environment.auth0.logoutUri,
      clientID: environment.auth0.clientID,
    });

    // update the user's data in IDB to remove all user data
    let user = {
      id: this.userData()?.id,
      displayName: this.userData()?.displayName,
      receivedH: this.userData()?.receivedH,
      givenH: this.userData()?.givenH,
      posts: this.userData()?.posts,
      role: this.userData()?.role,
    };
    this.serviceWorkerM.addItem("users", user);

    //clears the user's data
    this.authenticated.set(false);
    this.token = "";
    this.userData.set(undefined);
    localStorage.setItem("ACTIVE_JWT", "");

    // clears all the messages data (as that's private per user)
    this.serviceWorkerM.clearStore("messages");
    this.serviceWorkerM.clearStore("threads");

    // if the user has been logged out through their token expiring
    if (this.tokenExpired) {
      this.alertsService.createAlert(
        {
          type: "Notification",
          message: `Your session had become inactive and you have been safely logged out.
                  Log back in to continue.`,
        },
        {
          navigate: true,
          navTarget: "/user",
          navText: "User Page",
        },
      );
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
    if (jwt) {
      // Parses the token and checks its expiration
      let payload = this.parseJWT(jwt);
      let expiration = (payload["exp"] as number) * 1000;
      // If app auth token is not expired, request new token
      if (expiration > Date.now()) {
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
      if (authResult && authResult.accessToken) {
        this.token = authResult.accessToken;
        let payload = this.parseJWT(authResult.accessToken);
        this.getUserData(payload);
      }
      // if there was an error refreshing the token
      else if (err) {
        return "Error: " + err;
      }
    });
  }

  /*
  Function Name: updateUserData()
  Function Description: Sends a request to the server to update the login count
                        and display name in the database.
  Parameters: user (partial User) - the updated details to set the userData to.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateUserData(user: Partial<User>) {
    this.userData.set({
      ...this.userData()!,
      ...user,
    });

    const updatedUser = { ...this.userData() };

    return this.Http.patch<UserUpdateResponse>(
      `${this.serverUrl}/users/all/${this.userData()?.id}`,
      updatedUser,
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
        // if successful, get the user data
      },
    ).subscribe({
      next: (response) => {
        this.serviceWorkerM.addItem("users", response.updated);
      },
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
    if (this.userData()) {
      // if it's within the user's permissions, return true;
      // otherwise return false
      const canUserDo = this.userData()?.role["permissions"].includes(permission);
      return canUserDo;
    }
    // if there isn't, no user is logged in, so of course there's no permission
    else {
      return false;
    }
  }
}
