export interface AlertMessage {
  message: string;
  type: MessageType;
}

type MessageType = 'Error' | 'Success' | 'Notification'
