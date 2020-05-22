// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html',
  providers: [ AuthService ]
})
export class UserPage implements OnInit {
  userData: User = {
    id: 0,
    auth0Id: '',
    email: '',
    username: '',
    receivedHugs: 0,
    givenHugs: 0,
    postsNum: 0,
    jwt: ''
  }

  // CTOR
  constructor(private authService: AuthService) {
    authService.checkHash();

    // If the user is authenticated, gets the user's data.
    if(authService.authenticated) {
      this.userData = this.authService.userData;
    }
  }

  ngOnInit() {

  }
}
