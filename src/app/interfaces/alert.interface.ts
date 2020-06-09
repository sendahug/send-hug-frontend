// Alert message interface
// Used for popup alerts by the Alerts Service
export interface AlertMessage {
  message: string;
  type: MessageType;
}

type MessageType = 'Error' | 'Success' | 'Notification'
