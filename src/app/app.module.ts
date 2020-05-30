import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { MainPage } from './components/mainPage/mainPage.component';
import { UserPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';
import { ErrorPage } from './components/errorPage/errorPage.component';
import { NewItem } from './components/newItem/newItem.component';
import { MyPosts } from './components/myPosts/myPosts.component';
import { ItemsService } from './services/items.service';
import { AuthService } from './services/auth.service';
import { AlertsService } from './services/alerts.service';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    MainPage,
    UserPage,
    AppMessaging,
    ErrorPage,
    NewItem,
    MyPosts
  ],
  providers: [
    ItemsService,
    AuthService,
    AlertsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
