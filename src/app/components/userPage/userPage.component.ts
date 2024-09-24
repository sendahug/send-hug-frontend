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
import { Component, OnInit, OnDestroy, signal, computed } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Subscription, from, switchMap, tap } from "rxjs";
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
import { Loader } from "@app/components/loader/loader.component";
import { UserIcon } from "@app/components/userIcon/userIcon.component";
import { ReportForm } from "@app/components/reportForm/reportForm.component";
import { DisplayNameEditForm } from "@app/components/displayNameEditForm/displayNameEditForm.component";
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
export class UserPage implements OnInit, OnDestroy {
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
  editMode: boolean = false;
  reportMode: boolean = false;
  reportedItem: OtherUser | undefined;
  reportType: "User" = "User";
  lastFocusedElement: any;
  userDataCalls = 0;
  // loader sub-component variable
  loaderClass = computed(() => (!this.isIdbFetchLoading() && this.isLoading() ? "header" : ""));
  userId: number | undefined;
  userDataSubscription: Subscription | undefined;
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
      this.userId = Number(this.route.snapshot.paramMap.get("id"));
    } else {
      this.userId = undefined;
    }

    // If the user's logged in, fetch the user immediately;
    // otherwise, wait for the user to login
    if (this.authService.authenticated()) {
      this.getUser();
    } else {
      // set the userDataSubscription to the subscription to isUserDataResolved
      this.userDataSubscription = this.authService.isUserDataResolved.subscribe((value) => {
        // if the user is logged in, fetch the profile of the user whose ID
        // is used in the URL param
        if (value == true && this.userDataCalls < 2) {
          this.getUser();
          // also unsubscribe from this to avoid sending the same request
          // multiple times
          if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
          }
        }
      });
    }
  }

  ngOnInit() {}

  /*
  Function Name: logout()
  Function Description: Activates Firebase logout via the authentication service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
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
    if (this.userId === undefined || this.userId == this.authService.userData()?.id) {
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
      .pipe(switchMap(() => this.apiClient.get<OtherUserResponse>(`users/all/${this.userId!}`)))
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
    return from(this.swManager.queryUsers(this.userId!)).pipe(
      tap((user) => {
        if (user) this.otherUser.set(user);
        this.isIdbFetchLoading.set(false);
      }),
    );
  }

  /*
  Function Name: editName()
  Function Description: Activate the edit popup to edit a user's display name.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editName() {
    this.lastFocusedElement = document.activeElement;
    this.userToEdit = {
      displayName: this.displayUser().displayName,
      id: this.displayUser().id as number,
    };
    this.editMode = true;
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the edit popup.
  Parameters: edit (boolean) - indicating whether edit mode should be active.
                               When the user finishes editing, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(edit: boolean, type: "Edit" | "Report") {
    if (type === "Edit") this.editMode = edit;
    else this.reportMode = edit;

    this.lastFocusedElement.focus();
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user.
  Parameters: userID (number) - the ID of the user.
  ----------------
  Programmer: Shir Bar Lev.
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

  /*
  Function Name: reportUser()
  Function Description: Opens the popup to report a user.
  Parameters: user (User) - the user to report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportUser(user: OtherUser) {
    this.lastFocusedElement = document.activeElement;
    this.reportMode = true;
    this.reportedItem = user;
  }

  // When leaving the page, return "other user" to false
  ngOnDestroy() {
    this.otherUser.set(undefined);
    this.userDataCalls = 0;
  }
}
