/*
	Bookmarks
	Send a Hug Component
*/

// Angular imports
import { Component, OnInit, OnChanges } from '@angular/core';

// App-related imports
import { BookmarkType, BookmarksService } from '../../services/bookmarks.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html'
})
export class Bookmarks implements OnInit, OnChanges {
	bookmarkTypes = [
		{ name: 'Posts', param: 'posts' },
		{ name: 'Messages', param: 'messages' },
		{ name: 'Users', param: 'users' }
	];
	currentType:BookmarkType = 'Posts';

	// CTOR
	constructor(
		public bookmarksService:BookmarksService,
		public authService:AuthService
	) {

	}

	/*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. Checks for the type of bookmarks viewed.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
	ngOnInit() {
		this.bookmarksService.getBookmarks(this.currentType);
	}

	/*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. Checks for the type of bookmarks viewed.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
	ngOnChanges() {
		this.bookmarksService.getBookmarks(this.currentType);
	}
}
