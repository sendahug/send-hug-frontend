import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './components/mainPage/mainPage.component';
import { UserPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';
import { ErrorPage } from './components/errorPage/errorPage.component';
import { NewItem } from './components/newItem/newItem.component';
import { FullList } from './components/fullList/fullList.component';
import { AboutApp } from './components/aboutApp/aboutApp.component';
import { SearchResults } from './components/searchResults/searchResults.component';
import { AdminDashboard } from './components/adminDashboard/adminDashboard.component';
import { SettingsPage } from './components/settings/settings.component';
import { SiteMap } from './components/siteMap/siteMap.component';

const routes: Routes = [
  { path: '', component: MainPage, data: { name: 'Home Page' } },
  { path: 'user',
      children: [
        { path: '', pathMatch: 'prefix', component: UserPage, data: { name: 'Your Page' } },
        { path: ':id', pathMatch: 'prefix', component: UserPage, data: { name: 'Other User\'s Page' } }
      ], data: { name: 'User Page' }},
  { path: 'messages',
      children: [
        { path: '', pathMatch: 'prefix', redirectTo: 'inbox', data: { name: 'Inbox' } },
        { path: 'inbox', pathMatch: 'prefix', component: AppMessaging, data: { name: 'Inbox' } },
        { path: 'outbox', pathMatch: 'prefix', component: AppMessaging, data: { name: 'Outbox' } },
        { path: 'threads', pathMatch: 'prefix', component: AppMessaging, data: { name: 'Threads' } },
        { path: 'thread/:id', pathMatch: 'prefix', component: AppMessaging, data: { name: 'Thread' } }
      ], data: { name: 'Mailbox' }},
  { path: 'new',
      children: [
        { path: 'Post', pathMatch: 'prefix', component: NewItem, data: { name: 'New post' } },
        { path: 'Message', pathMatch: 'prefix', component: NewItem, data: { name: 'New message' } }
      ], data: { name: 'New Item' } },
  { path: 'list',
      children: [
        { path: 'New', pathMatch: 'prefix', component: FullList, data: { name: 'Full new list' } },
        { path: 'Suggested', pathMatch: 'prefix', component: FullList, data: { name: 'Full suggested list' } }
      ], data: { name: 'Full Items List' } },
  { path: 'about', component: AboutApp, data: { name: 'About Page' } },
  { path: 'search', component: SearchResults, data: { name: 'Search Results' } },
  { path: 'admin',
      children: [
        { path: '', pathMatch: 'prefix', component: AdminDashboard, data: { name: 'Main Page' } },
        { path: 'reports', pathMatch: 'prefix', component: AdminDashboard, data: { name: 'Reports Page' } },
        { path: 'blocks', pathMatch: 'prefix', component: AdminDashboard, data: { name: 'Blocks Page' } },
        { path: 'filters', pathMatch: 'prefix', component: AdminDashboard, data: { name: 'Filters Page' } }
      ], data: { name: 'Admin Dashboard' }},
  { path: 'settings', component: SettingsPage, data: { name: 'Settings Page' } },
  { path: 'sitemap', component: SiteMap, data: { name: 'Site Map' } },
  { path: '**', component: ErrorPage, data: { name: 'Error Page' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
