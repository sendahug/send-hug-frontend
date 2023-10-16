/*
	ReportForm
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
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

// App-related import
import { Post } from "@app/interfaces/post.interface";
import { Report } from "@app/interfaces/report.interface";
import { OtherUser } from "@app/interfaces/otherUser.interface";
import { AuthService } from "@app/services/auth.service";
import { ItemsService } from "@app/services/items.service";
import { AlertsService } from "@app/services/alerts.service";
import { ValidationService } from "@app/services/validation.service";

// Reasons for submitting a report
enum postReportReasons {
  Inappropriate,
  Spam,
  Offensive,
  Other,
}
enum userReportReasons {
  Spam,
  "harmful / dangerous content",
  "abusive manner",
  Other,
}

const reportReasonsText = {
  Post: {
    0: "It is inppopriate.",
    1: "It is spam.",
    2: "It is offensive.",
    3: "Other:",
  },
  User: {
    0: "They are posting spam.",
    1: "They are posting harmful / dangerous content.",
    2: "They are behaving in an abusive manner.",
    3: "Other:",
  },
};

@Component({
  selector: "report-form",
  templateUrl: "./reportForm.component.html",
})
export class ReportForm {
  // indicates whether edit/delete mode is still required
  @Output() reportMode = new EventEmitter<boolean>();
  // reported post
  @Input() reportedItem: Post | OtherUser | undefined;
  // type of item to report
  @Input() reportType: "User" | "Post" | undefined;
  reportReasonsText = reportReasonsText;
  reportForm = this.fb.group({
    selectedReason: this.fb.control(undefined as string | undefined, [Validators.required]),
    otherReason: this.fb.control({ value: undefined as string | undefined, disabled: true }),
  });

  // CTOR
  constructor(
    public authService: AuthService,
    private itemsService: ItemsService,
    private alertsService: AlertsService,
    private validationService: ValidationService,
    private fb: FormBuilder,
  ) {}

  /*
  Function Name: checkSelectedForOther()
  Function Description: Checks whether to enable or disable the 'other'
                        text input, based on the selected reason.
  Parameters: selectedItem (number) - the ID of the slected option.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkSelectedForOther(selectedItem: string | number) {
    selectedItem = Number(selectedItem);

    // If the selected reason is one of the set reasons, simply send it as is
    if (selectedItem <= 2) {
      this.reportForm.get("otherReason")?.disable();
    }
    // If the user chose to put their own input, take that as the reason
    else {
      this.reportForm.get("otherReason")?.enable();
    }
  }

  /**
   * Gets the reason text from the enums above to match
   * the selected reason.
   * @returns the text of the selected reason or undefined if none is selected.
   */
  getSelectedReasonText() {
    const selectedItem = this.reportForm.get("selectedReason")?.value;

    if (selectedItem == null || selectedItem == undefined) {
      return undefined;
    } else {
      const selectedItemNumber = Number(selectedItem);

      if (selectedItemNumber < 3) {
        // if the item being reported is a post
        if (this.reportType == "Post") {
          return `The post is ${postReportReasons[selectedItemNumber]}`;
        }
        // if the item being reported is a user
        else {
          if (selectedItemNumber == 2) {
            return `The user is behaving in an ${userReportReasons[selectedItemNumber]}`;
          } else {
            return `The user is posting ${userReportReasons[selectedItemNumber]}`;
          }
        }
      } else {
        return "other";
      }
    }
  }

  /*
  Function Name: reportPost()
  Function Description: Creates a report and passes it on to the items service.
                        The method is triggered by pressing the 'report' button
                        in the report popup.
  Parameters: e (Event) - clicking the report button.
  ----------------
  Programmer: Shir Bar Lev.
  */
  createReport(e: Event) {
    e.preventDefault();
    let item =
      this.reportType == "User" ? (this.reportedItem as OtherUser) : (this.reportedItem as Post);
    let reportReason = this.getSelectedReasonText();

    // if the selected reason for the report is 'other', get the value of the text inputted
    if (reportReason == "other") {
      const otherReasonValue = this.reportForm.get("otherReason")?.value;
      const isValid = this.validationService.validateItem(
        "reportOther",
        otherReasonValue || "",
        "rOption3Text",
      );
      // if the input is valid, get the value
      if (!isValid) {
        this.alertsService.createAlert({
          type: "Error",
          message: "If you choose 'other', you must specify a reason.",
        });
        return;
      }

      reportReason = otherReasonValue!;
    }

    // create a new report
    let report: Report = {
      type: this.reportType as "Post" | "User",
      userID: 0,
      postID: undefined,
      reporter: this.authService.userData.id!,
      reportReason: reportReason!,
      date: new Date(),
      dismissed: false,
      closed: false,
    };

    if (this.reportType == "Post") {
      report["userID"] = (item as Post).userId;
      report["postID"] = (item as Post).id;
    } else {
      report["userID"] = (item as OtherUser).id;
    }

    // pass it on to the items service to send
    this.itemsService.sendReport(report);
    this.reportMode.emit(false);
  }
}
