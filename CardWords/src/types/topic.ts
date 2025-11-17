export interface Topic {
  id: number;
  name: string;
  description: string;
  img: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicFormData {
  name: string;
  description: string;
  image?: File | null;
}

export interface BulkTopicCreate {
  topics: Array<{
    name: string;
    description?: string;
    imageUrl?: string;
  }>;
}

export interface BulkTopicUpdate {
  topics: Array<{
    id: number;
    name?: string;
    description?: string;
    imageUrl?: string;
  }>;
}

export interface BulkOperationResult {
  totalRequested: number;
  successCount: number;
  failureCount: number;
  results: Array<{
    success: boolean;
    message: string;
    data?: Topic;
    inputName?: string;
    inputId?: number;
  }>;
}

export interface TopicFilter {
  search?: string;
}

export interface TopicApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface TopicPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface TopicPaginationInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}