import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/items.service'

@Component({
  selector: 'app-suggested-items',
  templateUrl: './suggestedItems.component.html',
  providers: [ItemsService]
})
export class suggestedItems implements OnInit {
  sugItemsArray = [];

  constructor(itemsService:ItemsService) {
    itemsService.getSuggestedItems();
  }

  ngOnInit() {
    this.sugItemsArray = ItemsService.sugItemsArray;
  }
}
