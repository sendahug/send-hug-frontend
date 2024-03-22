# Changelog

## Unreleased

#### Chores

- Added a changelog and instructions for writing changelog entries ([#1532](https://github.com/sendahug/send-hug-frontend/pull/1532)).

### 2024-03-16

#### Changes

- Replaced most classes that are set by the code with Angular's `ngClass` syntax. This allows us to write cleaner code and skip the manual update of elements' classes ([#1531](https://github.com/sendahug/send-hug-frontend/pull/1531)).

#### Chores

- Replaced `gulp-terser` with Rollup's terser plugin. This moves the last aspect of the script generation to Rollup, which essentially ensures the whole process is handled entirely by the bundler ([#1528](https://github.com/sendahug/send-hug-frontend/pull/1528)).

### 2024-03-12

#### Chores

- Moved the environment variables' substition from the `env-config` script to its own Rollup plugin. This also allows us to move from an environment-defined-variables-based structure to an environment-files-based structure ([#1527](https://github.com/sendahug/send-hug-frontend/pull/1527)).

### 2024-03-11

#### Changes

- Replaced Sass with LESS as the CSS pre-processor. Since the Sass team has made it clear they support hate-speech and terrorism, we've opted for removing Sass from the project and rebuilding the stylesheets with LESS ([#1525](https://github.com/sendahug/send-hug-frontend/pull/1525)).

### 2024-03-08

#### Documentation

- Updated the README's sections about the source code, about dependencies and about tests ([#1522](https://github.com/sendahug/send-hug-frontend/pull/1522)).

### 2024-03-05

#### Chores

- Added the GitHub Actions dependencies to dependabot to allow auto-updating Actions ([#1507](https://github.com/sendahug/send-hug-frontend/pull/1507)).
- Added a workflow for adding new issues and pull requests to the primary project ([#1509](https://github.com/sendahug/send-hug-frontend/pull/1509)).
- Added a workflow for auto-labelling pull requests ([#1519](https://github.com/sendahug/send-hug-frontend/pull/1519)).

### 2024-03-03

#### Changes

- Turned the alert element created by the alerts service into a static component. Previously, we were creating and adding the element to the DOM every time an alert was needed. Now, the element remains in the DOM and is only shown (with updated content) whenever it's needed. ([#1511](https://github.com/sendahug/send-hug-frontend/pull/1511))

### 2024-03-02

#### Changes

- Moved the offline alert toggle to the APIClient. Instead of running the check for whether the user is offline in every component that uses the API client, it's cleaner to have that check within the API client itself ([#1508](https://github.com/sendahug/send-hug-frontend/pull/1508)).
- Replaced all the hidden pagination buttons with disabled ones. This expands the change in [96f5282](https://github.com/sendahug/send-hug-frontend/commit/96f52827ddd8a722abd78e1dca3a0a66f0d56b7d) to all components that have lists that allow pagination. Previously there were no "next" or "previous" buttons if the user was in the last or first page (respectively). Now, the buttons are shown but disabled, which provides better UX. ([#1510](https://github.com/sendahug/send-hug-frontend/commit/15b14516277bd0647b8a90eff112eb9a4b8f005c))

### 2024-02-18

#### Chores

- Updated Angular to v17.2.1 ([039678b](https://github.com/sendahug/send-hug-frontend/commit/039678b669d7dd02eb8c281d186590449c0d5cce)).
- Updated dotenv, puppeteer and rollup dependencies ([636c786](https://github.com/sendahug/send-hug-frontend/commit/636c78651b476b28579527532e999dfc9ef73864)).

### 2024-02-17

#### Changes

- Moved block-related methods, which are used in both the reports and the blocks pages, back to the admin service ([6e0b35c](https://github.com/sendahug/send-hug-frontend/commit/6e0b35c504f40149bc5737a67e07a5fd82fca8d4)).

#### Chores

- Temporarily pinned Chrome in CI to allow tests to run while waiting for a fix for the CircleCI browser-tools orb ([276ac4d](https://github.com/sendahug/send-hug-frontend/commit/276ac4d9e142871bf6afa6abfb85a35f829c1130) & [95d759e](https://github.com/sendahug/send-hug-frontend/commit/95d759ea8e4876eeb669b64bd20c236554146c5c))

### 2024-02-16

#### Changes

- Replaced the Admin Blocks' form with an Angular reactive form ([1e8de13](https://github.com/sendahug/send-hug-frontend/commit/1e8de139a66ff0734f9a8c6e52b60a12e1e2d3a6)).
- Replaced the Admin Filters' form with an Angular reactive form ([b0b85cd](https://github.com/sendahug/send-hug-frontend/commit/b0b85cde47c4c4688c02202adda98708b030b8dd)).

#### Chores

- Bumped the version of Postgres in CI to v14 ([00f64b6](https://github.com/sendahug/send-hug-frontend/commit/00f64b65f539482245d7067ac34260e2efb3f456)).
- Updated the Admin Service's tests to include the newly added functions ([f860d64](https://github.com/sendahug/send-hug-frontend/commit/f860d645746b40d64ce0bbd42f0ca41520d48a6b)).

### 2023-11-09

#### Fixes

- The character `@` was accidentally used in the HTML templates instead of the unicode version of it (`&#64;`). All `@` occurrences were replaced with the unicode string to fix that ([207cd51](https://github.com/sendahug/send-hug-frontend/commit/207cd5126705f16464dafe1ea6b0784ffbe9d065)).

#### Chores

- Updated Angular to v17 ([679a595](https://github.com/sendahug/send-hug-frontend/commit/679a595c8f9b68d3fcbeeb97a36428debe7590d8)).
- Updated Angular's peer dependencies - the Font Awesome package, zone.js and typescript ([93dddb2](https://github.com/sendahug/send-hug-frontend/commit/93dddb2b6e1ff5677d85d22dfdd1bcf63b4f2913)).
- Updated the zone.js imports in the main TypeScript file and the main tests file to match the updated format in v0.14 ([00ace3f](https://github.com/sendahug/send-hug-frontend/commit/00ace3fad3f53bdd21f87a333cd3a046be354e3d)).

### 2023-10-28

#### Chores

- Updated zone.js to v0.14.0 ([c780547](https://github.com/sendahug/send-hug-frontend/commit/c780547ad0b4d432229d23a7b597a4a42d0ad2d3)).
- Reverted the zone.js update. Zone.js is a peer dependency of Angular, and v0.14 was only added in Angular v17 ([4a131d2](https://github.com/sendahug/send-hug-frontend/commit/4a131d240f7d4e322b3582a6fc7eb80b720e1507)).

### 2023-10-22

#### Chores

- Moved the template URL replacement from a step in the Gulp task bundling the code to a rollup plugin. ([7c1318a](https://github.com/sendahug/send-hug-frontend/commit/7c1318a063e122019922d1fb0567891a62ef3a91))

### 2023-10-21

#### Changes

- Split the Admin Dashboard's filters page to its own component ([6a14caf](https://github.com/sendahug/send-hug-frontend/commit/6a14caf97de1cbc31f57f630ab18c922e4f296d8)).
- Deleted the old fetch methods from the Admin Service. The new methods are written directly into the relevant components, so there's no need to have them in the service anymore ([56e809f](https://github.com/sendahug/send-hug-frontend/commit/56e809f445b8c57c1e9a1dabc1d5596880f203da)).
- Moved the filters' methods, which are only used in the filters' view, from the admin service to the filters page ([dfd9734](https://github.com/sendahug/send-hug-frontend/commit/dfd97343511804bbc57ac843396a5d8b0a3fca18)).
- Moved the `unblock` method, which was only used in the blocks' view, from the admin service to the blocks page ([c71a692](https://github.com/sendahug/send-hug-frontend/commit/c71a692f1abcc6587505662c65296a9f0bc31f7f)).
- Instead of searching for a report with the given ID in the reports' list, the `dismissReport` method now creates a partial report object with the given ID. We don't need to send an entire report back in order to dismiss/close it, so there's no need to force it to rely on a list of reports that no longer exists in the admin service ([088698f](https://github.com/sendahug/send-hug-frontend/commit/088698f5c45275ae326948fb0b26ac470446687c)).

#### Fixes

- Fixed the placement of the admin dashboard's page titles. In the splitting of the admin dashboard, the titles were moved into the newly created components, which caused them to be misaligned with the rest of the design. This was fixed by moving the titles back to the main admin dashboard ([796e0c8](https://github.com/sendahug/send-hug-frontend/commit/796e0c87753b8e588b0aed00ed6085219190f739)).

### 2023-10-20

#### Changes

- Split the Admin Dashboard's blocks page to its own component ([bdc1566](https://github.com/sendahug/send-hug-frontend/commit/bdc15661b0ce4d4031083d9b7c06acde06c40961)).

### 2023-10-19

#### Changes

- Split the Admin Dashboard's reports page to its own component ([35a9fb1](https://github.com/sendahug/send-hug-frontend/commit/35a9fb14ab67cb7d1b3becdd491edc0c74ebac7e)).

### 2023-10-18

#### Changes

- Deleted the old auth header property from the auth service. Now that the API client handles the auth header, there's no need to keep it in the auth service anymore ([4358de8](https://github.com/sendahug/send-hug-frontend/commit/4358de8c86961c785e09f40eb809fd22f54291c2)).

#### Chores

- Updated more tests to account for the updated structures of components ([cbf384f](https://github.com/sendahug/send-hug-frontend/commit/cbf384f900829f2562055dc979909018bfec0a48) - [42bc2bf](https://github.com/sendahug/send-hug-frontend/commit/42bc2bfc64f213faf2dbc20202abbaf65aab43ad)).

### 2023-10-17

#### Chores

- Fixed a critical-severity security alert in `@babel/traverse` ([000622e](https://github.com/sendahug/send-hug-frontend/commit/000622e870777d3c5a4ec085369d2e43067a000b)).

### 2023-10-16

#### Changes

- Replaced all the relative imports with absolute imports. The app, environment and tests directories have their own absolute path aliases defined in the tsconfig in order to do that ([eba37f1](https://github.com/sendahug/send-hug-frontend/commit/eba37f1711ec487d5bf2ec966cb541985f2b85c6) & [68cba7d](https://github.com/sendahug/send-hug-frontend/commit/68cba7df54f7606a84b4101a01b568fb398a6da1)).

#### Fixes

- Some interfaces had string fields accidentally typed as `String`, instead of `string`. This was fixed to show the correct version ([81f9675](https://github.com/sendahug/send-hug-frontend/commit/81f9675d7aaf722f8f20ec4a7939b3eb0640bac8)).
- Fixed a bug in settings where the icon edit form couldn't be opened ([bd02346](https://github.com/sendahug/send-hug-frontend/commit/bd0234616faa98d53ef124d50a37a3a3e5c9900b)).

#### Chores

- Moved the mock user data to a separate file, which allows us to import it into various tests, instead of repeatedly defining it in all of them ([c078471](https://github.com/sendahug/send-hug-frontend/commit/c078471f4ed3734dccb41301671e28c2325cd442)).
- Replaced the service mocks in more components' and services' tests ([1ab81f1](https://github.com/sendahug/send-hug-frontend/commit/1ab81f1edecfcf9e9d80774c822566030bc7d15d)).
- Updated various tests to account for the restructured components and removal of mock services ([bbb5d68](https://github.com/sendahug/send-hug-frontend/commit/bbb5d682ad8fc3dedb8fc523805d17b40bc09c58) - [1f19597](https://github.com/sendahug/send-hug-frontend/commit/1f195976ae3a0671fa60ba94d860665dc79ee8d3)).
- Deleted the mock services, which are no longer used ([7b47b6a](https://github.com/sendahug/send-hug-frontend/commit/7b47b6a89b8eaf5967ff385d25b2760358fd7f9e)).

### 2023-10-15

#### Chores

- Replaced the service mocks in tests with spies. There's no need to maintain two versions of the same service just for tests. It makes more sense to simply mock the service request ([90914ec](https://github.com/sendahug/send-hug-frontend/commit/90914ec521feb2abb1d52836650328bf2465a073)).
- Updated Item Delete Form and My Posts tests to account for the updated strctures of these component ([c78fd08](https://github.com/sendahug/send-hug-frontend/commit/c78fd086dab3959b38bdb5e7c25d99f194e03422) & [cf7257d](https://github.com/sendahug/send-hug-frontend/commit/cf7257d0ab430fe31d220bee1843243b163adaf4)).

### 2023-10-14

#### Changes

- Moved user-related calls and data to the User Page component ([9204ca7](https://github.com/sendahug/send-hug-frontend/commit/9204ca70cfe4a61f8d4afa59f02d62b2c761f2d6)).

#### Chores

- Updated Main Page, Header Message, Loader, Error Page and Full List tests to account for the updated strctures of these component ([b2890b1](https://github.com/sendahug/send-hug-frontend/commit/b2890b120db211892153efdaaeab06471b486988) - [ca4674f](https://github.com/sendahug/send-hug-frontend/commit/ca4674f646c2f0029047a5ea7b8782bb7a6ec85b)).

### 2023-10-12

#### Changes

- Unified the "delete items" methods into a single method ([2592ccf](https://github.com/sendahug/send-hug-frontend/commit/2592ccfd90c8875d0bddb1efcdd336702285bd34)).
- Unified the posts service and the items service. The posts-related methods were moved to their own service because both services got very big; now that most of the methods were moved away from these services, there's no need for two separate ones. ([d5ae07c](https://github.com/sendahug/send-hug-frontend/commit/d5ae07ccc5c95cab7454d8dbbc0392f89c39c1bb))
- Switched most API calls to use the new API service instead of manually running the Http Client ([d003a3e](https://github.com/sendahug/send-hug-frontend/commit/d003a3eddf8c7e09397d3b8c2c0082bdc1837166)).

### 2023-10-11

#### Changes

- Unified the "delete item" methods into a single delete method ([cb0078c](https://github.com/sendahug/send-hug-frontend/commit/cb0078c5366468539dea3a5c5e3373dbeafb5bfe)).

### 2023-10-07

#### Features

- Added a new type alias with the available stores in the IndexedDB database ([6f8d702](https://github.com/sendahug/send-hug-frontend/commit/6f8d702ef2a87fab50d4d050477004494f8f77c5)).

#### Changes

- United the various `addToIdb` methods to a single one, since they all do the same thing - they add an ISO date field and add to IndexedDB ([fed9fd9](https://github.com/sendahug/send-hug-frontend/commit/fed9fd9f0234e8975581f6cde2ce75376d05b297)).
- Moved the "delete item/s" methods to the Item Delete Form. They're not reused anywhere else, so this ensures all the functionality is kept where it's used ([e2ab9d2](https://github.com/sendahug/send-hug-frontend/commit/e2ab9d214eb86bf1afef16187768b9c5fc77129c)).

### 2023-10-06

#### Changes

- Unified the messages-fetching methods in the Items Service to one method. This also included adding new types and a new helper method for setting up user icons ([df010e7])(https://github.com/sendahug/send-hug-frontend/commit/df010e706749d78aa2790cb03411a2f9bbe56793).
- Moved the messages and threads from the items service to the app messaging component. Again, it's not reused anywhere else, so there's no need to have it in a shared service ([ab77a8e](https://github.com/sendahug/send-hug-frontend/commit/ab77a8e4101c92034ec795925ae469c0b1c1d62a)).

### 2023-10-05

#### Features

- Added an initial API Client service to handle all the networking logic ([7f9aa3e](https://github.com/sendahug/send-hug-frontend/commit/7f9aa3e0b5406471da59a3c5bf6a3674b1adec16)).

#### Changes

- Moved the main page's data from the Posts Service to the main page itself. Since the data's not reused anywhere else, there's no need to have it elsewhere ([03bade1](https://github.com/sendahug/send-hug-frontend/commit/03bade14bd7cd8fae7a744916816dde72dd1e889)).
- Moved the full list's data from the posts service to the full list itself. Since the data's not reused anywhere else, there's no need to have it elsewhere ([f059fdd](https://github.com/sendahug/send-hug-frontend/commit/f059fdd76f9faf9a0236b88a46c831b9b2aeffac)).
- Moved the hug sending functionality to the post component. Instead of the postsService running the data and DOM update (after the server has been updated), it makes more sense for each post component to update its own data and DOM. The post that received a hug is now broadcasted by the PostsService, and each post updates its own hug button accordingly. ([098a735](https://github.com/sendahug/send-hug-frontend/commit/098a735886c47293af8c917c6a4592525e9d341b))
- Moved the user post's data from the posts service to the user posts component. Since the data's not reused anywhere else, there's no need to have it elsewhere ([2c72808](https://github.com/sendahug/send-hug-frontend/commit/2c7280802f4af6e2257e4ca02893a10eb26e71be)).
- Refactored the `queryMessages` method in the Service Worker Manager to fetch the data based on parameters such as index and count. This is a change from the previous method, which required specifying a target and hardcoded the index, count and filters in the method. ([a4a4e8d](https://github.com/sendahug/send-hug-frontend/commit/a4a4e8d43edc4ae5d0f938eb67abc194aecd633b))

### 2023-10-04

#### Changes

- Deleted the old `queryPosts` method, which is no longer needed ([0784466](https://github.com/sendahug/send-hug-frontend/commit/07844669c9913290fff682af5210b15a47540f72)).

### 2023-10-03

#### Changes

- Refactored the `queryPosts` method in the Service Worker Manager to fetch the data based on parameters such as index and count. This is a change from the previous method, which required specifying a target and hardcoded the index, count and filters in the method. ([a310501](https://github.com/sendahug/send-hug-frontend/commit/a310501d66e43a2520d9bd77d9e5f6f39a7e1c93))
- Network fetches now wait for the IndexedDB fetches to complete before making the network requests. This means we no longer need to check which source the data is coming from and can always treat the later response as the most up-to-date one ([e2aadf5](https://github.com/sendahug/send-hug-frontend/commit/e2aadf5fc38c394c551554d850bc610e5949d168)).

#### Fixes

- Added a missing class to the stylesheet used by the app, which fixes those elements' styling ([34add85](https://github.com/sendahug/send-hug-frontend/commit/34add8593de5198b5f0bdcaa279736cc5e327cd9)).

#### Chores

- Deleted the no longer needed CSS directory. Now that the Sass is transformed directly to localdev/dist folders, there's no need to keep the old compiled CSS ([254ce7f](https://github.com/sendahug/send-hug-frontend/commit/254ce7f4db6f03b3e5b76d31755712dec4945a6a)).

### 2023-10-02

#### Changes

- Converted the Icon Colours definition to its own interface instead of redefining it in multiple interfaces ([dd4b862](https://github.com/sendahug/send-hug-frontend/commit/dd4b86286d8a193cae8fc68c274d5a12d48a9e2c)).
- Updated the Service Worker Manager's return values for fetching messages and threads to better reflect the types of items returned ([15965df](https://github.com/sendahug/send-hug-frontend/commit/15965df2163d01ad2be1604042eb9b9799c854af)).

### 2023-09-28

#### Changes

- Moved repeated type declarations to a new types file ([d699baf](https://github.com/sendahug/send-hug-frontend/commit/d699baf7879c7425bbb84ae085bdcd82633a175b)).
- The Icon Editor now uses a reactive form for its icon form, instead of manually updating the component's data based on the inputs' values ([c58e535](https://github.com/sendahug/send-hug-frontend/commit/c58e535e004cc2137e222d338e6ac00af69021ca)).

### 2023-09-27

#### Changes

- Previously, in order to ensure only one post's menu was open at once (when the viewport is too small to display the menus), the parent components dealt with keeping track of the open menu and closing the menus that shouldn't be open. This caused unnecessary duplication as the full list, main page and search results all had to set and unset the classes for the menus of all posts currently present in the DOM. Now, the post component deals with setting its own menus' classes, and the currently open menu is kept in the posts service ([f4db6d4](https://github.com/sendahug/send-hug-frontend/commit/f4db6d482af5e065d0bc7caaec9c38f8e49d7083)).
- Moved the loader's "is loading" subscription to the parent components. There's no need to check whether the data is fetched both in the loader and in the parent components; it's more efficient to have it only in the parent. ([d7ae5f5](https://github.com/sendahug/send-hug-frontend/commit/d7ae5f50a8980772f676b7b1ef6657b2de7c58d1))
- Moved the header message's visibility check to the parent components. There's no need to keep track of the loading status in two different components. Instead, it's better to handle showing/hiding the loader in the parent component and keep the header message focused on generating the correct message and displaying it. ([04a64d5](https://github.com/sendahug/send-hug-frontend/commit/04a64d57529edd1f4f3a847fbb2de8b567361ae8))

### 2023-09-26

#### Changes

- Unified the post-fetching methods in the Posts Service to one method. This also included moving various pieces of functionality to their own, separate functions ([7b7f7cc](https://github.com/sendahug/send-hug-frontend/commit/7b7f7cc3ef5e590f500d1a697cdc8a23fa0502ea)).
- Updated all HttpClient's calls to use the updated signature for `subscribe` (rather than the deprecated one we've been using). ([df02a54](https://github.com/sendahug/send-hug-frontend/commit/df02a54672147a2ce8ba5f51c4bca37e813a5bbf))

### 2023-09-21

#### Changes

- Replaced the hidden pagination buttons in the Admin Dashboard with disabled ones. Previously there were no "next" or "previous" buttons if the user was in the last or first page (respectively). Now, the buttons are shown but disabled, which provides better UX. ([96f5282](https://github.com/sendahug/send-hug-frontend/commit/96f52827ddd8a722abd78e1dca3a0a66f0d56b7d))

### 2023-09-20

#### Changes

- Replaced the report form with a reactive, Angular-managed form. There was no need for manually setting the value of the report reason in the component's TypeScript. It's a lot cleaner to let Angular handle the Code-Template sync. ([c95ef83](https://github.com/sendahug/send-hug-frontend/commit/c95ef83b2a9b18b1493fb5d0da29fc95aeb076d4) - [92e80cb](https://github.com/sendahug/send-hug-frontend/commit/92e80cb5e07d016f0e733d194184349e6a1c6236))

### 2023-09-19

#### Changes

- Replaced the search form with a reactive, Angular-managed form. Instead of setting the classes and validating the input manually, we now use Angular's reactive forms module to fetch the search query from the input element and to validate the input. ([426b6b4](https://github.com/sendahug/send-hug-frontend/commit/426b6b4619f4c495897724e3d49df402c020c4d7))

### 2023-09-18

#### Changes

- Simplified the way the navigation menu's class is set. Previously, the classes of the navigation menu and the button that opens it were set manually. Now, the classes are set dynamtically based on whether the menu should be shown and whether the button should be
  shown. ([8e7519c](https://github.com/sendahug/send-hug-frontend/commit/8e7519c052fde65f5d877f5c8b307481e28f1aaa))

#### Chores

- Added the Angular dependencies to Dependabot's config as a dependency group to ensure they're updated together at the same pull request ([184f409](https://github.com/sendahug/send-hug-frontend/commit/184f4096407bfe870a7908977f5c88cbabea619a)).

### 2023-09-17

#### Chores

- Updated Karma's initialisation to use the updated method for passing configuration to Karma, rather than the deprecated old method ([cdc6b20](https://github.com/sendahug/send-hug-frontend/commit/cdc6b207dbde7b020d11ca583652401d3b9efd13)).
- Fixed two bugs in tests caused by previous changes: one where a missing `"` broke tests, and one where a change to a spy broke tests that relied on it ([cb63d15](https://github.com/sendahug/send-hug-frontend/commit/cb63d1522b9c3ce67f0398b973fdc27659f0f8ac) & [b958c58](https://github.com/sendahug/send-hug-frontend/commit/b958c58872bb0b05b21106feea4b15e2267a7a70))

### 2023-09-16

#### Changes

- Instead of setting the navigation links' classes manually every time the user navigates, the classes are no calculated dynamically based on the currently active route ([da9fb8a](https://github.com/sendahug/send-hug-frontend/commit/da9fb8a1434f5b32e46ad3b7bd1a65e248626333)).

#### Chores

- Added prettier for code-formatting ([15a2d84](https://github.com/sendahug/send-hug-frontend/commit/15a2d84a7de2bf319c8d852a786c75a9c63a2325) & [ae43478](https://github.com/sendahug/send-hug-frontend/commit/ae43478f57d0915013ff80af77e7171bb1e2f562)).
- Fixed the typing in several test files ([49cb108](https://github.com/sendahug/send-hug-frontend/commit/49cb108e0c0a3838ef3e72825004dcfe74b99ef5)).

### 2023-09-09

#### Chores

- Updated the version of CircleCI's browser-tools orb ([43ba748](https://github.com/sendahug/send-hug-frontend/commit/43ba7486ab158d1808eb8156245497e1778680c1)).

### 2023-08-20

#### Chores

- Updated Angular from v15.2.9 to v16.2.1 ([41fac4e](https://github.com/sendahug/send-hug-frontend/commit/41fac4e74a06b72897f8a5846fc037fe7eae28f5)).
- Updated all development dependencies ([982deff](https://github.com/sendahug/send-hug-frontend/commit/982deffb07fb48a13cfb1b345912edd8728359a2)).

### 2023-07-28

#### Chores

- Updated the version of CircleCI's browser-tools orb, which should fix the test issue in CI - as shown in CircleCI-Public/browser-tools-orb#79 ([c2b70eb](https://github.com/sendahug/send-hug-frontend/commit/c2b70eb32b38826da368a850510d9f558a21928a)).

### 2023-06-04

#### Chores

- Updated Angular to v15.2.9 ([c5fb1ce](https://github.com/sendahug/send-hug-frontend/commit/c5fb1cec0d08ccb7c862c64d2076c5c960be856b)).

### 2023-05-14

#### Chores

- Changed the precision in the AdminDashboard's time-based tests, which should fix failures due to the time passing between the test's start and the call to the function being tested ([baec31d](https://github.com/sendahug/send-hug-frontend/commit/baec31d5bcddf2540cd5de402a6a606c8524de67)).

### 2023-05-08

#### Chores

- Fixed the types configuration in unit tests. Up until now, VSCode used Cypress/Chai types in unit tests (due to misconfigured 'types'). Now, unit tests correctly use Jasmine types and the tsconfig for e2e is separated from the tsconfig for unit tests ([2d44036](https://github.com/sendahug/send-hug-frontend/commit/2d44036ff048ff0217ec73127031bfe8c35bcb8f)).
- Changed AdminDashboard's time-based tests to check for closeness to a specific time, rather than compare the string versions. Since it takes a while between the check and the actual call,those tests that relied on specific timing occasionally failed. This was replaced by a "close to" check (which should account for that time). ([41aaa98](https://github.com/sendahug/send-hug-frontend/commit/41aaa9848b24f64822eac738de5d1928be19242c) & [57fea28](https://github.com/sendahug/send-hug-frontend/commit/57fea286c68263b06d486ed5b0070f3df0b2aa53)).

### 2023-05-07

#### Changes

- Deleted an unneeded service injection in the Search Results component ([4894e18](https://github.com/sendahug/send-hug-frontend/commit/4894e187608ad3ae53c8a8a1c4060c4d01093ab2)).

#### Chores

- Updated the versions of actions used in the current GitHub Actions workflows ([0532839](https://github.com/sendahug/send-hug-frontend/commit/0532839a0938df4b8bb63c253d0e02d822626fea)).

### 2023-05-01

#### Chores

- Updated Angular to v15.2.8 ([f17cc1a](https://github.com/sendahug/send-hug-frontend/commit/f17cc1a4f42b5917903f44db750cd3d973fc0bb0)).

### 2023-04-16

#### Chores

- Updated Angular to v15.2.7 ([4f4a72a](https://github.com/sendahug/send-hug-frontend/commit/4f4a72ae01517f0885dc99fedeaf5e8d175c223a)).

### 2023-04-10

#### Chores

- Updated Angular to v15.2.6 ([4fbb802](https://github.com/sendahug/send-hug-frontend/commit/4fbb80231d13c51dd4ce509daeb04e4c0e37c376)).

### 2023-04-02

#### Chores

- Updated Angular to v15.2.5 ([0bb1655](https://github.com/sendahug/send-hug-frontend/commit/0bb16554e67aa3706687049560a02e2ffbb1af24)).

### 2023-03-15

#### Chores

- Updated Angular to v15.2.4 ([7d0e9b7](https://github.com/sendahug/send-hug-frontend/commit/7d0e9b70c483d7a0b9c06e025cb223a19025c4cd)).

### 2023-03-18

#### Chores

- Updated Angular to v15.2.3 ([5afc44f](https://github.com/sendahug/send-hug-frontend/commit/5afc44f388d7f3de7b4965fc8f79166aadd9909f)).

### 2023-03-12

#### Chores

- Updated Angular to v15.2.2 ([4423a0e](https://github.com/sendahug/send-hug-frontend/commit/4423a0ea5f8c5a76966a2023f1c683c5387e3284)).

### 2023-03-05

#### Changes

- Updated all hug-sending methods to call the newly created endpoints for sending hugs, added in sendahug/send-hug-backend#363 ([bc5b31e](https://github.com/sendahug/send-hug-frontend/commit/bc5b31ec560b9878ac73521b82e2d9b40c8e9648)).

### 2023-03-04

#### Changes

- Added a check to the `getMailboxMessages` method to ensure the mailbox type is only inbox or outbox, rather than any string, which could create a vulnerability ([497875f](https://github.com/sendahug/send-hug-frontend/commit/497875f3987ebcb46449f8c74bc7474b2d90107a)).

#### Chores

- Installed sass and gulp-sass to transform Sass files. Previously, we relied on Dreamweaver's auto-conversion to transform Sass files into CSS files. This means styling can now be updated in any IDE. ([396f418](https://github.com/sendahug/send-hug-frontend/commit/396f418b9da02d242ff7734d4bbf51d881794d45))
- Updated Angular to v15.2.1 ([6375c49](https://github.com/sendahug/send-hug-frontend/commit/6375c49b6fba1bda1636d4777920c2ed8a05d5c9)).

### 2023-02-25

#### Chores

- Updated Angular to v15.2.0 ([3a4a0fb](https://github.com/sendahug/send-hug-frontend/commit/3a4a0fbaee8f226076a970730d1c8cafbfe51bdf)).

### 2023-02-18

#### Chores

- Updated Angular to v15.1.5 ([0b2bdd2](https://github.com/sendahug/send-hug-frontend/commit/0b2bdd2a2cecc399edfc0f7e3d1ed5dff6ac7732)).

### 2023-02-12

#### Chores

- Updated Angular to v15.1.4 ([3b23746](https://github.com/sendahug/send-hug-frontend/commit/3b23746c82b0f7a6390bb33782d2911dd96112a8)).

### 2023-02-05

#### Chores

- Re-enabled Chrome web security in e2e tests and updated the login process to use Cypress's new `cy.origin` workflow instead ([a7dc681](https://github.com/sendahug/send-hug-frontend/commit/a7dc6816198ca7e56588448baabaa4512f9ad708)).
- Updated Rollup's sourcemaps configuration to match the new options in v3 and switched production's sourcemaps to be hidden to prevent a clash with the tsconfig settings ([c923317](https://github.com/sendahug/send-hug-frontend/commit/c9233178d4b332fa60b342180e873c1531ea4b41) & [3f748a5](https://github.com/sendahug/send-hug-frontend/commit/3f748a5d415dc95980afba15946905334a20eccd)).

### 2023-02-04

#### Chores

- Updated Angular to v15.1.3 ([9debce5](https://github.com/sendahug/send-hug-frontend/commit/9debce5bd1046778bad3e9fb117011f8926a84cc)).

### 2023-01-29

#### Chores

- Updated Angular to v15.1.2 ([62bb5ea](https://github.com/sendahug/send-hug-frontend/commit/62bb5eac897782ef464248ce822f71950a7ffcf1)).
- Updated the database's name in e2e tests (in CI) to match the rename in the back-end ([5220ebd](https://github.com/sendahug/send-hug-frontend/commit/5220ebd7514d87c1a9a0ddc78ac9d529fcaa5c5f)).

### 2023-01-22

#### Chores

- Updated Angular to v15.1.1 ([8dd872c](https://github.com/sendahug/send-hug-frontend/commit/8dd872cdbe00d976df021b7046e95659aa7febb6)).

### 2023-01-15

#### Chores

- Updated Angular to v15.1.0 ([0d5966a](https://github.com/sendahug/send-hug-frontend/commit/0d5966a905c36a2d2688334ce604288e409158e3)).

### 2023-01-08

#### Chores

- Updated the location of the back-end's tests in CI to match the updated structure in the back-end's repo ([9fd5e35](https://github.com/sendahug/send-hug-frontend/commit/9fd5e352dfcbd0f63aadb4618011a8033ccd654d)).

### 2022-12-18

#### Chores

- Updated Angular to v15.0.4 ([0dc960d](https://github.com/sendahug/send-hug-frontend/commit/0dc960dfa0cd6f9853b81502002bf5ff55f79231)).
- Updated non-major dev dependencies ([32467d2](https://github.com/sendahug/send-hug-frontend/commit/32467d288bb85cd90ad9cd06591d3b5e74a649bb)).

### 2022-12-11

#### Chores

- Updated Angular to v15.0.3 ([d1ea4e9](https://github.com/sendahug/send-hug-frontend/commit/d1ea4e91c7aa26d5766deee7b8816a402774d089)).

### 2022-12-04

#### Fixes

- Fixed a bug where fetching the logged in user's data caused an error if the user didn't pick colours for their icon ([1bae979](https://github.com/sendahug/send-hug-frontend/commit/1bae979c1d1fa4c07fffc702e6dd140d1d728ed7)).

#### Chores

- Updated Angular to v15.0.2 ([c58bb1c](https://github.com/sendahug/send-hug-frontend/commit/c58bb1ced84a4dbfa11a0cf03ad33a6ba5f832e3)).

### 2022-11-27

#### Chores

- Updated the copyright notices throughout the repo to include the current year ([aad8227](https://github.com/sendahug/send-hug-frontend/commit/aad82273f1981618af8ca0f10c7a7bab4aca430b)).

### 2022-11-13

#### Chores

- Updated Angular to v14.2.10 ([3de9bd6](https://github.com/sendahug/send-hug-frontend/commit/3de9bd6d0ebd70d5d6ef4025c6a177f0eea54750)).

### 2022-11-08

#### Chores

- Updated Angular to v14.2.9 ([e070095](https://github.com/sendahug/send-hug-frontend/commit/e07009505ccfae8ceccc4fc8ed61650d5b760f9f)).

### 2022-10-30

#### Chores

- Updated Angular to v14.2.8 ([eba8cac](https://github.com/sendahug/send-hug-frontend/commit/eba8cac8beb6b824a6c609e90dd4b4df6dfe4280)).

### 2022-10-23

#### Chores

- Updated Angular to v14.2.7 ([6702fb1](https://github.com/sendahug/send-hug-frontend/commit/6702fb1cbb12d6d0ef945174424fa66e7bc086e4)).
- Removed the distribution folder's content from the repo. Now that the `dist` task runs as part of the deployment build, there's no need to have those files in the repo anymore ([5e7f983](https://github.com/sendahug/send-hug-frontend/commit/5e7f9832645355bab464900c170b5dbd3017625d)).

### 2022-10-16

#### Chores

- Updated Angular to v14.2.6 and added a missing dependency - rollup ([eb9dc32](https://github.com/sendahug/send-hug-frontend/commit/eb9dc32f0392837afc9f98f93434feced56cc907)).

### 2022-10-09

#### Chores

- Updated Angular to v14.2.5 ([b9aa692](https://github.com/sendahug/send-hug-frontend/commit/b9aa692e664b2a264543d03e9463f7aaf2a6120d)).

### 2022-10-03

#### Chores

- Updated Angular to v14.2.4 ([9d619fa](https://github.com/sendahug/send-hug-frontend/commit/9d619fa0411423e60829ea433777fa6edbe65a2d)).

### 2022-09-25

#### Chores

- Deleted the no-longer-used Babel dependencies ([c99f970](https://github.com/sendahug/send-hug-frontend/commit/c99f9703674b9a72416d9f9a7cd68b9a14aa2695)).
- Updated Angular to v14.2.3 ([2348b7a](https://github.com/sendahug/send-hug-frontend/commit/2348b7a04b23cfbed541efa937c2efbedca3379f)).

### 2022-09-24

#### Chores

- Replaced the manual coverage results upload in CI with codecov's CircleCI orb ([caabc79](https://github.com/sendahug/send-hug-frontend/commit/caabc79c065f3e0f4f4102d6fec0db90a9454b41)).

### 2022-09-18

#### Chores

- Updated Angular to v14.2.2 ([a3eeae3](https://github.com/sendahug/send-hug-frontend/commit/a3eeae35c0dd190912bdd46787dce42306dfa684)).

### 2022-09-12

#### Chores

- Updated the version of the docker image used in CI ([a94e6b9](https://github.com/sendahug/send-hug-frontend/commit/a94e6b95d78864682d76e0b88dfd9c9e9997d513)).
- Replaced deprecated convenience CircleCI images used in CI with the updated convenience images ([5e5f922](https://github.com/sendahug/send-hug-frontend/commit/5e5f922aab2f48b57d0932398afefb57d9889fe9)).

### 2022-09-11

#### Chores

- Updated Angular to v14.2.1 ([528ca5a](https://github.com/sendahug/send-hug-frontend/commit/528ca5a280e8923f5b870029fa7816fb3ffe4a20)).

### 2022-08-27

#### Chores

- Updated Angular to v14.2.0 ([8f1b3d6](https://github.com/sendahug/send-hug-frontend/commit/8f1b3d63f588fbb9083276d2389d2c744e1e4ca8)).

### 2022-08-21

#### Chores

- Updated Angular to v14.1.3 ([af4b1fe](https://github.com/sendahug/send-hug-frontend/commit/af4b1fe3ce3ca7f0ecbc80ed18829f766136e885)).

### 2022-08-13

#### Chores

- Updated Angular to v14.1.2 ([9f27627](https://github.com/sendahug/send-hug-frontend/commit/9f27627c90ba71a0d3327b5de62aa668328bdab1)).

### 2022-08-07

#### Chores

- Updated Angular to v14.1.1 ([d3f7aee](https://github.com/sendahug/send-hug-frontend/commit/d3f7aeeeab10e66e90ad0d595b20c444fb172150)).

### 2022-07-24

#### Chores

- Updated Angular to v14.1.0 ([381dfa2](https://github.com/sendahug/send-hug-frontend/commit/381dfa2297ed87025cee0071f42cf414030caab5)).

### 2022-07-17

#### Chores

- Updated Angular to v14.0.6 ([37cbce8](https://github.com/sendahug/send-hug-frontend/commit/37cbce8a64b42f530e3d7e60714287ec8f00ace0)).

### 2022-07-10

#### Chores

- Updated Angular to v14.0.5 ([06f407d](https://github.com/sendahug/send-hug-frontend/commit/06f407d544a9016aa508a623e922a7822d14367c)).

### 2022-07-03

#### Chores

- Updated Angular to v14.0.4 ([f633610](https://github.com/sendahug/send-hug-frontend/commit/f633610089259224286523a484ec099a6706f6f9)).

### 2022-06-26

#### Chores

- Updated Angular to v14.0.3 ([d4b8291](https://github.com/sendahug/send-hug-frontend/commit/d4b8291fb1753bee75693af326193d213bbc577f)).

### 2022-06-19

#### Chores

- Added the development compilation script to the package.json scripts ([78106b3](https://github.com/sendahug/send-hug-frontend/commit/78106b330fee3000fc369360d39235aff0a1982a)).
- Upgraded Cypress to v10 ([16f5e6a](https://github.com/sendahug/send-hug-frontend/commit/16f5e6a6e4fc81b04622a6367464f413f4c6db54)).
- Added a funding.yml file to enable sponsoring the team ([cf555de](https://github.com/sendahug/send-hug-frontend/commit/cf555decb443428424d44f25b89d20b3d872e719)).

### 2022-06-18

#### Chores

- Updated Angular to v14.0.2 ([aecd726](https://github.com/sendahug/send-hug-frontend/commit/aecd726b730e7a9120fd524bb77601a74f731301)).

### 2022-06-12

#### Chores

- Updated the environment variables' replacer function to look for the correct output. The replacer was still looking for the browserify output, but the switch to rollup caused a slightly different output to be passed in. The expected output was changed to match the rollup output ([74db0c2](https://github.com/sendahug/send-hug-frontend/commit/74db0c241fd1915267df1628c6647b40c071db3d)).
- Instead of requiring the app to be built ahead of deployment, the env-config script (which runs the environment variables' replacer) now runs the distribution tasks before making the replacement and deploying the updated files ([6e83edb](https://github.com/sendahug/send-hug-frontend/commit/6e83edb3dd88242c56670f48990babf6c5a9888d) & [f41c887](https://github.com/sendahug/send-hug-frontend/commit/f41c887b7584cad2b76bec46c31e818783900ba4)).

### 2022-05-29

#### Chores

- Updated Angular to v13.3.10 ([4403fc8](https://github.com/sendahug/send-hug-frontend/commit/4403fc818d3c68ff590a51344b5d8c7d6e1cdb87)).

#### Documentation

- Replaced the Libraries.io badge in the README with more detailed and accurate Depfu badges ([3ff4b1a](https://github.com/sendahug/send-hug-frontend/commit/3ff4b1a75b43022ab7d081b7b156acbbe3da4e8a)).

### 2022-05-22

#### Chores

- Updated Angular to v13.3.9 ([f408978](https://github.com/sendahug/send-hug-frontend/commit/f4089785c41299d9514c2a43bd34a8602f4c09b3)).

### 2022-05-14

#### Chores

- Updated Angular to v13.3.8 ([17aa300](https://github.com/sendahug/send-hug-frontend/commit/17aa300f67ea6a8c0c6e4d7c7423b5405a405139)).

### 2022-05-08

#### Chores

- Updated Angular to v13.3.6 ([9ba7b48](https://github.com/sendahug/send-hug-frontend/commit/9ba7b4855554a4d6b381ddd84a0353b4207c73bf)).

### 2022-05-01

#### Chores

- Updated Angular to v13.3.5 ([1f77ab5](https://github.com/sendahug/send-hug-frontend/commit/1f77ab5b12a9c890cfe9e3c5b2c142f2ecd671c5)).

### 2022-04-24

#### Chores

- Updated Angular to v13.3.4 ([40d6f1f](https://github.com/sendahug/send-hug-frontend/commit/40d6f1fcd8d6b7ff78d757e3c15f372f7417984b)).

### 2022-04-18

#### Features

- Added a new service to handle form validation across the whole app ([234590c](https://github.com/sendahug/send-hug-frontend/commit/234590cef49ab5d0ed3624492167100418180c29) - [bec654d](https://github.com/sendahug/send-hug-frontend/commit/bec654d19394eb837237c2f5d31b57da404d30fc)).

### 2022-04-17

#### Fixes

- Added missing aria-invalid attribute to the report form ([db8c991](https://github.com/sendahug/send-hug-frontend/commit/db8c9917c5bb7369bf7963e897b55bda5788421a) & [4d7a3b6](https://github.com/sendahug/send-hug-frontend/commit/4d7a3b63509696982d6eb96ec6b941e0a4e9b901))

#### Chores

- Added tests for the new forms ([f236036](https://github.com/sendahug/send-hug-frontend/commit/f236036aa1b2238ff73a2af92e310bac04ac71a5) - [d73d7f8](https://github.com/sendahug/send-hug-frontend/commit/d73d7f892a1d891ad271b62dc032bff139bc551f)).
- Updated Angular from v13.3.0 to v13.3.3 ([a5905df](https://github.com/sendahug/send-hug-frontend/commit/a5905df4af3fedd444b04ddc143098f4763225a4)).

### 2022-04-16

#### Features

- Added a new Post Edit Form component ([27af905](https://github.com/sendahug/send-hug-frontend/commit/27af905d6f0e65973dff456211703cca1aa90f14)).
- Added a new Display Name Edit Form component ([54da9a8](https://github.com/sendahug/send-hug-frontend/commit/54da9a803f04ea1c843d7fb519510f028898bbfc)).
- Added a new Report Form component ([0c2f9c7](https://github.com/sendahug/send-hug-frontend/commit/0c2f9c7575f5aafeef7e3f358368ccf7fd4aca6f)).
- Added a new Delete Item Form component ([6160470](https://github.com/sendahug/send-hug-frontend/commit/616047083971156c3a7e68d3b3dce4a5f9c902b6)).

#### Changes

- Moved the edit form's functionality from the popup to the new edit form component ([18388c8](https://github.com/sendahug/send-hug-frontend/commit/18388c84a37deca2d77a030daa9bdde589f342a1)).
- United the two post edit forms. The admin and non-admin edit forms were mostly identical, so it's far cleaner to unite the identical parts and leave the unique parts separate ([39c39e3](https://github.com/sendahug/send-hug-frontend/commit/39c39e33726405087d4c7a83bb60a871d9f40fea)).
- Moved the display name edit functionality from the popup to the new component ([db45bf1](https://github.com/sendahug/send-hug-frontend/commit/db45bf1c746af4dc4e839fc36e4a953e2c6dc844)).
- United the two display name edit forms and re-organised the form's methods to better reflect their functionality ([8ce5c38](https://github.com/sendahug/send-hug-frontend/commit/8ce5c387680d323fc0616563241856511010e461)).
- Moved the report functionality from the popup to the new component ([0c2f9c7](https://github.com/sendahug/send-hug-frontend/commit/0c2f9c7575f5aafeef7e3f358368ccf7fd4aca6f)).
- United the similar parts of the two report forms and re-organised the form's methods to better reflect their functionality ([ffda05d](https://github.com/sendahug/send-hug-frontend/commit/ffda05d942eef35a90c408c45d53f6fe1d236563)).
- Unified the delete forms in the Delete Item Form ([](https://github.com/sendahug/send-hug-frontend/commit/156e0f7e1563863ff0fac8e4824fa76e90835b8c)).
- Previously, if the user didn't select a report reason, the 'submit' button was still enabled. Now, the submit button is disabled until a reason is selected ([177efbf](https://github.com/sendahug/send-hug-frontend/commit/177efbf2e2fbd3613bcc4917a7110318056fa172)).

### 2022-03-20

#### Chores

- Updated Angular to v13.3.0 ([bd426b7](https://github.com/sendahug/send-hug-frontend/commit/bd426b7dcd5b69f7dc0c1e1a7b030933fbdc5c9e)).

### 2022-03-13

#### Chores

- Updated Angular to v13.2.6 ([9ec94c6](https://github.com/sendahug/send-hug-frontend/commit/9ec94c6274ff13e131c3862c85f1b1353dfece91)).

### 2022-03-06

#### Chores

- Code simplified: Updated the template-url-replacer plugin to use Magic-String's new `replace` method instead of manually finding and replacing the things in the templates ([657f533](https://github.com/sendahug/send-hug-frontend/commit/657f5337224fad15ded2172777845f3d41423a5b)).
- Updated Angular from v13.0.0 to v13.2.5 ([7c175a9](https://github.com/sendahug/send-hug-frontend/commit/7c175a9bb9bbbfbf2338337f327ee93b18114bfa)).

### 2022-02-28

#### Chores

- Updated the branch names in GitHub Actions workflow from 'Dev' to 'dev' to reflect the change in the branch's name ([fdb31a9](https://github.com/sendahug/send-hug-frontend/commit/fdb31a9ff2224b4ef4a5b6b1b51a291dd7befd0c)).
- Changed the build-app GitHub Actions workflow to create a pull request instead of pushing the build to the main branch ([a610f08](https://github.com/sendahug/send-hug-frontend/commit/a610f086d7cadc75a113af853bb65b6a1154fc55)).

### 2022-02-27

#### Chores

- Replaced browserify with rollup as the app's bundler. This simplified the migration to Angular v13 and allowed us to use a better-supported bundler. This includes:
  - Replaced browserify with rollup in development and in production tasks ([b765ea7](https://github.com/sendahug/send-hug-frontend/commit/b765ea754e5a3851ab6b6a0c42ad0ea5ee8eea53) & [4228ed4](https://github.com/sendahug/send-hug-frontend/commit/4228ed4deac6e98fb58120c9a96b18060e25b823)).
  - Turned the browserify transform into a rollup plugin ([1008614](https://github.com/sendahug/send-hug-frontend/commit/1008614b1a9ce9c4ca1db33b071bdde40aad3985)).
  - Replaced browserify with rollup in the Karma config ([e501e4f](https://github.com/sendahug/send-hug-frontend/commit/e501e4fb050b397884e1c90b02847ed3baeb8b76)).
  - Removed the old packages and the gulp tasks written for browserify ([c52bbfb](https://github.com/sendahug/send-hug-frontend/commit/c52bbfb0b695fed81e72f0224d7246887ef56160)).
  - Moved the SVG Inliner to its own rollup plugin ([896e20](https://github.com/sendahug/send-hug-frontend/commit/896e20e3e6b7a20dadfaa7adf62146ddbd87a837)).
  - Added a rollup plugin for setting the environment to production in the distribution task ([e860e52](https://github.com/sendahug/send-hug-frontend/commit/e860e52365baa13cd796a698407d5c3de970143e)).
- Updated Angular to v13 ([f883f49](https://github.com/sendahug/send-hug-frontend/commit/f883f49df5b5572d9f5020c8111ea4375a2bbe1b)).
- Replaced the deprecated Protractor with Cypress for e2e tests. This includes:
  - Replaced Protractor-related gulp tasks with Cypress-related gulp tasks ([0678f23](https://github.com/sendahug/send-hug-frontend/commit/0678f23d8265c9919a24445f1f6c74c13eb763a9)).
  - Updated the main specs file to the Cypress syntax ([2f865a4](https://github.com/sendahug/send-hug-frontend/commit/2f865a4e8fec9cda8d463bdf96a4e63e4ac276f9)).
  - Updated the router specs file to the Cypress syntax ([1432db1](https://github.com/sendahug/send-hug-frontend/commit/1432db112ff49191c8e8b3309fd33742b51078b1)).
  - Updated the CI config for Cypress ([a143746](https://github.com/sendahug/send-hug-frontend/commit/a143746b17ae643ab23d8ed646f76522aff98eed)).
  - Changed the CI config to run each of the e2e gulp tasks separately in order to run Cypress directly ([43b7e9a](https://github.com/sendahug/send-hug-frontend/commit/43b7e9a9a23f32e0f382270d3ee5f1b37cbd9848)).
- Updated the docker image used in CI ([0526b58](https://github.com/sendahug/send-hug-frontend/commit/0526b580d4a415bb5712d41aa0e6d383206fbeba)).

#### Documentation

- Replaced browserify and its plugins in the main README with rollup and its plugins ([e538e93](https://github.com/sendahug/send-hug-frontend/commit/e538e9314492847d0ca3ce3606ad07cf8fc258d7)).

### 2022-02-20

#### Chores

- Updated Angular to v12.2.16 ([fb6d233](https://github.com/sendahug/send-hug-frontend/commit/fb6d2332c697cbd7de5445c5d230a4543a2e7d92)).

### 2022-02-19

#### Documentation

- Deleted the david-dm badges from the main README, as the site hasn't been responsive in a long time ([004b3e2](https://github.com/sendahug/send-hug-frontend/commit/004b3e21fdfa4f70e2929dfc5eb7254a2bc3d129)).

### 2022-01-24

#### Chores

- Regenerated the package-lock file to bump dependencies' dependencies and fix security vulnerabilities ([56dd113](https://github.com/sendahug/send-hug-frontend/commit/56dd113aac0c46b3715266004c82a9e1a1e06d4f)).
- Deleted an unneeded test dependency. Since jasmine-core is a dependency of karma-jasmine, there was no need to separately include jasmine-core as dependency in the repo. ([05770dd](https://github.com/sendahug/send-hug-frontend/commit/05770dd0c48767b9a840d2d39ada8535d623f5a5))

### 2021-12-18

#### Chores

- Updated Angular to v12.2.15 ([4d8a752](https://github.com/sendahug/send-hug-frontend/commit/4d8a7522d819f486131c7d137a622d99b1ae00a0)).

### 2021-10-31

#### Chores

- Updated Angular to v12.2.12 ([ad16ccb](https://github.com/sendahug/send-hug-frontend/commit/ad16ccb0d5d3e2b5ee40a05320251f187d4bf8d0)).

### 2021-09-21

#### Chores

- Updated Angular to v12.2.6 ([1310d81](https://github.com/sendahug/send-hug-frontend/commit/1310d813ea8db01c07297fd7307fac97230d154b)).

### 2021-09-07

#### Chores

- Updated Angular to v12.2.4 ([315d0d6](https://github.com/sendahug/send-hug-frontend/commit/315d0d66559e8eb146d2174cb63f29c856ae1c67)).

### 2021-08-29

#### Chores

- Updated Angular to v12.2.3 ([89de0a1](https://github.com/sendahug/send-hug-frontend/commit/89de0a1d6df089c9bfad4cd9c4dcb60dd834679f)).

### 2021-08-14

#### Chores

- Updated Angular to v12.2.1 ([3802485](https://github.com/sendahug/send-hug-frontend/commit/3802485e69c177e7f3f71004b7916c1120b9ed78)).

### 2021-08-08

#### Chores

- Updated Angular to v12.2.0 ([df2a364](https://github.com/sendahug/send-hug-frontend/commit/df2a364602080582482d6979111cd8cc19b81042)).
- Updated rxjs (major update) to v7.3.0 ([eef01ea](https://github.com/sendahug/send-hug-frontend/commit/eef01ea53613814faf3b370368fa40851bd321f4)).

### 2021-08-01

#### Chores

- Updated Angular to v12.1.4 ([a548a21](https://github.com/sendahug/send-hug-frontend/commit/a548a21c2537e6d290d097460ad746bace58943c)).

### 2021-07-24

#### Chores

- Updated Angular to v12.1.3 ([a37172e](https://github.com/sendahug/send-hug-frontend/commit/a37172eaa5d0c6b06cfa348d04b2020bab1af2f8)).

### 2021-07-18

#### Chores

- Updated Angular to v12.1.2 ([7c28997](https://github.com/sendahug/send-hug-frontend/commit/7c28997fe46655b3b0a0e13e8dda8a60b9522346)).

### 2021-07-02

#### Chores

- Changed the repository's primary branches to remove the reference "master" and to add a staging environment.
- Updated the GitHub Actions workflows to reflect the branches' change ([c228fda](https://github.com/sendahug/send-hug-frontend/commit/c228fdab106abfe6aac973f958cc50a156f823c0)).
- Updated Angular v12.1.1 ([a95cf8c](https://github.com/sendahug/send-hug-frontend/commit/a95cf8c60d746d0a6e90fa56a014fd25a3be4665)).
- Bumped the pa11yci timeout to allow more time for the page to load in CI ([c3d958e](https://github.com/sendahug/send-hug-frontend/commit/c3d958e5442e908d1546911a73a4d5f2d5d97124)).

### 2021-06-26

#### Fixes

- Fixed a bug where the button for closing the search form did nothing due to the click handler calling the wrong method ([d7a162e](https://github.com/sendahug/send-hug-frontend/commit/d7a162e18c2cb9c909f89335f9cbb74eb9bff57e)).

#### Chores

- Upgraded Angular to v12.1.0 ([32abf39](https://github.com/sendahug/send-hug-frontend/commit/32abf39f4905ab42aa302aa7b58bd90bca7813a5)).

### 2021-05-11

#### Chores

- Re-enabled dependabot's rebasing to easily resolve conflicts in its pull requests ([bbf8544](https://github.com/sendahug/send-hug-frontend/commit/bbf854427642f54e30c8078f14bec31ba1d5733d)).

### 2021-05-09

#### Chores

- Updated Angular from v11.2.12 to v11.2.13 ([478e9ac](https://github.com/sendahug/send-hug-frontend/commit/478e9ac696c01cea7d60a81fbc3108f051e08833)).

### 2021-05-01

#### Chores

- Updated Angular from v11.2.11 to v11.2.12 ([25f0a1e](https://github.com/sendahug/send-hug-frontend/commit/25f0a1e016c4326436831808f6262c16330a30f9)).

### 2021-04-28

#### Chores

- Upgraded to GitHub-native Dependabot ([e6949ba](https://github.com/sendahug/send-hug-frontend/commit/e6949ba47f7e8cd396b2e67ecc5db1cbac3abc71)).

### 2021-04-25

#### Changes

- Changed the production VAPID keys due to a security issue, which exposed the previous private key ([1b51dad](https://github.com/sendahug/send-hug-frontend/commit/1b51dad795c40f62cf39d74c1dad01eafd88e4ee)).

### 2021-04-22

#### Chores

- Updated Angular from v11.2.10 to v11.2.11 ([ae1ebe3](https://github.com/sendahug/send-hug-frontend/commit/ae1ebe3c04b6101270ed6f29532abd4e2bd6f460)).

### 2021-04-16

#### Chores

- Updated Angular from v11.2.9 to v11.2.10 ([5dc289e](https://github.com/sendahug/send-hug-frontend/commit/5dc289e8a98696dbad0598d92fe455086a20c3d6)).

### 2021-04-10

#### Chores

- Split the "block is being calculated correctly" test into several tests, each for one selected length ([569b063](https://github.com/sendahug/send-hug-frontend/commit/569b063044c47002360d66e35ff0a77994bd3d8e)).
- Changed admin dashboard reports and blocks tests to look for a date object, rather than a specific date. Since there are tests specifically for checking the blocks are calculated correctly, it's not necessary to also run these checks in the functions calling the calculate method. ([13aa15a](https://github.com/sendahug/send-hug-frontend/commit/13aa15a054eacb38a10228943291ae6cea7f0aec))
- Changed admin dashboard tests to check date string instead of date. The Date checks compare the dates up to the milliseconds, which aren't really relevant when comparing days/weeks. The strings contain only the date and time (up to seconds), which is more appropriate. ([c8fa840](https://github.com/sendahug/send-hug-frontend/commit/c8fa840c64cf585b3e516470e2f58a3b9fafef30))

### 2021-04-09

#### Chores

- Replaced all old `fakeAsync` calls in the unit tests with the updated way of indicating that a Jasmine test is async ([08eb858](https://github.com/sendahug/send-hug-frontend/commit/08eb858e195d28f0ac0a1027a4929b8a024db340)).
- Removed date information from some of the unit tests. Since the tests were relying on a date field, any minor difference between the expected date and the date returned by the function that was tested caused the test to fail, even when the date wasn't part of the test. ([3a310d4](https://github.com/sendahug/send-hug-frontend/commit/3a310d4b81224a321c5e507f00b1a92ca1887710))

### 2021-04-08

#### Chores

- Updated Angular from v11.2.8 to v11.2.9. Also updated typescript (v4.2.3 to v4.2.4) and core-js (v3.10.0 to v3.10.1). ([aca0228](https://github.com/sendahug/send-hug-frontend/commit/aca02289c2b7f6f40d7e158c6dc182b9743396a4))

### 2021-04-02

#### Chores

- Updated package-lock file to fix vulnerabilities ([00a25f7](https://github.com/sendahug/send-hug-frontend/commit/00a25f79bac49fa534a296fca167013903af97ad)).
- Updated Angular from v11.2.7 to v11.2.8 ([00e88f5](https://github.com/sendahug/send-hug-frontend/commit/00e88f59daec2c27d0a70f9d03c97b29eb6b58d8)).

### 2021-03-28

#### Chores

- Updated Angular from v11.2.3 to v11.2.7 ([c302ab4](https://github.com/sendahug/send-hug-frontend/commit/c302ab47225351217e2b506dd0ef34b00741c7b7)).

### 2021-03-26

#### Chores

- Deleted the Travis CI workflow file. Since tests were already moved to Circle CI, there was no need for that file anymore and it caused errors in Travis CI due to the team having no remaining credits ([fab4e28](https://github.com/sendahug/send-hug-frontend/commit/fab4e283901941905653c1a5f91f27497daab58c)).

### 2021-02-25

#### Chores

- Bumped the pa11yci timeout to allow more time for the page to load in CI ([1b471e4](https://github.com/sendahug/send-hug-frontend/commit/1b471e40a3d156c196dc9838dc6d63100ee30bc6)).
- Updated Angular from v11.1.2 to v11.2.3 ([9a35589](https://github.com/sendahug/send-hug-frontend/commit/9a35589924bb4433e139f129990fdb0e27d470a2)).

### 2021-02-07

#### Chores

- Updated Angular from v11.0.9 to v11.1.2 ([1c2b456](https://github.com/sendahug/send-hug-frontend/commit/1c2b456dd67aec5914de1ca3fe638258c76fe851)).
- Changed the location of webdriver-manager as used by Protractor for the e2e tests. The one installed as a dependency of Protractor was unreliable and caused issues running e2e tests ([a7f9b27](https://github.com/sendahug/send-hug-frontend/commit/a7f9b27b3bfbd45c42e13ea96ac01a5345a0b0bf) & [5131180](https://github.com/sendahug/send-hug-frontend/commit/5131180f8e4fd6b1da03f680a90d4b3910ce271b))

### 2021-01-19

#### Fixes

- Added the previously missing transaction type to all IDB transactions. Transaction types are required by IDB and should've been added when that code was written ([9682930](https://github.com/sendahug/send-hug-frontend/commit/9682930398dce206899f9b48c746c888094bd941) & [9228b75](https://github.com/sendahug/send-hug-frontend/commit/9228b75f04c9d3acd421c27f8214b8606754eae6)).

### 2021-01-18

#### Chores

- Added a GitHub Actions workflow to automatically update the superproject repository when a release to live is made ([60e8615](https://github.com/sendahug/send-hug-frontend/commit/60e86151492b16f6d932c12d8133a36c0c7d367a)).

### 2021-01-17

#### Chores

- Updated all Angular dependencies from v11.0.5 to v11.0.9 ([ca8ca90](https://github.com/sendahug/send-hug-frontend/commit/ca8ca9064f6ff5f41fbca5b155dc913e1fa80fa1)).
- Updated the package-lock file to fix a vulnerability ([904923f](https://github.com/sendahug/send-hug-frontend/commit/904923fcda1dc4b752daa194b6ecae58d81f100d)).
- Added a missing sub-package required by Font Awesome ([fae9988](https://github.com/sendahug/send-hug-frontend/commit/fae9988b13f94a03861f4a986594cf775f2a96ae)).

### 2020-12-25

#### Chores

- Deleted the unneeded create-release GitHub Actions workflow ([6b32afa](https://github.com/sendahug/send-hug-frontend/commit/6b32afa3efc5b3b5e1748867786f381217da3e14)).

### 2020-12-24

#### Chores

- Instead of finding test files using regex and manually reading every directory in the project, the gulp task now finds paths by using glob patterns. These patterns found by the `glob` package are then added to the main tests file before the code is bundled ([9b2f08e](https://github.com/sendahug/send-hug-frontend/commit/9b2f08e9eb90226dae58023c279219fcf1efa049)).

## V1.0.0 Beta 2

### 2020-12-23

#### Feature

- When changing the colours selected in the colour pickers (even before closing the colour picker), the user's icon now updates its colours. This allows users to preview what their new icon would look like ifi they pick the colours currently highlighted ([117ef37](https://github.com/sendahug/send-hug-frontend/commit/117ef37410bc9d1526c3705d84da77b631406960)).
- Added a background pattern to the SVG icons ([7aea759](https://github.com/sendahug/send-hug-frontend/commit/7aea7591074e974496e03757653a68e098c41a79)).

#### Chores

- Added the HTML copying gulp task to the watcher for static assets, since the SVGs are inlined in the HTML ([de8e929](https://github.com/sendahug/send-hug-frontend/commit/de8e9294ed1907ff5010182254ecd5a2a76d1e69)).

#### Documentation

- Updated the README with details about the new components ([1a7629b](https://github.com/sendahug/send-hug-frontend/commit/1a7629b9810dc8baf2185ac5c9583469f8fab684)).

### 2020-12-22

#### Feature

- Added the user icon to the User View ([d6c7dc5](https://github.com/sendahug/send-hug-frontend/commit/d6c7dc5805bb64c74de73bd851e1731c2122157f) - [66fa358](https://github.com/sendahug/send-hug-frontend/commit/66fa358f34d9cc54c71464752201be3643f47324)).
- The users' store in IndexedDB now saves the user's icon data ([de8b1e8](https://github.com/sendahug/send-hug-frontend/commit/de8b1e80ed2ae672cf69724289bf02fa2eb3c193)).
- Added the user icons to threads' and messages' interfaces and views ([7041c67](https://github.com/sendahug/send-hug-frontend/commit/7041c6779e39382520f02948bc4f2f58381f2a87) - [6180d4d](https://github.com/sendahug/send-hug-frontend/commit/6180d4dadd64614a843b1fd1f3b6c56909a9009c)).

### 2020-12-21

#### Feature

- When the user picks a new colour in the colour pickers, the user's icon now updates its colours. This allows users to view what their new icon would look like if they save the icon ([5017a42](https://github.com/sendahug/send-hug-frontend/commit/5017a426f58656674f14f9e8965bcaabb8b384fa)).
- Added the icon editor to the settings page ([3f4e3f6](https://github.com/sendahug/send-hug-frontend/commit/3f4e3f67f6d8bd7d1b7553c9dd50da46eadc0734) - [8c35f11](https://github.com/sendahug/send-hug-frontend/commit/8c35f110d44da80cf2bf1ab73d32db0f5488e64a)).
- Added the functionality for closing the icon edit form ([d96141a](https://github.com/sendahug/send-hug-frontend/commit/d96141a261e5312d713bf6c7831f8502aebcb08f)).
- The user's icon in the Icon Editor now shows the user's selected colours when the form is opened ([c080046](https://github.com/sendahug/send-hug-frontend/commit/c080046022541c6dbdc7e4e72fc5599d4fe0ee3b)).

#### Changes

- Replaced the full User interface in the Admin Service with a Blocked User interface, which excludes some unnecessary properties that aren't used by Admin screens ([129701e](https://github.com/sendahug/send-hug-frontend/commit/129701e842667fe65cb7e59aca8cafa203d0b55e)).
- Simplified the SVG icons' strcture to allow changing their colours ([d403174](https://github.com/sendahug/send-hug-frontend/commit/d4031745bf62988bdede3c5546fb2e714ea34137)).

#### Chores

- Updated the gulp tasks for editing the HTML files to inline the SVGs, which allows us to colour them using CSS ([](https://github.com/sendahug/send-hug-frontend/commit/a5a7916d2a83f245ac6305590dfb41c363c37319) - [88a95e7](https://github.com/sendahug/send-hug-frontend/commit/88a95e7272022f313af2c20cb8224511a5484778)).

### 2020-12-20

#### Features

- Added a new form to allow users to edit user icons' colours ([0e0cd7b](https://github.com/sendahug/send-hug-frontend/commit/0e0cd7bd7ab1d810f7d4cb0ae43e37720d542730)).
- Added the user icons' data to all interfaces and services that have user-related data ([1cea50e](https://github.com/sendahug/send-hug-frontend/commit/1cea50e98571658e7f577bd29a00c21897b3fae1) - [f29e745](https://github.com/sendahug/send-hug-frontend/commit/f29e74513dc84dca124210cff3a7dc949274f452)).
- The icon editor's icon colours are no pre-filled from the Auth Service's user data ([739c438](https://github.com/sendahug/send-hug-frontend/commit/739c438b889e3376d64d482cd53bdec71a538ef8)).
- Added support for updating icon colours ([6af92f](https://github.com/sendahug/send-hug-frontend/commit/6af92f9c3e85075e7956e5760120acbd12f11625)).

#### Chores

- Updated the sitemap, the gulp tasks, the pa11y config and the CircleCI config for running accessibility tests in CI ([f553063](https://github.com/sendahug/send-hug-frontend/commit/f55306346e3c132ddb58940d3a0ec2a57b01b9b0) - [8f7f4ec](https://github.com/sendahug/send-hug-frontend/commit/8f7f4ece0d6e4f4501eb02a6460cd5a8e3d6f83b)).
- Updated Angular to v11.0.5 ([8d8cb98](https://github.com/sendahug/send-hug-frontend/commit/8d8cb982503166d952069113ea4fb213968efeb8)).
- Updated the env-config build script's replacement string to match the string the bundler outputs ([8481e8d](https://github.com/sendahug/send-hug-frontend/commit/8481e8d64071fe29bb895bb2750ba327a60ed278)).

### 2020-12-19

#### Chores

- Set up initial gulp tasks and workflow for running accessibility tests (with pa11yci) in CI ([d51ce90](https://github.com/sendahug/send-hug-frontend/commit/d51ce903bed5b9c09d4b340a3207759bf6fae838) - [f9ea97](https://github.com/sendahug/send-hug-frontend/commit/f9ea979b05af06f0562fdc5e2325e8fff29e6a4c))

### 2020-12-18

#### Chores

- Fixed the workflow of running e2e tests in CI ([4389f69](https://github.com/sendahug/send-hug-frontend/commit/4389f69878d5137c3e00cc6944c06e97d7675578) - [7cac89b](https://github.com/sendahug/send-hug-frontend/commit/7cac89b4d6001710474ff48e36a9a6d4e8b2d052)).
- Updated the package-lock file ([b5dcda1](https://github.com/sendahug/send-hug-frontend/commit/b5dcda1d9bb80b4aa4f1a110bfce86b152a9cab0)).
- Installed a site-map generator for running accessibility testing in CI ([f8a64c8](https://github.com/sendahug/send-hug-frontend/commit/f8a64c890f98cdc5cdb8098091b9a729f3748de2)).

### 2020-12-17

#### Chores

- Made various fixes to the e2e tests in CI, including an updated docker image for tests, updated gulp tasks for e2e and an updated Karma config ([05aa9d5](https://github.com/sendahug/send-hug-frontend/commit/05aa9d5a988b102f84e41094e6d2d47769d5e7c2) - [d136ce3](https://github.com/sendahug/send-hug-frontend/commit/d136ce3590ee22e0d4c926ba140bf904701f2712)).

### 2020-12-16

#### Chores

- Added an npm script for running e2e tests ([1edc2a9](https://github.com/sendahug/send-hug-frontend/commit/1edc2a92efd706bd86cf71aaee4578133976f37c)).
- Added e2e tests to the CircleCI workflow ([952cd5c](https://github.com/sendahug/send-hug-frontend/commit/952cd5c1151ea92ca3492f555855629a250bf252) - [7a26941](https://github.com/sendahug/send-hug-frontend/commit/7a26941ef0f3fd93ebe344f0ac8d88f9bcb7a8ab)).

### 2020-12-15

#### Features

- Added a new component for icon editing ([0027b12](https://github.com/sendahug/send-hug-frontend/commit/0027b12608064fa6ecf1ba2e29e2a9f2dc73160c)).
- Added initial user icons designed by [Macy Tyler](https://instagram.com/alphamacy) ([1304eff](https://github.com/sendahug/send-hug-frontend/commit/1304eff873ed6e22fdd15b10c946b238f6165fb5)).

#### Chores

- Updated Angular to v11.0.4 ([0191430](https://github.com/sendahug/send-hug-frontend/commit/0191430776acabc0ceb234ff639f38097c048c18)).

### 2020-12-13

#### Features

- Added a new Site Policies component with the terms and conditions, the privacy policy and the cookies policy ([0edd19e](https://github.com/sendahug/send-hug-frontend/commit/0edd19ea0221da46a675cdbce596c8242325154c) - [90d3742](https://github.com/sendahug/send-hug-frontend/commit/90d374289456d577b7046c36ea9ea9bddedc6648)).

### 2020-12-07

#### Documentation

- Replaced the Travis CI badge in the README with a CircleCI badge ([6fd1743](https://github.com/sendahug/send-hug-frontend/commit/6fd1743b529216ecd74248d488dd4ca59ca2cbf0)).

### 2020-12-01

#### Chores

- Set up an initial workflow file for CircleCI ([d7be2e2](https://github.com/sendahug/send-hug-frontend/commit/d7be2e2b23f5421d4679a49fcb6b0d9ddc3b24fd) - [f9baecd](https://github.com/sendahug/send-hug-frontend/commit/f9baecdbcd10186121d315946b9a21e867e24368)).

### 2020-11-29

#### Chores

- Changed the create-release workflow to remove the branch restriction as a temporary workaround for it ([a02cb41](https://github.com/sendahug/send-hug-frontend/commit/a02cb410cfcc2f8322b5324a77ee45e8e43a7fb4)).

### 2020-11-24

#### Chores

- Changed the way the environment variables are updated in production. Previously, we used an environment variable to check which environment file to use in each file where the environment was used. Now, the development environment file is replaced as part of the build process ([5489859](https://github.com/sendahug/send-hug-frontend/commit/54898591354ffc0951f7a2064eccd11b34da5433)).
- Updated dev dependencies ([c46be25](https://github.com/sendahug/send-hug-frontend/commit/c46be25bf76551750ad368494c9976fb8d9e1932)).

### 2020-11-20

#### Chores

- Updated Angular and TypeScript ([b061182](https://github.com/sendahug/send-hug-frontend/commit/b061182294c6220c4e8dc9da0c34d80b55a68977)).

### 2020-11-15

#### Features

- Added ARIA label to the skip link ([68f31c7](https://github.com/sendahug/send-hug-frontend/commit/68f31c7f45a77ab45e8fbc716c98d2928d40e49e)).

#### Chores

- Updated the package-lock file ([9bdf331](https://github.com/sendahug/send-hug-frontend/commit/9bdf33198e4a2a150deb2f09164a45d925b2c2d6) & [19703b2](https://github.com/sendahug/send-hug-frontend/commit/19703b2f4db65add5ca1766abddf183625638910)).

### 2020-11-14

#### Features

- Added a link to the support page in the app's footer ([872e93b](https://github.com/sendahug/send-hug-frontend/commit/872e93b2373d9a86096e7337509dcb419e32d870)).
- Added an error message to display if the user disabled JavaScript ([2f02cb4](https://github.com/sendahug/send-hug-frontend/commit/2f02cb4ce52e4130f1ed990d62019654d825d32d)).

### 2020-11-13

#### Fixes

- Fixed the selectors used for the design of the Font Awesome icons ([ad18ead](https://github.com/sendahug/send-hug-frontend/commit/ad18ead75e7d6d73cfe7caaa106303e7667e3b78)).
- Fixed the design of the main content area ([2b2d083](https://github.com/sendahug/send-hug-frontend/commit/2b2d083bd7136150a474d1522d42c3ec39788d36)).

#### Documentation

- Added the new components to the main README ([cfa1516](https://github.com/sendahug/send-hug-frontend/commit/cfa15168385c973e66cc6e1ad5938492d171d528)).

### 2020-11-12

#### Features

- Added a navigation menu to the Support Page ([f3271a0](https://github.com/sendahug/send-hug-frontend/commit/f3271a0de8883c7e5e4aac5acc742aafa0b8b8ba)).

#### Chores

- Updated Angular to v11 ([90b27f7](https://github.com/sendahug/send-hug-frontend/commit/90b27f7a9f8188e1334fd74a53f4bc7f066b25fe)).

### 2020-11-10

#### Features

- Added initial questions and details to the new support page, as well as an initial design ([4ccf379](https://github.com/sendahug/send-hug-frontend/commit/4ccf37909c93bcc64c6a77cd26a8e113a07e5e8d) - [36e5bb7](https://github.com/sendahug/send-hug-frontend/commit/36e5bb70b8345f12e0c519ca54c45e045c1915b9)).

#### Chores

- Updated Angular to v10.2.3, as well as other dependencies ([eacd649](https://github.com/sendahug/send-hug-frontend/commit/eacd649a3bf59f4ceed5ad0d8c457589487caa75)).

### 2020-11-09

#### Changes

- Replaced the post, admin dashboard and home icons in the navigation menu with path-based SVG icons ([e27c1a8](https://github.com/sendahug/send-hug-frontend/commit/e27c1a8acc84ddfe1f07018c85b20d05bcb520e3) - [a3bf4d1](https://github.com/sendahug/send-hug-frontend/commit/a3bf4d1fc0fb4c0c645feb56f1de466a26d4c8f0)).

#### Chores

- Changed gulp's HTML copying task to inline the navigation menu's SVGs. This keeps the AppComponent source HTML clean in development while letting us leverage SVGs' CSS capabilities ([fe2ea66](https://github.com/sendahug/send-hug-frontend/commit/fe2ea665ebd716b0bacaa065a8567098bcb78c22)).

### 2020-11-08

#### Features

- Added a basic new support page ([4d1acdc](https://github.com/sendahug/send-hug-frontend/commit/4d1acdc3e7f66c9ac1c6aebfdc370c0a3ba362cf)).

#### Changes

- The suggested posts' fetch from IndexedDB now orders the posts based on both date and hugs, which is the same as in the back-end ([28ffb6f](https://github.com/sendahug/send-hug-frontend/commit/28ffb6f7b9e91d88d8d676cd8ede344fb9465623)).
- The "send hugs" button is now disabled if the user isn't logged in, since they can't send a hug anyway in that state ([0f53958](https://github.com/sendahug/send-hug-frontend/commit/0f53958f272b1de62e1c099624cf411e61d2e9ae)).

### 2020-11-07

#### Features

- Added a post component to encapsulate all of a post's functionality in a single component ([ecef076](https://github.com/sendahug/send-hug-frontend/commit/ecef0762fb7f61abf4d0e2bc6b4e81e0ea4fa15a) - [0665dd8](https://github.com/sendahug/send-hug-frontend/commit/0665dd87b873f9195b1fe49738bff81171518e43)).

#### Changes

- Replaced the posts in the Main Page, the Full List and the Search Results with the new post component ([e7a929f](https://github.com/sendahug/send-hug-frontend/commit/e7a929f0cfe3989163f6d281f2f0fb45e058cbc9) & [5049420](https://github.com/sendahug/send-hug-frontend/commit/5049420f579c32bd07e5d04af1478c0ac748c6d4) & [6588ba6](https://github.com/sendahug/send-hug-frontend/commit/6588ba6c5d3b7dfde1d47eb11f0fbc12f6bf87f3)).

## v1.0.0 Beta 1

### 2020-11-06

#### Chores

- Added missing input to the GitHub Actions workflow for creating a release ([af167a9](https://github.com/sendahug/send-hug-frontend/commit/af167a99ad6c0bd8ae5c473b08783d19f5127b7a)).

### 2020-11-05

#### Features

- Added a web manifest to create a Progressive Web App (PWA). This also includes an icon to display on Apple devices and new Gulp tasks for copying the manifest and related files ([d968f86](https://github.com/sendahug/send-hug-frontend/commit/d968f863fde76c9f804bbadfd1cecdba14453048) - [d18d269](https://github.com/sendahug/send-hug-frontend/commit/d18d2695760c5657bb22be4b1c61ba92bbd8613d)).

#### Fixes

- The push notifications permissions check was accidentally checking for whether the user denied permission, and if so, attempted to send a notification (which threw an error). The check now looks for granted permission before sending a notification. ([67ef0b2](https://github.com/sendahug/send-hug-frontend/commit/67ef0b2b27ad1f76614858f2d424e0fbf4a02000))

#### Chores

- Updated Angular to v10.2.2 ([3141910](https://github.com/sendahug/send-hug-frontend/commit/3141910f4337ae060f23da5df4b97d5664d9bbbe)).
- Added a GitHub Actions workflow to create a release ([abc90bf](https://github.com/sendahug/send-hug-frontend/commit/abc90bfd590a0192851ede6879c1d66e4c6e1dcb)).

### 2020-11-03

#### Features

- The threads store in IndexedDB is now cleared when the user logs out ([8e6a801](https://github.com/sendahug/send-hug-frontend/commit/8e6a80116ff8e3b6868dec99cb1744d8e6229839)).

#### Changes

- Adjusted the filters views to the updated format returned by the filters' endpoints ([f66d9f9](https://github.com/sendahug/send-hug-frontend/commit/f66d9f9802526cfe8c5b2728b8ca660b9606b387) - [28d79c1](https://github.com/sendahug/send-hug-frontend/commit/28d79c189aff0793d130bbbecc54f1526605c812)).
- The user IDs and names in threads saved in IndexedDB are now taken from the data returned by the back-end, rather than based on the assumption that user 1 is always the logged in user (which isn't always correct). ([11759c0](https://github.com/sendahug/send-hug-frontend/commit/11759c03a809440d507f0e4e352afa6b9c2f4641))

### 2020-10-31

#### Fixes

- Fixed a bug disabling the hug button after a hug is sent ([a6cbc8d](https://github.com/sendahug/send-hug-frontend/commit/a6cbc8da4fb8e0baf27dbf7fb44964950e64eecd)).
- Added a missing parameter when checking for push notifications permissions ([1b0317d](https://github.com/sendahug/send-hug-frontend/commit/1b0317d4926269a9c7c90e752010eadb67b1125c)).
- Fixed styling errors in buttons and alerts ([aa3b51e](https://github.com/sendahug/send-hug-frontend/commit/aa3b51ee7afad84ae41078a3d94768567b6965f5) & [e1370ce](https://github.com/sendahug/send-hug-frontend/commit/e1370cef15ee6c43398046cbf5e6a43f7968feed)).

### 2020-10-30

#### Features

- Added a check for existing push notifications permissions to ensure we have permission before attempting to send push notifications ([4457c1f](https://github.com/sendahug/send-hug-frontend/commit/4457c1fa3662c950b170c481ab9e533a6505b3d3)).

#### Chores

- Added templates for pull requests and updated existing templates ([0325585](https://github.com/sendahug/send-hug-frontend/commit/0325585067ede5e4dc3ba446e149004f02057c1b) - [d92c9d4](https://github.com/sendahug/send-hug-frontend/commit/d92c9d4be76c4338c565f86ce87ae8f99604b768)).

### 2020-10-29

#### Fixes

- Fixed the design of various elements when using larger font sizes or higher text spacing ([f4b0b28](https://github.com/sendahug/send-hug-frontend/commit/f4b0b281c898dafe9154dbc0a58720e448ff5ad8) & [bff20df](https://github.com/sendahug/send-hug-frontend/commit/bff20dfb77ca4d4740c165f9ec22a60e013cb81d)).
- Added a missing ARIA role ([4cee30a](https://github.com/sendahug/send-hug-frontend/commit/4cee30a12802dae78ee471e8a417d782967fcb1c)).
- Fixed the design of the notifications block ([0545bff](https://github.com/sendahug/send-hug-frontend/commit/0545bff1ad61dc10fc6d7e066b6d3ee54dbde234)).
- The text on the 'enable/disable push notifications' button now shows the correct value when unsubscribing ([3795de6](https://github.com/sendahug/send-hug-frontend/commit/3795de6fb9b224eb63c0b56a0532020acc580a27)).

#### Chores

- Updated the email address used as the site's main address ([6c52588](https://github.com/sendahug/send-hug-frontend/commit/6c52588bdf97dd74716400850fbba9099ed53ee2)).
- Updated Angular to v10.2.1 ([56751e1](https://github.com/sendahug/send-hug-frontend/commit/56751e141b2c1d8ae5d3fb964a9ccdbf50553a6e)).
- Added a CONTRIBUTING file to provide information about contributing to the repo ([fcec6cc](https://github.com/sendahug/send-hug-frontend/commit/fcec6cc9492ebd21773d458a3318847f284d1e9d) & [f983c4d](https://github.com/sendahug/send-hug-frontend/commit/f983c4d8ecc444d62953bedbb677dd06ae77cc8a)).
- Updated the issue templates ([965d1ba](https://github.com/sendahug/send-hug-frontend/commit/965d1ba09c4bf5e80f27bbf5eb2864c5e0dc6d8f) & [1efff3d](https://github.com/sendahug/send-hug-frontend/commit/1efff3d021d9d0685c6b8fe7332f0cffda637dc9) & [e0b8465](https://github.com/sendahug/send-hug-frontend/commit/e0b8465b8db8bfa51e735e35fa3f422b56c871c2)).

### 2020-10-28

#### Features

- The push subscription's ID is now saved in the Notifications Service once it's posted to the back-end ([6ce4152](https://github.com/sendahug/send-hug-frontend/commit/6ce41521d9a0c2d0f36de9bea0275386bb662ef8)).
- Added support for renewing expired push subscriptions ([9e57778](https://github.com/sendahug/send-hug-frontend/commit/9e57778b7c777ab964d2511454549540bddfa668) & [ac3263b](https://github.com/sendahug/send-hug-frontend/commit/ac3263bb0ef8e46d7992e39b9d14f68bd2f5dfe7)).
- Added handling for 'push subscription change' event in the ServiceWorker ([1e683ae](https://github.com/sendahug/send-hug-frontend/commit/1e683aec8909317e72b3baa3b87ae99b2a5f814c)).

#### Chores

- Added templates for opening new issues in GitHub ([9fe2d1f](https://github.com/sendahug/send-hug-frontend/commit/9fe2d1fc1483b74f361bddc05d01f4e89e1f76c6)).
- Added code of conduct to the repo ([ea519cd](https://github.com/sendahug/send-hug-frontend/commit/ea519cd57498f4722c091b07e22c2b413554980d)).

### 2020-10-27

#### Changes

- The user's data is now cleared when the user logs out ([836f2d8](https://github.com/sendahug/send-hug-frontend/commit/836f2d87cbb0fb8781f00de9471563b1978cb4be)).

#### Fixes

- Fixed a bug that caused the user's own profile to change rapidly ([75044df](https://github.com/sendahug/send-hug-frontend/commit/75044df09983340c41cd2ca094bea8540e81524c)).
- Added a check for whether a user exists before attempting to fetch their posts from IndexedDB, which fixes an error that was thrown by IDB when the user hasn't been cached yet ([3cee83c](https://github.com/sendahug/send-hug-frontend/commit/3cee83cee1da2d742fb8ae170ace7bedc4868673)).

### 2020-10-26

#### Changes

- Deleted an unneeded subscription in the user posts component ([f2133c7](https://github.com/sendahug/send-hug-frontend/commit/f2133c7fcf1c1f4a51b30673b551650d1df4e4d5)).

#### Fixes

- Fixed a bug with user page not updating user data correctly ([0f2117a](https://github.com/sendahug/send-hug-frontend/commit/0f2117aa2ac0640a81c544834389608be203369f)).
- Fixed a bug that caused the user profile to change rapidly for no reason ([444ee04](https://github.com/sendahug/send-hug-frontend/commit/444ee04c295438ed9df3aadf6facc5f6255ec7b5)).

#### Chores

- Updated Angular to v10.2.0 ([00e9d95](https://github.com/sendahug/send-hug-frontend/commit/00e9d95a64baa4db48b97f2a529dba7ee30d7f80)).

### 2020-10-25

#### Features

- Added support for pagination in IndexedDB calls ([2b1e184](https://github.com/sendahug/send-hug-frontend/commit/2b1e184de025135243d5cb0dab4fb23c48f16a6f) & [72f1563](https://github.com/sendahug/send-hug-frontend/commit/72f1563398bc4ee0d7306390244e49e4ce5f6ec6)).
- Enabled pagination in single thread views ([5adbd9b](https://github.com/sendahug/send-hug-frontend/commit/5adbd9bb1b533c29a62be0c678dba14cc2be7f08) & [cb38bc3](https://github.com/sendahug/send-hug-frontend/commit/cb38bc35a6daa0d9c8379a8d7ed1e546b216a594)).

#### Fixes

- Fixed an error in property access when checking the length of the array of posts returned by IDB ([e028243](https://github.com/sendahug/send-hug-frontend/commit/e028243269a1a369c31f995a28e36dc0b7eb2552)).
- User posts returned by the back-end were accidentally used to update the wrong property in the Items Service, which broke the user posts component. The name of the property was fixed ([f450d41](https://github.com/sendahug/send-hug-frontend/commit/f450d41c7b7f4f274a86e869a5b4b3382ea910d8)).

### 2020-10-24

#### Changes

- Adjusted all post fetches to include details about the latest fetch time and location. This presents source and time checks for all post fetches, in order to ensure the information the user sees is the most updated one (from the server), as opposed to the cached one (from IDB), even if IDB fetch is resolved after the server fetch ([7e400a6](https://github.com/sendahug/send-hug-frontend/commit/7e400a698284bd8e810477b44ee35c67f0036e0d) & [e4e2f86](https://github.com/sendahug/send-hug-frontend/commit/e4e2f860839e8c6a7b3651faca7b98202b418c4f)).
- Added last fetch data to messages and user posts ([57b2b48](https://github.com/sendahug/send-hug-frontend/commit/57b2b4856da6550f2eac5f4761d170a46c4a1f15) & [283e181](https://github.com/sendahug/send-hug-frontend/commit/283e181fd2515c0aa1b8415c92e7b1330eeea7c4)).

#### Fixes

- Fixed a bug where the page number in the Full List component was incorrect due to being fetched from the wrong place ([9f291fd](https://github.com/sendahug/send-hug-frontend/commit/9f291fd384db460aabc49e4e666b1a6f32f94025)).
- Fixed a bug where the wrong page number was sent to the server in the user posts' fetch ([383bd6f](https://github.com/sendahug/send-hug-frontend/commit/383bd6fedb9af164d78475c52e073629f4290164)).

### 2020-10-23

#### Features

- When the user posts a new post, the newly published post is now added to IndexedDB as soon as a success response is returned ([91f2d9e](https://github.com/sendahug/send-hug-frontend/commit/91f2d9ee3556ad5cb0f7fd4723dc9dbed8a08bff)).
- When the user sends a new post, the newly sent message is now added to IndexedDB as soon as a success response is returned ([1ee75aa](https://github.com/sendahug/send-hug-frontend/commit/1ee75aac590260e7a8a5c4584fa5ab8526327ae6)).

#### Fixes

- Fixed the designs of the posts' buttons ([e16f5f6](https://github.com/sendahug/send-hug-frontend/commit/e16f5f615bf80289d02aa0ac13de64957efd28e6)).
- Fixed the design of the navigation menu ([9830d79](https://github.com/sendahug/send-hug-frontend/commit/9830d79c8d360dce310c714e31cc344ff3816421) & [b149e35](https://github.com/sendahug/send-hug-frontend/commit/b149e353f38f6e9fd271e0d90d6755336af19688)).

#### Chores

- Added tests for the new features and for another keyboard focus process ([f16ad8b](https://github.com/sendahug/send-hug-frontend/commit/f16ad8b718dd3306c2d6756fd8dce6f4ecea795f) & [ddef9b9](https://github.com/sendahug/send-hug-frontend/commit/ddef9b93829a86bcded62b1758c811f30d67898f) & [714cb10](https://github.com/sendahug/send-hug-frontend/commit/714cb10f96d7933b404d07826edf40ce6ed29202)).

### 2020-10-22

#### Changes

- The keyboard focus is now returned to the element it was on before the popup was opened ([4228721](https://github.com/sendahug/send-hug-frontend/commit/42287218ad7723766e4ca64d3b88bac2557c9d57)).

#### Fixes

- Fixed the styling (width) of the posts' sub-menu ([ad13cf8](https://github.com/sendahug/send-hug-frontend/commit/ad13cf81b025a2aa5cabbc2c94540ba29a5010c6)).

### 2020-10-20

#### Chores

- Added a GitHub Actions workflow to build the app for deployment automatically when a pull request to the live branch is opened ([5361408](https://github.com/sendahug/send-hug-frontend/commit/5361408aa439f05bae592520c56ac97707a1a694) - [8df9fa8](https://github.com/sendahug/send-hug-frontend/commit/8df9fa843fbb1b8989572e2157de107a07b4680f))

### 2020-10-18

#### Chores

- Updated Angular and various other dependencies ([102fb58](https://github.com/sendahug/send-hug-frontend/commit/102fb58e45144083edd1273e5d8c4fed7ea84009)).

### 2020-10-08

#### Chores

- Added tests for the new share button ([d60a4e9](https://github.com/sendahug/send-hug-frontend/commit/d60a4e988901f362768d1b09f294b23f304300b9)).

### 2020-10-07

#### Features

- Added a button and the functionality to share the site via the Web Share API in supported browsers ([2178721](https://github.com/sendahug/send-hug-frontend/commit/217872195e86f82a4dd161ff13dd62d51e94529f) - [25c9962](https://github.com/sendahug/send-hug-frontend/commit/25c99621ce859e686370cadb2022bf10d86b1c1a)).

### 2020-10-06

#### Chores

- Added environment variables to contain the login details to use in e2e tests ([8632e99](https://github.com/sendahug/send-hug-frontend/commit/8632e99713a1253ef6f5a8981b779639ef6a1aa5)).

### 2020-10-05

#### Chores

- Adjusted the e2e, local development and serve tasks to allow using the local development tasks in e2e tests ([7c4c16e](https://github.com/sendahug/send-hug-frontend/commit/7c4c16e8f54334db350292deefbf5dc04cdd3137) - [32b0f0a](https://github.com/sendahug/send-hug-frontend/commit/32b0f0ab832a85310bb8cf65710cc597aea61fa9)).
- Added missing `login` call in the notification service's unit tests ([c65d640](https://github.com/sendahug/send-hug-frontend/commit/c65d640c8a7b848f1438d6d89b19831d80e5f55b)).

#### Documentation

- Added information about e2e tests, Protractor and the new site map component to the README ([d2a0570](https://github.com/sendahug/send-hug-frontend/commit/d2a0570c7e74081348fb29f2ad28376ab53b145d)).

### 2020-10-04

#### Chores

- Fixed a bug in the Browserify transform for inlining the templates ([de2da9e](https://github.com/sendahug/send-hug-frontend/commit/de2da9e93778644c93cee82583c85a72f1d692b7)).
- Added gulp tasks for running e2e tests ([0fd56ce](https://github.com/sendahug/send-hug-frontend/commit/0fd56ce96dcee7ceffb77040239737558a5b5e41) - [285ed46](https://github.com/sendahug/send-hug-frontend/commit/285ed466255fb4c4e6e4d16cb265eff467f4db02)).

### 2020-10-02

#### Chores

- Updated the license to add a clause about copying the project ([45adb47](https://github.com/sendahug/send-hug-frontend/commit/45adb4704ad32b191d3bf38e57b7a473bb4b1855) & [b622714](https://github.com/sendahug/send-hug-frontend/commit/b6227146027dec114a6e7bcd11ee779f36a7e620)).

#### Documentation

- Deleted the license badge from the README ([d1dbcbb](https://github.com/sendahug/send-hug-frontend/commit/d1dbcbb3a32c918b77b5bdf3cf3a0395ec57c66c)).

### 2020-10-01

#### Chores

- Added e2e tests for navigation and search ([25cf91f](https://github.com/sendahug/send-hug-frontend/commit/25cf91fe96396becba4b86c5f808d7b816184c1e) & [b075769](https://github.com/sendahug/send-hug-frontend/commit/b075769d944d99a7690d4effa06cd06cc6e2917a)).
- Updated Angular and a few other dependencies ([00e1949](https://github.com/sendahug/send-hug-frontend/commit/00e19495871a0f654207bf22ba30d13876794cb2)).
- Added missing Chrome flags to the Protractor config ([4f65f02](https://github.com/sendahug/send-hug-frontend/commit/4f65f02c682a6c6436955cbc36858a7fc1597b43)).
- Added an e2e spec file for router tests ([c3bbe3d](https://github.com/sendahug/send-hug-frontend/commit/c3bbe3dea6e6ec2c6a9bfbc0772ace9603999193)).

### 2020-09-30

#### Chores

- Added missing package and fixed errors in the Protractor config ([065c537](https://github.com/sendahug/send-hug-frontend/commit/065c5374de4a116a458d597936bf64bfdaff47fd) & [5c26e82](https://github.com/sendahug/send-hug-frontend/commit/5c26e82f71a4974486e96fcc36bf221bc5494e7a)).
- Added an initial e2e specs file ([3b32613](https://github.com/sendahug/send-hug-frontend/commit/3b3261323e4ec1196047985905e430b0cedcecb0)).

### 2020-09-26

#### Chores

- Installed Protractor and added Protractor config for e2e tests ([22ac203](https://github.com/sendahug/send-hug-frontend/commit/22ac2033252fcdad7cc84ae3928d76fe69c93b9f) & [c201ff1](https://github.com/sendahug/send-hug-frontend/commit/c201ff1c72707ea8658565600a9d83611c8ffcc5)).

### 2020-09-25

#### Fixes

- Added missing transaction type to the IDB interaction in the `addItem` method ([050c968](https://github.com/sendahug/send-hug-frontend/commit/050c9686816aef69fe9c9e0860545730f81d39b9)).
- Added missing transaction type to the IDB interaction in the `clearStore` method and fixed the way a store was selected in `addItem` ([e0d3a10](https://github.com/sendahug/send-hug-frontend/commit/e0d3a1024bb04c0715b0573a4eebea4caf61b44b)).

#### Chores

- Fixed an issue in App Component tests, which is caused by checking initial style, but that style is controlled by Karma in the test context. This check was now removed ([71a41bf](https://github.com/sendahug/send-hug-frontend/commit/71a41bf7e452c89a86aead2f51eaab972de8b09b)).
- Removed the test files from the coverage reports ([f2f72fc](https://github.com/sendahug/send-hug-frontend/commit/f2f72fc61c1c71bfefaeaa935309177bf51a3080)).
- Updated Angular and various other dependencies ([04c161f](https://github.com/sendahug/send-hug-frontend/commit/04c161f1d99217906fdfcd4a82f65fb9f50212de)).
- Added and updated more tests ([35e4558](https://github.com/sendahug/send-hug-frontend/commit/35e4558b3fce38ef5540a433e7084ab67704b3a1) - [2a79ca4](https://github.com/sendahug/send-hug-frontend/commit/2a79ca4b4acf20cc1b4497e6fbbb9cf5e95fefb8)).

#### Documentation

- Fixed the formatting in the README ([21cb806](https://github.com/sendahug/send-hug-frontend/commit/21cb80634de5e3e20d6f7cf7740c90e55358afb2) & [1a7f192](https://github.com/sendahug/send-hug-frontend/commit/1a7f19253ef13c63dddab137a749c6b7faa87d08)).

### 2020-09-24

#### Features

- Added new helper methods to the Service Worker Manager for adding and removing items from IndexedDB ([f6ce103](https://github.com/sendahug/send-hug-frontend/commit/f6ce103436ce7f27cd8e2d5fe37f4ef11f59b0af) & [0f1b2ff](https://github.com/sendahug/send-hug-frontend/commit/0f1b2ffd38ba77b6e25c628d434bff50e9365be2)).

#### Changes

- Replaced the `keyCode` accessor with `key` for keyboard event handlers in the Notifications Tab, as the `keyCode` accessor is deprecated ([ecc1bcd](https://github.com/sendahug/send-hug-frontend/commit/ecc1bcd70a6745213719e256fa1bbf9811a28980)).
- Previously, various services made calls to the IndexedDB client when they needed to add/remove items from the database. Now, the Service Worker Manager handles all interactions with the database, and services that need to make these changes call the relevant Service Worker Manager methods instead ([70062a6](https://github.com/sendahug/send-hug-frontend/commit/70062a6a9b7e8d9099998aea05a70e51ef0244a3)).

#### Fixes

- Fixed an error in clearing mailboxes, caused by a mismatch between the front-end's expectation and the back-end's response ([5d7d6de](https://github.com/sendahug/send-hug-frontend/commit/5d7d6de9469a377b32380565b1ddfc733086b1fe)).

#### Chores

- Replaced the codecov package with codecov's bash uploader in CI ([5650269](https://github.com/sendahug/send-hug-frontend/commit/5650269188dd66ea59d82a606ec06d9c7fb79ff7) & [e45ea5e](https://github.com/sendahug/send-hug-frontend/commit/e45ea5ecdbb89a944311621574f769d2f680e885)).
- Added keyboard focus tests for the popup and notifications tab ([296eecd](https://github.com/sendahug/send-hug-frontend/commit/296eecd379a525e71dcbe8457f10b731625d41da) & [db9b917](https://github.com/sendahug/send-hug-frontend/commit/db9b917f8ae9abc7b64397e1be515c68fe311c8d)).
- Updated and added more tests ([a9b7603](https://github.com/sendahug/send-hug-frontend/commit/a9b7603e4ded0f8a0fa18e5f1d9761db5fedc88d) - [f5ea84a](https://github.com/sendahug/send-hug-frontend/commit/f5ea84af43f29855f8696c120985378589726e41)).
- Updated the Travis CI workflow to lower the required memory and update the process of pushing the results to codecov ([c448b9f](https://github.com/sendahug/send-hug-frontend/commit/c448b9fbafdafa5e3ae81135ec9f7f1ce7c0e83d)).

#### Documentation

- Updated the README with updated details about running tests ([0db49b3](https://github.com/sendahug/send-hug-frontend/commit/0db49b32525028dcd43c0e8ab152b2c030cace2d)).

### 2020-09-23

#### Chores

- Added a Browserify transform for inlining the templates in the tests' bundle ([d0cb971](https://github.com/sendahug/send-hug-frontend/commit/d0cb971da5801ebfecb05184d09386e743b7405b) - [3498c37](https://github.com/sendahug/send-hug-frontend/commit/3498c3777e091f281498502337bf2cabb1afc037)).
- Improved anad added further unit tests, including tests relying on the newly-installed karma-viewport plugin ([02a7684](https://github.com/sendahug/send-hug-frontend/commit/02a76847d371301aa11ab7da2726cebc0d3f5bbd) - [4e41c95](https://github.com/sendahug/send-hug-frontend/commit/4e41c95bfa46bcfd655edc2b428f375feb7984bc)).

### 2020-09-22

#### Chores

- Fixed various issues in the new testing workflow ([84aec10](https://github.com/sendahug/send-hug-frontend/commit/84aec10a7dd5ae0777fd44391e4d7a35363dc068) - [cf999a4](https://github.com/sendahug/send-hug-frontend/commit/cf999a4802a7e0654df1f748ee4fe54fbea3b377)). This includes:
  - Fixed an error in the task responsible for finding tests.
  - Added missing testing plugins and packages (e.g., browserify-istanbul) and added them to the Karma config.
  - Changed the code bundling to inline the templates and the SVGs in the final bundle to allow Karma to run tests that include the DOM.

### 2020-09-21

#### Chores

- Fixed various issues in tests ([58f0c94](https://github.com/sendahug/send-hug-frontend/commit/58f0c94711afa64bffd571a76d189023a8bb407c) - [d6adfdf](https://github.com/sendahug/send-hug-frontend/commit/d6adfdfc6881a8baf881d7e9762917bad8e66a97)). This includes:
  - Added missing components to tests and deleted unneeded components from tests.
  - Replaced the routes with mock routes for testing.
  - Changed the Karma config to use a pre-bundled version of the code in tests (instead of bundling it).
  - Updated gulp's tasks to handle the new testing process and dependencies.
  - Deleted unneeded testing dependencies.

#### Documentation

- Updated the details about the dependencies in the README ([001ef85](https://github.com/sendahug/send-hug-frontend/commit/001ef85c8a69b9d2536bce9da47b1fbe54cf69cd)).

### 2020-09-20

#### Fixes

- Fixed an error that caused deleting items from IDB to fail because the wrong value was passed to the IDB client ([4585c17](https://github.com/sendahug/send-hug-frontend/commit/4585c17af5ff69817716387f9036ce26e15809da)).

#### Chores

- Replaced Webpack with browserify for test bundling ([0806966](https://github.com/sendahug/send-hug-frontend/commit/08069660a2ba2330513a4de2937806d9a3689f47) - [aff2e0a](https://github.com/sendahug/send-hug-frontend/commit/aff2e0a44a7d6ee8351a6258056246d67be9454f)).

#### Documentation

- Re-added the david-dm badges as the issue appears to have been fixed ([ef07736](https://github.com/sendahug/send-hug-frontend/commit/ef07736edc4f9d5f28b3ef3ce8a6e8a22a582821)).

### 2020-09-19

#### Features

- Added ARIA live attribute to alert container ([b18cdab](https://github.com/sendahug/send-hug-frontend/commit/b18cdab7aa19d87bda8a20ce06bd1844cce2c2de)).
- Added ARIA invalid attributes to all text fields ([20481bd](https://github.com/sendahug/send-hug-frontend/commit/20481bddef1343183380531cc05bc4439b7939f3)).
- Added input validation to the settings' edit form ([a9b3912](https://github.com/sendahug/send-hug-frontend/commit/a9b3912c2d7a12c6c93205e93ecfe38e5a272043)).
- Required fields now have a marking (`*`) to indicate they're required ([f8f9c2f](https://github.com/sendahug/send-hug-frontend/commit/f8f9c2fc7459d2301ad825a8f562839efe97012f)).
- Added ARIA required attribute to required inputs ([5225063](https://github.com/sendahug/send-hug-frontend/commit/52250634f2d80474a7e2c0accd80e199942b463b)).
- Added further ARIA attributes to the alert element to ensure an accessible experience ([cb7ca12](https://github.com/sendahug/send-hug-frontend/commit/cb7ca12a5dfaa0c1545e277b185a468b0e20c114)).
- Previously, deleted items remained in IndexedDB until the store was cleaned. Now, when a success response is returned by the API, the items are deleted from IndexedDB too ([277c91e](https://github.com/sendahug/send-hug-frontend/commit/277c91ea0ffc9947000deaa4309a497dc527fb24)).

#### Changes

- Replaced the `keyCode` accessor with `key` for keyboard event handlers, as the `keyCode` accessor is deprecated ([bc96f41](https://github.com/sendahug/send-hug-frontend/commit/bc96f414f945a591d2e7cd2faa36451da5f867ff)).

#### Fixes

- Fixed a bug where post menus changed from float to regular rapidly even though there was no change to the size of the viewport ([1493951](https://github.com/sendahug/send-hug-frontend/commit/149395185ab80a85f63bca991e6e5d8fd87f0bda)).

#### Chores

- Updated Angular and other dependencies ([6cf0565](https://github.com/sendahug/send-hug-frontend/commit/6cf0565e6757baa6db20a0d6918b8b1fdda10e84)).

#### Documentation

- Deleted the dependecies (david-dm) badges from the README as the site has been down for a while ([ccc70ac](https://github.com/sendahug/send-hug-frontend/commit/ccc70ac6c707051daf68890fd6233ff4f56c11e0)).

### 2020-09-18

#### Features

- Added checks for whether the post's menu is too wide to be displayed, in order to show/hide the menu automatically when there is/isn't enough space, respectively ([1256091](https://github.com/sendahug/send-hug-frontend/commit/12560919efb36e04f183988213349ac2d64a8fe2)).
- Added the small-viewport floating menu to the search results and to the main page ([b1c29f5](https://github.com/sendahug/send-hug-frontend/commit/b1c29f5bce774ea2e36b16b898d25b5159255d7f)).

#### Changes

- Downloaded the main font from Google Fonts and replaced the Google Fonts link with a local link ([b39e23f](https://github.com/sendahug/send-hug-frontend/commit/b39e23fbf4e6b349ee5a8bd1446e356fd18607e4)).
- Deleted the local development assets as we don't need them in the repo ([680d7f6](https://github.com/sendahug/send-hug-frontend/commit/680d7f60a39412b567be90a7cb89b5595e73e3aa) & [e35bb07](https://github.com/sendahug/send-hug-frontend/commit/e35bb078a5abc515c9eb8a0ae3c88cd8c5a90398)).

#### Fixes

- Fixed a bug that caused first post's menu to reappear randomly ([30414c8](https://github.com/sendahug/send-hug-frontend/commit/30414c8aa64343680df5933aa901ef553eff0a5a)).

#### Chores

- Updated the gulp task for copying images to copy all static assets ([bcd412d](https://github.com/sendahug/send-hug-frontend/commit/bcd412dec5ce2e0859304af45771fb3de378657f)).

### 2020-09-17

#### Features

- Added the functionality (toggling on/off) and design for the new minimised menus ([daf356c](https://github.com/sendahug/send-hug-frontend/commit/daf356c2bb48c38465c30cde21b4b84f3797eaa4) & [19773da](https://github.com/sendahug/send-hug-frontend/commit/19773da6ce62c0a8be2e829d5614c7c1d1e9614f)).

#### Changes

- Deleted the menu button from the My Posts component, which doesn't require a menu for the posts ([dccfa2b](https://github.com/sendahug/send-hug-frontend/commit/dccfa2bf67235c7ca2a2d8e3ba4a37e70b8e2e83)).
- Changed all buttons to have a minimum size of 44x44px to ensure there's enough space to click buttons, as per WCAG 2 ([3a67a1c](https://github.com/sendahug/send-hug-frontend/commit/3a67a1ca0117944862df8e12741335c71b39b7fd)).

### 2020-09-16

#### Features

- On smaller viewports, the posts' menu is now minimised and accessible via a button which opens the menu for a given post ([8ef4189](https://github.com/sendahug/send-hug-frontend/commit/8ef41893f6a31a49114fb11eb5bd141173cfd975)).

#### Fixes

- Fixed a bug where the navigation menu was hidden even when the screen is wide enough to display it ([e796923](https://github.com/sendahug/send-hug-frontend/commit/e7969230782b40859cb1e89fdc93f74d393b2031)).

### 2020-09-15

#### Changes

- Changed the menu's appearance in larger font sizes to account for the limited space available onscreen. Now, if the larger font size makes the menu too wide for the screen, the mobile navigation menu appears onscreen. This is checked upon every font size change and every window resize event. ([4b826c7](https://github.com/sendahug/send-hug-frontend/commit/4b826c7dc4d3194c13c70cbe0e90c6bb3ba186ab) & [8b03dec](https://github.com/sendahug/send-hug-frontend/commit/8b03deccad7a32ab61fcc98e2aff6b467b909340))
- Added missing `aria-hidden` attribute to hidden elements in the App Component ([3d278ec](https://github.com/sendahug/send-hug-frontend/commit/3d278ec6cf889ec16a74fdf9e1ea69b3c0a45aa5)).

#### Fixes

- Fixed a bug where the `log in` button's text wasn't updated when the user changed their selected text size ([1159530](https://github.com/sendahug/send-hug-frontend/commit/115953095e58796ed74f542a05409161708de163)).

#### Chores

- Updated various dependencies ([1ffd9e2](https://github.com/sendahug/send-hug-frontend/commit/1ffd9e24a2aa90e3e9827c79d282605cbe2d7dc3)).

### 2020-09-14

#### Features

- Added a new Sass mixin for converting pixel text sizes to rem. This allows users to change the font size throughout the site ([06022c1](https://github.com/sendahug/send-hug-frontend/commit/06022c1edca81f250f9681a4ce08e10c24806549)).
- Added the functionality for adjusting the app's font size ([1479b38](https://github.com/sendahug/send-hug-frontend/commit/1479b38150b0c99598e5746c6db235875996ece1)).

#### Changes

- Replaced all pixel text sizes throughout the app (except for Font Awesome) with rem sizes ([64500c](https://github.com/sendahug/send-hug-frontend/commit/064500ccf8cc8d06f81f51ae89e5dbb222a71588)).
- Adjusted the about page to show less than 80 characters per line, as per WCAG 2 ([81b52d4](https://github.com/sendahug/send-hug-frontend/commit/81b52d4f3d3a6e7e9092ed628ea50bef4eed8086)).

#### Fixes

- Added a container for the main and footer elements, which fixes the styling issues in smaller viewports caused by the fixed styling previously used ([e280aa0](https://github.com/sendahug/send-hug-frontend/commit/e280aa010fada406bffc559ca110e8efc5426f6c)).

### 2020-09-11

#### Features

- Added a new Text Size button to allow users to change the site's font-size ([c69ce2f](https://github.com/sendahug/send-hug-frontend/commit/c69ce2f60efea8b569f7ce5e6dbf7c9a57d405c1)).

#### Fixes

- Some of the ARIA labels in the App Component were accidentally set on the icon instead of on the containing buttons. This was fixed ([e6b847b](https://github.com/sendahug/send-hug-frontend/commit/e6b847bd4b62e8d9ccd37ceeb45b65a27efb168e)).

### 2020-09-10

#### Chores

- Updated Angular to v10.1.1 ([0fde836](https://github.com/sendahug/send-hug-frontend/commit/0fde83691c82b67db81124beed74f06cc3c450cd)).
- Updated various other dependencies ([5a84eb8](https://github.com/sendahug/send-hug-frontend/commit/5a84eb8109104f697bd6cb265a30bb111c50f0e0)).
- Updated the package-lock file to fix vulnerabilities ([103d76c](https://github.com/sendahug/send-hug-frontend/commit/103d76c018ba0cb460aea3759c5abd85d122d0e3) & [0b9363c](https://github.com/sendahug/send-hug-frontend/commit/0b9363c52c9b65500423be1f718ee768d5dabaa4)).

### 2020-09-03

#### Chores

- Fixed various tests errors ([5ea681e](https://github.com/sendahug/send-hug-frontend/commit/5ea681e80f102d66a0cc229db354cb7af64aa90c) - [66483c3](https://github.com/sendahug/send-hug-frontend/commit/66483c3ff7679f9e90577be71b1bf7a5954cd5e9) & [722aec6](https://github.com/sendahug/send-hug-frontend/commit/722aec60d78bd705d72de48bf731753b60565a5c) & [3472a3a](https://github.com/sendahug/send-hug-frontend/commit/3472a3ad55bfa5b71a2008c1b753b33cc70bb722)).
- Added codecov to handle coverage reports in CI ([223cc60](https://github.com/sendahug/send-hug-frontend/commit/223cc601eb9f8415a6b7a730dd1efa5932c57fc0) - [dc700e7](https://github.com/sendahug/send-hug-frontend/commit/dc700e7eefbef32094662364df7d65f69c636ea2)).
- Updated the GitHub Actions workflow's branches and tasks config ([029c980](https://github.com/sendahug/send-hug-frontend/commit/029c9804b1417a5946d91a63cb60c7a8d6c99d6f) & [6d22d10](https://github.com/sendahug/send-hug-frontend/commit/6d22d10e6833b66fa82084dc8d5775d2ad940318)).
- Fixed the reporters config in Karma ([759386c](https://github.com/sendahug/send-hug-frontend/commit/759386c5dfa9b650ccebfd79ddabdf849884d87d) & [c727ea6](https://github.com/sendahug/send-hug-frontend/commit/c727ea660ddd78241aa10959e29253c1972c8f39)).

#### Documentation

- Added CI-related badges to the README ([d1bcde4](https://github.com/sendahug/send-hug-frontend/commit/d1bcde476aeb7149995131c7de19303504b3b07f) & [b5868d4](https://github.com/sendahug/send-hug-frontend/commit/b5868d4b85de09c25e17b95c8620ffc236330be7)).

### 2020-09-02

#### Chores

- Updated various dev dependencies ([f30a27c](https://github.com/sendahug/send-hug-frontend/commit/f30a27cd9a3287db1f552cd5f211c74d315136f5)).
- Added gulp task to bundle the code before running tests ([530085d](https://github.com/sendahug/send-hug-frontend/commit/530085d3e75bc29f3fda33a4d910dd6b86bd00f2)).
- Adjusted Karma's config to use the pre-bundled code instead of bundling the code as well as the tests. This lowers Node's memory usage by a third or so. ([2b7bc95](https://github.com/sendahug/send-hug-frontend/commit/2b7bc9508b08e83ae1a9300c971bde62eb4e7679))

### 2020-09-01

#### Chores

- Updated the Travis and Karma config files to enable running tests in CI ([b36f5b1](https://github.com/sendahug/send-hug-frontend/commit/b36f5b1629d4c0391e3dcd0c27cbf0207e747d1f) - [ba95825](https://github.com/sendahug/send-hug-frontend/commit/ba9582570fd1783a741ebe99f5a059159f4d3037)).

### 2020-08-31

#### Features

- Added a breadcrumb to complex componnents to make navigation around the app easier for users ([ad0814a](https://github.com/sendahug/send-hug-frontend/commit/ad0814ad9080d78638b04944d692f591484388c0)).

#### Fixes

- Fixed an error in the query parameters' getter in the New Item and Full List components ([d513fc7](https://github.com/sendahug/send-hug-frontend/commit/d513fc7f0afca74bbad269804a631e05e136acda)).

#### Chores

- Added a GitHub Actions workflow to run unit tests ([7b88ae4](https://github.com/sendahug/send-hug-frontend/commit/7b88ae4aceac29f912f0c314991f4c60d7722063) - [b0b5499](https://github.com/sendahug/send-hug-frontend/commit/b0b5499573ebb528f868c72714f6d5022ac3abb0)).

#### Documentation

- Added status badges to the README ([182630b](https://github.com/sendahug/send-hug-frontend/commit/182630be3518c19c4a24b97cb1e27cea82b3f444) - [f511ac1](https://github.com/sendahug/send-hug-frontend/commit/f511ac15f83db396b2cb95dab0d5f1982a3be172)).

### 2020-08-30

#### Features

- Added a new site map component to display the list of paths in the app ([a7fda42](https://github.com/sendahug/send-hug-frontend/commit/a7fda421c27c877e2d9d7bf8de7cd721f6ff884f) - [d2f12bc](https://github.com/sendahug/send-hug-frontend/commit/d2f12bc3f37fd042c43fe07f92d410f803099a7e)).

#### Changes

- Replaced the Font Awesome script kit and its icons with the Font Awesome Angular module and its icons ([933dae8](https://github.com/sendahug/send-hug-frontend/commit/933dae813ee60c5df884a9f4d45b6e2d0f320267) - [c4c69b7](https://github.com/sendahug/send-hug-frontend/commit/c4c69b7bad21e34fb3b90f3e8c1cfa7c143d0e77)).

#### Fixes

- Fixed a bug where posts fetch upon signup resulted in an error ([ba256f5](https://github.com/sendahug/send-hug-frontend/commit/ba256f590511d0f6cb37403d540780e6877726d1)).
- Fixed a bug that caused the ServiceWorker alert to appear upon the first visit to the site ([80ea96b](https://github.com/sendahug/send-hug-frontend/commit/80ea96b3187a88dcd4b90bdc20c486b323ba80a1)).

#### Chores

- Updated the version of Node used in CI ([1b772dd](https://github.com/sendahug/send-hug-frontend/commit/1b772ddf9f9e7f9cc10a638e4185154c9b2f5d79)).

### 2020-08-29

#### Features

- Added Font Awesome's Angular module as an import ([86c4981](https://github.com/sendahug/send-hug-frontend/commit/86c49817c5ba489ca4981d71a6c58387941d7e49) & [c7da9ca](https://github.com/sendahug/send-hug-frontend/commit/c7da9caf7a6d07305b88b50cf116cc8a9e45e2ea)).

#### Chores

- Added and fixed more tests ([a546314](https://github.com/sendahug/send-hug-frontend/commit/a5463140656780ba9ff98051689694f3445b078f) & [3d1839b](https://github.com/sendahug/send-hug-frontend/commit/3d1839b90a55c79e2999ade42e5e6c801b7d650d)).
- Added the license to the services and the mock services ([cad8252](https://github.com/sendahug/send-hug-frontend/commit/cad82525278b72a8784a73566934fe5762f93cb1)).

### 2020-08-28

#### Chores

- Switched Karma back to use Chrome Headless instead of Chrome ([3257dc5](https://github.com/sendahug/send-hug-frontend/commit/3257dc5e74e5b2fc0f800ec1e08318356db32783) - [e4147d9](https://github.com/sendahug/send-hug-frontend/commit/e4147d905e978b8ff5ef89ae4dd4a37b8149cd33)).
- Added AuthService tests and fixed some Popup tests ([aa7e96f](https://github.com/sendahug/send-hug-frontend/commit/aa7e96fca6b616cf202f89a7888b7a22ae77c933) & [d53c5e3](https://github.com/sendahug/send-hug-frontend/commit/d53c5e3a9fd464aff7bfc3d7958bf78fe0696b35)).

### 2020-08-27

#### Chores

- Updated Angular to v10.0.14 ([30b19dd](https://github.com/sendahug/send-hug-frontend/commit/30b19dd244a3f346e44234746df985a85f230ff4)).
- Updated various other dependencies ([0140e54](https://github.com/sendahug/send-hug-frontend/commit/0140e54c37e8898a954b729b08b3510bf20d6b7f)).
- Updated the Karma configuration to include the flags needed to run Chrome in CI ([3daf9a4](https://github.com/sendahug/send-hug-frontend/commit/3daf9a4a51550e7160397bd3da7a15c8d34d89ea)).

### 2020-08-25

#### Changes

- Renamed the home icon's file to match the other icons' files ([43f74d3](https://github.com/sendahug/send-hug-frontend/commit/43f74d3b7818a00ea22329a09235a2ba0da985ae)).

### 2020-08-20

#### Chores

- Added missing flags to Chrome in the Karma config ([6aba0d0](https://github.com/sendahug/send-hug-frontend/commit/6aba0d0cc91ef7fbf7cbb299b5fb6399622ab33e)).
- Switched Chrome back to 'stable' from beta in CI ([4296ed5](https://github.com/sendahug/send-hug-frontend/commit/4296ed5327fa7b6789f1a1cd5412c3d8063a15c9)).

### 2020-08-19

#### Chores

- Set up Chrome in the Travis CI config ([957a78f](https://github.com/sendahug/send-hug-frontend/commit/957a78fe0994574e78f494d5f5117aee3819bdf4) - [6c83a6e](https://github.com/sendahug/send-hug-frontend/commit/6c83a6e42e676a2ae9d4604b8497006c7de6fd73)).

### 2020-08-18

#### Chores

- Added config file for running tests in CircleCI ([6f0c99b](https://github.com/sendahug/send-hug-frontend/commit/6f0c99b645acf04e72f323ed1c7d0e381adf2f9c) - [cbcb15e](https://github.com/sendahug/send-hug-frontend/commit/cbcb15ea33c11df07ee4bdaf40ba9b2f76e025d9)).
- Replaced the Circle CI config file with a Travis CI config ([977302b](https://github.com/sendahug/send-hug-frontend/commit/977302b5ea37d5c261c4afabe4cc89a0cdbb6049) & [34cdf50](https://github.com/sendahug/send-hug-frontend/commit/34cdf501265346a8bcf6e11416658a091e334bb4)).

### 2020-08-17

#### Features

- Added a link from the user profile to the settings page ([b6e67d5](https://github.com/sendahug/send-hug-frontend/commit/b6e67d5a2ad6943ccfc632afc076a929c77145ec)).

#### Fixes

- Fixed the link back to the home page from the settings page ([3aa38c2](https://github.com/sendahug/send-hug-frontend/commit/3aa38c24362669c16f7d91952b1a4080079eb438)).
- Fixed the display of the posts element in user profiles ([84c5dd3](https://github.com/sendahug/send-hug-frontend/commit/84c5dd36a1d57a9c80c5d0e7cc13542fbf7d7b61)).
- Fixed the mobile site navigation menu ([623105d](https://github.com/sendahug/send-hug-frontend/commit/623105d382329d4c5b96ec295f18cceae01f2de3)).

#### Chores

- Fixed errors in a number of tests ([6a1e885](https://github.com/sendahug/send-hug-frontend/commit/6a1e885bb509bc1d853eb99f54c908eca4fe63b2) & [1b4cb8c](https://github.com/sendahug/send-hug-frontend/commit/1b4cb8c90af4d1ade31e134702ca5b836a045874)).

### 2020-08-16

#### Chores

- Added a license file ([cf87ef5](https://github.com/sendahug/send-hug-frontend/commit/cf87ef560b761c82bde57dba02e70d06dd7f1915)).
- Added the license to most of the TypeScript files in the app ([fad51db](https://github.com/sendahug/send-hug-frontend/commit/fad51db7b844ec1a182325655d1921d60d5cf020) & [bc6c766](https://github.com/sendahug/send-hug-frontend/commit/bc6c7668bf2877ab9262f10e951913b8b8f799b4)).

### 2020-08-15

#### Chores

- Added further tests and fixed issues in existing ones ([6f001c5](https://github.com/sendahug/send-hug-frontend/commit/6f001c55327ccad852c036780943d98c8cf6cf80) - [920e7ea](https://github.com/sendahug/send-hug-frontend/commit/920e7ea8b9e2998772f15941bcaca9182a22bdb3)).

### 2020-08-14

#### Changes

- Added missing push status (which specifies whether to send push notifications) to the notifications service ([4620f65](https://github.com/sendahug/send-hug-frontend/commit/4620f65ffabb15538097c5d071c2e1021f381fd7)).

#### Chores

- Added more tests ([51b29fb](https://github.com/sendahug/send-hug-frontend/commit/51b29fb572616162d7f86f8613b6b1905f298e41) - [02f1a1c](https://github.com/sendahug/send-hug-frontend/commit/02f1a1c44d47072331564bf55229d70559244b8d)).

### 2020-08-13

#### Chores

- Added more tests ([f11ea75](https://github.com/sendahug/send-hug-frontend/commit/f11ea75e1b892f33a3c420afd4fa7991b6fa713e) & [2cd2ffe](https://github.com/sendahug/send-hug-frontend/commit/2cd2ffe78b9dc4ba39fb963293177984c4f577f5)).

#### Documentation

- Cleaned up and updated the README ([e00ce99](https://github.com/sendahug/send-hug-frontend/commit/e00ce999776d862327c599ed80cd87f2e3d23201) & [81a4713](https://github.com/sendahug/send-hug-frontend/commit/81a471349a2b5c79c8c10e36b7e3e3a585c11ea8)).

### 2020-08-12

#### Fixes

- Fixed a bug where the report form set the report reason incorrectly due to the radio buttons returning a string value instead of a number ([886879c](https://github.com/sendahug/send-hug-frontend/commit/886879cecb402d39236a4f0953a91f6be65974be)).

#### Chores

- Added further tests and fixed errors in existing ones ([4fa770f](https://github.com/sendahug/send-hug-frontend/commit/4fa770fcc34d998974bb4a980a8f90ddb01c1cbd) - [6ef957c](https://github.com/sendahug/send-hug-frontend/commit/6ef957c0478cca8ce6f322de1426c0a7536aca6c)).

### 2020-08-11

#### Changes

- Changed the way the template checks for user/post search results to use the length of the results arrays instead of using a separate length variable ([27a50d5](https://github.com/sendahug/send-hug-frontend/commit/27a50d55e6809e048547ed4babe3e0b51201b1bd)).

#### Fixes

- Fixed a bug where navigating between different pages in the search results failed due to incorrect parameter configuration in the router's `navigate` call ([21781a3](https://github.com/sendahug/send-hug-frontend/commit/21781a37e4908a999dbe36399b2f2e70020c8b68)).

#### Chores

- Added further tests and fixed errors in existing ones ([19d273e](https://github.com/sendahug/send-hug-frontend/commit/19d273efbaddc349c05b6bb69d3077f83a35716f) - [911cc81](https://github.com/sendahug/send-hug-frontend/commit/911cc81b9c957221d6463e4afba8ab528b33a432))

### 2020-08-10

#### Fixes

- Fixed a bug in the search results component where sending a hug failed because the method tried to access the wrong property to fetch the post's data ([a4c2cb1](https://github.com/sendahug/send-hug-frontend/commit/a4c2cb1f0e3257e63109ae8f478ec2016c5f5920)).

#### Chores

- Added more unit tests ([759a9a2](https://github.com/sendahug/send-hug-frontend/commit/759a9a28a0036e156601d960329c8adcd2f45c04) - [c6c9e06](https://github.com/sendahug/send-hug-frontend/commit/c6c9e062a49326d46bac6666a4abaacfddd7ff21)).
- Gulp's `watch` task no longer triggers the code bundling when changes are made to spec and mock files ([0286f51](https://github.com/sendahug/send-hug-frontend/commit/0286f5132b4647070138976ef3bcd1a2bbb21805)).

### 2020-08-09

#### Fixes

- Added checks to prevent the loader and header message from subscribing to the same BehaviourSubject multiple times ([ff44c46](https://github.com/sendahug/send-hug-frontend/commit/ff44c468fb169d4262aba263aefe0da77b8baefe) & [f2ae5a5](https://github.com/sendahug/send-hug-frontend/commit/f2ae5a59b52673fb1106079d25e0d574075f5011)).
- Added missing call to `unsubscribe` to ensure the loader doesn't keep a no-longer-needed subscription active ([664399d](https://github.com/sendahug/send-hug-frontend/commit/664399d25de667348d7f0ab2a51230d36ef3eff6)).

#### Chores

- Added further unit tests and updated test data ([2b6534e](https://github.com/sendahug/send-hug-frontend/commit/2b6534e4ae405a912fac34acc51bbab59fddffc3) - [40f7954](https://github.com/sendahug/send-hug-frontend/commit/40f79540810972f8f108f1a1791e3ce811aab71e)).
- Added a gulp task to compile the project for local development ([28085d1](https://github.com/sendahug/send-hug-frontend/commit/28085d1074c15d6d6f2c8dc6baa88042bf5a9a55)).

#### Documentation

- Updated the README with details about running tests ([4633d1d](https://github.com/sendahug/send-hug-frontend/commit/4633d1dba5adefc3b96de485b0118ea6176ded49)).

### 2020-08-08

#### Features

- Added a check to prevent logged-out users from writing posts ([e98299e](https://github.com/sendahug/send-hug-frontend/commit/e98299ec6eec917fa54f3ab63d1c46148bfb05f6)).
- Added a check to prevent logged-out users from sending messages ([52369ea](https://github.com/sendahug/send-hug-frontend/commit/52369ea056b9fe24139fa3b31a38467d1c152e2c)).
- Added an error message if there's no user ID for writing a new message ([00c744a](https://github.com/sendahug/send-hug-frontend/commit/00c744a1edb04b72cf5a26d31cf3857b8bf021e4)).

#### Chores

- Added further unit tests, updated some tests' data and fixed errors in some tests ([e643126](https://github.com/sendahug/send-hug-frontend/commit/e64312696ef29d67a2158fa1270acb414c5c5400) - [bbc07b3](https://github.com/sendahug/send-hug-frontend/commit/bbc07b36b4b887296356fd3479420bd582892244)).

### 2020-08-07

#### Fixes

- Fixed a bug where the notifications' refresh rate wasn't updated due to the text field returning a string instead of a number ([46acab3](https://github.com/sendahug/send-hug-frontend/commit/46acab35dd80b4ca8165b56128e0e7d4e0b35bbd)).

#### Chores

- Added further unit tests ([46e22e0](https://github.com/sendahug/send-hug-frontend/commit/46e22e05ef720755ef6a8826b48ad8afd7f78b9e) - [0c2feb8](https://github.com/sendahug/send-hug-frontend/commit/0c2feb832a9fd1864c1135a13c2f577371222431)).

### 2020-08-06

#### Changes

- The settings view now updates the Auth service's user data when the refresh rate is changed in the notifications form ([152c2db](https://github.com/sendahug/send-hug-frontend/commit/152c2db418a6bd057f7f0691f6d9f6caf5f130a6)).

#### Fixes

- Fixed a bug where the notifications tab attempted to call `focus` on an element that doesn't exist due to a missing check for element existence ([6c30f54](https://github.com/sendahug/send-hug-frontend/commit/6c30f5437be9e4435afe93d51a3bcaf57bfea575)).
- Added a missing dependency injection to the settings view ([6336bc5](https://github.com/sendahug/send-hug-frontend/commit/6336bc59250ba61e0683f5fefcd80a588defc828)).

#### Chores

- Added further tests and added missing properties and methods to the mocks ([4a80b23](https://github.com/sendahug/send-hug-frontend/commit/4a80b23ea423bc3f4e976d7855a24d421c084ee3) - [a1fd0a3](https://github.com/sendahug/send-hug-frontend/commit/a1fd0a3f88ae4d7687e583adb0bea13afad37fe4)).

### 2020-08-05

#### Fixes

- Fixed a bug where the popup attempted to call `focus` on an element that doesn't exist due to a missing check for element existence ((db86211)[https://github.com/sendahug/send-hug-frontend/commit/db8621159716ab9b6efd6460cbdc21fb012251d1]).
- Added a default `page` value for the full list component. This fixes a bug where the page was blank and showed an error due to a missing `page` value in the URL ([8825a70](https://github.com/sendahug/send-hug-frontend/commit/8825a705b822f9818e4f499f31e1b757e6408b8d)).

#### Chores

- Added further unit tests and fixed errors and bugs in existing tests ([d7db291](https://github.com/sendahug/send-hug-frontend/commit/d7db2910ce9010a8cefe39f0d14a7d7c9aa1065d) - [1de6a8a](https://github.com/sendahug/send-hug-frontend/commit/1de6a8ab774d1e131c381cb182d2a1833d5aa252)). This includes:
  - Added new unit tests.
  - Added another mock service and replaced all real services with mocks.

### 2020-08-04

#### Chores

- Added a mock Service Worker Manager service to use in tests ([2d97c9e](https://github.com/sendahug/send-hug-frontend/commit/2d97c9efbf498b23c7ad60222e69991790e04031)).

### 2020-08-03

#### Chores

- Added a missing import to the Main Page's tests ([65b3779](https://github.com/sendahug/send-hug-frontend/commit/65b3779996bed8eab8b31c2844ddafe4afba84d5)).
- Added mock services to replace the actual services in tests with ([95dd207](https://github.com/sendahug/send-hug-frontend/commit/95dd2071e3b2590b8e92bdc01d0663471b99b83c) - [6908f5e](https://github.com/sendahug/send-hug-frontend/commit/6908f5e0fd8f4ad868c0248cf583bf3e725e8a1f)).

### 2020-08-02

#### Chores

- Added tests for the Main Page component ([ed06162](https://github.com/sendahug/send-hug-frontend/commit/ed06162e720776bdb79d3bf6de28fa35125c8065)).
- Fixed errors in unit tests, including the removal of `fakeAsync` from specs, the removal of duplicate imports, and an updated specs file test ([9c4dd40](https://github.com/sendahug/send-hug-frontend/commit/9c4dd402d0ecc58a54e11f064ba86faab4dba3e2) & [7b26e26](https://github.com/sendahug/send-hug-frontend/commit/7b26e26fd0085b20eb11980849c77491f34c0bd2)).

### 2020-08-01

#### Chores

- Updated Angular and various other dependencies ([df03a3c](https://github.com/sendahug/send-hug-frontend/commit/df03a3cabad15d35d68c7369907849e128667690)).
- Replaced Puppeteer with Chrome in unit tests ([be3a4f4](https://github.com/sendahug/send-hug-frontend/commit/be3a4f422435a58bd5a86d9049f7dd1a0df860a0)).
- Added initial tests for App Component ([795ab85](https://github.com/sendahug/send-hug-frontend/commit/795ab8540b35b39bcf6ae104f7913fcf04cccb72)).

### 2020-07-31

#### Chores

- Added missing modules to the App Component tests ([77816b1](https://github.com/sendahug/send-hug-frontend/commit/77816b1933511e596ffeff7344ba335f5f0775ef)).

### 2020-07-30

#### Chores

- Updated the package-lock to resolve security vulnerabilities ([f3a7a51](https://github.com/sendahug/send-hug-frontend/commit/f3a7a51692d43bb0a1fd205b9466d204084421c5)).
- Replaced Chrome with Puppeteer in unit tests ([b3c2361](https://github.com/sendahug/send-hug-frontend/commit/b3c2361bef9bd32008d5eed7451e2a66463dbb7e)).

### 2020-07-29

#### Chores

- Set up the unit tests framework for the app, using Karma, Jasmine and Webpack for running tests, and added an initial tests file for the App Component ([34b5f78](https://github.com/sendahug/send-hug-frontend/commit/34b5f78623e792e2d846684d030b6b6a17880d3f) - [0f2fbce](https://github.com/sendahug/send-hug-frontend/commit/0f2fbce0cbdef345315df62ef52cc1c8c9e2b4c3)).

### 2020-07-24

#### Features

- Added a new settings page to allow users to update their notification settings ([d3b329d](https://github.com/sendahug/send-hug-frontend/commit/d3b329d485c0897559793b7b79b6517e14f60052) - [21b268e](https://github.com/sendahug/send-hug-frontend/commit/21b268e5a4cf76880243bf68e6e171ec8d903226)).

#### Documentation

- Added the new settings page to the README's list of components ([2661579](https://github.com/sendahug/send-hug-frontend/commit/2661579663fe07d0e3a67f247afa38d73eed182d)).

### 2020-07-22

#### Changes

- Replaced the font-awesome script with the kit script ([b444fb1](https://github.com/sendahug/send-hug-frontend/commit/b444fb1aa7553bf2bc18b86473de8003b23b74df)).
- Changed the post's hug-sending mechanism to prevent users who already sent a hug from sending another hug for it. This includes a check for whether the current user is in the "sent hugs" array and a design for the disabled "send a hug" button (if the user already sent hugs). ([927326a](https://github.com/sendahug/send-hug-frontend/commit/927326af385f5c5dfcce21e9397c0eec26bb68e1) - [60b0f6b](https://github.com/sendahug/send-hug-frontend/commit/60b0f6b7c0564e9f45e5e922e433cbaa0adaf7b7))

### 2020-07-21

#### Changes

- Added an array containing the IDs of users who sent hugs on a post to the Post interface ([9536ce0](https://github.com/sendahug/send-hug-frontend/commit/9536ce0bfdd4ebf6b941bfc33c288a6b3a882c12)).

### 2020-07-19

#### Features

- Added handling for min and max length in inputs, including setting the length in the text fields themselves, designs for text fields that have an error, and alerts for when the data length is wrong ([ab17ab3](https://github.com/sendahug/send-hug-frontend/commit/ab17ab370ea7cba61436ea234beda61793d05e03) - [374ee80](https://github.com/sendahug/send-hug-frontend/commit/374ee8007b93885b4fd1cc63817a16d6b8992889)).

#### Fixes

- The popup now remains on if the user's request returned a validation error. This fixes a bug where users couldn't fix the validation error because the popup disappeared upon getting a response, even if the response wasn't successful ([7a14314](https://github.com/sendahug/send-hug-frontend/commit/7a14314fdaaf6ea81beab633f202a4a471d41b9e)).

### 2020-07-18

#### Chores

- Updated Angular and various other dependencies ([5786352](https://github.com/sendahug/send-hug-frontend/commit/5786352a939b71064ca3ac25b02b7a0d0df9a7e7)).

### 2020-07-15

#### Features

- Improved the app's accessibility ([b279e3c](https://github.com/sendahug/send-hug-frontend/commit/b279e3cc9efdca53063457c48d9c528898acd857) - [46f41e3](https://github.com/sendahug/send-hug-frontend/commit/46f41e35edc21fbe2f3bd5a358f6848793f59e4f)). This includes:
  - Moved related fields to fieldsets.
  - Improved buttons' accessible names,
  - Changed the links' colours and hover behaviour.
  - Improved ARIA labels.

#### Changes

- Improved the design of the search results when there are no results ([8ebdc4e](https://github.com/sendahug/send-hug-frontend/commit/8ebdc4ea971631d59c65d5ced5f93f6198e131a0)).

### 2020-07-14

#### Features

- Final part of the site's design update ([a99f184](https://github.com/sendahug/send-hug-frontend/commit/a99f18401b7461e5e9f65c0a8cda52dd6eddd71b) - [a4b9e2a](https://github.com/sendahug/send-hug-frontend/commit/a4b9e2a7f401ef5ca3520c3c0dc362941acc0391)). This includes:
  - Responsive design for the admin dashboard.
  - Added the logo to the push notifications sent by the back-end.
  - Turned the logo to a vector graphic.
  - Added the new icons to the ServiceWorker's cache.
- Made further accessibility improvements, including colour contrast improvement in all links and the addition of more ARIA labels. ([42ef5a5](https://github.com/sendahug/send-hug-frontend/commit/42ef5a58ec1813b2bde988283cc4e1c96ecb0e97) - [c71d7dd](https://github.com/sendahug/send-hug-frontend/commit/c71d7dd3675e75fed24acd18512c4028f57ff82c))

#### Changes

- The admin dashboard's page titles are now hidden while the fetch is in progress. They're only shown while the fetch has resolved ([222fb3a](https://github.com/sendahug/send-hug-frontend/commit/222fb3aa4012645bd166f0189af9daf1dd78ade2)).

#### Fixes

- Added a missing `rel` attribute to all external links to fix a safety issue around cross-origin links ([30a2ebee](https://github.com/sendahug/send-hug-frontend/commit/30a2ebeeabe8f89ece4d4b525bbd3880b9fbc386)).

### 2020-07-13

#### Features

- Continued updating the site's design to the new one ([3f8acb1](https://github.com/sendahug/send-hug-frontend/commit/3f8acb17a3c2677ac23c05b6e94cb3a20e861d25) - [4062aea](https://github.com/sendahug/send-hug-frontend/commit/4062aea7025b848b120b356aa0fdac5205c7edb2)). This includes:
  - Added responsive design for various other components.
  - Added an exit button to the search form.
  - The navigation menu is now hidden when the search or the notifications tab are opened in smaller viewports, which don't allow both to be open.
  - Added hover and active adjustments to the navigation links

### 2020-07-12

#### Features

- Continued updating the site's design to the new one ([d17a221](https://github.com/sendahug/send-hug-frontend/commit/d17a2218f262a859b5753e4e8784cbb144b9dec6) - [d8e1b89](https://github.com/sendahug/send-hug-frontend/commit/d8e1b894166467651862e9fc3f38034f74cc1f74)). This includes:
  - Changed the main font used by the site.
  - Changed the design of the rest of the components.
  - Added responsive styling for various components.
  - Added credit and a link to the designer's social media account.

#### Changes

- All outgoing links now open in a new tab instead of in the current tab ([24ea8d3](https://github.com/sendahug/send-hug-frontend/commit/24ea8d38afb9982a3b90810e641af84ebca954b0)).

#### Fixes

- Added a missing check to ensure the "reply" button is only shown in the inbox mailbox, rather than in the outbox ([e0ccf87](https://github.com/sendahug/send-hug-frontend/commit/e0ccf8763ce752e9a030dd9acc656ae187efd676)).

#### Chores

- Updated Angular and various other dependencies ([75353ed](https://github.com/sendahug/send-hug-frontend/commit/75353ed4f1a84481bf0ca7915819536aabe22793)).

### 2020-07-11

#### Features

- Started replacing the site's previous design with the new one, designed by [Macy Tyler](https://instagram.com/alphamacy). This includes:
  - Updated the colour palette ([3b6a3e1](https://github.com/sendahug/send-hug-frontend/commit/3b6a3e1004521500d286ad7b46980bd9acfc4fd0)).
  - Updated the navigation menu's design ([9534e4b](https://github.com/sendahug/send-hug-frontend/commit/9534e4b9ea6b1f361dd806747aaa63ac5cb86f75) & [3f67759](https://github.com/sendahug/send-hug-frontend/commit/3f6775922d00b3e0a54d9859d64dda486da38d46)).
  - Updated the item list's design ([4e0f366](https://github.com/sendahug/send-hug-frontend/commit/4e0f366e82807c062465235c64aed47b5393a239)).
  - Updated the post's design ([a8c1e6d](https://github.com/sendahug/send-hug-frontend/commit/a8c1e6d02f02a0b8bcaad691e97da50562d58149) & [a0a1db3](https://github.com/sendahug/send-hug-frontend/commit/a0a1db3d2885fd0d7a1feabdbb4c4456b5f95ca5)).
- Added a way to toggle the search form on and off ([3cc4649](https://github.com/sendahug/send-hug-frontend/commit/3cc4649585a4e772b78317db63689cd4576785a1)).

### 2020-07-09

#### Features

- Added a "push" event listener to the ServiceWorker to enable displaying push notifications ([d0ca9b8](https://github.com/sendahug/send-hug-frontend/commit/d0ca9b886207bbe27290761afbf99132eac868f6)).
- Added a badge to the notifications buttons to display the number of unread notifications to the user ([dd80136](https://github.com/sendahug/send-hug-frontend/commit/dd80136dfc78a98a7c7a113db95b93dd64c4b027)).
- Notifications settings now persist in localStorage ([2d607c4](https://github.com/sendahug/send-hug-frontend/commit/2d607c4c3d551e1efe71924e90b5a9f99dd16462)).
- The user's settings are now also saved in the back-end to ensure persistence across devices ([9fcd004](https://github.com/sendahug/send-hug-frontend/commit/9fcd004ad8d7be0f953164a61dace129722153ac)).

#### Fixes

- Added a missing check to ensure the app doesn't try to auto-refresh notifications when the user's not logged in, which raised an error by the back-end ([f2e255f](https://github.com/sendahug/send-hug-frontend/commit/f2e255fe81326535d30e32a68e28c569bba256d5)).

### 2020-07-08

#### Features

- Added the ability to toggle push notifications ([d7f2655](https://github.com/sendahug/send-hug-frontend/commit/d7f265567187d65944ea3fa2fab4d108930ec78f)).
- Added the ability to refresh notifications in the background ([7a7742c](https://github.com/sendahug/send-hug-frontend/commit/7a7742c9447fe03d71bf2140b97d18b84155b24a) & [4d63243](https://github.com/sendahug/send-hug-frontend/commit/4d63243a97590a61974d19861d399759ec1b15c5) & [ad5942f](https://github.com/sendahug/send-hug-frontend/commit/ad5942f6ad8e9a49b43c25f26e5481e4b7eff14e))
- Added the ability to unsubscribe from push notifications ([0fb2983](https://github.com/sendahug/send-hug-frontend/commit/0fb298351d4501459329c9fc540c4084af6bec6d)).
- Added a check for whether push notifications are supported by the browser before attempting to create a push subscription ([8b8a8f7](https://github.com/sendahug/send-hug-frontend/commit/8b8a8f7b10d86e74194863b25d85fa7674bf38f1)).

#### Changes

- Updated the ServiceWorker to save the details of the user's PushSubscription ([f742ea0](https://github.com/sendahug/send-hug-frontend/commit/f742ea0be57a20d979168d92ebd75065aff1a94b)).

#### Fixes

- Fixed a bug where the loader animation didn't work when the loader's HTML was served from cache ([216163e](https://github.com/sendahug/send-hug-frontend/commit/216163e305e7d6afde778c07d8f1e5b9e7fd3709)).

### 2020-07-07

#### Features

- Added a new component to display user notifications ([1911e4f](https://github.com/sendahug/send-hug-frontend/commit/1911e4f94692ae372927b2a13fa0ccf5624c43fb) - [b603424](https://github.com/sendahug/send-hug-frontend/commit/b603424595ecb8c118673af6d62c2383f3db64bb)).
- Added a new service for fetching and handling user notifications, including push notifications ([fe89f5c](https://github.com/sendahug/send-hug-frontend/commit/fe89f5ca81a0b543eeae5b41ec37a2c499177782) & [a9818c6](https://github.com/sendahug/send-hug-frontend/commit/a9818c6e45cf1a500a6f97ec04e7f5a26ce94a74)).

### 2020-07-06

#### Features

- Improved the Admin Dashboard's accessibility by adding ARIA roles and descriptions ([0ff4bf1](https://github.com/sendahug/send-hug-frontend/commit/0ff4bf163d82a58b1826cfef70f4ff4f9fd124e0)).
- Added accessible names to buttons and links across the app ([2920174](https://github.com/sendahug/send-hug-frontend/commit/292017461dd7688a99cfb24666f2ede41d6d82bc)).
- Added checks to ensure form fields aren't blank when submitting the forms ([0038c05](https://github.com/sendahug/send-hug-frontend/commit/0038c05f47aa4340c3e5c07039dedcc2f3c14985)).

#### Changes

- The report form's "other" text field is now disabled when the user selected any other reason for reporting ([4201f2e](https://github.com/sendahug/send-hug-frontend/commit/4201f2ebdd78f0cebecbfbb6322f509950a2570e)).
- The report form's "other" text field is now required if the user selected "other" as the report reason ([10ae138](https://github.com/sendahug/send-hug-frontend/commit/10ae13839ee61ec843aa98a616390ef473412379)).

#### Fixes

- Fixed a bug where the popup showed both the edit form and the report form at once ([11461eb](https://github.com/sendahug/send-hug-frontend/commit/11461eb8e42eb8c47fece9428d7460aa7452d086)).

### 2020-07-05

#### Features

- The Popup component now traps keyboard focus within it, and when the popup is closed, the focus is automatically moved back to where the user was ([0c942f3](https://github.com/sendahug/send-hug-frontend/commit/0c942f3b21b0e040de03d693f04cae53a218532e) & [0e636ff](https://github.com/sendahug/send-hug-frontend/commit/0e636ff38aff38963ec10ebf5cb611bf7b5dd880))

#### Changes

- Disabled the the horizontal scrollbar in the main app to ensure the off-screen aria-labels remain off-screen ([](https://github.com/sendahug/send-hug-frontend/commit/b91a2e98a74074280007452582fdbe9898f728f7)).

### 2020-07-04

#### Features

- Added the language attribute to the app's main HTML ([a43afb2](https://github.com/sendahug/send-hug-frontend/commit/a43afb2f163e30be25309e1ca246ad932bf9bbc4)).

#### Fixes

- Re-added the alerts container to the HTML, as it was accidentally deleted ([4669c1d](https://github.com/sendahug/send-hug-frontend/commit/4669c1dd0769e05de1c868e1d6665800e5346b05)).

### 2020-07-03

#### Features

- Improved various aspects of the accessibility of the app ([aa14bdd](https://github.com/sendahug/send-hug-frontend/commit/aa14bdd12160af323fb2407dc8819537177d0298) - [ff4be59](https://github.com/sendahug/send-hug-frontend/commit/ff4be59541bcd6815148b2bee2e90eb20c14e693)). This includes:
  - Roles, aria-descriptions and aria-labels in various components.
  - Replaced generic elements (like `div`) with the correct semantic elements (like `ul`).

### 2020-07-02

#### Features

- Added a skip link so that people relying on keyboard navigation can skip the menu and get to the main content easily ([5424c43](https://github.com/sendahug/send-hug-frontend/commit/5424c4381f64d88f2d141ca5bfc115b51b669f24)).

### 2020-07-01

#### Features

- Added the functionality for clearing the IndexedDB database when a certain threshold of items is reached. This is done to ensure we don't keep too many items stored locally at once ([69bcfa8](https://github.com/sendahug/send-hug-frontend/commit/69bcfa80ff4592bd4f9509d71181ad7b222526cc)).

#### Changes

- Previously, upon fetching from IDB the isIDBResolved variable would turn to true and thus allow the relevant component to appear. This introduced an issue when IDB did not have the requested data. Now, isIDBResolved turns true only if the data exists, and if it does not, once the data is fetched from the server ([9fb9a4f](https://github.com/sendahug/send-hug-frontend/commit/9fb9a4f6b20ef5bdcdc484e1d03b9385784918b8)).
- Moved the "offline" alert from the header message component to the main app component ([7846f2a](https://github.com/sendahug/send-hug-frontend/commit/7846f2ac0a58c74bd939dfce682e4ab3beb316ce)).
- All services now check for whether the user is offline during the fetch. If the user is offline, they trigger the offline alert ([8a3c515](https://github.com/sendahug/send-hug-frontend/commit/8a3c5150f2758ecf990c0149cb004d8c3ced3309)).

#### Fixes

- Fixed a bug where the "fetching from the server" header message showed indefinitely ([3b75bc9](https://github.com/sendahug/send-hug-frontend/commit/3b75bc9fbca06035618842ea9832f50c7b8a1b35)).
- Fixed a bug where the header message itself remained onscreen indefinitely ([10647e2](https://github.com/sendahug/send-hug-frontend/commit/10647e2ee50f3fa66bf82692421aa673a7e2108f)).

### 2020-06-30

#### Changes

- Previously, the loader disappeared as soon as a request for data (from IDB) was resolved, even if it returned no data. Now, the loader is only turned off if that request returns data ([d696a61](https://github.com/sendahug/send-hug-frontend/commit/d696a61e8b76930cb6a04ec89ab4eebb740a66ad)).

#### Fixes

- Fixed a bug where an attempt to access the IDB database when it didn't exist threw an error. Now, the app checks the database exists before trying to access it ([29e2381](https://github.com/sendahug/send-hug-frontend/commit/29e2381f4a2aaf987337a6ea4759e73d57a4c3ce)).
- Fixed a bug where the user's display name didn't show when showing posts fetched from IDB ([98ee61c](https://github.com/sendahug/send-hug-frontend/commit/98ee61c9002ec3cc928562f80c7356b6b1e7de1a)).

### 2020-06-28

#### Features

- Added data caching for data coming from the back-end (posts, users and messages). This includes:
  - Added an IndexedDB database to store the data in ([01cd7b1](https://github.com/sendahug/send-hug-frontend/commit/01cd7b125b57f4a1e641a021d12dcddf4ce2c456)).
  - Added a caching step in the posts', users' and messages' fetches ([11e748b](https://github.com/sendahug/send-hug-frontend/commit/11e748b8850eb2e1a0085571a8404e9d3ba4f75a) & [b4f786f](https://github.com/sendahug/send-hug-frontend/commit/b4f786f7b3d714bcb1829e316fae58ffc393ac60)).
  - Methods for querying IndexedDB for messages and users ([7c56f4b](https://github.com/sendahug/send-hug-frontend/commit/7c56f4b55a606d3ce317df95e4f2cacaca74fbf1)).
  - Support for fetching posts from IndexedDB ([10439b8](https://github.com/sendahug/send-hug-frontend/commit/10439b87448ea55cfe1028e8df7b7ce1609df6d1)).
  - Updated all fetches to first fetch from IndexedDB to ensure there's data to view while the updated data is being fetched from the back-end ([779f3ce](https://github.com/sendahug/send-hug-frontend/commit/779f3ce2a4c3f9357b0ef4b556881b789631f1db)).
  - Added a new header message to display when fetching data from the back-end. This allows showing the main loader up until data is fetched from IDB so that users can interact with the app, whilst still letting them know that "fresher" data is being fetched ([125d278](https://github.com/sendahug/send-hug-frontend/commit/125d278e9e036b82f533224326055b3c52e47226)).

#### Changes

- Changed the ServiceWorker to return a "user is offline" error when the user is offline ([2aaa758](https://github.com/sendahug/send-hug-frontend/commit/2aaa758174d18d7e48552d5a691d789b2f7fdebf)).
- Previously, when a fetch failed due to the user being offline, the alerts service created an alert telling them what the error was. Now, the service doesn't throw an error, but shows a header message letting users know they're offline instead ([c277b3e](https://github.com/sendahug/send-hug-frontend/commit/c277b3e59348e7e2a7f33629671f3b44edbd0354)).

#### Chores

- Added a build step to update the ServiceWorker's cache upon when building for production ([c72e355](https://github.com/sendahug/send-hug-frontend/commit/c72e355d1f3b7a2c3326c4e3ce11a1bc38d544af)).
- Updated non-major dependencies ([50be09e](https://github.com/sendahug/send-hug-frontend/commit/50be09eb913e295db8db1121ea8d404dadb1d860)).
- Updated major dependencies ([0230813](https://github.com/sendahug/send-hug-frontend/commit/023081373bf699540ac20e6ceb1c50dbb18724e5))

### 2020-06-27

#### Features

- Added an initial ServiceWorker. This includes:
  - A ServiceWorker with handling for install and fetch events ([c766e24](https://github.com/sendahug/send-hug-frontend/commit/c766e24659052e29eb01a97809529a5bfb21e78e)).
  - Added the request headers to the fetch requests ([51b680c](https://github.com/sendahug/send-hug-frontend/commit/51b680c2b236d1b4d56b1a375ec9279cf8312049)).
  - Added handling for the 'activate' event ([99edd77](https://github.com/sendahug/send-hug-frontend/commit/99edd77476b1adb7f47bd02f047a7f5a81020617)).
  - An alert to the user when a new ServiceWorker is installed and ready to take over, to allow them to trigger the ServiceWorker replacement ([da45c52](https://github.com/sendahug/send-hug-frontend/commit/da45c5254a54227a5feaf3f7d5762ae691dcead5)).
  - A new service for handling the ServiceWorker ([eccc6f6](https://github.com/sendahug/send-hug-frontend/commit/eccc6f6d10777d7772542ea53d810cdf316a5643)).

### 2020-06-24

#### Changes

- The 'user successfully blocked' alert now shows the user's name instead of the user's ID ([59be153](https://github.com/sendahug/send-hug-frontend/commit/59be153cae9a283f325c629e42b35dd7f47fe34e)).

### 2020-06-23

#### Changes

- Blocking a previously blocked user now extends the block instead of setting the release date relative to today ([5771689](https://github.com/sendahug/send-hug-frontend/commit/577168930920317b1edf10418447d0ee571785ed)).

#### Fixes

- Fixed a bug where the confirmation popup didn't show when trying to delete messages ([7572a71](https://github.com/sendahug/send-hug-frontend/commit/7572a713c83fd524a518e74ea19f1925ed0d7a94)).
- Added a missing check to ensure admins can't block themselves ([a8bbca0](https://github.com/sendahug/send-hug-frontend/commit/a8bbca01ea32d9d15184679abfd56af548ad583e)).

#### Documentation

- Updated the README with information about the new components and services ([8707cbb](https://github.com/sendahug/send-hug-frontend/commit/8707cbb8eb59586c845bdad57bd9b6b01aa6cf78)).

### 2020-06-22

#### Features

- Added checks to prevent blocked users from writing new posts ([b47eafb](https://github.com/sendahug/send-hug-frontend/commit/b47eafbdfabb5d32b940c0b8c0b4bd6ea14b3704)).
- Added pagination handling in the admin service and the admin dashboard ([541fb48](https://github.com/sendahug/send-hug-frontend/commit/541fb484b8dd3f253e22ff1998db137bb011b7b6) & [6953389](https://github.com/sendahug/send-hug-frontend/commit/695338944053a22a23e0bd2b76b842c45f421a84)).
- Added the ability to edit a reported user's display name ([0f6a2b8](https://github.com/sendahug/send-hug-frontend/commit/0f6a2b8d722e909a5d9f2bf24d6d153578c34992)).
- Added the ability to edit a reported post from the admin dashboard ([e678581](https://github.com/sendahug/send-hug-frontend/commit/e6785817d6d66d243bebeca2c010229d2a6fb3fb)).

#### Changes

- Changed the users' endpoints' URLS to match the new structure in the back-end ([f362b3e](https://github.com/sendahug/send-hug-frontend/commit/f362b3efe9d203a2a7ddc01a2033c71648377b50)).
- Moved all alerts' handling from the various services to the alerts service ([a74066f](https://github.com/sendahug/send-hug-frontend/commit/a74066fa13472ee5e502f754d257ec0c57b522ea)).
- Blocking a user from the site now automatically closes the report about them as well ([0181a07](https://github.com/sendahug/send-hug-frontend/commit/0181a076e181e10f9ee093072ce72f03da595cff)).
- The process of closing reports when editing users and posts was moved to the back-end ([7acadc8](https://github.com/sendahug/send-hug-frontend/commit/7acadc803ab312e43e144c6a1172ae3f999859d2)).
- Changed admin dashboard fetches to only run once the logged in user's data has been fetched from the back-end ([eeb7f5e](https://github.com/sendahug/send-hug-frontend/commit/eeb7f5eb7d6948ea80ccde7014144044d806acde)).

#### Fixes

- Fixed a bug where the filters table was shown only when there were no filters ([92d45df](https://github.com/sendahug/send-hug-frontend/commit/92d45dfdcc98a1e713097447d70e1a0c959e1336)).
- Fixed a bug where the page refreshed upon submitting a form in the popup before the data was sent to the back-end ([5a0ea86](https://github.com/sendahug/send-hug-frontend/commit/5a0ea8607078981db19fa13b9cb1e79b766d0bae)).

### 2020-06-21

#### Features

- Added the ability to report posts ([0fa96c3](https://github.com/sendahug/send-hug-frontend/commit/0fa96c3d712a60174d130a6de6ee3e55cf3b3ac1) & [be3093e](https://github.com/sendahug/send-hug-frontend/commit/be3093e28ae29a2a2b839aed0d9346e3f726a39a)).
- Added the ability to report users ([2889c53](https://github.com/sendahug/send-hug-frontend/commit/2889c53907a97433ca0ab380789ddd38e4a9d6f0) & [d13c5f7](https://github.com/sendahug/send-hug-frontend/commit/d13c5f79f1c7d97c8f8e559329dcb902b5365152)).
- Added the ability to block users ([a15467a](https://github.com/sendahug/send-hug-frontend/commit/a15467a9838abda2cdd1e3ac0e07430489135f88)).
- Added the ability to unblock previously blocked users ([b8a4145](https://github.com/sendahug/send-hug-frontend/commit/b8a414550cefbf9b0447f4e0f20cb2b0d66fafec)).
- Added the ability to add items to the filtered words list ([e8fbdb8](https://github.com/sendahug/send-hug-frontend/commit/e8fbdb87b3f58d12041dbe2cb6fb5e49ff27c226)),
- Added the ability to remove items from the filtered words list ([35cb139](https://github.com/sendahug/send-hug-frontend/commit/35cb1397a0b27338bddb7485101c8147231d8cd9)).

### 2020-06-20

#### Features

- Added the ability to dismiss open reports ([00943e9](https://github.com/sendahug/send-hug-frontend/commit/00943e9eee45ad198050b46ae79418fc16dbeb08)).
- Added the option to delete a post and close a report via the Admin Service ([92c02c3](https://github.com/sendahug/send-hug-frontend/commit/92c02c3621964cb25b3735ceba28cf3e6634cde4)).

### 2020-06-19

#### Features

- Added a new admin dashboard to allow reporting users and posts, blocking users and filtering words. This includes:
  - Initial admin dashboard component and routes ([c661dd2](https://github.com/sendahug/send-hug-frontend/commit/c661dd2cdda7c88bb2d499fc33df60f8de3ab767)).
  - An Admin Service for handling admin-related data and actions ([4eb8fbd](https://github.com/sendahug/send-hug-frontend/commit/4eb8fbde8fe344f1287585b316a6ad1bacee52f4)).
  - A basic reports page for viewing post and user reports ([60a0034](https://github.com/sendahug/send-hug-frontend/commit/60a0034014f7bf3ffe8c9543669669730400bc97))
  - A basic blocks page for blocking users ([4e5fcc0](https://github.com/sendahug/send-hug-frontend/commit/4e5fcc04d50e03c70a48cd2c53a7e58629032c76)).
  - A basic filters page for filtering out words ([8b12f1d](https://github.com/sendahug/send-hug-frontend/commit/8b12f1d5ebbc30ee9badb4f03afbd739075fbd4f)).

### 2020-06-18

#### Features

- Added a confirmation popup for deleting items to ensure the user wants to delete them ([56feb9d](https://github.com/sendahug/send-hug-frontend/commit/56feb9d634f85d683f73acdce398e34ab560a758)).
- Added the ability to search the app for users and posts. This includes:
  - A component for displaying search results ([8a48f6e](https://github.com/sendahug/send-hug-frontend/commit/8a48f6ea7aa2a17121226488f9a2e8ce54ed556a)).
  - A search form to the header, which enables searching for posts and users ([645c4ad](https://github.com/sendahug/send-hug-frontend/commit/645c4ad1e39ff1d196ac7824ac7fa20880ac4c2e)).
  - Search-related methods for sending the search query to the back-end ([6546871](https://github.com/sendahug/send-hug-frontend/commit/6546871d73bb464da960361ac117d0ab49bc7e28)).
- When the user's JWT expires, the app now presents an alert to the user telling them they have been logged out ([43efa31](https://github.com/sendahug/send-hug-frontend/commit/43efa317d91427c7d8437d26d70c888d0dc54811)).
- Added the ability to delete all of a user's posts ([ec473db](https://github.com/sendahug/send-hug-frontend/commit/ec473db0aa5b036893d942665175ba4b8bd6dd20) & [7db7f16](https://github.com/sendahug/send-hug-frontend/commit/7db7f16d4654d93b5764cd38af6cd0d1f82dc522)).
- Added the ability to delete all of a user's messages in a single mailbox ([426dce5](https://github.com/sendahug/send-hug-frontend/commit/426dce56b8e7c6d26d7cf97ec4af7482d3557b43) & [cfa68ed](https://github.com/sendahug/send-hug-frontend/commit/cfa68ed15d431f1d11e475972fe5613fdd7837d7)).

#### Changes

- Moved all the posts' data and methods from the Items Service to a new Posts Service ([d24b1c5](https://github.com/sendahug/send-hug-frontend/commit/d24b1c54c0905f2a046a3932de84b3098e261265)).
- Adjusted the alerts service's navigation button to allow for different destination rather than just the home page ([8f1787a](https://github.com/sendahug/send-hug-frontend/commit/8f1787a1702aafb0474e6c3e0aedc3ffb181d7d2)).

### 2020-06-17

#### Features

- Added the ability to send hugs to users directly from their profiles ([bf54557](https://github.com/sendahug/send-hug-frontend/commit/bf545572115784da87bf0ddaf234ebf349ac18b8)).

#### Changes

- Changed the name of the property holding user data in the Items Service to indicate it's another user's data, rather than the logged in user's data ([4eec5ce](https://github.com/sendahug/send-hug-frontend/commit/4eec5ce8f85daf4cf1ef1f6278b72fc20ee40d3b)).

#### Fixes

- Fixed a bug where attempting to view another page of another user's posts resulted in fetching that page of the logged in user's posts instead ([61c5dce](https://github.com/sendahug/send-hug-frontend/commit/61c5dce37522caf4d6a2bb84891f2c37e3f9fb7d)).
- Fixed a bug where the loader didn't show when viewing multiple user profiles in a row ([dc3a93c](https://github.com/sendahug/send-hug-frontend/commit/dc3a93ca44c6a8c97b91013a3092fa73011f662d)).
- Fixed a bug where the user page was stuck in indefinite loading status after the page was refreshed ([04fead4](https://github.com/sendahug/send-hug-frontend/commit/04fead4dc31e59ff190acaab99d412468ecf0672)).
- Fixed a bug that caused posts page to display other users' posts for the logged in user's own profile ([7cbb80d](https://github.com/sendahug/send-hug-frontend/commit/7cbb80d115d33ad97ef33e316a2be69517bf9bc9)).
- Fixed a bug where loader was displayed on above the empty profile (while loading), instead of showing just the loader ([6fd68d0](https://github.com/sendahug/send-hug-frontend/commit/6fd68d0909315a3ab3315b15e2200420d6b32a0f)).

### 2020-06-16

#### Features

- Added the ability to view other users' profiles ([057f262](https://github.com/sendahug/send-hug-frontend/commit/057f262574e52150e41c814f5206602963606c23)).

#### Changes

- User display names in posts are now links to their profile ([8600be6](https://github.com/sendahug/send-hug-frontend/commit/8600be630e7ad322179cda60d24aeee01d8c12ae)).

### 2020-06-15

#### Fixes

- Fixed a bug where attempting to view different pages in a messaging thread accidentally fetched another mailbox's data ([5aa21f7](https://github.com/sendahug/send-hug-frontend/commit/5aa21f74252bcea516f129925f0cb793986ab66a)).

#### Documentation

- Updated the link to the main README file in the front-end README ([853c86f](https://github.com/sendahug/send-hug-frontend/commit/853c86f0209bc00af87d3af7ec53fe6083b1f492)).

### 2020-06-14

#### Features

- Added the ability to reply to user messages ([ab37cc6](https://github.com/sendahug/send-hug-frontend/commit/ab37cc603f39ea3342ec136373eb2a10fd31e444)).
- Added a threads mailbox to display a list of the user's threads ([7841812](https://github.com/sendahug/send-hug-frontend/commit/78418126f460e5292315676024ff406515d769bb)).
- Added the functionality for showing and deleting single threads ([995e368](https://github.com/sendahug/send-hug-frontend/commit/995e36893034cc2e58ad5a4a5c8b0957716905e0) & [a630fe0](https://github.com/sendahug/send-hug-frontend/commit/a630fe07b702636f35957b4eda30c476313f9537)).
- Added the ability to delete threads ([a42d648](https://github.com/sendahug/send-hug-frontend/commit/a42d648fb4ef78f0b9c06ed51f0f432abb7829d8)).

#### Changes

- The messaging component now uses path parameters to check which mailbox should be displayed ([06a19d7](https://github.com/sendahug/send-hug-frontend/commit/06a19d705484b382ab1b39bacb517714f5cf4d21)).

#### Fixes

- Fixed a bug where the loader component remained visible even after the threads' fetch has been completed ([aea465b](https://github.com/sendahug/send-hug-frontend/commit/aea465bfaa134f01ea3323af87b9b658f7ed1a08)).

#### Chores

- Changed the GitHub URL in the app to the newly created Send A Hug organisation's URL ([de23f6b](https://github.com/sendahug/send-hug-frontend/commit/de23f6b803cfc2ec4a3de2771d97d48186b41908)).

### 2020-06-12

#### Changes

- Changed the names of the environment variables to make them slightly more descriptive and clear ([7efc593](https://github.com/sendahug/send-hug-frontend/commit/7efc593c6a2ea7f50607436a4c5f052140478329)).

#### Fixes

- Fixed a bug where post-logout redirect attempted to send users to the development URL in production due to the wrong environment being used by the auth service ([2d9b29d](https://github.com/sendahug/send-hug-frontend/commit/2d9b29dcac847795f2dcf4f3bd6854aeac99f549)).

#### Documentation

- Updated the README with information about the dependencies for running the front-end server ([1c88477](https://github.com/sendahug/send-hug-frontend/commit/1c884778e5bdca41c0f06727f754e04906a04bdf)).

### 2020-06-11

#### Features

- Added a post-install script, which updates the final JavaScript bundle with the correct values for all environment variables, as they're set in the machine's environment ([b5ec6b6](https://github.com/sendahug/send-hug-frontend/commit/b5ec6b6a56f331d1b43eb25af9f3638b560c4ac1)).

#### Changes

- Changed all environment-based variables to check for whether the app is run in production, and if so, use the production environment variables ([abd42d5](https://github.com/sendahug/send-hug-frontend/commit/abd42d52f3c98dfc88ddce6d4a356e2847cd5534)).
- Changed the base directory from which browser-sync serves files to account for the production/local development split ([1ade966](https://github.com/sendahug/send-hug-frontend/commit/1ade966265140e05361be551072ed395a422562f)).

#### Chores

- Split the local development gulp tasks from production build gulp tasks. There's no need to run production build for local development, and production builds often require slightly different processes. ([f863cfe](https://github.com/sendahug/send-hug-frontend/commit/f863cfefaf32e50f18fff4941702332d9e885d24))

#### Documentation

- Added hosting instructions to the README ([6db7c8b](https://github.com/sendahug/send-hug-frontend/commit/6db7c8b183b1233ba5302cfd90a53bd79a8fada0)).

### 2020-06-10

#### Features

- Added an outbox to the messaging component ([c72bb82](https://github.com/sendahug/send-hug-frontend/commit/c72bb8243e56747a165dcee60e6093cd60b7d148)).

#### Fixes

- Fixed a bug where switching mailbox didn't show the loader ([4663857](https://github.com/sendahug/send-hug-frontend/commit/466385773be52a64c404d657397914233264bbb7)).

### 2020-06-09

#### Features

- Added a page to display information about the app ([64efbce](https://github.com/sendahug/send-hug-frontend/commit/64efbce6ac25d69586a1fb84745a6be304670324)).
- Added a 'role' field to the user profile view ([a9ee5cc](https://github.com/sendahug/send-hug-frontend/commit/a9ee5cc01c54c50db01e235c105d12524d1dc5c3)).

#### Documentation

- Updated the README with information about the project's structure and files ([6362dea](https://github.com/sendahug/send-hug-frontend/commit/6362dea31b94101e9f09a7f696ee2bfccf3869d6)).

### 2020-06-08

#### Features

- Added the option to edit and delete posts from the 'main page' view if the user can edit and delete any post ([bebedfd](https://github.com/sendahug/send-hug-frontend/commit/bebedfdbf189d475437bc1ee3a687baa36eb4c61)).

#### Fixes

- Fixed a bug where the permissions checker crashed when a user wasn't logged in, rather than return false ([0daf6df](https://github.com/sendahug/send-hug-frontend/commit/0daf6df4a8e547430e625ab8f7eab3be4f393a31)).
- Fixed a bug where the loader remained onscreen after the fetch was resolved but ended with an error ([2a62786](https://github.com/sendahug/send-hug-frontend/commit/2a62786e7ab9d45e65e32e04e1f4e8c0e47d904c)).
- Fixed a bug where the 'no messages' alert showed while data fetching was still in progress ([c8d484f](https://github.com/sendahug/send-hug-frontend/commit/c8d484fccc531243666ff5e1d7f5935fab5eeba5)).
- Fixed a bug where the pagination area showed 'page 1 of 0' due to a mismatch between the front-end's page handling and the back-end's page handling ([9ed1932](https://github.com/sendahug/send-hug-frontend/commit/9ed1932aa5ac122eb734fe47668c3ed8431f154b)).

### 2020-06-05

#### Features

- Added a loader component to display while waiting for the responses of network requests ([a3e7aa2](https://github.com/sendahug/send-hug-frontend/commit/a3e7aa2d95c83036122cdc95ea529cf29eda1a88)).

#### Documentation

- Added information about the authentication workflow to the README ([3c3a108](https://github.com/sendahug/send-hug-frontend/commit/3c3a1088219c86bacbdfba5db3445c4ebac8d0fb)).

### 2020-06-04

#### Features

- Added the options to return to the home page and to reload the page in 'success' alerts ([e459ea6](https://github.com/sendahug/send-hug-frontend/commit/e459ea6f12331843d0fed361a15f0b457a42893b)).
- Added a helper function for checking user permissions ([c0b954e](https://github.com/sendahug/send-hug-frontend/commit/c0b954ec9bf5c7d521a34b683a4838b804b61e8b)).
- Added the option to edit and delete posts from the 'full list' view if the user can edit and delete any post ([181d88c](https://github.com/sendahug/send-hug-frontend/commit/181d88ca2fc1928e71bb686fb78731bdd2c301d6)).
- Added a badge to 'send hug' buttons to display the number of hugs currently sent for the post ([9f7a7eb](https://github.com/sendahug/send-hug-frontend/commit/9f7a7eb5d1ec68da2d572f04f8398353a9379c22)).

#### Fixes

- Added the post edit form (which was accidentally left out) to the full list view ([2438c5c](https://github.com/sendahug/send-hug-frontend/commit/2438c5cf7ccea31da6da5b9e99cc3fdf4f27ff03)).

### 2020-06-03

#### Features

- Added support for pagination in views that can contain multiple pages ([09239f5](https://github.com/sendahug/send-hug-frontend/commit/09239f5e93871ef6fe3a551c9fba328ade0b6e48)).
- Added a popup component with support for editing posts ([037f66c](https://github.com/sendahug/send-hug-frontend/commit/037f66cf0fbf486e0cd9064aa9e82d1d0dca4b5b)).
- Added the ability to change a user's display name ([04b1933](https://github.com/sendahug/send-hug-frontend/commit/04b19335767601f05af7b597c4edece2401e892e)).
- Added a component to display a full list of posts ([c11e054](https://github.com/sendahug/send-hug-frontend/commit/c11e0542e49ea7e60f8af2cdc616e869e3670c95)).

#### Changes

- The text box in the 'new item' form was replaced with a multiline text area to make entering longer texts easier ([c219fe6](https://github.com/sendahug/send-hug-frontend/commit/c219fe6b73fe71b3cdd17acbd2e5857b9bf059d3)).
- The 'page' query parameter now changes when navigating between pages within the same component ([3775554](https://github.com/sendahug/send-hug-frontend/commit/37755544938666f2a748e398e4e764ffa11b31d3)).

### 2020-06-02

#### Features

- Added the ability to delete messages ([432e272](https://github.com/sendahug/send-hug-frontend/commit/432e272bb1ed32c492471aca26bd657899bbc79f)).
- Added a check to ensure users can't message themselves ([a68407c](https://github.com/sendahug/send-hug-frontend/commit/a68407cbe4548e1bd727c7dacf019ab9ea752517)).

#### Changes

- Moved the authentication logic from the messages component to the auth service ([ce8ec88](https://github.com/sendahug/send-hug-frontend/commit/ce8ec88f381a85fec984db64ff6ace5018e83ef4)).
- Moved the messages' fetch from the messages component to the items service ([11373f0](https://github.com/sendahug/send-hug-frontend/commit/11373f064c42e5d7fa2cd0d07b8acf3342170216)).

#### Fixes

- Fixed a bug where the 'send hug' request was made to the 'create post' endpoint instead of the 'specific post's' endpoint ([0bbdb4e](https://github.com/sendahug/send-hug-frontend/commit/0bbdb4eac90cac526a5f535d24290b1eed9df5ee)).
- Fixed the parsing of auth errors in back-end responses to match the structure of the response ([01ea9a3](https://github.com/sendahug/send-hug-frontend/commit/01ea9a3b70c161c5d856f9e136d7ba37e586d96f)).
- Added a check for whether the user just logged in before updating the login count. This fixes a bug where the login count was incorrectly updated every time the user refreshed the page ([4527432](https://github.com/sendahug/send-hug-frontend/commit/452743256c3fe32d63ccf035e12e492c34295e91)).

### 2020-06-01

#### Features

- Added the functionality for returning to the previous page when the user inputs a route that doesn't exist and ends up in the error page ([82524eb](https://github.com/sendahug/send-hug-frontend/commit/82524eb96044a6db5b9895386dff4a6fd16d2071)).

#### Changes

- Changed the icon used for the 'send hug' button ([55315c1](https://github.com/sendahug/send-hug-frontend/commit/55315c17f7118e6dd76e8ca5ea42581281d167be)).

#### Fixes

- The new item links accidentally used Post and Message as query parameters instead of path parameters. They now set the item type as a path parameter instead ([3510eec](https://github.com/sendahug/send-hug-frontend/commit/3510eecc6db34c826f7fa1628776cc3d1d6289e3)).
- Fixed a bug where clicking the 'post' button in the new post form caused the page to reload immediately, before a request was made to the server ([905c4dd](https://github.com/sendahug/send-hug-frontend/commit/905c4ddfe3ab9f43ce26e91ad84366f667d770e4)).
- Fixed a bug where multiple alerts could be created and displayed on top of each other. Now, the alerts service removes the previous alert before creating a new one ([45b4a2f](https://github.com/sendahug/send-hug-frontend/commit/45b4a2fb24a4c6842ceb1246533b2d1a3984bede)).

### 2020-05-31

#### Features

- Added handling for users without posts in the user's page ([f0715e7](https://github.com/sendahug/send-hug-frontend/commit/f0715e76296ae1a45ec34bfee16183c44dfcf686)).
- Added support for refreshing tokens for already-logged in users, which lets active users remain logged in for longer ([0463a79](https://github.com/sendahug/send-hug-frontend/commit/0463a79c01f97fae71854d84e55e89f84751299d)).

#### Changes

- Instead of making a separate call to fetch user data, the 'add user' function in the Auth Service now uses the response from the POST request to populate the user's data ([b55b3d6](https://github.com/sendahug/send-hug-frontend/commit/b55b3d60ab4987ed799ca3894f895a6a48a4f90a)).
- Moved all user data handling from the user's page to the Auth Service ([2771e27](https://github.com/sendahug/send-hug-frontend/commit/2771e275eb5aa38783eba4287a1f383229b3a820)).
- Moved the authentication logic from the main page to the Auth service ([a97af3b](https://github.com/sendahug/send-hug-frontend/commit/a97af3bfd6988c0fc32524015d6c784dcfbe4acf)).
- Moved posts storage from the posts' components to the Items Service ([74ed135](https://github.com/sendahug/send-hug-frontend/commit/74ed135d728b2032fc22bbb6a86edf5a4b51ec73)).

#### Fixes

- Fixed a bug where an empty authorisation header was accidentally sent to the back-end when fetching user data ([846634c](https://github.com/sendahug/send-hug-frontend/commit/846634ceadd6129aa668c9e0ce75a3cdce7473d3)).
- Fixed a bug where the fetch request for the currently logged in user was sent even when no user is logged in ([24e8bc8](https://github.com/sendahug/send-hug-frontend/commit/24e8bc80cc31694d4d75ee48964a424402545f2e)).
- Fixed a bug where multiple versions of the same service were accidentally injected into components ([e53833b](https://github.com/sendahug/send-hug-frontend/commit/e53833b03c2dd2183d07ff144ac9c51e46ca5d51)).

### 2020-05-30

#### Features

- Added a service to handle displaying alerts (both success and error) to users ([b16c655](https://github.com/sendahug/send-hug-frontend/commit/b16c655f18e5515621bdf6d6ca2d6bd807c26591)).
- Added a workflow for updating the user's login count when the user logs in ([2de6f27](https://github.com/sendahug/send-hug-frontend/commit/2de6f270181d049439d888e1c76786bd05d72f91)).

#### Changes

- Changed the new user workflow. Instead of checking the number of times the user has logged in, we now make a request to fetch the user's data regardless of whether the user is new or not. If the user is new, the request returns an error, at which point we create the user ([66a99a0](https://github.com/sendahug/send-hug-frontend/commit/66a99a010401140751ac3a3bf2120a0751a98e2e)).
- Updated the user's model to include the login count property added to the back-end ([fa5b3f5](https://github.com/sendahug/send-hug-frontend/commit/fa5b3f5cfd362b4e6f2ca0160306428991c3c074)).

### 2020-05-29

#### Features

- Added an authorisation header to all requests ([ab3b68b](https://github.com/sendahug/send-hug-frontend/commit/ab3b68badf5fd62e4f18278a3cf26c39bd282e9e)).
- Added caching for the JWT from Auth0 in local storage ([2c835cc](https://github.com/sendahug/send-hug-frontend/commit/2c835cc2d28c9482db5b362fc616300961fa702a)).

#### Chores

- Changed gulp's destination folder for the HTML files in distribution ([884e392](https://github.com/sendahug/send-hug-frontend/commit/884e392ab3a6707e57fc9b965bfd9c32f13b3f34)).

### 2020-05-28

#### Chores

- Added gulp-replace as a dependency to allow adjusting components' template URLs in production ([f4ef9a4](https://github.com/sendahug/send-hug-frontend/commit/f4ef9a4417d4c6cd5f6a996b661f31b662ef5817)).

### 2020-05-27

#### Changes

- Changed the way a new user is created to rely on the number of times the user has logged in, rather than rely on an Auth0 hook. On first login, a request is made to the users' creation endpoint to create the new user ([58ddec6](https://github.com/sendahug/send-hug-frontend/commit/58ddec6bfb4e14f38b83396753ed018d9de27a05)).

#### Chores

- Replaced webpack with browserify as the code bundler ([6c58890](https://github.com/sendahug/send-hug-frontend/commit/6c588905e669ecd82cf7a7802f10c5fe6db06504)).
- Changed the name of the main HTML file when building for distribution ([6507948](https://github.com/sendahug/send-hug-frontend/commit/65079484327b2424a59db7c63fcb1d5ff5ea28f5)).

### 2020-05-26

#### Features

- Added an error message to the main page to display if there are no posts to display ([8ce3102](https://github.com/sendahug/send-hug-frontend/commit/8ce3102655ea677b8bbeb808834439dbfe9c9ebf)).
- Added Auth0 configuration and set up the login and logout workflows ([78a4d50](https://github.com/sendahug/send-hug-frontend/commit/78a4d5030f790a24d9eae287cb2ddbd6a6562014)).

### 2020-05-24

#### Features

- Added a component to display the user's posts ([32a3e12](https://github.com/sendahug/send-hug-frontend/commit/32a3e1277bcf47a7bbaa9e27eba900f182f4a42f)).
- Added initial styling ([cdc97a4](https://github.com/sendahug/send-hug-frontend/commit/cdc97a417b72384fe2effb7961a51271d8089b5c)).

#### Fixes

- Adjusted the structure of the posts' fetch response to match the expected structure from the back-end ([a0adddd](https://github.com/sendahug/send-hug-frontend/commit/a0adddd0f939839bc970bbd0bf75fdf3c7597fee)).

### 2020-05-23

#### Chores

- Removed unneeded dependency (gulp-typescript). The TypeScript conversion is handled by the webpack, which means there's no need to include a gulp plugin for it ([0000965](https://github.com/sendahug/send-hug-frontend/commit/0000965ae925e11350a6b3c95b5136fe8533e260)).
- Updated dependencies ([6f3e868](https://github.com/sendahug/send-hug-frontend/commit/6f3e8686f7806adba321e621c1f607b774b5054d)).
- Fixed the name of the file to run tests against ([c55a743](https://github.com/sendahug/send-hug-frontend/commit/c55a743719d7d0b084fe00811f46f0174058c4ab)).

### 2020-05-22

#### Fixes

- Added missing Angular-related imports, which were causing the application to fail to build ([6cfb72c](https://github.com/sendahug/send-hug-frontend/commit/6cfb72c34d4c5c605d139a00c8c8338be36a9af2)).

#### Chores

- Added Webpack configuration to bundle the TypeScript code ([f830bdf](https://github.com/sendahug/send-hug-frontend/commit/f830bdfc9062c10da0949b3ade69939bddced244)).
- Added missing Angular dependencies ([9effd06](https://github.com/sendahug/send-hug-frontend/commit/9effd065b2f287eba8cd9360fd12b9063fa76201)).

### 2020-05-21

#### Features

- Added interfaces for all used objects based on their structure in the back-end ([75d7cf2](https://github.com/sendahug/send-hug-frontend/commit/75d7cf2224ab2d6c141a30d7c59d52db8a0c79d1)).
- Added the option to create a new post ([f016b42](https://github.com/sendahug/send-hug-frontend/commit/f016b42dcdcca5549648bfee720f0def962f9e26)).
- Added the option to send hugs and to post private messages ([f7bf27e](https://github.com/sendahug/send-hug-frontend/commit/f7bf27e388481dc8cd385e95c43d15fdd28ed2a6)).

### 2020-05-20

#### Feature

- Included the Font Awesome script in the index HTML to allow using Font Awesome icons ([8770c76](https://github.com/sendahug/send-hug-frontend/commit/8770c769fdf00d1bcee648849bef2be0807f0f62)).

#### Changes

- Adjusted the posts in the main page's template to include more information, rather than just the post's text ([46356b5](https://github.com/sendahug/send-hug-frontend/commit/46356b51360f7dc3b68b53320cd27c824abb59ea)).

### 2020-05-19

#### Features

- Added a routing module for handling in-app navigation ([8503d37](https://github.com/sendahug/send-hug-frontend/commit/8503d375c650e50ed6e25c0c1c3289886a22c670)).
- Installed Auth0-js for handling authentication ([a99d36c](https://github.com/sendahug/send-hug-frontend/commit/a99d36c0a2046630ae9d91cc061c50e34abb8ca9)).
- Added an authentication service ([565b5ef](https://github.com/sendahug/send-hug-frontend/commit/565b5ef62635d6eb128376480c61bd7d5db0b880)).
- Added a component to display the user's profile ([a9da16](https://github.com/sendahug/send-hug-frontend/commit/a9da1661474c3d67f0b30e4ad734efdfa68898b0)).
- Added a component to display private messages ([e43c42a](https://github.com/sendahug/send-hug-frontend/commit/e43c42ad9beaef057cc7693ba88f79ff49df2cf6)).
- Added a basic error page component to display when an unknown route is entered ([8f6984c](https://github.com/sendahug/send-hug-frontend/commit/8f6984c0187f7399dc4f50b9e78f20bcfae55260)).

#### Changes

- Consolidated the "new items" and the "suggested items" components to one main page component ([ec831c1](https://github.com/sendahug/send-hug-frontend/commit/ec831c1d36205eff905ab3ed7add4e14812b1804)).

### 2020-05-18

#### Features

- Added an initial component for displaying suggested posts ([69d830d](https://github.com/sendahug/send-hug-frontend/commit/69d830d25b7dc29db685246d7bbc9193ac929514)).
- Added a header component for the site's header ([a27dce3](https://github.com/sendahug/send-hug-frontend/commit/a27dce3cd4bf1b1f53e0b5676a76a7459fa1314f)).

### 2020-05-17

#### Features

- Added an initial serivce to fetch data from the server ([46f2995](https://github.com/sendahug/send-hug-frontend/commit/46f29958854eeb0c87ad7a53c35104bc4da3714d)).
- Added an initial component for displaying newly fetched posts ([1c7e701](https://github.com/sendahug/send-hug-frontend/commit/1c7e7012e98e176e8cabddaa96e546d395f60d42)).

### 2020-05-15

#### Features

- Added an initial AppComponent template ([c1cc8f9](https://github.com/sendahug/send-hug-frontend/commit/c1cc8f9275b7c7cd89ae11ffda82854a385aa326)).

### 2020-05-14

#### Features

- Initialised the project ([def61166](https://github.com/sendahug/send-hug-frontend/commit/def6116651871a2f871c7b730d44b5511268d5b4)).
- Installed Angular and its dependencies ([6ba35ff](https://github.com/sendahug/send-hug-frontend/commit/6ba35ffe020ef1868c080b674961958570ae8040)).
- Created the initial Angular AppModule ([a1557ad](https://github.com/sendahug/send-hug-frontend/commit/a1557adac476cce140f479f2de4e5b6e53425c0d)).
