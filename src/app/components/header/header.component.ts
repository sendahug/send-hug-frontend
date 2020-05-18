import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class siteHeader implements OnInit {
  navTabs = [{
    name: 'Home',
    link: ''
  }, {
    name: 'Messages',
    link: ''
  }, {
    name: 'User Page',
    link: ''
  }];

  constructor() {

  }

  ngOnInit() {

  }
}
