/*
	Icon Editor
	Send a Hug Component Tests
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020 Send A Hug

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

import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import {} from 'jasmine';
import { APP_BASE_HREF } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import { HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { IconEditor } from "./iconEditor.component";
import { AuthService } from '../../services/auth.service';
import { MockAuthService } from '../../services/auth.service.mock';

describe('SitePolicies', () => {
  // Before each test, configure testing environment
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
        IconEditor,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    // trigger login
    TestBed.inject(AuthService).login();
  });

  // Check the page is created
  it('should create the component', () => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    expect(iconEditor).toBeTruthy();
  });

  // Check the variables are set correctly
  it('should get the icon data from the AuthService', () => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;

    expect(iconEditor.selectedIcon).toBe('kitty');
    expect(iconEditor.iconColours.character).toBe('#BA9F93');
    expect(iconEditor.iconColours.lbg).toBe('#e2a275');
    expect(iconEditor.iconColours.rbg).toBe('#f8eee4');
    expect(iconEditor.iconColours.item).toBe('#f4b56a');
  });

  // Check the icon changes when the radio button is clicked
  it('should change icon when radio buttons are clicked', (done: DoneFn) => {
    const fixture = TestBed.createComponent(IconEditor);
    const iconEditor = fixture.componentInstance;
    const iconEditorDOM = fixture.nativeElement;
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.selectedIcon).toBe('kitty');

    iconEditorDOM.querySelector('#cRadioOption1').click();
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.selectedIcon).toBe('bear');

    iconEditorDOM.querySelector('#cRadioOption3').click();
    fixture.detectChanges();

    // before changing icon
    expect(iconEditor.selectedIcon).toBe('dog');
    done();
  });
});
