import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { userPage } from './components/userPage/userPage.component';

const routes: Routes = [
  { path: '/user', component: userPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
