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
import { Component } from "@angular/core";
import { Router, Route } from "@angular/router";

// App-related imports
import { AuthService } from "@app/services/auth.service";

@Component({
  selector: "app-site-map",
  templateUrl: "./siteMap.component.html",
})
export class SiteMap {
  routes: Route[] = [];

  // CTOR
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.config.forEach((route) => {
      // make sure the path isn't the error page or the search results
      if (route.path != "**" && route.path != "search") {
        // if it's the admin board, make sure the user has permission to see it
        if (route.path!.includes("admin")) {
          if (this.authService.canUser("read:admin-board")) {
            this.routes.push(route);
          }
        }
        // if it's the mailbox component, remove the first child path, as it's a
        // redirect, and remove the last one, as it requires a parameter
        else if (route.path!.includes("messages")) {
          const fixedRoute = route;
          fixedRoute.children!.shift();
          fixedRoute.children!.pop();
          this.routes.push(fixedRoute);
        }
        // if it's the user page, show just the user's own page, as it requires a parameter
        else if (route.path!.includes("user")) {
          const fixedRoute = route;
          fixedRoute.children!.pop();
          this.routes.push(fixedRoute);
        }
        // otherwise just add the route as-is
        else {
          this.routes.push(route);
        }
      }
    });
  }
}
