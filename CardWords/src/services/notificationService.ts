import { 
  Notification, 
  CreateNotificationRequest, 
  BroadcastNotificationRequest,
  BaseResponse,
  PageResponse 
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
    
    console.log('🔔 Notification Request:', url);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('🔔 Notification Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Notification Response data:', data);
      return data;
    } catch (error) {
      console.log('📝 Fallback to mock data for:', endpoint);
      return this.getMockData<T>(endpoint, options);
    }
  }

  private getMockData<T>(endpoint: string, options: RequestInit): T {
    if (endpoint.includes('/notifications?') && options.method === undefined) {
      return this.getMockNotifications() as T;
    }
    throw new Error(`Mock data not available for: ${endpoint}`);
  }

  private getMockNotifications(): PageResponse<Notification> {
    console.log('🎯 Using mock data for notifications');
    
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Chào mừng đến với hệ thống!',
        content: 'Cảm ơn bạn đã tham gia hệ thống học từ vựng của chúng tôi. Hãy khám phá các tính năng mới.',
        type: 'system_alert',
        isRead: true,
        createdAt: '2024-01-20T10:00:00Z',
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      },
      {
        id: 2,
        title: 'Nhắc nhở ôn tập từ vựng',
        content: 'Bạn có 15 từ vựng cần ôn tập hôm nay. Đừng quên học để duy trì streak nhé!',
        type: 'vocab_reminder',
        isRead: false,
        createdAt: '2024-01-20T09:30:00Z',
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      },
      {
        id: 3,
        title: 'Tính năng mới: Học qua video',
        content: 'Chúng tôi vừa ra mắt tính năng học từ vựng qua video. Hãy thử ngay để cải thiện kỹ năng nghe!',
        type: 'new_feature',
        isRead: false,
        createdAt: '2024-01-19T15:20:00Z',
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      },
      {
        id: 4,
        title: 'Chúc mừng bạn đã đạt 7 ngày học liên tiếp! 🎉',
        content: 'Thật tuyệt vời! Bạn đã duy trì việc học được 7 ngày liên tiếp. Hãy tiếp tục phát huy nhé!',
        type: 'achievement',
        isRead: true,
        createdAt: '2024-01-18T08:15:00Z',
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      },
      {
        id: 5,
        title: 'Báo cáo tuần của bạn',
        content: 'Tuần này bạn đã học được 45 từ mới với độ chính xác 92%. Tiếp tục phát huy nhé!',
        type: 'study_progress',
        isRead: true,
        createdAt: '2024-01-17T14:30:00Z',
        userId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
      }
    ];

    return {
      content: mockNotifications,
      totalPages: 1,
      totalElements: mockNotifications.length,
      number: 0,
      size: 20,
      first: true,
      last: true
    };
  }

  async getNotifications(page: number = 0, size: number = 20): Promise<PageResponse<Notification>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    return this.request<PageResponse<Notification>>(`/notifications?${queryParams.toString()}`);
  }

  async createNotification(request: CreateNotificationRequest): Promise<BaseResponse<Notification>> {
    return this.request<BaseResponse<Notification>>('/notifications', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async broadcastNotification(request: BroadcastNotificationRequest): Promise<BaseResponse<{}>> {
    return this.request<BaseResponse<{}>>('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async deleteNotification(userId: string, notificationId: number): Promise<BaseResponse<{}>> {
    return this.request<BaseResponse<{}>>(`/notifications/${userId}/${notificationId}`, {
      method: 'DELETE'
    });
  }

  async deleteMultipleNotifications(userId: string, notificationIds: number[]): Promise<BaseResponse<{}>> {
    const queryParams = new URLSearchParams({
      ids: notificationIds.join(',')
    });
    return this.request<BaseResponse<{}>>(`/notifications/${userId}/batch?${queryParams.toString()}`, {
      method: 'DELETE'
    });
  }
}

export const notificationService = new NotificationService();