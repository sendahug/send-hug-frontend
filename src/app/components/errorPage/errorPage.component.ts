/*
	Error Page
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { Location } from '@angular/common';

// Error message interface
interface ErrorMessage {
  title: string;
  message: string;
  code: number;
}

@Component({
  selector: 'app-error-page',
  templateUrl: './errorPage.component.html'
})
export class ErrorPage {
  // Error message to display onscreen
  error: ErrorMessage = {
    title: 'Sorry!',
    message: `The page you were looking for doesn\'t exist.`,
    code: 404
  }

  // CTOR
  constructor(private location:Location) {

  }

  /*
  Function Name: goBack()
  Function Description: Sends the user back to the previous page
  Parameters: e (event) - Post to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  goBack() {
    this.location.back();
  }
}
