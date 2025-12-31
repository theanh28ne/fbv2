import { RouteRecordRaw } from "vue-router";
import { authStorage } from "@/services/auth/auth.storage";
import { useAuthStore } from "@/stores/auth";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: () => {
      const authStore = useAuthStore();
      return authStore.isAuthenticated ? "/feed" : "/login";
    },
  },

  //Auth
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/forgotPassword",
    name: "ForgotPassword",
    component: () => import("@/views/auth/ForgotPass.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/auth/ResetPassView.vue"),
    meta: { requiresGuest: true },
  },

  //App
  {
    path: "/feed",
    name: "Newsfeed",
    component: () => import("@/views/NewsfeedView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/update-profile",
    name: "UpdateProfile",
    component: () => import("@/views/UpdateProfileView.vue"),
    meta: { requiresAuth: true },
  },
];
