/*
	My Posts
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
import { Component, OnInit, Input } from '@angular/core';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';

// App-related imports
import { Post } from '../../interfaces/post.interface';
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './myPosts.component.html'
})
export class MyPosts implements OnInit {
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report:boolean;
  reportedItem: Post | undefined;
  reportType = 'Post';
  // loader sub-component variable
  waitFor = 'user posts';
  // The user whose posts to fetch
  @Input()
  userID:number | undefined;
  user!: 'self' | 'other';
  // icons
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;

  // CTOR
  constructor(
    public itemsService:ItemsService,
    public authService:AuthService,
    private postsService:PostsService
  ) {
      // if there's a user ID in the viewed profile, get that user's posts
      if(this.userID) {
        this.itemsService.getUserPosts(this.userID);
        this.user = 'other';
      }
      // if there isn't, it's the user's own profile, so get their posts
      else {
        // wait for user data to be resolved; that way, if there user just
        // signed up, the component waits for user the user to be added to the
        // database and only then fetches posts
        this.authService.isUserDataResolved.subscribe((value) => {
          if(value) {
            itemsService.getUserPosts(this.authService.userData.id!);
            this.user = 'self';
          }
        });
      }

      this.editMode = false;
      this.delete = false;
      this.report = false;
  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the requested user's
                        identity (myself or someone else).
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    // if the user ID is different than the logged in user, it's someone else
    if(this.userID && this.userID != this.authService.userData.id) {
      this.user = 'other';
    }
    // otherwise, if it's the same ID or there's no ID, get the user's profile
    else {
      this.user = 'self';
    }
  }

  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: post (Post) - Post to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post:Post) {
    this.editType = 'post';
    this.postToEdit = post;
    this.editMode = true;
  }

  /*
  Function Name: changeMode()
  Function Description: Remove the edit popup.
  Parameters: edit (boolean) - indicating whether edit mode should be active.
                               When the user finishes editing, the event emitter
                               in the popup component sends 'false' to this function
                               to remove the popup.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeMode(edit:boolean) {
    this.editMode = edit;
  }

  /*
  Function Name: deletePost()
  Function Description: Send a request to the items service to delete a post.
  Parameters: post_id (number) - ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(post_id:number) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = post_id;
  }

  /*
  Function Name: deleteAllPosts()
  Function Description: Send a request to the items service to delete all of the user's
                        posts.
  Parameters: post_id (number) - ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteAllPosts() {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'All posts';
    // if there's a user ID, take the selected user's ID. Otherwise, it's the
    // user's own profile, so take their ID from the Auth Service.
    this.itemToDelete = this.userID ? this.userID : this.authService.userData.id;
  }

  /*
  Function Name: reportPost()
  Function Description: Opens the popup to report a post.
  Parameters: post (Post) - the Post to report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost(post:Post) {
	  this.editMode = true;
	  this.delete = false;
	  this.report = true;
	  this.reportedItem = post;
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written. The hug
                        itself is sent by the items service.
  Parameters: itemID (number) - ID of the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug(itemID:number) {
    let item = {};
    item = this.itemsService.userPosts.other.filter(e => e.id == itemID)[0];
    this.postsService.sendHug(item);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of user posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    this.itemsService.userPostsPage[this.user] += 1;
    if(this.user == 'self') {
      this.itemsService.getUserPosts(this.authService.userData.id!);
    }
    else {
      this.itemsService.getUserPosts(this.userID!);
    }
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of user posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    this.itemsService.userPostsPage[this.user] -= 1;
    if(this.user == 'self') {
      this.itemsService.getUserPosts(this.authService.userData.id!);
    }
    else {
      this.itemsService.getUserPosts(this.userID!);
    }
  }
}
