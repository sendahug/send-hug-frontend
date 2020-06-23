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

const routes: Routes = [
  { path: '', component: MainPage },
  { path: 'user',
      children: [
        { path: '', pathMatch: 'prefix', component: UserPage },
        { path: ':id', pathMatch: 'prefix', component: UserPage }
      ]},
  { path: 'messages',
      children: [
        { path: '', pathMatch: 'prefix', redirectTo: 'inbox' },
        { path: 'inbox', pathMatch: 'prefix', component: AppMessaging },
        { path: 'outbox', pathMatch: 'prefix', component: AppMessaging },
        { path: 'threads', pathMatch: 'prefix', component: AppMessaging },
        { path: 'thread/:id', pathMatch: 'prefix', component: AppMessaging }
  ]},
  { path: 'new/:type', component: NewItem },
  { path: 'list/:type', component: FullList },
  { path: 'about', component: AboutApp },
  { path: 'search', component: SearchResults },
  { path: 'admin',
      children: [
        { path: '', pathMatch: 'prefix', component: AdminDashboard },
        { path: 'reports', pathMatch: 'prefix', component: AdminDashboard },
        { path: 'blocks', pathMatch: 'prefix', component: AdminDashboard },
        { path: 'filters', pathMatch: 'prefix', component: AdminDashboard }
      ]},
  { path: '**', component: ErrorPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
