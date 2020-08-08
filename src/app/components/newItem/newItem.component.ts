/*
	New Item
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App-related imports
import { Post } from '../../interfaces/post.interface';
import { Message } from '../../interfaces/message.interface';
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';
import { AlertsService } from '../../services/alerts.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './newItem.component.html'
})
export class NewItem {
  // variable declaration
  itemType:String = '';
  user:any;
  forID:any;

  // CTOR
  constructor(private itemsService:ItemsService,
    private authService:AuthService,
    private route:ActivatedRoute,
    private alertService:AlertsService,
    private postsService:PostsService
  ) {
      // Gets the URL parameters
      let type = this.route.snapshot.paramMap.get('type');
      let user = this.route.snapshot.queryParamMap.get('user');
      let userID = this.route.snapshot.queryParamMap.get('userID');

      // If there's a type parameter, sets the type property
      if(type) {
        this.itemType = type;
      }

      // If there's a user parameter, sets the user property
      if(user && userID) {
        this.user = user;
        this.forID = userID;
      }
  }

  /*
  Function Name: sendPost()
  Function Description: Sends a request to create a new post to the items service.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              postText (string) - A string containing the post's text.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendPost(e:Event, postText:string) {
    e.preventDefault();

    // if there's text in the textfield, try to create a new post
    if(postText) {
      // if the new post text is longer than 480 characters, alert the user
      if(postText.length > 480) {
        this.alertService.createAlert({ type: 'Error', message: 'New post text cannot be over 480 characters! Please shorten the post and try again.' });
        document.getElementById('postText')!.classList.add('missing');
      }
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('postText')!.classList.contains('missing')) {
          document.getElementById('postText')!.classList.remove('missing');
        }

        // if there's no logged in user, alert the user
        if(!this.authService.authenticated) {
          this.alertService.createAlert({ type: 'Error', message: 'You\'re currently logged out. Log back in to post a new post.' });
        }
        else {
          // otherwise create the post
          // create a new post object to send
          let newPost:Post = {
            userId: this.authService.userData.id!,
            user: this.authService.userData.displayName!,
            text: postText,
            date: new Date(),
            givenHugs: 0
          }

          this.postsService.sendPost(newPost);
        }
      }
    }
    // otherwise alert the user that a post can't be empty
    else {
      this.alertService.createAlert({ type: 'Error', message: 'A post cannot be empty. Please fill the field and try again.' });
      document.getElementById('postText')!.classList.add('missing');
    }
  }

  /*
  Function Name: sendMessage()
  Function Description: Sends a request to create a new message to the items service.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              messageText (string) - A string containing the new message's text.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendMessage(e:Event, messageText:string) {
    e.preventDefault();

    // if there's text in the textfield, try to create a new message
    if(messageText) {
      // if the user is attempting to send a message to themselves
      if(this.authService.userData.id == this.forID) {
        this.alertService.createAlert({
          type: 'Error',
          message: 'You can\'t send a message to yourself!'
        });
      }
      // if the user is sending a message to someone else, make the request
      else {
        // if the new post text is longer than 480 characters, alert the user
        if(messageText.length > 480) {
          this.alertService.createAlert({ type: 'Error', message: 'New message text cannot be over 480 characters! Please shorten the message and try again.' });
          document.getElementById('messageText')!.classList.add('missing');
        }
        else {
          // if the textfield was marked red, remove it
          if(document.getElementById('messageText')!.classList.contains('missing')) {
            document.getElementById('messageText')!.classList.remove('missing');
          }

          // create a new message object to send
          let newMessage:Message = {
            from: this.authService.userData.displayName!,
            fromId: this.authService.userData.id!,
            forId: this.forID,
            messageText: messageText,
            date: new Date()
          }

          this.itemsService.sendMessage(newMessage);
        }
      }
    }
    // otherwise alert the user that a message can't be empty
    else {
      this.alertService.createAlert({ type: 'Error', message: 'A message cannot be empty. Please fill the field and try again.' });
      document.getElementById('messageText')!.classList.add('missing');
    }
  }
}
