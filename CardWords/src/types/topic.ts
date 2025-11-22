// export interface Topic {
//   id: number;
//   name: string;
//   description: string;
//   img: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface TopicFormData {
//   name: string;
//   description: string;
//   image?: File | null;
// }

// // Cập nhật interface cho bulk create với file upload
// export interface BulkTopicCreate {
//   topics: Array<{
//     name: string;
//     description?: string;
//     image?: File | null;
//   }>;
// }

// // Cập nhật interface cho bulk update với file upload
// export interface BulkTopicUpdate {
//   topics: Array<{
//     id: number;
//     name?: string;
//     description?: string;
//     image?: File | null;
//   }>;
// }

// export interface BulkOperationResult {
//   totalRequested: number;
//   successCount: number;
//   failureCount: number;
//   results: Array<{
//     success: boolean;
//     message: string;
//     data?: Topic;
//     inputName?: string;
//     inputId?: number;
//   }>;
// }

// export interface TopicFilter {
//   search?: string;
// }

// export interface TopicApiResponse<T = any> {
//   status: string;
//   message: string;
//   data: T;
// }

// export interface TopicPaginationParams {
//   page?: number;
//   size?: number;
//   sortBy?: string;
//   sortDir?: 'asc' | 'desc';
// }

// export interface TopicPaginationInfo {
//   totalElements: number;
//   totalPages: number;
//   currentPage: number;
//   size: number;
// }


// src/types/topic.ts
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
  imageUrl?: string;
}

export interface BulkTopicCreate {
  topics: Array<{
    name: string;
    description?: string | null;
    imageUrl?: string | null;
  }>;
}

export interface BulkTopicUpdate {
  topics: Array<{
    id: number;
    name?: string | null;
    description?: string | null;
    imageUrl?: string | null;
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

export interface StorageApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}