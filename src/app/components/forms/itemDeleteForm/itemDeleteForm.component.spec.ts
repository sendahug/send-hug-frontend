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
import { ItemDeleteForm } from "./itemDeleteForm.component";
import { AuthService } from "../../../services/auth.service";
import { MockAuthService } from "../../../services/auth.service.mock";
import { ItemsService } from "../../../services/items.service";
import { MockItemsService } from "../../../services/items.service.mock";
import { PostsService } from "../../../services/posts.service";
import { MockPostsService } from "../../../services/posts.service.mock";
import { AdminService } from "../../../services/admin.service";
import { MockAdminService } from "../../../services/admin.service.mock";

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
      declarations: [AppComponent, ItemDeleteForm],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AdminService, useClass: MockAdminService },
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const acFixture = TestBed.createComponent(AppComponent);
    const appComponent = acFixture.componentInstance;
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(itemDeleteForm).toBeTruthy();
  });

  // Check that a warning is shown before deleting an item
  it("shows a warning when deleting something", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    TestBed.inject(AuthService).login();
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.toDelete = "Post";
    itemDeleteForm.itemToDelete = 2;

    fixture.detectChanges();

    expect(itemDeleteFormDOM.querySelector("#deleteItem")).toBeTruthy();
    expect(
      itemDeleteFormDOM.querySelector("#deleteItem").querySelectorAll(".warning")[0],
    ).toBeTruthy();
    expect(
      itemDeleteFormDOM.querySelector("#deleteItem").querySelectorAll(".warning")[0].textContent,
    ).toContain("This action is irreversible!");
    done();
  });

  // Check that the correct method is called depending on the item that's being deleted
  it("calls the correct method upon confirmation", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    TestBed.inject(AuthService).login();
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.itemToDelete = 1;
    const deleteItems = ["Post", "Message", "Thread", "All posts", "All inbox"];
    let methodSpies = [
      spyOn(itemDeleteForm["postsService"], "deletePost").and.callThrough(),
      spyOn(itemDeleteForm["itemsService"], "deleteMessage").and.callThrough(),
      spyOn(itemDeleteForm["itemsService"], "deleteThread").and.callThrough(),
      spyOn(itemDeleteForm["postsService"], "deleteAllPosts").and.callThrough(),
      spyOn(itemDeleteForm["itemsService"], "deleteAll").and.callThrough(),
    ];
    let currentSpy: jasmine.Spy;
    let calledSpies: jasmine.Spy[] = [];
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");

    fixture.detectChanges();

    deleteItems.forEach((item) => {
      // set up the popup
      itemDeleteForm.toDelete = item;
      if (itemDeleteForm.toDelete == "Message") {
        itemDeleteForm.messType = "inbox";
      } else if (itemDeleteForm.toDelete == "Thread") {
        itemDeleteForm.messType = "thread";
      }

      currentSpy = methodSpies.shift()!;
      calledSpies.push(currentSpy);

      itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();
      fixture.detectChanges();

      // check the other spies weren't called
      methodSpies.forEach((spy) => {
        expect(spy).not.toHaveBeenCalled();
      });

      // check the current and previous spies were each called once
      calledSpies.forEach((spy) => {
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      expect(emitSpy).toHaveBeenCalled();
    });
    done();
  });

  // Check that a request to close the report is made if the item is deleted from
  // the admin dashboard
  it("makes a request to close the report if that's what the user chose - Admin delete", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    TestBed.inject(AuthService).login();
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.toDelete = "ad post";
    itemDeleteForm.itemToDelete = 2;
    itemDeleteForm.reportData = {
      reportID: 2,
      postID: 4,
    };
    const deleteSpy = spyOn(itemDeleteForm, "deletePost").and.callThrough();
    const deleteServiceSpy = spyOn(itemDeleteForm["adminService"], "deletePost").and.callThrough();
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");
    itemDeleteForm["adminService"].getOpenReports();

    fixture.detectChanges();

    // click 'delete and close report'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();
    fixture.detectChanges();

    // check that the closeReport boolean is true
    const report = {
      reportID: 2,
      postID: 4,
    };
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(true);
    expect(deleteServiceSpy).toHaveBeenCalled();
    expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, true);
    expect(emitSpy).toHaveBeenCalledWith(false);

    // click 'delete and close report'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[1].click();
    fixture.detectChanges();

    // check that the closeReport boolean is false
    expect(deleteSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(false);
    expect(deleteServiceSpy).toHaveBeenCalled();
    expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, false);
    expect(emitSpy).toHaveBeenCalledTimes(2);
    done();
  });

  // Check that the popup is exited and the item isn't deleted if the user picks 'never mind'
  it("should emit false and keep the item if the user chooses not to delete", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    TestBed.inject(AuthService).login();
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.toDelete = "Post";
    itemDeleteForm.itemToDelete = 2;
    const deleteSpy = spyOn(itemDeleteForm, "deleteItem").and.callThrough();
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");

    fixture.detectChanges();

    // click the 'never mind button'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[1].click();
    fixture.detectChanges();

    // check the exit method was called
    itemDeleteForm.editMode.subscribe((event: boolean) => {
      expect(event).toBeFalse();
    });
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("should emit false and keep the item if the user chooses not to delete - admin", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    TestBed.inject(AuthService).login();
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.toDelete = "ad post";
    itemDeleteForm.itemToDelete = 2;
    itemDeleteForm.reportData = {
      reportID: 2,
      postID: 4,
    };
    const deleteSpy = spyOn(itemDeleteForm, "deletePost").and.callThrough();
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");

    fixture.detectChanges();

    // click the 'never mind button'
    itemDeleteFormDOM.querySelector("#adminCancel").click();
    fixture.detectChanges();

    // check the exit method was called
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
    done();
  });
});
