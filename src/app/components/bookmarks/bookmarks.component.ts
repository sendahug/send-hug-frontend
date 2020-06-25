/*
	Bookmarks
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';

// App-related imports
import { BookmarksService } from '../../services/bookmarks.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-bookmarks',
	templateUrl: './bookmarks.component.html'
})
export class Bookmarks {
	bookmarkTypes = [
		{ name: 'Posts', param: 'posts' },
		{ name: 'Messages', param: 'messages' },
		{ name: 'Users', param: 'users' }
	];
	currentType = 'Posts';

	// CTOR
	constructor(
		public bookmarksService:BookmarksService,
		public authService:AuthService
	) {

	}
}
