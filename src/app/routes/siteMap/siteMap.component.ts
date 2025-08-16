/*
	Site Map
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
import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, signal } from "@angular/core";
import { Router, Route, RouterLink } from "@angular/router";

// App-related imports
import { AuthService } from "@app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-site-map",
  templateUrl: "./siteMap.component.html",
  styleUrl: "./siteMap.component.less",
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class SiteMapComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userSubscription: Subscription | undefined;
  readonly routes = signal<Route[]>([]);

  // CTOR
  constructor() {
    this.updateSiteMap();

    if (!this.authService.authenticated()) {
      this.userSubscription = this.authService.isUserDataResolved.subscribe((value) => {
        if (value) {
          this.updateSiteMap();
        }
      });
    }
  }

  /**
   * Angular lifecycle hook that is called when the component is destroyed.
   * It unsubscribes from the user subscription to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  /**
   * Updates the site map based on the user's permissions and whether they're
   * logged in.
   */
  updateSiteMap() {
    this.routes.set([]);
    const routes: Route[] = [];

    this.router.config.forEach((route) => {
      // make sure the path isn't the error page or the search results
      if (route.path != "**" && route.path != "search") {
        // if it's the admin board, make sure the user has permission to see it
        if (route.path!.includes("admin")) {
          if (this.authService.canUser("read:admin-board")) {
            routes.push(route);
          }
          // if it's the mailbox component, check the user is authenticated
        } else if (route.path!.includes("messages")) {
          if (this.authService.authenticated()) routes.push(route);
          // if it's the user page, check the user is authenticated
        } else if (route.path!.includes("user")) {
          if (this.authService.authenticated()) routes.push(route);
          // if it's the login component, check the user isn't authenticated
        } else if (route.path == "login") {
          if (!this.authService.authenticated()) routes.push(route);
          // if it's the settings, check the user is authenticated
        } else if (route.path == "settings") {
          if (this.authService.authenticated()) routes.push(route);
        }
        // otherwise just add the route as-is
        else if (route.path != "signup" && route.path != "verify") {
          routes.push(route);
        }
      }
    });

    this.routes.set(routes);
  }
}
