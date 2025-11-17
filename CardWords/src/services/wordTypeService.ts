import { 
  WordType, 
  WordTypeResponse, 
  WordTypesResponse, 
  CreateWordTypeRequest,
  EmptyResponse 
} from '../types/wordType';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

class WordTypeService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || null;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {};

    // KHÔNG set Content-Type cho FormData, browser sẽ tự set với boundary
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${url}`;
    
    console.log('🔍 Making request to:', fullUrl);
    console.log('🔍 Request method:', options.method);
    console.log('🔍 Request body:', options.body);
    console.log('🔍 Request headers:', headers);

    try {
      const response = await fetch(fullUrl, {
        headers,
        ...options,
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      const responseText = await response.text();
      console.log('🔍 Raw response body:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          console.log('🔍 Parsed error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      try {
        const data = JSON.parse(responseText);
        console.log('🔍 Success response data:', data);
        return data;
      } catch (parseError) {
        console.error('❌ Failed to parse success response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  // Lấy danh sách tất cả loại từ
  async getAllTypes(): Promise<WordTypesResponse> {
    return this.request<WordTypesResponse>('/types');
  }

  // Lấy thông tin loại từ theo ID
  async getTypeById(id: number): Promise<WordTypeResponse> {
    return this.request<WordTypeResponse>(`/types/${id}`);
  }

  // Tạo loại từ mới - SỬ DỤNG FORMDATA
  async createType(request: CreateWordTypeRequest): Promise<WordTypeResponse> {
    console.log('🔍 Original request data:', request);
    
    // Tạo FormData object
    const formData = new FormData();
    formData.append('name', request.name.trim());
    
    if (request.description && request.description.trim()) {
      formData.append('description', request.description.trim());
    }
    
    console.log('🔍 FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    return this.request<WordTypeResponse>('/types', {
      method: 'POST',
      body: formData, // Gửi FormData thay vì JSON
    });
  }

  // Xóa loại từ
  async deleteType(id: number): Promise<EmptyResponse> {
    return this.request<EmptyResponse>(`/types/${id}`, {
      method: 'DELETE',
    });
  }
}

export const wordTypeService = new WordTypeService();