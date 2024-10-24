/*
	User Page
	Send a Hug Component
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

// Angular imports
import { Component, OnDestroy, signal, computed } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { from, switchMap, tap } from "rxjs";
import { faGratipay } from "@fortawesome/free-brands-svg-icons";
import { HttpErrorResponse } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";

// App-related imports
import { PartialUser, User } from "@app/interfaces/user.interface";
import { AuthService } from "@app/services/auth.service";
import { OtherUser } from "@app/interfaces/otherUser.interface";
import { SWManager } from "@app/services/sWManager.service";
import { ApiClientService } from "@app/services/apiClient.service";
import { AlertsService } from "@app/services/alerts.service";
import { Loader } from "@common/loader/loader.component";
import { UserIcon } from "@common/userIcon/userIcon.component";
import { ReportForm } from "@forms/reportForm/reportForm.component";
import { DisplayNameEditForm } from "@forms/displayNameEditForm/displayNameEditForm.component";
import { MyPosts } from "@app/components/myPosts/myPosts.component";

interface OtherUserResponse {
  user: OtherUser;
  success: boolean;
}

@Component({
  selector: "app-user-page",
  templateUrl: "./userPage.component.html",
  styleUrl: "./userPage.component.less",
  standalone: true,
  imports: [
    Loader,
    UserIcon,
    RouterLink,
    FontAwesomeModule,
    CommonModule,
    ReportForm,
    DisplayNameEditForm,
    MyPosts,
  ],
})
export class UserPage implements OnDestroy {
  isLoading = signal(false);
  isIdbFetchLoading = signal(false);
  otherUser = signal<OtherUser | undefined>(undefined);
  displayUser = computed(() => {
    if (this.otherUser()) {
      return this.otherUser() as OtherUser;
    } else {
      return this.authService.userData() as User;
    }
  });
  isOtherUserProfile = computed(() => this.otherUser() != undefined);
  // edit popup sub-component variables
  userToEdit?: PartialUser;
  editMode = signal(false);
  reportMode = signal(false);
  reportedItem = signal<OtherUser | undefined>(undefined);
  reportType: "User" = "User";
  // loader sub-component variable
  loaderClass = computed(() => (!this.isIdbFetchLoading() && this.isLoading() ? "header" : ""));
  userId = signal<number | undefined>(undefined);
  // icons
  faGratipay = faGratipay;

  // CTOR
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private swManager: SWManager,
    private apiClient: ApiClientService,
    private alertsService: AlertsService,
  ) {
    // if there's a user ID, set the user ID to it
    if (this.route.snapshot.paramMap.get("id")) {
      this.userId.set(Number(this.route.snapshot.paramMap.get("id")));
    } else {
      this.userId.set(undefined);
    }

    // Since navigation to the page is only allowed when a user is authenticated
    // we can fetch the user immediately.
    this.getUser();
  }

  /**
   * Activates Firebase logout via the authentication service.
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Checks for whether the profile being viewed is the user's
   * own profile and handles the fetch in both cases.
   */
  getUser() {
    // If there's no user ID or the user ID is the same as the
    // logged in user's ID, don't fetch the user but set everything
    // to resolved so it can display the AuthService data in the template.
    if (this.userId() === undefined || this.userId() == this.authService.userData()?.id) {
      this.otherUser.set(undefined);
      this.isLoading.set(false);
      this.isIdbFetchLoading.set(false);
      return;
    }

    // Otherwise, fetch the user
    this.isLoading.set(true);
    this.isIdbFetchLoading.set(true);
    this.fetchOtherUsersData();
  }

  /**
   * Fetches the user to display from IDB and then
   * from the server.
   */
  fetchOtherUsersData() {
    this.fetchOtherUserFromIdb()
      .pipe(switchMap(() => this.apiClient.get<OtherUserResponse>(`users/all/${this.userId()!}`)))
      .subscribe({
        next: (response) => {
          const user = response.user;
          this.otherUser.set(user);
          this.isLoading.set(false);

          // adds the user's data to the users store
          this.swManager.addItem("users", user);
        },
        error: (_err: HttpErrorResponse) => {
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Fetches the user to display from IDB.
   * @returns an observable that fetches the user from IDB
   */
  fetchOtherUserFromIdb() {
    return from(this.swManager.queryUsers(this.userId()!)).pipe(
      tap((user) => {
        if (user) this.otherUser.set(user);
        this.isIdbFetchLoading.set(false);
      }),
    );
  }

  /**
   * Activate the edit popup to edit a user's display name.
   */
  editName() {
    this.userToEdit = {
      displayName: this.displayUser().displayName,
      id: this.displayUser().id as number,
    };
    this.editMode.set(true);
  }

  /**
   * Remove the edit popup.
   * @param edit indicating whether edit mode should be active.
   * @param type the type of popup to hide (edit or report).
   */
  changeMode(edit: boolean, type: "Edit" | "Report") {
    if (type === "Edit") this.editMode.set(edit);
    else this.reportMode.set(edit);
  }

  /**
   * Send a hug to a user.
   * @param userID the ID of the user.
   */
  sendHug(userID: number) {
    this.apiClient.post(`users/all/${userID}/hugs`, {}).subscribe({
      next: (_response) => {
        this.otherUser.set({
          ...this.otherUser()!,
          receivedH: this.otherUser()!.receivedH + 1,
        });
        this.authService.updateUserData({ givenH: this.authService.userData()!.givenH + 1 });
        this.alertsService.createSuccessAlert("Your hug was sent!");
      },
    });
  }

  /**
   * Opens the popup to report a user.
   * @param user the user to report.
   */
  reportUser(user: OtherUser) {
    this.reportMode.set(true);
    this.reportedItem.set(user);
  }

  /**
   * Angular's OnDestroy hook. When leaving the page, returns
   * "other user" to false
   */
  ngOnDestroy() {
    this.otherUser.set(undefined);
  }
}
