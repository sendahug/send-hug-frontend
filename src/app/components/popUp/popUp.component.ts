/*
	Popup
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
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, AfterViewChecked } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// App-related import
import { Post } from '../../interfaces/post.interface';
import { Report } from '../../interfaces/report.interface';
import { OtherUser } from '../../interfaces/otherUser.interface';
import { AuthService } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { PostsService } from '../../services/posts.service';
import { AdminService } from '../../services/admin.service';
import { AlertsService } from '../../services/alerts.service';

// Reasons for submitting a report
enum postReportReasons { Inappropriate, Spam, Offensive, Other };
enum userReportReasons { Spam, 'harmful / dangerous content', 'abusive manner', Other};

@Component({
  selector: 'app-pop-up',
  templateUrl: './popUp.component.html'
})
export class PopUp implements OnInit, OnChanges, AfterViewChecked {
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
  focusableElements: any;
  checkFocusBinded = this.checkFocus.bind(this);
  // icons
  faTimes = faTimes;

  // CTOR
  constructor(
    public authService:AuthService,
    private itemsService:ItemsService,
    private postsService:PostsService,
    private adminService:AdminService,
    private alertsService:AlertsService
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

    document.getElementById('exitButton')!.focus();
    if(document.getElementById('siteHeader')) {
      document.getElementById('siteHeader')!.className = 'modal';
    }
  }

  /*
  Function Name: ngAfterViewChecked()
  Function Description: This method is automatically triggered by Angular once the Component
                        has been added to the DOM. It gets all focusable elements within the
                        popup and sets the focus on the first element.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  ngAfterViewChecked() {
    let modal = document.getElementById('modalBox');
    this.focusableElements = modal!.querySelectorAll(`a, button:not([disabled]),
          input:not([disabled]), textarea:not([disabled]), select:not([disabled]),
          details, iframe, object, embed, [tabindex]:not([tabindex="-1"]`);
    modal!.addEventListener('keydown', this.checkFocusBinded);
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

    // if there's a new display name in the textbox, change the display name
    if(newDisplayName) {
      // if the new display name is longer than 60 characters, alert the user
      if(newDisplayName.length > 60) {
        this.alertsService.createAlert({ type: 'Error', message: 'New display name cannot be over 60 characters! Please shorten the name and try again.' });
        document.getElementById('displayName')!.classList.add('missing');
      }
      // otherwise change the name
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('displayName')!.classList.contains('missing')) {
          document.getElementById('displayName')!.classList.remove('missing');
        }

        this.authService.userData.displayName = newDisplayName;
        this.authService.updateUserData();
        this.exitEdit();
      }
    }
    // otherwise, alert the user that a display name can't be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New display name cannot be empty! Please fill the field and try again.' });
      document.getElementById('displayName')!.classList.add('missing');
    }
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

    // if there's a new display name in the textbox, change the display name
    if(newDisplayName) {
      // if the new display name is longer than 60 characters, alert the user
      if(newDisplayName.length > 60) {
        this.alertsService.createAlert({ type: 'Error', message: 'New display name cannot be over 60 characters! Please shorten the name and try again.' });
        document.getElementById('uDisplayName')!.classList.add('missing');
      }
      // otherwise change the name
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('uDisplayName')!.classList.contains('missing')) {
          document.getElementById('uDisplayName')!.classList.remove('missing');
        }

        let user = {
          userID: this.reportData.userID,
          displayName: newDisplayName
        }

        this.adminService.editUser(user, closeReport, this.reportData.reportID);
        this.exitEdit();
      }
    }
    // otherwise, alert the user that a display name can't be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New display name cannot be empty! Please fill the field and try again.' });
      document.getElementById('uDisplayName')!.classList.add('missing');
    }
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

    // if there's text in the textbox, change the post's text
    if(newText) {
      // if the new post text is longer than 480 characters, alert the user
      if(newText.length > 480) {
        this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be over 480 characters! Please shorten the post and try again.' });
        document.getElementById('postText')!.classList.add('missing');
      }
      // otherwise edit the post
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('postText')!.classList.contains('missing')) {
          document.getElementById('postText')!.classList.remove('missing');
        }

        this.editedItem.text = newText;
        this.postsService.editPost(this.editedItem);
        // check whether the post's data was updated in the database
        this.postsService.isUpdated.subscribe((value) => {
          // if it has, close the popup; otherwise, leave it on so that the user
          // can fix whatever errors they have and try again
          if(value) {
            this.exitEdit();
          }
        })
      }
    }
    // otherwise alert the user that a post cannot be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be empty. Please fill the field and try again.' });
      document.getElementById('postText')!.classList.add('missing');
    }
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

    // if there's text in the textbox, change the post's text
    if(newText) {
      // if the new post text is longer than 480 characters, alert the user
      if(newText.length > 480) {
        this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be over 480 characters! Please shorten the post and try again.' });
        document.getElementById('adPostText')!.classList.add('missing');
      }
      // otherwise edit the post
      else {
        // if the textfield was marked red, remove it
        if(document.getElementById('adPostText')!.classList.contains('missing')) {
          document.getElementById('adPostText')!.classList.remove('missing');
        }

        let post = {
          text: newText,
          id: this.reportData.postID
        }

        this.adminService.editPost(post, closeReport, this.reportData.reportID);
        // check whether the post's data was updated in the database
        this.adminService.isUpdated.subscribe((value) => {
          // if it has, close the popup; otherwise, leave it on so that the user
          // can fix whatever errors they have and try again
          if(value) {
            this.exitEdit();
          }
        })
      }
    }
    // otherwise alert the user that a post cannot be empty
    else {
      this.alertsService.createAlert({ type: 'Error', message: 'New post text cannot be empty. Please fill the field and try again.' });
      document.getElementById('adPostText')!.classList.add('missing');
    }
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
      this.itemsService.deleteThread(this.itemToDelete!);
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
  setSelected(selectedItem:string | number) {
    selectedItem = Number(selectedItem);
    let otherText = this.reportType == 'User' ? document.getElementById('uOption3Text') as HTMLInputElement : document.getElementById('rOption3Text') as HTMLInputElement;

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

      otherText.disabled = true;
      otherText.required = false;
    }
    // If the user chose to put their own input, take that as the reason
    else {
      otherText.disabled = false;
      otherText.required = true;
      this.selectedReason = 'other';
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
    let otherText = this.reportType == 'User' ? document.getElementById('uOption3Text') as HTMLInputElement : document.getElementById('rOption3Text') as HTMLInputElement;

    // if the selected reason for the report is 'other', get the value of the text inputted
    if(this.selectedReason == 'other') {
      if(otherText.value) {
        // if the report reason is longer than 120 characters, alert the user
        if(otherText.value.length > 120) {
          this.alertsService.createAlert({ type: 'Error', message: 'Report reason cannot be over 120 characters! Please shorten the message and try again.' });
          otherText.classList.add('missing');
        }
        // otherwise get the text field's value
        else {
          // if the textfield was marked red, remove it
          if(otherText.classList.contains('missing')) {
            otherText.classList.remove('missing');
          }

          this.selectedReason = otherText.value;
        }
      }
      // if there's no text, alert the user that it's mandatory
      else {
        this.alertsService.createAlert({ message: 'The \'other\' field cannot be empty.', type: 'Error' });
        otherText.classList.add('missing');
        return;
      }
    }

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
    let otherText = this.reportType == 'User' ? document.getElementById('uOption3Text') as HTMLInputElement : document.getElementById('rOption3Text') as HTMLInputElement;

    // if the selected reason for the report is 'other', get the value of the text inputted
    if(this.selectedReason == 'other') {
      if(otherText.value) {
        // if the report reason is longer than 120 characters, alert the user
        if(otherText.value.length > 120) {
          this.alertsService.createAlert({ type: 'Error', message: 'Report reason cannot be over 120 characters! Please shorten the message and try again.' });
          otherText.classList.add('missing');
        }
        // otherwise get the text field's value
        else {
          // if the textfield was marked red, remove it
          if(otherText.classList.contains('missing')) {
            otherText.classList.remove('missing');
          }

          this.selectedReason = otherText.value;
        }
      }
      // if there's no text, alert the user that it's mandatory
      else {
        this.alertsService.createAlert({ message: 'The \'other\' field cannot be empty.', type: 'Error' });
        otherText.classList.add('missing');
        return;
      }
    }

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
  Function Name: checkFocus()
  Function Description: Checks the currently focused element to ensure that the
                        user's focus remains within the popup.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkFocus(e:KeyboardEvent) {
    // if the pressed key is TAB
    if(e.keyCode === 9) {
      // if the user pressed SHIFT + TAB, which means they want to move backwards
      if(e.shiftKey) {
        // if the currently focused element in the first one in the popup,
        // move back to the last focusable element in the popup
        if(document.activeElement == this.focusableElements[0]) {
          this.focusableElements[this.focusableElements.length - 1].focus();
          e.preventDefault();
        }
      }
      // otherwise the user pressed just TAB, so they want to move forward
      else {
        // if the currently focused element in the last one in the popup,
        // move back to the first focusable element in the popup
        if(document.activeElement == this.focusableElements[this.focusableElements.length - 1]) {
          this.focusableElements[0].focus();
          e.preventDefault();
        }
      }
    }
  }

  /*
  Function Name: exitEdit()
  Function Description: Emits an event to disable edit mode. Exiting edit mode is
                        done by the parent component upon getting the 'false' value.
                        The user's focus is also moved back to the skip link.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  exitEdit() {
    let modal = document.getElementById('modalBox');
    modal!.removeEventListener('keydown', this.checkFocusBinded);
    if(document.getElementById('skipLink')) {
      document.getElementById('skipLink')!.focus();
    }
    if(document.getElementById('siteHeader')) {
      document.getElementById('siteHeader')!.className = '';
    }
    this.editMode.emit(false);
  }
}
