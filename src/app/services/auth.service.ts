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
import { computed, Injectable, signal } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

// Other essential imports
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  AuthProvider,
  getIdToken,
  createUserWithEmailAndPassword,
  Auth,
  authState,
  sendPasswordResetEmail,
  sendEmailVerification,
  ActionCodeSettings,
} from "@angular/fire/auth";

// App-related imports
import { User } from "@app/interfaces/user.interface";
import { AlertsService } from "@app/services/alerts.service";
import { SWManager } from "@app/services/sWManager.service";

interface UserUpdateResponse {
  success: boolean;
  updated: User;
}

interface GetUserResponse {
  success: boolean;
  user: User;
}

export type ToggleButtonOption = "Enable" | "Disable";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly serverUrl = import.meta.env["VITE_BACKEND_URL"];
  // authentication information
  authenticated = signal<boolean>(false);
  // user data
  userData = signal<User | undefined>(undefined);
  // shortcuts
  pushEnabled = computed<boolean>(() => this.userData()?.pushEnabled || false);
  toggleBtn = computed<ToggleButtonOption>(() => (this.pushEnabled() ? "Disable" : "Enable"));
  autoRefresh = computed<boolean>(() => this.userData()?.autoRefresh || false);
  refreshBtn = computed<ToggleButtonOption>(() => (this.autoRefresh() ? "Disable" : "Enable"));
  refreshRate = computed(() => this.userData()?.refreshRate || 20);
  // documents whether the user just logged in or they're still logged in following
  // their previous login
  loggedIn = false;
  tokenExpired = false;
  // Whether the user is in the process of registering
  isRegistering = signal(false);
  isUserDataResolved = new BehaviorSubject(false);
  // firebase stuff
  actionCodeSettings = signal<ActionCodeSettings>({
    // TODO: Hardcode the base URL once we deploy to live
    url: `${import.meta.env["VITE_BASE_URL"]}/verify`,
  });

  // CTOR
  constructor(
    private Http: HttpClient,
    private alertsService: AlertsService,
    private serviceWorkerM: SWManager,
    private auth: Auth,
  ) {}

  /**
   * Firebase Methods
   * =====================================
   */
  /**
   * Checks whether there's a user currently logged in. If there is,
   * fetches the user's details. Otherwise, logs the previous user out.
   * @returns an observable that resolves to an internal user.
   */
  checkForLoggedInUser(): Observable<User | undefined> {
    return authState(this.auth)
      .pipe(
        tap((currentUser) => {
          if (!currentUser) {
            this.logout();
          }
        }),
      )
      .pipe(
        switchMap((currentUser) => {
          if (!currentUser || this.isRegistering()) return EMPTY;
          return this.fetchUser();
        }),
      );
  }

  /**
   * Gets the currently-logged in user from firebase.
   * @returns the currently-logged in user from firebase if there is one.
   */
  getCurrentFirebaseUser() {
    return this.auth.currentUser;
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
   * Makes the request to Firebase to send a password reset link.
   */
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Fetches an ID token for the currently logged in user.
   * @returns an observable of a user's JWT.
   */
  getIdTokenForCurrentUser() {
    if (!this.auth.currentUser) return of("");

    return from(getIdToken(this.auth.currentUser));
  }

  /**
   * Sends a verification email via Firebase.
   * @returns a promise that resolves to undefined.
   */
  sendVerificationEmail(): Promise<void> {
    if (!this.auth.currentUser) return new Promise((resolve) => resolve(undefined));

    return sendEmailVerification(this.auth.currentUser, this.actionCodeSettings())
      .then(() => {
        this.alertsService.createAlert({
          type: "Success",
          message:
            "Email sent successfully. Check your email and follow the instructions to verify your email.",
        });
      })
      .catch((error) => {
        this.alertsService.createAlert({
          type: "Error",
          message: `An error occurred. ${error}`,
        });
      });
  }

  /**
   * Signs the user out in Firebase.
   * @returns an empty observable.
   */
  signOut() {
    return from(signOut(this.auth));
  }

  /**
   * Internal Auth Methods
   * =====================================
   */

  /**
   * Gets a JWT and adds it to the user credential object.
   * @returns an observable of a user credentials + jwt.
   */
  getUserToken() {
    const currentUser = this.getCurrentFirebaseUser();

    if (!currentUser) return of();

    return this.getIdTokenForCurrentUser().pipe(
      map((token) => ({
        ...currentUser,
        jwt: token,
      })),
    );
  }

  /**
   * Fetches the logged in user's details.
   * @param loggedIn - whether the user just logged in.
   * @returns an observable with the user's details from the back-end.
   */
  fetchUser(loggedIn: boolean = false): Observable<User> {
    return this.getUserToken()
      .pipe(
        tap((firebaseUser: any) => {
          this.loggedIn = loggedIn;

          // turn the BehaviorSubject dealing with whether user data was resolved to
          // false only if there's no user data or if the JWTs don't match (shouldn't happen, but just in case), change the BehaviorSubject
          // and reset the user's data
          if (
            this.userData()?.id == 0 ||
            !this.userData()?.id ||
            this.userData()?.firebaseId != firebaseUser.uid
          ) {
            this.isUserDataResolved.next(false);
            this.userData.set(undefined);
          }
        }),
      )
      .pipe(
        switchMap((firebaseUser) => {
          return this.Http.get<GetUserResponse>(`${this.serverUrl}/users/all/${firebaseUser.uid}`, {
            headers: new HttpHeaders({ Authorization: `Bearer ${firebaseUser.jwt}` }),
          }).pipe(
            map((response) => {
              return {
                ...response.user,
                jwt: firebaseUser.jwt,
                firebaseId: firebaseUser.uid,
              };
            }),
          );
        }),
      )
      .pipe(tap((userData) => this.setCurrentUser(userData)))
      .pipe(
        catchError((err: HttpErrorResponse, _caught) => {
          const statusCode = err.status;

          // if a user with that ID doens't exist, try to create it
          // because of the way we check permissions in that endpoint vs
          // the create users endpoint
          if (statusCode == 401 && err.error.message.description.includes("User not found")) {
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

          return throwError(() => err);
        }),
      );
  }

  /**
   * Creates the new user in the Send A Hug backend.
   * @returns an observable with the user's details from the back-end.
   */
  createUser(displayName: string | null) {
    return this.getUserToken()
      .pipe(tap((_firebaseUser) => this.isUserDataResolved.next(false)))
      .pipe(
        switchMap((firebaseUser) => {
          // post request to create the user
          return this.Http.post<GetUserResponse>(
            `${this.serverUrl}/users`,
            {
              firebaseId: firebaseUser.uid,
              displayName: displayName || "user" + Math.round(Math.random() * 100),
            },
            {
              headers: new HttpHeaders({ Authorization: `Bearer ${firebaseUser.jwt}` }),
              //if the request succeeds, get the user's data
            },
          ).pipe(
            map((newUser) => {
              return {
                ...newUser.user,
                jwt: firebaseUser.jwt,
                firebaseId: firebaseUser.uid as string,
              };
            }),
          );
        }),
      )
      .pipe(tap((userData) => this.setCurrentUser(userData)))
      .pipe(
        catchError((err: HttpErrorResponse, _caught) => {
          this.isUserDataResolved.next(true);

          // if the user is offline, show the offline header message
          if (!navigator.onLine) {
            this.alertsService.toggleOfflineAlert();
          }
          // otherwise just create an error alert
          else {
            this.alertsService.createErrorAlert(err);
          }

          return throwError(() => err);
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
    this.isUserDataResolved.next(true);
    this.tokenExpired = false;

    // if the user just logged in, update the login count
    if (this.loggedIn) {
      this.updateUserData({ loginCount: userData.loginCount + 1 });
      this.loggedIn = false;
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
   * Signs the user out and then deletes the user's data locally.
   */
  logout() {
    return this.signOut().subscribe({
      next: () => {
        //clears the user's data
        this.authenticated.set(false);
        this.userData.set(undefined);

        // clears all the messages data (as that's private per user)
        this.serviceWorkerM.clearStore("messages");
        this.serviceWorkerM.clearStore("threads");

        // if the user has been logged out through their token expiring
        if (this.tokenExpired) {
          this.alertsService.createAlert(
            {
              type: "Notification",
              message: `Your session had become inactive and you have been safely logged out. Log back in to continue.`,
            },
            {
              navigate: true,
              navTarget: "/user",
              navText: "User Page",
            },
          );
        }
      },
    });
  }

  /**
   * Updates the user's data locally and sends a request to the server
   * to update the user's data with the provided details.
   * @param user - the details to update.
   * @returns a subscription that runs after the update is done.
   */
  updateUserData(user: Partial<User>) {
    this.userData.set({
      ...this.userData()!,
      ...user,
    });

    const updatedUser = { ...this.userData() };

    return this.getUserToken()
      .pipe(
        switchMap((user) =>
          this.Http.patch<UserUpdateResponse>(
            `${this.serverUrl}/users/all/${this.userData()?.id}`,
            updatedUser,
            {
              headers: new HttpHeaders({ Authorization: `Bearer ${user.jwt}` }),
            },
          ),
        ),
      )
      .subscribe({
        next: (response) => {
          this.serviceWorkerM.addItem("users", response.updated);
        },
        error: (err: HttpErrorResponse) => {
          this.alertsService.createErrorAlert(err);
        },
      });
  }

  /**
   * Sheck whether the user has permission to perform an action.
   * @param permission - The required permission.
   * @returns true/false depending on whether the user has permission.
   */
  canUser(permission: string) {
    // if there's an active token, check the logged in user's permissions
    if (this.userData()) {
      // if it's within the user's permissions, return true;
      // otherwise return false
      const canUserDo = this.userData()!.role["permissions"].includes(permission);
      return canUserDo;
    }
    // if there isn't, no user is logged in, so of course there's no permission
    else {
      return false;
    }
  }
}
