/*
	User Icon
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

import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";

import { iconCharacters, iconElements } from "@app/interfaces/types";
import BgPatternSrc from "@/assets/img/bg_pattern.svg";

export const DefaultColours = {
  bear: {
    character: "#fefefe",
    lbg: "#c2aa8f",
    rbg: "#f0f0f0",
    item: "#82b030",
  },
  kitty: {
    character: "#ba9f93",
    lbg: "#e2a275",
    rbg: "#f8eee4",
    item: "#f4b56a",
  },
  dog: {
    character: "#cebba9",
    lbg: "#c2aa8f",
    rbg: "#ededed",
    item: "#42aef0",
  },
};

@Component({
  selector: "app-user-icon",
  templateUrl: "./userIcon.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class UserIcon {
  selectedIcon = input<iconCharacters>("kitty");
  characterColour = input<string | undefined>(undefined);
  lbgColour = input<string | undefined>(undefined);
  rbgColour = input<string | undefined>(undefined);
  itemColour = input<string | undefined>(undefined);
  svgClass = input<string>("");
  BgPatternSrc = BgPatternSrc;

  // CTOR
  constructor() {}

  /**
   * Gets the fill colour for the given element.
   * @param element - the part of the icon to colour.
   * @returns an object with `fill` to include in the element's style.
   */
  getElementStyle(element: iconElements) {
    let elementColour: string;
    const defaultColours = DefaultColours[this.selectedIcon()];

    switch (element) {
      case "character":
        elementColour = this.characterColour() ?? defaultColours.character;
        break;
      case "lbg":
        elementColour = this.lbgColour() ?? defaultColours.lbg;
        break;
      case "rbg":
        elementColour = this.rbgColour() ?? defaultColours.rbg;
        break;
      case "item":
        elementColour = this.itemColour() ?? defaultColours.item;
        break;
    }

    return { fill: elementColour };
  }
}
