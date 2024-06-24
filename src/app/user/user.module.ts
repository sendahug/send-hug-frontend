/*
  User Module
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
import { CommonModule } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";
import { provideRouter, RouterLink } from "@angular/router";

// Internal Modules
import { UserPage } from "@user/components/userPage/userPage.component";
import { AppMessaging } from "@user/components/messages/messages.component";
import { MyPosts } from "@user/components/myPosts/myPosts.component";
import { SettingsPage } from "@user/components/settings/settings.component";
import { IconEditor } from "@user/components/iconEditor/iconEditor.component";
import { DisplayNameEditForm } from "@app/components/displayNameEditForm/displayNameEditForm.component";
import { ReportForm } from "@app/components/reportForm/reportForm.component";
import { HeaderMessage } from "@app/components/headerMessage/headerMessage.component";
import { ItemDeleteForm } from "@app/components/itemDeleteForm/itemDeleteForm.component";
import { SinglePost } from "@app/components/post/post.component";
import { Loader } from "@app/components/loader/loader.component";
import { UserIcon } from "@app/components/userIcon/userIcon.component";
import { routes } from "@app/app.routes";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DisplayNameEditForm,
    ReportForm,
    HeaderMessage,
    ItemDeleteForm,
    SinglePost,
    Loader,
    RouterLink,
    UserIcon,
  ],
  declarations: [UserPage, AppMessaging, MyPosts, SettingsPage, IconEditor],
  providers: [provideHttpClient(), provideRouter(routes)],
  bootstrap: [],
  exports: [UserPage, AppMessaging, SettingsPage],
})
export class AppUserModule {}
