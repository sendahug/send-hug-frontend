/*
  Size limit config
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import type { SizeLimitConfig } from "size-limit";

module.exports = [
  {
    name: "Main Bundle",
    limit: "40 kB",
    path: ["dist/assets/index-*.js"],
  },
  {
    name: "Public Components",
    limit: "34 kB",
    path: [
      "dist/assets/headerMessage.component-*.js",
      "dist/assets/fullList.component-*.js",
      "dist/assets/sitePolicies.component-*.js",
      "dist/assets/supportPage.component-*.js",
      "dist/assets/aboutApp.component-*.js",
      "dist/assets/siteMap.component-*.js",
      "dist/assets/policies.interface-*.js",
    ],
  },
  {
    name: "Forms",
    limit: "2 kB",
    path: ["dist/assets/displayNameEditForm.component-*.js"],
  },
  {
    name: "Authenticated User Components",
    limit: "60 kB",
    path: [
      "dist/assets/newItem.component-*.js",
      "dist/assets/settings.component-*.js",
      "dist/assets/userPage.component-*.js",
      "dist/assets/messages.component-*.js",
      "dist/assets/userIcon.component-*.js",
    ],
  },
  {
    name: "Admin Components",
    limit: "10 kB",
    path: ["dist/assets/admin.module-*.js"],
  },
  {
    name: "Sign up and Login",
    limit: "6 kB",
    path: ["dist/assets/signUpPage.component-*.js", "dist/assets/loginPage.component-*.js"],
  },
  {
    name: "Vendor scripts",
    limit: "225 kB",
    path: ["dist/assets/vendor-*.js", "dist/assets/polyfills-*.js"],
  },
  {
    name: "Static Assets",
    limit: "290 kB",
    path: ["dist/assets/fonts/*", "dist/assets/icons/*", "dist/assets/img/*", "dist/assets/*.svg"],
  },
  {
    name: "Main Styles",
    limit: "10 kB",
    path: ["dist/styles.css"],
  },
] satisfies SizeLimitConfig;
