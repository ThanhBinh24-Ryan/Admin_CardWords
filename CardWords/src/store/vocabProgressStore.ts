import { create } from 'zustand';
import { 
  VocabProgressStats, 
  UserVocabProgress, 
  SystemStatistics, 
  DifficultWord,
  PaginationParams,
  DifficultWordsParams
} from '../types/vocabProgress';
import { vocabProgressService } from '../services/vocabProgressService';

interface VocabProgressState {
  // State
  vocabStats: VocabProgressStats | null;
  userProgress: UserVocabProgress[];
  systemStats: SystemStatistics | null;
  difficultWords: DifficultWord[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  
  // Loading states
  loading: boolean;
  loadingUserProgress: boolean;
  loadingSystemStats: boolean;
  loadingDifficultWords: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchVocabStats: (vocabId: string) => Promise<void>;
  fetchUserProgress: (userId: string, params?: PaginationParams) => Promise<void>;
  fetchSystemStatistics: () => Promise<void>;
  fetchDifficultWords: (params?: DifficultWordsParams) => Promise<void>;
  deleteProgress: (id: string) => Promise<void>;
  resetUserProgress: (userId: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const useVocabProgressStore = create<VocabProgressState>((set, get) => ({
  // Initial state
  vocabStats: null,
  userProgress: [],
  systemStats: null,
  difficultWords: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 20,
  loading: false,
  loadingUserProgress: false,
  loadingSystemStats: false,
  loadingDifficultWords: false,
  error: null,

  // Actions
  fetchVocabStats: async (vocabId: string) => {
    set({ loading: true, error: null });
    try {
      const stats = await vocabProgressService.getVocabStats(vocabId);
      set({ vocabStats: stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi không xác định', 
        loading: false 
      });
    }
  },

  fetchUserProgress: async (userId: string, params: PaginationParams = {}) => {
    set({ loadingUserProgress: true, error: null });
    try {
      const response = await vocabProgressService.getUserProgress(userId, params);
      set({
        userProgress: response.content,
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        pageSize: response.size,
        loadingUserProgress: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi không xác định', 
        loadingUserProgress: false 
      });
    }
  },

  fetchSystemStatistics: async () => {
    set({ loadingSystemStats: true, error: null });
    try {
      const stats = await vocabProgressService.getSystemStatistics();
      set({ systemStats: stats, loadingSystemStats: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi không xác định', 
        loadingSystemStats: false 
      });
    }
  },

  fetchDifficultWords: async (params: DifficultWordsParams = {}) => {
    set({ loadingDifficultWords: true, error: null });
    try {
      const words = await vocabProgressService.getDifficultWords(params);
      set({ difficultWords: words, loadingDifficultWords: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi không xác định', 
        loadingDifficultWords: false 
      });
    }
  },

  deleteProgress: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await vocabProgressService.deleteProgress(id);
      
      // Remove from local state
      const { userProgress } = get();
      const updatedProgress = userProgress.filter(progress => progress.id !== id);
      
      set({ 
        userProgress: updatedProgress,
        totalElements: get().totalElements - 1,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Lỗi không xác định', 
        loading: false 
      });
    }
  },



resetUserProgress: async (userId: string) => {
  set({ loading: true, error: null });
  try {
    await vocabProgressService.resetUserProgress(userId);
    
    // Clear user progress from state
    set({ 
      userProgress: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      loading: false 
    });
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Lỗi không xác định', 
      loading: false 
    });
  }
},

  reset: () => {
    set({
      vocabStats: null,
      userProgress: [],
      systemStats: null,
      difficultWords: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));