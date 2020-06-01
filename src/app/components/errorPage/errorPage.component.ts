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
  error: ErrorMessage = {
    title: 'Sorry!',
    message: `The page you were looking for doesn\'t exist.`,
    code: 404
  }

  constructor(private location:Location) {

  }

  // Sends the user back to the previous page
  goBack() {
    this.location.back();
  }
}
