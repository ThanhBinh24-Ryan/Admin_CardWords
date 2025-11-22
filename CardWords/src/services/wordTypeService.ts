// wordTypeService.ts
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

  async getAllTypes(): Promise<WordTypesResponse> {
    return this.request<WordTypesResponse>('/types');
  }

  async getTypeById(id: number): Promise<WordTypeResponse> {
    return this.request<WordTypeResponse>(`/types/${id}`);
  }

  async createType(request: CreateWordTypeRequest): Promise<WordTypeResponse> {
    console.log('🔍 Original request data:', request);
    
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
      body: formData,
    });
  }

  async updateType(id: number, request: { name: string }): Promise<WordTypeResponse> {
    console.log('🔍 Update type request:', { id, request });
    
    const formData = new FormData();
    formData.append('name', request.name.trim());
    
    return this.request<WordTypeResponse>(`/types/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async updateTypesBatch(requests: Array<{ id: number; name: string }>): Promise<WordTypesResponse> {
    console.log('🔍 Batch update request:', requests);
    
    const formData = new FormData();
    
    requests.forEach((request, index) => {
      formData.append(`types[${index}].id`, request.id.toString());
      formData.append(`types[${index}].name`, request.name.trim());
    });
    
    console.log('🔍 FormData entries for batch:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    return this.request<WordTypesResponse>('/types/batch', {
      method: 'PUT',
      body: formData,
    });
  }

  async deleteType(id: number): Promise<EmptyResponse> {
    return this.request<EmptyResponse>(`/types/${id}`, {
      method: 'DELETE',
    });
  }
}

export const wordTypeService = new WordTypeService();