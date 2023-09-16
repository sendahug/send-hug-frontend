/*
	Post
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
import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { SinglePost } from "./post.component";
import { PopUp } from "../popUp/popUp.component";
import { ItemsService } from "../../services/items.service";
import { MockItemsService } from "../../services/items.service.mock";
import { AuthService } from "../../services/auth.service";
import { MockAuthService } from "../../services/auth.service.mock";
import { PostsService } from "../../services/posts.service";
import { MockPostsService } from "../../services/posts.service.mock";

// Mock User Page for testing the sub-component
// ==================================================
@Component({
  selector: "app-page-mock",
  template: `
    <ul
      class="itemList"
      *ngIf="postsService.newItemsArray.length > 0 && postsService.isMainPageResolved.value"
      role="region"
      aria-describedby="newTitle"
      id="newItemsList"
    >
      <app-single-post
        *ngFor="let item of postsService.newItemsArray"
        [post]="item"
        [type]="'n'"
        [class]="'newItem'"
        (showMenu)="openMenu($event)"
      ></app-single-post>
    </ul>
  `,
})
class MockPage {
  showMenuNum: string | null = null;
  // loader sub-component variables
  waitFor = "main page";

  constructor(
    public authService: AuthService,
    public itemsService: ItemsService,
    private postsService: PostsService,
  ) {
    this.postsService.getItems();
  }
}

// Sub-component testing
// ==================================================
describe("Post", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ServiceWorkerModule.register("sw.js", { enabled: false }),
        FontAwesomeModule,
      ],
      declarations: [MockPage, SinglePost, PopUp],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: ItemsService, useClass: MockItemsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PostsService, useClass: MockPostsService },
      ],
    }).compileComponents();
  });

  // Check that all the popup-related variables are set to false at first
  it("should have all popup variables set to false", () => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;

    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeFalse();
  });

  // Check that sending a hug triggers the posts service
  it("should trigger posts service on hug", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].children[0].nativeElement;
    const postsService = myPosts.postsService;
    const hugSpy = spyOn(myPosts, "sendHug").and.callThrough();
    const spy = spyOn(postsService, "sendHug").and.callThrough();
    const disableButton = spyOn(postsService, "disableHugButton");
    (myPosts.authService as AuthService).login();

    upFixture.detectChanges();

    //  before the click
    const newItems = pageDOM.querySelector("#newItemsList");
    expect(myPosts.postsService.newItemsArray[0].givenHugs).toBe(0);
    expect(newItems.querySelectorAll(".badge")[0].textContent).toBe("0");
    expect(hugSpy).not.toHaveBeenCalled();
    upFixture.detectChanges();

    // simulate click
    myPostsDOM.querySelectorAll(".hugButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
    expect(hugSpy).toHaveBeenCalled();
    expect(myPosts.postsService.newItemsArray[0].givenHugs).toBe(1);
    expect(newItems.querySelectorAll(".badge")[0].textContent).toBe("1");
    expect(disableButton).toHaveBeenCalled();
    done();
  });

  // Check that the popup is opened when clicking 'edit'
  it("should open the popup upon editing", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].children[0].nativeElement;
    const authService = myPosts.authService;

    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    upFixture.detectChanges();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const newItems = pageDOM.querySelector("#newItemsList");
    newItems.querySelectorAll(".editButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.editType).toBe("post");
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that the popup is opened when clicking 'delete'
  it("should open the popup upon deleting", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].children[0].nativeElement;
    const authService = myPosts.authService;

    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    upFixture.detectChanges();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(authSpy).toHaveBeenCalled();

    // trigger click
    const newItems = pageDOM.querySelector("#newItemsList");
    newItems.querySelectorAll(".deleteButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.delete).toBeTrue();
    expect(myPosts.toDelete).toBe("Post");
    expect(myPosts.itemToDelete).toBe(1);
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check that the popup is opened when clicking 'report'
  it("should open the popup upon reporting", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    const pageDOM = upFixture.nativeElement;
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const myPostsDOM = upFixture.debugElement.children[0].children[0].nativeElement;
    const authService = myPosts.authService;

    const authSpy = spyOn(authService, "canUser").and.returnValue(true);
    const reportSpy = spyOn(myPosts, "reportPost").and.callThrough();
    upFixture.detectChanges();

    // before the click
    expect(myPosts.editMode).toBeFalse();
    expect(myPosts.postToEdit).toBeUndefined();
    expect(myPosts.editType).toBeUndefined();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeFalse();
    expect(myPosts.reportType).toBeUndefined();
    expect(authSpy).toHaveBeenCalled();
    expect(reportSpy).not.toHaveBeenCalled();

    // trigger click
    const newItems = pageDOM.querySelector("#newItemsList");
    newItems.querySelectorAll(".reportButton")[0].click();
    upFixture.detectChanges();

    // after the click
    expect(myPosts.editMode).toBeTrue();
    expect(myPosts.postToEdit).toBeUndefined();
    expect(myPosts.editType).toBeUndefined();
    expect(myPosts.delete).toBeFalse();
    expect(myPosts.report).toBeTrue();
    expect(myPosts.reportType).toBe("Post");
    expect(reportSpy).toHaveBeenCalled();
    expect(myPostsDOM.querySelector("app-pop-up")).toBeTruthy();
    done();
  });

  // Check the popup exits when 'false' is emitted
  it("should change mode when the event emitter emits false", (done: DoneFn) => {
    const upFixture = TestBed.createComponent(MockPage);
    upFixture.detectChanges();
    const myPosts = upFixture.debugElement.children[0].children[0].componentInstance;
    const changeSpy = spyOn(myPosts, "changeMode").and.callThrough();

    upFixture.detectChanges();

    // start the popup
    myPosts.lastFocusedElement = document.querySelectorAll("a")[0];
    myPosts.editMode = true;
    myPosts.delete = true;
    myPosts.toDelete = "Post";
    myPosts.itemToDelete = 1;
    myPosts.report = false;
    upFixture.detectChanges();

    // exit the popup
    const popup = upFixture.debugElement.query(By.css("app-pop-up")).componentInstance as PopUp;
    popup.exitEdit();
    upFixture.detectChanges();

    // check the popup is exited
    expect(changeSpy).toHaveBeenCalled();
    expect(myPosts.editMode).toBeFalse();
    expect(document.activeElement).toBe(document.querySelectorAll("a")[0]);
    done();
  });
});
