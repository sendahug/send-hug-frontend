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

import { AppComponent } from "../../../app.component";
import { PostEditForm } from "./postEditForm.component";
import { Post } from "../../../interfaces/post.interface";
import { AppAlert } from "@app/components/appAlert/appAlert.component";

// DISPLAY NAME EDIT
// ==================================================================
describe("PostEditForm", () => {
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
      declarations: [AppComponent, PostEditForm, AppAlert],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(PostEditForm);
    const popUp = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(popUp).toBeTruthy();
  });

  it("should make the request to itemsService to change the post", () => {
    const fixture = TestBed.createComponent(PostEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = {
      id: 1,
      userId: 4,
      user: "me",
      text: "hi",
      date: new Date(),
      givenHugs: 0,
      sentHugs: [],
    };
    popUp.isAdmin = false;
    popUp.editedItem = originalItem;
    const newText = "new text";
    fixture.detectChanges();

    const validateSpy = spyOn(popUp["validationService"], "validateItem").and.returnValue(true);
    const updateSpy = spyOn(popUp["itemsService"], "editPost");
    const isUpdatedSpy = spyOn(popUp["itemsService"].isUpdated, "subscribe");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelectorAll(".sendData")[0].click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("post", newText, "postText");
    const updatedItem = { ...originalItem };
    updatedItem["text"] = newText;
    expect(updateSpy).toHaveBeenCalledWith(updatedItem);
    expect(isUpdatedSpy).toHaveBeenCalled();
  });

  it("should make the request to adminService to change the post - close report", () => {
    const fixture = TestBed.createComponent(PostEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = { text: "hi", id: 2 } as Post;
    popUp.reportData = {
      reportID: 1,
      postID: 2,
    };
    popUp.isAdmin = true;
    popUp.editedItem = originalItem;
    const newText = "new text";
    fixture.detectChanges();

    const validateSpy = spyOn(popUp["validationService"], "validateItem").and.returnValue(true);
    const updateSpy = spyOn(popUp["adminService"], "editPost");
    const isUpdatedSpy = spyOn(popUp["adminService"].isUpdated, "subscribe");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#updateAndClose").click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("post", newText, "postText");
    expect(updateSpy).toHaveBeenCalledWith(
      {
        id: 2,
        text: newText,
      },
      true,
      1,
    );
    expect(isUpdatedSpy).toHaveBeenCalled();
  });

  it("should make the request to adminService to change the post - don't close report", () => {
    const fixture = TestBed.createComponent(PostEditForm);
    const popUp = fixture.componentInstance;
    const popUpDOM = fixture.nativeElement;
    const originalItem = { text: "hi", id: 2 } as Post;
    popUp.reportData = {
      reportID: 1,
      postID: 2,
    };
    popUp.isAdmin = true;
    popUp.editedItem = originalItem;
    const newText = "new text";
    fixture.detectChanges();

    const validateSpy = spyOn(popUp["validationService"], "validateItem").and.returnValue(true);
    const updateSpy = spyOn(popUp["adminService"], "editPost");
    const isUpdatedSpy = spyOn(popUp["adminService"].isUpdated, "subscribe");

    popUpDOM.querySelector("#postText").value = newText;
    popUpDOM.querySelector("#updateDontClose").click();
    fixture.detectChanges();

    expect(validateSpy).toHaveBeenCalledWith("post", newText, "postText");
    expect(updateSpy).toHaveBeenCalledWith(
      {
        id: 2,
        text: newText,
      },
      false,
      1,
    );
    expect(isUpdatedSpy).toHaveBeenCalled();
  });
});
