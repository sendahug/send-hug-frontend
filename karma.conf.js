const path = require("path");
const replaceTemplateUrl = require("./processor").replaceTemplateUrl;
const inlineSVGs = require("./processor").inlineSVGs;
const coverage = require("rollup-plugin-istanbul");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve").nodeResolve;
const typescript = require("@rollup/plugin-typescript");
process.env.CHROME_BIN = "/usr/bin/google-chrome-stable";

// Karma configuration file
module.exports = function (karma) {
  karma.set({
    basePath: "",
    frameworks: ["jasmine", "viewport"],
    mime: { "text/x-typescript": ["ts", "tsx"] },
    files: [{ pattern: "src/tests.specs.ts" }],
    preprocessors: {
      "./src/tests.specs.ts": ["coverage", "rollup", "sourcemap"],
    },
    rollupPreprocessor: {
      plugins: [
        coverage({
          exclude: ["node_modules/**", "**/*.spec.ts", "**/*.mock.ts"],
        }),
        replaceTemplateUrl(),
        inlineSVGs(),
        typescript({ exclude: ["e2e/**/*"] }),
        nodeResolve({
          extensions: [".js", ".ts"],
        }),
        commonjs({
          extensions: [".js", ".ts"],
          transformMixedEsModules: true,
        }),
      ],
      output: {
        sourcemap: "inline",
      },
    },
    coverageIstanbulReporter: {
      dir: path.resolve(__dirname, "./coverage"),
      reports: ["html", "lcovonly", "text-summary"],
    },
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ["progress", "kjhtml", "coverage", "coverage-istanbul"],
    port: 9876,
    logLevel: "DEBUG",
    autoWatch: false,
    browsers: ["ChromeNoSandbox"],
    customLaunchers: {
      ChromeNoSandbox: {
        base: "ChromeHeadless",
        flags: [
          "--disable-gpu",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-extensions",
          "--disable-dev-shm-usage",
        ],
      },
    },
    singleRun: true,
    browserDisconnectTimeout: 10000,
    browserNoActivityTimeout: 100000,
  });
};
