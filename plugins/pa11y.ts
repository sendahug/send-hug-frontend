/*
  Pa11y runner.
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

import pa11y from "pa11y";
import puppeteer, { Browser } from "puppeteer";

import { readLinks, baseUrl } from "./SitemapGen";

const defaultOptions = {
  standard: "WCAG2AAA",
  level: "error",
  timeout: 15000,
  threshold: 2,
  log: {
    debug: console.log,
    error: console.error,
    info: console.log,
  },
  useIncognitoBrowserContext: false,
  ignore: [],
  runners: ["axe", "htmlcs"],
};
const createScreenshots = process.env["CREATE_SCREENSHOTS"] || false;
const adminUsername = process.env["ADMIN_USERNAME"];
const adminPassword = process.env["ADMIN_PASSWORD"];
let browser: Browser;

/**
 * Sets up the puppeeter-controlled browser for testing.
 * By default the pa11y implementation doesn't allow us to use the same
 * session for all tests (and thus requires logging in before every test).
 * This allows us to only login once, at the beginning of the test run.
 */
async function setUpBrowser() {
  browser = await puppeteer.launch({
    // executablePath: process.env.CHROME_BIN,
    executablePath: "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    ignoreHTTPSErrors: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
}

/**
 * Runs the initial login process, setting up the credentials for all
 * following tests.
 */
async function runLogin() {
  console.log("Logging in as admin");

  // @ts-ignore - the AccessibilityStandard type needs to be exported from the types package
  await pa11y("http://localhost:3000/login", {
    ...defaultOptions,
    browser,
    actions: [
      "navigate to http://localhost:3000/login",
      "wait for element #loginForm to be visible",
      "screen capture pa11y/login0.png",
      `set field #username to ${adminUsername}`,
      `set field #password to ${adminPassword}`,
      "click element #logIn",
      "screen capture pa11y/login1.png",
      "wait for path to not be /login",
    ],
  });

  console.log("Successfully logged in as admin");
}

/**
 * Gets the list of URLs from the routes.ts file and runs pa11y on
 * every page in the list.
 * @returns an array of the results of all tests.
 */
async function runTests() {
  console.log("Fetching the list of links to check");

  const linksToCheck = await readLinks();
  const pa11yRuns: Promise<any>[] = [];
  linksToCheck.forEach((url) => {
    const pathParts = url.substring(1).split("/");
    const actions = [
      `navigate to ${baseUrl}${url}`,
      `wait for path to not be /login?redirect=${url}`,
    ];

    // The search needs to be run manually at the moment
    if (url.includes("search")) {
      const searchActions = [
        `navigate to ${baseUrl}`,
        "click element #searchBtn",
        "wait for element #searchQuery to be visible",
        "set field #searchQuery to t",
        "click element #sendSearchBtn",
        "wait for element #searchResultsMain to be visible",
      ];
      actions.push(...searchActions);
    }

    if (createScreenshots)
      actions.push(`screen capture pa11y/${pathParts[pathParts.length - 1]}.png`);

    // @ts-ignore - the AccessibilityStandard type needs to be exported from the types package
    pa11yRuns.push(pa11y(`${baseUrl}${url}`, { ...defaultOptions, browser, actions }));
  });

  console.log(`Running pa11y checks on ${pa11yRuns.length} URLs`);

  const results = await Promise.all(pa11yRuns);

  console.log("Successfully completed checks");

  return results;
}

/**
 * Runs the full a11y testing workflow.
 */
async function run() {
  await setUpBrowser();
  await runLogin();
  await runTests();

  await browser.close();
}

run();
