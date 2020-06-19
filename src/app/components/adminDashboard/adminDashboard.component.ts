/*
	Admin Dashboard
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App imports
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './adminDashboard.component.html'
})
export class AdminDashboard {
  screen:string = '';

  // CTOR
  constructor(
    private route:ActivatedRoute,
    public authService:AuthService
  ) {
    this.route.url.subscribe(params => {
      if(params[0].path) {
        this.screen = params[0].path;
      }
      else {
        this.screen = 'main';
      }
    })
  }
}
