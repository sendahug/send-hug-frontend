/*
	Support Page
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

import { Component, OnInit } from "@angular/core";
import { faComment, faFlag } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faGratipay } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-support",
  templateUrl: "./supportPage.component.html",
})
export class SupportPage implements OnInit {
  faqItems: any[] = [];
  // icons
  faComment = faComment;
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;
  faTimes = faTimes;
  faGratipay = faGratipay;

  // CTOR
  constructor() {}

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular once the component
                        is intialised. It creates a list of frequently asked questions
                        and their IDs (to be used for links).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    document.querySelectorAll(".faqItem").forEach((faqItem) => {
      let item = {
        href: faqItem.firstElementChild!.id,
        question: faqItem.firstElementChild!.textContent,
      };
      this.faqItems.push(item);
    });
  }
}
