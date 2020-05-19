import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { newItems } from './components/newItems/newItems.component';
import { suggestedItems } from './components/suggestedItems/suggestedItems.component';
import { siteHeader } from './components/header/header.component';
import { userPage } from './components/userPage/userPage.component';
import { ItemsService } from './services/items.service';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    newItems,
    suggestedItems,
    siteHeader,
    userPage
  ],
  providers: [
    ItemsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
