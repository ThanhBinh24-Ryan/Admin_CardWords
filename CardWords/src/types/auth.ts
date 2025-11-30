export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
  data: {
    result: string;
    message: string;
  };
}

// Bổ sung thêm các types cần thiết
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  confirmPassword?: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
  };
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ResetPasswordResponse {
  status: string;
  message: string;
  data: {
    result: string;
    message: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  status: string;
  message: string;
  data: {
    verified: boolean;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

