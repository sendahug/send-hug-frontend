/*
	Bookmarks
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';

// App-related imports
import { ItemsService } from '../../services/items.service';
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
	
	// CTOR
	constructor(
		public itemsService:ItemsService,
		public authService:AuthService
	) {
		
	}
}