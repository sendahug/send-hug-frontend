/*
	Icon Editor
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

import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { AuthService } from "@app/services/auth.service";
import { iconCharacters } from "@app/interfaces/types";
import { User } from "@app/interfaces/user.interface";
import { DefaultColours, UserIcon } from "@app/components/userIcon/userIcon.component";
import BearIconSrc from "@/assets/img/bear.svg";
import KittyIconSrc from "@/assets/img/kitty.svg";
import DogIconSrc from "@/assets/img/dog.svg";

@Component({
  selector: "app-icon-editor",
  templateUrl: "./iconEditor.component.html",
  styleUrl: "./iconEditor.component.less",
  standalone: true,
  imports: [ReactiveFormsModule, UserIcon],
})
export class IconEditor {
  BearIconSrc = BearIconSrc;
  KittyIconSrc = KittyIconSrc;
  DogIconSrc = DogIconSrc;
  // form for the icon editor
  iconEditForm = this.fb.group({
    selectedIcon: [this.authService.userData()?.selectedIcon || "kitty", Validators.required],
    characterColour: [
      this.authService.userData()?.iconColours.character || DefaultColours["kitty"].character,
      Validators.required,
    ],
    lbgColour: [
      this.authService.userData()?.iconColours.lbg || DefaultColours["kitty"].lbg,
      Validators.required,
    ],
    rbgColour: [
      this.authService.userData()?.iconColours.rbg || DefaultColours["kitty"].rbg,
      Validators.required,
    ],
    itemColour: [
      this.authService.userData()?.iconColours.item || DefaultColours["kitty"].item,
      Validators.required,
    ],
  });
  // indicates whether edit mode is still required
  @Output() editMode = new EventEmitter<boolean>();

  // CTOR
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.iconEditForm.controls.selectedIcon.valueChanges.subscribe((newValue) => {
      this.iconEditForm.controls.characterColour.setValue(
        DefaultColours[newValue as iconCharacters].character,
      );
      this.iconEditForm.controls.lbgColour.setValue(DefaultColours[newValue as iconCharacters].lbg);
      this.iconEditForm.controls.rbgColour.setValue(DefaultColours[newValue as iconCharacters].rbg);
      this.iconEditForm.controls.itemColour.setValue(
        DefaultColours[newValue as iconCharacters].item,
      );
    });
  }

  /*
  Function Name: updateIcon()
  Function Description: Updates the current user's icon.
  Parameters: event (Event) - Click event on the 'update icon' button.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateIcon(event: Event) {
    event.preventDefault();

    const updatedUser: Partial<User> = {};

    // set the userService with the new icon data
    updatedUser.selectedIcon = this.iconEditForm.controls.selectedIcon.value || "kitty";
    updatedUser.iconColours = {
      character:
        this.iconEditForm.controls.characterColour.value || DefaultColours["kitty"].character,
      lbg: this.iconEditForm.controls.lbgColour.value || DefaultColours["kitty"].lbg,
      rbg: this.iconEditForm.controls.rbgColour.value || DefaultColours["kitty"].rbg,
      item: this.iconEditForm.controls.itemColour.value || DefaultColours["kitty"].item,
    };

    // update the backend
    this.authService.updateUserData(updatedUser);
    this.editMode.emit(false);
  }

  /*
  Function Name: dismiss()
  Function Description: Closes the edit panel.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  dismiss() {
    this.editMode.emit(false);
  }
}
