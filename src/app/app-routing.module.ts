/*
  Send a Hug Routing Module
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

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MainPage } from "./components/mainPage/mainPage.component";
import { UserPage } from "./components/userPage/userPage.component";
import { AppMessaging } from "./components/messages/messages.component";
import { ErrorPage } from "./components/errorPage/errorPage.component";
import { NewItem } from "./components/newItem/newItem.component";
import { FullList } from "./components/fullList/fullList.component";
import { AboutApp } from "./components/aboutApp/aboutApp.component";
import { SearchResults } from "./components/searchResults/searchResults.component";
import { AdminDashboard } from "./admin/components/adminDashboard/adminDashboard.component";
import { SettingsPage } from "./components/settings/settings.component";
import { SiteMap } from "./components/siteMap/siteMap.component";
import { SupportPage } from "./components/supportPage/supportPage.component";
import { SitePolicies } from "./components/sitePolicies/sitePolicies.component";
import { LoginPage } from "./components/loginPage/loginPage.component";

export const routes: Routes = [
  { path: "", component: MainPage, data: { name: "Home Page" } },
  {
    path: "user",
    children: [
      { path: "", pathMatch: "prefix", component: UserPage, data: { name: "Your Page" } },
      {
        path: ":id",
        pathMatch: "prefix",
        component: UserPage,
        data: { name: "Other User's Page" },
      },
    ],
    data: { name: "User Page" },
  },
  {
    path: "messages",
    children: [
      { path: "", pathMatch: "prefix", redirectTo: "inbox", data: { name: "Inbox" } },
      { path: "inbox", pathMatch: "prefix", component: AppMessaging, data: { name: "Inbox" } },
      { path: "outbox", pathMatch: "prefix", component: AppMessaging, data: { name: "Outbox" } },
      { path: "threads", pathMatch: "prefix", component: AppMessaging, data: { name: "Threads" } },
      {
        path: "thread/:id",
        pathMatch: "prefix",
        component: AppMessaging,
        data: { name: "Thread" },
      },
    ],
    data: { name: "Mailbox" },
  },
  {
    path: "new",
    children: [
      { path: "Post", pathMatch: "prefix", component: NewItem, data: { name: "New post" } },
      { path: "Message", pathMatch: "prefix", component: NewItem, data: { name: "New message" } },
    ],
    data: { name: "New Item" },
  },
  {
    path: "list",
    children: [
      { path: "New", pathMatch: "prefix", component: FullList, data: { name: "Full new list" } },
      {
        path: "Suggested",
        pathMatch: "prefix",
        component: FullList,
        data: { name: "Full suggested list" },
      },
    ],
    data: { name: "Full Items List" },
  },
  { path: "about", component: AboutApp, data: { name: "About Page" } },
  { path: "search", component: SearchResults, data: { name: "Search Results" } },
  {
    path: "admin",
    children: [
      { path: "", pathMatch: "prefix", component: AdminDashboard, data: { name: "Main Page" } },
      {
        path: "reports",
        pathMatch: "prefix",
        component: AdminDashboard,
        data: { name: "Reports Page" },
      },
      {
        path: "blocks",
        pathMatch: "prefix",
        component: AdminDashboard,
        data: { name: "Blocks Page" },
      },
      {
        path: "filters",
        pathMatch: "prefix",
        component: AdminDashboard,
        data: { name: "Filters Page" },
      },
    ],
    data: { name: "Admin Dashboard" },
  },
  { path: "settings", component: SettingsPage, data: { name: "Settings Page" } },
  { path: "sitemap", component: SiteMap, data: { name: "Site Map" } },
  { path: "support", component: SupportPage, data: { name: "Support" } },
  {
    path: "policies",
    children: [
      {
        path: "terms",
        pathMatch: "prefix",
        component: SitePolicies,
        data: { name: "Terms and Conditions" },
      },
      {
        path: "privacy",
        pathMatch: "prefix",
        component: SitePolicies,
        data: { name: "Privacy Policy" },
      },
      {
        path: "cookies",
        pathMatch: "prefix",
        component: SitePolicies,
        data: { name: "Cookie Policy" },
      },
    ],
    data: { name: "Site Policies" },
  },
  { path: "login", component: LoginPage, data: { name: "Login Page" } },
  { path: "**", component: ErrorPage, data: { name: "Error Page" } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
