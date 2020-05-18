import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private serverUrl = 'localhost:3000'
  static newItemsArray: any[] = [];
  static sugItemsArray = [];

  constructor(private Http: HttpClient) {

  }

  // Gets a list of new items.
  getNewItems() {
    this.Http.get(this.serverUrl).subscribe((response: any) => {
      let data = response.data.items;
      ItemsService.newItemsArray = data;
    })
  }

  // Gets a list of suggested items
  getSuggestedItems() {
    const Url = this.serverUrl + '/suggested';
    this.Http.get(Url).subscribe((response: any) => {
      let data = response.data.items;
      ItemsService.sugItemsArray = data;
    })
  }
}
