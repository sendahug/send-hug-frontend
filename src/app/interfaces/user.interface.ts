// User interface
// Based on the User Model
export interface User {
  id?: number;
  auth0Id: string;
  email: string,
  username: string;
  receivedHugs: number;
  givenHugs: number;
  postsNum: number;
  jwt: string;
}
