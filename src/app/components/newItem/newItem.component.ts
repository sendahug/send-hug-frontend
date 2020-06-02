// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App-related imports
import { Post } from '../../interfaces/post.interface';
import { Message } from '../../interfaces/message.interface';
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './newItem.component.html'
})
export class NewItem {
  itemType:String = '';
  user:any;
  forID:any;

  // CTOR
  constructor(private itemsService:ItemsService,
    private authService:AuthService,
    private route:ActivatedRoute) {
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

  // Create new post
  sendPost(e:Event, postText:string) {
    e.preventDefault();
    let newPost:Post = {
      user_id: this.authService.userData.id!,
      user: this.authService.userData.displayName!,
      text: postText,
      date: new Date(),
      givenHugs: 0
    }

    this.itemsService.sendPost(newPost);
  }

  // Send a message to a user
  sendMessage(e:Event, messageText:string) {
    e.preventDefault();
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
