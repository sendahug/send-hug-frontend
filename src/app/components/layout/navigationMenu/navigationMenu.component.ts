/*
  Navigation Menu
  Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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
import {
  Component,
  HostListener,
  AfterViewInit,
  signal,
  computed,
  inject,
  AfterViewChecked,
} from "@angular/core";
import { Router, RouterLink, NavigationEnd } from "@angular/router";
import { faComments, faUserCircle, faCompass, faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faSearch,
  faTimes,
  faTextHeight,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { filter } from "rxjs";

// App-related imports
import { AuthService } from "@app/services/auth.service";
import { ItemsService } from "@app/services/items.service";
import { AlertsService } from "@app/services/alerts.service";
import { SWManager } from "@app/services/sWManager.service";
import { NotificationService } from "@app/services/notifications.service";
import { NotificationsTabComponent } from "@app/components/layout/notifications/notifications.component";
import { SearchFormComponent } from "@app/components/layout/searchForm/searchForm.component";
import SiteLogoSrc from "@/assets/img/Logo.svg";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./navigationMenu.component.html",
  styleUrl: "./navigationMenu.component.less",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FontAwesomeModule,
    NotificationsTabComponent,
    SearchFormComponent,
  ],
})
export class NavigationMenuComponent implements AfterViewInit, AfterViewChecked {
  protected authService = inject(AuthService);
  protected itemsService = inject(ItemsService);
  protected alertsService = inject(AlertsService);
  private router = inject(Router);
  private serviceWorkerM = inject(SWManager);
  protected notificationService = inject(NotificationService);
  readonly showNotifications = signal(false);
  readonly showSearch = signal(false);
  readonly showTextPanel = signal(false);
  readonly showMenuForCurrentWidth = signal(false);
  readonly showMenuUserTriggered = signal(false);
  readonly shouldMenuFloat = signal(false);
  readonly showMenuButton = signal(true);
  readonly navMenuClass = computed(() => ({
    navLinks: true,
    float: this.shouldMenuFloat(),
  }));
  readonly currentlyActiveRoute = signal("/");
  readonly currentTextSize = signal(1);
  readonly navLinksCount = computed(() => {
    let navLinksCount = 3;
    if (this.authService.canUser("read:messages")) navLinksCount += 1;
    if (this.authService.canUser("post:post")) navLinksCount += 1;
    if (this.authService.canUser("read:admin-board")) navLinksCount += 1;

    return navLinksCount;
  });
  readonly menuSize = computed(() => {
    // text, search and notifications, each is ~65px
    const smallerButtons = 3 * 65;
    // the logo is at most 100px
    const logo = 100;

    // nav icons are padded at most by 30px in regular text size,
    // and 50px in large text size
    const iconPadding = this.currentTextSize() > 1 ? 50 : 30;

    // 50 - the general padding
    return (
      50 +
      smallerButtons +
      logo +
      this.navLinksCount() * (45 * this.currentTextSize() + iconPadding)
    );
  });
  SiteLogoSrc = SiteLogoSrc;
  // font awesome icons
  faBars = faBars;
  faComments = faComments;
  faUserCircle = faUserCircle;
  faCompass = faCompass;
  faBell = faBell;
  faSearch = faSearch;
  faTimes = faTimes;
  faTextHeight = faTextHeight;
  faArrowRightFromBracket = faArrowRightFromBracket;

  /*
  Function Name: ngAfterViewInit()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is intialised. It checks for the currently active navigation menu link.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // when navigating to another page, check for updates to the ServiceWorker
        this.serviceWorkerM.updateSW();

        // if the menu was open and the user navigated to another page, close it
        if (!this.showMenuForCurrentWidth() && this.showMenuButton())
          this.showMenuUserTriggered.set(false);
        const currentUrl = event.url;

        // if the current URL is the main page
        // or the about page
        if (["/", "/about", "/login"].includes(currentUrl)) {
          this.currentlyActiveRoute.set(currentUrl);
        } else if (currentUrl.startsWith("/messages")) {
          this.currentlyActiveRoute.set("/messages");
          // if it's any of the messages/admin/new pages
        } else if (currentUrl.startsWith("/admin") || currentUrl.startsWith("/new")) {
          this.currentlyActiveRoute.set(`/${currentUrl.split("/")[1]}`);
        } else if (currentUrl.startsWith("/user")) {
          // if the user is logged in and viewing their own page, or
          // if they're viewing the /user page
          if (
            currentUrl == `/user` ||
            (this.authService.authenticated() &&
              currentUrl == `/user/${this.authService.userData()!.id}`)
          ) {
            this.currentlyActiveRoute.set("/user");
          }
        }
      });
  }

  /**
   * Angular's AfterViewChecked lifecycle hook.
   */
  ngAfterViewChecked(): void {
    this.checkMenuSize();
  }

  /**
   * Gets the class for the given navigation item, with the
   * 'active' class if the given path is currently active.
   * @param path - The path to check for.
   * @returns The class object.
   */
  getClassForNavItem(path: string) {
    return {
      navLink: true,
      active: this.currentlyActiveRoute() == path,
    };
  }

  /*
  Function Name: toggleNotifications()
  Function Description: Opens the notifications tab.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleNotifications() {
    this.showNotifications.set(true);

    // if the viewport is smaller than 650px, the user opened the panel through the
    // menu, which needs to be closed
    if (!this.showMenuForCurrentWidth()) {
      this.showMenuUserTriggered.set(false);
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
    if (this.showSearch()) {
      this.showSearch.set(false);

      // if the viewport is smaller than 650px, the user opened the panel through the
      // menu, which needs to be closed
      if (!this.showMenuForCurrentWidth()) {
        this.showMenuUserTriggered.set(true);
      }
    }
    // otherwise show it
    else {
      // if the viewport is smaller than 650px, the user opened the panel through the
      // menu, which needs to be closed
      if (!this.showMenuForCurrentWidth()) {
        this.showMenuUserTriggered.set(false);
      }

      this.showSearch.set(true);
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
    this.showMenuUserTriggered.set(!this.showMenuUserTriggered());
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
    const width = document.documentElement.clientWidth;
    const navMenu = document.getElementById("navMenu") as HTMLDivElement;

    if (width > 650 && this.menuSize() < navMenu.offsetWidth) {
      this.showMenuForCurrentWidth.set(true);
      this.showMenuUserTriggered.set(true);
      this.showMenuButton.set(false);
      this.shouldMenuFloat.set(false);
    } else {
      this.showMenuButton.set(true);
      this.showMenuForCurrentWidth.set(false);
      this.showMenuUserTriggered.set(false);
      this.shouldMenuFloat.set(true);
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
    this.showTextPanel.set(!this.showTextPanel());

    if (!this.showMenuForCurrentWidth()) {
      this.showMenuUserTriggered.set(!this.showMenuUserTriggered());
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
        this.currentTextSize.set(0.75);
        break;
      case "smaller":
        document.getElementsByTagName("html")[0]!.style.fontSize = "87.5%";
        this.currentTextSize.set(0.875);
        break;
      case "regular":
        document.getElementsByTagName("html")[0]!.style.fontSize = "100%";
        this.currentTextSize.set(1);
        break;
      case "larger":
        document.getElementsByTagName("html")[0]!.style.fontSize = "150%";
        this.currentTextSize.set(1.5);
        break;
      case "largest":
        document.getElementsByTagName("html")[0]!.style.fontSize = "200%";
        this.currentTextSize.set(2);
        break;
    }

    this.checkMenuSize();
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
    const navMenu = document.getElementById("navMenu") as HTMLDivElement;

    // if the larger text makes the navigation menu too long, turn it back
    // to the small-viewport menu
    if (this.menuSize() >= navMenu.offsetWidth) {
      this.showMenuForCurrentWidth.set(false);
      this.showMenuButton.set(true);
      this.shouldMenuFloat.set(true);
    } else {
      this.showMenuForCurrentWidth.set(true);
      this.showMenuUserTriggered.set(true);
      this.shouldMenuFloat.set(false);
      this.showMenuButton.set(false);
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
    this.showNotifications.set(notificationsOn);

    // if the viewport is smaller than 650px, the user opened the panel through the
    // menu, which needs to be reopened
    if (!this.showMenuForCurrentWidth()) {
      this.showMenuUserTriggered.set(true);
    }
  }

  /**
   * Sign out and redirect back to the home page.
   */
  signOutAndRedirect() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
