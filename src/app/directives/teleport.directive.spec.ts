/*
  Teleport
  Send a Hug Directive Tests
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
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import { TeleportDirective } from "./teleport.directive";
import { TeleportService } from "@app/services/teleport.service";

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
class MockPage implements AfterViewInit {
  @ViewChild("profileContainer") profileContainer!: ElementRef;

  constructor(private teleporterService: TeleportService) {}

  ngAfterViewInit(): void {
    this.teleporterService.createTeleportTarget("test", this.profileContainer);
  }
}

@Component({
  selector: "app-child",
  template: `
    <span>
      <div *teleport="teleportTarget">MEEP!</div>
    </span>
  `,
  standalone: true,
  imports: [TeleportDirective],
})
class MockChild {
  teleportTarget = "test";
}

describe("TeleportDirective", () => {
  let fixture: ComponentFixture<MockPage>;
  let mockPageDOM: any; // according to Angular's own typing

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [MockPage, TeleportDirective, MockChild],
      providers: [TeleportService],
    }).compileComponents();

    fixture = TestBed.createComponent(MockPage);
    mockPageDOM = fixture.nativeElement;
    fixture.autoDetectChanges();
  });

  it("should teleport the chosen element", () => {
    const childFixture = TestBed.createComponent(MockChild);
    childFixture.autoDetectChanges();

    const container = mockPageDOM.querySelector("#profileContainer");
    expect(container.children.length).toBe(1);
    expect(container.querySelectorAll("div")[0].textContent).toBe("MEEP!");
    expect(childFixture.nativeElement.querySelector("div")).toBeNull();
  });

  it("should do nothing if the target doesn't exist", () => {
    const childFixture = TestBed.createComponent(MockChild);
    childFixture.componentInstance.teleportTarget = "meow";
    childFixture.autoDetectChanges();

    expect(mockPageDOM.querySelector("#profileContainer").children.length).toBe(0);
    expect(childFixture.nativeElement.querySelector("div")).toBeDefined();
    expect(childFixture.nativeElement.querySelector("div").textContent).toBe("MEEP!");
  });

  it("should remove the content once the element is destroyed", () => {
    const childFixture = TestBed.createComponent(MockChild);
    childFixture.detectChanges();

    expect(
      mockPageDOM.querySelector("#profileContainer").querySelectorAll("div")[0].textContent,
    ).toBe("MEEP!");
    expect(childFixture.nativeElement.querySelector("div")).toBeNull();

    childFixture.destroy();

    expect(mockPageDOM.querySelector("#profileContainer").children.length).toBe(0);
    expect(mockPageDOM.querySelector("#profileContainer").querySelector("div")).toBeNull();
  });
});
