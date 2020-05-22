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
  templateUrl: './newItem.component.html',
  providers: [ ItemsService,
    AuthService ]
})
export class NewItem {
  itemType:String = '';
  user:any;

  // CTOR
  constructor(private itemsService:ItemsService,
    private authService:AuthService,
    private route:ActivatedRoute) {
      // Gets the URL parameters
      let type = this.route.snapshot.paramMap.get('type');
      let user = this.route.snapshot.paramMap.get('userID');

      // If there's a type parameter, sets the type property
      if(type) {
        this.itemType = type;
      }

      // If there's a user parameter, sets the user property
      if(user) {
        this.user = user;
      }
  }

  // Create new post
  sendPost(postText:string) {
    let newPost:Post = {
      user_id: this.authService.userData.id!,
      user: this.authService.userData.username!,
      text: postText,
      date: new Date(),
      givenHugs: 0
    }

    this.itemsService.sendPost(newPost);
  }

  // Send a message to a user
  sendMessage(forUser:number, messageText:string) {
    let newMessage:Message = {
      from: this.authService.userData.username!,
      fromId: this.authService.userData.id!,
      forId: forUser,
      messageText: messageText,
      date: new Date()
    }

    this.itemsService.sendMessage(newMessage);
  }
}
