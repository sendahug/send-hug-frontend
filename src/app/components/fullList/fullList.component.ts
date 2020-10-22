/*
	Full List
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

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Angular imports
import { Component, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faEdit, faFlag } from '@fortawesome/free-regular-svg-icons';
import { faHandHoldingHeart, faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

// App-related imports
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-full-list',
  templateUrl: './fullList.component.html'
})
export class FullList implements AfterViewChecked {
  // current page and type of list
  type:any;
  page:any;
  showMenuNum: number | null = null;
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
  lastFocusedElement: any;
  waitFor = '';
  // icons
  faComment = faComment;
  faEdit = faEdit;
  faFlag = faFlag;
  faHandHoldingHeart = faHandHoldingHeart;
  faTimes = faTimes;
  faEllipsisV = faEllipsisV;

  // CTOR
  constructor(private route:ActivatedRoute,
    private router:Router,
    public authService:AuthService,
    public postsService:PostsService
  ) {
      // get the type of list and the current page
      this.route.url.subscribe(params => {
        this.type = params[0].path;
      });
      this.page = Number(this.route.snapshot.queryParamMap.get('page'));

      // set a default page if no page is set
      if(this.page) {
        // if it was a string, set it to 1
        if(this.page.isNaN) {
          this.page = 1;
        }
      }
      // if there's no page, set it to 1
      else {
        this.page = 1;
      }

      // if the type is new items, get the new items
      if(this.type == 'New') {
        this.waitFor = 'new posts';
        this.postsService.getNewItems(this.page);
      }
      // if the type is suggested items, get the suggested items
      else if(this.type == 'Suggested') {
        this.waitFor = 'suggested posts';
        this.postsService.getSuggestedItems(this.page);
      }

      this.editMode = false;
      this.delete = false;
      this.report = false;
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
    let posts = document.querySelectorAll('.newItem');

    if(posts[0]) {
      // check the first post; the others are the same
      let firstPButtons = posts[0]!.querySelectorAll('.buttonsContainer')[0] as HTMLDivElement;
      let sub = posts[0]!.querySelectorAll('.subMenu')[0] as HTMLDivElement;

      // remove the hidden label check the menu's width
      if(sub.classList.contains('hidden')) {
        firstPButtons.classList.remove('float');
        sub.classList.remove('hidden');
        sub.classList.remove('float');
      }

      // if they're too long and there's no menu to show
      if(sub.scrollWidth > sub.offsetWidth && !this.showMenuNum) {
        // change each menu to a floating, hidden menu
        posts.forEach((element) => {
          element.querySelectorAll('.buttonsContainer')[0].classList.add('float');
          element.querySelectorAll('.subMenu')[0].classList.add('hidden');
          element.querySelectorAll('.subMenu')[0].classList.add('float');
          element.querySelectorAll('.menuButton')[0].classList.remove('hidden');
        })
      }
      // if there's a menu to show, show that specific menu
      else if(this.showMenuNum) {
        // change each menu to a floating menu
        posts.forEach((element) => {
          if(element.firstElementChild!.id == 'nPost' + this.showMenuNum) {
            element.querySelectorAll('.subMenu')[0].classList.remove('hidden');
          }
          else {
            element.querySelectorAll('.subMenu')[0].classList.add('hidden');

            // if it's not the first element that needs an open menu, close
            // the first item's menu like  it was opened above
            if(element.firstElementChild!.id == posts[0].firstElementChild!.id) {
              element.querySelectorAll('.buttonsContainer')[0].classList.add('float');
              element.querySelectorAll('.subMenu')[0].classList.add('hidden');
              element.querySelectorAll('.subMenu')[0].classList.add('float');
            }
          }
        })
      }
      // otherwise make sure the menu button is hidden and the buttons container
      // is in its normal design
      else {
        posts.forEach((element) => {
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
    let item = {}
    // if the type of list is 'new posts', find the ID in the list of new posts
    if(this.type == 'New') {
      item = this.postsService.fullItemsList.fullNewItems.filter(e => e.id == itemID)[0];
    }
    // if the type of list is 'suggested posts', find the ID in the list of suggested posts
    else if(this.type == 'Suggested') {
      item = this.postsService.fullItemsList.fullSuggestedItems.filter(e => e.id == itemID)[0];
    }

    this.postsService.sendHug(item);
  }

  /*
  Function Name: nextPage()
  Function Description: Go to the next page of posts. Sends a request to the
                        items service to get the data for the next page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  nextPage() {
    // if the list is the new posts list, get the next page of new posts
    if(this.type == 'New') {
      this.page += 1;
      this.postsService.fullItemsPage.fullNewItems += 1;
      this.postsService.getNewItems(this.postsService.fullItemsPage.fullNewItems);
    }
    // if the list is the suggested posts list, get the next page of suggested posts
    else if(this.type == 'Suggested') {
      this.page += 1;
      this.postsService.fullItemsPage.fullSuggestedItems += 1;
      this.postsService.getSuggestedItems(this.postsService.fullItemsPage.fullSuggestedItems);
    }

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }

  /*
  Function Name: prevPage()
  Function Description: Go to the previous page of posts. Sends a request to the
                        items service to get the data for the previous page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  prevPage() {
    // if the list is the new posts list, get the previous page of new posts
    if(this.type == 'New') {
      this.page -= 1;
      this.postsService.fullItemsPage.fullNewItems -= 1;
      this.postsService.getNewItems(this.postsService.fullItemsPage.fullNewItems);
    }
    // if the list is the suggested posts list, get the previous page of suggested posts
    else if(this.type == 'Suggested') {
      this.page -= 1;
      this.postsService.fullItemsPage.fullSuggestedItems -= 1;
      this.postsService.getSuggestedItems(this.postsService.fullItemsPage.fullSuggestedItems);
    }

    // changes the URL query parameter (page) according to the new page
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page
      },
      replaceUrl: true
    });
  }

  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: post (Post) - Post to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(post:Post) {
    this.lastFocusedElement = document.activeElement;
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
    this.lastFocusedElement.focus();
  }

  /*
  Function Name: deletePost()
  Function Description: Send a request to the items service to delete a post.
  Parameters: post_id (number) - ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID:number) {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = 'Post';
    this.itemToDelete = postID;
  }

  /*
  Function Name: reportPost()
  Function Description: Opens the popup to report a post.
  Parameters: post (Post) - the Post to report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost(post:Post) {
    this.lastFocusedElement = document.activeElement;
	  this.editMode = true;
	  this.delete = false;
	  this.report = true;
	  this.reportedItem = post;
  }

  /*
  Function Name: toggleOptions()
  Function Description: Opens a floating sub menu that contains the message, report, edit (if
                        applicable) and delete (if applicable) options on smaller screens.
  Parameters: itemNum (number) - ID of the item for which to open the submenu.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleOptions(itemNum:number | string) {
    itemNum = Number(itemNum);
    let post = document.querySelector('#nPost' + itemNum)!.parentElement;
    let subMenu = post!.querySelectorAll('.subMenu')[0];

    // if the submenu is hidden, show it
    if(subMenu.classList.contains('hidden')) {
      subMenu.classList.remove('hidden');
      this.showMenuNum = itemNum;
    }
    // otherwise hide it
    else {
      subMenu.classList.add('hidden');
      this.showMenuNum = null;
    }
  }
}
