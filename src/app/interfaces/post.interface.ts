// Post interface
// Based on the Post Model
export interface Post {
  id?: number;
  user_id: number;
  user: string;
  text: string;
  date: Date;
  givenHugs: number;
}
