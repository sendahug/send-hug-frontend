import { fakeAsync, TestBed } from "@angular/core/testing";
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


describe("AppComponent", () => {
    beforeEach(fakeAsync(() => {
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule,
          platformBrowserDynamicTesting());

      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          HttpClientModule,
          ServiceWorkerModule.register('sw.js')
        ],
        declarations: [
          AppComponent
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
      }).compileComponents();
    }));

    it('should create the app', fakeAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    }));
});
