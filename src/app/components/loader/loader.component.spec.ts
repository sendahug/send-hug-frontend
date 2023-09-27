/*
	Loader
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
import { Loader } from "./loader.component";
import { PostsService } from "../../services/posts.service";
import { MockPostsService } from "../../services/posts.service.mock";
import { AuthService } from "../../services/auth.service";
import { MockAuthService } from "../../services/auth.service.mock";
import { ItemsService } from "../../services/items.service";
import { MockItemsService } from "../../services/items.service.mock";
import { AdminService } from "../../services/admin.service";
import { MockAdminService } from "../../services/admin.service.mock";
import { BehaviorSubject } from "rxjs";
import { NotificationsTab } from "../notifications/notifications.component";

describe("Loader", () => {
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
      declarations: [AppComponent, Loader, NotificationsTab],
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
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
    expect(loader).toBeTruthy();
  });

  // Check that the component checks for loading target
  it("should check what target the parent component is", () => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loadingSpy = spyOn(loader, "checkLoadingTarget").and.callThrough();

    fixture.detectChanges();

    expect(loader).toBeTruthy();
    expect(loadingSpy).toHaveBeenCalled();
  });

  // Check that the component displays a loading message
  it("should display a loading message", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;
    loader.waitingFor = "user";
    fixture.detectChanges();

    expect(loader.message).toBeDefined();
    expect(loader.message).toBe("Fetching user data...");
    expect(loaderDOM.querySelector("#loadingMessage")).toBeTruthy();
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  // Check that the component is displaying different loading messages
  // for different components
  it("should display different messages for different components", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // array of potential waitingFor targets and their loading messages
    const waitingForOptions = [
      "user",
      "other user",
      "inbox messages",
      "outbox messages",
      "threads messages",
      "thread messages",
      "main page",
      "new posts",
      "suggested posts",
      "user posts",
      "search",
      "admin reports",
      "admin blocks",
      "admin filters",
    ];
    const loadingMessagesOptions = [
      "Fetching user data...",
      "Fetching user data...",
      "Fetching messages...",
      "Fetching messages...",
      "Fetching threads...",
      "Fetching messages...",
      "Fetching posts...",
      "Fetching posts...",
      "Fetching posts...",
      "Fetching user posts...",
      "Searching...",
      "Getting user and post reports...",
      "Getting blocked users...",
      "Getting filtered phrases...",
    ];

    // check that the loading message changes according to the target
    waitingForOptions.forEach((target, index) => {
      loader.waitingFor = target;
      loader.ngOnChanges();
      fixture.detectChanges();
      expect(loader.message).toBe(loadingMessagesOptions[index]);
      expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    });
    done();
  });
});
