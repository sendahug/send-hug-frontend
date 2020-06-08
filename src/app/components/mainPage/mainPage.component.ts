// Angular imports
import { Component, OnInit } from '@angular/core';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './mainPage.component.html'
})
export class MainPage implements OnInit {
  type:any;
  page:any;
  postToEdit: Post | undefined;
  editType: string = 'post';
  editMode:boolean;

  // CTOR
  constructor(
    public itemsService: ItemsService,
    public authService:AuthService
  ) {
    this.itemsService.getItems();
    this.editMode = false;
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


    // edit a post
  editPost(post:Post) {
    this.postToEdit = post;
    this.editMode = true;
  }

  // remove edit popup
  changeMode(edit:boolean) {
    this.editMode = edit;
  }

  // delete a post
  deletePost(postID:number) {
    this.itemsService.deletePost(postID);
  }
}
