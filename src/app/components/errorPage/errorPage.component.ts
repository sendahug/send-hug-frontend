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
    title: '',
    message: '',
    code: 0
  }

  constructor() {

  }
}
