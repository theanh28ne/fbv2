import type { User } from "./user";

//COMMON
export interface AuthSuccessData {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export type ValidationErrors = Record<string, string[]>;

// LOGIN
export interface LoginRequest {
  login: string;
  password: string;
}
export type LoginResponse =
  | {
      success: true;
      message: string;
      data: AuthSuccessData;
    }
  | {
      success: false;
      message: string;
    };

// REGISTER
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}
export type RegisterResponse =
  | {
      success: true;
      message: string;
      data: AuthSuccessData;
    }
  | {
      success: false;
      message: string;
      errors: ValidationErrors;
    };

// UPDATE PROFILE
export interface UpdateProfileData {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: File;
  is_private?: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
