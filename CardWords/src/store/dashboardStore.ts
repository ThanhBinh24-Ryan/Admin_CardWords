import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  SystemOverview,
  UserStatistics,
  RegistrationChartData,
  GameStats,
  LeaderboardEntry,
  TopPlayersData,
  UserSearchResult
} from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';

interface DashboardState {
  systemOverview: SystemOverview | null;
  userStatistics: UserStatistics | null;
  registrationChart: RegistrationChartData | null;
  gameStats: GameStats[] | null;
  searchResults: UserSearchResult[] | null;
  wordDefinitionLeaderboard: LeaderboardEntry[] | null;
  topPlayers: TopPlayersData | null;
  currentStreakLeaderboard: LeaderboardEntry[] | null;
  bestStreakLeaderboard: LeaderboardEntry[] | null;
  quizGlobalLeaderboard: LeaderboardEntry[] | null;
  quizDailyLeaderboard: LeaderboardEntry[] | null;
  imageMatchingLeaderboard: LeaderboardEntry[] | null;
  loading: boolean;
  error: string | null;
}

interface DashboardStore extends DashboardState {
  // Actions
  fetchSystemOverview: () => Promise<void>;
  fetchUserStatistics: () => Promise<void>;
  fetchRegistrationChart: (days?: number) => Promise<void>;
  fetchGameStats: () => Promise<void>;
  searchUsers: (keyword: string, page?: number, size?: number) => Promise<void>;
  fetchWordDefinitionLeaderboard: (limit?: number) => Promise<void>;
  fetchTopPlayers: () => Promise<void>;
  fetchCurrentStreakLeaderboard: (limit?: number) => Promise<void>;
  fetchBestStreakLeaderboard: (limit?: number) => Promise<void>;
  fetchQuizGlobalLeaderboard: (limit?: number) => Promise<void>;
  fetchQuizDailyLeaderboard: (date: string, limit?: number) => Promise<void>;
  fetchImageMatchingLeaderboard: (limit?: number) => Promise<void>;
  fetchAllLeaderboards: () => Promise<void>;
  clearError: () => void;
  clearSearchResults: () => void;
}

const initialState: DashboardState = {
  systemOverview: null,
  userStatistics: null,
  registrationChart: null,
  gameStats: null,
  searchResults: null,
  wordDefinitionLeaderboard: null,
  topPlayers: null,
  currentStreakLeaderboard: null,
  bestStreakLeaderboard: null,
  quizGlobalLeaderboard: null,
  quizDailyLeaderboard: null,
  imageMatchingLeaderboard: null,
  loading: false,
  error: null,
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchSystemOverview: async () => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getSystemOverview();
          set({
            systemOverview: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch system overview'
          });
        }
      },

      fetchUserStatistics: async () => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getUserStatistics();
          set({
            userStatistics: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch user statistics'
          });
        }
      },

      fetchRegistrationChart: async (days = 30) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getRegistrationChart(days);
          set({
            registrationChart: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch registration chart'
          });
        }
      },

      fetchGameStats: async () => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getGameStats();
          set({
            gameStats: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch game stats'
          });
        }
      },

      searchUsers: async (keyword: string, page = 0, size = 20) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.searchUsers(keyword, page, size);
          set({
            searchResults: response.data.content,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to search users'
          });
        }
      },

      // Leaderboard Actions
      fetchWordDefinitionLeaderboard: async (limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getWordDefinitionLeaderboard(limit);
          set({
            wordDefinitionLeaderboard: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch word definition leaderboard'
          });
        }
      },

      fetchTopPlayers: async () => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getTopPlayers();
          set({
            topPlayers: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch top players'
          });
        }
      },

      fetchCurrentStreakLeaderboard: async (limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getCurrentStreakLeaderboard(limit);
          set({
            currentStreakLeaderboard: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch current streak leaderboard'
          });
        }
      },

      fetchBestStreakLeaderboard: async (limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getBestStreakLeaderboard(limit);
          set({
            bestStreakLeaderboard: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch best streak leaderboard'
          });
        }
      },

      fetchQuizGlobalLeaderboard: async (limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getQuizGlobalLeaderboard(limit);
          set({
            quizGlobalLeaderboard: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch quiz global leaderboard'
          });
        }
      },

      fetchQuizDailyLeaderboard: async (date: string, limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getQuizDailyLeaderboard(date, limit);
          set({
            quizDailyLeaderboard: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch quiz daily leaderboard'
          });
        }
      },

      fetchImageMatchingLeaderboard: async (limit = 10) => {
        try {
          set({ loading: true, error: null });
          const response = await dashboardService.getImageMatchingLeaderboard(limit);
          set({
            imageMatchingLeaderboard: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch image matching leaderboard'
          });
        }
      },

      fetchAllLeaderboards: async () => {
        try {
          set({ loading: true, error: null });
          await Promise.all([
            get().fetchTopPlayers(),
            get().fetchWordDefinitionLeaderboard(5),
            get().fetchCurrentStreakLeaderboard(5),
            get().fetchQuizGlobalLeaderboard(5)
          ]);
          set({ loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch leaderboards'
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      clearSearchResults: () => {
        set({ searchResults: null });
      },
    }),
    {
      name: 'dashboard-store',
    }
  )
);

// Selectors
export const useSystemOverview = () => useDashboardStore((state) => state.systemOverview);
export const useUserStatistics = () => useDashboardStore((state) => state.userStatistics);
export const useRegistrationChart = () => useDashboardStore((state) => state.registrationChart);
export const useGameStats = () => useDashboardStore((state) => state.gameStats);
export const useSearchResults = () => useDashboardStore((state) => state.searchResults);
export const useWordDefinitionLeaderboard = () => useDashboardStore((state) => state.wordDefinitionLeaderboard);
export const useTopPlayers = () => useDashboardStore((state) => state.topPlayers);
export const useCurrentStreakLeaderboard = () => useDashboardStore((state) => state.currentStreakLeaderboard);
export const useBestStreakLeaderboard = () => useDashboardStore((state) => state.bestStreakLeaderboard);
export const useQuizGlobalLeaderboard = () => useDashboardStore((state) => state.quizGlobalLeaderboard);
export const useQuizDailyLeaderboard = () => useDashboardStore((state) => state.quizDailyLeaderboard);
export const useImageMatchingLeaderboard = () => useDashboardStore((state) => state.imageMatchingLeaderboard);
export const useDashboardLoading = () => useDashboardStore((state) => state.loading);
export const useDashboardError = () => useDashboardStore((state) => state.error);