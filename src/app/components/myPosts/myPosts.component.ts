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
  userPosts: Post[] = [];

  constructor(private itemsService:ItemsService,
    private authService:AuthService,
    private router:Router) {
      itemsService.getUserPosts(this.authService.userData.id!);
  }

  ngOnInit() {
    this.userPosts = ItemsService.userPosts;
  }

  editPost(post:Post) {
    
  }

  // Delete a post
  deletePost(post_id:number) {
    this.itemsService.deletePost(post_id);
  }
}
