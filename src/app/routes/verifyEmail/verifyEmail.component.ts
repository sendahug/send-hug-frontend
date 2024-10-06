/*
	Email Verification Page
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

import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { AuthService } from "@app/services/auth.service";
import { Loader } from "@common/loader/loader.component";

@Component({
  selector: "app-verify-email-page",
  templateUrl: "./verifyEmail.component.html",
  standalone: true,
  imports: [CommonModule, RouterLink, Loader],
})
export class VerifyEmailPage implements OnInit {
  loadingAuth = signal(true);

  constructor(
    protected authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Angular's OnInit hook. Serves to wait until the
   * user's auth state is resolved before verifying their email.
   */
  ngOnInit(): void {
    this.authService.isUserDataResolved.subscribe((isResolved) => {
      if (isResolved) {
        this.loadingAuth.set(false);
        this.verifyEmail();
      }
    });
  }

  /**
   * Makes the request to the back-end to update the
   * verification status of the user, and then navigates
   * to the home route.
   */
  verifyEmail() {
    if (!this.authService.userData()) return;

    if (!this.authService.userData()!.emailVerified)
      this.authService.updateUserData({ emailVerified: true });
    this.router.navigate(["/"]);
  }
}
