// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html'
})
export class UserPage implements OnInit {

  // CTOR
  constructor(public authService: AuthService) {
    this.authService.checkHash();
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
}
