import { authService } from "@/services/auth";
import { authStorage } from "@/services/auth/auth.storage";
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileData,
  ValidationErrors,
} from "@/types/auth";
import { User } from "@/types/user";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  //State
  const user = ref<User | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const validationErrors = ref<ValidationErrors>({});
  //Getters
  const isAuthenticated = computed(() => !!user.value);
  const currentUser = computed(() => user.value);

  //Action
  async function login(data: LoginRequest) {
    loading.value = true;
    error.value = null;
    const response = await authService.login(data);
    if (response.success) {
      user.value = response.data.user;
    } else {
      error.value = response.message ?? "Đăng nhập thất bại";
    }
    loading.value = false;
    return response;
  }

  async function register(data: RegisterRequest) {
    loading.value = true;
    error.value = null;
    validationErrors.value = {};
    const response = await authService.register(data);
    if (response.success) {
      user.value = response.data.user;
    } else {
      error.value = response.message ?? "Đăng kí thất bại";
      validationErrors.value = response.errors;
    }
    loading.value = false;
    return response;
  }

  async function logout() {
    await authService.logout();
    user.value = null;
  }

  // authStore (Pinia)
  async function updateProfile(data: UpdateProfileData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.updateProfile(data);

      if (response.success && response.data) {
        user.value = response.data;
        return response;
      }

      throw new Error(response.message || "Không thể cập nhật profile");
    } catch (err: any) {
      error.value = err.message || "Không thể cập nhật profile";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getUserInfo() {
    const response = await authService.getCurrentUser();
    if (response.success) {
      user.value = response.data;
    } else {
      user.value = null;
    }
  }

  function initializeAuth() {
    const storedUser = authStorage.getUser();
    if (storedUser) {
      user.value = storedUser;
    }
  }

  async function fetchCurrentUser() {
    if (!authStorage.isAuthenticated()) return;

    loading.value = true;
    try {
      const res = await authStorage.getUser();

      if (res.data.success) {
        user.value = res.data.data;
      } else {
        // Kiểm tra status code
        if (res.status === 401) {
          console.log("Token không hợp lệ, logout...");
          await logout();
        } else {
          console.error("Lỗi API:", res.status, res.data);
        }
      }
    } catch (error: any) {
      const status = error.response?.status;

      console.log("Lỗi khi fetch user:", error.message, "Status:", status);

      // Chỉ logout với lỗi authentication
      if (status === 401 || status === 403) {
        console.log("Authentication failed, logout...");
        await logout();
      } else if (!error.response) {
        // Network error - giữ token
        console.warn("Network error - giữ token để retry sau");
      } else {
        // Server error khác - giữ token
        console.error("Server error", status, "- giữ token");
      }
    } finally {
      loading.value = false;
    }
  }

  async function forgotPassword(data: ForgotPasswordRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.forgotPassword(data);

      if (!response.success) {
        error.value = response.message;
        return { success: false, message: response.message };
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Gửi email đặt lại mật khẩu thất bại";

      return {
        success: false,
        message: error.value,
      };
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(data: ResetPasswordRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.resetPassword(data);

      if (!response.success) {
        error.value = response.message;
        return { success: false, message: response.message };
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (err: any) {
      error.value = err.response?.data?.message || "Cập nhật mật khẩu thất bại";

      return {
        success: false,
        message: error.value,
      };
    } finally {
      loading.value = false;
    }
  }

  return {
    // state
    user,
    loading,
    error,
    validationErrors,

    // getters
    isAuthenticated,
    currentUser,

    // actions
    login,
    register,
    logout,
    initializeAuth,
    fetchCurrentUser,
    updateProfile,
    forgotPassword,
    resetPassword,
  };
});
