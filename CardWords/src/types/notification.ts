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
  | 'study_progress'
  | 'vocab_reminder'
  | 'streak_reminder'
  | 'streak_milestone'
  | 'game_achievement'
  | 'achievement'
  | 'new_feature'
  | 'system_alert';

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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  currentLevel: string;
  activated: boolean;
}

export interface UsersPageResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface NotificationSummary {
  category: string;
  count: number;
  type: string;
}

export interface NotificationCategory {
  category: string;
  count: number;
  type: string;
}

// Thêm type cho API response linh hoạt
export interface ApiResponse<T = any> {
  data?: T;
  content?: T;
  status?: string;
  message?: string;
  [key: string]: any;
}