/*
	Post
	Send a Hug Component
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2023 Send A Hug

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
import { Component, Input, computed, AfterViewChecked, OnInit, OnDestroy } from "@angular/core";
import { faComment, faEdit, faFlag } from "@fortawesome/free-regular-svg-icons";
import { faHandHoldingHeart, faTimes, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// App-related imports
import { AuthService } from "../../services/auth.service";
import { ItemsService } from "../../services/items.service";
import { PostsService } from "../../services/posts.service";
import { Post } from "../../interfaces/post.interface";
import { Subscription } from "rxjs";

@Component({
  selector: "app-single-post",
  templateUrl: "./post.component.html",
})
export class SinglePost implements AfterViewChecked, OnInit, OnDestroy {
  @Input() post!: Post;
  @Input() type!: "n" | "s";
  @Input() class!: string;
  postId = computed(() => `${this.type}Post${this.post?.id || ""}`);
  // edit popup sub-component variables
  postToEdit: Post | undefined;
  editType: string | undefined;
  editMode: boolean;
  delete: boolean;
  toDelete: string | undefined;
  itemToDelete: number | undefined;
  report: boolean;
  reportedItem: Post | undefined;
  reportType: "Post" | undefined;
  lastFocusedElement: any;
  waitFor = "main page";
  subscriptions: Subscription[] = [];
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
    public authService: AuthService,
    public postsService: PostsService,
  ) {
    this.editMode = false;
    this.delete = false;
    this.report = false;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.postsService.currentlyOpenMenu.subscribe((_currentlyOpenId) => {
      this.checkMenuSize();
    }));
    this.subscriptions.push(this.postsService.receivedAHug.subscribe((postId) => {
      if (postId == this.post.id && !this.post.sentHugs?.includes(this.authService.userData.id!)) {
        // TODO: Also update the parent list & IDB
        this.post.givenHugs += 1;
        this.post.sentHugs?.push(this.authService.userData.id!);
        this.disableHugButton();
      }
    }))
  }

  ngAfterViewChecked(): void {
    this.checkMenuSize();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Checks whether the menu is too long to fit in the screen.
   * If it is, it hides it or sets it to float.
   */
  checkMenuSize() {
    const post = document.getElementById(this.postId())?.parentElement as HTMLLIElement;
    if (!post) return;
    const buttonsContainer = post?.querySelectorAll(".buttonsContainer")[0] as HTMLDivElement;
    const sub = post?.querySelectorAll(".subMenu")[0] as HTMLDivElement;

    // remove the hidden label check the menu's width
    buttonsContainer.classList.remove("float");
    sub.classList.remove("hidden");
    sub.classList.remove("float");

    // TODO: There has to be a better way to do this (without manually
    // setting the element's classes).
    // if the menu is too long, change it to a floating menu
    if (sub.scrollWidth > sub.offsetWidth) {
      buttonsContainer.classList.add("float");
      sub.classList.add("float");
      post.querySelector(".menuButton")?.classList.remove("hidden");

      if (this.postsService.currentlyOpenMenu.value != this.post?.id) {
        sub.classList.add("hidden");
      } else {
        sub.classList.remove("hidden");
      }
      // Otherwise change it back to a regular menu
    } else {
      buttonsContainer.classList.remove("float");
      sub.classList.remove("hidden");
      sub.classList.remove("float");
      post.querySelector(".menuButton")?.classList.add("hidden");
    }
  }

  /*
  Function Name: sendHug()
  Function Description: Send a hug to a user through a post they've written. The hug
                        itself is sent by the items service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  sendHug() {
    this.postsService.sendHug(this.post);
  }

  /*
  Function Name: editPost()
  Function Description: Triggers edit mode in order to edit a post.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost() {
    this.lastFocusedElement = document.activeElement;
    this.editType = "post";
    this.postToEdit = this.post;
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
  changeMode(edit: boolean) {
    this.editMode = edit;
    this.lastFocusedElement.focus();
  }

  /*
  Function Name: deletePost()
  Function Description: Send a request to the items service to delete a post.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost() {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.delete = true;
    this.toDelete = "Post";
    this.itemToDelete = this.post.id;
    this.report = false;
  }

  /*
  Function Name: reportPost()
  Function Description: Opens the popup to report a post.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost() {
    this.lastFocusedElement = document.activeElement;
    this.editMode = true;
    this.postToEdit = undefined;
    this.editType = undefined;
    this.delete = false;
    this.report = true;
    this.reportedItem = this.post;
    this.reportType = "Post";
  }

  /*
  Function Name: toggleOptions()
  Function Description: Opens a floating sub menu that contains the message, report, edit (if
                        applicable) and delete (if applicable) options on smaller screens.
  Parameters: itemNum (number) - ID of the item for which to open the submenu.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleOptions() {
    if (this.postsService.currentlyOpenMenu.value !== this.post.id) {
      this.postsService.currentlyOpenMenu.next(this.post.id as number);
    } else {
      this.postsService.currentlyOpenMenu.next(-1);
    }
  }

  /**
  * Disables the current post's hug button to prevent attempting
  * to send multiple hugs on one post. Is triggered by the user
  * sending a hug for the post.
  */
  disableHugButton() {
    // TODO: Ideally we shouldn't have to do this; this is only done
    // because the post isn't fully reactive. This should be fixed.
    let post = document.getElementById(this.postId())?.parentElement;
    console.log(post)
    post?.querySelectorAll(".fa-hand-holding-heart").forEach((element) => {
      console.log(element);
      (element.parentElement as HTMLButtonElement).disabled = true;
      (element.parentElement as HTMLButtonElement).classList.add("active");
    });
  }
}
