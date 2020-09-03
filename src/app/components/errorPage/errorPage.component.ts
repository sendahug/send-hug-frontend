/*
	Error Page
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
import { Location } from '@angular/common';
import { faArrowAltCircleLeft } from '@fortawesome/free-regular-svg-icons';

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
  // icons
  faArrowAltCircleLeft = faArrowAltCircleLeft;

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
