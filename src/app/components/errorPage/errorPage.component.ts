import { Component } from '@angular/core';

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

  constructor() {

  }
}
