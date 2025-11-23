import { create } from 'zustand';
import { 
  Topic, 
  TopicFormData, 
  TopicFilter,
  TopicPaginationInfo,
  TopicApiResponse,
  BulkOperationResult,
  BulkTopicCreate,
  BulkTopicUpdate,
  StorageApiResponse
} from '../types/topic';
import { topicService } from '../services/topicService';

interface TopicState {
  // State
  topics: Topic[];
  currentTopic: Topic | null;
  loading: boolean;
  error: string | null;
  pagination: TopicPaginationInfo;
  filters: TopicFilter;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setFilters: (filters: TopicFilter) => void;

  // API Actions
  fetchTopics: () => Promise<void>;
  fetchTopicById: (id: number) => Promise<void>;
  createTopic: (formData: TopicFormData) => Promise<void>;
  updateTopic: (id: number, formData: Partial<TopicFormData>) => Promise<void>;
  deleteTopic: (id: number) => Promise<void>;
  bulkCreateTopics: (bulkData: BulkTopicCreate) => Promise<TopicApiResponse<BulkOperationResult>>;
  bulkUpdateTopics: (bulkData: BulkTopicUpdate) => Promise<TopicApiResponse<BulkOperationResult>>;
  
  // Upload Actions
  uploadImage: (file: File) => Promise<StorageApiResponse<any>>;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  // Initial state
  topics: [],
  currentTopic: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 10,
  },
  filters: {},

  // Basic actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set({ filters }),

  // API actions
  fetchTopics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await topicService.getAllTopics();
      set({ 
        topics: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch topics',
        loading: false 
      });
    }
  },

  fetchTopicById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await topicService.getTopicById(id);
      set({ 
        currentTopic: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch topic',
        loading: false 
      });
    }
  },

  createTopic: async (formData: TopicFormData) => {
    set({ loading: true, error: null });
    try {
      const response = await topicService.createTopic(formData);
      const { topics } = get();
      set({ 
        topics: [...topics, response.data],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to create topic',
        loading: false 
      });
      throw error;
    }
  },

  updateTopic: async (id: number, formData: Partial<TopicFormData>) => {
    set({ loading: true, error: null });
    try {
      const response = await topicService.updateTopic(id, formData);
      const { topics } = get();
      set({ 
        topics: topics.map(topic => 
          topic.id === id ? response.data : topic
        ),
        currentTopic: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update topic',
        loading: false 
      });
      throw error;
    }
  },

  deleteTopic: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await topicService.deleteTopic(id);
      const { topics } = get();
      set({ 
        topics: topics.filter(topic => topic.id !== id),
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete topic',
        loading: false 
      });
      throw error;
    }
  },

  bulkCreateTopics: async (bulkData: BulkTopicCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await topicService.bulkCreateTopics(bulkData);
      // Refresh the topics list after bulk create
      await get().fetchTopics();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to bulk create topics',
        loading: false 
      });
      throw error;
    }
  },

  bulkUpdateTopics: async (bulkData: BulkTopicUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await topicService.bulkUpdateTopics(bulkData);
      // Refresh the topics list after bulk update
      await get().fetchTopics();
      set({ loading: false });
      return response;
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to bulk update topics',
        loading: false 
      });
      throw error;
    }
  },

  // Upload actions
  uploadImage: async (file: File) => {
    try {
      const response = await topicService.uploadImage(file);
      return response;
    } catch (error: any) {
      throw error;
    }
  },
}));