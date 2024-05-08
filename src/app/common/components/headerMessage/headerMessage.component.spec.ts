/*
	Loader
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

import { HeaderMessage } from "./headerMessage.component";
import { CommonTestModules } from "@tests/commonModules";

describe("HeaderMessage", () => {
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
        ...CommonTestModules,
      ],
      declarations: [HeaderMessage],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  });

  // Check that the component is created
  it("should create the component", () => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    expect(headerMessage).toBeTruthy();
  });

  // Check that the component checks for loading target
  it("onInit - should check what target the parent component is waiting on", () => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const loadingSpy = spyOn(headerMessage, "checkLoadingTarget").and.callFake(
      () => (headerMessage.message = "test"),
    );
    headerMessage.waitingFor = "other user";

    fixture.detectChanges();
    headerMessage.ngOnInit();

    expect(headerMessage.message).toEqual("test");
    expect(loadingSpy).toHaveBeenCalled();
  });

  it("onChange - should check what taget the parent component is waiting on", () => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const loadingSpy = spyOn(headerMessage, "checkLoadingTarget").and.callFake(
      () => (headerMessage.message = "test"),
    );
    headerMessage.waitingFor = "other user";

    fixture.detectChanges();
    headerMessage.ngOnChanges();

    expect(headerMessage.message).toEqual("test");
    expect(loadingSpy).toHaveBeenCalled();
  });

  // Check that the component displays a loading message
  it("should display a loading message", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;
    headerMessage.waitingFor = "other user";

    fixture.detectChanges();

    expect(headerMessage.message).toBeDefined();
    expect(headerMessage.message).toBe("Fetching user data from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage")).toBeTruthy();
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });

  // Check that the component is displaying different loading messages
  // for different components
  // TODO: The below tests really should be parameterised, but still need to figure
  // out how to do it in Jasmine
  it("should display different messages for different components - other user", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    headerMessage.waitingFor = "other user";
    headerMessage.ngOnChanges();
    fixture.detectChanges();
    expect(headerMessage.message).toBe("Fetching user data from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });

  it("should display different messages for different components - inbox messages", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    headerMessage.waitingFor = "inbox messages";
    headerMessage.ngOnChanges();
    fixture.detectChanges();
    expect(headerMessage.message).toBe("Fetching messages from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });

  it("should display different messages for different components - outbox messages", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    headerMessage.waitingFor = "outbox messages";
    headerMessage.ngOnChanges();
    fixture.detectChanges();
    expect(headerMessage.message).toBe("Fetching messages from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });

  it("should display different messages for different components - threads messages", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    headerMessage.waitingFor = "threads messages";
    headerMessage.ngOnChanges();
    fixture.detectChanges();
    expect(headerMessage.message).toBe("Fetching threads from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });

  it("should display different messages for different components - thread messages", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    headerMessage.waitingFor = "thread messages";
    headerMessage.ngOnChanges();
    fixture.detectChanges();
    expect(headerMessage.message).toBe("Fetching messages from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });

  it("should display different messages for different components - user posts", (done: DoneFn) => {
    const fixture = TestBed.createComponent(HeaderMessage);
    const headerMessage = fixture.componentInstance;
    const headerMessDOM = fixture.nativeElement;

    // check that the loading message changes according to the target
    headerMessage.waitingFor = "user posts";
    headerMessage.ngOnChanges();
    fixture.detectChanges();
    expect(headerMessage.message).toBe("Fetching user posts from the server...");
    expect(headerMessDOM.querySelector("#loadingMessage").textContent).toBe(headerMessage.message);
    done();
  });
});
