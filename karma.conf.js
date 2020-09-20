const path = require('path');
process.env.CHROME_BIN = '/usr/bin/google-chrome-stable';

// Karma configuration file
module.exports = function (karma) {
  karma.set({
    basePath: '',
    frameworks: ['jasmine', 'browserify'],
    mime: { 'text/x-typescript': ['ts','tsx'] },
    files: [
        { pattern: "./src/**/*.spec.ts" },
        { pattern: "./tests/app.js" }
    ],
    preprocessors: {
        "./tests/src/**/*.spec.ts" : ['browserify'],
        './tests/app.bundle.js': ['sourcemap']
    },
    browserify: {
      debug: true,
      plugin: ['tsify'],
      extensions: ['ts', 'tsx'],
      configure: function(bundle) {
        bundle.on('prebundle', function() {
          bundle.transform('tsify', { target: 'es6' });
        });
      }
    },
    coverageIstanbulReporter: {
      dir: path.resolve(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
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
