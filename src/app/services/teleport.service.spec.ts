/*
	Teleporter Service
	Send a Hug Service Tests
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

import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { Component, ElementRef, ViewChild } from "@angular/core";

import { TeleportService } from "./teleport.service";

// Mock User Page for testing the sub-component
// ==================================================
@Component({
  selector: "app-mock",
  template: `
    <!-- If the user is logged in, displays a user page. -->
    <div #profileContainer id="profileContainer"></div>
  `,
  standalone: true,
})
class MockPage {
  @ViewChild("profileContainer") profileContainer!: ElementRef;

  constructor() {}
}

describe("TeleportService", () => {
  let teleportService: TeleportService;
  let mockPage: ComponentFixture<MockPage>;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [MockPage],
      providers: [TeleportService],
    }).compileComponents();

    teleportService = TestBed.inject(TeleportService);
    mockPage = TestBed.createComponent(MockPage);
  });

  it("should create the service", () => {
    expect(teleportService).toBeTruthy();
  });

  it("createTeleportTarget() - creates a target", () => {
    mockPage.detectChanges();
    teleportService.createTeleportTarget("test", mockPage.componentInstance.profileContainer);

    expect(teleportService["teleportTargets"]["test"]).toBeDefined();
    expect(teleportService["teleportTargets"]["test"]).toEqual(
      mockPage.componentInstance.profileContainer,
    );
  });

  it("getTeleportTarget() - gets a teleport target", () => {
    mockPage.detectChanges();
    teleportService.createTeleportTarget("test", mockPage.componentInstance.profileContainer);

    const target = teleportService.getTeleportTarget("test");

    expect(target).toBeDefined();
    expect(target).toEqual(mockPage.componentInstance.profileContainer);
  });
});
