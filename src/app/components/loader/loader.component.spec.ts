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

import { AppComponent } from "../../app.component";
import { Loader } from "./loader.component";
import { AppAlert } from "../appAlert/appAlert.component";

describe("Loader", () => {
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
      declarations: [AppComponent, Loader, AppAlert],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
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
  it("onInit - should check what target the parent component is waiting on", () => {
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loadingSpy = spyOn(loader, "checkLoadingTarget").and.callFake(
      () => (loader.message = "test"),
    );
    loader.waitingFor = "other user";

    fixture.detectChanges();
    loader.ngOnInit();

    expect(loader.message).toEqual("test");
    expect(loadingSpy).toHaveBeenCalled();
  });

  it("onChange - should check what taget the parent component is waiting on", () => {
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loadingSpy = spyOn(loader, "checkLoadingTarget").and.callFake(
      () => (loader.message = "test"),
    );
    loader.waitingFor = "other user";

    fixture.detectChanges();
    loader.ngOnChanges();

    expect(loader.message).toEqual("test");
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
  // TODO: The below tests really should be parameterised, but still need to figure
  // out how to do it in Jasmine
  it("should display different messages for different components - user", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "user";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching user data...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - other user", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "other user";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching user data...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - inbox messages", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "inbox messages";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching messages...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - outbox messages", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "outbox messages";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching messages...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - threads messages", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "threads messages";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching threads...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - thread messages", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "thread messages";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching messages...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - main page", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "main page";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching posts...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - new posts", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "new posts";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching posts...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - suggested posts", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "suggested posts";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching posts...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - user posts", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "user posts";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Fetching user posts...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - search", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "search";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Searching...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - admin reports", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "admin reports";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Getting user and post reports...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - admin blocks", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "admin blocks";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Getting blocked users...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });

  it("should display different messages for different components - admin filters", (done: DoneFn) => {
    TestBed.createComponent(AppComponent);
    const fixture = TestBed.createComponent(Loader);
    const loader = fixture.componentInstance;
    const loaderDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    loader.waitingFor = "admin filters";
    loader.ngOnChanges();
    fixture.detectChanges();
    expect(loader.message).toBe("Getting filtered phrases...");
    expect(loaderDOM.querySelector("#loadingMessage").textContent).toBe(loader.message);
    done();
  });
});
