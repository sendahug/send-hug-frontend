const path = require('path');
const ngTools = require('@ngtools/webpack');
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

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
        { pattern: "./src/base.spec.ts", included: false },
        { pattern: "./src/**/*.+(ts|html)" }
    ],
    preprocessors: {
        './src/base.spec.ts': ['webpack'],
        './src/**/*.ts': ['webpack', 'sourcemap', 'coverage']
    },
    webpack: {
        devtool: "source-map",
        entry: {
          app: './src/main.ts',
          test: './src/base.spec.ts'
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
        resolve: {
            extensions: [".ts", ".js"]
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
    webpackMiddleware: {
        quiet: true,
        stats: {
            colors: true
        }
    },
    coverageIstanbulReporter: {
      dir: path.resolve(__dirname, './coverage/angular-gulp'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
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
            '--disable-setuid-sandbox'
        ]
      }
    },
    singleRun: true,
	  browserDisconnectTimeout: 10000,
	  browserNoActivityTimeout: 100000
  });
};
