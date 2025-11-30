export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

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

// Types cho User
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  currentLevel: string;
  activated: boolean;
  banned: boolean;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  totalElements: number;
  totalPages: number;
  content: User[];
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface Vocab {
  id: string;
  word: string;
  transcription: string;
  meaningVi: string;
  interpret: string;
  exampleSentence: string;
  cefr: string;
  img: string;
  audio: string;
  credit: string;
  createdAt: string;
  updatedAt: string;
  types: Array<{ id: number; name: string }>;
  topic: { id: number; name: string };
}

export interface VocabResponse {
  totalElements: number;
  totalPages: number;
  content: Vocab[];
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Request types
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface DifficultWordsParams {
  limit?: number;
}

export interface ListParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}