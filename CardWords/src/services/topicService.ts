
import { 
  Topic, 
  TopicFormData, 
  BulkTopicCreate, 
  BulkTopicUpdate, 
  BulkOperationResult,
  TopicApiResponse,
  StorageApiResponse
} from '../types/topic';

const STORAGE_API_URL = 'https://card-words.io.vn/api/v1';
const API_BASE_URL = 'https://card-words.io.vn/api/v1/admin';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1/admin';
// const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
// const STORAGE_API_URL = 'http://localhost:8080/api/v1';
// const API_BASE_URL = 'http://103.9.77.220:8080/api/v1/admin';
// const STORAGE_API_URL = 'http://103.9.77.220:8080/api/v1';
// const STORAGE_API_URL = 'https://card-words-services-production.up.railway.app/api/v1';
class TopicService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getAuthHeaders(contentType: string = 'application/json'): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (contentType && contentType !== 'multipart/form-data') {
      headers['Content-Type'] = contentType;
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log(' Making request to:', url, {
      method: config.method,
      headers: config.headers
    });

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' API Error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText
      });

      if (response.status === 403) {
        throw new Error('Truy cập bị từ chối. Vui lòng kiểm tra quyền ADMIN.');
      } else if (response.status === 401) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        throw new Error(`Lỗi HTTP! status: ${response.status} - ${response.statusText}. Chi tiết: ${errorText}`);
      }
    }

    const responseData = await response.json();
    console.log('API Success:', responseData);
    return responseData;
  }

  async getAllTopics(): Promise<TopicApiResponse<Topic[]>> {
    return this.request<TopicApiResponse<Topic[]>>(`${API_BASE_URL}/topics`, {
      method: 'GET',
    });
  }

  async getTopicById(id: number): Promise<TopicApiResponse<Topic>> {
    return this.request<TopicApiResponse<Topic>>(`${API_BASE_URL}/topics/${id}`, {
      method: 'GET',
    });
  }

  async createTopic(formData: TopicFormData): Promise<TopicApiResponse<Topic>> {
    const data = new FormData();
    data.append('name', formData.name);
    
    if (formData.description) {
      data.append('description', formData.description);
    }
    
    if (formData.image) {
      data.append('image', formData.image);
    } else if (formData.imageUrl) {
      data.append('imageUrl', formData.imageUrl);
    }

    return this.request<TopicApiResponse<Topic>>(`${API_BASE_URL}/topics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });
  }

  async updateTopic(
    id: number, 
    formData: Partial<TopicFormData>
  ): Promise<TopicApiResponse<Topic>> {
    const data = new FormData();
    
    if (formData.name) {
      data.append('name', formData.name);
    }
    
    if (formData.description) {
      data.append('description', formData.description);
    }
    
    if (formData.image) {
      data.append('image', formData.image);
    } else if (formData.imageUrl) {
      data.append('imageUrl', formData.imageUrl);
    }

    return this.request<TopicApiResponse<Topic>>(`${API_BASE_URL}/topics/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });
  }

  async deleteTopic(id: number): Promise<TopicApiResponse<{}>> {
    return this.request<TopicApiResponse<{}>>(`${API_BASE_URL}/topics/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkCreateTopics(
    bulkData: BulkTopicCreate
  ): Promise<TopicApiResponse<BulkOperationResult>> {
    const payload = {
      topics: bulkData.topics.map(topic => ({
        name: topic.name,
        description: topic.description || null,
        imageUrl: topic.imageUrl || null
      }))
    };

    console.log(' Sending bulk create request with JSON:', payload);

    return this.request<TopicApiResponse<BulkOperationResult>>(`${API_BASE_URL}/topics/bulk-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
  }

  async bulkUpdateTopics(
    bulkData: BulkTopicUpdate
  ): Promise<TopicApiResponse<BulkOperationResult>> {
    const payload = {
      topics: bulkData.topics.map(topic => ({
        id: topic.id,
        name: topic.name || null,
        description: topic.description || null,
        imageUrl: topic.imageUrl || null
      }))
    };

    console.log('📤 Sending bulk update request with JSON:', payload);

    return this.request<TopicApiResponse<BulkOperationResult>>(`${API_BASE_URL}/topics/bulk-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
  }

  async uploadImage(file: File): Promise<StorageApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    console.log(' Uploading image:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const response = await this.request<StorageApiResponse<any>>(`${STORAGE_API_URL}/storage/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: formData,
    });

    console.log(' Upload response:', response);
    return response;
  }

  checkTokenValidity(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
      return false;
    }
  }

  getCurrentUser() {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Lỗi giải mã token:', error);
      return null;
    }
  }
}

export const topicService = new TopicService();