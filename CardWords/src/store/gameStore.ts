// stores/gameStore.ts
import { create } from 'zustand';
import { gameService } from '../services/gameService';
import { 
  Game, 
  GameStatistics, 
  GamesOverviewStatistics,
  GameSession,
  GameSessionDetail,
  PaginationParams
} from '../types/game';

interface GameState {
  // State
  games: Game[];
  currentGame: Game | null;
  gameStatistics: GameStatistics | null;
  overviewStatistics: GamesOverviewStatistics | null;
  gameSessions: GameSession[];
  currentSession: GameSessionDetail | null;
  
  // Pagination
  sessionsPagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  
  // Loading states
  loading: boolean;
  loadingSessions: boolean;
  loadingStatistics: boolean;
  
  // Error
  error: string | null;
  
  // Actions
  fetchAllGames: () => Promise<void>;
  fetchGameById: (id: number) => Promise<void>;
  fetchGameStatistics: (id: number) => Promise<void>;
  fetchGameSessions: (id: number, params?: PaginationParams) => Promise<void>;
  fetchGamesOverviewStatistics: () => Promise<void>;
  fetchGameSessionDetail: (sessionId: number) => Promise<void>;
  deleteGameSession: (sessionId: number) => Promise<void>;
  
  // Utilities
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentGame: () => void;
  clearCurrentSession: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  games: [],
  currentGame: null,
  gameStatistics: null,
  overviewStatistics: null,
  gameSessions: [],
  currentSession: null,
  sessionsPagination: {
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  },
  loading: false,
  loadingSessions: false,
  loadingStatistics: false,
  error: null,

  // Actions
  fetchAllGames: async () => {
    set({ loading: true, error: null });
    try {
      const response = await gameService.getAllGames();
      set({ 
        games: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch games',
        loading: false 
      });
    }
  },

  fetchGameById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await gameService.getGameById(id);
      set({ 
        currentGame: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch game',
        loading: false 
      });
    }
  },

  fetchGameStatistics: async (id: number) => {
    set({ loadingStatistics: true, error: null });
    try {
      const response = await gameService.getGameStatistics(id);
      set({ 
        gameStatistics: response.data,
        loadingStatistics: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch game statistics',
        loadingStatistics: false 
      });
    }
  },

  fetchGameSessions: async (id: number, params: PaginationParams = {}) => {
    set({ loadingSessions: true, error: null });
    try {
      const response = await gameService.getGameSessions(id, params);
      const { content, totalPages, totalElements, number, size } = response.data;
      
      set({ 
        gameSessions: content,
        sessionsPagination: {
          page: number,
          size,
          totalPages,
          totalElements
        },
        loadingSessions: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch game sessions',
        loadingSessions: false 
      });
    }
  },

  fetchGamesOverviewStatistics: async () => {
    set({ loadingStatistics: true, error: null });
    try {
      const response = await gameService.getGamesOverviewStatistics();
      set({ 
        overviewStatistics: response.data,
        loadingStatistics: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch overview statistics',
        loadingStatistics: false 
      });
    }
  },

  fetchGameSessionDetail: async (sessionId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await gameService.getGameSessionDetail(sessionId);
      set({ 
        currentSession: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch session detail',
        loading: false 
      });
    }
  },

  deleteGameSession: async (sessionId: number) => {
    set({ error: null });
    try {
      await gameService.deleteGameSession(sessionId);
      
      // Remove from local state if exists
      const { gameSessions } = get();
      const updatedSessions = gameSessions.filter(session => session.sessionId !== sessionId);
      
      set({ 
        gameSessions: updatedSessions,
        // Clear current session if it's the one being deleted
        currentSession: get().currentSession?.sessionId === sessionId ? null : get().currentSession
      });
      
      return Promise.resolve();
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete session'
      });
      return Promise.reject(error);
    }
  },

  // Utility actions
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  clearCurrentGame: () => set({ currentGame: null, gameStatistics: null }),
  clearCurrentSession: () => set({ currentSession: null })
}));