/*
	Admin Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';

// App-related imports
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;

  constructor() {

  }
}
