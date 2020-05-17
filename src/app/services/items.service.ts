import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private serverUrl = 'localhost:3000'
  static itemsArray: any[] = [];

  constructor(private Http: HttpClient) {

  }

  getItems() {
    this.Http.get(this.serverUrl).subscribe((response: any) => {
      let data = response.data.items;
      data.forEach(element => {
        ItemsService.itemsArray.push(element);
      });
    })
  }
}
