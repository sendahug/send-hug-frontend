const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');

exports.config = {
  specs: [
    './src/**/*.spec.ts'
  ],
  exclude: ['**/node_modules/**'],
  capabilities: {
    browserName: 'chrome'
  },
  allScriptsTimeout: 11000,
  logLevel: 'error',
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
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
