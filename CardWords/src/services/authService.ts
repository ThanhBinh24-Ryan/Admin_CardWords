// src/services/authService.ts
import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  ForgotPasswordRequest, 
  ForgotPasswordResponse 
} from '../types/auth';

const API = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Đang gửi request login:', credentials);
      
      const response = await API.post<LoginResponse>(
        '/api/v1/auth/signin', 
        credentials
      );

      console.log('Login response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Đăng nhập thất bại');
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server');
      } else {
        throw new Error('Lỗi không xác định');
      }
    }
  },

  async forgotPassword(emailData: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      console.log('Đang gửi request quên mật khẩu:', emailData);
      
      const response = await API.post<ForgotPasswordResponse>(
        '/api/v1/auth/forgot-password', // THAY BẰNG ENDPOINT THỰC TẾ
        emailData
      );

      console.log('Forgot password response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('Lỗi quên mật khẩu:', error);
      
      if (error.response) {
        throw new Error(error.response.data.message || 'Gửi yêu cầu thất bại');
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server');
      } else {
        throw new Error('Lỗi không xác định');
      }
    }
  }
};