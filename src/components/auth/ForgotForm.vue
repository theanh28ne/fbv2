<template>
  <el-card class="register-card">
    <h2 class="title">Quên mật khẩu</h2>

    <el-form
      ref="forgotFormRef"
      :model="forgotForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Nhập email của bạn để nhận liên kết đặt lại mật khẩu" prop="email">
        <el-input
          v-model="forgotForm.email"
          placeholder="Nhập email"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          class="w-full"
          :loading="authStore.loading"
          @click="handleRegister"
        >
          Xác nhận
        </el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    
    <div class="footer-links">
      <div class="footer-item">
        <el-text size="small">Đã nhớ lại mật khẩu?</el-text>
        <el-link type="primary" :underline="false" @click="$router.push('/login')">
          Đăng nhập ngay?
        </el-link>
      </div>
      
    </div>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const forgotFormRef = ref();

const forgotForm = ref({
  email: "",
});

const rules = {

  email: [
    { 
      required: true, 
      message: "Email không được để trống", 
      trigger: "blur" 
    },
    { 
      type: "email", 
      message: "Email không hợp lệ", 
      trigger: "blur" 
    }
  ],
};

const handleRegister = () => {
  forgotFormRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const response = await authStore.forgotPassword(forgotForm.value);
      
      if (response.success) {
        ElMessage.success("Đã gửi xác nhận về mail vui lòng kiểm tra  🎉");
        
        // Redirect về trang chủ hoặc trang được yêu cầu trước đó
        const redirect = router.currentRoute.value.query.redirect;
        router.push(redirect || '/');
      } else {
        // Hiển thị lỗi từ API
        ElMessage.error(response.message || "Email không tồn tại vui lòng nhập lại");
      }
    } catch (error) {
      console.error("Register error:", error);
      ElMessage.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  });
};
</script>

<style scoped>
.register-card {
  width: 380px;
  margin: 100px auto;
  border-radius: 8px;
}

.title {
  text-align: center;
  margin-bottom: 25px;
  color: #303133;
}

.w-full {
  width: 100%;
}

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.el-divider--horizontal {
  margin: 20px 0;
}

:deep(.el-link) {
  font-weight: 500;
}
</style>