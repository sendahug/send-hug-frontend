/*
	Loader
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit, Input, OnChanges } from '@angular/core';

// App-related imports
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-message',
  templateUrl: './headerMessage.component.html'
})
export class HeaderMessage implements OnInit, OnChanges {
  // the sort of data the parent component is waiting for
  @Input()
  waitingFor: string | undefined;
  // message to display to the user while waiting
  message = '';
  // loader screen visibility
  visible = false;
  //
  @Input()
  user: 'self' | 'other' | undefined;
  loading = false;
  networkMessage = false;

  // CTOR
  constructor(
    private itemsService:ItemsService,
    private authService:AuthService
  ) {

  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the existence of the data
                        the parent component is waiting (via checkLoadingTarget()) for and adjusts the
                        loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    if(this.waitingFor) {
      this.checkLoadingTarget();
    }
  }

  /*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. It checks for the existence of the data
                        the parent component is waiting (via checkLoadingTarget()) for and adjusts the
                        loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnChanges() {
    if(this.waitingFor) {
      this.checkLoadingTarget();
    }
  }

  /*
  Function Name: checkLoadingTarget()
  Function Description: Checks for the existence of the data the parent component
                        is waiting for and adjusts the loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkLoadingTarget() {
    this.visible = false;
    // if the app is waiting for another user's data to be fetched from the server
    if(this.waitingFor == 'other user') {
      this.message = 'Fetching user data from the server...';
      this.itemsService.idbResolved.user.subscribe((value) => {
        if(value) {
          this.visible = true;
          this.loading = true;
          // subscribe to the subject following other user's data
          this.itemsService.isOtherUserResolved.subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user data,
            // so if the value is true, there's no longer need for the loader
            // screen.
            if(value == true) {
              this.visible = false;
              this.waitingFor = '';
            }
          })
        }
      })
    }
    // if the app is waiting for incoming messages data to be fetched from the server
    else if(this.waitingFor == 'inbox messages') {
      this.message = 'Fetching messages from the server...';
      this.itemsService.idbResolved.inbox.subscribe((value) => {
        if(value) {
          this.visible = true;
          this.loading = true;
          // subscribe to the subject following user messages data
          this.itemsService.isUserMessagesResolved.inbox.subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user
            // messages, so if the value is true, there's no longer need
            // for the loader screen
            if(value == true) {
              this.visible = false;
              this.waitingFor = '';
            }
          })
        }
      })
    }
    // if the app is waiting for outgoing messages data to be fetched from the server
    else if(this.waitingFor == 'outbox messages') {
      this.message = 'Fetching messages from the server...';
      this.itemsService.idbResolved.outbox.subscribe((value) => {
        if(value) {
          this.visible = true;
          this.loading = true;
          // subscribe to the subject following user messages data
          this.itemsService.isUserMessagesResolved.outbox.subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user
            // messages, so if the value is true, there's no longer need
            // for the loader screen
            if(value == true) {
              this.visible = false;
              this.waitingFor = '';
            }
          })
        }
      })
    }
    // if the app is waiting for threads messages data to be fetched from the server
    else if(this.waitingFor == 'threads messages') {
      this.message = 'Fetching threads from the server...';
      this.itemsService.idbResolved.threads.subscribe((value) => {
        if(value) {
          this.visible = true;
          this.loading = true;
          // subscribe to the subject following user threads data
          this.itemsService.isUserMessagesResolved.threads.subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user
            // threads, so if the value is true, there's no longer need
            // for the loader screen
            if(value == true) {
              this.visible = false;
              this.waitingFor = '';
            }
          })
        }
      })
    }
    //
    else if(this.waitingFor == 'thread messages') {
      this.message = 'Fetching messages from the server...';
      this.itemsService.idbResolved.thread.subscribe((value) => {
        if(value) {
          this.visible = true;
          this.loading = true;
          // subscribe to the subject following user threads data
          this.itemsService.isThreadResolved.subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user
            // threads, so if the value is true, there's no longer need
            // for the loader screen
            if(value == true) {
              this.visible = false;
              this.waitingFor = '';
            }
          })
        }
      })
    }
    // if the app is waiting for the user's posts to be fetched from the server
    else if(this.waitingFor == 'user posts') {
      this.message = 'Fetching user posts from the server...';
      this.itemsService.idbResolved.user.subscribe((value) => {
        if(value) {
          this.visible = true;
          this.loading = true;
          // subscribe to the subject following user's posts
          this.itemsService.isUserPostsResolved[this.user!].subscribe((value) => {
            // the subject's value is changed to 'true' upon fetching user
            // posts, so if the value is true, there's no longer need for the
            // loader screen
            if(value == true) {
              this.visible = false;
              this.waitingFor = '';
            }
          })
        }
      })
    }
  }

  /*
  Function Name: showInternetMessage()
  Function Description: Show the message telling the user j
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleshowInternetMessage() {
    // if the message isn't shown and needs to be shown
    if(!this.networkMessage) {
      this.visible = true;
      this.loading = false;
      this.message = 'You are not currently connected to the internet. For updated items, reconnect to the internet and try again.';
    }
    // if the message is shown and needs to be gone
    else {
      this.visible = false;
      this.message = '';
    }
  }
}
