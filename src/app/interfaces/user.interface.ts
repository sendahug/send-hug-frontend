// User interface
// Based on the User Model
// For the user's own profile
export interface User {
  id?: number;
  auth0Id: string;
  displayName: string;
  receivedHugs: number;
  givenHugs: number;
  postsNum: number;
  loginCount: number;
  role: string;
  jwt: string;
}
