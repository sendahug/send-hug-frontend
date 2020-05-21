// Message interface
// Based on the Message Model
export interface Message {
  Id?: number;
  from: string;
  fromId: number;
  for: string;
  forId: number;
  messageText: string;
  date: Date;
}
