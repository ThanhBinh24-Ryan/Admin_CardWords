export interface Notification {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId?: string;
}

export type NotificationType = 
  | 'vocab_reminder'
  | 'new_feature'
  | 'achievement'
  | 'system_alert'
  | 'study_progress';

export interface CreateNotificationRequest {
  userId?: string;
  title: string;
  content: string;
  type: NotificationType;
}

export interface BroadcastNotificationRequest {
  title: string;
  content: string;
  type: NotificationType;
}

export interface BaseResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}