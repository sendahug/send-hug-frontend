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
import { FormBuilder, Validators } from "@angular/forms";

import { AuthService } from "@common/services/auth.service";
import { iconCharacters, iconElements } from "@app/interfaces/types";

@Component({
  selector: "app-icon-editor",
  templateUrl: "./iconEditor.component.html",
})
export class IconEditor {
  iconDefaults = {
    selectedIcon: "kitty",
    characterColour: "#BA9F93",
    lbgColour: "#E2A275",
    rbgColour: "#F8EEE4",
    itemColour: "#F4B56A",
  };
  // form for the icon editor
  iconEditForm = this.fb.group({
    selectedIcon: [
      this.authService.userData()?.selectedIcon ||
        (this.iconDefaults.characterColour as iconCharacters),
      Validators.required,
    ],
    characterColour: [
      this.authService.userData()?.iconColours.character || this.iconDefaults.characterColour,
      Validators.required,
    ],
    lbgColour: [
      this.authService.userData()?.iconColours.lbg || this.iconDefaults.lbgColour,
      Validators.required,
    ],
    rbgColour: [
      this.authService.userData()?.iconColours.rbg || this.iconDefaults.rbgColour,
      Validators.required,
    ],
    itemColour: [
      this.authService.userData()?.iconColours.item || this.iconDefaults.itemColour,
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
    this.iconEditForm.controls.characterColour.valueChanges.subscribe((newValue) =>
      this.showNewColour(newValue as string, "character"),
    );
    this.iconEditForm.controls.lbgColour.valueChanges.subscribe((newValue) =>
      this.showNewColour(newValue as string, "lbg"),
    );
    this.iconEditForm.controls.rbgColour.valueChanges.subscribe((newValue) =>
      this.showNewColour(newValue as string, "rbg"),
    );
    this.iconEditForm.controls.itemColour.valueChanges.subscribe((newValue) =>
      this.showNewColour(newValue as string, "item"),
    );
  }

  /*
  Function Name: showNewColour()
  Function Description: Updates the colour of the selected icon element in the icon itself without
                        updating the saved colours (in the iconColours array). This method is
                        executed upon every input() event.
  Parameters: newValue (String) - The value of the selected colour.
              element - the element that needs to be recoloured.
  ----------------
  Programmer: Shir Bar Lev.
  */
  showNewColour(newValue: string, element: iconElements) {
    // update the image
    document
      .querySelectorAll(".selectedCharacter")[0]
      .querySelectorAll(`.${element}`)
      .forEach((path: Element) => {
        (path as SVGPathElement).setAttribute("style", `fill:${newValue};`);
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

    // set the userService with the new icon data
    this.authService.userData()!.selectedIcon =
      this.iconEditForm.controls.selectedIcon.value ||
      (this.iconDefaults.selectedIcon as iconCharacters);
    this.authService.userData()!.iconColours = {
      character:
        this.iconEditForm.controls.characterColour.value || this.iconDefaults.characterColour,
      lbg: this.iconEditForm.controls.lbgColour.value || this.iconDefaults.lbgColour,
      rbg: this.iconEditForm.controls.rbgColour.value || this.iconDefaults.rbgColour,
      item: this.iconEditForm.controls.itemColour.value || this.iconDefaults.itemColour,
    };

    // update the backend
    this.authService.updateUserData();
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
