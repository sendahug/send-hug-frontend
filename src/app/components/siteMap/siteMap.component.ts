/*
	Site Map
	Send a Hug Component
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
*/

// Angular imports
import { Component } from '@angular/core';
import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-site-map',
  templateUrl: './siteMap.component.html'
})
export class SiteMap {
  routes: Route[] = [];

  // CTOR
  constructor(private router:Router) {
    this.router.config.forEach((route) => {
      this.routes.push(route);
    });
  }
}
