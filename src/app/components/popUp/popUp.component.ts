/*
	Popup
	Send a Hug Component
*/

// Angular imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

// App-related import
import { Post } from '../../interfaces/post.interface';
import { Report } from '../../interfaces/report.interface';
import { OtherUser } from '../../interfaces/otherUser.interface';
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { PostsService } from '../../services/posts.service';
import { AdminService } from '../../services/admin.service';

// Reasons for submitting a report
enum postReportReasons { Inappropriate, Spam, Offensive, Other };
enum userReportReasons { Spam, 'harmful / dangerous content', 'abusive manner', Other};

@Component({
  selector: 'app-pop-up',
  templateUrl: './popUp.component.html'
})
export class PopUp implements OnInit, OnChanges {
  // type of item to edit
  @Input() toEdit: string | undefined;
  // item to edit
  @Input() editedItem: any;
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  // whether we're in delete (or edit) mode
  @Input() delete = false;
  // type of item to delete
  @Input() toDelete: string | undefined;
  // the item to delete itself
  @Input() itemToDelete: number | undefined;
  @Input() messType: string | undefined;
  // whether the user is reporting an item
  @Input() report = false;
  // reported post
  @Input() reportedItem: Post | OtherUser | undefined;
  // type of item to report
  @Input() reportType: 'User' | 'Post' | undefined;
  selectedReason: string | undefined;
  @Input() reportData: any;

  // CTOR
  constructor(
    public authService:AuthService,
    private itemsService:ItemsService,
    private postsService:PostsService,
    private adminService:AdminService
  ) {

  }

  /*
  Function Name: ngOnInit()
  Function Description: This method is automatically triggered by Angular upon
                        page initiation. It checks for the mode the user is in (edit
                        or delete) and sets the component's variables accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnInit() {
    // if we're in delete mode, turn the values of edit variables to undefined
    if(this.delete) {
      this.toEdit = undefined;
      this.editedItem = undefined;
    }
    // if we're in edit mode, turn the values of delete variables to undefined
    else {
      this.toDelete = undefined;
      this.itemToDelete = undefined;
    }
  }

  /*
  Function Name: ngOnChanges()
  Function Description: This method is automatically triggered by Angular upon
                        changes in parent component. It checks for the mode the user is in (edit
                        or delete) and sets the component's variables accordingly.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngOnChanges() {
    // if we're in delete mode, turn the values of edit variables to undefined
    if(this.delete) {
      this.toEdit = undefined;
      this.editedItem = undefined;
    }
    // if we're in edit mode, turn the values of delete variables to undefined
    else {
      this.toDelete = undefined;
      this.itemToDelete = undefined;
    }
  }

  /*
  Function Name: updateDisplayN()
  Function Description: Sends a request via the auth service to edit the user's display name.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newDisplayName (string) - A string containing the user's new name.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateDisplayN(e:Event, newDisplayName:string) {
    e.preventDefault();
    this.authService.userData.displayName = newDisplayName;
    this.authService.updateUserData();
    this.editMode.emit(false);
  }

  /*
  Function Name: editUser()
  Function Description: Edits a user's display name from admin dashboard.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newDisplayName (string) - A string containing the user's new name.
              closeReport (boolean) - whether to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editUser(e:Event, newDisplayName:string, closeReport:boolean) {
    e.preventDefault();
    let user = {
      userID: this.reportData.userID,
      displayName: newDisplayName
    }

    this.adminService.editUser(user, closeReport, this.reportData.reportID);
  }

  /*
  Function Name: updatePost()
  Function Description: Sends a request to edit a post's text to the items service.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newText (string) - A string containing the new text for the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updatePost(e:Event, newText:string) {
    e.preventDefault();
    this.editedItem.text = newText;
    this.postsService.editPost(this.editedItem);
    this.exitEdit();
  }

  /*
  Function Name: editPost()
  Function Description: Edits a post's text from admin dashboard.
  Parameters: e (event) - This method is triggered by pressing a button; this parameter
                          contains the click event data.
              newText (string) - A string containing the new post's text.
              closeReport (boolean) - whether to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editPost(e:Event, newText:string, closeReport:boolean) {
    e.preventDefault();
    let post = {
      text: newText,
      id: this.reportData.postID
    }

    this.adminService.editPost(post, closeReport, this.reportData.reportID);
  }

  /*
  Function Name: deleteItem()
  Function Description: Sends a request to delete a post or a message to the items service.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem() {
    // if it's a post, send a request to delete the post
    if(this.toDelete == 'Post') {
      this.postsService.deletePost(this.itemToDelete!);
    }
    // if it's a message, send a request to delete the message
    else if(this.toDelete == 'Message') {
      this.itemsService.deleteMessage(this.itemToDelete!, this.messType!);
    }
    // if it's a thread, send a request to delete the thread
    else if(this.toDelete == 'Thread') {
      this.itemsService.deleteThread(this.itemToDelete!, this.messType!);
    }
    // if the user is attempting to delete all of the user's posts
    else if(this.toDelete == 'All posts') {
      this.postsService.deleteAllPosts(this.itemToDelete!);
    }
    // if the user is attempting to delete all of their messages of a specific type
    else if(this.toDelete == 'All inbox' || this.toDelete == 'All outbox' || this.toDelete == 'All threads') {
      this.itemsService.deleteAll(this.toDelete, this.itemToDelete!);
    }

    this.exitEdit();
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to the admin service to delete a post and
                        dismiss the report (if selected by the user).
  Parameters: closeReport (boolean) - whether or not to close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(closeReport:boolean) {
    this.adminService.deletePost(this.itemToDelete!, this.reportData, closeReport);
  }

  /*
  Function Name: setSelected()
  Function Description: Sets the selected reason for reporting the post. The method is
                        triggered by the user checking radio buttons.
  Parameters: selectedItem (number) - the ID of the slected option.
  ----------------
  Programmer: Shir Bar Lev.
  */
  setSelected(selectedItem:number) {
    // If the selected reason is one of the set reasons, simply send it as is
    if(selectedItem == 0 || selectedItem == 1 || selectedItem == 2) {
      // if the item being reported is a post
      if(this.reportType == 'Post') {
        this.selectedReason = `The post is ${postReportReasons[selectedItem]}`;
      }
      // if the item being reported is a user
      else {
        if(selectedItem == 2) {
          this.selectedReason = `The user is behaving in an ${userReportReasons[selectedItem]}`;
        }
        else {
          this.selectedReason = `The user is posting ${userReportReasons[selectedItem]}`;
        }
      }
    }
    // If the user chose to put their own input, take that as the reason
    else {
      let otherText = document.getElementById('option3Text') as HTMLInputElement;
      this.selectedReason = otherText.value;
    }
  }

  /*
  Function Name: reportPost()
  Function Description: Creates a report and passes it on to the items service.
                        The method is triggered by pressing the 'report' button
                        in the report popup.
  Parameters: e (Event) - clicking the report button.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportPost(e:Event) {
    e.preventDefault();
    let post = this.reportedItem as Post;

    // create a new report
    let report: Report = {
      type: 'Post',
      userID: post.userId,
      postID: post.id,
      reporter: this.authService.userData.id!,
      reportReason: this.selectedReason!,
      date: new Date(),
      dismissed: false,
      closed: false
    }

    // pass it on to the items service to send
    this.itemsService.sendReport(report);
    this.exitEdit();
  }

  /*
  Function Name: reportUser()
  Function Description: Creates a report and passes it on to the items service.
                        The method is triggered by pressing the 'report' button
                        in the report popup.
  Parameters: e (Event) - clicking the report button.
  ----------------
  Programmer: Shir Bar Lev.
  */
  reportUser(e:Event) {
    e.preventDefault();
    let userData = this.reportedItem as OtherUser;

    // create a new report
    let report: Report = {
      type: 'User',
      userID: userData.id,
      reporter: this.authService.userData.id!,
      reportReason: this.selectedReason!,
      date: new Date(),
      dismissed: false,
      closed: false
    }

    // pass it on to the items service to send
    this.itemsService.sendReport(report);
    this.exitEdit();
  }

  /*
  Function Name: exitEdit()
  Function Description: Emits an event to disable edit mode. Exiting edit mode is
                        done by the parent component upon getting the 'false' value.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  exitEdit() {
    this.editMode.emit(false);
  }
}
