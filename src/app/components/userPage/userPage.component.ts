/*
	User Page
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html'
})
export class UserPage implements OnInit, OnDestroy {
  // edit popup sub-component variables
  userToEdit:any;
  editType: string = 'user';
  editMode:boolean;
  // loader sub-component variable
  waitFor = "user";
  userId: number | undefined;

  // CTOR
  constructor(
    public authService: AuthService,
    private route:ActivatedRoute,
    public itemsService:ItemsService
  ) {
    this.authService.checkHash();
    this.editMode = false;

    // if there's a user ID, set the user ID to it
    if(this.route.snapshot.paramMap.get('id')) {
      this.userId = Number(this.route.snapshot.paramMap.get('id'));
      // If the user ID from the URL params is different than the logged in
      // user's ID, the user is trying to view another user's profile
      if(this.userId != this.authService.userData.id) {
        this.itemsService.isOtherUser = true;
        this.waitFor = 'other user';
      }
      // otherwise they're trying to view their own profile
      else {
        this.itemsService.isOtherUser = false;
        this.waitFor = 'user';
      }
      // if the user is logged in, get the data of the user with that ID
      this.authService.isUserDataResolved.subscribe((value) => {
        if(value == true) {
          this.itemsService.getUser(this.userId!);
        }
      }).unsubscribe();
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
    this.userToEdit = this.authService.userData;
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
  changeMode(edit:boolean) {
    this.editMode = edit;
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

  // When leaving the page, return "other user" to false
  ngOnDestroy() {
    this.itemsService.isOtherUser = false;
  }
}
