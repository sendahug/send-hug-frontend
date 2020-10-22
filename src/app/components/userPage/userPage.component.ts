/*
	User Page
	Send a Hug Component
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

// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { faGratipay } from '@fortawesome/free-brands-svg-icons';

// App-related imports
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './userPage.component.html'
})
export class UserPage implements OnInit, OnDestroy {
  // edit popup sub-component variables
  userToEdit:any;
  editType: string | undefined;
  editMode:boolean;
  report: boolean;
  reportedItem: User | undefined;
  reportType = 'User';
  lastFocusedElement: any;
  // loader sub-component variable
  waitFor = "user";
  userId: number | undefined;
  userDataSubscription:Subscription | undefined;
  // icons
  faGratipay = faGratipay;

  // CTOR
  constructor(
    public authService: AuthService,
    private route:ActivatedRoute,
    public itemsService:ItemsService
  ) {
    this.authService.checkHash();
    this.editMode = false;
    this.report = false;

    // if there's a user ID, set the user ID to it
    if(this.route.snapshot.paramMap.get('id')) {
      this.userId = Number(this.route.snapshot.paramMap.get('id'));
      // If the user ID from the URL params is different than the logged in
      // user's ID, the user is trying to view another user's profile
      if(this.userId != this.authService.userData.id) {
        this.itemsService.isOtherUser = true;
        this.waitFor = 'other user';
        // set the userDataSubscription to the subscription to isUserDataResolved
        this.userDataSubscription = this.authService.isUserDataResolved.subscribe((value) => {
          // if the user is logged in, fetch the profile of the user whose ID
          // is used in the URL param
          if(value == true) {
            this.itemsService.getUser(this.userId!);
            // also unsubscribe from this to avoid sending the same request
            // multiple times
            if(this.userDataSubscription) {
              this.userDataSubscription.unsubscribe();
            }
          }
        });
      }
      // otherwise they're trying to view their own profile
      else {
        this.itemsService.isOtherUser = false;
        this.waitFor = 'user';
      }
    }
    else {
      this.itemsService.isOtherUser = false;
      this.waitFor = 'user';
    }
  }

  ngOnInit() {

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
    this.editType = 'user';
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
  changeMode(edit:boolean) {
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
  sendHug(userID:number) {
    this.itemsService.sendUserHug(userID);
  }

  /*
  Function Name: reportUser()
  Function Description: Opens the popup to report a user.
  Parameters: user (User) - the user to report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportUser(user:User) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.editType = undefined;
    this.report = true;
    this.reportedItem = user;
  }

  // When leaving the page, return "other user" to false
  ngOnDestroy() {
    this.itemsService.isOtherUser = false;
  }
}
