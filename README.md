#

## Version

Version 1 (currently in development).

Built using the [gulp-site-template](https://github.com/shirblc/gulp-site-template) repo.

## Requirements

- Node.js

## Installation and Usage

### Developers

1. Download or clone the repo.
2. cd into the project directory.
3. cd into frontend.
4. Run ```npm install``` to install dependencies.
5. Run ```gulp serve``` to start the local server.
6. Open localhost:3000.

### Users

**Not yet ready for users!**

## Contents

Will be updated as content is added.

## Dependencies

The site uses several tools to maximise compatibility:

1. **Gulp** - Gulp enables running tasks automatically. You can read more on the [Gulp website](https://gulpjs.com). Gulp is a Node.js tool, so it requires installing Node.
2. **Gulp-Postcss** with **Autoprefixer** Plugin - A Gulp plugin which adds the necessary browser prefixes to the CSS file. For more info check the [Gulp-postcss](https://www.npmjs.com/package/gulp-postcss) page and the [Autoprefixer](https://www.npmjs.com/package/autoprefixer) page on NPM.
3. **Browserify** (with vinyl-source-stream and vinyl-buffer) - A library for bundling modular code. Browserify bundles up the main module (AppModule) and converts it from TypeScript to ES6. For more info, check the [Browserify repo](https://github.com/browserify/browserify) and Gulp's [Browserify + Gulp recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md).
4. **Gulp-Babel** - A Gulp plugin for the transpiler Babel. Converts Browserify's ES6 output to the highly supported ES5. For more info check the plugin's [GitHub](https://github.com/babel/gulp-babel) repository.
5. **Gulp-Uglify** - A Gulp plugin which minimises the single ES5 file (Babel's output). For more info check the [Gulp-uglify](https://www.npmjs.com/package/gulp-uglify) page on NPM.
6. **Gulp-Sourcemaps** - A Gulp plugin utilizing the source maps tool. For more info check the [Gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) page on NPM.
7. **Gulp-Rename** - A gulp plugin used to rename files. Used to rename the main module JS and to change the directory name of all HTML files. For more info check the [Gulp-rename](https://www.npmjs.com/package/gulp-rename) page on NPM.
8. **Gulp-replace** - A string replace plugin for Gulp. Used to change the templateUrls in the final JS file. For more info, check the [Gulp-replace](https://www.npmjs.com/package/gulp-replace) page on NPM.
9. **Gulp-Jasmine-Browser** - A headless browser extension for the unit-testing tool Jasmine. The site also includes **Jasmine-core** and **Puppeteer** in order to execute Jasmine tests from the command line. For more info check the [Gulp-jasmine-browser](https://www.npmjs.com/package/gulp-jasmine-browser) page on NPM or the [Jasmine documentation](https://jasmine.github.io/) page.

## Known Issues

There are no current issues at the time.
