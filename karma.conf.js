const path = require("path");
// TODO: Figure out how to avoid defining the same module TWICE
// However, seems like Karma doesn't like ESM and since it's deprecated
// it's unlikely to get an update to fix that:
// https://github.com/karma-runner/karma/issues/3677
const { inlineComponentTemplate, inlineSVGs, updateEnvironmentVariables } = require("./processor");
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
        updateEnvironmentVariables("development"),
        coverage({
          exclude: ["node_modules/**", "**/*.spec.ts", "**/*.mock.ts", "tests/**"],
        }),
        inlineComponentTemplate(),
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
