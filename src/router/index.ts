import { createRouter, createWebHashHistory } from "vue-router";
import { setupAuthGuards } from "./guards";
import { routes } from "./routes";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
});

setupAuthGuards(router);

export default router;
