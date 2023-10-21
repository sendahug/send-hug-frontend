/*
	Admin Dashboard
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

// App imports
import { AuthService } from "@app/services/auth.service";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./adminDashboard.component.html",
})
export class AdminDashboard implements OnInit {
  screen: string = "";
  adminCategories = [
    {
      title: "Reports",
      explanation: `Here you can view all the posts and users who've been reported by users. For post reports, you can either edit or delete the reported post. For user reports, you can edit or block the user.
                    If you find no justified reason for the report (for either a user or a post), you can also dismiss the report without taking action on the post or the user.`,
    },
    {
      title: "Blocks",
      explanation: `Here you can view all blocked users and how long they've been block for. You can also block or unblock a user by their ID.`,
    },
    {
      title: "Filters",
      explanation: `Here you can view currently filtered words. You can also add or remote filtered words to the list.`,
    },
  ];
  userDataSubscription: Subscription | undefined;
  // loader sub-component variable
  waitFor = `admin ${this.screen}`;

  // CTOR
  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {
    this.route.url.subscribe((params) => {
      if (params[0] && params[0].path) {
        this.screen = params[0].path;
      } else {
        this.screen = "main";
      }
    });
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. Checks for the current screen and calls
                        the appropriate getter method.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    // set the userDataSubscription to the subscription to isUserDataResolved
    this.userDataSubscription = this.authService.isUserDataResolved.subscribe((value) => {
      // if the user is logged in, fetch requested data for the current page
      if (value == true) {
        this.waitFor = `admin ${this.screen}`;

        // also unsubscribe from this to avoid sending the same request
        // multiple times
        if (this.userDataSubscription) {
          this.userDataSubscription.unsubscribe();
        }
      }
    });
  }
}
