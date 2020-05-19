import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { MainPage } from './components/mainPage/mainPage.component';
import { siteHeader } from './components/header/header.component';
import { userPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';
import { ItemsService } from './services/items.service';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    MainPage,
    siteHeader,
    userPage,
    AppMessaging
  ],
  providers: [
    ItemsService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
