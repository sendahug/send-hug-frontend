/*
	Popup
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
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { provideZoneChangeDetection, signal } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { Subscription } from "rxjs";

import { DisplayNameEditForm } from "./displayNameEditForm.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { PopUp } from "@common/popUp/popUp.component";
import { ValidationService } from "@app/services/validation.service";
import { AdminService } from "@app/services/admin.service";
import { TeleportDirective } from "@app/directives/teleport.directive";

// DISPLAY NAME EDIT
// ==================================================================
describe("DisplayNameEditForm", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const AuthServiceMock = MockProvider(AuthService, {
      authenticated: signal(true),
      userData: signal({ ...mockAuthedUser }),
    });
    const AdminServiceMock = MockProvider(AdminService);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, PopUp, DisplayNameEditForm, TeleportDirective],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        AuthServiceMock,
        AdminServiceMock,
      ],
    }).compileComponents();
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
    popUp.editedItem = {
      id: 4,
      displayName: "name",
    };
    popUp.ngOnInit();

    expect(popUp.editNameForm.controls.newDisplayName.value).toEqual(
      popUp.authService.userData()!.displayName,
    );

    popUp.editedItem = {
      displayName: "test",
      id: 1,
    };
    popUp.ngOnInit();

    expect(popUp.editedItem.displayName).not.toEqual(popUp.authService.userData()!.displayName);
  });

  it("should make the request to authService to change the name", () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.editedItem = {
      id: 4,
      displayName: "name",
    };
    const newName = "new name";
    fixture.detectChanges();

    const updateSpy = spyOn(popUp.authService, "updateUserData");
    const emitSpy = spyOn(popUp.editMode, "emit");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName");
    expect(updateSpy).toHaveBeenCalledWith({ displayName: newName });
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it("should make the request to adminService to change the name - close report", () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.editedItem = {
      id: 2,
      displayName: "name",
    };
    popUp.reportData = {
      reportID: 1,
      userID: 2,
    };
    const newName = "new name";
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();
    fixture.detectChanges();

    const updateSpy = spyOn(popUp["adminService"], "editUser").and.returnValue(mockSubscription);
    const emitSpy = spyOn(popUp.editMode, "emit");
    const updatedDetailsSpy = spyOn(popUp.updatedDetails, "emit");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName");
    expect(updateSpy).toHaveBeenCalledWith(
      {
        id: 2,
        displayName: newName,
      },
      true,
      1,
    );
    expect(emitSpy).toHaveBeenCalledWith(false);
    expect(updatedDetailsSpy).toHaveBeenCalledWith({
      displayName: newName,
      closed: true,
      reportID: 1,
    });
  });

  it("should raise an error if trying to update another user's name without a report", () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.editedItem = {
      id: 2,
      displayName: "name",
    };
    popUp.reportData = undefined;
    const newName = "new name";
    fixture.detectChanges();

    const updateSpy = spyOn(popUp["adminService"], "editUser");
    const emitSpy = spyOn(popUp.editMode, "emit");
    const updatedDetailsSpy = spyOn(popUp.updatedDetails, "emit");
    const alertsSpy = spyOn(popUp["alertService"], "createAlert");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUp.updateDisplayName(new Event(""), true);
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName");
    expect(updateSpy).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(updatedDetailsSpy).not.toHaveBeenCalled();
    expect(alertsSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "Editing someone else's username can only be done via the admin page.",
    });
  });

  it("should make the request to adminService to change the name - don't close report", () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.editedItem = {
      id: 2,
      displayName: "name",
    };
    popUp.reportData = {
      reportID: 1,
      userID: 2,
    };
    const newName = "new name";
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();
    fixture.detectChanges();

    const updateSpy = spyOn(popUp["adminService"], "editUser").and.returnValue(mockSubscription);
    const emitSpy = spyOn(popUp.editMode, "emit");
    const updatedDetailsSpy = spyOn(popUp.updatedDetails, "emit");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[1].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName");
    expect(updateSpy).toHaveBeenCalledWith(
      {
        id: 2,
        displayName: newName,
      },
      false,
      1,
    );
    expect(emitSpy).toHaveBeenCalledWith(false);
    expect(updatedDetailsSpy).toHaveBeenCalledWith({
      displayName: newName,
      closed: false,
      reportID: 1,
    });
  });

  it("should prevent invalid names", () => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => {
        return { error: "error" };
      },
    );

    const fixture = TestBed.createComponent(DisplayNameEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.editedItem = {
      id: 4,
      displayName: "name",
    };
    const newName = "new name";
    fixture.detectChanges();

    const updateSpy = spyOn(popUp.authService, "updateUserData");
    const emitSpy = spyOn(popUp.editMode, "emit");
    const alertSpy = spyOn(popUp["alertService"], "createAlert");

    popUpDOM.querySelector("#displayName").value = newName;
    popUpDOM.querySelector("#displayName").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("displayName");
    expect(updateSpy).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({ type: "Error", message: "error" });
  });
});
