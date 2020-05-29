// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  providers: [ AuthService ]
})
export class AppMessaging implements OnInit {
  messages: Message[] = [];
  loggedIn = false;

  // CTOR
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    // Gets the user's messages from the server
    if(authService.authenticated) {
      this.loggedIn = true;
      let params = new HttpParams().set('userID', this.authService.userProfile.sub)
      this.httpClient.get('http://localhost:5000/messages', {
        headers: this.authService.authHeader,
        params: params
      }).subscribe((response: any) => {
        let userMessages = response.data.messages;
        userMessages.forEach((element:Message) => {
          let message = element;
          this.messages.push(message);
        });
      })
    }
    else {
      this.loggedIn = false;
    }
  }

  ngOnInit() {

  }

  // Login
  login() {
    this.authService.login();
  }
}
