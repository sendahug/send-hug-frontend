# Angular Builder

A small class for running the Angular compiler in the project's build process.

## Usage

1. Import the builder from `src/builder.base.ts`.
2. Create a new builder object with whatever plugins you want.
3. Use the object to build (and re-build) the app as needed.

Note: If you made changes to the builder or the plugins (in `builderPlugins.ts`) and you expect to use the updated versions in tests, make sure to run `tsc` (in this folder) or `build:builder` in the top folder of the repo. Web-test-runner only accepts JavaScript files, so the TypeScript source files for the builder need to be transpiled.

## Base Builder

Location: [src/builder.base.ts](./src/builder.base.ts).

The Builder itself contains just the functionality for setting up the Ngtsc Compiler and Angular program, running the compiler's type checks and transpiling the TypeScript to JavaScript (which also compiles the app).

It contains miminimal functionality; the rest of the functionality comes from the plugin system.

### Plugins

#### Environments

The builder supports plugins running in one of the following environment:

1. Development - Plugins to run during the development stage (usually by the dev server).
2. Test - Plugins to run during tests.
3. Production - Plugins to run when building the app for production.

#### Hooks

Plugins have two hooks that can be used:

1. setup - Runs once, when the Angular Builder is being set up.
2. Read - Runs when the file is read by the TypeScript compiler. That's the way to update a file's code _before_ the transpilation process runs.
3. transform - Runs every time the `buildFile` method is called (and by extension, every time the TypeScript compiler and its `readFile` method are called).

## Provided Plugins

Location: [`builderPlugins.ts`](./src/builderPlugins.ts).

There are four plugins included with vite-angular:

1. `hmrPlugin` - A plugin for enabling HMR in the Angular components.
2. `instrumentFilesPlugin` - A plugin for instrumenting the code before running tests.
3. `addCompilerPlugin` - A plugin for adding an import of `@angular/compiler` to the `main.ts` file to enable speedy development.
4. `addPolyfillsPlugin` - A plugin for adding a dynamic import of the `polyfills.ts` file to the `mail.ts` file in the production build.
