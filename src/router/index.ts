import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(), // 🔥 QUAN TRỌNG
  routes,
});

export default router;
