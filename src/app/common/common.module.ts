/*
  Common Module
  Send a Hug Module
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { getAnalytics, provideAnalytics } from "@angular/fire/analytics";

import { AppRoutingModule } from "@app/app-routing.module";
import { PopUp } from "@common/components/popUp/popUp.component";
import { SinglePost } from "@common/components/post/post.component";
import { PostEditForm } from "./components/postEditForm/postEditForm.component";
import { DisplayNameEditForm } from "./components/displayNameEditForm/displayNameEditForm.component";
import { ReportForm } from "./components/reportForm/reportForm.component";
import { ItemDeleteForm } from "./components/itemDeleteForm/itemDeleteForm.component";
import { Loader } from "./components/loader/loader.component";
import { HeaderMessage } from "./components/headerMessage/headerMessage.component";
import { environment } from "@env/environment";
import { PasswordResetForm } from "./components/passwordResetForm/passwordResetForm.component";
import { SendHugForm } from "./components/sendHugForm/sendHugForm.component";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    ServiceWorkerModule.register("sw.js"),
  ],
  declarations: [
    PopUp,
    SinglePost,
    PostEditForm,
    DisplayNameEditForm,
    ReportForm,
    ItemDeleteForm,
    Loader,
    HeaderMessage,
    PasswordResetForm,
    SendHugForm,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
  ],
  bootstrap: [],
  exports: [
    PopUp,
    SinglePost,
    PostEditForm,
    DisplayNameEditForm,
    ReportForm,
    ItemDeleteForm,
    Loader,
    HeaderMessage,
    PasswordResetForm,
    SendHugForm,
  ],
})
export class AppCommonModule {}