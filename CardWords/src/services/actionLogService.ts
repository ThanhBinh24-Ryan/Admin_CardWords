import {
  ActionLog,
  ActionLogFilter,
  ActionLogStatistics,
  BaseResponse,
  PageResponse,
  ExportFilter,
  CleanupParams
} from '../types/actionLog';

const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
// const API_BASE_URL = 'http://103.9.77.220:8080/api/v1/admin';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1/admin';
// const API_BASE_URL = 'http://103.9.77.220:8080//api/v1/admin';
class ActionLogService {
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
    
    console.log(' ActionLog Request:', url);
    console.log(' Token exists:', !!token);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('ActionLog Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' ActionLog Error:', errorText);
        
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
      console.log(' ActionLog Response data:', data);
      return data;
    } catch (error) {
      console.error(' ActionLog Request failed:', error);
      throw error;
    }
  }


  async getActionLogs(filters: ActionLogFilter): Promise<PageResponse<ActionLog>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.request<BaseResponse<PageResponse<ActionLog>>>(`/action-logs?${queryParams.toString()}`);
    return response.data;
  }

  async getActionLogStatistics(): Promise<ActionLogStatistics> {
    const response = await this.request<BaseResponse<ActionLogStatistics>>('/action-logs/statistics');
    return response.data;
  }

  async exportActionLogs(filters: ExportFilter): Promise<ActionLog[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.request<BaseResponse<ActionLog[]>>(`/action-logs/export?${queryParams.toString()}`);
    return response.data;
  }

  async downloadActionLogsExport(filters: ExportFilter, filename: string = 'action-logs.csv'): Promise<void> {
    const token = this.getAuthToken();
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/action-logs/export?${queryParams.toString()}`;
    
    console.log('📥 Download ActionLog Export:', url);

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      console.log(' Download Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(' Download Error:', errorText);
        throw new Error(`Download failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      console.log(' Download completed successfully');
    } catch (error) {
      console.error(' Download failed:', error);
      throw error;
    }
  }

  
  async cleanupActionLogs(daysToKeep: number = 90): Promise<BaseResponse<{}>> {
    const queryParams = new URLSearchParams({
      daysToKeep: daysToKeep.toString()
    });

    return this.request<BaseResponse<{}>>(`/action-logs/cleanup?${queryParams.toString()}`, {
      method: 'DELETE',
    });
  }
}

export const actionLogService = new ActionLogService();