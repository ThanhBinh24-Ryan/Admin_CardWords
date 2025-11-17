export interface Notification {
  id: string;
  message: string;
  type: 'review' | 'new_vocab';
  timestamp: string;
}