// Thread interface
// For the Messages component
export interface Thread {
  id: number,
  user: string,
  userID: number,
  numMessages: number,
  latestMessage: Date
}
