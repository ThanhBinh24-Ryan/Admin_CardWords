import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ActionLogState, 
  ActionLog, 
  ActionLogFilter, 
  ActionLogStatistics,
  DEFAULT_PAGINATION 
} from '../types/actionLog';
import { actionLogService } from '../services/actionLogService';

interface ActionLogStore extends ActionLogState {
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

          const currentFilters = get().filters;
          const mergedFilters = { ...currentFilters, ...filters };
          
          const response = await actionLogService.getActionLogs(mergedFilters);

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
        } catch (error) {
          console.error('Failed to fetch action logs:', error);
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch action logs' 
          });
        }
      },

      fetchStatistics: async () => {
        try {
          set({ loading: true, error: null });
          const statistics = await actionLogService.getActionLogStatistics();
          set({ statistics, loading: false });
        } catch (error) {
          console.error(' Failed to fetch statistics:', error);
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
        const newFilters = { ...currentFilters, ...filters };
        set({ filters: newFilters });
      },

      resetFilters: () => {
        const defaultFilters = { ...DEFAULT_PAGINATION };
        set({ filters: defaultFilters });
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

export const useActionLogs = () => useActionLogStore((state) => state.logs);
export const useActionLogsLoading = () => useActionLogStore((state) => state.loading);
export const useActionLogsError = () => useActionLogStore((state) => state.error);
export const useActionLogsFilters = () => useActionLogStore((state) => state.filters);
export const useActionLogsPagination = () => useActionLogStore((state) => state.pagination);
export const useActionLogsStatistics = () => useActionLogStore((state) => state.statistics);