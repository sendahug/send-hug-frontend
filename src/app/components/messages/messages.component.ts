import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  templateUrl: './messages.component.html'
})
export class AppMessaging implements OnInit {
  messages: Message[] = [];

  // CTOR
  constructor(private httpClient: HttpClient) {
    // Gets the user's messages from the server
    this.httpClient.get('localhost:3000/messages').subscribe((response: any) => {
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
