import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface User {
  Id: number,
  email: string,
  username: string;
  receivedH: number;
  givenH: number;
  postsNum: number;
  jwt: string;
}

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html',
  providers: [ AuthService,
    HttpClient ]
})
export class userPage implements OnInit {
  userData: User = {
    Id: 0,
    email: '',
    username: '',
    receivedH: 0,
    givenH: 0,
    postsNum: 0,
    jwt: ''
  }

  constructor(authService: AuthService, private httpClient: HttpClient) {
    authService.checkHash();

    // If the user is authenticated, gets the user's data.
    if(authService.authenticated) {
      this.parseUserData(authService);
    }
  }

  ngOnInit() {

  }

  // Parses the user data from the JWT payload.
  parseUserData(authService: AuthService) {
    let userPayload = authService.userProfile;

    if(userPayload) {
      this.userData.Id = userPayload.Id;
      this.userData.email = userPayload.email;
      this.userData.username = userPayload.username;
      this.userData.jwt = authService.token;

      this.fetchSocialData();
    }
  }

  // Fetches the social (app-related) data from the database.
  fetchSocialData() {
    this.httpClient.get('localhost:3000/users').subscribe((response: any) => {
      let data = response.data.user;
      this.userData.receivedH = data.receivedH;
      this.userData.givenH = data.givenH;
      this.userData.postsNum = data.postsNum;
    })
  }
}
