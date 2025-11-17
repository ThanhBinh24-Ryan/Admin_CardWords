import { create } from 'zustand';
import { wordTypeService } from '../services/wordTypeService';
import { 
  WordType, 
  CreateWordTypeRequest
} from '../types/wordType';

interface WordTypeState {
  wordTypes: WordType[];
  currentType: WordType | null;
  loading: boolean;
  error: string | null;
}

interface WordTypeActions {
  // WordType management - XÓA updateType vì API không hỗ trợ
  fetchAllTypes: () => Promise<void>;
  fetchTypeById: (id: number) => Promise<void>;
  createType: (request: CreateWordTypeRequest) => Promise<WordType>;
  deleteType: (id: number) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentType: () => void;
  clearWordTypes: () => void;
}

const initialState: WordTypeState = {
  wordTypes: [],
  currentType: null,
  loading: false,
  error: null,
};

export const useWordTypeStore = create<WordTypeState & WordTypeActions>((set, get) => ({
  ...initialState,

  fetchAllTypes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await wordTypeService.getAllTypes();
      set({
        wordTypes: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch word types';
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  fetchTypeById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await wordTypeService.getTypeById(id);
      set({ currentType: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch word type',
        loading: false 
      });
    }
  },

  createType: async (request: CreateWordTypeRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await wordTypeService.createType(request);
      const { wordTypes } = get();
      
      // Thêm type mới vào danh sách
      const updatedTypes = [...wordTypes, response.data];
      
      set({ 
        wordTypes: updatedTypes,
        loading: false 
      });
      
      return response.data;
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to create word type',
        loading: false 
      });
      throw error;
    }
  },

  deleteType: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await wordTypeService.deleteType(id);
      const { wordTypes } = get();
      
      // Xóa type khỏi danh sách
      const updatedTypes = wordTypes.filter(type => type.id !== id);
      
      set({ 
        wordTypes: updatedTypes,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete word type',
        loading: false 
      });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  clearCurrentType: () => set({ currentType: null }),
  clearWordTypes: () => set({ wordTypes: [] }),
}));