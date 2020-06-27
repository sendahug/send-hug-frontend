// Angular imports
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

// App-related imports
import { AuthService } from './services/auth.service';
import { ItemsService } from './services/items.service';
import { AlertsService } from './services/alerts.service';
import { SWManager } from './services/sWManager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
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
    private router:Router,
    private serviceWorkerM:SWManager
  ) {
    this.authService.checkHash();
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It triggers the registration of the ServiceWorker,
                        as well keeping alert for any ServiceWorker that has been
                        installed and is ready to be activated.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    this.serviceWorkerM.registerSW();

    // when navigating to another page, check for updates to the ServiceWorker
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart) {
        this.serviceWorkerM.updateSW();
      }
    })
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
