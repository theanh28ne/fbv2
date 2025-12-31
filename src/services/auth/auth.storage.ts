import type { AuthSuccessData } from "@/types/auth";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER = "user";

export const authStorage = {
  get(): AuthSuccessData | null {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);
    const userRaw = localStorage.getItem(USER);

    if (!access_token || !refresh_token || !userRaw) return null;

    return {
      access_token,
      refresh_token,
      user: JSON.parse(userRaw),
      expires_in: 0, // Bạn có thể lưu thêm expires_in vào localStorage nếu cần
    };
  },
  set(data: AuthSuccessData) {
    localStorage.setItem(ACCESS_TOKEN, data.access_token);
    localStorage.setItem(REFRESH_TOKEN, data.refresh_token);
    localStorage.setItem(USER, JSON.stringify(data.user));
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER);
  },

  isAuthenticated() {
    return !!localStorage.getItem(ACCESS_TOKEN);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  getUser() {
    const raw = localStorage.getItem(USER);
    return raw ? JSON.parse(raw) : null;
  },
};
