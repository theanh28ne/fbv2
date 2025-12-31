import api from "@/services/api";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileData,
  UpdateProfileResponse,
} from "@/types/auth";
import type { UserResponse } from "@/types/user";

export const authApi = {
  login(data: LoginRequest) {
    return api.post<LoginResponse>("/api/auth/login", data);
  },

  register(data: RegisterRequest) {
    return api.post<RegisterResponse>("/api/auth/register", data);
  },
  logout() {
    return api.post("/api/auth/logout");
  },

  getCurrentUser() {
    return api.get<UserResponse>("/api/auth/user");
  },

  // auth.api.ts
  // auth.api.ts
  updateProfile(data: UpdateProfileData) {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Spoofing cho Laravel

    if (data.name) formData.append("name", data.name);
    if (data.username) formData.append("username", data.username);
    if (data.bio !== undefined) formData.append("bio", data.bio || ""); // Gửi chuỗi rỗng nếu bio null

    // Chỉ gửi avatar nếu nó là một đối tượng File hợp lệ
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    // Đảm bảo gửi 1 hoặc 0 dưới dạng string
    formData.append("is_private", data.is_private ? "1" : "0");

    return api.post<UpdateProfileResponse>("/api/auth/profile", formData);
  },

  forgotPassword(data: ForgotPasswordRequest) {
    return api.post<ForgotPasswordResponse>("/api/auth/forgot-password", data);
  },

  resetPassword(data: ResetPasswordRequest) {
    return api.post<ResetPasswordResponse>("/api/auth/reset-password", data);
  },
};
