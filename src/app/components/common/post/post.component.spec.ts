/*
	Post
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
import { provideRouter, RouterLink } from "@angular/router";
import {} from "jasmine";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideZonelessChangeDetection } from "@angular/core";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { setViewport } from "@web/test-runner-commands";

import { PostComponent } from "./post.component";
import { mockAuthedUser } from "@tests/mockData";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { ReportFormComponent } from "@forms/reportForm/reportForm.component";
import { PostEditFormComponent } from "@forms/postEditForm/postEditForm.component";
import { SendHugFormComponent } from "@forms/sendHugForm/sendHugForm.component";
import { ItemsService } from "@app/services/items.service";
import { AuthService } from "@app/services/auth.service";
import {
  MockItemDeleteFormComponent,
  MockPostEditFormComponent,
  MockReportFormComponent,
  MockSendHugFormComponent,
} from "@tests/mockForms";
import { PostGet } from "@app/interfaces/post.interface";

// Sub-component testing
// ==================================================
describe("Post", () => {
  let mockPost: PostGet;

  // Before each test, configure testing environment
  beforeEach(() => {
    const MockItemsService = MockProvider(ItemsService, {
      currentlyOpenMenu: new BehaviorSubject("n1"),
      receivedAHug: new BehaviorSubject(0),
    });
    const MockAuthService = MockProvider(AuthService, {
      authenticated: signal(false),
      userData: signal(undefined),
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        CommonModule,
        FontAwesomeModule,
        MockItemDeleteFormComponent,
        MockReportFormComponent,
        MockPostEditFormComponent,
        MockSendHugFormComponent,
        RouterLink,
        PostComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockItemsService,
        MockAuthService,
      ],
    }).compileComponents();

    mockPost = {
      date: new Date("2020-06-27 19:17:31.072"),
      givenHugs: 0,
      id: 1,
      text: "test",
      userId: 1,
      user: "test",
      sentHugs: [],
    };
  });

  // Check that all the popup-related variables are set to false at first
  it("should have all popup variables set to false", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    await fixture.whenStable();

    expect(singlePost.editMode()).toBeFalse();
    expect(singlePost.deleteMode()).toBeFalse();
    expect(singlePost.reportMode()).toBeFalse();
  });

  // Check that sending a hug triggers the items service
  it("should trigger items service on hug", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const hugSpy = spyOn(singlePost, "sendHug").and.callThrough();
    const authService = singlePost.authService;
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });
    await fixture.whenStable();

    //  before the click
    expect(hugSpy).not.toHaveBeenCalled();

    // simulate click
    singlePostDOM.querySelectorAll(".hugButton")[0].click();
    await fixture.whenStable();

    // after the click
    expect(singlePost.sendMessageMode()).toBeTrue();
    expect(hugSpy).toHaveBeenCalledWith();
  });

  // Check that the popup is opened when clicking 'edit'
  it("should open the popup upon editing", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const authService = singlePost.authService;
    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    await fixture.whenStable();

    // before the click
    expect(singlePost.editMode()).toBeFalse();
    expect(authSpy).toHaveBeenCalledWith("patch:any-post");

    // trigger click
    singlePostDOM.querySelectorAll(".editButton")[0].click();
    await fixture.whenStable();

    // after the click
    expect(singlePost.editMode()).toBeTrue();
    expect(singlePost.editType).toBe("post");
    expect(singlePostDOM.querySelector("post-edit-form")).toBeTruthy();
  });

  // Check that the popup is opened when clicking 'delete'
  it("should open the popup upon deleting", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const authService = singlePost.authService;
    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    await fixture.whenStable();

    // before the click
    expect(singlePost.deleteMode()).toBeFalse();
    expect(authSpy).toHaveBeenCalledWith("delete:any-post");

    // trigger click
    singlePostDOM.querySelectorAll(".deleteButton")[0].click();
    await fixture.whenStable();

    // after the click
    expect(singlePost.deleteMode()).toBeTrue();
    expect(singlePost.deleteEndpoint).toBe("posts");
    expect(singlePost.itemType).toBe("Post");
    expect(singlePost.itemToDelete()).toBe(1);
    expect(singlePostDOM.querySelector("item-delete-form")).toBeTruthy();
  });

  // Check that the popup is opened when clicking 'report'
  it("should open the popup upon reporting", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const authService = singlePost.authService;
    const reportSpy = spyOn(singlePost, "reportPost").and.callThrough();
    authService.userData.set({ ...mockAuthedUser });
    await fixture.whenStable();

    // before the click
    expect(singlePost.reportMode()).toBeFalse();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    singlePostDOM.querySelectorAll(".reportButton")[0].click();
    await fixture.whenStable();

    // after the click
    expect(singlePost.reportMode()).toBeTrue();
    expect(singlePost.reportType).toBe("Post");
    expect(reportSpy).toHaveBeenCalledWith();
    expect(singlePostDOM.querySelector("report-form")).toBeTruthy();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false - edit mode", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const changeSpy = spyOn(singlePost, "changeMode").and.callThrough();
    await fixture.whenStable();

    // start the popup
    singlePost.editMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditFormComponent;
    popup.editMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "Edit");
    expect(singlePost.editMode()).toBeFalse();
  });

  it("should change mode when the event emitter emits false - delete mode", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const changeSpy = spyOn(singlePost, "changeMode").and.callThrough();
    await fixture.whenStable();

    // start the popup
    singlePost.deleteMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.editMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "Delete");
    expect(singlePost.deleteMode()).toBeFalse();
  });

  it("should change mode when the event emitter emits false - report mode", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const changeSpy = spyOn(singlePost, "changeMode").and.callThrough();
    await fixture.whenStable();

    // start the popup
    singlePost.reportMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("report-form"))
      .componentInstance as ReportFormComponent;
    popup.reportMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "Report");
    expect(singlePost.reportMode()).toBeFalse();
  });

  it("should change mode when the event emitter emits false - message mode", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const changeSpy = spyOn(singlePost, "changeMode").and.callThrough();
    await fixture.whenStable();

    // start the popup
    singlePost.sendMessageMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("app-send-hug-form"))
      .componentInstance as SendHugFormComponent;
    popup.sendMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalledWith(false, "Message");
    expect(singlePost.sendMessageMode()).toBeFalse();
  });

  it("toggleMenu() - should set the currently open menu to the given post's id", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    singlePost.itemsService.currentlyOpenMenu.next("nPost3");
    const openMenuSpy = spyOn(singlePost.itemsService.currentlyOpenMenu, "next").and.callThrough();

    // before the change
    expect(singlePost.itemsService.currentlyOpenMenu.value).toBe("nPost3");
    expect(openMenuSpy).not.toHaveBeenCalled();

    // trigger the function
    singlePost.toggleOptions();
    await fixture.whenStable();

    // after the change
    expect(singlePost.itemsService.currentlyOpenMenu.value).toBe("nPost1");
    expect(openMenuSpy).toHaveBeenCalledWith("nPost1");
  });

  it("toggleMenu() - should set the currently open menu to an emptpy string if the given post's id is already open", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    singlePost.itemsService.currentlyOpenMenu.next("nPost1");
    const openMenuSpy = spyOn(singlePost.itemsService.currentlyOpenMenu, "next").and.callThrough();

    // before the call
    expect(singlePost.itemsService.currentlyOpenMenu.value).toBe("nPost1");
    expect(openMenuSpy).not.toHaveBeenCalled();

    // trigger the function
    singlePost.toggleOptions();
    await fixture.whenStable();

    // after the call
    expect(singlePost.itemsService.currentlyOpenMenu.value).toBe("");
    expect(openMenuSpy).toHaveBeenCalledWith("");
  });

  // check the posts' menu isn't shown if there isn't enough room for it
  it("checkMenuSize() - shouldn't show the posts's menu if not wide enough", async () => {
    // change the elements' width to make sure there isn't enough room for the menu
    await setViewport({ width: 200, height: 640 });

    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const authService = singlePost.authService;
    spyOn(authService, "canUser").and.returnValue(true);
    await fixture.whenStable();

    // check all menus aren't shown
    expect(singlePostDOM.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(singlePostDOM.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
  });

  // check the posts' menu is shown if there is enough room for it
  it("checkMenuSize() - should show the menu if it's wide enough for it", async () => {
    // change the elements' width to make sure there isn't enough room for the meny
    await setViewport({ width: 500, height: 640 });

    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const authService = singlePost.authService;
    spyOn(authService, "canUser").and.returnValue(true);
    await fixture.whenStable();

    // check all menus aren't shown
    expect(singlePostDOM.querySelectorAll(".buttonsContainer")[0].classList).not.toContain("float");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).not.toContain("float");
    expect(singlePostDOM.querySelectorAll(".menuButton")[0].classList).toContain("hidden");
  });

  // check the posts' menu is floating if there isn't enough room for it
  it("checkMenuSize() - should float the menu if it's not wide enough and a menu is open", async () => {
    // change the elements' width to make sure there isn't enough room for the menu
    await setViewport({ width: 200, height: 640 });

    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const authService = singlePost.authService;
    spyOn(authService, "canUser").and.returnValue(true);
    await fixture.whenStable();

    // check all menus aren't shown
    expect(singlePostDOM.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).toContain("hidden");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(singlePostDOM.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");

    // click the options buton for the post
    singlePostDOM.querySelectorAll(".menuButton")[0].click();
    await fixture.whenStable();

    // check the menu is floating
    expect(singlePostDOM.querySelectorAll(".buttonsContainer")[0].classList).toContain("float");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
    expect(singlePostDOM.querySelectorAll(".subMenu")[0].classList).toContain("float");
    expect(singlePostDOM.querySelectorAll(".menuButton")[0].classList).not.toContain("hidden");
  });

  it("should update the post's givenHugs and sentHugs when a hug is sent", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const singlePostDOM = fixture.nativeElement;
    const itemsService = singlePost.itemsService;
    const authService = singlePost.authService;
    authService.authenticated.set(true);
    authService.userData.set({ ...mockAuthedUser });

    // before
    expect(singlePost["_post"]()!.givenHugs).toBe(0);
    expect(singlePost["_post"]()!.sentHugs).toEqual([]);
    expect(singlePost.shouldDisableHugBtn()).toBeFalse();
    expect(singlePost.sendHugButtonClass()).toEqual({
      "textlessButton hugButton": true,
      active: false,
    });

    // trigger the function
    itemsService.receivedAHug.next(1);
    await fixture.whenStable();

    // after
    expect(singlePost["_post"]()!.givenHugs).toBe(1);
    expect(singlePost["_post"]()!.sentHugs).toEqual([4]);
    expect(singlePostDOM.querySelectorAll(".badge")[0].textContent).toBe("1");
    expect(singlePost.shouldDisableHugBtn()).toBeTrue();
    expect(singlePost.sendHugButtonClass()).toEqual({
      "textlessButton hugButton": true,
      active: true,
    });
  });

  it("should change update the UI when a report isn't closed - post edit", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const updateSpy = spyOn(singlePost, "updatePostText").and.callThrough();
    const reportPostResponse = {
      success: true,
      updatedPost: {
        date: new Date("2020-06-27 19:17:31.072"),
        givenHugs: 0,
        id: 1,
        text: "boooop",
        userId: 1,
        user: "test",
        sentHugs: [],
      },
      reportId: undefined,
    };

    // start the popup
    singlePost.editMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("post-edit-form"))
      .componentInstance as PostEditFormComponent;
    popup.editMode.emit(false);
    popup.updateResult.emit(reportPostResponse);
    await fixture.whenStable();

    // check the popup is exited
    expect(updateSpy).toHaveBeenCalledWith(reportPostResponse);
    expect(singlePost["_post"]()?.text).toBe(reportPostResponse.updatedPost.text);
  });

  it("should update the parent about the deleted post - delete mode", async () => {
    const fixture = TestBed.createComponent(PostComponent);
    fixture.componentRef.setInput("post", mockPost);
    fixture.componentRef.setInput("type", "n");
    const singlePost = fixture.componentInstance;
    const emitSpy = spyOn(singlePost.deletedId, "emit");
    await fixture.whenStable();

    // start the popup
    singlePost.deleteMode.set(true);
    await fixture.whenStable();

    // exit the popup
    const popup = fixture.debugElement.query(By.css("item-delete-form"))
      .componentInstance as ItemDeleteFormComponent;
    popup.deleted.emit(1);
    popup.editMode.emit(false);
    await fixture.whenStable();

    // check the popup is exited
    expect(emitSpy).toHaveBeenCalledWith(1);
  });
});
