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
import { of } from "rxjs";
import { provideExperimentalZonelessChangeDetection } from "@angular/core";
import { MockProvider } from "ng-mocks";

import { ItemDeleteFormComponent } from "./itemDeleteForm.component";
import { PopUpComponent } from "@common/popUp/popUp.component";
import { ApiClientService } from "@app/services/apiClient.service";
import { TeleportDirective } from "@app/directives/teleport.directive";

describe("ItemDeleteFormComponent", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    const MockAPIClient = MockProvider(ApiClientService);

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [CommonModule, PopUpComponent, ItemDeleteFormComponent, TeleportDirective],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideExperimentalZonelessChangeDetection(),
        MockAPIClient,
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;

    expect(itemDeleteForm).toBeTruthy();
  });

  // Check that a warning is shown before deleting an item
  it("shows a warning when deleting something", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("deleteEndpoint", "delete");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 2);

    fixture.detectChanges();

    expect(itemDeleteFormDOM.querySelector("#deleteItem")).toBeTruthy();
    expect(
      itemDeleteFormDOM.querySelector("#deleteItem").querySelectorAll(".warning")[0],
    ).toBeTruthy();

    expect(
      itemDeleteFormDOM.querySelector("#deleteItem").querySelectorAll(".warning")[0].textContent,
    ).toContain("This action is irreversible!");
  });

  it("deleteItem - single item - makes the request and updates the user and IndexedDB store", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, deleted: 4 }),
    );
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    const swManagerSpy = spyOn(itemDeleteForm["swManager"], "deleteItem");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");
    fixture.componentRef.setInput("deleteEndpoint", "delete");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 4);

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteSpy).toHaveBeenCalledWith("delete/4");
    expect(alertsSpy).toHaveBeenCalledWith("Post 4 was deleted.");
    expect(swManagerSpy).toHaveBeenCalledWith("posts", 4);
    expect(editModeSpy).toHaveBeenCalledWith(false);
    expect(deletedEmitSpy).toHaveBeenCalledWith(4);
  });

  it("deleteItem - multiple items - makes the request and updates the user", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, userID: 2, deleted: 4 }),
    );
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    const swManagerSpy = spyOn(itemDeleteForm["swManager"], "deleteItem");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");
    fixture.componentRef.setInput("deleteEndpoint", "users/2/posts");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 2);
    fixture.componentRef.setInput("bulkDelete", true);

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteSpy).toHaveBeenCalledWith("users/2/posts");
    expect(alertsSpy).toHaveBeenCalledWith("4 posts were deleted.");
    expect(swManagerSpy).not.toHaveBeenCalled();
    expect(editModeSpy).toHaveBeenCalledWith(false);
    expect(deletedEmitSpy).toHaveBeenCalledWith(4);
  });

  it("deleteItem - shouldn't delete if deleteEndpoint is undefined", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    const deleteSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, deleted: 4 }),
    );
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    const swManagerSpy = spyOn(itemDeleteForm["swManager"], "deleteItem");
    const editModeSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 4);

    fixture.detectChanges();

    // click 'delete'
    itemDeleteFormDOM.querySelectorAll(".popupDeleteBtn")[0].click();

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(alertsSpy).not.toHaveBeenCalled();
    expect(swManagerSpy).not.toHaveBeenCalled();
    expect(editModeSpy).not.toHaveBeenCalled();
    expect(deletedEmitSpy).not.toHaveBeenCalled();
  });

  // Check that a request to close the report is made if the item is deleted from
  // the admin dashboard
  it("makes a request to close the report if that's what the user chose - Admin delete", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("deleteEndpoint", "whatever");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 4);
    fixture.componentRef.setInput("isAdmin", true);
    const deleteSpy = spyOn(itemDeleteForm, "deleteItem").and.callThrough();
    const deleteServiceSpy = spyOn(itemDeleteForm["apiClient"], "delete").and.returnValue(
      of({ success: true, deleted: 4 }),
    );
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");
    const deletedEmitSpy = spyOn(itemDeleteForm.deleted, "emit");
    const alertsSpy = spyOn(itemDeleteForm["alertsService"], "createSuccessAlert");
    const swManagerSpy = spyOn(itemDeleteForm["swManager"], "deleteItem");

    fixture.detectChanges();

    // click 'delete and close report'
    itemDeleteFormDOM.querySelectorAll(".deleteButton")[0].click();
    fixture.detectChanges();

    expect(deleteSpy).toHaveBeenCalledWith();
    expect(deleteServiceSpy).toHaveBeenCalledWith("whatever/4");
    expect(alertsSpy).not.toHaveBeenCalled();
    expect(swManagerSpy).toHaveBeenCalledWith("posts", 4);
    expect(emitSpy).toHaveBeenCalledWith(false);
    expect(deletedEmitSpy).toHaveBeenCalledWith(4);
  });

  // Check that the popup is exited and the item isn't deleted if the user picks 'never mind'
  it("should emit false and keep the item if the user chooses not to delete", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("deleteEndpoint", "users/4/posts");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 2);
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
  });

  it("should emit false and keep the item if the user chooses not to delete - admin", () => {
    const fixture = TestBed.createComponent(ItemDeleteFormComponent);
    const itemDeleteForm = fixture.componentInstance;
    const itemDeleteFormDOM = fixture.nativeElement;
    fixture.componentRef.setInput("deleteEndpoint", "users/4/posts");
    fixture.componentRef.setInput("itemType", "Post");
    fixture.componentRef.setInput("itemId", 2);
    fixture.componentRef.setInput("isAdmin", true);

    const deleteSpy = spyOn(itemDeleteForm, "deleteItem").and.callThrough();
    const emitSpy = spyOn(itemDeleteForm.editMode, "emit");

    fixture.detectChanges();

    // click the 'never mind button'
    itemDeleteFormDOM.querySelector("#adminCancel").click();
    fixture.detectChanges();

    // check the exit method was called
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
