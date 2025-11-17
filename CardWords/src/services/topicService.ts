import { 
  Topic, 
  TopicFormData, 
  BulkTopicCreate, 
  BulkTopicUpdate, 
  BulkOperationResult,
  TopicApiResponse
} from '../types/topic';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

class TopicService {
  // Hàm lấy token từ localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Hàm tạo headers với authentication
  private getAuthHeaders(contentType: string = 'application/json'): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Chỉ thêm Content-Type nếu không phải FormData
    if (contentType && contentType !== 'multipart/form-data') {
      headers['Content-Type'] = contentType;
    }

    // Thêm token nếu có
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log('🔐 Token được sử dụng:', this.getAuthToken());
    console.log('🌐 Making request to:', url);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', {
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
        throw new Error(`Lỗi HTTP! status: ${response.status} - ${response.statusText}`);
      }
    }

    return response.json();
  }

  // GET - Lấy danh sách tất cả chủ đề
  async getAllTopics(): Promise<TopicApiResponse<Topic[]>> {
    return this.request<TopicApiResponse<Topic[]>>('/topics', {
      method: 'GET',
    });
  }

  // GET - Lấy thông tin chi tiết chủ đề theo ID
  async getTopicById(id: number): Promise<TopicApiResponse<Topic>> {
    return this.request<TopicApiResponse<Topic>>(`/topics/${id}`, {
      method: 'GET',
    });
  }

  // POST - Tạo chủ đề mới
  async createTopic(formData: TopicFormData): Promise<TopicApiResponse<Topic>> {
    const data = new FormData();
    data.append('name', formData.name);
    
    if (formData.description) {
      data.append('description', formData.description);
    }
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    // For FormData, let browser set Content-Type automatically
    return this.request<TopicApiResponse<Topic>>('/topics', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        // Don't set Content-Type for FormData
      },
      body: data,
    });
  }

  // PUT - Cập nhật chủ đề
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
    }

    return this.request<TopicApiResponse<Topic>>(`/topics/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });
  }

  // DELETE - Xóa chủ đề
  async deleteTopic(id: number): Promise<TopicApiResponse<{}>> {
    return this.request<TopicApiResponse<{}>>(`/topics/${id}`, {
      method: 'DELETE',
    });
  }

  // POST - Tạo nhiều chủ đề cùng lúc
  async bulkCreateTopics(
    bulkData: BulkTopicCreate
  ): Promise<TopicApiResponse<BulkOperationResult>> {
    return this.request<TopicApiResponse<BulkOperationResult>>('/topics/bulk-create', {
      method: 'POST',
      headers: this.getAuthHeaders('application/json'),
      body: JSON.stringify(bulkData),
    });
  }

  // PUT - Cập nhật nhiều chủ đề cùng lúc
  async bulkUpdateTopics(
    bulkData: BulkTopicUpdate
  ): Promise<TopicApiResponse<BulkOperationResult>> {
    return this.request<TopicApiResponse<BulkOperationResult>>('/topics/bulk-update', {
      method: 'PUT',
      headers: this.getAuthHeaders('application/json'),
      body: JSON.stringify(bulkData),
    });
  }

  // Kiểm tra token có hợp lệ không
  checkTokenValidity(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      // Giải mã token để kiểm tra expiry (JWT token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Lỗi kiểm tra token:', error);
      return false;
    }
  }

  // Lấy thông tin user từ token
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