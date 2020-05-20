import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

interface Message {
  Id: number;
  from: string;
  fromId: number;
  for: string;
  forId: number;
  messageText: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  providers: [ AuthService ]
})
export class AppMessaging implements OnInit {
  messages: Message[] = [];

  // CTOR
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    // Gets the user's messages from the server
    let params = new HttpParams().set('userID', this.authService.userProfile.sub)
    this.httpClient.get('localhost:3000/messages', {
      params: params
    }).subscribe((response: any) => {
      let userMessages = response.data.messages;
      userMessages.forEach((element:Message) => {
        let message = element;
        this.messages.push(message);
      });
    })
  }

  ngOnInit() {

  }
}
