/*
	Sign-up Page
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

import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertsService } from "@app/common/services/alerts.service";

import { AuthService } from "@app/common/services/auth.service";

@Component({
  selector: "app-signup-page",
  templateUrl: "./signUpPage.component.html",
})
export class SignUpPage {
  signUpForm = this.fb.group({
    displayName: ["", [Validators.required, Validators.maxLength(50)]],
    acceptedTerms: [false, [Validators.requiredTrue]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertsService: AlertsService,
  ) {}

  /**
   * Creates the user in the Send a Hug back-end.
   */
  signUp() {
    let errorMessage = "";

    if (!this.authService.getCurrentFirebaseUser()) {
      errorMessage =
        "You're not currently logged in with Firebase. Did you forget to log in or register?";
    } else if (this.authService.authenticated()) {
      errorMessage = "You cannot create another user when you're already registered!";
    } else if (!this.signUpForm.valid) {
      if (this.signUpForm.controls.displayName.errors?.required) {
        errorMessage += "A display name is required. ";
      } else if (this.signUpForm.controls.displayName.errors?.maxlength) {
        errorMessage += "Display name is too long. Please shorten it and try again. ";
      }

      if (this.signUpForm.controls.acceptedTerms.errors?.required) {
        errorMessage += "You must accept the terms and conditions before creating an account.";
      }
    }

    if (errorMessage) {
      this.alertsService.createAlert({
        type: "Error",
        message: `Error creating a new user. ${errorMessage}`,
      });
      return;
    }

    this.authService.createUser(this.signUpForm.controls.displayName.value).subscribe({
      next: (_currentUser) => {
        this.router.navigate(["/user"]);
      },
    });
  }
}
