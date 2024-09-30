/*
  App Component
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
import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet, RouterLink, ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TeleportOutletDirective } from "@ngneat/overview";

// App-related imports
import { AuthService } from "./services/auth.service";
import { AlertsService } from "./services/alerts.service";
import { SWManager } from "./services/sWManager.service";
import { NotificationService } from "./services/notifications.service";
import { AppAlert } from "./components/appAlert/appAlert.component";
import { AppNavMenu } from "./components/layout/navigationMenu/navigationMenu.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.less",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AppAlert, AppNavMenu, TeleportOutletDirective],
})
export class AppComponent implements OnInit {
  canShare = false;

  constructor(
    protected authService: AuthService,
    protected alertsService: AlertsService,
    private router: Router,
    private serviceWorkerM: SWManager,
    protected notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
    // Update the user state based on the logged in firebase user
    // (if there is one)
    this.authService.checkForLoggedInUser().subscribe({
      next: (user) => {
        if (!user) return;

        this.notificationService.getNotifications().subscribe({});

        // if push notifications are enabled, check the permission
        // state and get the cached subscription from localStorage
        this.notificationService
          .checkInitialPermissionState(user.pushEnabled)
          .then((permission) => {
            if (permission == "granted" && user.pushEnabled) {
              this.notificationService.getCachedSubscription();
            }
          });
        // if auto-refresh is enabled, start auto-refresh
        if (user.autoRefresh) this.notificationService.startAutoRefresh(user.refreshRate);

        const redirectPath = this.route.snapshot.queryParamMap.get("redirect");

        // If the user has been redirected here from one of the guarded
        // routes, navigate to said route. This happens when the page is
        // refreshed while viewing a restricted page or when navigating using
        // the address bar.
        if (redirectPath) {
          this.router.navigate([`/${redirectPath}`]);
        }
      },
      error: (err: Error) => {
        if (err.message == "User doesn't exist yet") {
          this.alertsService.createAlert(
            {
              type: "Error",
              message: "User doesn't exist yet. Did you mean to finish registering?",
            },
            {
              navigate: true,
              navTarget: "/signup",
              navText: "Finish Registering",
            },
          );
        } else {
          this.alertsService.createAlert({
            type: "Error",
            message: `An error occurred. ${err.message}`,
          });
        }
      },
    });
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It triggers the registration of the ServiceWorker,
                        as well keeping alert for any ServiceWorker that has been
                        installed and is ready to be activated.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    this.serviceWorkerM.registerSW();

    if ("share" in navigator) {
      this.canShare = true;
    } else {
      this.canShare = false;
    }
  }

  /*
  Function Name: shareSite()
  Function Description: Triggers the Share API to let the user share the website.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  shareSite() {
    navigator
      .share({
        title: "Send A Hug",
        url: "https://app.send-hug.com/",
      })
      .catch((_err) => {
        this.alertsService.createAlert({
          type: "Error",
          message: "Sharing failed. Please try again!",
        });
      });
  }
}
