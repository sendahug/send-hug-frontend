// Angular imports
import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

// App-related imports
import { AuthService } from './services/auth.service';
import { ItemsService } from './services/items.service';
import { AlertsService } from './services/alerts.service';
import { SWManager } from './services/sWManager.service';
import { NotificationService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewChecked {
  showNotifications = false;
  showSearch = false;

  constructor(
    public authService:AuthService,
    private itemsService:ItemsService,
    private alertsService:AlertsService,
    private router:Router,
    private serviceWorkerM:SWManager,
    public notificationService:NotificationService
  ) {
    this.authService.checkHash();

    // if the user is logged in, and their data is fetched, start auto-refresh
    this.authService.isUserDataResolved.subscribe((value) => {
      if(value) {
        // if push notifications are enabled, get subscription and auto-refresh data from localStorage
        if(this.authService.userData.pushEnabled) {
          this.notificationService.getSubscription();
        }

        // if auto-refresh is enabled, start auto-refresh
        if(this.authService.userData.autoRefresh) {
          this.notificationService.startAutoRefresh();
        }
      }
    })
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
    let navMenu = document.getElementById('navLinks') as HTMLDivElement;

    // when navigating to another page, check for updates to the ServiceWorker
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart) {
        this.serviceWorkerM.updateSW();
        // if the menu was open and the user navigated to another page, close it
        if(!navMenu.classList.contains('hidden')) {
          navMenu.classList.add('hidden');
        }
      }
    })
  }

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is loaded. It checks the width of the screen and determines
                        whether to display the navigation menu.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    let navMenu = document.getElementById('navLinks') as HTMLDivElement;

    if(document.documentElement.clientWidth > 600) {
      if(navMenu.classList.contains('hidden')) {
        navMenu.classList.remove('hidden');
      }
    }
  }

  /*
  Function Name: searchApp()
  Function Description: Initiates a search for the given query.
  Parameters: e (Event) - Click event (on the search button).
              searchQuery (string) - Term to search for.
  ----------------
  Programmer: Shir Bar Lev.
  */
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

  /*
  Function Name: toggleNotifications()
  Function Description: Toggles the notifications tab.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleNotifications() {
    // if notitfications tab is on, close it
    if(this.showNotifications) {
      this.showNotifications = false;
    }
    // if it's not on, open it
    else {
      this.showNotifications = true;
    }
  }

  /*
  Function Name: toggleSearch()
  Function Description: Toggles the search.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleSearch() {
    // if the search is displayed, close it
    if(this.showSearch) {
      this.showSearch = false;
    }
    // otherwise show it
    else {
      this.showSearch = true;
    }
  }

  /*
  Function Name: toggleMenu()
  Function Description: Toggles the menu (for smaller screens, where the full menu
                        isn't automatically displayed).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleMenu() {
    let navMenu = document.getElementById('navLinks') as HTMLDivElement;
    // if the menu is displayed, close it
    if(!navMenu.classList.contains('hidden')) {
      navMenu.classList.add('hidden');
    }
    // otherwise show it
    else {
      navMenu.classList.remove('hidden');
    }
  }

  /*
  Function Name: onResize()
  Function Description: Checks the viewport size on resize. If it's higher than
                        500px, displays the menu in desktop mode.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  @HostListener('window:resize', ['$event'])
  onResize(_event:Event) {
    let width = document.documentElement.clientWidth;
    let navMenu = document.getElementById('navLinks') as HTMLDivElement;

    if(width > 600) {
      if(navMenu.classList.contains('hidden')) {
        navMenu.classList.remove('hidden');
      }
    }
    else {
      if(!navMenu.classList.contains('hidden')) {
        navMenu.classList.add('hidden');
      }
    }
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the notifications panel.
  Parameters: edit (boolean) - indicating whether the notifications panel should be active.
                               When the user is done with the panel, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(notificationsOn:boolean) {
    this.showNotifications = notificationsOn;
  }
}
