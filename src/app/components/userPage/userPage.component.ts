/*
	User Page
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { Component, OnInit, OnDestroy, AfterViewChecked, signal, computed } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, from, switchMap, tap } from "rxjs";
import { faGratipay } from "@fortawesome/free-brands-svg-icons";

// App-related imports
import { User } from "../../interfaces/user.interface";
import { AuthService } from "../../services/auth.service";
import { ItemsService } from "../../services/items.service";
import { iconElements } from "../../interfaces/types";
import { OtherUser } from "../../interfaces/otherUser.interface";
import { SWManager } from "../../services/sWManager.service";
import { ApiClientService } from "../../services/apiClient.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AlertsService } from "../../services/alerts.service";

interface OtherUserResponse {
  user: OtherUser;
  success: boolean;
}

@Component({
  selector: "app-user-page",
  templateUrl: "./userPage.component.html",
})
export class UserPage implements OnInit, OnDestroy, AfterViewChecked {
  isIdbFetchResolved = signal(false);
  isServerFetchResolved = signal(false);
  otherUser = signal<OtherUser | undefined>(undefined);
  displayUser = computed(() => {
    if (this.otherUser()) {
      return this.otherUser() as OtherUser;
    } else {
      return this.authService.userData;
    }
  });
  isOtherUserProfile = computed(() => this.otherUser() != undefined);
  // edit popup sub-component variables
  userToEdit: any;
  editType: string | undefined;
  editMode: boolean;
  report: boolean;
  reportedItem: User | undefined;
  reportType = "User";
  lastFocusedElement: any;
  userDataCalls = 0;
  // loader sub-component variable
  waitFor = "user";
  userId: number | undefined;
  userDataSubscription: Subscription | undefined;
  // icons
  faGratipay = faGratipay;

  // CTOR
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    public itemsService: ItemsService,
    private swManager: SWManager,
    private apiClient: ApiClientService,
    private alertsService: AlertsService,
  ) {
    this.authService.checkHash();
    this.editMode = false;
    this.report = false;

    // if there's a user ID, set the user ID to it
    if (this.route.snapshot.paramMap.get("id")) {
      this.userId = Number(this.route.snapshot.paramMap.get("id"));
    } else {
      this.userId = undefined;
    }

    // If the user's logged in, fetch the user immediately;
    // otherwise, wait for the user to login
    if (this.authService.authenticated) {
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
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is checked by Angular. It updates the user's icon according to the colours
                        chosen by the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    if (!document.querySelectorAll(".userIcon")[0]) return;

    Object.keys(this.displayUser().iconColours).forEach((key) => {
      document
        .querySelectorAll(".userIcon")[0]
        .querySelectorAll(`.${key as iconElements}`)
        .forEach((element) => {
          (element as SVGPathElement).setAttribute(
            "style",
            `fill:${this.displayUser().iconColours[key as iconElements]};`,
          );
        });
    });
  }

  /*
  Function Name: login()
  Function Description: Activates Auth0 login via the authentication service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  login() {
    this.authService.login();
  }

  /*
  Function Name: logout()
  Function Description: Activates Auth0 logout via the authentication service.
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
    if (this.userId === undefined || this.userId == this.authService.userData?.id) {
      this.otherUser.set(undefined);
      this.waitFor = "user";
      this.isIdbFetchResolved.set(true);
      this.isServerFetchResolved.set(true);
      return;
    }

    // Otherwise, fetch the user
    this.isIdbFetchResolved.set(false);
    this.isServerFetchResolved.set(false);
    this.waitFor = "other user";
    this.fetchOtherUsersData();
  }

  /**
   * Fetches the user to display from IDB and then
   * from the server.
   */
  fetchOtherUsersData() {
    from(this.swManager.queryUsers(this.userId!))
      .pipe(
        tap((user) => {
          if (user) this.otherUser.set(user);
          this.isIdbFetchResolved.set(true);
        }),
      )
      .pipe(switchMap(() => this.apiClient.get<OtherUserResponse>(`users/all/${this.userId!}`)))
      .subscribe({
        next: (response) => {
          const user = response.user;
          this.otherUser.set(user);
          this.isServerFetchResolved.set(true);
          this.alertsService.toggleOfflineAlert();

          // adds the user's data to the users store
          this.swManager.addItem("users", user);
        },
        error: (_err: HttpErrorResponse) => {
          this.isServerFetchResolved.set(true);
        },
      });
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
    this.userToEdit = this.authService.userData;
    this.editMode = true;
    this.editType = "user";
    this.report = false;
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
  changeMode(edit: boolean) {
    this.editMode = edit;
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
        this.otherUser()!.receivedH += 1;
        this.authService.userData.givenH += 1;
        this.alertsService.createSuccessAlert("Your hug was sent!", true);
        this.alertsService.toggleOfflineAlert();
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
  reportUser(user: User) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.editType = undefined;
    this.report = true;
    this.reportedItem = user;
  }

  // When leaving the page, return "other user" to false
  ngOnDestroy() {
    this.otherUser.set(undefined);
    this.userDataCalls = 0;
  }
}
