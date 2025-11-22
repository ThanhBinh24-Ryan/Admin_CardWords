import { 
  VocabProgressStats, 
  UserVocabProgress, 
  SystemStatistics, 
  DifficultWord, 
  ApiResponse,
  PaginationParams,
  DifficultWordsParams,
  UserProgressResponse,
  User,
  UserResponse,
  Vocab,
  VocabResponse,
  ListParams
} from '../types/vocabProgress';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

class VocabProgressService {
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
    console.log('🔍 Headers:', headers);
    console.log('🔍 Token exists:', !!token);

    try {
      const response = await fetch(fullUrl, {
        headers,
        ...options,
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);

      // Lấy response text để xem chi tiết lỗi
      const responseText = await response.text();
      console.log('🔍 Response body:', responseText);

      if (!response.ok) {
        // Parse error response nếu có thể
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.log('🔍 Error details:', errorData);
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Parse thành JSON nếu response ok
      try {
        const data = JSON.parse(responseText);
        console.log('🔍 Response data parsed successfully');
        return data;
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  // [Admin] Lấy thống kê từ vựng
  async getVocabStats(vocabId: string): Promise<VocabProgressStats> {
    const response = await this.request<ApiResponse<VocabProgressStats>>(
      `/vocab-progress/vocab/${vocabId}`
    );
    return response.data;
  }

  // [Admin] Lấy tiến độ học từ của user
  async getUserProgress(
    userId: string, 
    params: PaginationParams = {}
  ): Promise<UserProgressResponse> {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    const response = await this.request<ApiResponse<UserProgressResponse>>(
      `/vocab-progress/user/${userId}?${queryParams}`
    );
    return response.data;
  }

  // [Admin] Tổng quan tiến độ học toàn hệ thống
  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await this.request<ApiResponse<SystemStatistics>>(
      '/vocab-progress/statistics'
    );
    return response.data;
  }

  // [Admin] Lấy danh sách từ khó nhất
  async getDifficultWords(params: DifficultWordsParams = {}): Promise<DifficultWord[]> {
    const { limit = 20 } = params;
    const queryParams = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await this.request<ApiResponse<DifficultWord[]>>(
      `/vocab-progress/difficult-words?${queryParams}`
    );
    return response.data;
  }

  // [Admin] Xóa bản ghi tiến độ
  async deleteProgress(id: string): Promise<void> {
    await this.request<ApiResponse<{}>>(`/vocab-progress/${id}`, {
      method: 'DELETE',
    });
  }

  // [Admin] Reset tiến độ của user
  async resetUserProgress(userId: string): Promise<void> {
    await this.request<ApiResponse<{}>>(`/vocab-progress/user/${userId}/reset`, {
      method: 'DELETE',
    });
  }

  // [Admin] Lấy danh sách người dùng
  async getUsers(params: ListParams = {}): Promise<UserResponse> {
    const { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    const response = await this.request<ApiResponse<UserResponse>>(
      `/users?${queryParams}`
    );
    return response.data;
  }

  // [Admin] Lấy danh sách từ vựng
  async getVocabs(params: ListParams = {}): Promise<VocabResponse> {
    const { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    const response = await this.request<ApiResponse<VocabResponse>>(
      `/vocabs?${queryParams}`
    );
    return response.data;
  }
}

export const vocabProgressService = new VocabProgressService();