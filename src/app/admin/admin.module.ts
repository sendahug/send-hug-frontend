/*
  Admin Module
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
import { provideHttpClient } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideRouter, RouterLink, withComponentInputBinding } from "@angular/router";

import { AdminBlocks } from "./components/adminBlocks/adminBlocks.component";
import { AdminDashboard } from "./components/adminDashboard/adminDashboard.component";
import { AdminFilters } from "./components/adminFilters/adminFilters.component";
import { AdminReports } from "./components/adminReports/adminReports.component";
import { PostEditForm } from "@app/components/postEditForm/postEditForm.component";
import { ItemDeleteForm } from "@app/components/itemDeleteForm/itemDeleteForm.component";
import { DisplayNameEditForm } from "@app/components/displayNameEditForm/displayNameEditForm.component";
import { Loader } from "@app/components/loader/loader.component";

@NgModule({
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    PostEditForm,
    ItemDeleteForm,
    DisplayNameEditForm,
    Loader,
    RouterLink,
  ],
  declarations: [AdminBlocks, AdminDashboard, AdminFilters, AdminReports],
  providers: [
    provideHttpClient(),
    provideRouter(
      [
        { path: "", pathMatch: "prefix", component: AdminDashboard },
        {
          path: "reports",
          pathMatch: "prefix",
          component: AdminDashboard,
        },
        {
          path: "blocks",
          pathMatch: "prefix",
          component: AdminDashboard,
        },
        {
          path: "filters",
          pathMatch: "prefix",
          component: AdminDashboard,
        },
      ],
      withComponentInputBinding(),
    ),
  ],
  bootstrap: [AdminDashboard],
  exports: [AdminDashboard],
})
export class AppAdminModule {}
