// Angular imports
import { Component, OnInit, HostListener, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { faComments, faUserCircle, faCompass, faBell } from '@fortawesome/free-regular-svg-icons';
import { faBars, faSearch, faTimes, faTextHeight } from '@fortawesome/free-solid-svg-icons';

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
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  showNotifications = false;
  showSearch = false;
  showTextPanel = false;
  showMenu = true;
  // font awesome icons
  faBars = faBars;
  faComments = faComments;
  faUserCircle = faUserCircle;
  faCompass = faCompass;
  faBell = faBell;
  faSearch = faSearch;
  faTimes = faTimes;
  faTextHeight = faTextHeight;

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
  Function Name: ngAfterViewInit()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is intialised. It checks for the currently active navigation menu link.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart) {
        let navItems = document.querySelectorAll('.navLink');

        // remove 'active' class from the previously active component's link
        navItems.forEach((navLink) => {
          if(navLink.classList.contains('active')) {
            navLink.classList.remove('active');

            // if the nav link has 4 children, it means it's got a pic rather than an
            // icon as its symbol, so the regular icon needs to be displayed and the active
            // icon needs to be hidden
            if(navLink.children.length == 4) {
              navLink.children.item(0)!.classList.remove('hidden');
              navLink.children.item(1)!.classList.add('hidden');
            }
          }
        })

        // check which link needs to be marked now
        // if the current URL is the main page
        if(event.url == '/') {
          navItems[1].classList.add('active');
          navItems[1].children.item(0)!.classList.add('hidden');
          navItems[1].children.item(1)!.classList.remove('hidden');
        }
        // if the current URL is one of the mailboxes
        else if(event.url.startsWith('/messages')) {
          navItems[2].classList.add('active');
        }
        // if the current URL is the new post page
        else if(event.url == '/new/Post') {
          // ensure only authenticated users can access this page
          if(this.authService.authenticated) {
            navItems[3].classList.add('active');
            navItems[3].children.item(0)!.classList.add('hidden');
            navItems[3].children.item(1)!.classList.remove('hidden');
          }
        }
        // if the current URL is the user's own profile
        else if(event.url.startsWith('/user')) {
          // if the user is logged in, they have the new post tab, so the new active link
          // is different
          if(this.authService.authenticated) {
            // only marks the link as active if the user is viewing their own profile
            if(event.url == `/user` || event.url == `/user/${this.authService.userData.id}`) {
              navItems[4].classList.add('active');
            }
          }
          // if the user isn't logged in, the new active link is different
          else {
            navItems[3].classList.add('active');
          }
        }
        // if the current URL is the about page
        else if(event.url == '/about') {
          // if the user is logged in, they have the new post tab, so the new active link
          // is different
          if(this.authService.authenticated) {
            navItems[5].classList.add('active');
          }
          // if the user isn't logged in, the new active link is different
          else {
            navItems[4].classList.add('active');
          }
        }
        // if the current URL is the admin's page
        else if(event.url.startsWith('/admin')) {
          // ensure only authenticated users can access this page
          if(this.authService.authenticated) {
            navItems[6].classList.add('active');
            navItems[6].children.item(0)!.classList.add('hidden');
            navItems[6].children.item(1)!.classList.remove('hidden');
          }
        }
      }
    })
  }

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is intialised. It checks the width of the screen and determines
                        whether to display the navigation menu.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    let navLinks = document.getElementById('navLinks') as HTMLDivElement;
    let menuBtn = document.getElementById('menuBtn') as HTMLDivElement;

    // check the client width; if it's bigger than 650px and the menu needs to
    // be shown, show it
    if(document.documentElement.clientWidth > 650 && this.showMenu) {
      if(navLinks.classList.contains('hidden')) {
        navLinks.classList.remove('hidden');
        navLinks.classList.remove('large');
        menuBtn.classList.add('hidden');
        navLinks.setAttribute('aria-hidden', 'false');
        this.showMenu = true;
      }
    }
    // otherwise hide it
    else {
      navLinks.classList.add('large');
      navLinks.classList.add('hidden');
      menuBtn.classList.remove('hidden');
      navLinks.setAttribute('aria-hidden', 'true');
      this.showMenu = false;
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
    this.showSearch = false;

    // if there's something in the search query text field, search for it
    if(searchQuery) {
      // if the textfield was marked red, remove it
      if(document.getElementById('searchQuery')!.classList.contains('missing')) {
        document.getElementById('searchQuery')!.classList.remove('missing');
      }

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
      document.getElementById('searchQuery')!.classList.add('missing');
    }
  }

  /*
  Function Name: toggleNotifications()
  Function Description: Opens the notifications tab.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleNotifications() {
    let width = document.documentElement.clientWidth;
    let navMenu = document.getElementById('navLinks') as HTMLDivElement;

    this.showNotifications = true;

    // if the viewport is smaller than 650px, the user opened the panel through the
    // menu, which needs to be closed
    if(width < 650) {
      this.showMenu = false;
      navMenu.classList.add('hidden');
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
    let width = document.documentElement.clientWidth;
    let navMenu = document.getElementById('navLinks') as HTMLDivElement;

    // if the search is displayed, close it
    if(this.showSearch) {
      this.showSearch = false;

      // if the viewport is smaller than 650px, the user opened the panel through the
      // menu, which needs to be closed
      if(width < 650) {
        navMenu.classList.remove('hidden');
      }
    }
    // otherwise show it
    else {
      // if the viewport is smaller than 650px, the user opened the panel through the
      // menu, which needs to be closed
      if(width < 650) {
        navMenu.classList.add('hidden');
      }

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
      this.showMenu = false;
    }
    // otherwise show it
    else {
      navMenu.classList.remove('hidden');
      this.showMenu = true;
    }
  }

  /*
  Function Name: onResize()
  Function Description: Checks the viewport size on resize. If it's higher than
                      650px, displays the menu in desktop mode.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  @HostListener('window:resize', ['$event'])
  onResize(_event:Event) {
    let width = document.documentElement.clientWidth;
    let navMenu = document.getElementById('navMenu') as HTMLDivElement;
    let navLinks = document.getElementById('navLinks') as HTMLDivElement;
    let menuBtn = document.getElementById('menuBtn') as HTMLDivElement;

    if(width > 650 && navLinks.scrollWidth < navMenu.offsetWidth) {
      if(navLinks.classList.contains('hidden')) {
        navLinks.classList.remove('hidden');
        navLinks.classList.remove('large');
        menuBtn.classList.add('hidden');
        navLinks.setAttribute('aria-hidden', 'false');
        this.showMenu = true;
      }
    }
    else {
      if(!navLinks.classList.contains('hidden')) {
        navLinks.classList.add('large');
        navLinks.classList.add('hidden');
        menuBtn.classList.remove('hidden');
        navLinks.setAttribute('aria-hidden', 'true');
        this.showMenu = false;
      }
    }
  }

  /*
  Function Name: toggleSizePanel()
  Function Description: Toggles the panel through which users can resize all of the
                        app's text.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleSizePanel() {
    if(this.showTextPanel) {
      this.showTextPanel = false;
    }
    else {
      this.showTextPanel = true;
    }
  }

  /*
  Function Name: changeTextSize()
  Function Description: Changes the app's font size.
  Parameters: size - a string to indicate the new size.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeTextSize(size:string) {
    switch(size) {
      case 'smallest':
        document.getElementsByTagName('html')[0]!.style.fontSize = "75%";
        this.checkMenuSize()
        break;
      case 'smaller':
        document.getElementsByTagName('html')[0]!.style.fontSize = "87.5%";
        this.checkMenuSize()
        break;
      case 'regular':
        document.getElementsByTagName('html')[0]!.style.fontSize = "100%";
        this.checkMenuSize()
        break;
      case 'larger':
        document.getElementsByTagName('html')[0]!.style.fontSize = "150%";
        this.checkMenuSize()
        break;
      case 'largest':
        document.getElementsByTagName('html')[0]!.style.fontSize = "200%";
        this.checkMenuSize()
        break;
    }
  }

  /*
  Function Name: checkMenuSize()
  Function Description: Checks whether the menu is too wide for the screen. If it
                        is, it's hidden; otherwise it remains.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkMenuSize() {
    let navMenu = document.getElementById('navMenu') as HTMLDivElement;
    let navLinks = document.getElementById('navLinks') as HTMLDivElement;
    let menuBtn = document.getElementById('menuBtn') as HTMLDivElement;

    // remove the hidden label check the menu's width
    if(navLinks.classList.contains('hidden')) {
      navLinks.classList.remove('hidden');
      navLinks.classList.remove('large');
    }

    // if the larger text makes the navigation menu too long, turn it back
    // to the small-viewport menu
    if(navLinks.scrollWidth >= navMenu.offsetWidth) {
      navLinks.classList.add('large');
      navLinks.classList.add('hidden');
      menuBtn.classList.remove('hidden');
      navLinks.setAttribute('aria-hidden', 'true');
      this.showMenu = false;
    }
    else {
      if(navLinks.classList.contains('hidden')) {
        navLinks.classList.remove('hidden');
        navLinks.classList.remove('large');
      }
      menuBtn.classList.add('hidden');
      navLinks.setAttribute('aria-hidden', 'false');
      this.showMenu = true;
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
