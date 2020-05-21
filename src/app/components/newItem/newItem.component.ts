import { Component } from '@angular/core';

import { Post } from '../../interfaces/post.interface';
import { Message } from '../../interfaces/message.interface';

import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './newItem.component.ts',
  providers: [ ItemsService ]
})
export class newItem {
  itemType: Post | Message;

  constructor(type: Post | Message, private itemsService:ItemsService) {
    this.itemType = type;
  }

  // Create new post
  sendPost(postText:string) {
    let newPost:Post = {
      user_id: 0,
      user: '',
      text: postText,
      date: new Date(),
      givenHugs: 0
    }

    this.itemsService.sendPost(newPost);
  }

  sendMessage(forUser:number, messageText:string) {
    let newMessage:Message = {
      from: '',
      fromId: 0,
      for: '',
      forId: forUser,
      messageText: messageText,
      date: new Date()
    }

    this.itemsService.sendMessage(newMessage);
  }
}
