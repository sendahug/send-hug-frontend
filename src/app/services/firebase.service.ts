/*
	Firebase Service
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

// Other essential imports
import { EMPTY, from, Observable, of } from "rxjs";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  AuthProvider,
  getIdToken,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  ActionCodeSettings,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

/**
 * Thin wrapper for Firebase's methods.
 */
@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  firebase = initializeApp({
    apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
    authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
    projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
    storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"],
    messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
    appId: import.meta.env["VITE_FIREBASE_APP_ID"],
    measurementId: import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"],
  });
  analytics = getAnalytics(this.firebase);
  auth = getAuth(this.firebase);
  /**
   * An observable of the onAuthStateChanged's result. Copied from the rxfire code.
   * https://github.com/FirebaseExtended/rxfire/blob/main/auth/index.ts
   */
  get authState(): Observable<FirebaseUser | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        subscriber.next.bind(subscriber),
        subscriber.error.bind(subscriber),
        subscriber.complete.bind(subscriber),
      );
      return { unsubscribe };
    });
  }
  // firebase stuff
  actionCodeSettings = signal<ActionCodeSettings>({
    // TODO: Hardcode the base URL once we deploy to live
    url: `${import.meta.env["VITE_BASE_URL"]}/verify`,
  });

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
   * @returns an empty observable.
   */
  sendVerificationEmail(): Observable<void> {
    if (!this.auth.currentUser) return EMPTY;

    return from(sendEmailVerification(this.auth.currentUser, this.actionCodeSettings()));
  }

  /**
   * Signs the user out in Firebase.
   * @returns an empty observable.
   */
  signOut() {
    return from(signOut(this.auth));
  }
}
