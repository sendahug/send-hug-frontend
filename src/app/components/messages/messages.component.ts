/*
	Messages Page
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class AppMessaging implements OnInit {
  messType = 'inbox';
  // loader sub-component variable
  waitFor = `${this.messType} messages`;

  // CTOR
  constructor(
    public authService: AuthService,
    public itemsService: ItemsService,
    public route:ActivatedRoute,
    public router:Router
  ) {
    let messageType;
    let threadId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.url.subscribe(params => {
      messageType = params[0].path;
    });

    if(messageType) {
      this.messType = messageType;
      this.waitFor = `${this.messType} messages`;
    }
    else {
      this.messType = 'inbox';
    }

    // subscribe to the subject following user data
    this.authService.isUserDataResolved.subscribe((value) => {
      // if the value is true, user data has been fetched, so the app can
      // now fetch the user's messages
      if(value == true) {
        // Gets the user's messages via the items service
        if(this.messType == 'inbox' || this.messType == 'outbox' || this.messType == 'threads') {
          this.itemsService.getMessages(this.messType, this.authService.userData.id!);
        }
        // gets the thread's messages
        else if(this.messType == 'thread' && threadId){
          this.itemsService.getThread(this.authService.userData.id!, threadId);
        }
      }
    })
  }

  ngOnInit() {

  }

  /*
  Function Name: login()
  Function Description: Activates Auth0 login via the authentication service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  login() {
    this.authService.login();
  }

  /*
  Function Name: deleteMessage()
  Function Description: Delete a specific message from the user's messages, via
                        the items service.
  Parameters: messageID (number) - the ID of the message to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteMessage(messageID:number) {
    this.itemsService.deleteMessage(messageID);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of messages. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    if(this.messType == 'inbox') {
      this.itemsService.userMessagesPage.inbox += 1;
    }
    else if(this.messType == 'outbox') {
      this.itemsService.userMessagesPage.outbox += 1;
    }

    this.itemsService.getMessages(this.messType, this.authService.userData.id!);
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of messages. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    if(this.messType == 'inbox') {
      this.itemsService.userMessagesPage.inbox -= 1;
    }
    else if(this.messType == 'outbox') {
      this.itemsService.userMessagesPage.outbox -= 1;
    }
    this.itemsService.getMessages(this.messType, this.authService.userData.id!);
  }

  /*
  Function Name: changeMailbox()
  Function Description: Changes the currently active mailbox (inbox or outbox).
  Parameters: newType (string) - The mailbox to change to.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMailbox(newType:string) {
    // if the user was looking at a specific thread, to get the mailbox type
    // we need to go two levels up
    if(this.messType == 'thread') {
      this.router.navigate(['../../' + newType], {
        relativeTo: this.route,
        replaceUrl: true
      });
    }
    // otherwise we need to go one level up to change mailbox
    else {
      this.router.navigate(['../' + newType], {
        relativeTo: this.route,
        replaceUrl: true
      });
    }
  }

  /*
  Function Name: loadThread()
  Function Description: Shows the messages for the specific thread.
  Parameters: threadId (number) - The thread to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  loadThread(threadId:number) {
    this.router.navigate(['../thread/' + threadId], {
      relativeTo: this.route,
      replaceUrl: true
    });
  }

  /*
  Function Name: changeMailbox()
  Function Description: Deletes a thread and all of its messages
  Parameters: threadId (number) - The thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId:number) {

  }
}
