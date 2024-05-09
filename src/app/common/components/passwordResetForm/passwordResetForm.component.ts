/*
	Password Reset Form
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
import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

// App-related imports
import { AuthService } from "@common/services/auth.service";
import { AlertsService } from "@app/common/services/alerts.service";

@Component({
  selector: "app-reset-pw-form",
  templateUrl: "./passwordResetForm.component.html",
})
export class PasswordResetForm {
  @Output() editMode = new EventEmitter<boolean>();
  resetForm = this.fb.group({
    username: ["", [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertsService: AlertsService,
  ) {}

  /**
   * Validates the password reset form and makes the request to reset the password.
   */
  resetPassword() {
    // Check the form data is valid
    if (!this.resetForm.valid) {
      let errorMessage = "";

      if (this.resetForm.controls.username.errors?.required) {
        errorMessage = "An email is required to reset the password.";
      } else if (this.resetForm.controls.username.errors?.email) {
        errorMessage = "The email entered in the username field is invalid.";
      }

      this.alertsService.createAlert({
        type: "Error",
        message: errorMessage,
      });
      return;
    }

    // if the form is valid, make the request to reset the password.
    this.authService.resetPassword(this.resetForm.controls.username.value!).then(() => {
      this.alertsService.createAlert({
        type: "Success",
        message:
          "Password reset email sent. Check your inbox and follow the instructions to reset your password.",
      });
      this.editMode.emit(true);
    });
  }
}
