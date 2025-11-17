import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
  return axiosInstance.get('/notifications');
};

export const updateNotificationSettings = async (settings: any) => {
  return axiosInstance.put('/notifications/settings', settings);
};