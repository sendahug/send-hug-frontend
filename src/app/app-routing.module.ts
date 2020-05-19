import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { userPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';

const routes: Routes = [
  { path: '/user', component: userPage },
  { path: '/messages', component: AppMessaging }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
