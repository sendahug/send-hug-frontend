/*
	Admin Service
	Send a Hug Service
  ---------------------------------------------------
  MIT License

  Copyright (c) 2020-2024 Send A Hug

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
import { Injectable } from "@angular/core";
import { Observable, map, mergeMap, of, switchMap, tap } from "rxjs";

// App-related imports
import { Report } from "@app/interfaces/report.interface";
import { Message } from "@app/interfaces/message.interface";
import { AuthService } from "@common/services/auth.service";
import { AlertsService } from "@common/services/alerts.service";
import { ItemsService } from "@common/services/items.service";
import { SWManager } from "@common/services/sWManager.service";
import { ApiClientService } from "@common/services/apiClient.service";
import { OtherUser } from "@app/interfaces/otherUser.interface";
import { PartialUser } from "@app/interfaces/user.interface";

interface UserBlockData {
  userID: number;
  isBlocked: boolean;
  releaseDate?: Date;
}

interface OtherUserResponse {
  user: OtherUser;
  success: boolean;
}

interface ReportResponse {
  success: boolean;
  updated: Report;
}

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private itemsService: ItemsService,
    private serviceWorkerM: SWManager,
    private apiClient: ApiClientService,
  ) {}

  // REPORTS-RELATED METHODS
  // ==============================================================
  /*
  Function Name: deletePost()
  Function Description: Sends a request to delete the post. If successful, alerts
                        the user (via the ItemsService) that their post was deleted.
  Parameters: postID (number) - ID of the post to delete.
              reportData (any) - User ID and report ID.
              closeReport (boolean) - whether to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deletePost(postID: number, reportData: any, closeReport: boolean) {
    // delete the post from the database
    return this.apiClient
      .delete<{ success: boolean; deleted: number }>(`posts/${postID}`)
      .pipe(
        switchMap((response) => {
          if (closeReport) {
            return this.closeReport(reportData.reportID, false, postID).pipe(
              map((updateResponse) => ({
                deleted: response.deleted,
                reportID: updateResponse.updated.id,
              })),
            );
          } else {
            return of({
              deleted: response.deleted,
              reportID: undefined,
            });
          }
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.alertsService.createSuccessAlert(
            `Post ${response.deleted} was successfully deleted.`,
          );
          // create a message from the admin to the user whose post was deleted
          let message: Message = {
            from: {
              displayName: this.authService.userData()!.displayName,
            },
            fromId: this.authService.userData()!.id!,
            forId: reportData.userID,
            messageText: `Your post (ID ${response.deleted}) was deleted due to violating our community rules.`,
            date: new Date(),
          };

          // delete the post from idb
          this.serviceWorkerM.deleteItem("posts", postID);

          // send the message about the deleted post
          this.itemsService.sendMessage(message);
        },
      });
  }

  /*
  Function Name: editUser()
  Function Description: Sends a request to edit the user's display name. If necessary,
                        also closes the report.
  Parameters: user (any) - the ID and new display name of the user.
              reportID (number) - the ID of the report triggering the edit.
              closeReport (boolean) - whether or not to also close the report.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editUser(user: PartialUser, closeReport: boolean, reportID: number) {
    // update the user's display name
    return this.apiClient
      .patch<{ success: boolean; updated: OtherUser }>(`users/all/${user.id}`, user)
      .pipe(
        switchMap((userResponse) => {
          // if the report should be closed
          if (closeReport) {
            return this.closeReport(reportID, false, undefined, user.id).pipe(
              map((response) => ({
                reportID: response.updated.id,
                user: userResponse.updated,
              })),
            );
          } else {
            return of({
              reportID: undefined,
              user: userResponse.updated,
            });
          }
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.alertsService.createSuccessAlert(`User ${response.user.displayName} updated.`);
        },
      });
  }

  /**
   * Close/dismiss a report.
   * @param reportID (number) - the ID of the report to dismiss.
   * @param dismiss (boolean) - whether to dismiss the report without taking action.
   * @param postID (number) - the ID of the post associated with the report (for post reports).
   * @param userID (number) - the ID of the user associated with the report (for user reports).
   */
  closeReport(reportID: number, dismiss: boolean, postID?: number, userID?: number) {
    let report: Partial<Report> = {
      id: reportID,
      closed: true,
      dismissed: dismiss,
      postID,
      userID,
    };

    // send a request to update the report
    return this.apiClient.patch<ReportResponse>(`reports/${reportID}`, report);
  }

  // BLOCKS-RELATED METHODS
  // ==============================================================
  /**
   * Fetches the block data for a user.
   * @param userID - the ID of the user to fetch the block data for
   * @returns - an observable of the user's block data
   */
  fetchUserBlockData(userID: number): Observable<UserBlockData> {
    // send the request to get the block data
    return this.apiClient.get<OtherUserResponse>(`users/all/${userID}`).pipe(
      map((res) => {
        return {
          userID: res.user.id,
          isBlocked: res.user.blocked as boolean,
          releaseDate:
            res.user.blocked && res.user.releaseDate ? new Date(res.user.releaseDate) : undefined,
        };
      }),
    );
  }

  /**
   * Calculates the date when the user should be unblocked.
   *
   * @param length (string) - length of time for which the user should be blocked
   * @param currentReleaseDate (date) - the current release date, if the user is
   *                                    already blocked
   * @returns - the date when the user should be unblocked
   */
  calculateUserReleaseDate(length: string, currentReleaseDate?: Date): Date {
    const currentDate = new Date();
    const millisecondsPerDay = 864e5;
    let releaseDate: Date;
    let millisecondsUntilReleaseDate: number;

    // calculates when the user should be unblocked
    switch (length) {
      case "oneDay":
        millisecondsUntilReleaseDate = millisecondsPerDay * 1;
        releaseDate = new Date(currentDate.getTime() + millisecondsUntilReleaseDate);
        break;
      case "oneWeek":
        millisecondsUntilReleaseDate = millisecondsPerDay * 7;
        releaseDate = new Date(currentDate.getTime() + millisecondsUntilReleaseDate);
        break;
      case "oneMonth":
        millisecondsUntilReleaseDate = millisecondsPerDay * 30;
        releaseDate = new Date(currentDate.getTime() + millisecondsUntilReleaseDate);
        break;
      case "forever":
        millisecondsUntilReleaseDate = millisecondsPerDay * 36500;
        releaseDate = new Date(currentDate.getTime() + millisecondsUntilReleaseDate);
        break;
      default:
        millisecondsUntilReleaseDate = millisecondsPerDay * 1;
        releaseDate = new Date(currentDate.getTime() + millisecondsUntilReleaseDate);
        break;
    }

    if (currentReleaseDate) {
      releaseDate = new Date(millisecondsUntilReleaseDate + currentReleaseDate.getTime());
    }

    return releaseDate;
  }

  /*
  Function Name: blockUser()
  Function Description: Blocks a user for the default amount of time (one day).
  Parameters: userID (number) - the ID of the user to block.
  ----------------
  Programmer: Shir Bar Lev.
  */
  blockUser(userID: number, blockLength: string, reportID?: number) {
    const fetchUserBlockData$ = this.fetchUserBlockData(userID);

    return (
      fetchUserBlockData$
        .pipe(
          // set the user's block data
          map((blockData) => {
            const newReleaseDate = this.calculateUserReleaseDate(
              blockLength,
              blockData.releaseDate,
            );

            return {
              id: userID,
              releaseDate: newReleaseDate,
              blocked: true,
            };
          }),
        )
        // try to block the user
        .pipe(
          switchMap((blockData) =>
            this.apiClient.patch<{ success: boolean; updated: OtherUser }>(
              `users/all/${userID}`,
              blockData,
            ),
          ),
        )
        // close the report if there is one
        .pipe(
          mergeMap((response) => {
            if (reportID) {
              return this.closeReport(reportID, false, undefined, userID).pipe(
                map((closeResponse) => ({
                  success: true,
                  updated: response.updated,
                  reportID: closeResponse.updated.id,
                })),
              );
            } else {
              return of({
                success: true,
                updated: response.updated,
                reportID: undefined,
              });
            }
          }),
        )
        .pipe(
          tap((response: any) =>
            this.alertsService.createSuccessAlert(
              `User ${response.updated.displayName} has been blocked until ${response.updated.releaseDate}`,
            ),
          ),
        )
    );
  }
}
