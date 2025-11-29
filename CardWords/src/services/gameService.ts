// services/gameService.ts
import { 
  GamesResponse, 
  GameResponse, 
  GameStatisticsResponse,
  GamesOverviewStatisticsResponse,
  GameSessionsPageResponse,
  GameSessionDetailResponse,
  EmptyResponse,
  PaginationParams
} from '../types/game';

// const API_BASE_URL = 'http://localhost:8080/api/v1/admin';
// const API_BASE_URL = 'https://card-words-services-production.up.railway.app/api/v1/admin';
const API_BASE_URL = 'http://103.9.77.220:8080/api/v1/admin';
class GameService {
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
    
    console.log('🎮 Game Request:', url);
    console.log('🔑 Token exists:', !!token);

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log('🎮 Game Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Game Error:', errorText);
        
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
      console.log('✅ Game Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Game Request failed:', error);
      throw error;
    }
  }

  // Lấy danh sách tất cả game
  async getAllGames(): Promise<GamesResponse> {
    return this.request<GamesResponse>('/games');
  }

  // Lấy thông tin game theo ID
  async getGameById(id: number): Promise<GameResponse> {
    return this.request<GameResponse>(`/games/${id}`);
  }

  // Lấy thống kê game theo ID
  async getGameStatistics(id: number): Promise<GameStatisticsResponse> {
    return this.request<GameStatisticsResponse>(`/games/${id}/statistics`);
  }

  // Lấy danh sách session của game
  async getGameSessions(id: number, params: PaginationParams = {}): Promise<GameSessionsPageResponse> {
    const { page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    return this.request<GameSessionsPageResponse>(`/games/${id}/sessions?${queryParams}`);
  }

  // Lấy tổng quan thống kê tất cả game
  async getGamesOverviewStatistics(): Promise<GamesOverviewStatisticsResponse> {
    return this.request<GamesOverviewStatisticsResponse>('/games/statistics/overview');
  }

  // Lấy chi tiết session
  async getGameSessionDetail(sessionId: number): Promise<GameSessionDetailResponse> {
    return this.request<GameSessionDetailResponse>(`/games/sessions/${sessionId}`);
  }

  // Xóa session
  async deleteGameSession(sessionId: number): Promise<EmptyResponse> {
    return this.request<EmptyResponse>(`/games/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export const gameService = new GameService();