// Base response type
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Types cho Vocab Progress
export interface VocabProgressStats {
  vocabId: string;
  totalLearners: number;
  totalCorrect: number;
  totalWrong: number;
  totalAttempts: number;
  accuracy: number;
}

export interface UserVocabProgress {
  id: string;
  userId: string;
  userName: string;
  vocabId: string;
  word: string;
  meaningVi: string;
  cefr: string;
  timesCorrect: number;
  timesWrong: number;
  accuracy: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgressResponse {
  totalElements: number;
  totalPages: number;
  last: boolean;
  pageable: {
    paged: boolean;
    unpaged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
  };
  numberOfElements: number;
  first: boolean;
  size: number;
  content: UserVocabProgress[];
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

export interface SystemStatistics {
  totalProgressRecords: number;
  totalCorrect: number;
  totalWrong: number;
  totalAttempts: number;
  overallAccuracy: number;
}

export interface DifficultWord {
  vocabId: string;
  word: string;
  meaningVi: string;
  cefr: string;
  learnerCount: number;
  timesCorrect: number;
  timesWrong: number;
  errorRate: number;
}

// Request types
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface DifficultWordsParams {
  limit?: number;
}

// Empty response for delete operations
export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}