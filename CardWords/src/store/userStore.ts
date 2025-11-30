import { create } from 'zustand';
import { userService } from '../services/userService';
import { 
  User, 
  UserStatistics, 
  PaginationParams, 
  SearchParams 
} from '../types/user';

interface UserState {
  users: User[];
  currentUser: User | null;
  statistics: UserStatistics | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
}

interface UserActions {
  // User management
  fetchUsers: (params?: PaginationParams) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  fetchUserByEmail: (email: string) => Promise<void>;
  searchUsers: (params: SearchParams) => Promise<void>;
  
  // User actions
  updateUserRoles: (id: string, roleNames: string[]) => Promise<void>;
  banUser: (id: string, banned: boolean) => Promise<void>;
  activateUser: (id: string, activated: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Statistics
  fetchStatistics: () => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentUser: () => void;
  clearUsers: () => void;
  logout: () => void;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  statistics: null,
  loading: false,
  error: null,
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 20,
  },
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  ...initialState,

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.getUsers(params);
      set({
        users: response.data.content,
        pagination: {
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          currentPage: response.data.number,
          pageSize: response.data.size,
        },
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch users';
      set({ 
        error: errorMessage,
        loading: false 
      });
      
      // Tự động logout nếu authentication failed
      if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
        get().logout();
      }
    }
  },

  fetchUserById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.getUserById(id);
      set({ currentUser: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch user',
        loading: false 
      });
    }
  },

  fetchUserByEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.getUserByEmail(email);
      set({ currentUser: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch user',
        loading: false 
      });
    }
  },

  searchUsers: async (params: SearchParams) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.searchUsers(params);
      set({
        users: response.data.content,
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
        error: error.message || 'Failed to search users',
        loading: false 
      });
    }
  },

  updateUserRoles: async (id: string, roleNames: string[]) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.updateUserRoles(id, roleNames);
      const { users, currentUser } = get();
      
      // Update in users list
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, roles: response.data.roles } : user
      );
      
      // Update current user if it's the same user
      const updatedCurrentUser = currentUser?.id === id 
        ? response.data 
        : currentUser;

      set({ 
        users: updatedUsers, 
        currentUser: updatedCurrentUser,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update roles',
        loading: false 
      });
      throw error;
    }
  },

  banUser: async (id: string, banned: boolean) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.banUser(id, banned);
      const { users, currentUser } = get();
      
      // Update in users list
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, banned: response.data.banned } : user
      );
      
      // Update current user if it's the same user
      const updatedCurrentUser = currentUser?.id === id 
        ? response.data 
        : currentUser;

      set({ 
        users: updatedUsers, 
        currentUser: updatedCurrentUser,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update ban status',
        loading: false 
      });
      throw error;
    }
  },

  activateUser: async (id: string, activated: boolean) => {
    set({ loading: true, error: null });
    try {
      const response = await userService.activateUser(id, activated);
      const { users, currentUser } = get();
      
      // Update in users list
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, activated: response.data.activated } : user
      );
      
      const updatedCurrentUser = currentUser?.id === id 
        ? response.data 
        : currentUser;

      set({ 
        users: updatedUsers, 
        currentUser: updatedCurrentUser,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update activation status',
        loading: false 
      });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      const { users, currentUser } = get();
      
      // Remove from users list
      const updatedUsers = users.filter(user => user.id !== id);
      
      // Clear current user if it's the same user
      const updatedCurrentUser = currentUser?.id === id ? null : currentUser;

      set({ 
        users: updatedUsers, 
        currentUser: updatedCurrentUser,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to delete user',
        loading: false 
      });
      throw error;
    }
  },

  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await userService.getUserStatistics();
      set({ statistics: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch statistics',
        loading: false 
      });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  clearCurrentUser: () => set({ currentUser: null }),
  clearUsers: () => set({ users: [] }),
  logout: () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    set(initialState);
    window.location.href = '/login';
  },
}));