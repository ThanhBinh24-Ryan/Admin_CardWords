import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  syncFromStorage: () => void;
}

const STORAGE_KEY = 'accessToken';

const authStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem(STORAGE_KEY),
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false });
  },
  syncFromStorage: () => set({ isAuthenticated: !!localStorage.getItem(STORAGE_KEY) }),
}));

export default authStore;