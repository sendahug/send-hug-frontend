/*
	Messages Page
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Angular imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';

type MessageType = 'inbox' | 'outbox' | 'threads';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class AppMessaging implements OnInit {
  messType: MessageType | 'thread' = 'inbox';
  // loader sub-component variable
  waitFor = `${this.messType} messages`;
  threadId: number;
  // edit popup sub-component variables
  postToEdit: any;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;

  // CTOR
  constructor(
    public authService: AuthService,
    public itemsService: ItemsService,
    public route:ActivatedRoute,
    public router:Router
  ) {
    let messageType;
    this.threadId = Number(this.route.snapshot.paramMap.get('id'));

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
        if(this.messType == 'inbox' || this.messType == 'outbox') {
          this.itemsService.getMailboxMessages(this.messType, this.authService.userData.id!);
        }
        else if(this.messType == 'threads') {
          this.itemsService.getThreads(this.authService.userData.id!);
        }
        // gets the thread's messages
        else if(this.messType == 'thread' && this.threadId){
          this.itemsService.getThread(this.authService.userData.id!, this.threadId);
        }
      }
    })

    this.editMode = false;
    this.delete = false;
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
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Message';
    this.itemToDelete = messageID;
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
    if(this.messType == 'inbox' || this.messType == 'outbox' || this.messType == 'threads') {
      this.itemsService.userMessagesPage[this.messType] += 1;
    }

    if(this.messType == 'thread') {
      this.itemsService.threadPage += 1;
      this.itemsService.getThread(this.authService.userData.id!, this.threadId);
    }
    else if(this.messType == 'threads') {
      this.itemsService.getThreads(this.authService.userData.id!);
    }
    else {
      this.itemsService.getMailboxMessages(this.messType, this.authService.userData.id!);
    }
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
    if(this.messType == 'inbox' || this.messType == 'outbox' || this.messType == 'threads') {
      this.itemsService.userMessagesPage[this.messType] -= 1;
    }

    if(this.messType == 'thread') {
      this.itemsService.threadPage -= 1;
      this.itemsService.getThread(this.authService.userData.id!, this.threadId);
    }
    else if(this.messType == 'threads') {
      this.itemsService.getThreads(this.authService.userData.id!);
    }
    else {
      this.itemsService.getMailboxMessages(this.messType, this.authService.userData.id!);
    }
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
  Function Name: deleteThread()
  Function Description: Deletes a thread and all of its messages
  Parameters: threadId (number) - The thread to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteThread(threadId:number) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Thread';
    this.itemToDelete = threadId;
  }

  /*
  Function Name: deleteAllMessages()
  Function Description: Deletes all of the user's messages in a specific mailbox.
  Parameters: type (string) - The type of messages to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllMessages(type:string) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = `All ${type}`;
    this.itemToDelete = this.authService.userData.id;
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the edit popup.
  Parameters: edit (boolean) - indicating whether edit mode should be active.
                               When the user finishes editing, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(edit:boolean) {
    this.editMode = edit;
  }
}
