/*
	Icon Editor
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

import { AfterViewChecked, Component, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../../services/auth.service';

type iconCharacters = 'bear' | 'kitty' | 'dog';

@Component({
  selector: 'app-icon-editor',
  templateUrl: './iconEditor.component.html'
})
export class IconEditor implements AfterViewChecked {
  selectedIcon: iconCharacters;
  iconColours: {
    character: String,
    lbg: String,
    rbg: String,
    item: String
  } = {
    character: '',
    lbg: '',
    rbg: '',
    item: ''
  }
  // indicates whether edit mode is still required
  @Output() editMode = new EventEmitter<boolean>();

  // CTOR
  constructor(private authService:AuthService) {
    this.selectedIcon = this.authService.userData.selectedIcon;
    this.iconColours = {
      character: this.authService.userData.iconColours.character,
      lbg: this.authService.userData.iconColours.lbg,
      rbg: this.authService.userData.iconColours.rbg,
      item: this.authService.userData.iconColours.item
    }
  }

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is checked by Angular. It updates the user's icon according to the colours
                        chosen by the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    Object.keys(this.iconColours).forEach((key) => {
      if(document.querySelectorAll('.userIcon')[0]) {
        document.querySelectorAll('.userIcon')[0].querySelectorAll(`.${key as 'character' | 'lbg' | 'rbg' | 'item'}`).forEach(element => {
          (element as SVGPathElement).setAttribute('style', `fill:${this.iconColours[key as 'character' | 'lbg' | 'rbg' | 'item']};`);
        })
      }
    })
  }

  /*
  Function Name: setSelected()
  Function Description: Updates the selected character icon.
  Parameters: newIcon (iconCharacters) - The value of the new selected icon.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setSelected(newIcon:iconCharacters) {
    this.selectedIcon = newIcon;
  }

  /*
  Function Name: updateElementColour()
  Function Description: Updates the colour of the selected icon element (character, left background,
                        right background or the hand-held item).
  Parameters: newValue (String) - The value of the selected colour.
              element - the element that needs to be recoloured.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateElementColour(newValue:string, element:'character' | 'lbg' | 'rbg' | 'item') {
    this.iconColours[element] = newValue;

    // update the image
    document.querySelectorAll('.selectedCharacter')[0].querySelectorAll(`.${element}`).forEach((path:Element) => {
      (path as SVGPathElement).setAttribute('style', `fill:${newValue};`);
    })
  }

  /*
  Function Name: updateIcon()
  Function Description: Updates the current user's icon.
  Parameters: event (Event) - Click event on the 'update icon' button.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateIcon(event:Event) {
    event.preventDefault();

    // set the userService with the new icon data
    this.authService.userData.selectedIcon = this.selectedIcon;
    this.authService.userData.iconColours = this.iconColours;

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
