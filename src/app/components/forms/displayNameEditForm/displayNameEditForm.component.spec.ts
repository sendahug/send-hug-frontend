/*
	Popup
	Send a Hug Component Tests
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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

import { DisplayNameEditForm } from "./displayNameEditForm.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";

// DISPLAY NAME EDIT
// ==================================================================
describe("DisplayNameEditForm", () => {
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
      declarations: [DisplayNameEditForm],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData = { ...mockAuthedUser };
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    expect(popUp).toBeTruthy();
  });

  it("should set editedItem depending on toEdit", () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    popUp.toEdit = "user";
    popUp.ngOnInit();

    expect(popUp.editNameForm.get("newDisplayName")?.value).toEqual(
      popUp.authService.userData.displayName,
    );

    popUp.toEdit = "other user";
    popUp.editedItem = "test";
    popUp.ngOnInit();

    expect(popUp.editedItem).toEqual("test");
  });

  it("should make the request to authService to change the name", () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = "user";
    popUp.editedItem = {
      id: 4,
      displayName: "name",
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: "admin",
    };
    const newName = "new name";
    fixture.detectChanges();

    const validateSpy = spyOn(popUp["validationService"], "validateItem").and.returnValue(true);
    const updateSpy = spyOn(popUp.authService, "updateUserData");
    const emitSpy = spyOn(popUp.editMode, "emit");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName", newName, "displayName");
    expect(popUp.authService.userData.displayName).toEqual(newName);
    expect(updateSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it("should make the request to adminService to change the name - close report", () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = "other user";
    popUp.editedItem = {
      id: 4,
      displayName: "name",
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: "admin",
    };
    popUp.reportData = {
      reportID: 1,
      userID: 4,
    };
    const newName = "new name";
    fixture.detectChanges();

    const validateSpy = spyOn(popUp["validationService"], "validateItem").and.returnValue(true);
    const updateSpy = spyOn(popUp["adminService"], "editUser");
    const emitSpy = spyOn(popUp.editMode, "emit");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName", newName, "displayName");
    expect(updateSpy).toHaveBeenCalledWith(
      {
        userID: 4,
        displayName: newName,
      },
      true,
      1,
    );
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it("should make the request to adminService to change the name - don't close report", () => {
    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = "other user";
    popUp.editedItem = {
      id: 4,
      displayName: "name",
      receivedHugs: 2,
      givenHugs: 2,
      postsNum: 2,
      loginCount: 3,
      role: "admin",
    };
    popUp.reportData = {
      reportID: 1,
      userID: 4,
    };
    const newName = "new name";
    fixture.detectChanges();

    const validateSpy = spyOn(popUp["validationService"], "validateItem").and.returnValue(true);
    const updateSpy = spyOn(popUp["adminService"], "editUser");
    const emitSpy = spyOn(popUp.editMode, "emit");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[1].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName", newName, "displayName");
    expect(updateSpy).toHaveBeenCalledWith(
      {
        userID: 4,
        displayName: newName,
      },
      false,
      1,
    );
    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
