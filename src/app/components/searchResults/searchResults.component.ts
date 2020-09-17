/*
	Search Results
	Send a Hug Component
---------------------------------------------------
MIT License

Copyright (c) 2020 Send A Hug

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faEdit, faFlag } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingHeart, faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

// App-related imports
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-search-results',
  templateUrl: './searchResults.component.html'
})
export class SearchResults {
  searchQuery: string | null;
  page = 1;
  //loader component variable
  waitFor = 'search';
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report:boolean;
  reportedItem: Post | undefined;
  reportType = 'Post';
  // icons
  faComment = faComment;
  faEdit = faEdit;
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;
  faTimes = faTimes;
  faEllipsisV = faEllipsisV;

  // CTOR
  constructor(
    public itemsService:ItemsService,
    public authService:AuthService,
    private route:ActivatedRoute,
    private router:Router,
    private postsService:PostsService
  ) {
    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
    this.editMode = false;
    this.delete = false;
    this.report = false;

    // if there's a search query but there's no ongoing search, it might be
    // the result of the user manually navigating here or refreshing the page.
    // in that case, trigger a search manually
    if(this.searchQuery && !this.itemsService.isSearching) {
      this.itemsService.sendSearch(this.searchQuery);
    }
  }

  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: post (Post) - Post to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post:Post) {
    this.editType = 'post';
    this.postToEdit = post;
    this.editMode = true;
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the edit popup.
  Parameters: edit (boolean) - indicating whether edit mode should be active.
                               When the user finishes editing, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(edit:boolean) {
    this.editMode = edit;
  }

  /*
  Function Name: deletePost()
  Function Description: Send a request to the items service to delete a post.
  Parameters: post_id (number) - ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID:number) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = postID;
  }

  /*
  Function Name: reportPost()
  Function Description: Opens the popup to report a post.
  Parameters: post (Post) - the Post to report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost(post:Post) {
	  this.editMode = true;
	  this.delete = false;
	  this.report = true;
	  this.reportedItem = post;
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written. The hug
                        itself is sent by the items service.
  Parameters: itemID (number) - ID of the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(itemID:number) {
    let item = {};
    item = this.itemsService.postSearchResults.filter(e => e.id == itemID)[0];
    this.postsService.sendHug(item);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.itemsService.postSearchPage += 1;
    this.page += 1;
    this.itemsService.sendSearch(this.searchQuery!);

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        query: this.searchQuery,
        page: this.page
      },
      replaceUrl: true
    });
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.itemsService.postSearchPage -= 1;
    this.page -= 1;
    this.itemsService.sendSearch(this.searchQuery!);

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        query: this.searchQuery,
        page: this.page
      },
      replaceUrl: true
    });
  }

  /*
  Function Name: toggleOptions()
  Function Description: Opens a floating sub menu that contains the message, report, edit (if
                        applicable) and delete (if applicable) options on smaller screens.
  Parameters: itemNum (number) - ID of the item for which to open the submenu.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleOptions(itemNum:Number | string) {
    itemNum = Number(itemNum);
    let post = document.querySelector('#nPost' + itemNum)!.parentElement;
    let buttons = post!.querySelectorAll('.buttonsContainer')[0];
    let subMenu = post!.querySelectorAll('.subMenu')[0];

    // if the submenu is hidden, show it
    if(subMenu.classList.contains('hidden')) {
      subMenu.classList.remove('hidden');
      subMenu.classList.add('float');
      buttons.classList.add('float');
    }
    // otherwise hide it
    else {
      subMenu.classList.add('hidden');
      subMenu.classList.remove('float');
      buttons.classList.remove('float');
    }
  }
}
