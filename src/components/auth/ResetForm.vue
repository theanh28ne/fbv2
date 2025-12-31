<template>
  <el-card class="reset-card">
    <h2 class="title">Đặt lại mật khẩu</h2>

    <el-form
      ref="resetFormRef"
      :model="resetForm"
      :rules="rules"
      label-position="top"
      @submit.prevent="handleReset"
    >
      <el-form-item label="Mật khẩu mới" prop="password">
        <el-input
          v-model="resetForm.password"
          type="password"
          placeholder="Nhập mật khẩu mới"
          show-password
        />
      </el-form-item>

      <el-form-item label="Xác nhận mật khẩu" prop="password_confirmation">
        <el-input
          v-model="resetForm.password_confirmation"
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
          native-type="submit"
          @click="handleReset"
        >
          Xác nhận thay đổi
        </el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    
    <div class="footer-links">
      <div class="footer-item">
        <el-text size="small">Nhớ ra mật khẩu?</el-text>
        <el-link type="primary" :underline="false" @click="router.push('/login')">
          Đăng nhập ngay
        </el-link>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const resetFormRef = ref<FormInstance>();

// Lấy token từ route.query (Vue Router sẽ tự bóc tách từ sau dấu #)
const token = ref("");

const resetForm = reactive({
  password: "",
  password_confirmation: "",
});

onMounted(() => {
  // Lấy token ngay khi component mount
  if (route.query.token) {
    token.value = route.query.token as string;
  } else {
    ElMessage.error("Không tìm thấy mã xác nhận (token)!");
  }
});

const validatePasswordConfirm = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Vui lòng nhập lại mật khẩu"));
  } else if (value !== resetForm.password) {
    callback(new Error("Mật khẩu xác nhận không khớp!"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  password: [
    { required: true, message: "Mật khẩu không được để trống", trigger: "blur" },
    { min: 8, max: 50, message: "Mật khẩu từ 8 đến 50 ký tự", trigger: "blur" },
  ],
  password_confirmation: [
    { required: true, validator: validatePasswordConfirm, trigger: "blur" },
  ],
});

const handleReset = async () => {
  if (!resetFormRef.value) return;

  await resetFormRef.value.validate(async (valid) => {
    if (!valid) return;

    if (!token.value) {
      ElMessage.error("Token không hợp lệ hoặc đã hết hạn");
      return;
    }

    try {
      const response = await authStore.resetPassword({
        token: token.value, // Dùng token.value từ ref
        ...resetForm
      });

      if (response.success) {
        ElMessage.success("Đặt lại mật khẩu thành công!");
        router.push("/login");
      } else {
        ElMessage.error(response.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (error: any) {
      ElMessage.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  });
};
</script>

<style scoped>
.reset-card {
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