import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus"; // ✅ ĐÚNG
import "element-plus/dist/index.css";

const url = new URL(window.location.href);
const token = url.searchParams.get("token");

// Nếu URL có dạng /reset-password?token=... (không có dấu #)
if (url.pathname.includes("reset-password") && token) {
  // Chuyển hướng sang Hash Mode: /#/reset-password?token=...
  const newUrl = `${window.location.origin}${window.location.pathname.replace(
    /\/$/,
    ""
  )}/#/reset-password?token=${token}`;
  window.location.replace(newUrl);
}

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount("#app");
