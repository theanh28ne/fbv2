<template>
  <el-card class="register-card">
    <h2 class="title">Đăng Ký</h2>

    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="Username" prop="username">
        <el-input
          v-model="registerForm.username"
          placeholder="Nhập username"
        />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="Nhập email"
        />
      </el-form-item>

      <el-form-item label="Mật khẩu" prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="Nhập mật khẩu"
          show-password
        />
      </el-form-item>
      <el-form-item label="Xác nhận mật khẩu" prop="password_confirmation">
        <el-input
          v-model="registerForm.password_confirmation"
          type="password"
          placeholder="Nhập lại mật khẩu"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          class="w-full"
          :loading="authStore.loading"
          @click="handleRegister"
        >
          Đăng ký
        </el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    
    <div class="footer-links">
      <div class="footer-item">
        <el-text size="small">Đã có tài khoản?</el-text>
        <el-link type="primary" :underline="false" @click="$router.push('/login')">
          Đăng nhập ngay?
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
const registerFormRef = ref();

const registerForm = ref({
  username: "",
  email: "",
  password: "",
  password_confirmation: "",

});



// Validator kiểm tra username
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Username không được để trống"));
  } else if (value.length < 3) {
    callback(new Error("Username tối thiểu 3 ký tự"));
  } else if (value.length > 20) {
    callback(new Error("Username tối đa 20 ký tự"));
  } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    callback(new Error("Username chỉ được chứa chữ cái, số và dấu gạch dưới"));
  } else {
    callback();
  }
};

// Validator kiểm tra password
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Mật khẩu không được để trống"));
  } else if (value.length < 8) {
    callback(new Error("Mật khẩu tối thiểu 8 ký tự"));
  } else if (value.length > 50) {
    callback(new Error("Mật khẩu tối đa 50 ký tự"));
  } else {
    // Nếu đã nhập password confirmation, validate lại field đó
    if (registerForm.value.password_confirmation) {
      registerFormRef.value?.validateField('password_confirmation');
    }
    callback();
  }
};

// Validator kiểm tra password confirmation
const validatePasswordConfirm = (rule, value, callback) => {
  if (!value) {
    callback(new Error("Vui lòng xác nhận mật khẩu"));
  } else if (value !== registerForm.value.password) {
    callback(new Error("Mật khẩu xác nhận không khớp"));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { validator: validateUsername, trigger: "blur" }
  ],
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
  password: [
    { validator: validatePassword, trigger: "blur" }
  ],
  password_confirmation: [
    { validator: validatePasswordConfirm, trigger: "blur" }
  ],
};

const handleRegister = () => {
  registerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    try {
      const response = await authStore.register(registerForm.value);
      
      if (response.success) {
        ElMessage.success("Đăng ký thành công 🎉");
        
        // Redirect về trang chủ hoặc trang được yêu cầu trước đó
        const redirect = router.currentRoute.value.query.redirect;
        router.push(redirect || '/');
      } else {
        // Hiển thị lỗi từ API
        ElMessage.error(response.message || "Đăng ký thất bại");
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