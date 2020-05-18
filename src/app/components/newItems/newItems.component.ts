import { Component, OnInit } from '@angular/core'
import { ItemsService } from '../../services/items.service'

@Component({
  selector: 'app-new-items',
  templateUrl: './newItems.component.html',
  providers: [ItemsService]
})
export class newItems implements OnInit {
  newItemsArray: any[] = [];

  constructor(itemsService: ItemsService) {
    itemsService.getNewItems();
  }

  ngOnInit() {
    this.newItemsArray = ItemsService.newItemsArray;
  }
}
