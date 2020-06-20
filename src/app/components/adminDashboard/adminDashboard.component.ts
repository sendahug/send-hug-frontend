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
    this.block(userID, 'oneDay');
  }

  /*
  Function Name: deletePost()
  Function Description: Sends a request to delete a post.
  Parameters: postID (number) - the ID of the post to delete.
              userID (number) - the ID of the user who wrote the post.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID:number, userID:number) {
    this.adminService.deletePost(postID, userID);
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

  // BLOCKS PAGE
  // ==================================================================
  /*
  Function Name: block()
  Function Description: Blocks a user for a set amount of time.
  Parameters: e (Event) - The sending event (clicking the 'block button')
              userID (number) - The ID of the user to block
              length (string) - length of time for which the user should be blocked
  ----------------
  Programmer: Shir Bar Lev.
  */
  block(userID:number, length:string, e?:Event) {
    // if the method is invoked through the DOM, prevent submit button default behaviour
    if(e) {
      e.preventDefault();
    }
    let releaseDate:Date;
    let currentDate = new Date();
    let millisecondsPerDay = 864E5;

    // calculates when the user should be unblocked
    switch(length) {
      case 'oneDay':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 1);
        break;
      case 'oneWeek':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 7);
        break;
      case 'oneMonth':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 30);
        break;
      case 'forever':
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 36500);
        break;
      default:
        releaseDate = new Date(currentDate.getTime() + millisecondsPerDay * 1);
        break;
    }

    this.adminService.blockUser(userID, releaseDate);
  }

  /*
  Function Name: unblock()
  Function Description: Unblocks a user.
  Parameters: userID (number) - The ID of the user to block
  ----------------
  Programmer: Shir Bar Lev.
  */
  unblock(userID:number) {
    this.adminService.unblock(userID);
  }

  // FILTERS PAGE
  // ==================================================================
  /*
  Function Name: addFilter()
  Function Description: Add a filtered phrase to the list.
  Parameters: e (Event) - The sending event (clicking the 'add filter' button)
              filter (string) - The string to filter.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addFilter(e:Event, filter:string) {
    e.preventDefault();
    this.adminService.addFilter(filter);
  }

  /*
  Function Name: removeFilter()
  Function Description: Remove a filter from the filtered phrases list.
  Parameters: filterID (number) - ID of the filter to remove.
  ----------------
  Programmer: Shir Bar Lev.
  */
  removeFilter(filterID:number) {
    this.adminService.removeFilter(filterID);
  }
}
