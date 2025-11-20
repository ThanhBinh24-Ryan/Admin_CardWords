import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notification, CreateNotificationRequest, BroadcastNotificationRequest } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  lastCreatedNotification: Notification | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
}

interface NotificationStore extends NotificationState {
  fetchNotifications: (page?: number, size?: number) => Promise<void>;
  createNotification: (request: CreateNotificationRequest) => Promise<Notification>;
  broadcastNotification: (request: BroadcastNotificationRequest) => Promise<void>;
  deleteNotification: (userId: string, notificationId: number) => Promise<void>;
  deleteMultipleNotifications: (userId: string, notificationIds: number[]) => Promise<void>;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearError: () => void;
  clearLastCreated: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  lastCreatedNotification: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  },
};

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchNotifications: async (page = 0, size = 20) => {
        try {
          set({ loading: true, error: null });
          const response = await notificationService.getNotifications(page, size);
          set({
            notifications: response.content,
            loading: false,
            pagination: {
              currentPage: response.number,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              pageSize: response.size,
            },
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch notifications' 
          });
        }
      },

      createNotification: async (request: CreateNotificationRequest) => {
        try {
          set({ loading: true, error: null });
          const response = await notificationService.createNotification(request);
          const newNotification = response.data;
          set({ 
            loading: false,
            lastCreatedNotification: newNotification 
          });
          set(state => ({
            notifications: [newNotification, ...state.notifications]
          }));
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
          set({ loading: false });
          get().fetchNotifications();
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to broadcast notification' 
          });
          throw error;
        }
      },

      deleteNotification: async (userId: string, notificationId: number) => {
        try {
          set({ loading: true, error: null });
          await notificationService.deleteNotification(userId, notificationId);
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== notificationId),
            loading: false
          }));
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete notification' 
          });
          throw error;
        }
      },

      deleteMultipleNotifications: async (userId: string, notificationIds: number[]) => {
        try {
          set({ loading: true, error: null });
          await notificationService.deleteMultipleNotifications(userId, notificationIds);
          set(state => ({
            notifications: state.notifications.filter(n => !notificationIds.includes(n.id)),
            loading: false
          }));
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete notifications' 
          });
          throw error;
        }
      },

      markAsRead: (notificationId: number) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, isRead: true }))
        }));
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

export const useNotifications = () => useNotificationStore((state) => state.notifications);
export const useNotificationLoading = () => useNotificationStore((state) => state.loading);
export const useNotificationError = () => useNotificationStore((state) => state.error);
export const useLastCreatedNotification = () => useNotificationStore((state) => state.lastCreatedNotification);
export const useNotificationsPagination = () => useNotificationStore((state) => state.pagination);