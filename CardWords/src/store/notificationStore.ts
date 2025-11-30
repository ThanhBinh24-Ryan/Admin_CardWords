// notificationStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Notification, 
  CreateNotificationRequest, 
  BroadcastNotificationRequest, 
  User,
  NotificationSummary,
  NotificationCategory,
  ApiResponse,
  NotificationsPageResponse,
  NotificationFilter,
  isNotificationsPageResponse,
  UsersPageResponse,
  isUsersPageResponse
} from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  users: User[];
  usersPage: UsersPageResponse | null;
  summary: NotificationSummary[];
  categories: NotificationCategory[];
  allNotifications: NotificationsPageResponse | null;
  userNotifications: Record<string, NotificationsPageResponse | null>;
  loading: boolean;
  deleting: boolean;
  error: string | null;
  lastCreatedNotification: Notification | null;
  selectedUser: User | null;
}

interface NotificationStore extends NotificationState {
  fetchUsers: (page?: number, size?: number, sortBy?: string, sortDir?: string) => Promise<void>;
  fetchUsersPage: (page?: number, size?: number, sortBy?: string, sortDir?: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  
  fetchSummary: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createNotification: (request: CreateNotificationRequest) => Promise<Notification>;
  broadcastNotification: (request: BroadcastNotificationRequest) => Promise<void>;
  
  deleteUserNotification: (userId: string, notificationId: number) => Promise<{success: boolean, message?: string}>;
  deleteMultipleUserNotifications: (userId: string, notificationIds: number[]) => Promise<{success: boolean, successful: number[], failed: number[], message?: string}>;
  
  fetchAllNotifications: (filter?: NotificationFilter) => Promise<void>;
  fetchUserNotifications: (userId: string, filter?: NotificationFilter) => Promise<void>;
  
  clearError: () => void;
  clearLastCreated: () => void;
  refreshAllData: () => Promise<void>;
  clearAllNotifications: () => void;
  clearUserNotifications: (userId?: string) => void;
}

const initialState: NotificationState = {
  users: [],
  usersPage: null,
  summary: [],
  categories: [],
  allNotifications: null,
  userNotifications: {},
  loading: false,
  deleting: false,
  error: null,
  lastCreatedNotification: null,
  selectedUser: null,
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      
      fetchUsers: async (page = 0, size = 100, sortBy = 'createdAt', sortDir = 'desc') => {
        try {
          console.log('Fetching users...', { page, size, sortBy, sortDir });
          const response = await notificationService.getUsers(page, size, sortBy, sortDir);
          console.log('Users response:', response);
          
          let usersList: User[] = [];
          
          if (response && (response as any).content) {
            usersList = (response as any).content;
          } else if (response && Array.isArray(response)) {
            usersList = response;
          } else if (response && (response as any).data) {
            const responseData = (response as any).data;
            usersList = responseData.content || responseData;
          } else if (response && (response as any).data?.content) {
            usersList = (response as any).data.content;
          }
          
          console.log('👥 Final users list:', usersList);
          set({ users: Array.isArray(usersList) ? usersList : [] });
        } catch (error) {
          console.error(' Failed to fetch users:', error);
          set({ users: [] });
        }
      },


      fetchUsersPage: async (page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc') => {
        try {
          set({ loading: true, error: null });
          console.log('Fetching users page...', { page, size, sortBy, sortDir });
          const response = await notificationService.getUsers(page, size, sortBy, sortDir);
          console.log('Users page response:', response);
          
          let usersPageData: UsersPageResponse | null = null;
          
          if (response && response.data && isUsersPageResponse(response.data)) {
            usersPageData = response.data;
          } else if (response && isUsersPageResponse(response)) {
            usersPageData = response;
          } else if (response && (response as any).data) {
            usersPageData = (response as any).data;
          }
          
          set({ 
            usersPage: usersPageData,
            loading: false 
          });
        } catch (error) {
          console.error('Failed to fetch users page:', error);
          set({ 
            usersPage: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch users' 
          });
        }
      },

      // Set selected user
      setSelectedUser: (user: User | null) => {
        set({ selectedUser: user });
      },

      fetchSummary: async () => {
        try {
          set({ loading: true, error: null });
          console.log(' Fetching summary...');
          const response = await notificationService.getNotificationSummary();
          console.log(' Summary response:', response);
          
          let summaryData: NotificationSummary[] = [];
          
          if (response && response.data) {
            summaryData = response.data;
          } else if (response && Array.isArray(response)) {
            summaryData = response;
          } else if (response && (response as any).content) {
            summaryData = (response as any).content;
          } else if (response && (response as any).data?.content) {
            summaryData = (response as any).data.content;
          }
          
          console.log(' Final summary data:', summaryData);
          set({ 
            summary: Array.isArray(summaryData) ? summaryData : [],
            loading: false 
          });
        } catch (error) {
          console.error(' Failed to fetch summary:', error);
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
          console.log(' Fetching categories...');
          const response = await notificationService.getNotificationCategories();
          console.log(' Categories response:', response);
          
          let categoriesData: NotificationCategory[] = [];
          
          if (response && response.data) {
            categoriesData = response.data;
          } else if (response && Array.isArray(response)) {
            categoriesData = response;
          } else if (response && (response as any).content) {
            categoriesData = (response as any).content;
          } else if (response && (response as any).data?.content) {
            categoriesData = (response as any).data.content;
          }
          
          console.log(' Final categories data:', categoriesData);
          set({ 
            categories: Array.isArray(categoriesData) ? categoriesData : [],
            loading: false 
          });
        } catch (error) {
          console.error(' Failed to fetch categories:', error);
          set({ 
            categories: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch notification categories' 
          });
        }
      },

      fetchAllNotifications: async (filter: NotificationFilter = {}) => {
        try {
          set({ loading: true, error: null });
          console.log(' Fetching all notifications...', filter);
          const response = await notificationService.getAllNotifications(filter);
          console.log(' All notifications response:', response);
          
          let notificationsData: NotificationsPageResponse | null = null;
          
          if (response && response.data && isNotificationsPageResponse(response.data)) {
            notificationsData = response.data;
          } else if (response && isNotificationsPageResponse(response)) {
            notificationsData = response;
          }
          
          set({ 
            allNotifications: notificationsData,
            loading: false 
          });
        } catch (error) {
          console.error(' Failed to fetch all notifications:', error);
          set({ 
            allNotifications: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch all notifications' 
          });
        }
      },

      fetchUserNotifications: async (userId: string, filter: NotificationFilter = {}) => {
        try {
          set({ loading: true, error: null });
          console.log(`Fetching notifications for user ${userId}...`, filter);
          const response = await notificationService.getUserNotifications(userId, filter);
          console.log('User notifications response:', response);
          
          let notificationsData: NotificationsPageResponse | null = null;
          
          if (response && response.data && isNotificationsPageResponse(response.data)) {
            notificationsData = response.data;
          } else if (response && isNotificationsPageResponse(response)) {
            notificationsData = response;
          }
          
          set(state => ({ 
            userNotifications: {
              ...state.userNotifications,
              [userId]: notificationsData
            },
            loading: false 
          }));
        } catch (error) {
          console.error(' Failed to fetch user notifications:', error);
          set({ 
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch user notifications' 
          });
        }
      },

      refreshAllData: async () => {
        console.log('Refreshing all data...');
        const { fetchUsers, fetchSummary, fetchCategories } = get();
        await Promise.all([
          fetchUsers(),
          fetchSummary(),
          fetchCategories()
        ]);
        console.log('All data refreshed');
      },

      createNotification: async (request: CreateNotificationRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await notificationService.createNotification(request);
          
          let newNotification: Notification;
          
          if (response && response.data) {
            newNotification = response.data;
          } else {
            newNotification = response as unknown as Notification;
          }
          
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

      deleteUserNotification: async (userId: string, notificationId: number): Promise<{success: boolean, message?: string}> => {
        try {
          set({ deleting: true, error: null });
          
          const response = await notificationService.deleteUserNotification(userId, notificationId);
          
          if (response.status === 'error') {
            set({ 
              deleting: false, 
              error: response.message 
            });
            return { success: false, message: response.message };
          }
          
          if (get().userNotifications[userId]) {
            await get().fetchUserNotifications(userId);
          }
          await get().fetchAllNotifications();
          
          set({ deleting: false });
          return { success: true, message: 'Notification deleted successfully' };
          
        } catch (error) {
          console.error(' Store: Failed to delete notification:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
          
          set({ 
            deleting: false, 
            error: errorMessage
          });
          return { success: false, message: errorMessage };
        }
      },

      deleteMultipleUserNotifications: async (userId: string, notificationIds: number[]): Promise<{success: boolean, successful: number[], failed: number[], message?: string}> => {
        try {
          set({ deleting: true, error: null });
          

          if (!notificationIds || notificationIds.length === 0) {
            set({ deleting: false });
            return { success: true, successful: [], failed: [], message: 'No notifications to delete' };
          }
          
          console.log(`Store: Deleting ${notificationIds.length} notifications for user ${userId}`);
          
          const response = await notificationService.deleteMultipleUserNotifications(userId, notificationIds);
          
          if (response.status === 'error') {
            set({ 
              deleting: false, 
              error: response.message 
            });
            return { 
              success: false, 
              successful: [], 
              failed: notificationIds, 
              message: response.message 
            };
          }
          
          if (get().userNotifications[userId]) {
            await get().fetchUserNotifications(userId);
          }
          await get().fetchAllNotifications();
          
          set({ deleting: false });
          
          return {
            success: response.status === 'success' || response.status === 'partial_success',
            successful: response.data?.successful || [],
            failed: response.data?.failed || [],
            message: response.message
          };
          
        } catch (error) {
          console.error(' Store: Failed to delete multiple notifications:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete notifications';
          
          set({ 
            deleting: false, 
            error: errorMessage
          });
          return { 
            success: false, 
            successful: [], 
            failed: notificationIds, 
            message: errorMessage 
          };
        }
      },

      clearAllNotifications: () => {
        set({ allNotifications: null });
      },

      clearUserNotifications: (userId?: string) => {
        if (userId) {
          set(state => {
            const newUserNotifications = { ...state.userNotifications };
            delete newUserNotifications[userId];
            return { userNotifications: newUserNotifications };
          });
        } else {
          set({ userNotifications: {} });
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

// Export hooks
export const useUsers = () => useNotificationStore((state) => state.users);
export const useUsersPage = () => useNotificationStore((state) => state.usersPage);
export const useSummary = () => useNotificationStore((state) => state.summary);
export const useCategories = () => useNotificationStore((state) => state.categories);
export const useAllNotifications = () => useNotificationStore((state) => state.allNotifications);
export const useUserNotifications = (userId: string) => 
  useNotificationStore((state) => state.userNotifications[userId]);
export const useNotificationLoading = () => useNotificationStore((state) => state.loading);
export const useNotificationDeleting = () => useNotificationStore((state) => state.deleting);
export const useNotificationError = () => useNotificationStore((state) => state.error);
export const useLastCreatedNotification = () => useNotificationStore((state) => state.lastCreatedNotification);
export const useSelectedUser = () => useNotificationStore((state) => state.selectedUser);