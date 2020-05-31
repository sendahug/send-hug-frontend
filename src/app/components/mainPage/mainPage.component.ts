// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './mainPage.component.html'
})
export class MainPage implements OnInit {

  // CTOR
  constructor(public itemsService: ItemsService) {
    this.itemsService.getItems();
  }

  ngOnInit() {

  }

  // Send a hug to a user
  sendHug(itemID:number) {
    let item = {};

    // if the item is in the new list, gets it from there
    if(this.itemsService.newItemsArray.filter(e => e.id == itemID)) {
      item = this.itemsService.newItemsArray.filter(e => e.id == itemID)[0];
    }
    // if not, the item must be in the suggested list, so it gets it from there
    else {
      item = this.itemsService.sugItemsArray.filter(e => e.id == itemID)[0];
    }

    this.itemsService.sendHug(item);
  }
}
