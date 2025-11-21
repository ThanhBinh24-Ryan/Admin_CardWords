import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ActionLogState, 
  ActionLog, 
  ActionLogFilter, 
  ActionLogStatistics,
  CleanupParams,
  DEFAULT_PAGINATION 
} from '../types/actionLog';
import { actionLogService } from '../services/actionLogService';

interface ActionLogStore extends ActionLogState {
  // Actions
  fetchActionLogs: (filters?: Partial<ActionLogFilter>) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  cleanupOldLogs: (daysToKeep?: number) => Promise<void>;
  setFilters: (filters: Partial<ActionLogFilter>) => void;
  resetFilters: () => void;
  clearError: () => void;
}

const initialState: ActionLogState = {
  logs: [],
  statistics: null,
  loading: false,
  error: null,
  filters: { ...DEFAULT_PAGINATION },
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },
};

export const useActionLogStore = create<ActionLogStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchActionLogs: async (filters = {}) => {
        try {
          set({ loading: true, error: null });
          console.log('🔄 Fetching action logs with filters:', filters);

          const currentFilters = get().filters;
          const mergedFilters = { ...currentFilters, ...filters };
          
          const response = await actionLogService.getActionLogs(mergedFilters);

          console.log('📊 Action logs response:', response);
          console.log('📊 Action logs content:', response.content);

          set({
            logs: response.content,
            loading: false,
            filters: mergedFilters,
            pagination: {
              currentPage: response.number,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              pageSize: response.size,
            },
          });

          console.log('✅ Action logs stored successfully');
        } catch (error) {
          console.error('❌ Failed to fetch action logs:', error);
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch action logs' 
          });
        }
      },

      fetchStatistics: async () => {
        try {
          set({ loading: true, error: null });
          console.log('🔄 Fetching statistics...');
          const statistics = await actionLogService.getActionLogStatistics();
          console.log('📈 Statistics response:', statistics);
          set({ statistics, loading: false });
        } catch (error) {
          console.error('❌ Failed to fetch statistics:', error);
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch statistics' 
          });
        }
      },

      cleanupOldLogs: async (daysToKeep: number = 90) => {
        try {
          set({ loading: true, error: null });
          await actionLogService.cleanupActionLogs(daysToKeep);
          set({ loading: false });
          
          // Refresh the list after cleanup
          get().fetchActionLogs();
          get().fetchStatistics();
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to cleanup logs' 
          });
          throw error;
        }
      },

      setFilters: (filters: Partial<ActionLogFilter>) => {
        const currentFilters = get().filters;
        set({ filters: { ...currentFilters, ...filters } });
      },

      resetFilters: () => {
        set({ filters: { ...DEFAULT_PAGINATION } });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'action-log-store',
    }
  )
);

// Selectors
export const useActionLogs = () => useActionLogStore((state) => state.logs);
export const useActionLogsLoading = () => useActionLogStore((state) => state.loading);
export const useActionLogsError = () => useActionLogStore((state) => state.error);
export const useActionLogsFilters = () => useActionLogStore((state) => state.filters);
export const useActionLogsPagination = () => useActionLogStore((state) => state.pagination);
export const useActionLogsStatistics = () => useActionLogStore((state) => state.statistics);