import { UserResponse } from "@/types/user";
import { authApi } from "./auth.api";
import { authStorage } from "./auth.storage";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateProfileData,
  UpdateProfileResponse,
} from "@/types/auth";
import axios from "axios";
export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await authApi.login(data);

      if (res.data.success) {
        authStorage.set(res.data.data);
      }

      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message ?? "Đăng nhập thất bại",
        };
      }
      return {
        success: false,
        message: "Đăng nhập thất bại",
      };
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const res = await authApi.register(data);

      if (res.data.success) {
        authStorage.set(res.data.data);
      }

      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message: err.response?.data?.message ?? "Đăng nhập thất bại",
          errors: err.response?.data?.errors,
        };
      }
      return {
        success: false,
        message: "Đăng nhập thất bại",
        errors: {},
      };
    }
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      // Dù API có fail vẫn phải clear local
      authStorage.clear();
    }
  },
  async getCurrentUser(): Promise<UserResponse> {
    const response = await authApi.getCurrentUser();
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
    try {
      const response = await authApi.updateProfile(data);

      if (response.data.success) {
        const currentAuthData = authStorage.get();
        if (currentAuthData) {
          authStorage.set({
            ...currentAuthData,
            user: response.data.data,
          });
        }
      }

      return response.data;
    } catch (error) {
      console.error("Update profile failed:", error);
      throw error;
    }
  },

  async forgotPassword(data: ForgotPasswordRequest) {
    try {
      const response = await authApi.forgotPassword(data);
      return response.data;
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  },

  async resetPassword(data: ResetPasswordRequest) {
    try {
      const response = await authApi.resetPassword(data);
      return response.data;
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  },
};
