/*
	Icon Editor
	Send a Hug Component Tests
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

import { TestBed } from "@angular/core/testing";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { CommonModule } from "@angular/common";
import { Component, NO_ERRORS_SCHEMA, provideZoneChangeDetection, signal } from "@angular/core";
import { By } from "@angular/platform-browser";

import { UserIcon } from "./userIcon.component";
import { DefaultColours } from "./userIcon.component";
import { iconCharacters } from "@app/interfaces/types";

@Component({
  selector: "icon-container",
  template: `
    <div>
      <app-user-icon
        [selectedIcon]="selectedIcon()"
        [characterColour]="characterColour()"
        [lbgColour]="lbgColour()"
        [rbgColour]="rbgColour()"
        [itemColour]="itemColour()"
        [svgClass]="'selectedCharacter'"
      />
    </div>
  `,
  standalone: true,
  imports: [UserIcon],
  schemas: [NO_ERRORS_SCHEMA],
})
class MockIconContainer {
  selectedIcon = signal("kitty" as iconCharacters);
  characterColour = signal(DefaultColours.kitty["character"]);
  lbgColour = signal(DefaultColours.kitty["lbg"]);
  rbgColour = signal(DefaultColours.kitty["rbg"]);
  itemColour = signal(DefaultColours.kitty["item"]);

  constructor() {
    this.selectedIcon.set("kitty");
  }
}

describe("IconEditor", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, MockIconContainer, UserIcon],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
      ],
    }).compileComponents();
  });

  // Check the page is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(UserIcon);
    const userIcon = fixture.componentInstance;
    expect(userIcon).toBeTruthy();
  });

  it("should set the colours based on the incoming colours", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MockIconContainer);
    const userIcon = fixture.debugElement.query(By.css("app-user-icon"));
    const userIconDOM = userIcon.nativeElement;
    fixture.detectChanges();

    // Check the initial colours
    // Angular converts hex codes to rgb for some reason, so...
    userIconDOM.querySelectorAll(".character").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe(`fill: rgb(186, 159, 147);`);
    });
    userIconDOM.querySelectorAll(".lbg").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe(`fill: rgb(226, 162, 117);`);
    });
    userIconDOM.querySelectorAll(".rbg").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe(`fill: rgb(248, 238, 228);`);
    });
    userIconDOM.querySelectorAll(".item").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe(`fill: rgb(244, 181, 106);`);
    });
    done();
  });
});
