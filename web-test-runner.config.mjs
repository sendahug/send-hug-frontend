/*
  MIT License

  Copyright (c) 2020-2024 Shir Bar Lev

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

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defaultReporter } from "@web/test-runner";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fromRollup } from "@web/dev-server-rollup";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";
import { TranspileDecoratorsVite, ReplaceTemplateUrlPlugin, ServeSVGsPlugin } from "./plugins.mjs";

// TODO: Figure out how to replace these plugins with the angular compiler
const templatePlugin = fromRollup(ReplaceTemplateUrlPlugin);
const decoratorTranspiler = fromRollup(TranspileDecoratorsVite);
const configPaths = fromRollup(tsConfigPaths);

/** @type {import("@web/test-runner").TestRunnerConfig} */
export default {
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true })],
  coverage: true,
  files: ["src/**/*.spec.ts", "!plugins/tests.ts"],
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    // playwrightLauncher({ product: 'webkit' }),
    // playwrightLauncher({ product: 'firefox' }),
  ],
  nodeResolve: true,
  CoverageConfig: {
    include: ["src/**/*.ts"],
    exclude: [
      "node_modules/**",
      "src/**/*.spec.ts",
      "src/main.ts",
      "src/app/app.config.ts",
      "src/app/app.routes.ts",
      "src/polyfills.ts",
      "src/assets/*",
      "plugins/tests.ts",
      "tests/*",
    ],
    report: true,
    reportDir: "./coverage",
    reporters: ["html", "lcovonly", "text-summary"],
  },
  // Credit to @blueprintui for most of the HTML.
  // https://github.com/blueprintui/web-test-runner-jasmine/blob/main/src/index.ts
  testRunnerHtml: (_path, _config) => fs.readFileSync("./plugins/tests.html", { encoding: "utf8" }),
  testsStartTimeout: 5000,
  testsFinishTimeout: 5000,
  debug: false,
  plugins: [
    configPaths({}),
    templatePlugin(),
    decoratorTranspiler(),
    ServeSVGsPlugin(),
    esbuildPlugin({
      target: "es2020",
      ts: true,
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
    }),
  ],
  concurrency: 1,
};
