# Send A Hug

[![CircleCI](https://circleci.com/gh/sendahug/send-hug-frontend.svg?style=shield)](https://circleci.com/gh/sendahug/send-hug-frontend)
![CI](https://github.com/sendahug/send-hug-frontend/workflows/Test%20CI/badge.svg)
[![codecov](https://codecov.io/gh/sendahug/send-hug-frontend/graph/badge.svg)](https://codecov.io/gh/sendahug/send-hug-frontend)
[![Known Vulnerabilities](https://snyk.io/test/github/sendahug/send-hug-frontend/badge.svg)](https://snyk.io/test/github/sendahug/send-hug-frontend)
[![Depfu](https://badges.depfu.com/badges/d559c2b81b6153cf48b9badbfe1633ae/overview.svg)](https://depfu.com/github/sendahug/send-hug-frontend?project_id=35503)
[![Depfu](https://badges.depfu.com/badges/d559c2b81b6153cf48b9badbfe1633ae/count.svg)](https://depfu.com/github/sendahug/send-hug-frontend?project_id=35503)

## Version

Version 1 (currently in development).

Originally built using the [gulp-site-template](https://github.com/shirblc/gulp-site-template) repo. Rebuilt with Vite (mostly) using the [vite-angular template](https://github.com/shirblc/vite-angular).

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
3. Run `git config core.hooksPath .githooks` to install the pre-commit hook, which runs prettier.
4. Run `npm install` to install dependencies.
5. Set the following environment variables (either as environment variables or within the development .env file):
   - FIREBASE_API_KEY - the Firebase API key for your project.
   - FIREBASE_PROJECT_ID - your Firebase project ID.
   - FIREBASE_AUTH_DOMAIN - the Firebase auth domain for your project.
   - FIREBASE_STORAGE_BUCKET - the Firebase storage bucket for your project.
   - FIREBASE_MESSAGING_SENDER_ID - the Firebase messaging sender ID.
   - FIREBASE_APP_ID - your Firebase App ID.
   - FIREBASE_MEASUREMENT_ID - the Firebase measurement ID (for analytics).
6. Run `npm run dev` to compile the whole project for local development.
7. Open localhost:3000.

### Users

**Not yet ready for users!**

## Contents

The app (located in [src/app](./src/app)) contains two modules:

- An Admin module, defined in **admin/admin.module.ts**. Contains the components that handle admin actions.
- A User module, defined in **user/user.module.ts**. Contians the components that handle authenticated users' actions.

On top of these, the app contains various components and services. Any component that isn't part of the above modules is defined as a standalone component, and so can be used in any module.

Each component folder contains both the HTML template and the component TypeScript file.

The components (both view-defining components and smaller components) are located in eac module's `components` folder (for example: [src/app/components](./src/app/components)). The interfaces, used to define the types of objects in the app, are located in [src/app/interfaces](./src/app/interfaces). The injectable services, which perform a various array of tasks, are located in each module's `services` folder (for example: [src/app/services](./src/app/services)).

## Dependencies

### Development

The site uses several tools to maximise compatibility:

1. **Vite** - The main tool used to power up the development server and the build process. It runs the development server, handles HMR, runs development builds using ESBuild, and runs production builds using Rollup. For more information, check out the [Vite docs](https://vitejs.dev).
2. **LESS** - A CSS pre-processor. Used to compile the site's styles to CSS. For more information, check the [LESS docs](https://lesscss.org).
3. **Babel** - A JavaScript compiler. Used to run the Angular Linker when building for production. For more information, check the [Babel docs](https://babeljs.io).

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

For more information about Angular's required NPM packages, check the [Angular docs](https://angular.io/guide/npm-packages).

### Other

1. **IDB** (formerly IDBPromised) - An improved version of IndexedDB, which is Promise-based and includes various enhancements to improve the API's usability. For more information, check the [IDBP repo](https://github.com/jakearchibald/idb).
2. **Firebase** - Firebase's JS SDK, used for user authentication. For more information, check the [Firebase SDK's repo](https://github.com/firebase/firebase-js-sdk).
   - **@angular/fire** - For better Angular compatibility, we use @angular/fire.
3. **Font Awesome** - The icon provider that provides the site's icons. For more information, check the [Font Awesome docs](https://docs.fontawesome.com).

### Testing Dependencies

This project's tests are run using the Jasmine framework and web-test-runner. Thus, testing requires several packages:

1. **Jasmine** - An open-source behaviour-driven testing framework. For more information, check Jasmine's [official site](https://jasmine.github.io). Included packages:
   - **jasmine-core**
   - **@types/jasmine** - A typed version, required in order to write TypeScript tests.
2. **web-test-runner** - An open-source test-runner, used to run the tests on various devices with a test server. For more information, check web-test-runner's [official site](https://modern-web.dev/docs/test-runner/overview/). Included packages:
   - **@web/test-runner**
   - **@web/dev-server-esbuild** - An ESBuild plugin for the web-test-runner development server. Used to run the final compilation of test files.
   - **@web/dev-server-rollup** - A rollup plugin for the web-test-runner development server. Used mostly to convert Rollup plugins (in [plugins.mjs](https://github.com/sendahug/send-hug-frontend/blob/dev/plugins.mjs)) to web-test-runner plugins.
   - **@web/test-runner-playwright** - A playwright launcher (for running browser tests).
   - **@web/test-runner-commands** - A group of commands for controlling various aspects of the browser.
   - **rollup-plugin-tsconfig-paths** - A rollup plugin for converting paths defined in tsconfig to paths the esbuild plugin can parse.
3. **ng-mocks** - An Angular mocking environment, which enables stubbing components and services in tests. For more information, check [ng-mock's docs](https://ng-mocks.sudo.eu).
4. **Cypress** - An open-source end-to-end test framework. For more information, check Cypress's [official site](https://www.cypress.io/).
5. **pa11y** - An open-source tool for running accessibility tests. For more information, check [the docs](https://pa11y.org).
   - **axe-core** - The runner pa11y uses for accessibility tests in the project. See the [GitHub repo](https://github.com/dequelabs/axe-core) for more information.

## Authentication

The project uses Firebase as a third-party authentication provider. Authentication is done by Firebase, which in turn sets its internal `currentUser` property to the logged in user's data. This allows us to fetch a JWT for the given user for each of their requests.

While the frontend uses the JWT, it doesn't verify the given token. This is done by the backend. Upon login, a request is made to the server to fetch the user's data. Since getting user's data requires authentication, if the server's response contains the user's data, the frontend can treat the token as valid. Once the token is verified, the user is marked as 'authenticated'.

On top of fetching the user's data, the frontend also deals with login, logout and sign-up. These are done using [Firebase's JS SDK](https://github.com/firebase/firebase-js-sdk), Firebase's client-side library. All authentication handling in the frontend is done by the [AuthService](./src/app/services/auth.service.ts).

The frontend Authentication Process:

1. The user logs in via the login page. This passes the login details to the Auth Service, which passes them to Firebase to handle the actual login process.

2. Once a successful response is received from Firebase, the Auth Service uses Firebase's `getIdToken` method to get a JWT for the current user.

3. An attempt is made to fetch the user's data from the backend, where the token is verified. If successful, the fetched data is used as the user's data and the user is marked as authenticated.

4. Token refresh and handling is done by Firebase whenever it's needed. In order to always have the most recent valid token, the API client fetches the current ID token (using the `getIdToken` method) before making each request.

5. Upon logout, the frontend clears all user data.

Notes:

- If the user doesn't exist in the database (the request was rejected because of something other than an AuthError), that means it's a new user. The user is then redirected to the sign up page to complete registration. Using the details provided by the user there, the AuthService makes a request to the server to add the new user to the database.

## Testing

### Writing Tests

Tests are written in TypeScript and each component's tests are located in the same directory as the component. Test files' names follow this format: `<component_name>.spec.ts`. This format is the way tests are picked up by the main testing file, and so it's important to keep to it.

### Running Tests

Running tests is done through the dedicated npm script. All you need to do is run `npm run test` in the terminal; this will start web-test-runner.

**Note:** You might need to install Playwright first. If so, run `npx playwright install`.

### End-to-End Tests

End to end tests are similarly written in TypeScript and named in the following format: `<component_name>.spec.ts`. They're all located in [e2e/src](./e2e/src).

Since this is a full-stack application, running end-to-end tests requires running the [backend](https://github.com/sendahug/send-hug-backend) prior to running the tests. Once the backend is up and running, you'll need to run the front-end too. To do that, simply run `npm run dev`.

With the Vite development server up and running, you can now run tests. In order to do that, run `npm run cypress` in another terminal tab. This will run Cypress.

Note that you will need the username and password of an admin set to two environment variables in order to run some of the tests (`CYPRESS_ADMIN_USERNAME` and `CYPRESS_ADMIN_PASSWORD`).

## Known Issues

There are no current issues at the time.
