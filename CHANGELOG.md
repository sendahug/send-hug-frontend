# Changelog

## v1.0.0 Beta 1

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
