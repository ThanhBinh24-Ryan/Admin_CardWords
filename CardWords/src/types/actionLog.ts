// Base response types to match your pattern
export interface BaseResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}

// Pagination types
export interface Pageable {
  paged: boolean;
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  content: T[];
  number: number;
  sort: Sort;
  empty: boolean;
}

// Action Log types - CHỈ GIỮ LẠI CÁC TRƯỜNG CÓ TRONG API
export interface ActionLog {
  id: number;
  userId: string;
  actionType: string;
  actionCategory: string | null;
  resourceType: string;
  description: string;
  status: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  createdAt: string;
}

export interface ActionLogStatistics {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  activeUsers: number;
}

// Filter types
export interface ActionLogFilter {
  userId?: string;
  actionType?: string;
  resourceType?: string;
  status?: 'SUCCESS' | 'FAILED';
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface ExportFilter {
  startDate?: string;
  endDate?: string;
}

export interface CleanupParams {
  daysToKeep?: number;
}

// Response types for API calls
export type ActionLogsResponse = BaseResponse<PageResponse<ActionLog>>;
export type ActionLogStatisticsResponse = BaseResponse<ActionLogStatistics>;
export type ActionLogExportResponse = BaseResponse<ActionLog[]>;
export type ActionLogCleanupResponse = BaseResponse<{}>;

// Store state types
export interface ActionLogState {
  logs: ActionLog[];
  statistics: ActionLogStatistics | null;
  loading: boolean;
  error: string | null;
  filters: ActionLogFilter;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
}

// Constants
export const ACTION_LOG_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export const DEFAULT_PAGINATION = {
  page: 0,
  size: 10,
  sortBy: 'createdAt',
  sortDirection: 'DESC' as const,
};

// Action Types Constants
export const ACTION_TYPES = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  VOCAB_CREATE: 'VOCAB_CREATE',
  VOCAB_UPDATE: 'VOCAB_UPDATE',
  VOCAB_DELETE: 'VOCAB_DELETE',
  USER_REGISTER: 'USER_REGISTER',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
} as const;

export const RESOURCE_TYPES = {
  AUTHENTICATION: 'Authentication',
  VOCABULARY: 'Vocabulary',
  SYSTEM: 'System',
  USER: 'User',
  PROFILE: 'Profile',
} as const;