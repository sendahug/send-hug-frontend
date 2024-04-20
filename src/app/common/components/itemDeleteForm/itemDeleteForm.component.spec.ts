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
import { of, Subscription } from "rxjs";

import { ItemDeleteForm } from "./itemDeleteForm.component";
import { PopUp } from "@common/components/popUp/popUp.component";

describe("ItemDeleteForm", () => {
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
      ],
      declarations: [ItemDeleteForm, PopUp],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    expect(itemDeleteForm).toBeTruthy();
  });

  // Check that a warning is shown before deleting an item
  it("shows a warning when deleting something", (done: DoneFn) => {
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

  it("deleteItem - single item - sets the right url and store for the delete call", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();
    const deleteSingleItemSpy = spyOn(itemDeleteForm, "deleteSingleItem").and.returnValue(
      mockSubscription,
    );
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");
    itemDeleteForm.toDelete = "Post";
    itemDeleteForm.itemToDelete = 2;

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteSingleItemSpy).toHaveBeenCalledWith("posts/2", "posts");
    expect(editModeSpy).toHaveBeenCalledWith(false);
    expect(deletedEmitSpy).toHaveBeenCalledWith(2);
    done();
  });

  it("deleteItem - single item - sets the right url and store for the delete call", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();
    const deleteSingleItemSpy = spyOn(itemDeleteForm, "deleteSingleItem").and.returnValue(
      mockSubscription,
    );
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    itemDeleteForm.toDelete = "Message";
    itemDeleteForm.itemToDelete = 2;
    itemDeleteForm.messType = "inbox";

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteSingleItemSpy).toHaveBeenCalledWith("messages/inbox/2", "messages");
    expect(editModeSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("deleteItem - single item - sets the right url and store for the delete call", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();
    const deleteSingleItemSpy = spyOn(itemDeleteForm, "deleteSingleItem").and.returnValue(
      mockSubscription,
    );
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    itemDeleteForm.toDelete = "Thread";
    itemDeleteForm.itemToDelete = 2;
    itemDeleteForm.messType = "threads";

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteSingleItemSpy).toHaveBeenCalledWith("messages/threads/2", "threads");
    expect(editModeSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("deleteItem - all posts - should make the reuqest to delete all posts and delete from Idb", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteMultipleSpy = spyOn(itemDeleteForm, "deleteMultipleItems").and.returnValue(
      of({ success: true, userID: 2, deleted: 4 }),
    );
    itemDeleteForm.toDelete = "All posts";
    itemDeleteForm.itemToDelete = 2;
    const deleteIdbSpy = spyOn(itemDeleteForm["swManager"], "deleteItems");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteMultipleSpy).toHaveBeenCalledWith("users/all/2/posts", "posts");
    expect(deleteIdbSpy).toHaveBeenCalledWith("posts", "userId", 2);
    expect(editModeSpy).toHaveBeenCalledWith(false);
    expect(deletedEmitSpy).toHaveBeenCalledWith(2);
    done();
  });

  it("deleteItems - all inbox - should make the reuqest to delete all inbox messages and delete from Idb", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteMultipleSpy = spyOn(itemDeleteForm, "deleteMultipleItems").and.returnValue(
      of({ success: true, userID: 2, deleted: 4 }),
    );
    itemDeleteForm.toDelete = "All inbox";
    itemDeleteForm.itemToDelete = 2;
    const deleteIdbSpy = spyOn(itemDeleteForm["swManager"], "deleteItems");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteMultipleSpy).toHaveBeenCalledWith("messages/inbox", "messages", { userID: 2 });
    expect(deleteIdbSpy).toHaveBeenCalledWith("messages", "forId", 2);
    expect(editModeSpy).toHaveBeenCalledWith(false);
    expect(deletedEmitSpy).toHaveBeenCalledWith(2);
    done();
  });

  it("deleteItems - all outbox - should make the reuqest to delete all outbox messages and delete from Idb", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteMultipleSpy = spyOn(itemDeleteForm, "deleteMultipleItems").and.returnValue(
      of({ success: true, userID: 2, deleted: 4 }),
    );
    itemDeleteForm.toDelete = "All outbox";
    itemDeleteForm.itemToDelete = 2;
    const deleteIdbSpy = spyOn(itemDeleteForm["swManager"], "deleteItems");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteMultipleSpy).toHaveBeenCalledWith("messages/outbox", "messages", { userID: 2 });
    expect(deleteIdbSpy).toHaveBeenCalledWith("messages", "fromId", 2);
    expect(editModeSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("deleteItems - all threads - should make the reuqest to delete all threads and delete from Idb", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteMultipleSpy = spyOn(itemDeleteForm, "deleteMultipleItems").and.returnValue(
      of({ success: true, userID: 2, deleted: 4 }),
    );
    itemDeleteForm.toDelete = "All threads";
    itemDeleteForm.itemToDelete = 2;
    const deleteIdbSpy = spyOn(itemDeleteForm["swManager"], "clearStore");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteMultipleSpy).toHaveBeenCalledWith("messages/threads", "messages", { userID: 2 });
    expect(deleteIdbSpy).toHaveBeenCalledWith("messages");
    expect(deleteIdbSpy).toHaveBeenCalledWith("threads");
    expect(editModeSpy).toHaveBeenCalledWith(false);
    done();
  });

  it("deleteSingleItem - makes the request to delete a single item", () => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const deleteSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, deleted: 4 }),
    );
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    const swManagerSpy = spyOn(itemDeleteForm["swManager"], "deleteItem");
    itemDeleteForm.toDelete = "Post";
    itemDeleteForm.itemToDelete = 4;

    fixture.detectChanges();

    itemDeleteForm.deleteSingleItem("posts/4", "posts");

    expect(deleteSpy).toHaveBeenCalledWith("posts/4");
    expect(alertsSpy).toHaveBeenCalledWith("Post 4 was deleted.");
    expect(swManagerSpy).toHaveBeenCalledWith("posts", 4);
  });

  it("deleteSingleItem - makes the request to delete the thread and deletes the messages from Idb", () => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const deleteSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, deleted: 4 }),
    );
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    const swManagerSpy = spyOn(itemDeleteForm["swManager"], "deleteItems");
    itemDeleteForm.toDelete = "Thread";
    itemDeleteForm.itemToDelete = 4;

    fixture.detectChanges();

    itemDeleteForm.deleteSingleItem("messages/threads/4", "threads");

    expect(deleteSpy).toHaveBeenCalledWith("messages/threads/4");
    expect(alertsSpy).toHaveBeenCalledWith("Thread 4 was deleted.");
    expect(swManagerSpy).toHaveBeenCalledWith("messages", "threadID", 4);
  });

  // Check that a request to close the report is made if the item is deleted from
  // the admin dashboard
  it("makes a request to close the report if that's what the user chose - Admin delete", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.toDelete = "ad post";
    itemDeleteForm.itemToDelete = 2;
    itemDeleteForm.reportData = {
      reportID: 2,
      postID: 4,
    };
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe();
    const deleteSpy = spyOn(itemDeleteForm, "deletePost").and.callThrough();
    const deleteServiceSpy = spyOn(itemDeleteForm["adminService"], "deletePost").and.returnValue(
      mockSubscription,
    );
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");

    fixture.detectChanges();

    // click 'delete and close report'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();
    fixture.detectChanges();

    // check that the closeReport boolean is true
    const report = {
      reportID: 2,
      postID: 4,
    };
    expect(deleteSpy).toHaveBeenCalledWith(true);
    expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, true);
    expect(emitSpy).toHaveBeenCalledWith(false);

    // click 'delete and close report'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[1].click();
    fixture.detectChanges();

    // check that the closeReport boolean is false
    expect(deleteSpy).toHaveBeenCalledWith(false);
    expect(deleteServiceSpy).toHaveBeenCalledWith(2, report, false);
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(deletedEmitSpy).toHaveBeenCalledWith(2);
    done();
  });

  it("deleteMultipleItems - makes the request to delete multiple items", () => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const deleteSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, userID: 2, deleted: 4 }),
    );
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    itemDeleteForm.toDelete = "All posts";
    itemDeleteForm.itemToDelete = 2;

    fixture.detectChanges();

    itemDeleteForm.deleteMultipleItems("users/all/4/posts", "posts", {}).subscribe(() => {});

    expect(deleteSpy).toHaveBeenCalledWith("users/all/4/posts", {});
    expect(alertsSpy).toHaveBeenCalledWith("4 posts were deleted.");
  });

  // Check that the popup is exited and the item isn't deleted if the user picks 'never mind'
  it("should emit false and keep the item if the user chooses not to delete", (done: DoneFn) => {
    const fixture = TestBed.createComponent(ItemDeleteForm);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    itemDeleteForm.toDelete = "Post";
    itemDeleteForm.itemToDelete = 2;
    const deleteSpy = spyOn(itemDeleteForm, "deleteItem");
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
