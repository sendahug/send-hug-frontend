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
import { RouterTestingModule } from "@angular/router/testing";
import {} from "jasmine";
import { APP_BASE_HREF } from "@angular/common";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "../../app.component";
import { PopUp } from "./popUp.component";
import { NotificationsTab } from "../notifications/notifications.component";
import { DisplayNameEditForm } from "../forms/displayNameEditForm/displayNameEditForm.component";
import { ItemDeleteForm } from "../forms/itemDeleteForm/itemDeleteForm.component";
import { PostEditForm } from "../forms/postEditForm/postEditForm.component";
import { ReportForm } from "../forms/reportForm/reportForm.component";
import { AppAlert } from "../appAlert/appAlert.component";

describe("Popup", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [
        AppComponent,
        PopUp,
        NotificationsTab,
        DisplayNameEditForm,
        ItemDeleteForm,
        PostEditForm,
        ReportForm,
        AppAlert,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(popUp).toBeTruthy();
  });

  // check tab and tab+shift let the user navigate
  it("should navigate using tab and shift+tab", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(popUp, "checkFocusBinded").and.callThrough();
    popUp.toEdit = "admin post";
    popUp.delete = false;
    popUp.report = false;
    popUp.editedItem = "hi";
    popUp.reportData = {
      reportID: 1,
      postID: 2,
    };
    fixture.detectChanges();

    // spies
    const spies = [
      spyOn(popUpDOM.querySelector("#exitButton"), "focus").and.callThrough(),
      spyOn(popUpDOM.querySelector("#postText"), "focus").and.callThrough(),
      spyOn(popUpDOM.querySelectorAll(".sendData")[0], "focus").and.callThrough(),
      spyOn(popUpDOM.querySelectorAll(".sendData")[1], "focus").and.callThrough(),
    ];

    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // run the tests, with each stage wrapped in a promise to ensure they
    // happen by the correct order
    // step 1: check the first element is focused
    new Promise(() => {
      popUp.ngOnInit();

      // check the first element has focus
      spies.forEach((spy, index: number) => {
        if (index == 0) {
          expect(spy).toHaveBeenCalled();
        } else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
      // step 2: tab event tests
    })
      .then(() => {
        // trigger tab event
        document.getElementById("modalBox")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "tab",
            shiftKey: false,
          }),
        );
        fixture.detectChanges();

        // check the focus shifted to the next element
        expect(focusBindedSpy).toHaveBeenCalled();
        spies.forEach((spy, index: number) => {
          if (index == 0) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else if (index == 1) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else {
            expect(spy).not.toHaveBeenCalled();
          }
        });
        // step 3: shift + tab event tests
      })
      .then(() => {
        // trigger shift + tab event
        document.getElementById("modalBox")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "tab",
            shiftKey: true,
          }),
        );
        fixture.detectChanges();

        // check the focus shifted to the previous element
        expect(focusBindedSpy).toHaveBeenCalled();
        expect(focusBindedSpy).toHaveBeenCalledTimes(2);
        spies.forEach((spy, index: number) => {
          if (index == 0) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(2);
          } else if (index == 1) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else {
            expect(spy).not.toHaveBeenCalled();
          }
        });
      });
    done();
  });

  // check the focus is trapped
  it("should trap focus in the modal", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const focusBindedSpy = spyOn(popUp, "checkFocusBinded").and.callThrough();
    popUp.toEdit = "admin post";
    popUp.delete = false;
    popUp.report = false;
    popUp.editedItem = "hi";
    popUp.reportData = {
      reportID: 1,
      postID: 2,
    };
    fixture.detectChanges();

    // spies
    const spies = [
      spyOn(popUpDOM.querySelector("#exitButton"), "focus").and.callThrough(),
      spyOn(popUpDOM.querySelector("#postText"), "focus").and.callThrough(),
      spyOn(popUpDOM.querySelectorAll(".sendData")[0], "focus").and.callThrough(),
      spyOn(popUpDOM.querySelectorAll(".sendData")[1], "focus").and.callThrough(),
    ];

    spies.forEach((spy) => {
      spy.calls.reset();
    });

    // run the tests, with each stage wrapped in a promise to ensure they
    // happen by the correct order
    // step 1: check the last element is focused
    new Promise(() => {
      // focus on the last element
      popUpDOM.querySelectorAll(".sendData")[1].focus();

      // check the last element has focus
      spies.forEach((spy, index: number) => {
        if (index == 3) {
          expect(spy).toHaveBeenCalled();
        } else {
          expect(spy).not.toHaveBeenCalled();
        }
      });
      // step 2: check what happens when clicking tab
    })
      .then(() => {
        // trigger tab event
        document.getElementById("modalBox")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "tab",
            shiftKey: false,
          }),
        );
        fixture.detectChanges();

        // check the focus shifted to the first element
        expect(focusBindedSpy).toHaveBeenCalled();
        spies.forEach((spy, index: number) => {
          if (index == 3 || index == 0) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else {
            expect(spy).not.toHaveBeenCalled();
          }
        });
        // check what happens when clicking shift + tab
      })
      .then(() => {
        // trigger shift + tab event
        document.getElementById("modalBox")!.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "tab",
            shiftKey: true,
          }),
        );
        fixture.detectChanges();

        // check the focus shifted to the last element
        expect(focusBindedSpy).toHaveBeenCalled();
        expect(focusBindedSpy).toHaveBeenCalledTimes(2);
        spies.forEach((spy, index: number) => {
          if (index == 3) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(2);
          } else if (index == 0) {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
          } else {
            expect(spy).not.toHaveBeenCalled();
          }
        });
      });
    done();
  });

  // Check that the event emitter emits false if the user clicks 'exit'
  it("exits the popup if the user decides not to edit", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(PopUp);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    popUp.toEdit = "post";
    popUp.delete = false;
    popUp.report = false;
    popUp.editedItem = {
      id: 1,
      userId: 4,
      user: "me",
      text: "hi",
      date: new Date(),
      givenHugs: 0,
      sentHugs: [],
    };
    const exitSpy = spyOn(popUp, "exitEdit").and.callThrough();
    fixture.detectChanges();

    // click the exit button
    popUpDOM.querySelector("#exitButton").click();
    fixture.detectChanges();

    popUp.editMode.subscribe((event: boolean) => {
      expect(event).toBeFalse();
    });
    expect(exitSpy).toHaveBeenCalled();
    done();
  });
});
