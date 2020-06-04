// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-full-list',
  templateUrl: './fullList.component.html'
})
export class FullList {
  type:any;
  page:any;

  constructor(private route:ActivatedRoute,
    private itemsService:ItemsService,
    private router:Router,
    public authService:AuthService) {
      this.type = this.route.snapshot.paramMap.get('type');
      this.page = Number(this.route.snapshot.queryParamMap.get('page'));

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

  // next page of user posts
  nextPage() {
    if(this.type == 'New') {
      this.page += 1;
      this.itemsService.fullItemsPage.fullNewItems += 1;
      this.itemsService.getNewItems(this.itemsService.fullItemsPage.fullNewItems);
    }
    else if(this.type == 'Suggested') {
      this.page += 1;
      this.itemsService.fullItemsPage.fullSuggestedItems += 1;
      this.itemsService.getSuggestedItems(this.itemsService.fullItemsPage.fullSuggestedItems);
    }

    // changes the URL query parameter accordingly
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }

  // previous page of user posts
  prevPage() {
    if(this.type == 'New') {
      this.page -= 1;
      this.itemsService.fullItemsPage.fullNewItems -= 1;
      this.itemsService.getNewItems(this.itemsService.fullItemsPage.fullNewItems);
    }
    else if(this.type == 'Suggested') {
      this.page -= 1;
      this.itemsService.fullItemsPage.fullSuggestedItems -= 1;
      this.itemsService.getSuggestedItems(this.itemsService.fullItemsPage.fullSuggestedItems);
    }

    // changes the URL query parameter accordingly
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }

  // edit a post
  editPost(post:Post) {

  }

  // delete a post
  deletePost(postID:number) {
    this.itemsService.deletePost(postID);
  }
}
