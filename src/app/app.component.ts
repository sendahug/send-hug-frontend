/*
  App Component
  Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Angular imports
import { Component, OnInit, HostListener, AfterViewInit, signal, computed } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { faComments, faUserCircle, faCompass, faBell } from "@fortawesome/free-regular-svg-icons";
import { faBars, faSearch, faTimes, faTextHeight } from "@fortawesome/free-solid-svg-icons";

// App-related imports
import { AuthService } from "./services/auth.service";
import { ItemsService } from "./services/items.service";
import { AlertsService } from "./services/alerts.service";
import { SWManager } from "./services/sWManager.service";
import { NotificationService } from "./services/notifications.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit, AfterViewInit {
  showNotifications = false;
  showSearch = false;
  showTextPanel = false;
  showMenu = signal(false);
  navMenuClass = computed(() => (this.showMenu() ? "navLinks" : "navLinks hidden"));
  showMenuButton = signal(false);
  menuButtonClass = computed(() => (this.showMenuButton() ? "navLink" : "navLink hidden"));
  canShare = false;
  inactiveLinkClass = "navLink";
  activeLinkClass = "navLink active";
  currentlyActiveRoute = signal("/");
  searchForm = this.fb.group({
    searchQuery: this.fb.control("", [Validators.required, Validators.minLength(1)]),
  });
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
    public authService: AuthService,
    private itemsService: ItemsService,
    private alertsService: AlertsService,
    private router: Router,
    private serviceWorkerM: SWManager,
    public notificationService: NotificationService,
    private fb: FormBuilder,
  ) {
    this.authService.checkHash();

    // if the user is logged in, and their data is fetched, start auto-refresh
    this.authService.isUserDataResolved.subscribe((value) => {
      if (value) {
        // if push notifications are enabled, get subscription and auto-refresh data from localStorage
        if (this.authService.userData.pushEnabled) {
          this.notificationService.getSubscription();
        }

        // if auto-refresh is enabled, start auto-refresh
        if (this.authService.userData.autoRefresh) {
          this.notificationService.startAutoRefresh();
        }
      }
    });
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

    if (document.documentElement.clientWidth > 650) {
      this.showMenu.set(true);
      this.showMenuButton.set(false);
    } else {
      this.showMenu.set(false);
      this.showMenuButton.set(true);
    }

    // when navigating to another page, check for updates to the ServiceWorker
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.serviceWorkerM.updateSW();

        // if the menu was open and the user navigated to another page, close it
        if (this.showMenu() && document.documentElement.clientWidth < 650) this.showMenu.set(false);
      }
    });

    if ("share" in navigator) {
      this.canShare = true;
    } else {
      this.canShare = false;
    }
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
      if (event instanceof NavigationStart) {
        // if the current URL is the main page
        // or the about page
        if (event.url == "/" || event.url == "/about") {
          this.currentlyActiveRoute.set(event.url);
          // if it's any of the messages/admin/new pages
        } else if (
          event.url.startsWith("/messages") ||
          event.url.startsWith("/admin") ||
          event.url.startsWith("/new")
        ) {
          this.currentlyActiveRoute.set(`/${event.url.split("/")[1]}`);
        } else if (event.url.startsWith("/user")) {
          // if the user is logged in and viewing their own page, or
          // if they're viewing the /user page
          if (
            event.url == `/user` ||
            (this.authService.authenticated && event.url == `/user/${this.authService.userData.id}`)
          ) {
            this.currentlyActiveRoute.set("/user");
          }
        }
      }
    });
  }

  /*
  Function Name: searchApp()
  Function Description: Initiates a search for the given query.
  Parameters: e (Event) - Click event (on the search button).
              searchQuery (string) - Term to search for.
  ----------------
  Programmer: Shir Bar Lev.
  */
  searchApp(e: Event, searchQuery: string) {
    e.preventDefault();

    // if there's something in the search query text field, search for it
    if (searchQuery) {
      this.showSearch = false;
      this.itemsService.sendSearch(searchQuery);
      // clears the search box
      this.searchForm.reset();
      //navigate to search results
      this.router.navigate(["search"], {
        queryParams: {
          query: searchQuery,
        },
      });
    }
    // otherwise alert the user there are no empty searches
    else {
      this.alertsService.createAlert({
        message: "Search query is empty! Please write a term to search for.",
        type: "Error",
      });
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
    this.showNotifications = true;

    // if the viewport is smaller than 650px, the user opened the panel through the
    // menu, which needs to be closed
    if (width < 650) {
      this.showMenu.set(false);
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

    // if the search is displayed, close it
    if (this.showSearch) {
      this.showSearch = false;

      // if the viewport is smaller than 650px, the user opened the panel through the
      // menu, which needs to be closed
      if (width < 650) {
        this.showMenu.set(true);
      }
    }
    // otherwise show it
    else {
      // if the viewport is smaller than 650px, the user opened the panel through the
      // menu, which needs to be closed
      if (width < 650) {
        this.showMenu.set(false);
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
    this.showMenu.set(!this.showMenu());
  }

  /*
  Function Name: onResize()
  Function Description: Checks the viewport size on resize. If it's higher than
                      650px, displays the menu in desktop mode.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  @HostListener("window:resize", ["$event"])
  onResize(_event: Event) {
    let width = document.documentElement.clientWidth;
    let navMenu = document.getElementById("navMenu") as HTMLDivElement;
    let navLinks = document.getElementById("navLinks") as HTMLDivElement;

    if (width > 650 && navLinks.scrollWidth < navMenu.offsetWidth) {
      if (!this.showMenu()) {
        this.showMenu.set(true);
      }
      this.showMenuButton.set(false);
    } else {
      if (this.showMenu()) {
        this.showMenuButton.set(true);
        this.showMenu.set(false);
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
    if (this.showTextPanel) {
      this.showTextPanel = false;
    } else {
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
  changeTextSize(size: string) {
    switch (size) {
      case "smallest":
        document.getElementsByTagName("html")[0]!.style.fontSize = "75%";
        this.checkMenuSize();
        break;
      case "smaller":
        document.getElementsByTagName("html")[0]!.style.fontSize = "87.5%";
        this.checkMenuSize();
        break;
      case "regular":
        document.getElementsByTagName("html")[0]!.style.fontSize = "100%";
        this.checkMenuSize();
        break;
      case "larger":
        document.getElementsByTagName("html")[0]!.style.fontSize = "150%";
        this.checkMenuSize();
        break;
      case "largest":
        document.getElementsByTagName("html")[0]!.style.fontSize = "200%";
        this.checkMenuSize();
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
    let navMenu = document.getElementById("navMenu") as HTMLDivElement;
    let navLinks = document.getElementById("navLinks") as HTMLDivElement;

    // remove the hidden label check the menu's width
    if (!this.showMenu()) {
      this.showMenu.set(true);
    }

    // if the larger text makes the navigation menu too long, turn it back
    // to the small-viewport menu
    if (navLinks.scrollWidth + 50 >= navMenu.offsetWidth) {
      this.showMenu.set(false);
      this.showMenuButton.set(true);
    } else {
      this.showMenu.set(true);

      if (document.documentElement.clientWidth > 650) {
        this.showMenuButton.set(false);
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
  changeMode(notificationsOn: boolean) {
    this.showNotifications = notificationsOn;
  }

  /*
  Function Name: shareSite()
  Function Description: Triggers the Share API to let the user share the website.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  shareSite() {
    navigator
      .share({
        title: "Send A Hug",
        url: "https://send-hug.herokuapp.com/",
      })
      .catch((_err) => {
        this.alertsService.createAlert({
          type: "Error",
          message: "Sharing failed. Please try again!",
        });
      });
  }
}
