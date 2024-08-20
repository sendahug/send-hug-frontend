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
import { provideRouter } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { NO_ERRORS_SCHEMA, provideZoneChangeDetection, signal } from "@angular/core";

import { IconEditor } from "./iconEditor.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { UserIcon } from "@app/components/userIcon/userIcon.component";

describe("IconEditor", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
    });

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, UserIcon, IconEditor],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([]),
        MockAuthService,
      ],
    }).compileComponents();
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

    // change the left background colour
    iconEditorDOM.querySelector("#lbgColour").value = "#121212";
    iconEditorDOM.querySelector("#lbgColour").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.lbgColour.value).toBe("#121212");

    // change the right background colour
    iconEditorDOM.querySelector("#rbgColour").value = "#ffffff";
    iconEditorDOM.querySelector("#rbgColour").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.rbgColour.value).toBe("#ffffff");

    // change the item colour
    iconEditorDOM.querySelector("#itemColour").value = "#e1e1e1";
    iconEditorDOM.querySelector("#itemColour").dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(iconEditor.iconEditForm.controls.itemColour.value).toBe("#e1e1e1");
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
    expect(iconEditor.authService.userData()?.selectedIcon).toBe("kitty");
    expect(iconEditor.authService.userData()?.iconColours.character).toBe("#BA9F93");
    expect(iconEditor.authService.userData()?.iconColours.lbg).toBe("#e2a275");
    expect(iconEditor.authService.userData()?.iconColours.rbg).toBe("#f8eee4");
    expect(iconEditor.authService.userData()?.iconColours.item).toBe("#f4b56a");

    // update the icon and colours
    iconEditorDOM.querySelector("#cRadioOption1").click();
    iconEditor.iconEditForm.controls.characterColour.setValue("#000000");
    iconEditor.iconEditForm.controls.lbgColour.setValue("#000000");
    iconEditor.iconEditForm.controls.rbgColour.setValue("#000000");
    iconEditor.iconEditForm.controls.itemColour.setValue("#000000");

    // after the update
    iconEditorDOM.querySelectorAll(".iconButton")[1].click();
    expect(updateSpy).toHaveBeenCalledWith({
      selectedIcon: "bear",
      iconColours: {
        character: "#000000",
        lbg: "#000000",
        rbg: "#000000",
        item: "#000000",
      },
    });
    expect(dismissSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("should make the request to change the icon with default values if there are nonoe", (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    const updateSpy = spyOn(iconEditor.authService, "updateUserData");
    const dismissSpy = spyOn(iconEditor.editMode, "emit");
    iconEditor["authService"].userData.set({ ...mockAuthedUser });

    // update the icon and colours
    iconEditor.iconEditForm.controls.characterColour.setValue(null);
    iconEditor.iconEditForm.controls.lbgColour.setValue(null);
    iconEditor.iconEditForm.controls.rbgColour.setValue(null);
    iconEditor.iconEditForm.controls.itemColour.setValue(null);
    fixture.detectChanges();

    // after the update
    iconEditorDOM.querySelectorAll(".iconButton")[1].click();
    expect(updateSpy).toHaveBeenCalledWith({
      selectedIcon: "kitty",
      iconColours: {
        character: "#ba9f93",
        lbg: "#e2a275",
        rbg: "#f8eee4",
        item: "#f4b56a",
      },
    });
    expect(dismissSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("should dismiss the editor when the cancel button is clicked", (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    const emitSpy = spyOn(iconEditor.editMode, "emit");
    const dismissSpy = spyOn(iconEditor, "dismiss").and.callThrough();
    fixture.detectChanges();

    iconEditorDOM.querySelectorAll(".iconButton")[0].click();
    fixture.detectChanges();

    expect(dismissSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("should set the default values if no value is set", () => {
    const authService = TestBed.inject(AuthService);
    authService.userData.set({
      ...mockAuthedUser,
      // This shouldn't even be possible but just in case
      // @ts-ignore
      selectedIcon: "",
      iconColours: {
        character: "",
        lbg: "",
        rbg: "",
        item: "",
      },
    });

    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;

    expect(iconEditor.iconEditForm.controls.selectedIcon.value).toBe("kitty");
    expect(iconEditor.iconEditForm.controls.characterColour.value).toBe("#ba9f93");
    expect(iconEditor.iconEditForm.controls.lbgColour.value).toBe("#e2a275");
    expect(iconEditor.iconEditForm.controls.rbgColour.value).toBe("#f8eee4");
    expect(iconEditor.iconEditForm.controls.itemColour.value).toBe("#f4b56a");
  });
});
