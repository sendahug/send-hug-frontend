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
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideRouter, RouterLink, withComponentInputBinding } from "@angular/router";

import { AdminBlocksComponent } from "./components/adminBlocks/adminBlocks.component";
import { AdminDashboardComponent } from "./components/adminDashboard/adminDashboard.component";
import { AdminFiltersComponent } from "./components/adminFilters/adminFilters.component";
import { AdminReportsComponent } from "./components/adminReports/adminReports.component";
import { PostEditFormComponent } from "@forms/postEditForm/postEditForm.component";
import { ItemDeleteFormComponent } from "@forms/itemDeleteForm/itemDeleteForm.component";
import { DisplayNameEditFormComponent } from "@forms/displayNameEditForm/displayNameEditForm.component";
import { LoaderComponent } from "@common/loader/loader.component";

/* eslint-disable @typescript-eslint/no-extraneous-class */
/* The module notation requires it */
@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PostEditFormComponent,
    ItemDeleteFormComponent,
    DisplayNameEditFormComponent,
    LoaderComponent,
    RouterLink,
  ],
  declarations: [
    AdminBlocksComponent,
    AdminDashboardComponent,
    AdminFiltersComponent,
    AdminReportsComponent,
  ],
  providers: [
    provideHttpClient(),
    provideRouter(
      [
        { path: "", pathMatch: "prefix", component: AdminDashboardComponent },
        {
          path: "reports",
          pathMatch: "prefix",
          component: AdminDashboardComponent,
        },
        {
          path: "blocks",
          pathMatch: "prefix",
          component: AdminDashboardComponent,
        },
        {
          path: "filters",
          pathMatch: "prefix",
          component: AdminDashboardComponent,
        },
      ],
      withComponentInputBinding(),
    ),
  ],
  bootstrap: [AdminDashboardComponent],
  exports: [AdminDashboardComponent],
})
export class AppAdminModule {}
