import { create } from 'zustand';
import { vocabService } from '../services/vocabService';
import { 
  Vocab, 
  CreateVocabRequest, 
  UpdateVocabRequest,
  PaginationParams,
  SearchParams,
  CefrParams,
  BulkImportResponse
} from '../types/vocab';

interface VocabState {
  vocabs: Vocab[];
  currentVocab: Vocab | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
  bulkImportResult: BulkImportResponse | null;
}

interface VocabActions {
  // Vocab management
  fetchVocabs: (params?: PaginationParams) => Promise<void>;
  fetchVocabById: (id: string) => Promise<void>;
  fetchVocabByWord: (word: string) => Promise<void>;
  searchVocabs: (params: SearchParams) => Promise<void>;
  fetchVocabsByCefr: (params: CefrParams) => Promise<void>;
  
  // Vocab actions
  createVocab: (vocabData: CreateVocabRequest) => Promise<void>;
  updateVocabById: (id: string, vocabData: UpdateVocabRequest) => Promise<void>;
  updateVocabByWord: (word: string, vocabData: UpdateVocabRequest) => Promise<void>;
  deleteVocab: (id: string) => Promise<void>;
  
  // Bulk operations
  bulkImport: (vocabs: CreateVocabRequest[]) => Promise<void>;
  exportToExcel: () => Promise<void>;
  
  // Storage operations
  uploadImage: (file: File) => Promise<string>;
  uploadAudio: (file: File) => Promise<string>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentVocab: () => void;
  clearVocabs: () => void;
  clearBulkImportResult: () => void;
}

const initialState: VocabState = {
  vocabs: [],
  currentVocab: null,
  loading: false,
  error: null,
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },
  bulkImportResult: null,
};

export const useVocabStore = create<VocabState & VocabActions>((set, get) => ({
  ...initialState,

  fetchVocabs: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.getVocabs(params);
      set({
        vocabs: response.data.content,
        pagination: {
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          currentPage: response.data.number,
          pageSize: response.data.size,
        },
        loading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch vocabs',
        loading: false 
      });
    }
  },

  fetchVocabById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.getVocabById(id);
      set({ currentVocab: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch vocab',
        loading: false 
      });
    }
  },

  fetchVocabByWord: async (word: string) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.getVocabByWord(word);
      set({ currentVocab: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch vocab',
        loading: false 
      });
    }
  },

  searchVocabs: async (params: SearchParams) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.searchVocabs(params);
      set({
        vocabs: response.data.content,
        pagination: {
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          currentPage: response.data.number,
          pageSize: response.data.size,
        },
        loading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to search vocabs',
        loading: false 
      });
    }
  },

  fetchVocabsByCefr: async (params: CefrParams) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.getVocabsByCefr(params);
      set({
        vocabs: response.data.content,
        pagination: {
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          currentPage: response.data.number,
          pageSize: response.data.size,
        },
        loading: false,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch vocabs by CEFR',
        loading: false 
      });
    }
  },

  createVocab: async (vocabData: CreateVocabRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.createVocab(vocabData);
      const { vocabs } = get();
      
      set({ 
        vocabs: [response.data, ...vocabs],
        currentVocab: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to create vocab',
        loading: false 
      });
      throw error;
    }
  },

  updateVocabById: async (id: string, vocabData: UpdateVocabRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.updateVocabById(id, vocabData);
      const { vocabs, currentVocab } = get();
      
      // Update in vocabs list
      const updatedVocabs = vocabs.map(vocab =>
        vocab.id === id ? response.data : vocab
      );
      
      // Update current vocab if it's the same vocab
      const updatedCurrentVocab = currentVocab?.id === id 
        ? response.data 
        : currentVocab;

      set({ 
        vocabs: updatedVocabs, 
        currentVocab: updatedCurrentVocab,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update vocab',
        loading: false 
      });
      throw error;
    }
  },

  updateVocabByWord: async (word: string, vocabData: UpdateVocabRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.updateVocabByWord(word, vocabData);
      const { vocabs, currentVocab } = get();
      
      // Update in vocabs list
      const updatedVocabs = vocabs.map(vocab =>
        vocab.word === word ? response.data : vocab
      );
      
      // Update current vocab if it's the same vocab
      const updatedCurrentVocab = currentVocab?.word === word 
        ? response.data 
        : currentVocab;

      set({ 
        vocabs: updatedVocabs, 
        currentVocab: updatedCurrentVocab,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update vocab',
        loading: false 
      });
      throw error;
    }
  },

  deleteVocab: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await vocabService.deleteVocab(id);
      const { vocabs, currentVocab } = get();
      
      // Remove from vocabs list
      const updatedVocabs = vocabs.filter(vocab => vocab.id !== id);
      
      // Clear current vocab if it's the same vocab
      const updatedCurrentVocab = currentVocab?.id === id ? null : currentVocab;

      set({ 
        vocabs: updatedVocabs, 
        currentVocab: updatedCurrentVocab,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete vocab',
        loading: false 
      });
      throw error;
    }
  },

  bulkImport: async (vocabs: CreateVocabRequest[]) => {
    set({ loading: true, error: null });
    try {
      const response = await vocabService.bulkImport(vocabs);
      set({ 
        bulkImportResult: response,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to import vocabs',
        loading: false 
      });
      throw error;
    }
  },

  exportToExcel: async () => {
    set({ loading: true, error: null });
    try {
      const blob = await vocabService.exportToExcel();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `vocabs-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to export vocabs',
        loading: false 
      });
      throw error;
    }
  },

  // Storage methods - ĐÃ SỬA: Trả về string URL
  uploadImage: async (file: File): Promise<string> => {
    set({ loading: true, error: null });
    try {
      const imageUrl = await vocabService.uploadImage(file);
      set({ loading: false });
      return imageUrl;
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to upload image',
        loading: false 
      });
      throw error;
    }
  },

  uploadAudio: async (file: File): Promise<string> => {
    set({ loading: true, error: null });
    try {
      const audioUrl = await vocabService.uploadAudio(file);
      set({ loading: false });
      return audioUrl;
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to upload audio',
        loading: false 
      });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  clearCurrentVocab: () => set({ currentVocab: null }),
  clearVocabs: () => set({ vocabs: [] }),
  clearBulkImportResult: () => set({ bulkImportResult: null }),
}));