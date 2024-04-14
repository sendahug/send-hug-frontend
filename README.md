# Send A Hug

[![CircleCI](https://circleci.com/gh/sendahug/send-hug-frontend.svg?style=shield)](https://circleci.com/gh/sendahug/send-hug-frontend)
![CI](https://github.com/sendahug/send-hug-frontend/workflows/Test%20CI/badge.svg)
[![codecov](https://codecov.io/gh/sendahug/send-hug-frontend/graph/badge.svg)](https://codecov.io/gh/sendahug/send-hug-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/sendahug/send-hug-frontend/badge.svg)](https://snyk.io/test/github/sendahug/send-hug-frontend)
[![Depfu](https://badges.depfu.com/badges/d559c2b81b6153cf48b9badbfe1633ae/overview.svg)](https://depfu.com/github/sendahug/send-hug-frontend?project_id=35503)
[![Depfu](https://badges.depfu.com/badges/d559c2b81b6153cf48b9badbfe1633ae/count.svg)](https://depfu.com/github/sendahug/send-hug-frontend?project_id=35503)

## Version

Version 1 (currently in development).

Built using the [gulp-site-template](https://github.com/shirblc/gulp-site-template) repo.

For full project information, check the [`main README file`](https://github.com/sendahug/sendahug/blob/master/README.md).

## Code Usage and Contribution

If you want to contribute to the project, you should start by reading the [contribution guidelines](https://github.com/sendahug/send-hug-frontend/blob/dev/CONTRIBUTING.md) and the [code of conduct](https://github.com/sendahug/send-hug-frontend/blob/dev/CODE_OF_CONDUCT.md).

The project is open source, so feel free to use parts of the code. However, the full project itself is **not** meant to be reused. The design, the concept and the project itself are personal and belong to the Send A Hug group.

## Installation and Usage

### Requirements

- Node.js LTS
- The back-end of the project (which you can clone [here](https://github.com/sendahug/send-hug-backend)).

### Developers

1. Download or clone the repo.
2. cd into the project directory.
3. cd into frontend.
4. Run `npm install` to install dependencies.
5. Run `gulp localdev` to compile the whole project for local development.
6. Run `gulp serve` to start the local server.
7. Open localhost:3000.

**For your convenience,** this project utilises Gulp's 'watch' functionality. In order to activate it while developing, run `gulp watch`. For more information about Gulp watch, check the [Gulp documentation](https://gulpjs.com/docs/en/getting-started/watching-files/).

### Users

**Not yet ready for users!**

## Contents

The app (located in [src/app](./src/app)) contains several modules:

- The root module (AppModule), defined in **app.module.ts**. Contains mainly the components that are available to all users, whether or not they're logged in.
- A routing module, defined in **app-routing.module.ts**. Contains the app's routing.
- An Admin module, defined in **admin/admin.module.ts**. Contains the components that handle admin actions.
- A Common module, defined in **common/common.module.ts**. Contains components and services which are used throughout the whole app.
- A User module, defined in **user/user.module.ts**. Contians the components that handle authenticated users' actions.

Each component folder contains both the HTML template and the component TypeScript file.

The components (both view-defining components and smaller components) are located in eac module's `components` folder (for example: [src/app/components](./src/app/components)). The interfaces, used to define the types of objects in the app, are located in [src/app/interfaces](./src/app/interfaces). The injectable services, which perform a various array of tasks, are located in each module's `services` folder (for example: [src/app/services](./src/app/services)).

## Dependencies

### Gulp

The site uses several tools to maximise compatibility:

1. **Gulp** - Gulp enables running tasks automatically. You can read more on the [Gulp website](https://gulpjs.com). Gulp is a Node.js tool, so it requires installing Node.
2. **Gulp-Postcss** with **Autoprefixer** Plugin - A Gulp plugin which adds the necessary browser prefixes to the CSS file. For more info check the [Gulp-postcss](https://www.npmjs.com/package/gulp-postcss) page and the [Autoprefixer](https://www.npmjs.com/package/autoprefixer) page on NPM.
3. **Rollup** (with @rollup/stream) - A module bundler for JS. Rollup bundles up the main module (AppModule) and converts it from TypeScript to ES6. For more info, check the [Rollup repo](https://github.com/rollup/rollup) and Gulp's [Rollup + Gulp recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/rollup-with-rollup-stream.md).
4. **Gulp-Rename** - A gulp plugin used to rename files. Used to rename the main module JS and to change the directory name of all HTML files. For more info check the [Gulp-rename](https://www.npmjs.com/package/gulp-rename) page on NPM.
5. **Gulp-replace** - A string replace plugin for Gulp. Used to change the templateUrls in the final JS file. For more info, check the [Gulp-replace](https://www.npmjs.com/package/gulp-replace) page on NPM.
6. **Gulp-less** - A gulp plugin for Less compilation. Used to compile the app's main styles, written in Less, to the CSS used in deployment. For more info, check the [gulp-less](https://www.npmjs.com/package/gulp-less) page on NPM.

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
   - **karma-rollup-preprocessor** - A rollup preprocessor for karma, used to bundle up the tests. [NPM page.](https://www.npmjs.com/package/karma-rollup-preprocessor)
   - **karma-viewport** - A karma framework used to gain access to the viewport in tests. [NPM page.](https://www.npmjs.com/package/karma-viewport)
3. **Cypress** - An open-source end-to-end test framework. For more information, check Cypress's [official site](https://www.cypress.io/).

### Production Dependencies

1. **Express** - This project uses Express in order to run a basic server in deployment. This server is used to send the static files and script to the user. For more information, check the [Express website](https://expressjs.com).
2. **Compression** - A Node extension used to compress production files when sending them from the Express server to the client. For more information, check the [compression NPM page](https://www.npmjs.com/package/compression).
3. **dotenv** - A Node extension for accessing environment variables. Used by the frontend while in production mode. For more information, check the [dotenv NPM page](https://www.npmjs.com/package/dotenv).

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

Running tests is done through the dedicated Gulp task. All you need to do is run `gulp test` or `npm run test` in the terminal; this will start Karma and trigger Webpack's compilation of tests and project files.

### End-to-End Tests

End to end tests are similarly written in TypeScript and named in the following format: `<component_name>.spec.ts`. They're all located in [e2e/src](./e2e/src).

Since this is a full-stack application, running end-to-end tests requires running the [backend](https://github.com/sendahug/send-hug-backend) prior to running the tests. Once the backend is up and running, run `gulp e2e` in another terminal tab. This will compile all files, run the frontend server and then run Cypress.

Note that you will need the username and password of an admin set to two environment variables in order to run some of the tests (`CYPRESS_ADMIN_USERNAME` and `CYPRESS_ADMIN_PASSWORD`).

## Hosting

The project was hosted live on Heroku (we're currently looking at alternatives, due to Heroku removing their free tier). If you want to clone and host your own version, you can do so by using the following guide (the following commands are for Heroku, but they can be adjusted depending on your host):

1. Create a Heroku account (skip this step if you already have an account).
2. Install the Heroku command line interface.
3. In your Terminal, enter `heroku login`. This triggers logging in via the CLI.
4. Enter `heroku create <APP_NAME>` (with your own app name). If successful, Heroku returns the live version's URL (will be referred to as <LIVE_URL>) and the Git repo link (will be referred to as <GIT_URL>).
5. In your terminal, enter `git remote add heroku-client <GIT_URL>`.
6. Update the live environment file with the correct variable values:
   - AUTH0_DOMAIN - set with your own Auth0 domain
   - AUTH0_CLIENT - set with your own client ID from Auth0
   - AUDIENCE - set with your own audience from Auth0
   - LOGIN_REDIRECT - set to your <LIVE_URL> (or wherever in the app you want the user to be redirected to) to ensure after login the user will be redirected to your app
   - LOGOUT_REDIRECT - set to your <LIVE_URL> (or wherever in the app you want the user to be redirected to) to ensure after login the user will be redirected to your app
   - BACKEND_URL - set with your own backend URL (necessary for making requests to the backend!)
7. Enter `git push heroku-client master`. This triggers the app build. If successful, you'll get a 'Verifying deploy... done.' message.
8. Add the following environment variables (via CLI or via the Heroku website):
   - PRODUCTION - set to true
9. On your Auth0 application configuration, make sure to:
   - Add your new <LIVE_URL> to 'Allowed Callback URLs'
   - Add your new <LIVE_URL> to 'Allowed Logout URLs'
   - Add your new <LIVE_URL> to 'Allowed Web Origins'
   - Add your new <LIVE_URL> to 'Allowed Origins (CORS)'
10. All done! Now you can visit your <GIT_URL> to see the live app.

## Known Issues

There are no current issues at the time.
