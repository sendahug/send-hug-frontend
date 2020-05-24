// Angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// App-related imports
import { Post } from '../interfaces/post.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private serverUrl = 'http://localhost:5000'
  static newItemsArray: Post[] = [];
  static sugItemsArray: Post[] = [];
  static fullNewItems: Post[] = [];
  static fullSugItems: Post[] = [];
  static userPosts: Post[] = [];

  // CTOR
  constructor(private Http: HttpClient) {

  }

  // Gets ten recent and ten suggested items
  getItems() {
    this.Http.get(this.serverUrl).subscribe((response:any) => {
      let data = response.data;
      ItemsService.newItemsArray = data.recent;
      ItemsService.sugItemsArray = data.suggested;
    })
  }

  // Gets a list of new items.
  getNewItems() {
    const Url = this.serverUrl + '/new-items';
    this.Http.get(Url).subscribe((response: any) => {
      let data = response.data.items;
      ItemsService.fullNewItems = data;
    })
  }

  // Gets a list of suggested items
  getSuggestedItems() {
    const Url = this.serverUrl + '/suggested-items';
    this.Http.get(Url).subscribe((response: any) => {
      let data = response.data.items;
      ItemsService.fullSugItems = data;
    })
  }

  // Gets the user's posts
  getUserPosts(userID:number) {
    const Url = this.serverUrl + `/users/${userID}/posts`;
    this.Http.get(Url).subscribe((response:any) => {
      let data = response.data.posts;
      ItemsService.userPosts = data;
    })
  }

  // Send a message
  sendMessage(message: Message) {
    const Url = this.serverUrl + '/messages';
    this.Http.post(Url, message).subscribe((response:any) => {
      console.log(response);
    })
  }

  // Post a new post
  sendPost(post: Post) {
    const Url = this.serverUrl + '/posts';
    this.Http.post(Url, post).subscribe((response:any) => {
      console.log(response);
    })
  }

  // Delete a post
  deletePost(post_id:number) {
    const Url = this.serverUrl + `/posts/${post_id}`;
    this.Http.delete(Url).subscribe((response:any) => {
      console.log(response);
    })
  }

  // Edit a post
  editPost(post: Post) {
    const Url = this.serverUrl + `/posts/${post.id}`;
    this.Http.patch(Url, post).subscribe((response:any) => {
      console.log(response);
    })
  }

  // Send a hug
  sendHug(item: any) {
    const Url = this.serverUrl + '/posts';
    item.givenHugs += 1;
    this.Http.patch(Url, item).subscribe((response:any) => {
      console.log(response);
    })
  }
}
