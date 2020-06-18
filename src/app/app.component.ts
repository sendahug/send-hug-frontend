// Angular imports
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// App-related imports
import { AuthService } from './services/auth.service';
import { ItemsService } from './services/items.service';
import { AlertsService } from './services/alerts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  navTabs = [{
    name: 'Home',
    link: '/'
  }, {
    name: 'Messages',
    link: '/messages'
  }, {
    name: 'User Page',
    link: '/user'
  }, {
    name: 'About',
    link: '/about'
  }];

  constructor(
    public authService:AuthService,
    private itemsService:ItemsService,
    private alertsService:AlertsService,
    private router:Router
  ) {
    this.authService.checkHash();
  }

  //
  searchApp(e:Event, searchQuery:string) {
    e.preventDefault();

    // if there's something in the search query text field, search for it
    if(searchQuery) {
      this.itemsService.sendSearch(searchQuery);
      // clears the search box
      let searchBox = document.getElementById('searchQuery') as HTMLInputElement;
      searchBox.value = '';
      //navigate to search results
      this.router.navigate(['search'], {
        queryParams: {
          query: searchQuery
        }
      });
    }
    // otherwise alert the user there are no empty searches
    else {
      this.alertsService.createAlert({ message: 'Search query is empty! Please write a term to search for.', type: 'Error' })
    }
  }
}
