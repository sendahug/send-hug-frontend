import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './components/mainPage/mainPage.component';
import { userPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';

const routes: Routes = [
  { path: '', component: MainPage },
  { path: '/user', component: userPage },
  { path: '/messages', component: AppMessaging }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
