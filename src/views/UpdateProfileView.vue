<template>
  <div class="page-container">
    <Header />

    <main class="edit-profile-view">
      <div class="edit-container">
        <div class="back-navigation">
          <el-button link @click="handleCancel" class="back-btn">
            <el-icon><ArrowLeft /></el-icon> Quay lại
          </el-button>
        </div>

        <el-card class="edit-card" shadow="never">
          <template #header>
            <div class="card-header">
              <h2 class="title">Chỉnh sửa hồ sơ</h2>
              <p class="subtitle">Quản lý thông tin công khai và quyền riêng tư của bạn</p>
            </div>
          </template>

          <el-form 
            :model="form" 
            label-position="top" 
            class="custom-form"
            @submit.prevent="handleSubmit"
          >
            <div class="avatar-edit-section">
              <div class="avatar-preview-wrapper">
                <el-avatar 
                  :size="120" 
                  :src="avatarPreview || authStore.currentUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.currentUser?.username}`"
                  class="main-avatar"
                >
                  {{ authStore.currentUser?.name?.charAt(0) }}
                </el-avatar>
                
                <el-upload
                  ref="uploadRef"
                  class="avatar-uploader"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                  accept="image/*"
                >
                  <div class="upload-overlay">
                    <el-icon><Camera /></el-icon>
                  </div>
                </el-upload>
              </div>
              <p class="upload-hint">Nhấp vào ảnh để thay đổi</p>
            </div>

            <el-divider />

            <el-form-item label="Tên hiển thị" class="custom-label">
              <el-input 
                v-model="form.name" 
                placeholder="Tên của bạn là gì?"
                maxlength="50"
                show-word-limit
                class="custom-input"
              />
            </el-form-item>

            <el-form-item label="Tên người dùng (Username)" class="custom-label">
              <el-input 
                v-model="form.username" 
                placeholder="username"
                maxlength="30"
                class="custom-input"
              >
                <template #prepend>@</template>
              </el-input>
              <span class="field-desc">Tên định danh duy nhất của bạn trên hệ thống.</span>
            </el-form-item>

            <el-form-item label="Tiểu sử" class="custom-label">
              <el-input 
                v-model="form.bio" 
                type="textarea"
                :rows="4"
                placeholder="Giới thiệu ngắn gọn về bản thân..."
                maxlength="200"
                show-word-limit
                class="custom-input"
              />
            </el-form-item>

            <div class="privacy-box">
              <div class="privacy-info">
                <span class="privacy-title">Tài khoản riêng tư</span>
                <p class="privacy-desc">Khi bật, chỉ những người theo dõi bạn mới có thể thấy nội dung bài viết.</p>
              </div>
              <el-switch 
                v-model="form.is_private"
                active-color="#0866ff"
              />
            </div>

            <el-divider />

            <div class="form-actions">
              <el-button 
                plain 
                @click="handleCancel" 
                class="cancel-btn"
              >
                Hủy bỏ
              </el-button>
              <el-button 
                type="primary" 
                @click="handleSubmit"
                :loading="authStore.loading"
                class="save-btn"
              >
                Lưu thay đổi
              </el-button>
            </div>
          </el-form>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/layout/Header.vue'
import { Camera, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const avatarPreview = ref('')
const uploadRef = ref()

const form = reactive({
  name: '',
  username: '',
  bio: '',
  avatar: null as File | null,
  is_private: false
})

onMounted(() => {
  if (authStore.currentUser) {
    form.name = authStore.currentUser.name
    form.username = authStore.currentUser.username
    form.bio = authStore.currentUser.bio || ''
    form.is_private = authStore.currentUser.is_private
  }
})

const handleAvatarChange = (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.error('Chỉ chấp nhận file ảnh')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('Ảnh không được vượt quá 2MB')
    return
  }
  form.avatar = file
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!form.name.trim()) return ElMessage.error('Vui lòng nhập tên hiển thị')
  if (!form.username.trim()) return ElMessage.error('Vui lòng nhập username')
  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return ElMessage.error('Username không hợp lệ')

  try {
    await authStore.updateProfile({
      name: form.name.trim(),
      username: form.username.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar || undefined,
      is_private: form.is_private
    })
    ElMessage.success('Cập nhật thành công!')
    router.push('/profile')
  } catch (error: any) {
    ElMessage.error(error.message || 'Cập nhật thất bại')
  }
}

const handleCancel = () => router.back()
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding-top: 56px;
}

.edit-profile-view {
  padding: 32px 16px;
  display: flex;
  justify-content: center;
}

.edit-container {
  width: 100%;
  max-width: 650px;
}

.back-navigation {
  margin-bottom: 16px;
}

.back-btn {
  color: #65676b;
  font-weight: 600;
}

.edit-card {
  border-radius: 12px;
  border: 1px solid #e4e6eb;
}

.card-header .title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #050505;
}

.card-header .subtitle {
  margin: 4px 0 0;
  color: #65676b;
  font-size: 14px;
}

/* Avatar Styling */
.avatar-edit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.avatar-preview-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-preview-wrapper:hover .upload-overlay {
  opacity: 1;
}

.upload-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #0866ff;
  font-weight: 600;
}

/* Form Styling */
.custom-label :deep(.el-form-item__label) {
  font-weight: 700;
  color: #050505;
  padding-bottom: 8px;
}

.custom-input :deep(.el-input__wrapper),
.custom-input :deep(.el-textarea__inner) {
  background-color: #f5f6f7;
  box-shadow: none;
  border: 1px solid #dddfe2;
  border-radius: 8px;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #0866ff inset;
}

.field-desc {
  font-size: 12px;
  color: #65676b;
  margin-top: 4px;
  display: block;
}

/* Privacy Box */
.privacy-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f7f8fa;
  border-radius: 12px;
  margin-top: 24px;
}

.privacy-title {
  font-weight: 700;
  display: block;
  color: #050505;
}

.privacy-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: #65676b;
  line-height: 1.4;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 0;
}

.save-btn {
  padding: 10px 24px;
  font-weight: 600;
  border-radius: 8px;
}

.cancel-btn {
  padding: 10px 24px;
  font-weight: 600;
  border-radius: 8px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .edit-profile-view {
    padding: 0;
  }
  .edit-card {
    border-radius: 0;
    border: none;
    min-height: calc(100vh - 56px);
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .form-actions .el-button {
    width: 100%;
    margin: 0;
  }
}
</style>