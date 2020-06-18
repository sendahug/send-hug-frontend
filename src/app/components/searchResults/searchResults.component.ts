/*
	Search Results
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// App-related imports
import { ItemsService } from '../../services/items.service';
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

  // CTOR
  constructor(
    public itemsService:ItemsService,
    private route:ActivatedRoute,
    private router:Router
  ) {
    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
    this.editMode = false;
    this.delete = false;
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
  Function Name: nextPage()
  Function Description: Go to the next page of posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.itemsService.postSearchPage += 1;
    this.itemsService.sendSearch(this.searchQuery!);

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
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
    this.itemsService.sendSearch(this.searchQuery!);

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }
}
