/*
  App Module
  Send a Hug Module
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
import { SettingsPage } from './components/settings/settings.component';
import { SiteMap } from './components/siteMap/siteMap.component';
import { SinglePost } from './components/post/post.component';
import { SupportPage } from './components/supportPage/supportPage.component';
import { SitePolicies } from './components/sitePolicies/sitePolicies.component';
import { IconEditor } from './components/iconEditor/iconEditor.component';
import { PostEditForm } from './components/forms/postEditForm/postEditForm.component';
import { DisplayNameEditForm } from './components/forms/displayNameEditForm/displayNameEditForm.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('sw.js'),
    FontAwesomeModule
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
    NotificationsTab,
    SettingsPage,
    SiteMap,
    SinglePost,
    SupportPage,
    SitePolicies,
    IconEditor,
    PostEditForm,
    DisplayNameEditForm,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
