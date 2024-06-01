/*
	Send Hug Form
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
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

// App-related imports
import { AuthService } from "@common/services/auth.service";
import { AlertsService } from "@common/services/alerts.service";
import { ApiClientService } from "@common/services/apiClient.service";
import { ValidationService } from "@common/services/validation.service";
import { ItemsService } from "@common/services/items.service";

interface SendHugResponse {
  success: boolean;
  updated: string;
}

@Component({
  selector: "app-send-hug-form",
  templateUrl: "./sendHugForm.component.html",
})
export class SendHugForm implements OnInit {
  @Output() sendMode = new EventEmitter<boolean>();
  @Input() forUsername: string = "";
  @Input() forID?: number;
  @Input() postID?: number;
  sendHugForm = this.fb.group({
    messageFor: ["", Validators.required],
    sendMessage: [true],
    messageText: ["", [Validators.required, this.validationService.validateItemAgainst("message")]],
  });

  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private apiClient: ApiClientService,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private itemsService: ItemsService,
  ) {}

  /**
   * Angular's OnInit hook.
   */
  ngOnInit() {
    this.sendHugForm.controls.messageFor.setValue(this.forUsername);

    this.sendHugForm.controls.sendMessage.valueChanges.subscribe((newValue) =>
      this.updateTextValidators(newValue),
    );
  }

  /**
   * Updates the validators for the new message text and
   */
  updateTextValidators(newValue: boolean | null) {
    if (newValue) {
      this.sendHugForm.controls.messageText.enable();
      this.sendHugForm.controls.messageText.setValidators([
        Validators.required,
        this.validationService.validateItemAgainst("message"),
      ]);
    } else {
      this.sendHugForm.controls.messageText.disable();
      this.sendHugForm.controls.messageText.clearValidators();
    }
  }

  /**
   *
   */
  sendHugAndMessage() {
    const messageText = this.sendHugForm.controls.messageText.value || "";

    if (!this.sendHugForm.valid) {
      this.alertsService.createAlert({
        type: "Error",
        message: this.sendHugForm.controls.messageText.errors?.error,
      });
      return;
    }

    // if there's no logged in user, alert the user
    if (!this.authService.authenticated()) {
      this.alertsService.createAlert({
        type: "Error",
        message: "You're currently logged out. Log back in to send a message.",
      });
      return;
    }

    // if the user is attempting to send a message to themselves
    if (this.authService.userData()!.id == Number(this.forID)) {
      this.alertsService.createAlert({
        type: "Error",
        message: "You can't send a message to yourself!",
      });
      return;
    }

    if (!this.postID) {
      this.alertsService.createAlert({
        type: "Error",
        message: "A post ID is required to send a hug for a post.",
      });
      return;
    }

    this.apiClient
      .post<SendHugResponse>(`posts/${this.postID}/hugs`, { messageText: messageText })
      .subscribe({
        next: (response) => {
          this.alertsService.createSuccessAlert(response.updated);
          // Alert the posts that this item received a hug
          this.itemsService.receivedAHug.next(this.postID!);
          this.sendMode.emit(false);
        },
      });
  }
}
