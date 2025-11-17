// services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenUtils } from '../utils/tokenUtils';
import { config } from './config';

// Create axios instance với base config
const api: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để tự động thêm token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    // Check if error.response exists before accessing status
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = tokenUtils.getRefreshToken();
          if (refreshToken) {
            // Gọi API refresh token
            const response = await axios.post(
              `${config.API_BASE_URL}/api/v1/auth/refresh`,
              { refreshToken }
            );
            
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // Lưu token mới
            tokenUtils.setTokens(accessToken, newRefreshToken);
            
            // Retry request ban đầu với token mới
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch {
          // Refresh token failed, logout user
          tokenUtils.clearTokens();
          window.location.href = '/login';
        }
      }
    }

    // Xử lý các lỗi khác
    if (error.response?.status >= 500) {
      console.error('Server error:', error);
    }

    return Promise.reject(error);
  }
);

export { api };