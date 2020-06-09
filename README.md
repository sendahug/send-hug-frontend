# Send A Hug

## Version

Version 1 (currently in development).

Built using the [gulp-site-template](https://github.com/shirblc/gulp-site-template) repo.

For full project information, check the [`main README file`](../readme.md).

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

**For your convenience,** this project utilises Gulp's 'watch' functionality. In order to activate it  while developing, run ```gulp watch```. For more information about Gulp watch, check the [Gulp documentation](https://gulpjs.com/docs/en/getting-started/watching-files/).

### Users

**Not yet ready for users!**

## Contents

The app (located in [src/app](./src/app)) contains the main module (AppModule), defined in **app.module.ts**, and a routing module, defined in **app-routing.module.ts**.

The main module contains 9 components, 3 services and 4 interfaces. Each component folder contains both the HTML template and the component TypeScript file.

### Components

**Located in:** [src/app/components](./src/app/components)

1. **errorPage** - Displays a 'not found' error page if the user attempts to navigate (via Angular's router) to a location that doesn't exist.
2. **fullList** - Displays a full list of paginated posts, depending on the list requested by the user (new or suggested).
3. **loader** - A loader, displayed while the app is fetching data from the backend.
4. **mainPage** - The main page of the app. Displays two lists to the user ('suggested' and 'new') - each with ten posts, as well as 'view full list' links.
5. **messages** - A messages screen. Displays a paginated list of messages sent to the user.
6. **myPosts** - A sub-component of the userPage component. Displays a paginated list of posts by the user whose profile is viewed.
7. **newItem** - A form component allowing users to create a new item (message or post).
8. **popUp** - A sub-component displaying a popup screen with a form for editing items (posts or a user's display name).
9. **userPage** - Displays the user's data as fetched from the backend, as well as a list of the user's posts (as myPost component).

### Interfaces

**Located in:** [src/app/interfaces](./src/app/interfaces)

1. **alert** - An alert interface. Displays a popup alert in the bottom of the screen with an error/success message (depending on the response from the server).
2. **message** - A message interface. Used when fetching messages and displaying them to the user, as well as when the user creates a new message. Reflects the Message model in the backend.
3. **post** - A post interface. Used for all posts lists, as well as for creating a new post. Reflects the Post model in the backend.
4. **user** - A user interface. Used for holding user data as fetched from the server. Reflects the User model in the backend.

### Services

**Located in:** [src/app/services](./src/app/services)

1. **alerts** - Creates and displays an alert to the user, based on the response from the server and using the alert interface.
2. **auth** - Handles authentication-related methods, including login, logout, token refresh and getting and changing user data. View [Authentication](#Authentication) for more details about the authentication process.
3. **items** - Handles all communications with the backend, except for authentication-related methods. Deals with fetching, creating and deleting posts and messages, as well as editing posts.

## Dependencies

### Gulp

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

### Angular

1. **@angular/animations** - Angular's animations library.
2. **@angular/common** - Angular's commonly needed services, pipes and directives.
3. **@angular/compiler** - Angular's template compiler.
4. **@angular/compiler-cli** - Command-line interface to invoke Angular's compiler.
5. **@angular/core** - Critical runtime parts of the Angular framework.
6. **@angular/forms** - Support for template-driven and reactive forms.
7. **@angular/platform-browser** - Everything DOM and browser-related.
8. **@angular/platform-browser-dynamic** - Providers and methods for compiling and running the app.
9. **@angular/router** - Angular's router module.
10. **rxjs** - Contains an implementation of observables, which many Angular APIs use.
11. **typescript** - TypeScript language server, which Angular uses.
12. **zone.js** - Implementation of zones for JavaScript (used by Angular).
13. **core-js** - Modular standard library for JavaScript. Contains polyfills. For more information, check the [GitHub repo](https://github.com/zloirock/core-js).

For more information about Angular's required NPM packages, check the [Angular docs](https://angular.io/guide/npm-packages).

## Authentication

The project uses Auth0 as a third-party authentication provider. Authentication is done by Auth0, which in turn returns a JSON Web Token containing the user's data and permissions.

While the frontend decodes and uses the JWT, it doesn't verify the given token. This is done by the backend. Upon login, a request is made to the server to fetch the user's data. Since getting user's data requires authentication, if the server's response contains the user's data, the frontend can treat the token as valid. Once the token is verified, the user is marked as 'authenticated'.

On top of fetching the user's data, the frontend also deals with login, logout, hash parsing and token refreshing. These are done using [Auth0-js](https://auth0.com/docs/libraries/auth0js/v9), Auth0's client-side library. All authentication handling in the frontend is done by the [AuthService](./src/app/services/auth.service.ts).

The frontend Authentication Process:

1. Once the user logs in, Auth0-js parses the URL hash in order to extract the JWT.

2. The token is then decoded and its payload is passed on.

3. An attempt is made to fetch the user's data from the backend, where the token is verified. If successful, the fetched data is used as the user's data and the user is marked as authenticated.

4. The verified token is added to localStorage, in order to be used later on.

5. Upon logout, the frontend clears all user data, including the saved JWT.

Notes:

  - If the user doesn't exist in the database (the request was rejected because of something other than an AuthError), that means it's a new user. AuthService then makes a request to the server to add the new user to the database.
  - If the user isn't redirected to the app from Auth0, there's no JWT in the URL. In that case, AuthService fetches the JWT from localStorage. If the JWT is still valid, AuthService attempts to refresh it while fetching the user's data. This lets the users stay logged in for longer periods of time without forcing them to actively login again.

## Known Issues

There are no current issues at the time.
