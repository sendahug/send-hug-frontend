import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Post } from '../../interfaces/post.interface';
import { ItemsService } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './myPosts.component.html'
})
export class MyPosts implements OnInit {
  postToEdit: Post | undefined;
  editType: string = 'post';
  editMode:boolean;
  waitFor = 'user posts';

  constructor(public itemsService:ItemsService,
    private authService:AuthService,
    private router:Router) {
      itemsService.getUserPosts(this.authService.userData.id!);
      this.editMode = false;
  }

  ngOnInit() {

  }

  editPost(post:Post) {
    this.postToEdit = post;
    this.editMode = true;
  }

  // remove edit popup
  changeMode(edit:boolean) {
    this.editMode = edit;
  }

  // Delete a post
  deletePost(post_id:number) {
    this.itemsService.deletePost(post_id);
  }

  // next page of user posts
  nextPage() {
    this.itemsService.userPostsPage += 1;
    this.itemsService.getUserPosts(this.authService.userData.id!);
  }

  // previous page of user posts
  prevPage() {
    this.itemsService.userPostsPage -= 1;
    this.itemsService.getUserPosts(this.authService.userData.id!);
  }
}
