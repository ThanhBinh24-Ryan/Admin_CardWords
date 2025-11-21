import { 
  Vocab, 
  VocabResponse, 
  VocabsResponse, 
  CreateVocabRequest, 
  UpdateVocabRequest,
  BulkImportRequest,
  BulkImportResponse,
  PaginationParams,
  SearchParams,
  CefrParams,
  EmptyResponse,
  UploadResponse
} from '../types/vocab';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
const STORAGE_API_URL = 'http://localhost:8080/api/v1/storage';

class VocabService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || null;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('🔍 Making request to:', fullUrl);

    try {
      const response = await fetch(fullUrl, {
        headers,
        ...options,
      });

      console.log('🔍 Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const responseText = await response.text();
          console.log('🔍 Response body:', responseText);
          
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If cannot parse response, use default message
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('🔍 Response data:', data);
      return data;

    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  // Upload image
  async uploadImage(file: File): Promise<UploadResponse> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${STORAGE_API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Upload audio
  async uploadAudio(file: File): Promise<UploadResponse> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${STORAGE_API_URL}/upload/audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Lấy từ vựng theo ID
  async getVocabById(id: string): Promise<VocabResponse> {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Tham số "id" không đúng định dạng. Yêu cầu kiểu: UUID');
    }
    return this.request<VocabResponse>(`/vocabs/${id}`);
  }

  // Lấy từ vựng theo từ
  async getVocabByWord(word: string): Promise<VocabResponse> {
    return this.request<VocabResponse>(`/vocabs/word/${encodeURIComponent(word)}`);
  }

  // Lấy danh sách từ vựng với phân trang
  async getVocabs(params: PaginationParams = {}): Promise<VocabsResponse> {
    const { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    return this.request<VocabsResponse>(`/vocabs?${queryParams}`);
  }

  // Tìm kiếm từ vựng
  async searchVocabs(params: SearchParams): Promise<VocabsResponse> {
    const { keyword, page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      keyword,
      page: page.toString(),
      size: size.toString()
    });

    return this.request<VocabsResponse>(`/vocabs/search?${queryParams}`);
  }

  // Lấy từ vựng theo CEFR level
  async getVocabsByCefr(params: CefrParams): Promise<VocabsResponse> {
    const { cefr, page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    return this.request<VocabsResponse>(`/vocabs/cefr/${cefr}?${queryParams}`);
  }

  // Tạo từ vựng mới
  async createVocab(vocabData: CreateVocabRequest): Promise<VocabResponse> {
    return this.request<VocabResponse>('/vocabs', {
      method: 'POST',
      body: JSON.stringify(vocabData),
    });
  }

  // Cập nhật từ vựng theo ID
  async updateVocabById(id: string, vocabData: UpdateVocabRequest): Promise<VocabResponse> {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Tham số "id" không đúng định dạng. Yêu cầu kiểu: UUID');
    }
    return this.request<VocabResponse>(`/vocabs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vocabData),
    });
  }

  // Cập nhật từ vựng theo từ
  async updateVocabByWord(word: string, vocabData: UpdateVocabRequest): Promise<VocabResponse> {
    return this.request<VocabResponse>(`/vocabs/word/${encodeURIComponent(word)}`, {
      method: 'PUT',
      body: JSON.stringify(vocabData),
    });
  }

  // Xóa từ vựng
  async deleteVocab(id: string): Promise<EmptyResponse> {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('Tham số "id" không đúng định dạng. Yêu cầu kiểu: UUID');
    }
    return this.request<EmptyResponse>(`/vocabs/${id}`, {
      method: 'DELETE',
    });
  }

  // Import nhiều từ vựng
  async bulkImport(vocabs: CreateVocabRequest[]): Promise<BulkImportResponse> {
    return this.request<BulkImportResponse>('/vocabs/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ vocabs }),
    });
  }

  // Export to Excel
  async exportToExcel(): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/vocabs/export/excel`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
}

export const vocabService = new VocabService();