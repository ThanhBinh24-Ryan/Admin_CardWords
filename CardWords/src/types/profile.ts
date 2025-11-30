export interface Profile {
  email: string;
  name: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  currentLevel: string;
}

export interface ProfileResponse {
  status: string;
  message: string;
  data: Profile;
}

export interface UpdateProfileRequest {
  name: string;
  gender: string;
  dateOfBirth: string;
  currentLevel: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  status: string;
  message: string;
  data: {};
}