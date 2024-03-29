/*
	DisplayNameEditForm
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
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

// App-related import
import { AuthService } from "@app/services/auth.service";
import { AdminService } from "@app/services/admin.service";
import { ValidationService } from "@app/services/validation.service";

@Component({
  selector: "display-name-edit-form",
  templateUrl: "./displayNameEditForm.component.html",
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
    public authService: AuthService,
    private adminService: AdminService,
    private validationService: ValidationService,
  ) {}

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
    this.editedItem =
      this.toEdit == "user" ? this.authService.userData.displayName : this.editedItem;
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
  updateDisplayName(e: Event, newDisplayName: string, closeReport: boolean | null) {
    e.preventDefault();

    // if the name is valid, set it
    if (this.validationService.validateItem("displayName", newDisplayName, "displayName")) {
      // if the user is editing their own name
      if (closeReport == null) {
        this.authService.userData.displayName = newDisplayName;
        this.authService.updateUserData();
        // if they're editing someone else's name from the reports page
      } else {
        let user = {
          userID: this.reportData.userID,
          displayName: newDisplayName,
        };

        this.adminService.editUser(user, closeReport, this.reportData.reportID);
      }

      this.editMode.emit(false);
    }
  }
}
