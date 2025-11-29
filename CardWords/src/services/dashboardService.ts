import {
  SystemOverview,
  UserStatistics,
  UserSearchResult,
  RegistrationChartData,
  GameStats,
  LeaderboardEntry,
  TopPlayersData,
  BaseResponse,
  PageResponse
} from '../types/dashboard';

// const API_BASE_URL = 'http://localhost:8080/api/v1';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1';
const API_BASE_URL = 'http://103.9.77.220:8080/api/v1';
class DashboardService {
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
    
    console.log('📊 Dashboard Request:', url);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('📊 Dashboard Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Dashboard Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Dashboard Request failed:', error);
      throw error;
    }
  }

  // System Overview
  async getSystemOverview(): Promise<BaseResponse<SystemOverview>> {
    return this.request<BaseResponse<SystemOverview>>('/admin/users/system-overview');
  }

  // User Statistics
  async getUserStatistics(): Promise<BaseResponse<UserStatistics>> {
    return this.request<BaseResponse<UserStatistics>>('/admin/users/statistics');
  }

  // Search Users
  async searchUsers(keyword: string, page: number = 0, size: number = 20): Promise<BaseResponse<PageResponse<UserSearchResult>>> {
    const queryParams = new URLSearchParams({
      keyword,
      page: page.toString(),
      size: size.toString()
    });
    return this.request<BaseResponse<PageResponse<UserSearchResult>>>(`/admin/users/search?${queryParams.toString()}`);
  }

  // Registration Chart
  async getRegistrationChart(days: number = 30): Promise<BaseResponse<RegistrationChartData>> {
    const queryParams = new URLSearchParams({
      days: days.toString()
    });
    return this.request<BaseResponse<RegistrationChartData>>(`/admin/users/registration-chart?${queryParams.toString()}`);
  }

  // Game Stats
  async getGameStats(): Promise<BaseResponse<GameStats[]>> {
    return this.request<BaseResponse<GameStats[]>>('/admin/users/game-stats');
  }

  // Leaderboard APIs
  async getWordDefinitionLeaderboard(limit: number = 50): Promise<BaseResponse<LeaderboardEntry[]>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString()
    });
    return this.request<BaseResponse<LeaderboardEntry[]>>(`/leaderboard/word-definition?${queryParams.toString()}`);
  }

  async getTopPlayers(): Promise<BaseResponse<TopPlayersData>> {
    return this.request<BaseResponse<TopPlayersData>>('/leaderboard/top-players');
  }

  async getCurrentStreakLeaderboard(limit: number = 50): Promise<BaseResponse<LeaderboardEntry[]>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString()
    });
    return this.request<BaseResponse<LeaderboardEntry[]>>(`/leaderboard/streak/current?${queryParams.toString()}`);
  }

  async getBestStreakLeaderboard(limit: number = 50): Promise<BaseResponse<LeaderboardEntry[]>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString()
    });
    return this.request<BaseResponse<LeaderboardEntry[]>>(`/leaderboard/streak/best?${queryParams.toString()}`);
  }

  async getQuizGlobalLeaderboard(limit: number = 100): Promise<BaseResponse<LeaderboardEntry[]>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString()
    });
    return this.request<BaseResponse<LeaderboardEntry[]>>(`/leaderboard/quiz/global?${queryParams.toString()}`);
  }

  async getQuizDailyLeaderboard(date: string, limit: number = 50): Promise<BaseResponse<LeaderboardEntry[]>> {
    const queryParams = new URLSearchParams({
      date,
      limit: limit.toString()
    });
    return this.request<BaseResponse<LeaderboardEntry[]>>(`/leaderboard/quiz/daily?${queryParams.toString()}`);
  }

  async getImageMatchingLeaderboard(limit: number = 50): Promise<BaseResponse<LeaderboardEntry[]>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString()
    });
    return this.request<BaseResponse<LeaderboardEntry[]>>(`/leaderboard/image-matching?${queryParams.toString()}`);
  }
}

export const dashboardService = new DashboardService();