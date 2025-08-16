/*
	Mock Forms
	Send a Hug
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
import { Component, Output, EventEmitter, input } from "@angular/core";
import { CommonModule } from "@angular/common";

// App-related import
import { ReportType, type ReportData } from "@app/interfaces/report.interface";
import { OtherUser, type PartialUser } from "@app/interfaces/user.interface";
import { PostAndReportResponse, UpdatedUserReportResponse } from "@app/interfaces/api";
import { PostGet } from "@app/interfaces/post.interface";

@Component({
  selector: "display-name-edit-form",
  template: "<div>mock</div>",
  standalone: true,
  imports: [CommonModule],
})
export class MockDisplayNameEditFormComponent {
  readonly editedItem = input<PartialUser>();
  @Output() updatedDetails = new EventEmitter<UpdatedUserReportResponse>();
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  readonly reportData = input<ReportData | null>();
}

@Component({
  selector: "item-delete-form",
  template: "<div>mock</div>",
  standalone: true,
  imports: [CommonModule],
})
export class MockItemDeleteFormComponent {
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Output() deleted = new EventEmitter<number>();
  readonly reportData = input<ReportData | undefined>();
  readonly deleteEndpoint = input<string | undefined>();
  readonly itemType = input<"Post" | "Message" | "Thread" | undefined>();
  readonly itemId = input<number | undefined>();
  readonly bulkDelete = input<boolean>(false);
  readonly isAdmin = input<boolean>(false);
}

@Component({
  selector: "post-edit-form",
  template: "<div>mock</div>",
  standalone: true,
  imports: [CommonModule],
})
export class MockPostEditFormComponent {
  // item to edit
  readonly editedItem = input.required<PostGet>();
  // indicates whether edit/delete mode is still required
  @Output() editMode = new EventEmitter<boolean>();
  @Output() updateResult = new EventEmitter<PostAndReportResponse>();
  readonly reportData = input<ReportData | null>();
  readonly isAdmin = input<boolean>(false);
}

@Component({
  selector: "report-form",
  template: "<div>mock</div>",
  standalone: true,
  imports: [CommonModule],
})
export class MockReportFormComponent {
  // indicates whether edit/delete mode is still required
  @Output() reportMode = new EventEmitter<boolean>();
  // reported post
  readonly reportedItem = input<PostGet | OtherUser | undefined>();
  // type of item to report
  readonly reportType = input<ReportType>("Post");
}

@Component({
  selector: "app-send-hug-form",
  template: "<div>mock</div>",
  standalone: true,
  imports: [CommonModule],
})
export class MockSendHugFormComponent {
  @Output() sendMode = new EventEmitter<boolean>();
  readonly forUsername = input<string>("");
  readonly forID = input.required<number>();
  readonly postID = input<number | undefined>();
}
