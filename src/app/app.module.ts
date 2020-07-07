import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'
import { MainPage } from './components/mainPage/mainPage.component';
import { UserPage } from './components/userPage/userPage.component';
import { AppMessaging } from './components/messages/messages.component';
import { ErrorPage } from './components/errorPage/errorPage.component';
import { NewItem } from './components/newItem/newItem.component';
import { MyPosts } from './components/myPosts/myPosts.component';
import { PopUp } from './components/popUp/popUp.component';
import { FullList } from './components/fullList/fullList.component';
import { Loader } from './components/loader/loader.component';
import { AboutApp } from './components/aboutApp/aboutApp.component';
import { SearchResults } from './components/searchResults/searchResults.component';
import { AdminDashboard } from './components/adminDashboard/adminDashboard.component';
import { HeaderMessage } from './components/headerMessage/headerMessage.component';
import { NotificationsTab } from './components/notifications/notifications.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('sw.js')
  ],
  declarations: [
    AppComponent,
    MainPage,
    UserPage,
    AppMessaging,
    ErrorPage,
    NewItem,
    MyPosts,
    PopUp,
    FullList,
    Loader,
    AboutApp,
    SearchResults,
    AdminDashboard,
    HeaderMessage,
    NotificationsTab
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
