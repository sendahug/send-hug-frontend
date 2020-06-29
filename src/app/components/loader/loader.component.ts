/*
	Loader
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

// App-related imports
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class Loader implements OnInit, OnChanges {
  // the sort of data the parent component is waiting for
  @Input()
  waitingFor!: string;
  // message to display to the user while waiting
  message = '';
  // loader screen visibility
  visible = true;
  //
  @Input()
  user!: 'self' | 'other';
  subsciption: Subscription | undefined;

  // CTOR
  constructor(
    private itemsService:ItemsService,
    private authService:AuthService,
    private adminService:AdminService
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
    this.checkLoadingTarget();
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
                        is waiting (via checkLoadingTarget()) for and adjusts the
                        loader itself (its message and visibility) accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkLoadingTarget() {
    this.visible = true;
    // if the app is waiting for user data to be fetched from the server
    if(this.waitingFor == 'user') {
      this.message = 'Fetching user data...';
      // if the user's data is already fetched, skip the loading screen
      if(this.authService.isUserDataResolved.value) {
        this.visible = false;
      }
      // if not, show the loading screen until the data is fetched
      else {
        // subscribe to the subject following user data
        this.subsciption = this.authService.isUserDataResolved.subscribe((value) => {
          // the subject's value is changed to 'true' upon fetching user data,
          // so if the value is true, there's no longer need for the loader
          // screen.
          if(value == true) {
            this.visible = false;
            this.waitingFor = '';
          }
        })
      }
    }
    // if the app is waiting for another user's data to be fetched from the server
    else if(this.waitingFor == 'other user') {
      this.message = 'Fetching user data...';
      // subscribe to the subject following other user's data
      this.itemsService.idbResolved.user.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching user data,
        // so if the value is true, there's no longer need for the loader
        // screen.
        if(value == true) {
          this.visible = false;
          this.waitingFor = '';
        }
      })
    }
    // if the app is waiting for posts data to be fetched from the server
    else if(this.waitingFor == 'posts') {
      this.message = 'Fetching posts...';
    }
    // if the app is waiting for incoming messages data to be fetched from the server
    else if(this.waitingFor == 'inbox messages') {
      this.message = 'Fetching messages...';
      // subscribe to the subject following user data
      this.authService.isUserDataResolved.subscribe((value) => {
        // if user data has been fetched, the app can attempt to fetch
        // the logged in user's messages
        if(value == true) {
          // subscribe to the subject following user messages data
          this.itemsService.idbResolved.inbox.subscribe((value) => {
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
      this.message = 'Fetching messages...';
      // subscribe to the subject following user data
      this.authService.isUserDataResolved.subscribe((value) => {
        // if user data has been fetched, the app can attempt to fetch
        // the logged in user's messages
        if(value == true) {
          // subscribe to the subject following user messages data
          this.itemsService.idbResolved.outbox.subscribe((value) => {
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
      this.message = 'Fetching threads...';
      // subscribe to the subject following user data
      this.authService.isUserDataResolved.subscribe((value) => {
        // if user data has been fetched, the app can attempt to fetch
        // the logged in user's threads
        if(value == true) {
          // subscribe to the subject following user threads data
          this.itemsService.idbResolved.threads.subscribe((value) => {
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
      this.message = 'Fetching messages...';
      // subscribe to the subject following user data
      this.authService.isUserDataResolved.subscribe((value) => {
        // if user data has been fetched, the app can attempt to fetch
        // the logged in user's threads
        if(value == true) {
          // subscribe to the subject following user threads data
          this.itemsService.idbResolved.thread.subscribe((value) => {
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
      this.message = 'Fetching user posts...';
      // subscribe to the subject following user's posts
      this.itemsService.idbResolved.userPosts.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching user
        // posts, so if the value is true, there's no longer need for the
        // loader screen
        if(value == true) {
          this.visible = false;
          this.waitingFor = '';
        }
      })
    }
    // if the app is waiting for search results to be fetched from the server
    else if(this.waitingFor == 'search') {
      this.message = 'Searching...';
      // subscribe to the subject following search results
      this.itemsService.isSearchResolved.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching search
        // results, so if the value is true, there's no longer need for the
        // loader screen
        if(value == true) {
          this.visible = false;
          this.waitingFor = '';
        }
      })
    }
    // if the app is waiting for open reports to be fetched from the server
    else if(this.waitingFor == 'admin reports') {
      this.message = 'Getting user and post reports...';
        // subscribe to the subject following fetching reports
      this.adminService.isReportsResolved.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching open
        // reports, so if the value is true, there's no longer need for the
        // loader screen
        if(value == true) {
          this.visible = false;
          this.waitingFor = '';
        }
      })
    }
    // if the app is waiting for blocked users to be fetched from the server
    else if(this.waitingFor == 'admin blocks') {
      this.message = 'Getting blocked users...';
        // subscribe to the subject following fetching blocked users
      this.adminService.isBlocksResolved.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching blocked
        // users, so if the value is true, there's no longer need for the
        // loader screen
        if(value == true) {
          this.visible = false;
          this.waitingFor = '';
        }
      })
    }
    // if the app is waiting for filtered phrases to be fetched from the server
    else if(this.waitingFor == 'admin filters') {
      this.message = 'Getting filtered phrases...';
        // subscribe to the subject following fetching filtered phrases
      this.adminService.isFiltersResolved.subscribe((value) => {
        // the subject's value is changed to 'true' upon fetching filtered
        // phrases, so if the value is true, there's no longer need for the
        // loader screen
        if(value == true) {
          this.visible = false;
          this.waitingFor = '';
        }
      })
    }
  }
}
