import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-page',
  templateUrl:  './userPage.component.html',
  providers: [ AuthService,
    HttpClient ]
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

  constructor(private authService: AuthService, private httpClient: HttpClient) {
    authService.checkHash();

    // If the user is authenticated, gets the user's data.
    if(authService.authenticated) {
      this.parseUserData();
    }
  }

  ngOnInit() {

  }

  // Parses the user data from the JWT payload.
  parseUserData() {
    let userPayload = this.authService.userProfile;

    if(userPayload) {
      this.userData.Id = userPayload.Id;
      this.userData.email = userPayload.email;
      this.userData.username = userPayload.username;
      this.userData.jwt = this.authService.token;

      this.fetchSocialData();
    }
  }

  // Fetches the social (app-related) data from the database.
  fetchSocialData() {
    let params = new HttpParams().set('userID', this.authService.userProfile.sub)
    this.httpClient.get('localhost:3000/users', {
      params: params
    }).subscribe((response: any) => {
      let data = response.data.user;
      this.userData.receivedH = data.receivedH;
      this.userData.givenH = data.givenH;
      this.userData.postsNum = data.postsNum;
    })
  }
}
