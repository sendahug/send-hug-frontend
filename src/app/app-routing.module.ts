import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './components/mainPage/mainPage.component';
import { UserPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';
import { ErrorPage } from './components/errorPage/errorPage.component';
import { NewItem } from './components/newItem/newItem.component';
import { FullList } from './components/fullList/fullList.component';
import { AboutApp } from './components/aboutApp/aboutApp.component';

const routes: Routes = [
  { path: '', component: MainPage },
  { path: 'user', component: UserPage },
  { path: 'messages', component: AppMessaging },
  { path: 'new/:type', component: NewItem },
  { path: 'list/:type', component: FullList },
  { path: 'about', component: AboutApp },
  { path: '**', component: ErrorPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
