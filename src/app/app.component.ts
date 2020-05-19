import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  navTabs = [{
    name: 'Home',
    link: '/'
  }, {
    name: 'Messages',
    link: ''
  }, {
    name: 'User Page',
    link: '/user'
  }];
  
  constructor() {

  }
}
