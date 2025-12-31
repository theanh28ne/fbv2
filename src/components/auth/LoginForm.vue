<template>
  <el-card class="login-card">
    <h2 class="title">Đăng nhập</h2>

    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Email hoặc Username" prop="login">
        <el-input
          v-model="loginForm.login"
          placeholder="Nhập email hoặc username"
        />
      </el-form-item>

      <el-form-item label="Mật khẩu" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="Nhập mật khẩu"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          class="w-full"
          :loading="authStore.loading"
          @click="handleLogin"
        >
          Đăng nhập
        </el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    
    <div class="footer-links">
      <div class="footer-item">
        <el-text size="small">Chưa có tài khoản?</el-text>
        <el-link type="primary" :underline="false" @click="$router.push('/register')">
          Đăng ký ngay
        </el-link>
      </div>
      
      <div class="footer-item">
        <el-link type="info" :underline="false" @click="$router.push('/forgotPassword')">
          Quên mật khẩu?
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
const loginFormRef = ref();

const loginForm = ref({
  login: "",
  password: "",
});

// Validator tùy chỉnh để kiểm tra email hoặc username
const validateLogin = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Email hoặc username không được để trống"));
    return;
  }
  
  // Nếu có ký tự @, validate như email
  if (value.includes('@')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      callback(new Error("Email không hợp lệ"));
      return;
    }
  } 
  // Nếu không có @, validate như username (có thể tùy chỉnh rules)
  else {
    if (value.length < 3) {
      callback(new Error("Username tối thiểu 3 ký tự"));
      return;
    }
  }
  
  callback();
};

const rules = {
  login: [
    { validator: validateLogin, trigger: "blur" }
  ],
  password: [
    { required: true, message: "Mật khẩu không được để trống", trigger: "blur" },
    { min: 6, message: "Mật khẩu tối thiểu 6 ký tự", trigger: "blur" },
  ],
};

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    try {
      const response = await authStore.login(loginForm.value);
      
      if (response.success) {
        ElMessage.success("Đăng nhập thành công 🎉");
        
        // Redirect về trang chủ hoặc trang được yêu cầu trước đó
        const redirect = router.currentRoute.value.query.redirect;
        router.push(redirect || '/');
      } else {
        // Hiển thị lỗi từ API
        ElMessage.error(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      ElMessage.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  });
};
</script>

<style scoped>
.login-card {
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