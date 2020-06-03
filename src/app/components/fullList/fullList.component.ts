// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App-related imports
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-full-list',
  templateUrl: './fullList.component.html'
})
export class FullList {
  type:any;
  page:any;

  constructor(private route:ActivatedRoute,
    private itemsService:ItemsService) {
      this.type = this.route.snapshot.paramMap.get('type');
      this.page = this.route.snapshot.queryParamMap.get('page');

      // if the type is new items, get the new items
      if(this.type == 'New') {
        this.itemsService.getNewItems(this.page);
      }
      // if the type is suggested items, get the suggested items
      else if(this.type == 'Suggested') {
        this.itemsService.getSuggestedItems(this.page);
      }
  }

  // send a hug
  sendHug(itemID:number) {
    let item = {}
    if(this.type == 'New') {
      item = this.itemsService.fullItemsList.fullNewItems.filter(e => e.id == itemID)[0];
    }
    else if(this.type == 'Suggested') {
      item = this.itemsService.fullItemsList.fullSuggestedItems.filter(e => e.id == itemID)[0];
    }

    this.itemsService.sendHug(item);
  }
}
