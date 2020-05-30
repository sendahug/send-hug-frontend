// User interface
// Based on the User Model
export interface User {
  id?: number;
  auth0Id: string;
  displayName: string;
  receivedHugs: number;
  givenHugs: number;
  postsNum: number;
  loginCount: number;
  jwt: string;
}
