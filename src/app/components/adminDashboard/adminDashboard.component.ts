/*
	Admin Dashboard
	Send a Hug Component
*/

// Angular imports
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// App imports
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './adminDashboard.component.html'
})
export class AdminDashboard {
  screen:string = '';
  adminCategories = [
    {
      title: 'Reports',
      explanation: `Here you can view all the posts and users who've been reported by users. For post reports, you can either edit or delete the reported post. For user reports, you can edit or block the user.
                    If you find no justified reason for the report (for either a user or a post), you can also dismiss the report without taking action on the post or the user.`
    },
    {
      title: 'Blocks',
      explanation: `Here you can view all blocked users and how long they've been block for. You can also block or unblock a user by their ID.`
    },
    {
      title: 'Filters',
      explanation: `Here you can view currently filtered words. You can also add or remote filtered words to the list.`
    }
  ]

  // CTOR
  constructor(
    private route:ActivatedRoute,
    public authService:AuthService,
    public adminService:AdminService
  ) {
    this.route.url.subscribe(params => {
      if(params[0] && params[0].path) {
        this.screen = params[0].path;
      }
      else {
        this.screen = 'main';
      }
    })
  }

  // REPORTS PAGE
  // ==================================================================
  /*
  Function Name: blockUser()
  Function Description: Sends a request to block a user.
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID:number) {
    this.adminService.blockUser(userID);
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to delete a post.
  Parameters: postID (number) - the ID of the post to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID:number) {
    this.adminService.deletePost(postID);
  }

  /*
  Function Name: dismissReport()
  Function Description: Closes an open report without taking further action.
  Parameters: reportID (number) - the ID of the report to close.
  ----------------
  Programmer: Shir Bar Lev.
  */
  dismissReport(reportID:number) {
    this.adminService.dismissReport(reportID);
  }
}
