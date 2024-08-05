/*
	API Client Service
	Send a Hug Service
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

// Angular imports
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, catchError, of, switchMap, tap, throwError } from "rxjs";

// App-related imports
import { AlertsService } from "@app/services/alerts.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ApiClientService {
  readonly serverUrl = import.meta.env["VITE_BACKEND_URL"];
  private authHeader: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json");

  constructor(
    private http: HttpClient,
    private alertsService: AlertsService,
    private authService: AuthService,
  ) {}

  /**
   * Updates the auth header with the current user token.
   */
  updateAuthToken(): Observable<string | undefined> {
    if (!this.authService.authenticated()) return of("");

    return this.authService.getIdTokenForCurrentUser().pipe(
      tap((token) => {
        if (token) {
          this.authHeader = this.authHeader.set("Authorization", `Bearer ${token}`);
        }
      }),
    );
  }

  /**
   * Generates the HttpParams object from the given parameters.
   * @param params - a key-value mapping of parameters to set.
   * @returns theh HttpParams object.
   */
  getHttpParams(params: { [key: string]: any }): HttpParams {
    return new HttpParams({
      fromObject: params,
    });
  }

  /**
   * Performs a GET request.
   * @param endpoint - the endpoint to query.
   * @param params - any query parameters.
   * @returns an observable of the response / an error if one occurred.
   */
  get<T extends Object>(endpoint: string, params?: { [key: string]: any }): Observable<T> {
    return this.updateAuthToken()
      .pipe(
        switchMap((_token) =>
          this.http.get<T>(`${this.serverUrl}/${endpoint}`, {
            headers: this.authHeader,
            params: this.getHttpParams(params || {}),
          }),
        ),
      )
      .pipe(
        // if the server is unavilable due to the user being offline, tell the user
        tap((_res) => this.alertsService.toggleOfflineAlert()),
        catchError(this.handleRequestError.bind(this)),
      );
  }

  /**
   * Performs a POST request.
   * @param endpoint - the endpoint to query.
   * @param body - the body of the request.
   * @param params - any query parameters.
   * @returns an observable of the response / an error if one occurred.
   */
  post<T extends Object>(
    endpoint: string,
    body: any,
    params?: { [key: string]: any },
  ): Observable<T> {
    return this.updateAuthToken()
      .pipe(
        switchMap((_token) =>
          this.http.post<T>(`${this.serverUrl}/${endpoint}`, body, {
            headers: this.authHeader,
            params: this.getHttpParams(params || {}),
          }),
        ),
      )
      .pipe(
        // if the server is unavilable due to the user being offline, tell the user
        tap((_res) => this.alertsService.toggleOfflineAlert()),
        catchError(this.handleRequestError.bind(this)),
      );
  }

  /**
   * Performs a PATCH request.
   * @param endpoint - the endpoint to query.
   * @param body - the body of the request.
   * @param params - any query parameters.
   * @returns an observable of the response / an error if one occurred.
   */
  patch<T extends Object>(
    endpoint: string,
    body: any,
    params?: { [key: string]: any },
  ): Observable<T> {
    return this.updateAuthToken()
      .pipe(
        switchMap((_token) =>
          this.http.patch<T>(`${this.serverUrl}/${endpoint}`, body, {
            headers: this.authHeader,
            params: this.getHttpParams(params || {}),
          }),
        ),
      )
      .pipe(
        // if the server is unavilable due to the user being offline, tell the user
        tap((_res) => this.alertsService.toggleOfflineAlert()),
        catchError(this.handleRequestError.bind(this)),
      );
  }

  /**
   * Performs a DELETE request.
   * @param endpoint - the endpoint to query.
   * @param params - any query parameters.
   * @returns an observable of the response / an error if one occurred.
   */
  delete<T extends Object>(endpoint: string, params?: { [key: string]: any }): Observable<T> {
    return this.updateAuthToken()
      .pipe(
        switchMap((_token) =>
          this.http.delete<T>(`${this.serverUrl}/${endpoint}`, {
            headers: this.authHeader,
            params: this.getHttpParams(params || {}),
          }),
        ),
      )
      .pipe(
        // if the server is unavilable due to the user being offline, tell the user
        tap((_res) => this.alertsService.toggleOfflineAlert()),
        catchError(this.handleRequestError.bind(this)),
      );
  }

  /**
   * Does initial error handling for requests.
   * @param error - the error response.
   * @param caught - the observable that threw the error.
   * @returns an observable of the error.
   */
  handleRequestError<T>(error: HttpErrorResponse, _caught: Observable<T>): Observable<T> {
    // if the server is unavilable due to the user being offline, tell the user
    if (!navigator.onLine) {
      this.alertsService.toggleOfflineAlert();
    }
    // otherwise just create an error alert
    else {
      this.alertsService.createErrorAlert(error);
    }

    return throwError(() => error);
  }
}
