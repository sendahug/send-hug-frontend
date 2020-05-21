import { Component } from '@angular/core';

import { Post } from '../../interfaces/post.interface';
import { Message } from '../../interfaces/message.interface';

import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './newItem.component.ts',
  providers: [ ItemsService,
    AuthService ]
})
export class newItem {
  itemType: Post | Message;

  constructor(type: Post | Message,
    private itemsService:ItemsService,
    private authService:AuthService) {
      this.itemType = type;
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
