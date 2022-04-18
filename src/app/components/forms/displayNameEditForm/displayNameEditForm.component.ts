/*
	DisplayNameEditForm
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
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

// App-related import
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'display-name-edit-form',
  templateUrl: './displayNameEditForm.component.html'
})
export class DisplayNameEditForm implements OnInit {
  // type of item to edit
  @Input() toEdit: string | undefined;
  // item to edit
  @Input() editedItem: any;
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Input() reportData: any;

  // CTOR
  constructor(
    public authService:AuthService,
    private adminService:AdminService,
    private alertsService:AlertsService
  ) {

  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks whether the user is editing from
                        the admin dashboard and determines the name to display as a result.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    this.editedItem = this.toEdit == 'user'
      ? this.authService.userData.displayName
      : this.editedItem;
  }

  /*
  Function Name: updateDisplayName()
  Function Description: Sends a request via the auth service to edit the user's display name.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newDisplayName (string) - A string containing the user's new name.
              closeReport (optional boolean) - whether to also close the report if the sender
                                               is the admin's report page.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateDisplayName(e:Event, newDisplayName:string, closeReport:boolean | null) {
    e.preventDefault();

    // if the name is valid, set it
    if(this.validateDisplayName(newDisplayName)) {
      // if the textfield was marked red, remove it
      this.toggleErrorIndicator(true);

      // if the user is editing their own name
      if(closeReport == null) {
        this.authService.userData.displayName = newDisplayName;
        this.authService.updateUserData();
      // if they're editing someone else's name from the reports page
      } else {
        let user = {
          userID: this.reportData.userID,
          displayName: newDisplayName
        }

        this.adminService.editUser(user, closeReport, this.reportData.reportID);
      }

      this.editMode.emit(false);
    }
  }


  /*
  Function Name: validateDisplayName()
  Function Description: Validates the display name to ensure it fits the rules.
  Parameters: newDisplayName (string) - A string containing the new display name.
  ----------------
  Programmer: Shir Bar Lev.
  */
  validateDisplayName(newDisplayName: string): boolean {
    // if there's a new display name in the textbox, change the display name
    if(newDisplayName) {
      // if the new display name is longer than 60 characters, alert the user
      if(newDisplayName.length > 60) {
        this.alertsService.createAlert({ type: 'Error', message: 'New display name cannot be over 60 characters! Please shorten the name and try again.' });
        this.toggleErrorIndicator(false);
        return false;
      } else {
        return true;
      }
    }
    // otherwise, alert the user that a display name can't be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New display name cannot be empty! Please fill the field and try again.' });
      this.toggleErrorIndicator(false);
      return false;
    }
  }

  /*
  Function Name: toggleErrorIndicator()
  Function Description: Adds or removes error indicators from the text fields.
  Parameters: isValid (boolean) - whether or not the value is valid.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleErrorIndicator(isValid: boolean) {
    // if the data isn't valid, alert the users
    if(!isValid) {
      document.getElementById('displayName')!.classList.add('missing');
      document.getElementById('displayName')!.setAttribute('aria-invalid', 'true');
    // otherwise make sure it's set to false
    } else {
      // if the textfield was marked red, remove it
      if(document.getElementById('displayName')!.classList.contains('missing')) {
        document.getElementById('displayName')!.classList.remove('missing');
      }
      document.getElementById('displayName')!.setAttribute('aria-invalid', 'false');
    }
  }
}
