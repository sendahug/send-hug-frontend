/*
	ReportForm
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

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
import { Component, Input, Output, EventEmitter } from '@angular/core';

// App-related import
import { Post } from '../../../interfaces/post.interface';
import { Report } from '../../../interfaces/report.interface';
import { OtherUser } from '../../../interfaces/otherUser.interface';
import { AuthService } from '../../../services/auth.service';
import { ItemsService } from '../../../services/items.service';
import { AlertsService } from '../../../services/alerts.service';

// Reasons for submitting a report
enum postReportReasons { Inappropriate, Spam, Offensive, Other };
enum userReportReasons { Spam, Harmful, Abusive, Other };

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
  }
};

@Component({
  selector: 'report-form',
  templateUrl: './reportForm.component.html'
})
export class ReportForm {
  // indicates whether edit/delete mode is still required
  @Output() reportMode = new EventEmitter<boolean>();
  // reported post
  @Input() reportedItem: Post | OtherUser | undefined;
  // type of item to report
  @Input() reportType: 'User' | 'Post' | undefined;
  selectedReason: string | undefined;
  reportReasonsText = reportReasonsText;

  // CTOR
  constructor(
    public authService:AuthService,
    private itemsService:ItemsService,
    private alertsService:AlertsService
  ) {

  }

  /*
  Function Name: setSelected()
  Function Description: Sets the selected reason for reporting the post. The method is
                        triggered by the user checking radio buttons.
  Parameters: selectedItem (number) - the ID of the slected option.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setSelected(selectedItem:string | number) {
    selectedItem = Number(selectedItem);
    let otherText = document.getElementById('rOption3Text') as HTMLInputElement;

    // If the selected reason is one of the set reasons, simply send it as is
    if(selectedItem == 0 || selectedItem == 1 || selectedItem == 2) {
      // if the item being reported is a post
      if(this.reportType == 'Post') {
        this.selectedReason = `The post is ${postReportReasons[selectedItem]}`;
      }
      // if the item being reported is a user
      else {
        if(selectedItem == 2) {
          this.selectedReason = `The user is behaving in an ${userReportReasons[selectedItem]}`;
        }
        else {
          this.selectedReason = `The user is posting ${userReportReasons[selectedItem]}`;
        }
      }

      otherText.disabled = true;
      otherText.required = false;
      otherText.setAttribute('aria-required', 'false');
    }
    // If the user chose to put their own input, take that as the reason
    else {
      otherText.disabled = false;
      otherText.required = true;
      this.selectedReason = 'other';
      otherText.setAttribute('aria-required', 'true');
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
  createReport(e:Event) {
    e.preventDefault();
    let item = this.reportType == 'User' ? this.reportedItem as OtherUser : this.reportedItem as Post;
    let otherText = document.getElementById('rOption3Text') as HTMLInputElement;

    // if the selected reason for the report is 'other', get the value of the text inputted
    if(this.selectedReason == 'other') {
      // if the input is valid, get the value
      if(this.validateOtherField(otherText)) {
        this.toggleErrorIndicator(true, otherText);
        this.selectedReason = otherText.value;
      }
    }

    // create a new report
    let report: Report = {
      type: this.reportType as 'Post' | 'User',
      userID: 0,
      postID: undefined,
      reporter: this.authService.userData.id!,
      reportReason: this.selectedReason!,
      date: new Date(),
      dismissed: false,
      closed: false
    }

    if(this.reportType == 'Post') {
      report['userID'] = (item as Post).userId;
      report['postID'] = (item as Post).id;
    } else {
      report['userID'] = (item as OtherUser).id;
    }

    // pass it on to the items service to send
    this.itemsService.sendReport(report);
    this.reportMode.emit(false);
  }

  /*
  Function Name: validateOtherField()
  Function Description: Validates the text in the passed in textfield.
  Parameters: otherText (HTMLInputElement) - the input to work with.
  ----------------
  Programmer: Shir Bar Lev.
  */
  validateOtherField(otherText: HTMLInputElement): boolean {
    if(otherText.value) {
      // if the report reason is longer than 120 characters, alert the user
      if(otherText.value.length > 120) {
        this.alertsService.createAlert({ type: 'Error', message: 'Report reason cannot be over 120 characters! Please shorten the message and try again.' });
        this.toggleErrorIndicator(false, otherText);
        return false;
      } else {
        return true;
      }
    }
    // if there's no text, alert the user that it's mandatory
    else {
      this.alertsService.createAlert({ message: 'The \'other\' field cannot be empty.', type: 'Error' });
      this.toggleErrorIndicator(false, otherText);
      return false;
    }
  }

  /*
  Function Name: toggleErrorIndicator()
  Function Description: Adds or removes error indicators from the text fields.
  Parameters: isValid (boolean) - whether or not the value is valid.
              otherText (HTMLInputElement) - the input to work with.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleErrorIndicator(isValid: boolean, otherText: HTMLInputElement) {
    // if the data is valid, delete the 'missing' class to turn red colour off
    if(isValid) {
      if(otherText.classList.contains('missing')) {
        otherText.classList.remove('missing');
      }
    // if the data isn't valid, alert the users
    } else {
      otherText.classList.add('missing');
    }
  }
}
