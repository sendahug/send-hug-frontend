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
import { AuthService } from './auth.service';
import { AlertsService } from './alerts.service';
import { environment } from '../../environments/environment';
import { environment as prodEnv } from '../../environments/environment.prod';

export type BookmarkType = 'Posts' | 'Messages' | 'Users';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  readonly serverUrl = environment.production ? prodEnv.backend.domain! : environment.backend.domain;

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
  constructor(
    private Http:HttpClient,
    private authService:AuthService,
    private alertsService:AlertsService
  ) {

  }

  /*
  Function Name: getBookmarks()
  Function Description: Gets a paginated list of the given bookmarks type.
  Parameters: type (string) - the type of bookmarks to fetch.
  ----------------
  Programmer: Shir Bar Lev.
  */
  getBookmarks(type:BookmarkType) {
    const Url = this.serverUrl + `/bookmarks/${type}`;
    const params = new HttpParams().set('page', `${this.bookmarksPage[type]}`);

    // send the request
    this.Http.get(Url, {
      headers: this.authService.authHeader,
      params: params
    }).subscribe((response:any) => {
      // if the type of fetched bookmarks is users
      if(type == 'Users') {
        let users = response.users;
        users.forEach((element:any) => {
          let user:OtherUser = {
            id: element.id,
            displayName: element.displayName,
            givenHugs: element.givenH,
            receivedHugs: element.receivedH,
            postsNum: element.postsNum,
            role: element.role
          }
          this.bookmarks[type].push(user);
        });
      }
      // otherwise the array can be taken as is
      else {
        this.bookmarks[type] = response[type.toLowerCase()];
      }
      // set the page variables
      this.bookmarksPage[type] = response.current_page;
      this.totalBookmarksPages[type] = response.total_pages;
      this.isBookmarksResolved[type].next(true);
    }, (err:HttpErrorResponse) => {
      // if there was an error, alert the user
      this.isBookmarksResolved[type].next(true);
      this.alertsService.createErrorAlert(err);
    })
  }
}
