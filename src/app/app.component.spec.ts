import 'zone.js/dist/zone';
import "zone.js/dist/proxy";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from "./app.component";
import { NotificationsTab } from './components/notifications/notifications.component';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from './services/auth.service';
import { MockAuthService } from './services/auth.service.mock';
import { ItemsService } from './services/items.service';
import { MockItemsService } from './services/items.service.mock';
import { AlertsService } from './services/alerts.service';
import { MockAlertsService } from './services/alerts.service.mock';
import { SWManager } from './services/sWManager.service';
import { MockSWManager } from './services/sWManager.service.mock';
import { NotificationService } from './services/notifications.service';
import { MockNotificationService } from './services/notifications.service.mock';

declare const viewport:any;

describe("AppComponent", () => {
    beforeEach(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js', { enabled: false }),
          FontAwesomeModule
        ],
        declarations: [
          AppComponent,
          NotificationsTab
        ],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: AuthService, useClass: MockAuthService },
          { provide: ItemsService, useClass: MockItemsService },
          { provide: AlertsService, useClass: MockAlertsService },
          { provide: SWManager, useClass: MockSWManager },
          { provide: NotificationService, useClass: MockNotificationService }
        ]
      }).compileComponents();
    });

    // Check that the app is created
    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    // Check that there are valid navigation links
    it('should contain valid navigation links', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const componentHtml = fixture.debugElement.nativeElement;

      let navMenu = componentHtml.querySelector('#navLinks');
			expect(navMenu).toBeDefined();
			expect(navMenu!.children.length).not.toBe(0);

			// check each navingation item to ensure it contains a link
			let navMenuItems = navMenu!.children;
			for(var i = 0; i < navMenuItems.length; i++) {
				expect(navMenuItems.item(i)).toBeDefined();
				expect(navMenuItems!.item(i)!.children.item(0)!.getAttribute('href')).toBeDefined();
				expect(navMenuItems!.item(i)!.children.item(0)!.getAttribute('href')).not.toBe('');
			}
    });

    // Check that the notifications tab is hidden
    it('has hidden notifications tab', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      const componentHtml = fixture.debugElement.nativeElement;

      expect(component.showNotifications).toBe(false);
			expect(componentHtml.querySelector('#mainContent').children.length).toEqual(2);
    });

    // Check that the notifications tab appears when the button is clicked
    it('has a notifications tab that appears when its icon is clicked', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const mainContent = componentHtml.querySelector('#mainContent');

      // Check the tab is initially hidden
      expect(component.showNotifications).toBe(false);
			expect(mainContent.querySelector('app-notifications')).toBeNull();

      // Simulate a click on the button
      componentHtml.querySelector('#notificationsBtn').click();

      // Check the tab is now visible
      expect(component.showNotifications).toBe(true);
      expect(mainContent.querySelector('app-notifications')).toBeDefined();
    });

    // Check that the search panel is hidden
    it('has hidden search', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      const componentHtml = fixture.debugElement.nativeElement;

      expect(component.showSearch).toBe(false);
			expect(componentHtml.querySelector('#siteHeader').children.length).toEqual(2);
    });

    // Check that the search panel appears when the button is clicked
    it('has a search which appears when the icon is clicked', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const siteHeader = componentHtml.querySelector('#siteHeader');

      // Check the panel is initially hidden
      expect(component.showSearch).toBe(false);
			expect(siteHeader.querySelector('#search')).toBeNull();

      // Simulate a click on the button
      componentHtml.querySelector('#searchBtn').click();

      // Check the panel is now visible
      expect(component.showSearch).toBe(true);
			expect(siteHeader.querySelector('#search')).toBeDefined();
    });

    // Check that clicking 'search' triggers the ItemsService
    it('should pass search query to the ItemsService when clicking search', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const searchSpy = spyOn(component, 'searchApp').and.callThrough();
      const searchServiceSpy = spyOn(component['itemsService'], 'sendSearch');
      spyOn(component['router'], 'navigate');

      // open search panel and run search
      componentHtml.querySelector('#searchBtn').click();
      fixture.detectChanges();
      tick();
      componentHtml.querySelector('#searchQuery').value = 'search';
      componentHtml.querySelectorAll('.sendData')[0].click();

      // check the spies were triggered
      expect(searchSpy).toHaveBeenCalled();
      expect(searchServiceSpy).toHaveBeenCalled();
      expect(searchServiceSpy).toHaveBeenCalledWith('search');
    }));

    // Check that an empty search query isn't allowed
    it('should prevent empty searches', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const searchSpy = spyOn(component, 'searchApp').and.callThrough();
      const searchServiceSpy = spyOn(component['itemsService'], 'sendSearch');

      // open search panel and run search
      componentHtml.querySelector('#searchBtn').click();
      fixture.detectChanges();
      tick();
      componentHtml.querySelector('#searchQuery').value = '';
      componentHtml.querySelectorAll('.sendData')[0].click();

      // check one spy was triggered and one wasn't
      expect(searchSpy).toHaveBeenCalled();
      expect(searchServiceSpy).not.toHaveBeenCalled();
      expect(componentHtml.querySelectorAll('.alertMessage')[0]).toBeTruthy();
    }));

    // Check that the font size panel is hidden
    it('should have a hidden font size panel', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const component = fixture.componentInstance;
      const componentHtml = fixture.debugElement.nativeElement;

      expect(component.showTextPanel).toBe(false);
			expect(componentHtml.querySelector('#siteHeader').children.length).toEqual(2);
    });

    // Check that the font size panel appears when the button is clicked
    it('has a font size which appears when the icon is clicked', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const siteHeader = componentHtml.querySelector('#siteHeader');

      // Check the panel is initially hidden
      expect(component.showTextPanel).toBe(false);
			expect(siteHeader.querySelector('#textPanel')).toBeNull();

      // Simulate a click on the button
      componentHtml.querySelector('#textSize').click();

      // Check the panel is now visible
      expect(component.showTextPanel).toBe(true);
			expect(siteHeader.querySelector('#textPanel')).toBeDefined();
    });

    // Check that the font size panel changes the site's font size
    it('has a font size that changes according to user choice', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const fontButton = componentHtml.querySelector('#textSize');
      const menuSpy = spyOn(component, 'checkMenuSize');

      // open the text panel
      fontButton.click();
      fixture.detectChanges();
      tick();
      const fontPanelButtons = componentHtml.querySelector('#textPanel').querySelectorAll('.appButton');

      // check the initial font size
      expect(document.getElementsByTagName('html')[0]!.style.fontSize).toBe('');
      expect(menuSpy).not.toHaveBeenCalled();

      // change the font size to the smallest
      fontPanelButtons[0]!.click();
      fixture.detectChanges();
      tick();

      // check the font size was changed
      expect(document.getElementsByTagName('html')[0]!.style.fontSize).toBe('75%');
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(1);

      // change the font size to the smaller
      fontPanelButtons[1]!.click();
      fixture.detectChanges();
      tick();

      // check the font size was changed
      expect(document.getElementsByTagName('html')[0]!.style.fontSize).toBe('87.5%');
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(2);

      // change the font size to the normal
      fontPanelButtons[2]!.click();
      fixture.detectChanges();
      tick();

      // check the font size was changed
      expect(document.getElementsByTagName('html')[0]!.style.fontSize).toBe('100%');
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(3);

      // change the font size to the larger
      fontPanelButtons[3]!.click();
      fixture.detectChanges();
      tick();

      // check the font size was changed
      expect(document.getElementsByTagName('html')[0]!.style.fontSize).toBe('150%');
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(4);

      // change the font size to the largest
      fontPanelButtons[4]!.click();
      fixture.detectChanges();
      tick();

      // check the font size was changed
      expect(document.getElementsByTagName('html')[0]!.style.fontSize).toBe('200%');
      expect(menuSpy).toHaveBeenCalled();
      expect(menuSpy).toHaveBeenCalledTimes(5);
    }));

    // check the menu is shown if the screen is wide enough
    it('should show the menu if the screen is wide enough', () => {
      const fixture = TestBed.createComponent(AppComponent);
      viewport.set(700);
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      fixture.detectChanges();

      expect(component.showMenu).toBeTrue();
      expect(componentHtml.querySelector('#navLinks')!.classList).not.toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).toContain('hidden');
    });

    // check the menu is hidden if the screen isn't wide enough
    it('should hide the menu if the screen isn\'t wide enough', () => {
      const fixture = TestBed.createComponent(AppComponent);
      viewport.set(500);
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      fixture.detectChanges();

      expect(component.showMenu).toBeFalse();
      expect(componentHtml.querySelector('#navLinks')!.classList).toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).not.toContain('hidden');
    });

    // check the menu is shown when clicking the menu button
    it('should show the menu when the menu button is clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      viewport.set(500);
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      fixture.detectChanges();
      tick();

      // pre-click check
      expect(component.showMenu).toBeFalse();
      expect(componentHtml.querySelector('#navLinks')!.classList).toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).not.toContain('hidden');

      // trigger click
      componentHtml.querySelector('#menuBtn').click();
      fixture.detectChanges();
      tick();

      // post-click check
      expect(component.showMenu).toBeTrue();
      expect(componentHtml.querySelector('#navLinks')!.classList).not.toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).not.toContain('hidden');
    }));

    // check the menu is hidden when clicked again
    it('should hide the menu when the menu button is clicked again', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      viewport.set(500);
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      fixture.detectChanges();
      tick();

      // pre-click check
      expect(component.showMenu).toBeFalse();
      expect(componentHtml.querySelector('#navLinks')!.classList).toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).not.toContain('hidden');

      // trigger click
      componentHtml.querySelector('#menuBtn').click();
      fixture.detectChanges();
      tick();

      // post-click check
      expect(component.showMenu).toBeTrue();
      expect(componentHtml.querySelector('#navLinks')!.classList).not.toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).not.toContain('hidden');

      // trigger another click
      componentHtml.querySelector('#menuBtn').click();
      fixture.detectChanges();
      tick();

      // post-click check
      expect(component.showMenu).toBeFalse();
      expect(componentHtml.querySelector('#navLinks')!.classList).toContain('hidden');
      expect(componentHtml.querySelector('#menuBtn')!.classList).not.toContain('hidden');
    }));

    // should hide the nav menu if it gets too long
    it('should hide nav menu if it gets too long', () => {
      const fixture = TestBed.createComponent(AppComponent);
      viewport.set(600);
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const checkSpy = spyOn(component, 'checkMenuSize').and.callThrough();
      fixture.detectChanges();

      const navMenu = componentHtml.querySelector('#navMenu');
      const navLinks = componentHtml.querySelector('#navLinks');
      navLinks.style.width = '600px';
      navMenu.style.maxWidth = '600px';
      navMenu.style.display = 'flex';
      component.changeTextSize('largest');
      fixture.detectChanges();

      expect(checkSpy).toHaveBeenCalled();
      expect(navLinks.classList).toContain('hidden');
      expect(navLinks.classList).toContain('large');
      expect(componentHtml.querySelector('#menuBtn').classList).not.toContain('hidden');
    });

    // should hide the menu if it gets too long and show it again if it's not too long
    it('should show the menu again if it\'s not to long again', () => {
      const fixture = TestBed.createComponent(AppComponent);
      viewport.set(600);
      const component = fixture.componentInstance;
      const componentHtml = fixture.nativeElement;
      const checkSpy = spyOn(component, 'checkMenuSize').and.callThrough();
      fixture.detectChanges();

      const navMenu = componentHtml.querySelector('#navMenu');
      const navLinks = componentHtml.querySelector('#navLinks');
      navLinks.style.width = '600px';
      navMenu.style.maxWidth = '600px';
      navMenu.style.display = 'flex';
      component.changeTextSize('largest');
      fixture.detectChanges();

      expect(checkSpy).toHaveBeenCalled();
      expect(navLinks.classList).toContain('hidden');
      expect(navLinks.classList).toContain('large');
      expect(componentHtml.querySelector('#menuBtn').classList).not.toContain('hidden');

      navLinks.style.width = '500px';
      component.changeTextSize('smaller');
      fixture.detectChanges();

      expect(checkSpy).toHaveBeenCalled();
      expect(navLinks.classList).not.toContain('hidden');
      expect(navLinks.classList).not.toContain('large');
      expect(component.showMenu).toBeTrue();
    });
});
