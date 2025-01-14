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
import { exit } from "node:process";
import commandLineArgs, { OptionDefinition } from "command-line-args";

import { readLinks, baseUrl } from "./SitemapGen";

// Configure the CLI options.
const cliOptions: OptionDefinition[] = [
  { name: "log_level", type: String, defaultValue: "log" },
  { name: "screenshot", type: Boolean, defaultValue: false },
];
const options = commandLineArgs(cliOptions);

const adminUsername = process.env["CYPRESS_ADMIN_USERNAME"];
const adminPassword = process.env["CYPRESS_ADMIN_PASSWORD"];
let browser: Browser;

const results: any[] = [];

/**
 * Sets up the puppeeter-controlled browser for testing.
 * By default the pa11y implementation doesn't allow us to use the same
 * session for all tests (and thus requires logging in before every test).
 * This allows us to only login once, at the beginning of the test run.
 */
async function setUpBrowser() {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    ignoreHTTPSErrors: false,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
}

/**
 * Runs the initial login process, setting up the credentials for all
 * following tests.
 * @param pa11yConfig - pa11y config object. Temporarily set to any until the types
 *                      are properly exported from the types package.
 */
async function runLogin(pa11yConfig: any) {
  pa11yConfig.log.info("Logging in as admin");

  // Run the check on the login page
  const result = await pa11y("http://localhost:3000/login", {
    ...pa11yConfig,
    browser,
  });
  results.push(result);

  await pa11y("http://localhost:3000/login", {
    ...pa11yConfig,
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

  pa11yConfig.log.info("Successfully logged in as admin");
}

/**
 * Gets the list of URLs from the routes.ts file and runs pa11y on
 * every page in the list.
 * @param pa11yConfig - pa11y config object. Temporarily set to any until the types
 *                      are properly exported from the types package.
 * @param createScreenshots - whether to generate screenshots before each test.
 * @returns an array of the results of all tests.
 */
async function runTests(pa11yConfig: any, createScreenshots: boolean = false) {
  pa11yConfig.log.info("Fetching the list of links to check");

  const linksToCheck = await readLinks();

  pa11yConfig.log.info(`Running pa11y checks on ${linksToCheck.length} URLs`);

  for (const link of linksToCheck) {
    if (link.includes("login")) continue;

    const pathParts = link.substring(1).split("/");
    const actions = [
      `navigate to ${baseUrl}${link}`,
      `wait for element app-login-page to be removed`,
    ];

    // The search needs to be run manually at the moment
    if (link.includes("search")) {
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

    try {
      const page = await browser.newPage();
      const result = await pa11y(`${baseUrl}${link}`, { ...pa11yConfig, browser, actions });
      await page.close();
      results.push(result);
    } catch (error) {
      console.error(error.message);
    }
  }

  pa11yConfig.log.debug(JSON.stringify(results));

  pa11yConfig.log.info("Completed checks. Parsing the results.");

  return results;
}

/**
 * Parses the pa11y errors and displays information about each of the pages
 * and each of the errors encountered there.
 */
function displayErrors(pa11yConfig: any) {
  let didFailTest = false;

  results.forEach((result) => {
    if (result.issues.length == 0)
      console.log(`${result.pageUrl} - ${result.issues.length} errors`);
    else console.error(`${result.pageUrl} - ${result.issues.length} errors`);

    if (result.issues.length > pa11yConfig.threshold) didFailTest = true;

    result.issues.forEach((error) => {
      console.error(`${error.code} ${error.type}:`);
      console.log(`Message: ${error.message}`);
      console.log(`Context: ${error.context}`);
    });

    console.log("");
  });

  if (didFailTest) exit(2);
}

/**
 * Generates the pa11y config based on the
 * @returns pa11y config.
 */
function getConfig() {
  let logLevel = 1;

  switch (options["log_level"].toLowerCase()) {
    case "debug":
      logLevel = 0;
      break;
    case "log":
      logLevel = 1;
      break;
    case "error":
      logLevel = 2;
      break;
    default:
      logLevel = 1;
      break;
  }

  const pa11yConfig = {
    standard: "WCAG2AAA",
    level: "error",
    timeout: 15000,
    threshold: 2,
    log: {
      debug: logLevel == 0 ? console.debug : () => undefined,
      error: logLevel <= 2 ? console.error : () => undefined,
      info: logLevel <= 1 ? console.log : () => undefined,
    },
    ignore: [],
    runners: ["axe", "htmlcs"],
  };

  return pa11yConfig;
}

/**
 * Runs the full a11y testing workflow.
 */
async function run() {
  const pa11yConfig = getConfig();
  await setUpBrowser();
  await runLogin(pa11yConfig);
  await runTests(pa11yConfig, options["screenshot"]);

  await browser.close();
  displayErrors(pa11yConfig);
}

run();
