// OtherUser interface
// Based on the User Model
// For viewing other users' profiles
export interface OtherUser {
  id: number;
  displayName: string;
  receivedHugs: number;
  givenHugs: number;
  postsNum: number;
  role: string;
}
