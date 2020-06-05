// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html'
})
export class UserPage implements OnInit {
  userToEdit:any;
  editType: string = 'user';
  editMode:boolean;
  waitFor = "user";

  // CTOR
  constructor(public authService: AuthService) {
    this.authService.checkHash();
    this.editMode = false;
  }

  ngOnInit() {

  }

  // Login
  login() {
    this.authService.login();
  }

  // logout
  logout() {
    this.authService.logout();
  }

  // edit a user's display name
  editName() {
    this.userToEdit = this.authService.userData;
    this.editMode = true;
  }

  // remove edit popup
  changeMode(edit:boolean) {
    this.editMode = edit;
  }
}
