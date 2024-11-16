/*
	Messages Page
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
import { provideRouter, RouterLink, withComponentInputBinding } from "@angular/router";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA, provideZoneChangeDetection } from "@angular/core";
import { MockComponent } from "ng-mocks";

import { AppSingleMessage } from "./message.component";
import { type MessageGet } from "@app/interfaces/message.interface";
import { ItemDeleteForm } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { UserIcon } from "@common/userIcon/userIcon.component";

describe("AppSingleMessage", () => {
  let mockMessage: MessageGet;

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockItemDeleteForm = MockComponent(ItemDeleteForm);
    const MockUserIcon = MockComponent(UserIcon);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MockItemDeleteForm, MockUserIcon, RouterLink, CommonModule, AppSingleMessage],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter([], withComponentInputBinding()),
      ],
    }).compileComponents();

    mockMessage = {
      date: new Date("Mon, 22 Jun 2020 14:32:38 GMT"),
      for: {
        displayName: "user14",
      },
      forId: 4,
      from: {
        displayName: "user14",
      },
      fromId: 4,
      id: 1,
      messageText: "Your post (ID 19) was deleted due to violating our community rules.",
      threadID: 4,
    };
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(AppSingleMessage);
    const appMessage = fixture.componentInstance;
    expect(appMessage).toBeTruthy();
  });

  // Check that the component loads the inbox if no mailbox is specified
  it("should load the inbox by default", () => {
    const fixture = TestBed.createComponent(AppSingleMessage);
    fixture.componentRef.setInput("currentUser", 4);
    fixture.componentRef.setInput("message", mockMessage);
    fixture.componentRef.setInput("messType", "inbox");
    const appMessage = fixture.componentInstance;
    const appMessageDOM = fixture.nativeElement;
    fixture.detectChanges();

    expect(appMessage.displayFor()).toBeTrue();
    expect(appMessage.displayFrom()).toBeTrue();
    expect(appMessageDOM.querySelector(".messageText").textContent.trim()).toBe(
      mockMessage.messageText,
    );
  });

  // Check that the popup variables are set to false
  it("should have all popup variables set to false", () => {
    const fixture = TestBed.createComponent(AppSingleMessage);
    fixture.componentRef.setInput("currentUser", 4);
    fixture.componentRef.setInput("message", mockMessage);
    fixture.componentRef.setInput("messType", "inbox");
    const appMessage = fixture.componentInstance;
    fixture.detectChanges();

    expect(appMessage.deleteMode()).toBeFalse();
  });

  // Check deleting a single message triggers the poppup
  it("should trigger the popup upon delete", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppSingleMessage);
    const appMessage = fixture.componentInstance;
    const appMessageDOM = fixture.nativeElement;
    fixture.componentRef.setInput("currentUser", 4);
    fixture.componentRef.setInput("message", mockMessage);
    fixture.componentRef.setInput("messType", "inbox");
    fixture.detectChanges();

    // before the click
    expect(appMessage.deleteMode()).toBeFalse();

    // trigger click
    appMessageDOM.querySelectorAll(".deleteButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(appMessage.deleteMode()).toBeTrue();
    expect(appMessage.itemToDelete()).toBe(1);
    expect(appMessageDOM.querySelector("item-delete-form")).toBeTruthy();
    done();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppSingleMessage);
    fixture.componentRef.setInput("currentUser", 4);
    fixture.componentRef.setInput("message", mockMessage);
    fixture.componentRef.setInput("messType", "inbox");
    const appMessage = fixture.componentInstance;
    const changeSpy = spyOn(appMessage, "changeMode").and.callThrough();
    const outputSpy = spyOn(appMessage.messageDeleted, "emit");

    // start the popup
    appMessage.deleteMode.set(true);
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteForm;
    popup.deleted.emit(1);
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(appMessage.deleteMode()).toBeFalse();
    expect(outputSpy).toHaveBeenCalledWith(1);
    done();
  });

  // Check each message has delete button and reply link
  it("should have the relevant buttons for each message", (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppSingleMessage);
    const appMessageDOM = fixture.nativeElement;
    fixture.componentRef.setInput("currentUser", 4);
    fixture.componentRef.setInput("message", mockMessage);
    fixture.componentRef.setInput("messType", "inbox");
    fixture.detectChanges();

    expect(appMessageDOM.querySelectorAll(".messageButton")[0].tagName.toLowerCase()).toBe("a");
    expect(appMessageDOM.querySelectorAll(".messageButton")[0].textContent).toBe("Reply");
    expect(appMessageDOM.querySelectorAll(".messageButton")[0].getAttribute("href")).toContain(
      "/new",
    );
    expect(appMessageDOM.querySelectorAll(".deleteButton")[0].tagName.toLowerCase()).toBe("button");
    expect(appMessageDOM.querySelectorAll(".deleteButton")[0].textContent).toBe("Delete Message");
    done();
  });

  // it("should update the message list post delete - single message", (done: DoneFn) => {
  //   const fixture = TestBed.createComponent(AppSingleMessage);
  //   const appMessage = fixture.componentInstance;
  //   const updateSpy = spyOn(appMessage, "updateMessageList").and.callThrough();
  //   spyOn(appMessage, "fetchMessages");
  //   fixture.componentRef.setInput("currentUser", 4);
  //   fixture.componentRef.setInput("message", mockMessage);
  //   fixture.componentRef.setInput("messType", "inbox");

  //   // start the popup
  //   appMessage.deleteMode.set(true);
  //   fixture.detectChanges();

  //   // exit the popup
  //   const popup = fixture.debugElement.query(By.css("item-delete-form"))
  //     .componentInstance as ItemDeleteForm;
  //   popup.deleted.emit(1);
  //   popup.editMode.emit(false);
  //   fixture.detectChanges();

  //   // check the popup is exited
  //   expect(updateSpy).toHaveBeenCalled();
  //   expect(appMessage.messages().length).toBe(1);
  //   expect(appMessage.messages()[0].id).not.toBe(1);
  //   done();
  // });
});
