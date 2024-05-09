/*
	Login Page
	Send a Hug Component
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
import { Component, computed, signal } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";
import { Observable, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { UserCredential } from "@angular/fire/auth";

// App-related imports
import { AuthService } from "@common/services/auth.service";
import { AlertsService } from "@app/common/services/alerts.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./loginPage.component.html",
})
export class LoginPage {
  isNewUser = signal<boolean>(false);
  signInUpTitle = computed(() => (this.isNewUser() ? "Sign up" : "Sign in"));
  loginForm = this.fb.group({
    username: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required]],
  });
  isLoading = signal(false);
  resetMode = false;
  lastFocusedElement: any;
  waitFor = "user";
  faGoogle = faGoogle;
  faApple = faApple;

  // CTOR
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private alertsService: AlertsService,
  ) {}

  /**
   * Runs the sign in process from the given observable.
   * @param userCreds$ - an observable of a Firebase UserCredential.
   * @param provider - the provider used for logging in.
   */
  signIn(userCreds$: Observable<UserCredential>, provider: "google" | "apple" | "username") {
    return userCreds$
      .pipe(tap((_user) => this.isLoading.set(true)))
      .pipe(
        switchMap((_userToken) => {
          return this.authService.fetchUser(true);
        }),
      )
      .subscribe({
        next: (userData) => {
          if (userData.id) {
            this.router.navigate(["/user"]);
          }
        },
        error: (_error) => {
          if (provider == "username") {
            this.alertsService.createAlert({
              type: "Error",
              message: "Cannot find user with these details. Did you mean to register?",
            });
          } else {
            this.router.navigate(["/signup"]);
          }
        },
      });
  }

  /**
   * Runs the sign-up process from the given observable.
   * @param userCreds$ - an observable of a Firebase UserCredential.
   */
  signUp(userCreds$: Observable<UserCredential>) {
    return userCreds$.subscribe({
      next: (_firebaseUser) => {
        this.router.navigate(["/signup"]);
      },
      error: (err) => {
        this.alertsService.createAlert({
          type: "Error",
          message: `An error occurred. ${err}`,
        });
      },
    });
  }

  /**
   * Triggers the 'sign in with popup' workflow in firebase.
   * @param provider whether to use apple or google for oauth.
   */
  signInWithPopup(provider: "google" | "apple") {
    let userCreds$: Observable<UserCredential>;

    if (this.isNewUser()) {
      userCreds$ = this.authService.loginWithPopup(provider);
      this.signUp(userCreds$);
    } else {
      userCreds$ = this.authService.loginWithPopup(provider);
      this.signIn(userCreds$, provider);
    }
  }

  /**
   * Creates user/logs in with username and password.
   */
  sendUsernameAndPassword() {
    if (!this.loginForm.valid) {
      let errorMessage = "";

      if (this.loginForm.controls.username.errors?.required) {
        errorMessage += "An email is required to log in or sign up. ";
      } else if (this.loginForm.controls.username.errors?.email) {
        errorMessage += "Invalid email. ";
      }

      if (this.loginForm.controls.password.errors?.required) {
        errorMessage += "A password is required to log in or sign up.";
      }

      this.alertsService.createAlert({
        type: "Error",
        message: `Invalid login details. ${errorMessage}`,
      });
      return;
    }

    let userCreds$: Observable<UserCredential>;

    if (this.isNewUser()) {
      userCreds$ = this.authService.signUpWithEmail(
        this.loginForm.controls.username.value!,
        this.loginForm.controls.password.value!,
      );
      this.signUp(userCreds$);
    } else {
      userCreds$ = this.authService.loginWithEmail(
        this.loginForm.controls.username.value!,
        this.loginForm.controls.password.value!,
      );
      this.signIn(userCreds$, "username");
    }
  }

  /**
   * Opens the password reset popup.
   */
  resetPassword() {
    this.resetMode = true;
    this.lastFocusedElement = document.activeElement;
  }

  /**
   * Remove the password reset popup.
   * @param edit whether edit mode should be active.
   */
  changeMode(edit: boolean) {
    this.resetMode = edit;
    this.lastFocusedElement?.focus();
  }

  /*
  Function Name: logout()
  Function Description: Activates Firebase logout via the authentication service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  logout() {
    this.authService.logout();
  }
}
