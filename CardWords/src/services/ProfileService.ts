// services/profileService.ts
import { 
  ProfileResponse, 
  UpdateProfileRequest, 
  ChangePasswordRequest, 
  ChangePasswordResponse 
} from '../types/profile';

// const API_BASE_URL = 'http://localhost:8080/api/v1';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1';
const API_BASE_URL = 'http://103.9.77.220:8080/api/v1';
class ProfileService {
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

    try {
      const response = await fetch(fullUrl, {
        headers,
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
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
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // Lấy thông tin profile
  async getProfile(): Promise<ProfileResponse> {
    return this.request<ProfileResponse>('/users');
  }

  // Cập nhật thông tin profile
  async updateProfile(profileData: UpdateProfileRequest): Promise<ProfileResponse> {
    return this.request<ProfileResponse>('/users', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Cập nhật avatar
  async updateAvatar(avatarFile: File): Promise<ProfileResponse> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update avatar');
    }

    return response.json();
  }

  // Đổi mật khẩu
  async changePassword(passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return this.request<ChangePasswordResponse>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }
}

export const profileService = new ProfileService();