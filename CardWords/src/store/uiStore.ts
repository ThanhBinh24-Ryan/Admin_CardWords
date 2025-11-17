import { create } from 'zustand'; // Correct named import

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const authStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false });
  },
}));

export default authStore;