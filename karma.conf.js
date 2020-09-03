const path = require('path');
const ngTools = require('@ngtools/webpack');
process.env.CHROME_BIN = '/usr/bin/google-chrome-stable';

// Karma configuration file
module.exports = function (karma) {
  karma.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-webpack'),
      require('karma-coverage'),
      require('karma-sourcemap-loader')
    ],
    mime: { 'text/x-typescript': ['ts','tsx'] },
    files: [
        { pattern: "./src/**/*.spec.ts" },
        { pattern: "./tests/app.js" }
    ],
    preprocessors: {
        "./tests/app.js": ['sourcemap', 'coverage'],
        './src/**/*.spec.ts': ['webpack', 'sourcemap', 'coverage']
    },
    webpack: {
        devtool: "eval-source-map",
        entry: {
          app: './src/main.ts',
          test: './src/tests.ts'
        },
        mode: "development",
        node: { fs: 'empty' },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader'
                },
                {
                  test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                  loader: [
                    '@ngtools/webpack',
                    { loader: 'angular-router-loader' }
                  ]
                }
            ]
        },
        plugins: [
          new ngTools.AngularCompilerPlugin({
            tsConfigPath: 'tsconfig.json',
            basePath: './',
            entryModule: path.resolve(__dirname, 'src/app/app.module#AppModule'),
            skipCodeGeneration: true,
            sourceMap: true,
            directTemplateLoading: false,
            locale: 'en',
            hostReplacementPaths: {
              'src/environments/config.development.ts': 'src/environments/config.production.ts'
            }
          })
        ]
    },
    coverageIstanbulReporter: {
      dir: path.resolve(__dirname, './coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    coverageReporter: {
      reports: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ],
      dir : 'coverage/'
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
