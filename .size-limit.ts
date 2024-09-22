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
