export interface UploadResponse {
  status: string;
  message: string;
  data: {
    url?: string;
    fileName?: string;
    fileSize?: number;
    contentType?: string;
    [key: string]: any;
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
      index?: number;
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

export interface EmptyResponse {
  status: string;
  message: string;
  data: {};
}