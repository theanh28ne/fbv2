import { useAuthStore } from "@/stores/auth";
import { Router } from "vue-router";

export function setupAuthGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // Cho phép vào trang reset-password nếu chưa đăng nhập
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      return next({ name: "Newsfeed" });
    }

    // Nếu trang yêu cầu auth mà chưa có, về login
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ name: "Login" });
    }

    next();
  });
}
