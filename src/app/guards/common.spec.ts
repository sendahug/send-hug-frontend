/*
  Common Guard Utilities
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
import { provideRouter, Router, UrlTree } from "@angular/router";
import {} from "jasmine";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { getQueryStringFromRouter, getQueryParamsFromPath } from "./common";

describe("guards/common", () => {
  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [],
      declarations: [],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it("getQueryStringFromRouter() - should get the query params from the current route", () => {
    const queryParams = { userID: "1", query: "param" };
    const router = TestBed.inject(Router);
    const getNavigationSpy = spyOn(router, "getCurrentNavigation").and.returnValue({
      id: 1,
      initialUrl: new UrlTree(undefined, queryParams),
      extractedUrl: new UrlTree(),
      trigger: "imperative",
      extras: {},
      previousNavigation: null,
      abort: () => {},
    });

    const result = getQueryStringFromRouter(router);

    expect(getNavigationSpy).toHaveBeenCalledWith();
    expect(result).toEqual("userID=1&query=param");
  });

  it("getQueryStringFromRouter() - should ignore invalid query params", () => {
    const queryParams = { userID: "1", query: "param", meep: "meep" };
    const router = TestBed.inject(Router);
    const getNavigationSpy = spyOn(router, "getCurrentNavigation").and.returnValue({
      id: 1,
      initialUrl: new UrlTree(undefined, queryParams),
      extractedUrl: new UrlTree(),
      trigger: "imperative",
      extras: {},
      previousNavigation: null,
      abort: () => {},
    });

    const result = getQueryStringFromRouter(router);

    expect(getNavigationSpy).toHaveBeenCalledWith();
    expect(result).toEqual("userID=1&query=param");
    expect(result).not.toContain("meep=meep");
  });

  it("getQueryStringFromRouter() - should return an empty string if there are no query params", () => {
    const router = TestBed.inject(Router);
    const getNavigationSpy = spyOn(router, "getCurrentNavigation").and.returnValue({
      id: 1,
      initialUrl: new UrlTree(),
      extractedUrl: new UrlTree(),
      trigger: "imperative",
      extras: {},
      previousNavigation: null,
      abort: () => {},
    });

    const result = getQueryStringFromRouter(router);

    expect(getNavigationSpy).toHaveBeenCalledWith();
    expect(result).toEqual("");
  });

  it("getQueryParamsFromPath() - should fetch query params from a given string path", () => {
    const path = "meow.com?user=hello&page=2";

    const result = getQueryParamsFromPath(path);

    expect(Object.keys(result)).toEqual(["user", "page"]);
    expect(result["user"]).toEqual("hello");
    expect(result["page"]).toEqual("2");
  });

  it("getQueryParamsFromPath() - should ignore invalid query params", () => {
    const path = "meow.com?user=hello&page=2&beep=beep";

    const result = getQueryParamsFromPath(path);

    expect(Object.keys(result)).toEqual(["user", "page"]);
    expect(result["beep"]).toBeUndefined();
  });
});
