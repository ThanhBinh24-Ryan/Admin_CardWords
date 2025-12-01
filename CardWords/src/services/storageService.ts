import { 
  UploadResponse, 
  BulkUploadResponse, 
  MediaUploadResponse,
  CleanupResponse,
  EmptyResponse 
} from '../types/storage';

const API_BASE_URL = 'https://card-words.io.vn/api/v1/storage';
// const API_BASE_URL = 'http://localhost:8080/api/v1/storage';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1/storage';
// const API_BASE_URL = 'http://103.9.77.220:8080/api/v1/storage';
class StorageService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(' Storage Request:', url);
    console.log(' Token exists:', !!token);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('Storage Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Storage Error:', errorText);
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(' Storage Response data:', data);
      return data;
    } catch (error) {
      console.error(' Storage Request failed:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<UploadResponse>('/upload/image', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadImages(files: File[]): Promise<BulkUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.request<BulkUploadResponse>('/upload/images/bulk', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadAudio(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<UploadResponse>('/upload/audio', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadAudios(files: File[]): Promise<BulkUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.request<BulkUploadResponse>('/upload/audios/bulk', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadMediaAndUpdateVocab(files: File[]): Promise<MediaUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.request<MediaUploadResponse>('/upload/media-and-update-vocab', {
      method: 'POST',
      body: formData,
    });
  }

  async cleanupImages(dryRun: boolean = true): Promise<CleanupResponse> {
    return this.request<CleanupResponse>(`/cleanup/images?dryRun=${dryRun}`, {
      method: 'POST',
    });
  }

  async cleanupAudios(dryRun: boolean = true): Promise<CleanupResponse> {
    return this.request<CleanupResponse>(`/cleanup/audios?dryRun=${dryRun}`, {
      method: 'POST',
    });
  }

  async deleteFile(url: string): Promise<EmptyResponse> {
    return this.request<EmptyResponse>(`/delete?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    });
  }
}

export const storageService = new StorageService();