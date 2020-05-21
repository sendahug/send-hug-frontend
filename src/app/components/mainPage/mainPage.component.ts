// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { ItemsService } from '../../services/items.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './mainPage.component.html',
  providers: [ ItemsService ]
})
export class MainPage implements OnInit {
  newItemsArray: Post[] = [];
  sugItemsArray: Post[] = [];

  // CTOR
  constructor(private itemsService: ItemsService) {
    this.itemsService.getItems();
  }

  ngOnInit() {
    this.newItemsArray = ItemsService.newItemsArray;
    this.sugItemsArray = ItemsService.sugItemsArray;
  }

  // Send a hug to a user
  sendHug(itemID:number) {
    let item = {};

    // if the item is in the new list, gets it from there
    if(this.newItemsArray.filter(e => e.id == itemID)) {
      item = this.newItemsArray.filter(e => e.id == itemID)[0];
    }
    // if not, the item must be in the suggested list, so it gets it from there
    else {
      item = this.sugItemsArray.filter(e => e.id == itemID)[0];
    }

    this.itemsService.sendHug(item);
  }
}
