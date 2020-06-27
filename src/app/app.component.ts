// Angular imports
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

// App-related imports
import { AuthService } from './services/auth.service';
import { ItemsService } from './services/items.service';
import { AlertsService } from './services/alerts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnChanges {
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
    this.registerSW();
  }

  /*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. It triggers the registration of the ServiceWorker,
                        as well keeping alert for any ServiceWorker that has been
                        installed and is ready to be activated.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnChanges() {
    this.registerSW();
  }

  /*
  Function Name: registerSW()
  Function Description: Registers the ServiceWorker and then uses the ServiceWorkerRegistration
                        object to check for any updates to the currently active
                        ServiceWorker, as well as any ServiceWorker that is being installed.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  registerSW() {
    // if the service worker feature is supported in the current browser
    if('serviceWorker' in navigator) {
      // register the service worker
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        if(reg.waiting) {
          this.alertsService.createSWAlert(reg.waiting);
        }
        // if there's a service worker installing
        else if(reg.installing) {
          let installingSW = reg.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          reg.addEventListener('updatefound', () => {
            // gets the SW that was found and is now being installed
            let installingSW = reg.installing!;
            this.checkSWChange(installingSW);
          })
        }
      });
    }
  }

  /*
  Function Name: checkSWChange()
  Function Description: Upon a change in the state of the ServiceWorker, checks
                        the SW's state. If it's installed, it's ready to be activated,
                        so it triggers an alert for the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkSWChange(worker:ServiceWorker) {
    // wait for 'statechange' event on the SW being installed,
    // which means the SW has been installed and is ready to be activated
    worker.addEventListener('statechange', () => {
      if(worker.state == 'installed') {
        this.alertsService.createSWAlert(worker);
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
