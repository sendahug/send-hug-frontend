const path = require('path');
process.env.CHROME_BIN = '/usr/bin/google-chrome-stable';

// Karma configuration file
module.exports = function (karma) {
  karma.set({
    basePath: '',
    frameworks: ['jasmine', 'browserify'],
    mime: { 'text/x-typescript': ['ts','tsx'] },
    files: [
        { pattern: "./tests/app.bundle.js" },
        { pattern: "tests/src/tests.specs.ts" }
    ],
    preprocessors: {
        './tests/app.bundle.js': ['sourcemap'],
        'tests/src/tests.specs.ts': ['browserify']
    },
    browserify: {
      debug: true,
      plugin: ['tsify'],
      transform: ['browserify-istanbul'],
      extensions: ['ts', 'tsx'],
      configure: function(bundle) {
        bundle.plugin('tsify', { target: 'es6' });
        bundle.transform(require('browserify-istanbul')({
          ignore: ['**/node_modules/**', 'src/**', '**/*.mock.ts', '**/*.spec.ts'],
          defaultIgnore: false
        }))
      }
    },
    coverageIstanbulReporter: {
      dir: path.resolve(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary']
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'kjhtml', 'coverage', 'coverage-istanbul'],
    port: 9876,
    logLevel: 'DEBUG',
    autoWatch: false,
    browsers: ['ChromeNoSandbox'],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
            '--disable-gpu',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-dev-shm-usage'
        ]
      }
    },
    singleRun: true,
	  browserDisconnectTimeout: 10000,
	  browserNoActivityTimeout: 100000
  });
};
