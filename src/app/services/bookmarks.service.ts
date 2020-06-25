/*
	Items Service
	Send a Hug Service
*/

// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { Message } from '../interfaces/message.interface';
import { OtherUser } from '../interfaces/otherUser.interface';
import { AlertsService } from './alerts.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  // bookmarks variables
  bookmarks: {
    Posts: Post[],
    Messages: Message[],
    Users: OtherUser[]
  } = {
    Posts: [],
    Messages: [],
    Users: []
  }
  bookmarksPage = {
    Posts: 1,
    Messages: 1,
    Users: 1
  }
  totalBookmarksPages = {
    Posts: 1,
    Messages: 1,
    Users: 1
  }
  isBookmarksResolved = {
    Posts: new BehaviorSubject(false),
    Messages: new BehaviorSubject(false),
    Users: new BehaviorSubject(false)
  }

  // CTOR
  constructor() {

  }
}
