// Post interface
// Based on the Post Model
export interface Post {
  id?: number;
  userId: number;
  user: string;
  text: string;
  date: Date;
  givenHugs: number;
  isoDate?: string;
  sentHugs?: number[];
}
