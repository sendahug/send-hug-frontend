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
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
          AppComponent
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
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
});
