const path = require('path');
const ngTools = require('@ngtools/webpack');

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.ts"
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: "app.bundle.js"
  },
  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: [
          '@ngtools/webpack',
          { loader: 'angular2-template-loader' },
          { loader: 'angular-router-loader' }
        ]
      }, {
        test: /\.html$/,
        loader: 'html-loader',
      }
    ],
  },
  plugins: [
    new ngTools.AngularCompilerPlugin({
      tsConfigPath: 'tsconfig.json',
      entryModule: 'src/app/app.module#AppModule',
      sourceMap: true,
      locale: 'en',
      hostReplacementPaths: {
        'src/environments/config.development.ts': 'src/environments/config.production.ts'
      }
    })
  ]
};
