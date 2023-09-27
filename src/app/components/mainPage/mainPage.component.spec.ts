/*
	Main Page
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

// App imports
import { MainPage } from "./mainPage.component";
import { Loader } from "../loader/loader.component";
import { PopUp } from "../popUp/popUp.component";
import { SinglePost } from "../post/post.component";
import { PostsService } from "../../services/posts.service";
import { MockPostsService } from "../../services/posts.service.mock";
import { AuthService } from "../../services/auth.service";
import { MockAuthService } from "../../services/auth.service.mock";

describe("MainPage", () => {
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
      declarations: [MainPage, Loader, PopUp, SinglePost],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PostsService, useClass: MockPostsService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    expect(mainPage).toBeTruthy();
  });

  // Check that the a call to getItems() is made
  it("should get posts via the posts service", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPage = fixture.componentInstance;
    const mainPageDOM = fixture.nativeElement;

    fixture.detectChanges();

    expect(mainPage.postsService.posts.newItems.value.length).toEqual(2);
    expect(mainPageDOM.querySelector("#newItemsList").children.length).toBe(2);
    expect(mainPage.postsService.posts.suggestedItems.value.length).toEqual(2);
    expect(mainPageDOM.querySelector("#sugItemsList").children.length).toBe(2);
    done();
  });

  // Check the posts' menu is shown if there's enough room for them
  it("should show the posts's menu if wide enough", (done: DoneFn) => {
    const fixture = TestBed.createComponent(MainPage);
    const mainPageDOM = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    // change the elements' width to make sure there's enough room for the menu
    let sub = mainPageDOM
      .querySelectorAll(".newItem")[0]!
      .querySelectorAll(".subMenu")[0] as HTMLDivElement;
    sub.style.maxWidth = "";
    sub.style.display = "flex";
    fixture.detectChanges();

    // check all menus are shown
    let posts = mainPageDOM.querySelectorAll(".newItem");
    // new posts
    posts.forEach((element: HTMLLIElement) => {
      expect(element.querySelectorAll(".buttonsContainer")[0].classList).not.toContain("float");
      expect(element.querySelectorAll(".subMenu")[0].classList).not.toContain("hidden");
      expect(element.querySelectorAll(".subMenu")[0].classList).not.toContain("float");
      expect(element.querySelectorAll(".menuButton")[0].classList).toContain("hidden");
    });
    done();
  });
});
