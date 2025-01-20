/*
  Common utilities for the route guards
  Send a Hug app routing
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

import { Params, Router } from "@angular/router";

const AllowedQueryParams = ["page", "id", "user", "userID", "query"];

/**
 * Gets the original request's query parameters from the Angular router
 * and returns a formatted query string.
 * @param router - the Angular router.
 * @returns a string with all the query parameters, ready for the URL.
 */
export function getQueryStringFromRouter(router: Router): string {
  const originalQueryParams = router.getCurrentNavigation()?.initialUrl.queryParamMap;
  return originalQueryParams
    ? originalQueryParams.keys
        .map((key) =>
          AllowedQueryParams.includes(key) ? `${key}=${originalQueryParams.get(key)}` : ``,
        )
        .filter((value) => !!value)
        .join("&")
    : "";
}

/**
 * Gets the query parameters from the given URL and returns an object
 * of the allowed query parameters.
 * @param url - the url to fetch the query parameters from.
 * @returns an object matching the Angular router params structure.
 */
export function getQueryParamsFromPath(url: string): Params {
  const params: Params = {};
  const urlParts = decodeURIComponent(url).split("?");

  if (urlParts.length == 1) return params;

  const paramsArray = urlParts[1].split("&");

  paramsArray.forEach((queryParam) => {
    const queryParamParts = queryParam.split("=");
    if (AllowedQueryParams.includes(queryParamParts[0])) {
      params[queryParamParts[0]] = queryParamParts[1];
    }
  });

  return params;
}
