// store/profileStore.ts
import { create } from 'zustand';
import { profileService } from '../services/ProfileService';
import { Profile, UpdateProfileRequest, ChangePasswordRequest } from '../types/profile';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

interface ProfileActions {
  // Profile management
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileRequest) => Promise<void>;
  updateAvatar: (avatarFile: File) => Promise<void>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearProfile: () => void;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
  ...initialState,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await profileService.getProfile();
      set({ 
        profile: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch profile',
        loading: false 
      });
    }
  },

  updateProfile: async (profileData: UpdateProfileRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await profileService.updateProfile(profileData);
      set({ 
        profile: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update profile',
        loading: false 
      });
      throw error;
    }
  },

  updateAvatar: async (avatarFile: File) => {
    set({ loading: true, error: null });
    try {
      const response = await profileService.updateAvatar(avatarFile);
      set({ 
        profile: response.data,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to update avatar',
        loading: false 
      });
      throw error;
    }
  },

  changePassword: async (passwordData: ChangePasswordRequest) => {
    set({ loading: true, error: null });
    try {
      await profileService.changePassword(passwordData);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to change password',
        loading: false 
      });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  clearProfile: () => set({ profile: null }),
}));