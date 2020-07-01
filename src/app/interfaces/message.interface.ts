// Message interface
// Based on the Message Model
export interface Message {
  id?: number;
  from: string;
  fromId: number;
  for?: string;
  forId: number;
  messageText: string;
  date: Date;
  threadID?: number;
  isoDate?: string;
}
