/*
	Validation Service
	Send a Hug Service
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
import { Injectable } from "@angular/core";

// App-related imports
import { AlertsService } from "./alerts.service";

type ValidatableItems = "post" | "message" | "displayName" | "reportOther";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  validationRules = {
    post: {
      max: 480,
      emptyAllowed: false,
      errorMessages: {
        zeroLength: "Post text cannot be empty. Please fill the field and try again.",
        tooLong: "Post text cannot be over 480 characters! Please shorten the post and try again.",
      },
    },
    message: {
      max: 480,
      emptyAllowed: false,
      errorMessages: {
        zeroLength: "A message cannot be empty. Please fill the field and try again.",
        tooLong:
          "Message text cannot be over 480 characters! Please shorten the message and try again.",
      },
    },
    displayName: {
      max: 60,
      emptyAllowed: false,
      errorMessages: {
        zeroLength: "New display name cannot be empty. Please fill the field and try again.",
        tooLong:
          "New display name cannot be over 60 characters! Please shorten the name and try again.",
      },
    },
    reportOther: {
      max: 120,
      emptyAllowed: false,
      errorMessages: {
        zeroLength: "The 'other' field cannot be empty.",
        tooLong:
          "Report reason cannot be over 120 characters! Please shorten the message and try again.",
      },
    },
  };

  // CTOR
  constructor(private alertsService: AlertsService) {}

  /*
  Function Name: validateItem()
  Function Description: Validates the given item to ensure it fits the rules.
  Parameters: typeOfTest (ValidatableItems) - the type of item being tested
              textToValidate (string) - the string to validate.
              elementId (string) - the ID of the HTML element of the text field.
  ----------------
  Programmer: Shir Bar Lev.
  */
  validateItem(typeOfTest: ValidatableItems, textToValidate: string, elementId: string): boolean {
    const testValidationRules = this.validationRules[typeOfTest];
    // if there's text, check its length
    if (textToValidate) {
      if (textToValidate.length > testValidationRules["max"]) {
        this.alertsService.createAlert({
          type: "Error",
          message: testValidationRules["errorMessages"]["tooLong"],
        });
        this.toggleErrorIndicator(false, elementId);
        return false;
      } else {
        this.toggleErrorIndicator(true, elementId);
        return true;
      }
      // if there isn't text, check if empty texts are allowed
    } else {
      if (testValidationRules["emptyAllowed"]) {
        this.toggleErrorIndicator(true, elementId);
        return true;
      } else {
        this.alertsService.createAlert({
          type: "Error",
          message: testValidationRules["errorMessages"]["zeroLength"],
        });
        this.toggleErrorIndicator(false, elementId);
        return false;
      }
    }
  }

  /*
  Function Name: toggleErrorIndicator()
  Function Description: Adds or removes error indicators from the text fields.
  Parameters: isValid (boolean) - whether or not the value is valid.
              elementId (string) - the ID of the HTML element of the text field.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleErrorIndicator(isValid: boolean, elementId: string) {
    // if the data isn't valid, alert the users
    if (!isValid) {
      document.getElementById(elementId)!.classList.add("missing");
      document.getElementById(elementId)!.setAttribute("aria-invalid", "true");
      // otherwise make sure it's set to false
    } else {
      // if the textfield was marked red, remove it
      if (document.getElementById(elementId)!.classList.contains("missing")) {
        document.getElementById(elementId)!.classList.remove("missing");
      }
      document.getElementById(elementId)!.setAttribute("aria-invalid", "false");
    }
  }
}
