import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html',
  providers: [ AuthService ]
})
export class userPage implements OnInit {
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
