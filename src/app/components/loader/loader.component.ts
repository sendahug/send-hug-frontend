/*
	Loader
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
import { Component, OnInit, Input, OnChanges } from "@angular/core";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
})
export class Loader implements OnInit, OnChanges {
  // the sort of data the parent component is waiting for
  @Input() waitingFor!: string;
  // message to display to the user while waiting
  message = "";

  // CTOR
  constructor() {}

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the existence of the data
                        the parent component is waiting (via checkLoadingTarget()) for and adjusts the
                        loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    this.checkLoadingTarget();
  }

  /*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. It checks for the existence of the data
                        the parent component is waiting (via checkLoadingTarget()) for and adjusts the
                        loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnChanges() {
    if (this.waitingFor) {
      this.checkLoadingTarget();
    }
  }

  /*
  Function Name: checkLoadingTarget()
  Function Description: Checks for the existence of the data the parent component
                        is waiting (via checkLoadingTarget()) for and adjusts the
                        loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkLoadingTarget() {
    // if the app is waiting for user data to be fetched from the server
    if (this.waitingFor == "user" || this.waitingFor == "other user") {
      this.message = "Fetching user data...";
    }
    // if the app is waiting for incoming/outgoing messages data to be
    // fetched from the server
    else if (
      this.waitingFor == "inbox messages" ||
      this.waitingFor == "outbox messages" ||
      this.waitingFor == "thread messages"
    ) {
      this.message = "Fetching messages...";
    }
    // if the app is waiting for threads messages data to be fetched from the server
    else if (this.waitingFor == "threads messages") {
      this.message = "Fetching threads...";
    }
    // if the app is waiting for main page/new posts/suggested
    // posts data to be fetched from the server
    else if (
      this.waitingFor == "main page" ||
      this.waitingFor == "new posts" ||
      this.waitingFor == "suggested posts"
    ) {
      this.message = "Fetching posts...";
    }
    // if the app is waiting for the user's posts to be fetched from the server
    else if (this.waitingFor == "user posts") {
      this.message = "Fetching user posts...";
    }
    // if the app is waiting for search results to be fetched from the server
    else if (this.waitingFor == "search") {
      this.message = "Searching...";
    }
    // if the app is waiting for open reports to be fetched from the server
    else if (this.waitingFor == "admin reports") {
      this.message = "Getting user and post reports...";
    }
    // if the app is waiting for blocked users to be fetched from the server
    else if (this.waitingFor == "admin blocks") {
      this.message = "Getting blocked users...";
    }
    // if the app is waiting for filtered phrases to be fetched from the server
    else if (this.waitingFor == "admin filters") {
      this.message = "Getting filtered phrases...";
    }
  }
}
