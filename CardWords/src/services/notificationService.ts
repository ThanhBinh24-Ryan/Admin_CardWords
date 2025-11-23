// notificationService.ts
import { 
  Notification, 
  CreateNotificationRequest, 
  BroadcastNotificationRequest,
  BaseResponse,
  User,
  UsersPageResponse,
  NotificationSummary,
  NotificationCategory,
  NotificationsPageResponse,
  NotificationFilter,
  MultiUserNotificationFilter,
  isNotificationsPageResponse
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
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || response.status === 204) {
        return { status: 'success', message: 'Success', data: {} } as T;
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  async getUsers(page: number = 0, size: number = 20, sortBy: string = 'createdAt', sortDir: string = 'desc'): Promise<BaseResponse<UsersPageResponse>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    });
    
    const response = await this.request<BaseResponse<UsersPageResponse>>(`/users?${queryParams.toString()}`);
    console.log('👥 Users API response:', response);
    
    return response;
  }

  async getNotificationSummary(): Promise<BaseResponse<NotificationSummary[]>> {
    const response = await this.request<any>('/notifications/summary');
    console.log('📈 Summary API response:', response);
    
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
    
    if (Array.isArray(response)) {
      return {
        status: 'success',
        message: 'Success',
        data: response
      };
    }
    return response as BaseResponse<NotificationCategory[]>;
  }

  async getAllNotifications(filter: NotificationFilter = {}): Promise<BaseResponse<NotificationsPageResponse>> {
    const { isRead, type, page = 0, size = 20 } = filter;
    
    const queryParams = new URLSearchParams();
    if (isRead !== undefined) queryParams.append('isRead', isRead.toString());
    if (type) queryParams.append('type', type);
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    const response = await this.request<BaseResponse<NotificationsPageResponse>>(`/notifications?${queryParams.toString()}`);
    console.log('📝 All notifications API response:', response);
    
    return response;
  }

  async getUserNotifications(userId: string, filter: NotificationFilter = {}): Promise<BaseResponse<NotificationsPageResponse>> {
    const { isRead, type, page = 0, size = 20 } = filter;
    
    const queryParams = new URLSearchParams();
    if (isRead !== undefined) queryParams.append('isRead', isRead.toString());
    if (type) queryParams.append('type', type);
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    const response = await this.request<BaseResponse<NotificationsPageResponse>>(`/notifications/users/${userId}?${queryParams.toString()}`);
    console.log('👤 User notifications API response:', response);
    
    return response;
  }

  async createNotification(request: CreateNotificationRequest): Promise<BaseResponse<Notification>> {
    const response = await this.request<BaseResponse<Notification>>('/notifications', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    console.log('📝 Create notification response:', response);
    
    return response;
  }

  async broadcastNotification(request: BroadcastNotificationRequest): Promise<BaseResponse<{}>> {
    const response = await this.request<BaseResponse<{}>>('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    console.log('📢 Broadcast notification response:', response);
    
    return response;
  }

  // API DELETE - XÓA TỪNG CÁI MỘT (URL ĐÃ SỬA)
  async deleteUserNotification(userId: string, notificationId: number): Promise<BaseResponse<{}>> {
    try {
      console.log(`🗑️ Deleting notification ${notificationId} for user ${userId}`);
      
      // URL ĐÃ SỬA: bỏ chữ "users" trong path
      const response = await this.request<BaseResponse<{}>>(`/notifications/${userId}/${notificationId}`, {
        method: 'DELETE'
      });
      
      console.log('✅ Delete user notification success:', response);
      return response;
      
    } catch (error) {
      console.error('❌ Delete user notification failed:', error);
      
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete notification',
        data: {}
      };
    }
  }

  // XÓA NHIỀU THÔNG BÁO - DÙNG BATCH ENDPOINT
  async deleteMultipleUserNotifications(userId: string, notificationIds: number[]): Promise<BaseResponse<{successful: number[], failed: number[]}>> {
    try {
      console.log(`🗑️ Deleting ${notificationIds.length} notifications for user ${userId} using batch`);
      
      // Kiểm tra mảng rỗng
      if (!notificationIds || notificationIds.length === 0) {
        return {
          status: 'success',
          message: 'No notifications to delete',
          data: { successful: [], failed: [] }
        };
      }

      // Tạo query string với các IDs
      const idsParam = notificationIds.join(',');
      
      // Dùng batch endpoint
      const response = await this.request<BaseResponse<{successful: number[], failed: number[]}>>(
        `/notifications/${userId}/batch?ids=${idsParam}`, 
        {
          method: 'DELETE'
        }
      );
      
      console.log('✅ Batch delete response:', response);
      
      // Nếu API trả về thành công
      if (response.status === 'success' || response.status === '200') {
        return {
          status: 'success',
          message: response.message || `Deleted ${notificationIds.length} notifications successfully`,
          data: { successful: notificationIds, failed: [] }
        };
      }
      
      // Nếu có lỗi
      return {
        status: 'error',
        message: response.message || 'Failed to delete notifications',
        data: { successful: [], failed: notificationIds }
      };
      
    } catch (error) {
      console.error('❌ Batch delete notifications failed:', error);
      
      // Fallback: xóa từng cái một nếu batch không hoạt động
      console.log('🔄 Falling back to individual deletion...');
      return await this.deleteMultipleUserNotificationsFallback(userId, notificationIds);
    }
  }

  // Fallback method - xóa từng cái một nếu batch không hoạt động
  private async deleteMultipleUserNotificationsFallback(userId: string, notificationIds: number[]): Promise<BaseResponse<{successful: number[], failed: number[]}>> {
    try {
      const successful: number[] = [];
      const failed: number[] = [];
      
      // Xóa từng notification một
      for (const notificationId of notificationIds) {
        try {
          console.log(`🔄 Deleting notification ${notificationId}...`);
          const result = await this.deleteUserNotification(userId, notificationId);
          
          if (result.status === 'success' || result.status === '200') {
            successful.push(notificationId);
            console.log(`✅ Successfully deleted notification ${notificationId}`);
          } else {
            failed.push(notificationId);
            console.error(`❌ Failed to delete notification ${notificationId}:`, result.message);
          }
          
          // Chờ 50ms giữa các request để tránh overload server
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error) {
          failed.push(notificationId);
          console.error(`❌ Failed to delete notification ${notificationId}:`, error);
        }
      }
      
      const resultMessage = `Deleted ${successful.length} notifications successfully, ${failed.length} failed`;
      console.log(`🎯 Delete multiple completed: ${resultMessage}`);
      
      if (failed.length > 0 && successful.length > 0) {
        return {
          status: 'partial_success',
          message: resultMessage,
          data: { successful, failed }
        };
      } else if (failed.length > 0) {
        return {
          status: 'error',
          message: resultMessage,
          data: { successful, failed }
        };
      }
      
      return {
        status: 'success',
        message: resultMessage,
        data: { successful, failed }
      };
      
    } catch (error) {
      console.error('❌ Fallback delete multiple notifications failed:', error);
      
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete notifications',
        data: { successful: [], failed: notificationIds }
      };
    }
  }

  // XÓA TẤT CẢ THÔNG BÁO CỦA USER
  async deleteAllUserNotifications(userId: string, allNotificationIds: number[]): Promise<BaseResponse<{successful: number[], failed: number[]}>> {
    return this.deleteMultipleUserNotifications(userId, allNotificationIds);
  }
}

export const notificationService = new NotificationService();