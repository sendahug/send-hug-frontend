const path = require('path');
const ngTools = require('@ngtools/webpack');

// Karma configuration file
module.exports = function (karma) {
  karma.set({
    basePath: '',
    frameworks: ['jasmine'],
    mime: { 'text/x-typescript': ['ts','tsx'] },
    files: [
        { pattern: "src/base.spec.ts" },
        { pattern: "src/**/*.+(ts|html)" }
    ],
    preprocessors: {
        './src/**/*.spec.ts': ['webpack'],
        './src/**/*.ts': ['webpack', 'sourcemap', 'coverage']
    },
    webpack: {
        devtool: "source-map",
        entry: {
          app: './src/main.ts',
          test: './base.spec.ts'
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
      dir: require('path').join(__dirname, './coverage/angular-gulp'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    // add both "karma-coverage" and "karma-remap-coverage" reporters
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    logLevel: 'DEBUG',
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true
  });
};
