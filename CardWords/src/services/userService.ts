import { 
  User, 
  UserResponse, 
  UsersResponse, 
  StatisticsResponse, 
  UpdateRolesRequest, 
  PaginationParams, 
  SearchParams,
  EmptyResponse 
} from '../types/user';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
// const API_BASE_URL = 'http://103.9.77.220:8080/api/v1/admin';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1/admin';
// const API_BASE_URL = 'http://103.9.77.220:8080/api/v1/admin';
class UserService {
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
    console.log(' Making request to:', fullUrl);
    console.log(' Headers:', headers);
    console.log(' Token exists:', !!token);

    try {
      const response = await fetch(fullUrl, {
        headers,
        ...options,
      });

      console.log(' Response status:', response.status);
      console.log(' Response ok:', response.ok);

      const responseText = await response.text();
      console.log('🔍 Response body:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.log(' Error details:', errorData);
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      try {
        const data = JSON.parse(responseText);
        console.log(' Response data parsed successfully');
        return data;
      } catch (parseError) {
        console.error(' Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

    } catch (error) {
      console.error(' Request failed:', error);
      throw error;
    }
  }

  async getUsers(params: PaginationParams = {}): Promise<UsersResponse> {
    const { page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    return this.request<UsersResponse>(`/users?${queryParams}`);
  }

  async getUserById(id: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/email/${email}`);
  }

  async searchUsers(params: SearchParams): Promise<UsersResponse> {
    const { keyword, page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      keyword,
      page: page.toString(),
      size: size.toString()
    });

    return this.request<UsersResponse>(`/users/search?${queryParams}`);
  }

  async updateUserRoles(id: string, roleNames: string[]): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roleNames }),
    });
  }

  async banUser(id: string, banned: boolean): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}/ban?banned=${banned}`, {
      method: 'PUT',
    });
  }

  async activateUser(id: string, activated: boolean): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}/activate?activated=${activated}`, {
      method: 'PUT',
    });
  }

  async deleteUser(id: string): Promise<EmptyResponse> {
    return this.request<EmptyResponse>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStatistics(): Promise<StatisticsResponse> {
    return this.request<StatisticsResponse>('/users/statistics');
  }
}

export const userService = new UserService();