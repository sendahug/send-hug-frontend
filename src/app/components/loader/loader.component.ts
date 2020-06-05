// Angular imports
import { Component, OnInit, Input } from '@angular/core';

// App-related imports
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class Loader implements OnInit {
  @Input()
  waitingFor!: string;
  message = '';
  visible = true;

  constructor(
    private itemsService:ItemsService,
    private authService:AuthService
  ) {
    // if the app is waiting for user data to be fetched from the server
    if(this.waitingFor == 'user') {
      this.message = 'Fetching user data...';
      // subscribe to the subject following user data
      this.authService.isUserData.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching user data,
        // so if the value is true, there's no longer need for the loader
        // screen.
        if(value == true) {
          this.visible = false;
        }
      })
    }
    // if the app is waiting for posts data to be fetched from the server
    else if(this.waitingFor == 'posts') {
      this.message = 'Fetching posts...';
    }
    // if the app is waiting for messages data to be fetched from the server
    else if(this.waitingFor == 'messages') {
      this.message = 'Fetching messages...';
      // subscribe to the subject following user data
      this.authService.isUserData.subscribe((value) => {
        // if user data has been fetched, the app can attempt to fetch
        // the logged in user's messages
        if(value == true) {
          // subscribe to the subject following user messages data
          this.itemsService.isUserMessages.subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user
            // messages, so if the value is true, there's no longer need
            // for the loader screen
            if(value == true) {
              this.visible = false;
            }
          })
        }
      })
    }
    // if the app is waiting for the user's posts to be fetched from the server
    else if(this.waitingFor == 'user posts') {
      this.message = 'Fetching user posts...';
      // subscribe to the subject following user's posts
      this.itemsService.isUserPosts.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching user
        // posts, so if the value is true, there's no longer need for the
        // loader screen
        if(value == true) {
          this.visible = false;
        }
      })
    }
  }

  ngOnInit() {

  }
}
