// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class AppMessaging implements OnInit {
  waitFor = 'messages';

  // CTOR
  constructor(public authService: AuthService, public itemsService: ItemsService) {
    // subscribe to the subject following user data
    this.authService.isUserDataResolved.subscribe((value) => {
      // if the value is true, user data has been fetched, so the app can
      // now fetch the user's messages
      if(value == true) {
        // Gets the user's messages via the items service
        this.itemsService.getMessages(this.authService.userData.id!);
      }
    })
  }

  ngOnInit() {

  }

  // Login
  login() {
    this.authService.login();
  }

  // delete a message
  deleteMessage(messageID:number) {
    this.itemsService.deleteMessage(messageID);
  }

  // next page of messages
  nextPage() {
    this.itemsService.userMessagesPage += 1;
    this.itemsService.getMessages(this.authService.userData.id!);
  }

  // previous page of messages
  prevPage() {
    this.itemsService.userMessagesPage -= 1;
    this.itemsService.getMessages(this.authService.userData.id!);
  }
}
