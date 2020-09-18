/*
	Main Page
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
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { faComment, faEdit, faFlag } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingHeart, faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './mainPage.component.html'
})
export class MainPage implements OnInit, AfterViewChecked {
  showMenuNum: string | null = null;
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode:boolean;
  delete:boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report:boolean;
  reportedItem: Post | undefined;
  reportType: 'Post' | undefined;
  waitFor = 'main page';
  // icons
  faComment = faComment;
  faEdit = faEdit;
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;
  faTimes = faTimes;
  faEllipsisV = faEllipsisV;

  // CTOR
  constructor(
    public itemsService: ItemsService,
    public authService:AuthService,
    public postsService:PostsService
  ) {
    this.postsService.getItems();
    this.editMode = false;
    this.delete = false;
    this.report = false;
  }

  ngOnInit() {

  }

  /*
  Function Name: ngAfterViewInit()
  Function Description: This method is automatically triggered by Angular once the component's
                        view is intialised. It checks whether posts' buttons are
                        too big for their container; if they are, changes the menu to be
                        a floating one.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    let newPosts = document.querySelectorAll('.newItem');
    let sugPosts = document.querySelectorAll('.sugItem');

    if(newPosts[0]) {
      // check the first post; the others are the same
      let firstPButtons = newPosts[0]!.querySelectorAll('.buttonsContainer')[0] as HTMLDivElement;
      let sub = newPosts[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;

      // remove the hidden label check the menu's width
      if(sub.classList.contains('hidden')) {
        firstPButtons.classList.remove('float');
        sub.classList.remove('hidden');
        sub.classList.remove('float');
      }

      // if they're too long and there's no menu to show
      if(sub.scrollWidth + 70 > firstPButtons.offsetWidth && !this.showMenuNum) {
        // change each new post's menu to a floating, hidden menu
        newPosts.forEach((element) => {
          element.querySelectorAll('.buttonsContainer')[0].classList.add('float');
          element.querySelectorAll('.subMenu')[0].classList.add('hidden');
          element.querySelectorAll('.subMenu')[0].classList.add('float');
          element.querySelectorAll('.menuButton')[0].classList.remove('hidden');
        })

        // change each suggested post's menu to a floating, hidden menu
        sugPosts.forEach((element) => {
          element.querySelectorAll('.buttonsContainer')[0].classList.add('float');
          element.querySelectorAll('.subMenu')[0].classList.add('hidden');
          element.querySelectorAll('.subMenu')[0].classList.add('float');
          element.querySelectorAll('.menuButton')[0].classList.remove('hidden');
        })
      }
      // if there's a menu to show, show that specific menu
      else if(this.showMenuNum) {
        // the relevant menu to visible
        newPosts.forEach((element) => {
          if(element.firstElementChild!.id == this.showMenuNum) {
            element.querySelectorAll('.subMenu')[0].classList.remove('hidden');
          }
          else {
            element.querySelectorAll('.subMenu')[0].classList.add('hidden');

            // if it's not the first element that needs an open menu, close
            // the first item's menu like  it was opened above
            if(element.firstElementChild!.id == newPosts[0].firstElementChild!.id) {
              element.querySelectorAll('.buttonsContainer')[0].classList.add('float');
              element.querySelectorAll('.subMenu')[0].classList.add('hidden');
              element.querySelectorAll('.subMenu')[0].classList.add('float');
            }
          }
        })

        // the relevant menu to visible
        sugPosts.forEach((element) => {
          if(element.firstElementChild!.id == this.showMenuNum) {
            element.querySelectorAll('.subMenu')[0].classList.remove('hidden');
          }
          else {
            element.querySelectorAll('.subMenu')[0].classList.add('hidden');
          }
        })
      }
      // otherwise make sure the menu button is hidden and the buttons container
      // is in its normal design
      else {
        newPosts.forEach((element) => {
          element.querySelectorAll('.buttonsContainer')[0].classList.remove('float');
          element.querySelectorAll('.subMenu')[0].classList.remove('hidden');
          element.querySelectorAll('.subMenu')[0].classList.remove('float');
          element.querySelectorAll('.menuButton')[0].classList.add('hidden');
        })

        sugPosts.forEach((element) => {
          element.querySelectorAll('.buttonsContainer')[0].classList.remove('float');
          element.querySelectorAll('.subMenu')[0].classList.remove('hidden');
          element.querySelectorAll('.subMenu')[0].classList.remove('float');
          element.querySelectorAll('.menuButton')[0].classList.add('hidden');
        })
      }
    }
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

    // if the item is in the new list, gets it from there
    if(this.postsService.newItemsArray.filter(e => e.id == itemID).length) {
      item = this.postsService.newItemsArray.filter(e => e.id == itemID)[0];
    }
    // if not, the item must be in the suggested list, so it gets it from there
    else {
      item = this.postsService.sugItemsArray.filter(e => e.id == itemID)[0];
    }

    this.postsService.sendHug(item);
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
    this.delete = false;
    this.report = false;
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
  deletePost(postID:number) {
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = postID;
    this.report = false;
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
    this.postToEdit = undefined;
    this.editType = undefined;
    this.delete = false;
    this.report = true;
    this.reportedItem = post;
    this.reportType = 'Post';
  }

  /*
  Function Name: toggleOptions()
  Function Description: Opens a floating sub menu that contains the message, report, edit (if
                        applicable) and delete (if applicable) options on smaller screens.
  Parameters: itemNum (number) - ID of the item for which to open the submenu.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleOptions(itemType:string, itemNum:number | string) {
    itemNum = Number(itemNum);

    let post: HTMLElement | null;

    // if the item is in the new list, gets it from there
    if(itemType.toLowerCase() == 'new') {
      post = document.querySelector('#nPost' + itemNum)!.parentElement;
    }
    // if not, the item must be in the suggested list, so it gets it from there
    else if(itemType.toLowerCase() == 'suggested') {
      post = document.querySelector('#sPost' + itemNum)!.parentElement;
    }

    let buttons = post!.querySelectorAll('.buttonsContainer')[0];
    let subMenu = post!.querySelectorAll('.subMenu')[0];

    // if the submenu is hidden, show it
    if(subMenu.classList.contains('hidden')) {
      subMenu.classList.remove('hidden');
      subMenu.classList.add('float');
      buttons.classList.add('float');
      this.showMenuNum = itemType.toLowerCase() == 'new' ? 'nPost' + itemNum : 'sPost' + itemNum;
    }
    // otherwise hide it
    else {
      subMenu.classList.add('hidden');
      subMenu.classList.remove('float');
      buttons.classList.remove('float');
      this.showMenuNum = null;
    }
  }
}
