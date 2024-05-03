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
import { switchMap, tap } from "rxjs";
import { Router } from "@angular/router";

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
   * Triggers the 'sign in with popup' workflow in firebase.
   * @param provider whether to use apple or google for oauth.
   */
  signInWithPopup(provider: "google" | "apple") {
    if (this.isNewUser()) {
      this.authService.loginWithPopup(provider).subscribe({
        next: (_firebaseUser) => {
          this.router.navigate(["/signup"]);
        },
      });
    } else {
      this.authService
        .loginWithPopup(provider)
        .pipe(tap((_user) => this.isLoading.set(true)))
        .pipe(
          switchMap((_userToken) => {
            return this.authService.fetchUser();
          }),
        )
        .subscribe({
          next: (userData) => {
            if (userData.id) {
              this.router.navigate(["/user"]);
            }
          },
          error: (_err) => {
            this.router.navigate(["/signup"]);
          },
        });
    }
  }

  /**
   * Creates user/logs in with username and password.
   */
  sendUsernameAndPassword() {
    if (!this.loginForm.valid) {
      return;
    }

    if (this.isNewUser()) {
      this.authService
        .signUpWithEmail(
          this.loginForm.controls.username.value!,
          this.loginForm.controls.password.value!,
        )
        .subscribe({
          next: (_firebaseUser) => {
            this.router.navigate(["/signup"]);
          },
        });
    } else {
      this.authService
        .loginWithEmail(
          this.loginForm.controls.username.value!,
          this.loginForm.controls.password.value!,
        )
        .pipe(tap((_user) => this.isLoading.set(true)))
        .pipe(
          switchMap((_userToken) => {
            return this.authService.fetchUser();
          }),
        )
        .subscribe({
          next: (userData) => {
            if (userData.id) {
              this.router.navigate(["/user"]);
            }
          },
          error: (_err) => {
            this.alertsService.createAlert({
              type: "Error",
              message: "Cannot find user with these details. Did you mean to register?",
            });
          },
        });
    }
  }

  /**
   * Triggers password reset.
   * TODO: Still need to fill this method.
   */
  resetPassword() {}

  /*
  Function Name: logout()
  Function Description: Activates Auth0 logout via the authentication service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  logout() {
    this.authService.logout();
  }
}
