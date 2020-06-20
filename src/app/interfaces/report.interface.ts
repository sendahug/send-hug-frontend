// Report interface
// Based on the Report Model
export interface Report {
  id?: number;
  type: 'User' | 'Post';
  userID: number;
  postID?: number;
  reporter: number;
  reportReason: string;
  date: Date;
  dismissed: boolean;
  closed: boolean;
}
