const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

exports.config = {
  specs: [
    './src/**/*.spec.ts'
  ],
  exclude: ['**/node_modules/**'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      binary: puppeteer.executablePath(),
      args: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-extensions',
        '--disable-dev-shm-usage'
      ]
    }
  },
  allScriptsTimeout: 11000,
  logLevel: 'ERROR',
  directConnect: true,
  seleniumAddress: 'http://localhost:4444',
  params: {
    // login details
    login: {
      username: process.env.LOGIN,
      password: process.env.PASSWORD
    }
  },
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {},
    random: true
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, '../tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: StacktraceOption.PRETTY
      }
    }));
  }
};
