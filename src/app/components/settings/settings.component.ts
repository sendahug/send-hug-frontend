/*
	Settings Page
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
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

// App-related imports
import { NotificationService } from "@app/services/notifications.service";
import { AuthService } from "@app/services/auth.service";
import { AlertsService } from "@app/services/alerts.service";
import { IconEditor } from "@app/components/iconEditor/iconEditor.component";
import { UserIcon } from "@app/components/userIcon/userIcon.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.less",
  standalone: true,
  imports: [CommonModule, IconEditor, UserIcon, ReactiveFormsModule, RouterLink],
})
export class SettingsPage {
  editIcon = false;
  editSettingsForm = this.fb.group({
    enableNotifications: [false],
    enableAutoRefresh: [false],
    notificationRate: [20],
  });

  // CTOR
  constructor(
    public notificationService: NotificationService,
    public authService: AuthService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
  ) {
    // TODO: There's got to be a better way to do this for refreshes...
    this.authService.isUserDataResolved.subscribe((value) => {
      if (value) {
        this.editSettingsForm.setValue({
          enableNotifications: this.authService.pushEnabled(),
          enableAutoRefresh: this.authService.autoRefresh(),
          notificationRate: this.authService.refreshRate(),
        });
      }
    });

    this.editSettingsForm.controls.enableAutoRefresh.valueChanges.subscribe(() => {
      this.updateNotificationRateValidators();
    });

    this.editSettingsForm.controls.notificationRate.valueChanges.subscribe(() => {
      this.setRateInvalidStatus();
    });
  }

  /*
  Function Name: toggleIconEditor()
  Function Description: Opens/closes the icon editor.
  Parameters: edit (boolean) - optional; is sent by the IconEditor's EventEmitter to trigger
                                closing the edit panel.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleIconEditor(edit?: boolean) {
    if (edit) {
      this.editIcon = edit;
    } else {
      this.editIcon = edit || false;
      document.getElementById("editIcon")?.focus();
    }
  }

  /**
   * Updates the user's settings based on the form values.
   */
  updateSettings() {
    const newRate = this.editSettingsForm.controls.notificationRate.value;
    const refreshStatus = this.editSettingsForm.controls.enableAutoRefresh.value || false;
    const pushStatus = this.editSettingsForm.controls.enableNotifications.value || false;

    // if there's no rate or it's zero, alert the user it can't be
    if ((!newRate || newRate <= 0) && refreshStatus) {
      this.alertsService.createAlert({
        type: "Error",
        message: "Refresh rate cannot be empty or zero. Please fill the field and try again.",
      });
    }

    if (this.editSettingsForm.valid) {
      this.authService
        .updateUserData({
          pushEnabled: pushStatus,
          autoRefresh: refreshStatus,
          refreshRate: Number(newRate),
        })
        .add(() => {
          this.alertsService.createSuccessAlert("Your settings have been updated!");

          if (refreshStatus) this.notificationService.startAutoRefresh(Number(newRate));
          else this.notificationService.stopAutoRefresh();

          if (pushStatus) this.notificationService.subscribeToStream();
          else this.notificationService.unsubscribeFromStream();
        });
    }
  }

  /**
   * Changes the validators of the rate field based on the auto-refresh status.
   * If auto-refresh is enabled, the rate field is required and must be higher than
   * 20 (seconds); otherwise it's not.
   */
  updateNotificationRateValidators() {
    if (this.editSettingsForm.controls.enableAutoRefresh.value) {
      this.editSettingsForm.controls.notificationRate.setValidators([
        Validators.required,
        Validators.min(20),
      ]);
    } else {
      this.editSettingsForm.controls.notificationRate.clearValidators();
    }

    this.setRateInvalidStatus();
  }

  /**
   * Sets the aria-invalid attribute of the rate field based on its validity.
   * TODO: We shouldn't have to do this manually, but it seems that process
   * of changing it is running too slowly, which causes an
   * ExpressionChangedAfterItHasBeenCheckedError error.
   */
  setRateInvalidStatus() {
    const currentRate = this.editSettingsForm.controls.notificationRate;

    if (this.editSettingsForm.controls.enableAutoRefresh.value === true) {
      if (currentRate && (!currentRate.value || (currentRate.value && currentRate.value < 20))) {
        document.querySelector("#notificationRate")?.setAttribute("aria-invalid", "true");
      } else {
        document.querySelector("#notificationRate")?.setAttribute("aria-invalid", "false");
      }
    } else {
      document.querySelector("#notificationRate")?.setAttribute("aria-invalid", "false");
    }
  }
}
