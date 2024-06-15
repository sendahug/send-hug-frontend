/*
	Send Hug Form
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
import { of } from "rxjs";

import { SendHugForm } from "./sendHugForm.component";
import { AuthService } from "@app/services/auth.service";
import { mockAuthedUser } from "@tests/mockData";
import { PopUp } from "@app/components/popUp/popUp.component";
import { ValidationService } from "@app/services/validation.service";
import { CommonTestProviders } from "@tests/commonModules";

describe("Send Hug Form", () => {
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
      declarations: [SendHugForm, PopUp],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }, ...CommonTestProviders],
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
  });

  it("shows the name of the user who sent the post", () => {
    const fixture = TestBed.createComponent(SendHugForm);
    const shForm = fixture.componentInstance;
    const shformDOM = fixture.nativeElement;
    shForm.forUsername = "meow";
    shForm.forID = 1;
    shForm.postID = 1;

    fixture.detectChanges();

    expect(shformDOM.querySelectorAll(".postEdit")).toBeTruthy();
    expect(shformDOM.querySelector("#messageFor").value).toBe("meow");
  });

  it("updateTextValidators() - correctly enables/disables the 'message' text field", () => {
    const fixture = TestBed.createComponent(SendHugForm);
    const shForm = fixture.componentInstance;
    const shformDOM = fixture.nativeElement;
    shForm.forUsername = "meow";
    shForm.forID = 1;
    shForm.postID = 1;
    fixture.detectChanges();

    const messageTextField = document.getElementById("messageText") as HTMLInputElement;
    expect(messageTextField.disabled).toBe(false);

    shformDOM.querySelector("#sendMessage").click();
    fixture.detectChanges();

    expect(messageTextField.disabled).toBe(true);

    shformDOM.querySelector("#sendMessage").click();
    fixture.detectChanges();

    expect(messageTextField.disabled).toBe(false);
  });

  it("Correctly sets the required and aria-required attributes", (done: DoneFn) => {
    const fixture = TestBed.createComponent(SendHugForm);
    const shForm = fixture.componentInstance;
    const shformDOM = fixture.nativeElement;
    shForm.forUsername = "meow";
    shForm.forID = 1;
    shForm.postID = 1;
    fixture.detectChanges();

    const messageTextField = document.getElementById("messageText") as HTMLInputElement;

    shformDOM.querySelector("#sendMessage").click();
    fixture.detectChanges();
    expect(messageTextField.required).toBe(false);
    expect(messageTextField.getAttribute("aria-required")).toEqual("false");

    shformDOM.querySelector("#sendMessage").click();
    fixture.detectChanges();
    expect(messageTextField.required).toBe(true);
    expect(messageTextField.getAttribute("aria-required")).toEqual("true");

    done();
  });

  it("requires text if the user is sending a message", (done: DoneFn) => {
    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => ({ error: "ERROR!" }),
    );

    const fixture = TestBed.createComponent(SendHugForm);
    const shForm = fixture.componentInstance;
    const shformDOM = fixture.nativeElement;
    shForm.forUsername = "meow";
    shForm.forID = 1;
    shForm.postID = 1;
    const apiClientSpy = spyOn(shForm["apiClient"], "post");
    const alertServiceSpy = spyOn(shForm["alertsService"], "createAlert");
    fixture.detectChanges();

    // try to submit it without text in the textfield
    shformDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // check the report wasn't sent and the user was alerted
    expect(validateSpy).toHaveBeenCalledWith("message");
    expect(apiClientSpy).not.toHaveBeenCalled();
    expect(alertServiceSpy).toHaveBeenCalledWith({
      type: "Error",
      message: "ERROR!",
    });
    done();
  });

  it("sends the hug via the itemsService", (done: DoneFn) => {
    // mock response
    const mockResponse = {
      updated: "Sent hug!",
      success: true,
    };

    const validationService = TestBed.inject(ValidationService);
    const validateSpy = spyOn(validationService, "validateItemAgainst").and.returnValue(
      (_control) => null,
    );

    const fixture = TestBed.createComponent(SendHugForm);
    const shForm = fixture.componentInstance;
    const shformDOM = fixture.nativeElement;
    shForm.forUsername = "meow";
    shForm.forID = 1;
    shForm.postID = 1;
    const apiClientSpy = spyOn(shForm["apiClient"], "post").and.returnValue(of(mockResponse));
    const alertsSpy = spyOn(shForm["alertsService"], "createSuccessAlert");
    const emitSpy = spyOn(shForm.sendMode, "emit");
    const newMessage = "hang in there";
    fixture.detectChanges();

    const messageText = shformDOM.querySelector("#messageText");
    messageText.value = newMessage;
    messageText.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(shForm.sendHugForm.controls.messageText.value).toEqual(newMessage);

    // try to submit it
    shformDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    // check the report was sent
    expect(validateSpy).toHaveBeenCalledWith("message");
    expect(apiClientSpy).toHaveBeenCalledWith("posts/1/hugs", { messageText: newMessage });
    expect(alertsSpy).toHaveBeenCalledWith(mockResponse.updated);
    expect(emitSpy).toHaveBeenCalledWith(false);
    done();
  });
});
