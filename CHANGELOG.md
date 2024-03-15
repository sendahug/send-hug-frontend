# Changelog

## v1.0.0 Beta 1

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
