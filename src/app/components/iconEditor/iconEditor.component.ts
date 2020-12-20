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

import { Component } from '@angular/core';

type iconCharacters = 'bear' | 'kitty' | 'dog';

@Component({
  selector: 'icon-editor',
  templateUrl: './iconEditor.component.html'
})
export class IconEditor {
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

  // CTOR
  constructor() {
    this.selectedIcon = 'bear';
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
  }
}
