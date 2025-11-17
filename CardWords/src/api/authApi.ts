import axiosInstance from './axiosInstance';

export const login = async (email: string, password: string) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const logout = async () => {
  return axiosInstance.post('/auth/logout');
};

export const forgotPassword = async (email: string) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return axiosInstance.post('/auth/reset-password', { token, newPassword });
};