/*
  App routes
  Send a Hug app routing
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

import { Routes } from "@angular/router";

// Routes
// MainPageComponent is the initial thing users see so I left it as a static import
// ErrorPageComponent and SearchResultsComponent seem useful to keep static for app functionality
import { MainPageComponent } from "./routes/mainPage/mainPage.component";
import { ErrorPageComponent } from "./routes/errorPage/errorPage.component";
import { SearchResultsComponent } from "./routes/searchResults/searchResults.component";
// Guards
import { isAuthedGuard } from "./guards/isAuthed.guard";
import { hasPermissionGuard } from "./guards/hasPermission.guard";

export const routes: Routes = [
  { path: "", component: MainPageComponent, data: { name: "Home Page" } },
  {
    path: "user",
    canMatch: [isAuthedGuard],
    children: [
      {
        path: "",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/userPage/userPage.component").then((c) => c.UserPageComponent),
      },
      {
        path: ":id",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/userPage/userPage.component").then((c) => c.UserPageComponent),
      },
    ],
    data: { name: "User Page", mapRoutes: [{ path: "", name: "Your Page" }] },
  },
  {
    path: "messages",
    canMatch: [isAuthedGuard],
    children: [
      { path: "", pathMatch: "prefix", redirectTo: "threads" },
      {
        path: "threads",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/messages/messages.component").then((c) => c.AppMessagesComponent),
      },
      {
        path: "threads/:id",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/messages/messages.component").then((c) => c.AppMessagesComponent),
      },
    ],
    data: {
      name: "Mailbox",
    },
  },
  {
    path: "new",
    canMatch: [isAuthedGuard],
    children: [
      {
        path: "Post",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/newItem/newItem.component").then((c) => c.NewItemComponent),
      },
      {
        path: "Message",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/newItem/newItem.component").then((c) => c.NewItemComponent),
      },
    ],
    data: {
      name: "New Item",
      mapRoutes: [
        { path: "Post", name: "New post" },
        { path: "Message", name: "New message" },
      ],
    },
  },
  {
    path: "list",
    children: [
      {
        path: "New",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/fullList/fullList.component").then((c) => c.FullListComponent),
      },
      {
        path: "Suggested",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/fullList/fullList.component").then((c) => c.FullListComponent),
      },
    ],
    data: {
      name: "Full Items List",
      mapRoutes: [
        { path: "New", name: "Full new list" },
        { path: "Suggested", name: "Full suggested list" },
      ],
    },
  },
  {
    path: "about",
    loadComponent: () =>
      import("./routes/aboutApp/aboutApp.component").then((c) => c.AboutAppComponent),
    data: { name: "About Page" },
  },
  { path: "search", component: SearchResultsComponent, data: { name: "Search Results" } },
  {
    path: "admin",
    canMatch: [isAuthedGuard, hasPermissionGuard],
    loadChildren: () => import("./admin/admin.module").then((m) => m.AppAdminModule),
    data: {
      name: "Admin Dashboard",
      permission: "read:admin-board",
      mapRoutes: [
        { path: "", name: "Main Page" },
        { path: "reports", name: "Reports Page" },
        { path: "blocks", name: "Blocks Page" },
        { path: "filters", name: "Filters Page" },
      ],
    },
  },
  {
    path: "settings",
    canMatch: [isAuthedGuard],
    loadComponent: () =>
      import("./routes/settings/settings.component").then((c) => c.SettingsPageComponent),
    data: { name: "Settings Page" },
  },
  {
    path: "sitemap",
    loadComponent: () =>
      import("./routes/siteMap/siteMap.component").then((c) => c.SiteMapComponent),
    data: { name: "Site Map" },
  },
  {
    path: "support",
    loadComponent: () =>
      import("./routes/supportPage/supportPage.component").then((c) => c.SupportPageComponent),
    data: { name: "Support" },
  },
  {
    path: "policies",
    children: [
      {
        path: "terms",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/sitePolicies/sitePolicies.component").then(
            (c) => c.SitePoliciesComponent,
          ),
      },
      {
        path: "privacy",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/sitePolicies/sitePolicies.component").then(
            (c) => c.SitePoliciesComponent,
          ),
      },
      {
        path: "cookies",
        pathMatch: "prefix",
        loadComponent: () =>
          import("./routes/sitePolicies/sitePolicies.component").then(
            (c) => c.SitePoliciesComponent,
          ),
      },
    ],
    data: {
      name: "Site Policies",
      mapRoutes: [
        { path: "terms", name: "Terms and Conditions" },
        { path: "privacy", name: "Privacy Policy" },
        { path: "cookies", name: "Cookie Policy" },
      ],
    },
  },
  {
    path: "login",
    loadComponent: () =>
      import("./routes/loginPage/loginPage.component").then((c) => c.LoginPageComponent),
    data: { name: "Login Page" },
  },
  {
    path: "signup",
    loadComponent: () =>
      import("./routes/signUpPage/signUpPage.component").then((c) => c.SignUpPageComponent),
    data: {},
  },
  {
    path: "verify",
    loadComponent: () =>
      import("./routes/verifyEmail/verifyEmail.component").then((c) => c.VerifyEmailPageComponent),
    data: {},
  },
  { path: "**", component: ErrorPageComponent, data: { name: "Error Page" } },
];
