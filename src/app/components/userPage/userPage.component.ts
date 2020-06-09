/*
	User Page
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html'
})
export class UserPage implements OnInit {
  // edit popup sub-component variables
  userToEdit:any;
  editType: string = 'user';
  editMode:boolean;
  // loader sub-component variable
  waitFor = "user";

  // CTOR
  constructor(public authService: AuthService) {
    this.authService.checkHash();
    this.editMode = false;
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
}
