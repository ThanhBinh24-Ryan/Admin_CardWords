import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Notification, 
  CreateNotificationRequest, 
  BroadcastNotificationRequest, 
  User,
  NotificationSummary,
  NotificationCategory,
  ApiResponse
} from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  users: User[];
  summary: NotificationSummary[];
  categories: NotificationCategory[];
  loading: boolean;
  error: string | null;
  lastCreatedNotification: Notification | null;
}

interface NotificationStore extends NotificationState {
  fetchUsers: (page?: number, size?: number) => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createNotification: (request: CreateNotificationRequest) => Promise<Notification>;
  broadcastNotification: (request: BroadcastNotificationRequest) => Promise<void>;
  deleteUserNotification: (userId: string, notificationId: number) => Promise<void>;
  deleteMultipleUserNotifications: (userId: string, notificationIds: number[]) => Promise<void>;
  deleteBroadcastNotification: (notificationId: number) => Promise<void>;
  clearError: () => void;
  clearLastCreated: () => void;
  refreshAllData: () => Promise<void>;
}

const initialState: NotificationState = {
  users: [],
  summary: [],
  categories: [],
  loading: false,
  error: null,
  lastCreatedNotification: null,
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchUsers: async (page = 0, size = 100) => {
        try {
          console.log('🔄 Fetching users...');
          const response = await notificationService.getUsers(page, size);
          console.log('✅ Users response:', response);
          
          let usersList: User[] = [];
          
          // Xử lý nhiều dạng response khác nhau
          if (response && (response as any).content) {
            // Dạng: { content: User[], ... }
            usersList = (response as any).content;
          } else if (response && Array.isArray(response)) {
            // Dạng: User[]
            usersList = response;
          } else if (response && (response as any).data) {
            // Dạng: { data: { content: User[] } } hoặc { data: User[] }
            const responseData = (response as any).data;
            usersList = responseData.content || responseData;
          } else if (response && (response as any).data?.content) {
            // Dạng: { data: { content: User[] } }
            usersList = (response as any).data.content;
          }
          
          console.log('👥 Final users list:', usersList);
          set({ users: Array.isArray(usersList) ? usersList : [] });
        } catch (error) {
          console.error('❌ Failed to fetch users:', error);
          set({ users: [] });
        }
      },

      fetchSummary: async () => {
        try {
          set({ loading: true, error: null });
          console.log('🔄 Fetching summary...');
          const response = await notificationService.getNotificationSummary();
          console.log('✅ Summary response:', response);
          
          let summaryData: NotificationSummary[] = [];
          
          // Xử lý nhiều dạng response khác nhau
          if (response && (response as any).data) {
            // Dạng: { data: NotificationSummary[] }
            summaryData = (response as any).data;
          } else if (response && Array.isArray(response)) {
            // Dạng: NotificationSummary[]
            summaryData = response;
          } else if (response && (response as any).content) {
            // Dạng: { content: NotificationSummary[] }
            summaryData = (response as any).content;
          } else if (response && (response as any).data?.content) {
            // Dạng: { data: { content: NotificationSummary[] } }
            summaryData = (response as any).data.content;
          }
          
          console.log('📊 Final summary data:', summaryData);
          set({ 
            summary: Array.isArray(summaryData) ? summaryData : [],
            loading: false 
          });
        } catch (error) {
          console.error('❌ Failed to fetch summary:', error);
          set({ 
            summary: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch notification summary' 
          });
        }
      },

      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          console.log('🔄 Fetching categories...');
          const response = await notificationService.getNotificationCategories();
          console.log('✅ Categories response:', response);
          
          let categoriesData: NotificationCategory[] = [];
          
          // Xử lý nhiều dạng response khác nhau
          if (response && (response as any).data) {
            // Dạng: { data: NotificationCategory[] }
            categoriesData = (response as any).data;
          } else if (response && Array.isArray(response)) {
            // Dạng: NotificationCategory[]
            categoriesData = response;
          } else if (response && (response as any).content) {
            // Dạng: { content: NotificationCategory[] }
            categoriesData = (response as any).content;
          } else if (response && (response as any).data?.content) {
            // Dạng: { data: { content: NotificationCategory[] } }
            categoriesData = (response as any).data.content;
          }
          
          console.log('📋 Final categories data:', categoriesData);
          set({ 
            categories: Array.isArray(categoriesData) ? categoriesData : [],
            loading: false 
          });
        } catch (error) {
          console.error('❌ Failed to fetch categories:', error);
          set({ 
            categories: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch notification categories' 
          });
        }
      },

      refreshAllData: async () => {
        console.log('🔄 Refreshing all data...');
        const { fetchUsers, fetchSummary, fetchCategories } = get();
        await Promise.all([
          fetchUsers(),
          fetchSummary(),
          fetchCategories()
        ]);
        console.log('✅ All data refreshed');
      },

      createNotification: async (request: CreateNotificationRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await notificationService.createNotification(request);
          
          let newNotification: Notification;
          
          // Xử lý response
          if (response && (response as any).data) {
            newNotification = (response as any).data;
          } else {
            // Nếu response không có data, coi như response chính là notification
            newNotification = response as unknown as Notification;
          }
          
          // REFRESH DATA SAU KHI TẠO THÔNG BÁO
          await get().refreshAllData();
          
          set({ 
            loading: false,
            lastCreatedNotification: newNotification 
          });
          return newNotification;
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to create notification' 
          });
          throw error;
        }
      },

      broadcastNotification: async (request: BroadcastNotificationRequest) => {
        try {
          set({ loading: true, error: null });
          await notificationService.broadcastNotification(request);
          
          // REFRESH DATA SAU KHI BROADCAST
          await get().refreshAllData();
          
          set({ loading: false });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to broadcast notification' 
          });
          throw error;
        }
      },

      deleteUserNotification: async (userId: string, notificationId: number) => {
        try {
          set({ loading: true, error: null });
          await notificationService.deleteUserNotification(userId, notificationId);
          
          // REFRESH DATA SAU KHI XÓA
          await get().refreshAllData();
          
          set({ loading: false });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete notification' 
          });
          throw error;
        }
      },

      deleteMultipleUserNotifications: async (userId: string, notificationIds: number[]) => {
        try {
          set({ loading: true, error: null });
          await notificationService.deleteMultipleUserNotifications(userId, notificationIds);
          
          // REFRESH DATA SAU KHI XÓA
          await get().refreshAllData();
          
          set({ loading: false });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete notifications' 
          });
          throw error;
        }
      },

      deleteBroadcastNotification: async (notificationId: number) => {
        try {
          set({ loading: true, error: null });
          await notificationService.deleteBroadcastNotification(notificationId);
          
          // REFRESH DATA SAU KHI XÓA
          await get().refreshAllData();
          
          set({ loading: false });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete broadcast notification' 
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      clearLastCreated: () => {
        set({ lastCreatedNotification: null });
      },
    }),
    {
      name: 'notification-store',
    }
  )
);

export const useUsers = () => useNotificationStore((state) => state.users);
export const useSummary = () => useNotificationStore((state) => state.summary);
export const useCategories = () => useNotificationStore((state) => state.categories);
export const useNotificationLoading = () => useNotificationStore((state) => state.loading);
export const useNotificationError = () => useNotificationStore((state) => state.error);
export const useLastCreatedNotification = () => useNotificationStore((state) => state.lastCreatedNotification);