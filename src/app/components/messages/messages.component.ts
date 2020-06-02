// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class AppMessaging implements OnInit {
  messages: Message[] = [];

  // CTOR
  constructor(private httpClient: HttpClient, public authService: AuthService) {
    // Gets the user's messages from the server
    if(authService.authenticated) {
      let params = new HttpParams().set('userID', `${this.authService.userData.id!}`);
      this.httpClient.get('http://localhost:5000/messages', {
        headers: this.authService.authHeader,
        params: params
      }).subscribe((response: any) => {
        let userMessages = response.messages;
        userMessages.forEach((element:Message) => {
          let message = element;
          this.messages.push(message);
        });
      })
    }
  }

  ngOnInit() {

  }

  // Login
  login() {
    this.authService.login();
  }
}
