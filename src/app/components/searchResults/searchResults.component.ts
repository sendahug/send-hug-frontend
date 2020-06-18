/*
	Search Results
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App-related imports
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './searchResults.component.html'
})
export class SearchResults {
  numUserResults: number;
  numPostResults: number;
  searchQuery: string | null;
  //loader component variable
  waitFor = 'search';

  // CTOR
  constructor(
    public itemsService:ItemsService,
    private route:ActivatedRoute
  ) {
    this.numUserResults = 0;
    this.numPostResults = 0;
    this.searchQuery = this.route.snapshot.queryParamMap.get('query');
  }
}
