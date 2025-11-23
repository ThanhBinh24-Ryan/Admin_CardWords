// notification.ts
export interface Notification {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export type NotificationType = 
  | 'study_progress'
  | 'vocab_reminder'
  | 'streak_reminder'
  | 'streak_milestone'
  | 'streak_break'
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
  gender?: string;
  dateOfBirth?: string;
  currentLevel: string;
  activated: boolean;
  banned?: boolean;
  status?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersPageResponse {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  content: User[];
  number: number;
  sort: Sort;
  empty: boolean;
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

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  offset: number;
  sort: Sort;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface NotificationsPageResponse {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  content: Notification[];
  number: number;
  sort: Sort;
  empty: boolean;
}

export interface NotificationFilter {
  isRead?: boolean;
  type?: string;
  page?: number;
  size?: number;
}

export interface MultiUserNotificationFilter extends NotificationFilter {
  userIds: string[];
}

export interface ApiResponse<T = any> {
  data?: T;
  content?: T;
  status?: string;
  message?: string;
  [key: string]: any;
}

export function isNotificationsPageResponse(obj: any): obj is NotificationsPageResponse {
  return obj && 
    typeof obj.totalPages === 'number' && 
    typeof obj.totalElements === 'number' &&
    Array.isArray(obj.content);
}

// Type guard để kiểm tra UsersPageResponse
export function isUsersPageResponse(obj: any): obj is UsersPageResponse {
  return obj && 
    typeof obj.totalPages === 'number' && 
    typeof obj.totalElements === 'number' &&
    Array.isArray(obj.content);
}