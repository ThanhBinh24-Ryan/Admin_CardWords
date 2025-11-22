import { 
  Notification, 
  CreateNotificationRequest, 
  BroadcastNotificationRequest,
  BaseResponse,
  User,
  UsersPageResponse,
  NotificationSummary,
  NotificationCategory
} from '../types/notification';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';

class NotificationService {
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('🔔 API Request:', url, options);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('🔔 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      // Xử lý response empty
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        return {} as T;
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  async getUsers(page: number = 0, size: number = 100): Promise<UsersPageResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: 'createdAt',
      sortDir: 'desc'
    });
    
    const response = await this.request<any>(`/users?${queryParams.toString()}`);
    console.log('👥 Users API response:', response);
    
    // Chuẩn hóa response về dạng UsersPageResponse
    if (response && response.data) {
      return response.data as UsersPageResponse;
    }
    return response as UsersPageResponse;
  }

  async getNotificationSummary(): Promise<BaseResponse<NotificationSummary[]>> {
    const response = await this.request<any>('/notifications/summary');
    console.log('📈 Summary API response:', response);
    
    // Chuẩn hóa response về dạng BaseResponse
    if (Array.isArray(response)) {
      return {
        status: 'success',
        message: 'Success',
        data: response
      };
    }
    return response as BaseResponse<NotificationSummary[]>;
  }

  async getNotificationCategories(): Promise<BaseResponse<NotificationCategory[]>> {
    const response = await this.request<any>('/notifications/categories');
    console.log('📋 Categories API response:', response);
    
    // Chuẩn hóa response về dạng BaseResponse
    if (Array.isArray(response)) {
      return {
        status: 'success',
        message: 'Success',
        data: response
      };
    }
    return response as BaseResponse<NotificationCategory[]>;
  }

  async createNotification(request: CreateNotificationRequest): Promise<BaseResponse<Notification>> {
    const response = await this.request<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    console.log('📝 Create notification response:', response);
    
    // Chuẩn hóa response
    if (response && !response.data) {
      return {
        status: 'success',
        message: 'Notification created successfully',
        data: response as Notification
      };
    }
    return response as BaseResponse<Notification>;
  }

  async broadcastNotification(request: BroadcastNotificationRequest): Promise<BaseResponse<{}>> {
    const response = await this.request<any>('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    console.log('📢 Broadcast notification response:', response);
    
    // Chuẩn hóa response
    if (response && !response.status) {
      return {
        status: 'success',
        message: 'Notification broadcast successfully',
        data: {}
      };
    }
    return response as BaseResponse<{}>;
  }

  async deleteUserNotification(userId: string, notificationId: number): Promise<BaseResponse<{}>> {
    const response = await this.request<any>(`/notifications/users/${userId}/${notificationId}`, {
      method: 'DELETE'
    });
    console.log('🗑️ Delete user notification response:', response);
    
    // Chuẩn hóa response
    if (response && !response.status) {
      return {
        status: 'success',
        message: 'Notification deleted successfully',
        data: {}
      };
    }
    return response as BaseResponse<{}>;
  }

  async deleteMultipleUserNotifications(userId: string, notificationIds: number[]): Promise<BaseResponse<{}>> {
    const response = await this.request<any>(`/notifications/users/${userId}/batch`, {
      method: 'DELETE',
      body: JSON.stringify({ notificationIds })
    });
    console.log('🗑️ Delete multiple notifications response:', response);
    
    // Chuẩn hóa response
    if (response && !response.status) {
      return {
        status: 'success',
        message: 'Notifications deleted successfully',
        data: {}
      };
    }
    return response as BaseResponse<{}>;
  }

  async deleteBroadcastNotification(notificationId: number): Promise<BaseResponse<{}>> {
    const response = await this.request<any>(`/notifications/broadcast/${notificationId}`, {
      method: 'DELETE'
    });
    console.log('🗑️ Delete broadcast notification response:', response);
    
    // Chuẩn hóa response
    if (response && !response.status) {
      return {
        status: 'success',
        message: 'Broadcast notification deleted successfully',
        data: {}
      };
    }
    return response as BaseResponse<{}>;
  }
}

export const notificationService = new NotificationService();