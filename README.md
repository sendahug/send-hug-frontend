# Send A Hug

[![CircleCI](https://circleci.com/gh/sendahug/send-hug-frontend.svg?style=shield)](https://circleci.com/gh/sendahug/send-hug-frontend)
![CI](https://github.com/sendahug/send-hug-frontend/workflows/Test%20CI/badge.svg)
[![codecov](https://codecov.io/gh/sendahug/send-hug-frontend/graph/badge.svg)](https://codecov.io/gh/sendahug/send-hug-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/sendahug/send-hug-frontend/badge.svg)](https://snyk.io/test/github/sendahug/send-hug-frontend)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/sendahug/send-hug-frontend)
[![dependencies Status](https://david-dm.org/sendahug/send-hug-frontend/status.svg)](https://david-dm.org/sendahug/send-hug-frontend)
[![devDependencies Status](https://david-dm.org/sendahug/send-hug-frontend/dev-status.svg)](https://david-dm.org/sendahug/send-hug-frontend?type=dev)
![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=blue&up_message=online&url=https%3A%2F%2Fsend-hug.herokuapp.com)

## Version

Version 1 (currently in development).

Built using the [gulp-site-template](https://github.com/shirblc/gulp-site-template) repo.

For full project information, check the [`main README file`](https://github.com/sendahug/sendahug/blob/master/README.md).

## Requirements

- Node.js

## Installation and Usage

### Developers

1. Download or clone the repo.
2. cd into the project directory.
3. cd into frontend.
4. Run ```npm install``` to install dependencies.
5. Run ```gulp localdev``` to compile the whole project for local development.
6. Run ```gulp serve``` to start the local server.
7. Open localhost:3000.

**For your convenience,** this project utilises Gulp's 'watch' functionality. In order to activate it  while developing, run ```gulp watch```. For more information about Gulp watch, check the [Gulp documentation](https://gulpjs.com/docs/en/getting-started/watching-files/).

### Users

**Not yet ready for users!**

## Contents

The app (located in [src/app](./src/app)) contains the main module (AppModule), defined in **app.module.ts**, and a routing module, defined in **app-routing.module.ts**.

The main module contains 15 components, 7 services and 7 interfaces. Each component folder contains both the HTML template and the component TypeScript file.

### Components

**Located in:** [src/app/components](./src/app/components)

1. **aboutApp** - Displays an 'about the app' page.
2. **adminDashboard** - An admin dashboard, allowing admins to handle reports, user blocks and filtered words easily.
3. **errorPage** - Displays a 'not found' error page if the user attempts to navigate (via Angular's router) to a location that doesn't exist.
4. **fullList** - Displays a full list of paginated posts, depending on the list requested by the user (new or suggested).
5. **headerMessage** - A loader displayed, displayed while the app is fetching data from the backend.
6. **iconEditor** - A settings sub-component for choosing and editing user icons.
7. **loader** - A loader, displayed while the app is fetching data from the backend; if this isn't the user's first visit to the app, the loader only stays while the app is fetching data from IndexedDB.
8. **mainPage** - The main page of the app. Displays two lists to the user ('suggested' and 'new') - each with ten posts, as well as 'view full list' links.
9. **messages** - A messages screen. Displays a paginated list of messages sent to the user.
10. **myPosts** - A sub-component of the userPage component. Displays a paginated list of posts by the user whose profile is viewed.
11. **newItem** - A form component allowing users to create a new item (message or post).
12. **notifications** - A tab component to display the latest notifications for the currently logged-in user.
13. **popUp** - A sub-component displaying a popup screen with a form for editing items (posts or a user's display name).
14. **post** - A single post sub-component, containing all of a post's functionality.
15. **searchResults** - A component to display the results of the user's search.
16. **settings** - Lets the user control their settings for various components, such as the notifications component.
17. **siteMap** - A site map, containing a list of the site's pages.
18. **sitePolicies** - A component containing the site's T&Cs, privacy policy and cookies policy.
19. **supportPage** - A component containing FAQs and details about communicating with the Send A Hug team.
20. **userPage** - Displays the user's data as fetched from the backend, as well as a list of the user's posts (as myPost component).

### Interfaces

**Located in:** [src/app/interfaces](./src/app/interfaces)

1. **alert** - An alert interface. Displays a popup alert in the bottom of the screen with an error/success message (depending on the response from the server).
2. **message** - A message interface. Used when fetching messages and displaying them to the user, as well as when the user creates a new message. Reflects the Message model in the backend.
3. **otherUser** - A light version of the user interface, used to display other users' data (excluding more sensitive information like JWT and Auth0 ID).
4. **post** - A post interface. Used for all posts lists, as well as for creating a new post. Reflects the Post model in the backend.
5. **report** - A report interface, for submitting and reading user and post reports.
6. **thread** - A thread interface, for easily displaying message threads.
7. **user** - A user interface. Used for holding user data as fetched from the server. Reflects the User model in the backend.

### Services

**Located in:** [src/app/services](./src/app/services)

1. **admin** - An admin service for handling all admin dashboard related methods. This includes handling user and post reports, blocking and unblocking users and managing filters list.
2. **alerts** - Creates and displays an alert to the user, based on the response from the server and using the alert interface.
3. **auth** - Handles authentication-related methods, including login, logout, token refresh and getting and changing user data. View [Authentication](#Authentication) for more details about the authentication process.
4. **items** - Handles communications with the backend for non-post related communications. Deals with fetching user posts, handling messages (fetching, sending and deleting), running a search and sending a report.
5. **notifications** - Handles all notification-related communication, including push notifications subscription and setting the notifications' refresh time.
6. **posts** - Handles all backend communication for post-related communications (except for a specific user's posts). This includes getting, creating, editing and deleting posts.
7. **swmanager** - Handles the Service Worker and the IDBPromised database created for offline usage.

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
10. **@angular/service-worker** - Angular's ServiceWorker module.
11. **rxjs** - Contains an implementation of observables, which many Angular APIs use.
12. **typescript** - TypeScript language server, which Angular uses.
13. **zone.js** - Implementation of zones for JavaScript (used by Angular).
14. **core-js** - Modular standard library for JavaScript. Contains polyfills. For more information, check the [GitHub repo](https://github.com/zloirock/core-js).

For more information about Angular's required NPM packages, check the [Angular docs](https://angular.io/guide/npm-packages).

### Other

1. **IDB** (formerly IDBPromised) - An improved version of IndexedDB, which is Promise-based and includes various enhancements to improve the API's usability. For more information, check the [IDBP repo](https://github.com/jakearchibald/idb).
2. **Auth0-js** - Auth0's JS library, used for user authentication. For more information, check [Auth0's documentation](https://auth0.com/docs/libraries/auth0js).

### Testing Dependencies

This project's tests are run using the Jasmine framework and the Karma runner. Thus, testing requires several packages:

1. **Jasmine** - An open-source behaviour-driven testing framework. For more information, check Jasmine's [official site](https://jasmine.github.io). Included packages:
    - **jasmine-core**
    - **jasmine-spec-reporter**
    - **@types/jasmine** - A typed version, required in order to write TypeScript tests.
2. **Karma** - An open-source test-runner, used to run the tests on various devices with a test server. For more information, check Karma's [official site](https://karma-runner.github.io/latest/index.html). Included packages:
    - **karma**
    - **karma-jasmine** - A Karma adapter for the Jasmine framework. [Project repo.](https://github.com/karma-runner/karma-jasmine)
    - **karma-jasmine-html-reporter** - A reporter that shows test results in HTML. [NPM page.](https://www.npmjs.com/package/karma-jasmine-html-reporter).
    - **karma-chrome-launcher** - A launcher for Chrome, Chrome Canary and Chromuim. [Project repo.](https://github.com/karma-runner/karma-chrome-launcher).
    - **karma-coverage** - Code coverage generator. [Project repo.](https://github.com/karma-runner/karma-coverage)
    - **karma-coverage-istanbul-reporter** - Code coverage generator reporter. [NPM page.](https://www.npmjs.com/package/karma-coverage-istanbul-reporter)
    - **karma-sourcemap-loader** - A preprocessor that loads existing source maps. [NPM page.](https://www.npmjs.com/package/karma-sourcemap-loader)
    - **karma-browserify** - A browserify preprocessor for karma, used to bundle up the tests. [NPM page.](https://www.npmjs.com/package/karma-browserify)
    - **karma-viewport** - A karma framework used to gain access to the viewport in tests. [NPM page.](https://www.npmjs.com/package/karma-viewport)
3. **Protractor** - An open-source end-to-end test framework. For more information, check Protractor's [official site](http://www.protractortest.org/#/).

### Production Dependencies

1. **Express** - This project uses Express in order to run a basic server in deployment. This server is used to send the static files and script to the user. For more information, check the [Express website](https://expressjs.com).
2. **Compression** - A Node extension used to compress production files when sending them from the Express server to the client. For more information, check the [compression NPM page](https://www.npmjs.com/package/compression).
2. **dotenv** - A Node extension for accessing environment variables. Used by the frontend while in production mode. For more information, check the [dotenv NPM page](https://www.npmjs.com/package/dotenv).

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

## Testing

### Writing Tests

Tests are written in TypeScript and each component's tests are located in the same directory as the component. Test files' names follow this format: `<component_name>.spec.ts`. This format is the way tests are picked up by the main testing file, and so it's important to keep to it.

### Running Tests

Running tests is done through the dedicated Gulp task. All you need to do is run `gulp test` in the terminal; this will start Karma and trigger Webpack's compilation of tests and project files.

### End-to-End Tests

End to end tests are similarly written in TypeScript and named in the following format: `<component_name>.spec.ts`. They're all located in [e2e/src](./e2e/src).

Since this is a full-stack application, running end-to-end tests requires running the [backend](https://github.com/sendahug/send-hug-backend) prior to running the tests. Once the backend is up and running, run `gulp e2e` in another terminal tab. This will compile all files, run the frontend server and then run Protractor.

## Hosting

The project is hosted live on Heroku. You can view the live version [here](https://send-hug.herokuapp.com/). If you want to clone and host your own version, you can do so by using the following guide (the following commands are for Heroku, but they can be adjusted depending on your host):

  1. Create a Heroku account (skip this step if you already have an account).
  2. Install the Heroku command line interface.
  3. In your Terminal, enter `heroku login`. This triggers logging in via the CLI.
  4. Enter `heroku create <APP_NAME>` (with your own app name). If successful, Heroku returns the live version's URL (will be referred to as <LIVE_URL>) and the Git repo link (will be referred to as <GIT_URL>).
  5. Make sure you're in the top directory (FSND-capstone). In your terminal, enter `git remote add heroku-client <GIT_URL>`.
  6. Enter `git subtree push --prefix frontend heroku-client master`. This triggers the app build. If successful, you'll get a 'Verifying deploy... done.' message.
  7. Add the following environment variables (via CLI or via the Heroku website):
      - PRODUCTION - set to true
      - AUTH0_DOMAIN - set with your own Auth0 domain
      - AUTH0_CLIENT - set with your own client ID from Auth0
      - AUDIENCE - set with your own audience from Auth0
      - LOGIN_REDIRECT - set to your <LIVE_URL> (or wherever in the app you want the user to be redirected to) to ensure after login the user will be redirected to your app
      - LOGOUT_REDIRECT - set to your <LIVE_URL> (or wherever in the app you want the user to be redirected to) to ensure after login the user will be redirected to your app
      - BACKEND_URL - set with your own backend URL (necessary for making requests to the backend!)
  8. On your Auth0 application configuration, make sure to:
      - Add your new <LIVE_URL> to 'Allowed Callback URLs'
      - Add your new <LIVE_URL> to 'Allowed Logout URLs'
      - Add your new <LIVE_URL> to 'Allowed Web Origins'
      - Add your new <LIVE_URL> to 'Allowed Origins (CORS)'
  9. All done! Now you can visit your <GIT_URL> to see the live app.

## Known Issues

There are no current issues at the time.
