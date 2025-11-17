// src/utils/tokenUtils.ts
export const tokenUtils = {
  // Lưu token
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Lấy access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // Lấy refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  // Xóa token (logout)
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Kiểm tra đã login chưa
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
};