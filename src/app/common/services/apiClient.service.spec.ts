/*
	APIService Service
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

import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {} from "jasmine";
import { of, tap } from "rxjs";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

import { ApiClientService } from "./apiClient.service";

describe("APIClient Service", () => {
  let httpController: HttpTestingController;
  let apiClientService: ApiClientService;

  // Before each test, configure testing environment
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiClientService],
    }).compileComponents();

    apiClientService = TestBed.inject(ApiClientService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it("should create the service", () => {
    expect(apiClientService).toBeTruthy();
  });

  it("should return an empty observable if there's no current user", (done: DoneFn) => {
    const authSpy = spyOn(
      apiClientService["authService"],
      "getIdTokenForCurrentUser",
    ).and.returnValue(of(""));

    apiClientService.updateAuthToken().subscribe((token) => {
      expect(authSpy).not.toHaveBeenCalled();
      expect(token).toBe("");
      expect(apiClientService["authHeader"].keys()).not.toContain("Authorization");
      done();
    });
  });

  it("should return a token observable if there's a current user", (done: DoneFn) => {
    apiClientService["authService"].authenticated.set(true);
    const authSpy = spyOn(
      apiClientService["authService"],
      "getIdTokenForCurrentUser",
    ).and.returnValue(of("token"));

    apiClientService.updateAuthToken().subscribe((token) => {
      expect(authSpy).toHaveBeenCalled();
      expect(token).toBe("token");
      expect(apiClientService["authHeader"].keys()).toContain("Authorization");
      done();
    });
  });

  it("should generate the HttpParams object", () => {
    const params = apiClientService.getHttpParams({
      param1: "value1",
      param2: "value2",
    });

    expect(params instanceof HttpParams).toBeTrue();
    expect(params.get("param1")).toEqual("value1");
    expect(params.get("param2")).toEqual("value2");
  });

  it("should perform a GET request", () => {
    const mockResponse = {
      data: "test",
    };
    const toggleSpy = spyOn(apiClientService["alertsService"], "toggleOfflineAlert");
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.get("test").subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(toggleSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("GET");
    req.flush(mockResponse);
  });

  it("should handle a GET request error", () => {
    const mockError = {
      status: 404,
      statusText: "Not Found",
    };
    const handleErrorSpy = spyOn(apiClientService, "handleRequestError").and.returnValue(of(null));
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.get("test").subscribe(() => {
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("GET");
    req.flush(null, mockError);
  });

  it("should perform a POST request", () => {
    const mockResponse = {
      data: "test",
    };
    const toggleSpy = spyOn(apiClientService["alertsService"], "toggleOfflineAlert");
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.post("test", {}).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(toggleSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("POST");
    req.flush(mockResponse);
  });

  it("should handle a POST request error", () => {
    const mockError = {
      status: 404,
      statusText: "Not Found",
    };
    const handleErrorSpy = spyOn(apiClientService, "handleRequestError").and.returnValue(of(null));
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.post("test", {}).subscribe(() => {
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("POST");
    req.flush(null, mockError);
  });

  it("should perform a PATCH request", () => {
    const mockResponse = {
      data: "test",
    };
    const toggleSpy = spyOn(apiClientService["alertsService"], "toggleOfflineAlert");
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.patch("test", {}).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(toggleSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("PATCH");
    req.flush(mockResponse);
  });

  it("should handle a PATCH request error", () => {
    const mockError = {
      status: 404,
      statusText: "Not Found",
    };
    const handleErrorSpy = spyOn(apiClientService, "handleRequestError").and.returnValue(of(null));
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.patch("test", {}).subscribe(() => {
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("PATCH");
    req.flush(null, mockError);
  });

  it("should perform a DELETE request", () => {
    const mockResponse = {
      data: "test",
    };
    const toggleSpy = spyOn(apiClientService["alertsService"], "toggleOfflineAlert");
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.delete("test").subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(toggleSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("DELETE");
    req.flush(mockResponse);
  });

  it("should handle a DELETE request error", () => {
    const mockError = {
      status: 404,
      statusText: "Not Found",
    };
    const handleErrorSpy = spyOn(apiClientService, "handleRequestError").and.returnValue(of(null));
    const updateTokenSpy = spyOn(apiClientService, "updateAuthToken").and.returnValue(of(""));

    apiClientService.delete("test").subscribe(() => {
      expect(handleErrorSpy).toHaveBeenCalled();
      expect(updateTokenSpy).toHaveBeenCalled();
    });

    const req = httpController.expectOne(`${apiClientService["serverUrl"]}/test`);
    expect(req.request.method).toEqual("DELETE");
    req.flush(null, mockError);
  });

  it("should create an error alert when a request fails (online)", (done: DoneFn) => {
    spyOnProperty(navigator, "onLine").and.returnValue(true);
    const alertSpy = spyOn(apiClientService["alertsService"], "createErrorAlert");
    const sampleErrorData = {
      status: 404,
      statusText: "Not Found",
      error: { message: "sample error" },
    };
    const sampleError = new HttpErrorResponse(sampleErrorData);

    apiClientService.handleRequestError(sampleError, of(null)).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(alertSpy).toHaveBeenCalled();
        expect(error.error).toEqual(sampleErrorData.error);
        expect(error.status).toEqual(sampleErrorData.status);
        done();
      },
    });
  });

  it("should toggle the offline alert when a request fails (offline)", (done: DoneFn) => {
    spyOnProperty(navigator, "onLine").and.returnValue(false);
    const alertSpy = spyOn(apiClientService["alertsService"], "createErrorAlert");
    const sampleErrorData = {
      status: 404,
      statusText: "Not Found",
      error: { message: "sample error" },
    };
    const sampleError = new HttpErrorResponse(sampleErrorData);
    const toggleSpy = spyOn(apiClientService["alertsService"], "toggleOfflineAlert");

    apiClientService.handleRequestError(sampleError, of(null)).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(alertSpy).not.toHaveBeenCalled();
        expect(toggleSpy).toHaveBeenCalled();
        done();
      },
    });
  });
});
