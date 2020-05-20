import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../../services/items.service'

@Component({
  selector: 'app-main-page',
  templateUrl: './mainPage.component.html',
  providers: []
})
export class MainPage implements OnInit {
  newItemsArray: any[] = [];
  sugItemsArray = [];

  constructor(itemsService: ItemsService) {
    itemsService.getItems();
  }

  ngOnInit() {
    this.newItemsArray = ItemsService.newItemsArray;
    this.sugItemsArray = ItemsService.sugItemsArray;
  }
}
