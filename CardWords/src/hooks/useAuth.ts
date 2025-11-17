import { useStore } from 'zustand';
import authStore from '../store/authStore';

export const useAuth = () => {
  return useStore(authStore);
};