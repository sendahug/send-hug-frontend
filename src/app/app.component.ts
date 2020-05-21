import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ AuthService ]
})
export class AppComponent {
  navTabs = [{
    name: 'Home',
    link: '/'
  }, {
    name: 'Messages',
    link: '/messages'
  }, {
    name: 'User Page',
    link: '/user'
  }];
  loggedIn = false;

  constructor(private authService:AuthService) {
    this.loggedIn = this.authService.authenticated;
  }
}
