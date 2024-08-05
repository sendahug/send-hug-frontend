/*
	Validation Service
	Send a Hug Service
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
import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

type ValidatableItems = "post" | "message" | "displayName" | "reportOther";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  private zeroLengthTemplate = "cannot be empty. Please fill the field and try again.";
  private tooLongTemplate = "cannot be over {0} characters! Please shorten it and try again.";
  validationRules = {
    post: {
      max: 480,
      required: true,
      editedItem: "Post text",
    },
    message: {
      max: 480,
      required: true,
      editedItem: "A message",
    },
    displayName: {
      max: 60,
      required: true,
      editedItem: "New display name",
    },
    reportOther: {
      max: 120,
      required: true,
      editedItem: "Report reason",
    },
  };

  // CTOR
  constructor() {}

  /*
  Function Name: validateItemAgainst()
  Function Description: Validates the given item to ensure it fits the rules.
  Parameters: typeOfTest (ValidatableItems) - the type of item being tested
  ----------------
  Programmer: Shir Bar Lev.
  */
  validateItemAgainst(typeOfTest: ValidatableItems): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentValue = control.value;
      const testValidationRules = this.validationRules[typeOfTest];

      // if there's no text and it's required, return an error
      if (!currentValue && testValidationRules["required"])
        return { error: `${testValidationRules["editedItem"]} ${this.zeroLengthTemplate}` };

      if (currentValue && currentValue.length > testValidationRules["max"]) {
        const errorMessage = this.tooLongTemplate.replace(
          "{0}",
          testValidationRules["max"].toString(),
        );

        return { error: `${testValidationRules["editedItem"]} ${errorMessage}` };
      }

      return null;
    };
  }
}
