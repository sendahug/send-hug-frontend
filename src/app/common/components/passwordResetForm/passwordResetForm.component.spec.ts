/*
	Password Reset Form
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

import { PasswordResetForm } from "./passwordResetForm.component";
import { AuthService } from "@common/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { PopUp } from "@common/components/popUp/popUp.component";
import { CommonTestModules } from "@tests/commonModules";

// DISPLAY NAME EDIT
// ==================================================================
describe("PasswordResetForm", () => {
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
        ...CommonTestModules,
      ],
      declarations: [PasswordResetForm, PopUp],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(PasswordResetForm);
    const popUp = fixture.componentInstance;
    expect(popUp).toBeTruthy();
  });

  it("should make the request to authService to reset the password", () => {
    const fixture = TestBed.createComponent(PasswordResetForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const email = "ab@c.com";
    fixture.detectChanges();

    const resetSpy = spyOn(popUp["authService"], "resetPassword").and.returnValue(
      new Promise(() => {}),
    );

    popUpDOM.querySelector("#username").value = email;
    popUpDOM.querySelector("#username").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(resetSpy).toHaveBeenCalledWith(email);
  });

  it("should prevent invalid emails - invalid email", () => {
    const fixture = TestBed.createComponent(PasswordResetForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    fixture.detectChanges();

    const resetSpy = spyOn(popUp["authService"], "resetPassword").and.returnValue(
      new Promise(() => {}),
    );
    const emitSpy = spyOn(popUp.editMode, "emit");
    const alertSpy = spyOn(popUp["alertsService"], "createAlert");

    popUpDOM.querySelector("#username").value = "ab";
    popUpDOM.querySelector("#username").dispatchEvent(new Event("input"));
    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(resetSpy).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "The email entered in the username field is invalid.",
    });
  });

  it("should prevent invalid emails - empty email", () => {
    const fixture = TestBed.createComponent(PasswordResetForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    fixture.detectChanges();

    const resetSpy = spyOn(popUp["authService"], "resetPassword").and.returnValue(
      new Promise(() => {}),
    );
    const emitSpy = spyOn(popUp.editMode, "emit");
    const alertSpy = spyOn(popUp["alertsService"], "createAlert");

    popUpDOM.querySelectorAll(".updateItem")[0].click();
    fixture.detectChanges();

    expect(resetSpy).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "An email is required to reset the password.",
    });
  });
});
