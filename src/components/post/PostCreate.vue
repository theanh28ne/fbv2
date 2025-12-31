<template>
  <el-card class="post-create-card" shadow="never">
    <div class="create-header">
      <el-avatar 
        :size="42"
        :src="authStore.currentUser?.avatar_url"
        class="user-avatar"
      >
        {{ authStore.currentUser?.name?.charAt(0) || 'U' }}
      </el-avatar>
      
      <el-input
        v-model="content"
        type="textarea"
        :rows="3"
        :maxlength="500"
        placeholder="Bạn đang nghĩ gì thế?"
        resize="none"
        :autosize="{ minRows: 2, maxRows: 8 }"
        class="post-input"
      />
    </div>
    
    <div class="create-footer">
      <div class="action-buttons">
        <el-tooltip content="Thêm ảnh" placement="top">
          <el-button text circle @click="handleImageUpload" class="tool-btn image-btn">
            <el-icon :size="20"><Picture /></el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Thêm GIF" placement="top">
          <el-button text circle class="tool-btn gif-btn">
            <el-icon :size="20">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"/>
              </svg>
            </el-icon>
          </el-button>
        </el-tooltip>
        
        <el-tooltip content="Emoji" placement="top">
          <el-button text circle class="tool-btn emoji-btn">
            <el-icon :size="20"><ChatDotRound /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      
      <div class="submit-area">
        <span class="char-count" :class="{ 'is-limit': content.length > 450 }">
          {{ content.length }}/500
        </span>
        
        <el-button
          type="primary"
          class="post-btn"
          round
          :disabled="!canPost"
          :loading="loading"
          @click="handlePost"
        >
          Đăng bài
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { Picture, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'


const authStore = useAuthStore()
const postStore = usePostStore()

const content = ref('')
const loading = ref(false)

const canPost = computed(() => {
  return content.value.trim().length > 0 && content.value.length <= 500
})

const handleImageUpload = () => {
  // TODO: Implement image upload
  ElMessage.info('Tính năng đang phát triển')
  console.log('Image upload clicked')
}

const handlePost = async () => {
  if (!canPost.value || loading.value) return
  
  loading.value = true
  
  try {
    const result = await postStore.createPost({
      content: content.value.trim(),
    })
    
    if (result?.success) {
      console.log('Post created successfully:', result)
      content.value = ''
      ElMessage.success('Đăng bài thành công!')
    }
  } catch (error: any) {
    console.error('Failed to create post:', error)
    ElMessage.error(error.message || 'Đăng bài thất bại')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.post-create-card {
  max-width: 680px; /* Đồng bộ với PostList */
  margin: 0 auto 16px;
  border-radius: 12px;
  border: 1px solid #e4e6eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.create-header {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.user-avatar {
  border: 1px solid #f0f2f5;
  flex-shrink: 0;
}

.post-input :deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  padding: 8px 0;
  font-size: 17px;
  color: #050505;
  background-color: transparent;
}

.post-input :deep(.el-textarea__inner::placeholder) {
  color: #65676b;
  font-size: 17px;
}

.create-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f2f5;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.tool-btn {
  font-size: 20px;
  color: #1d9bf0;
  transition: all 0.2s;
}

.tool-btn:hover {
  background-color: #f0f7ff !important;
}

.submit-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.char-count {
  font-size: 13px;
  color: #65676b;
  font-weight: 500;
}

.char-count.is-limit {
  color: #f56c6c;
}

.post-btn {
  font-weight: 600;
  padding: 8px 24px;
}

@media (max-width: 768px) {
  .post-create-card {
    border-radius: 0;
    border-left: none;
    border-right: none;
    margin-bottom: 8px;
  }
}
</style>