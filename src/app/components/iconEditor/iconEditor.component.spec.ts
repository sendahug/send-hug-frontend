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
import { RouterModule } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";

import { IconEditor } from "./iconEditor.component";
import { AuthService } from "../../services/auth.service";
import { mockAuthedUser } from "@tests/mockData";

describe("IconEditor", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
        ReactiveFormsModule,
      ],
      declarations: [IconEditor],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    // trigger login
    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData = { ...mockAuthedUser };
  });

  // Check the page is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    expect(iconEditor).toBeTruthy();
  });

  // Check the variables are set correctly
  it("should get the icon data from the AuthService", () => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;

    expect(iconEditor.iconEditForm.controls.selectedIcon.value).toBe("kitty");
    expect(iconEditor.iconEditForm.controls.characterColour.value).toBe("#BA9F93");
    expect(iconEditor.iconEditForm.controls.lbgColour.value).toBe("#e2a275");
    expect(iconEditor.iconEditForm.controls.rbgColour.value).toBe("#f8eee4");
    expect(iconEditor.iconEditForm.controls.itemColour.value).toBe("#f4b56a");
  });

  // Check the icon changes when the radio button is clicked
  it("should change icon when radio buttons are clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.iconEditForm.controls.selectedIcon.value).toBe("kitty");

    iconEditorDOM.querySelector("#cRadioOption1").click();
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.iconEditForm.controls.selectedIcon.value).toBe("bear");

    iconEditorDOM.querySelector("#cRadioOption3").click();
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.iconEditForm.controls.selectedIcon.value).toBe("dog");
    done();
  });

  it("should update the colours when clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.iconEditForm.controls.characterColour.value).toBe("#BA9F93");
    expect(iconEditor.iconEditForm.controls.lbgColour.value).toBe("#e2a275");
    expect(iconEditor.iconEditForm.controls.rbgColour.value).toBe("#f8eee4");
    expect(iconEditor.iconEditForm.controls.itemColour.value).toBe("#f4b56a");

    // change the character colour
    iconEditorDOM.querySelector("#characterC").value = "#000000";
    iconEditorDOM.querySelector("#characterC").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.characterColour.value).toBe("#000000");
    iconEditorDOM.querySelectorAll(".character").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe("fill:#000000;");
    });

    // change the left background colour
    iconEditorDOM.querySelector("#lbgColour").value = "#121212";
    iconEditorDOM.querySelector("#lbgColour").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.lbgColour.value).toBe("#121212");
    iconEditorDOM.querySelectorAll(".lbg").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe("fill:#121212;");
    });

    // change the right background colour
    iconEditorDOM.querySelector("#rbgColour").value = "#ffffff";
    iconEditorDOM.querySelector("#rbgColour").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.rbgColour.value).toBe("#ffffff");
    iconEditorDOM.querySelectorAll(".rbg").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe("fill:#ffffff;");
    });

    // change the item colour
    iconEditorDOM.querySelector("#itemColour").value = "#e1e1e1";
    iconEditorDOM.querySelector("#itemColour").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.itemColour.value).toBe("#e1e1e1");
    iconEditorDOM.querySelectorAll(".item").forEach((path: SVGPathElement) => {
      expect(path.getAttribute("style")).toBe("fill:#e1e1e1;");
    });
    done();
  });

  it("should make the request to change the icon", (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    const updateSpy = spyOn(iconEditor.authService, "updateUserData");
    const dismissSpy = spyOn(iconEditor.editMode, "emit");
    fixture.detectChanges();

    // before the update
    expect(iconEditor.authService.userData.selectedIcon).toBe("kitty");
    expect(iconEditor.authService.userData.iconColours.character).toBe("#BA9F93");
    expect(iconEditor.authService.userData.iconColours.lbg).toBe("#e2a275");
    expect(iconEditor.authService.userData.iconColours.rbg).toBe("#f8eee4");
    expect(iconEditor.authService.userData.iconColours.item).toBe("#f4b56a");

    // update the icon and colours
    iconEditorDOM.querySelector("#cRadioOption1").click();
    iconEditor.iconEditForm.controls.characterColour.setValue("#000000");
    iconEditor.iconEditForm.controls.lbgColour.setValue("#000000");
    iconEditor.iconEditForm.controls.rbgColour.setValue("#000000");
    iconEditor.iconEditForm.controls.itemColour.setValue("#000000");

    // after the update
    iconEditorDOM.querySelectorAll(".iconButton")[1].click();
    expect(iconEditor.authService.userData.selectedIcon).toBe("bear");
    expect(iconEditor.authService.userData.iconColours.character).toBe("#000000");
    expect(iconEditor.authService.userData.iconColours.lbg).toBe("#000000");
    expect(iconEditor.authService.userData.iconColours.rbg).toBe("#000000");
    expect(iconEditor.authService.userData.iconColours.item).toBe("#000000");
    expect(updateSpy).toHaveBeenCalled();
    expect(dismissSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("should dismiss the editor when the cancel button is clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    const dismissSpy = spyOn(iconEditor.editMode, "emit");
    fixture.detectChanges();

    iconEditorDOM.querySelectorAll(".iconButton")[1].click();
    expect(dismissSpy).toHaveBeenCalledWith(false);
    done();
  });
});
