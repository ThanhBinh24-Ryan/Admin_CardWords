export interface VocabType {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  name: string;
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
  types: VocabType[];
  topic: Topic;
}

export interface VocabResponse {
  status: string;
  message: string;
  data: Vocab;
}

export interface VocabsResponse {
  status: string;
  message: string;
  data: {
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
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
    last: boolean;
    first: boolean;
    size: number;
    content: Vocab[];
    number: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    empty: boolean;
  };
}

export interface CreateVocabRequest {
  word: string;
  transcription?: string;
  meaningVi: string;
  interpret?: string;
  exampleSentence?: string;
  cefr?: string;
  img?: string;
  audio?: string;
  credit?: string;
  types?: string[];
  topic?: string;
}

export interface UpdateVocabRequest extends Partial<CreateVocabRequest> {}

export interface BulkImportRequest {
  vocabs: CreateVocabRequest[];
}

export interface BulkImportResponse {
  status: string;
  message: string;
  data: {
    totalRequested: number;
    successCount: number;
    failedCount: number;
    skippedCount: number;
    errors: Array<{
      word: string;
      reason: string;
      lineNumber: number;
    }>;
  };
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  keyword: string;
}

export interface CefrParams extends PaginationParams {
  cefr: string;
}

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}

// Storage types
export interface UploadResponse {
  status: string;
  message: string;
  data: {
    [key: string]: string;
  };
}

export interface BulkUploadResponse {
  status: string;
  message: string;
  data: {
    totalRequested: number;
    successCount: number;
    failedCount: number;
    results: Array<{
      originalFilename: string;
      url: string;
      fileSize: number;
      contentType: string;
    }>;
    errors: Array<{
      filename: string;
      reason: string;
      index: number;
    }>;
  };
}

export interface MediaUploadResponse {
  status: string;
  message: string;
  data: {
    totalFiles: number;
    successCount: number;
    failedCount: number;
    skippedCount: number;
    results: Array<{
      fileName: string;
      word: string;
      mediaType: string;
      uploadedUrl: string;
      status: string;
    }>;
    errors: Array<{
      fileName: string;
      reason: string;
    }>;
  };
}

export interface CleanupResponse {
  status: string;
  message: string;
  data: {
    folder: string;
    dryRun: boolean;
    totalFilesScanned: number;
    activeFilesKept: number;
    unusedFilesDeleted: number;
    errorFiles: number;
    deletedFiles: string[];
    skippedFiles: string[];
    errorFilesList: string[];
  };
}
export interface VocabFilter {
  search: string;
  cefr: string;
  type: string;
  topic: string;
}
export interface BulkImportResponse {
  status: string;
  message: string;
  data: {
    totalRequested: number;
    successCount: number;
    failedCount: number;
    skippedCount: number;
    errors: Array<{
      word: string;
      reason: string;
      lineNumber: number;
    }>;
  };
}