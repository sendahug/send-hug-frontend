/*
	Thread Component
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
import { NO_ERRORS_SCHEMA, provideZonelessChangeDetection } from "@angular/core";
import { MockComponent } from "ng-mocks";

import { ThreadComponent } from "./thread.component";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { UserIconComponent } from "@common/userIcon/userIcon.component";
import { type ParsedThread } from "@app/interfaces/thread.interface";

describe("ThreadComponent", () => {
  let mockThread: ParsedThread;

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockItemDeleteFormComponent = MockComponent(ItemDeleteFormComponent);
    const MockUserIconComponent = MockComponent(UserIconComponent);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MockItemDeleteFormComponent,
        MockUserIconComponent,
        RouterLink,
        CommonModule,
        ThreadComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter([], withComponentInputBinding()),
      ],
    }).compileComponents();

    mockThread = {
      id: 3,
      user: {
        displayName: "shirb",
        selectedIcon: "kitty",
        iconColours: {
          character: "#BA9F93",
          lbg: "#e2a275",
          rbg: "#f8eee4",
          item: "#f4b56a",
        },
      },
      userID: 1,
      numMessages: 1,
      latestMessage: new Date("Mon, 08 Jun 2020 14:43:15 GMT"),
    };
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    fixture.componentRef.setInput("thread", mockThread);
    const appThread = fixture.componentInstance;

    expect(appThread).toBeTruthy();
  });

  // Check that the component loads the inbox if no mailbox is specified
  it("should show the thread details", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    fixture.componentRef.setInput("thread", mockThread);
    const appThreadDOM = fixture.nativeElement;
    fixture.detectChanges();

    const threadDetailsDOM = appThreadDOM.querySelectorAll(".pageData");

    expect(threadDetailsDOM[0].textContent.trim()).toBe(mockThread.user.displayName);
    expect(threadDetailsDOM[1].textContent.trim()).toBe(`${mockThread.numMessages} Message(s)`);
    expect(threadDetailsDOM[2].textContent.trim()).toBe(mockThread.latestMessage.toString());
  });

  // Check that the popup variables are set to false
  it("should have all popup variables set to false", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    fixture.componentRef.setInput("thread", mockThread);
    const appThread = fixture.componentInstance;
    fixture.detectChanges();

    expect(appThread.deleteMode()).toBeFalse();
  });

  // Check deleting a single message triggers the poppup
  it("should trigger the popup upon delete", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    const appThread = fixture.componentInstance;
    const appThreadDOM = fixture.nativeElement;
    fixture.componentRef.setInput("thread", mockThread);
    fixture.detectChanges();

    // before the click
    expect(appThread.deleteMode()).toBeFalse();

    // trigger click
    appThreadDOM.querySelectorAll(".deleteButton")[0].click();
    fixture.detectChanges();

    // after the click
    expect(appThread.deleteMode()).toBeTrue();
    expect(appThread.deleteEndpoint).toEqual("messages/threads");
    expect(appThread.itemType).toEqual("Thread");
    expect(appThreadDOM.querySelector("item-delete-form")).toBeTruthy();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    fixture.componentRef.setInput("thread", mockThread);
    const appThread = fixture.componentInstance;
    const changeSpy = spyOn(appThread, "changeMode").and.callThrough();
    const deleteSpy = spyOn(appThread, "deleteMessagesFromIdb").and.callThrough();
    const swManagerSpy = spyOn(appThread["swManager"], "deleteItems");
    const outputSpy = spyOn(appThread.messageDeleted, "emit");

    // start the popup
    appThread.deleteMode.set(true);
    fixture.detectChanges();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.deleted.emit(3);
    popup.editMode.emit(false);
    fixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false);
    expect(deleteSpy).toHaveBeenCalledWith();
    expect(swManagerSpy).toHaveBeenCalledWith("messages", "threadID", mockThread.id);
    expect(appThread.deleteMode()).toBeFalse();
    expect(outputSpy).toHaveBeenCalledWith(3);
  });

  // Check each message has delete button and reply link
  it("should have the relevant buttons for each message", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    const appThreadDOM = fixture.nativeElement;
    fixture.componentRef.setInput("thread", mockThread);
    fixture.detectChanges();

    expect(appThreadDOM.querySelectorAll(".appButton")[0].tagName.toLowerCase()).toBe("button");
    expect(appThreadDOM.querySelectorAll(".appButton")[0].textContent.trim()).toBe("View");

    expect(appThreadDOM.querySelectorAll(".appButton")[1].tagName.toLowerCase()).toBe("button");
    expect(appThreadDOM.querySelectorAll(".appButton")[1].textContent.trim()).toBe("Delete");
  });

  it("should emit the selected thread's ID when a user clicks 'view'", () => {
    const fixture = TestBed.createComponent(ThreadComponent);
    const appThread = fixture.componentInstance;
    const appThreadDOM = fixture.nativeElement;
    fixture.componentRef.setInput("thread", mockThread);
    const emitSpy = spyOn(appThread.threadSelected, "emit");
    fixture.detectChanges();

    appThreadDOM.querySelectorAll(".appButton")[0].click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(mockThread.id);
  });
});
