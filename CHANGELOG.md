# Changelog

## Unreleased

### 2022-01-24

#### Chores

- Regenerated the package-lock file to bump dependencies' dependencies and fix security vulnerabilities ([56dd113](https://github.com/sendahug/send-hug-frontend/commit/56dd113aac0c46b3715266004c82a9e1a1e06d4f)).
- Deleted an unneeded test dependency. Since jasmine-core is a dependency of karma-jasmine, there was no need to separately include jasmine-core as dependency in the repo. ([05770dd](https://github.com/sendahug/send-hug-frontend/commit/05770dd0c48767b9a840d2d39ada8535d623f5a5))

### 2021-12-18

#### Chores

- Updated Angular to v12.2.15 ([4d8a752](https://github.com/sendahug/send-hug-frontend/commit/4d8a7522d819f486131c7d137a622d99b1ae00a0)).

### 2021-10-31

#### Chores

- Updated Angular to v12.2.12 ([ad16ccb](https://github.com/sendahug/send-hug-frontend/commit/ad16ccb0d5d3e2b5ee40a05320251f187d4bf8d0)).

### 2021-09-21

#### Chores

- Updated Angular to v12.2.6 ([1310d81](https://github.com/sendahug/send-hug-frontend/commit/1310d813ea8db01c07297fd7307fac97230d154b)).

### 2021-09-07

#### Chores

- Updated Angular to v12.2.4 ([315d0d6](https://github.com/sendahug/send-hug-frontend/commit/315d0d66559e8eb146d2174cb63f29c856ae1c67)).

### 2021-08-29

#### Chores

- Updated Angular to v12.2.3 ([89de0a1](https://github.com/sendahug/send-hug-frontend/commit/89de0a1d6df089c9bfad4cd9c4dcb60dd834679f)).

### 2021-08-14

#### Chores

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

#### Chores

- Upgraded to GitHub-native Dependabot ([e6949ba](https://github.com/sendahug/send-hug-frontend/commit/e6949ba47f7e8cd396b2e67ecc5db1cbac3abc71)).

### 2021-04-25

#### Changes

- Changed the production VAPID keys due to a security issue, which exposed the previous private key ([1b51dad](https://github.com/sendahug/send-hug-frontend/commit/1b51dad795c40f62cf39d74c1dad01eafd88e4ee)).

### 2021-04-22

#### Chores

- Updated Angular from v11.2.10 to v11.2.11 ([ae1ebe3](https://github.com/sendahug/send-hug-frontend/commit/ae1ebe3c04b6101270ed6f29532abd4e2bd6f460)).

### 2021-04-16

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

## V1.0.0 Beta 2

# TODO: FINISH THIS

## v1.0.0 Beta 1

# TODO: FINISH THIS

### 2020-07-02

#### Features

- Added a skip link so that people relying on keyboard navigation can skip the menu and get to the main content easily ([5424c43](https://github.com/sendahug/send-hug-frontend/commit/5424c4381f64d88f2d141ca5bfc115b51b669f24)).

### 2020-07-01

#### Features

- Added the functionality for clearing the IndexedDB database when a certain threshold of items is reached. This is done to ensure we don't keep too many items stored locally at once ([69bcfa8](https://github.com/sendahug/send-hug-frontend/commit/69bcfa80ff4592bd4f9509d71181ad7b222526cc)).

#### Changes

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

#### Features

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

#### Features

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

#### Features

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

### 2020-06-16

#### Features

- Added the ability to view other users' profiles ([057f262](https://github.com/sendahug/send-hug-frontend/commit/057f262574e52150e41c814f5206602963606c23)).

#### Changes

- User display names in posts are now links to their profile ([8600be6](https://github.com/sendahug/send-hug-frontend/commit/8600be630e7ad322179cda60d24aeee01d8c12ae)).

### 2020-06-15

#### Fixes

- Fixed a bug where attempting to view different pages in a messaging thread accidentally fetched another mailbox's data ([5aa21f7](https://github.com/sendahug/send-hug-frontend/commit/5aa21f74252bcea516f129925f0cb793986ab66a)).

#### Documentation

- Updated the link to the main README file in the front-end README ([853c86f](https://github.com/sendahug/send-hug-frontend/commit/853c86f0209bc00af87d3af7ec53fe6083b1f492)).

### 2020-06-14

#### Features

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

### 2020-06-10

#### Features

- Added an outbox to the messaging component ([c72bb82](https://github.com/sendahug/send-hug-frontend/commit/c72bb8243e56747a165dcee60e6093cd60b7d148)).

#### Fixes

- Fixed a bug where switching mailbox didn't show the loader ([4663857](https://github.com/sendahug/send-hug-frontend/commit/466385773be52a64c404d657397914233264bbb7)).

### 2020-06-09

#### Features

- Added a page to display information about the app ([64efbce](https://github.com/sendahug/send-hug-frontend/commit/64efbce6ac25d69586a1fb84745a6be304670324)).
- Added a 'role' field to the user profile view ([a9ee5cc](https://github.com/sendahug/send-hug-frontend/commit/a9ee5cc01c54c50db01e235c105d12524d1dc5c3)).

#### Documentation

- Updated the README with information about the project's structure and files ([6362dea](https://github.com/sendahug/send-hug-frontend/commit/6362dea31b94101e9f09a7f696ee2bfccf3869d6)).

### 2020-06-08

#### Features

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

#### Fixes

- Added the post edit form (which was accidentally left out) to the full list view ([2438c5c](https://github.com/sendahug/send-hug-frontend/commit/2438c5cf7ccea31da6da5b9e99cc3fdf4f27ff03)).

### 2020-06-03

#### Features

- Added support for pagination in views that can contain multiple pages ([09239f5](https://github.com/sendahug/send-hug-frontend/commit/09239f5e93871ef6fe3a551c9fba328ade0b6e48)).
- Added a popup component with support for editing posts ([037f66c](https://github.com/sendahug/send-hug-frontend/commit/037f66cf0fbf486e0cd9064aa9e82d1d0dca4b5b)).
- Added the ability to change a user's display name ([04b1933](https://github.com/sendahug/send-hug-frontend/commit/04b19335767601f05af7b597c4edece2401e892e)).
- Added a component to display a full list of posts ([c11e054](https://github.com/sendahug/send-hug-frontend/commit/c11e0542e49ea7e60f8af2cdc616e869e3670c95)).

#### Changes

- The text box in the 'new item' form was replaced with a multiline text area to make entering longer texts easier ([c219fe6](https://github.com/sendahug/send-hug-frontend/commit/c219fe6b73fe71b3cdd17acbd2e5857b9bf059d3)).
- The 'page' query parameter now changes when navigating between pages within the same component ([3775554](https://github.com/sendahug/send-hug-frontend/commit/37755544938666f2a748e398e4e764ffa11b31d3)).

### 2020-06-02

#### Features

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

#### Features

- Added the functionality for returning to the previous page when the user inputs a route that doesn't exist and ends up in the error page ([82524eb](https://github.com/sendahug/send-hug-frontend/commit/82524eb96044a6db5b9895386dff4a6fd16d2071)).

#### Changes

- Changed the icon used for the 'send hug' button ([55315c1](https://github.com/sendahug/send-hug-frontend/commit/55315c17f7118e6dd76e8ca5ea42581281d167be)).

#### Fixes

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

#### Fixes

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
