<template>
  <div class="page-container">
    <Header />

    <div class="profile-view">
      <el-skeleton v-if="!user" :rows="10" animated class="skeleton-padding" />

      <template v-else>
        <div class="profile-card">
          <div class="profile-info-wrapper">
            <div class="info-main-row">
              <div class="avatar-wrapper">
                <el-avatar
                  :size="140"
                  :src="user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`"
                  class="profile-avatar"
                >
                  {{ user.name.charAt(0) }}
                </el-avatar>
                <el-button
                  class="edit-avatar-btn"
                  circle
                  @click="handleEditAvatar"
                >
                  <el-icon><Camera /></el-icon>
                </el-button>
              </div>

              <div class="user-info-text">
                <div class="name-badge-row">
                  <h1 class="user-name">{{ user.name }}</h1>
                  <el-icon v-if="user.verified" class="verified-icon">
                    <svg viewBox="0 0 22 22" fill="currentColor">
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
                    </svg>
                  </el-icon>
                </div>
                <div class="user-meta">
                  <span class="username">@{{ user.username }}</span>
                  <span class="dot-separator">•</span>
                  <el-tag v-if="user.is_private" type="info" size="small" effect="light" round>
                    <el-icon><Lock /></el-icon> Riêng tư
                  </el-tag>
                  <el-tag v-else type="success" size="small" effect="light" round>
                    <el-icon><Unlock /></el-icon> Công khai
                  </el-tag>
                </div>
                <p v-if="user.bio" class="bio-text">{{ user.bio }}</p>
                <p v-else class="bio-text empty">Chưa có tiểu sử cá nhân</p>
              </div>

              <div class="action-area">
                <el-button type="primary" class="edit-profile-btn" @click="handleEditProfile" round>
                  <el-icon><Edit /></el-icon>
                  <span>Chỉnh sửa hồ sơ</span>
                </el-button>
              </div>
            </div>
          </div>

          <div class="tabs-container">
            <el-tabs v-model="activeTab" class="custom-tabs">
              <el-tab-pane name="posts">
                <template #label>
                  <div class="tab-item">
                    <el-icon><DocumentCopy /></el-icon> Bài viết
                  </div>
                </template>
              </el-tab-pane>
              <el-tab-pane name="about">
                <template #label>
                  <div class="tab-item">
                    <el-icon><User /></el-icon> Giới thiệu
                  </div>
                </template>
              </el-tab-pane>
              <el-tab-pane name="photos">
                <template #label>
                  <div class="tab-item">
                    <el-icon><Picture /></el-icon> Ảnh
                  </div>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <div class="profile-content">
          <div v-if="activeTab === 'posts'" class="tab-content-fade">
             <PostUser />
          </div>

          <div v-else-if="activeTab === 'about'" class="tab-content-fade">
            <el-card shadow="never" class="info-card">
              <div class="card-header-custom">
                <el-icon><InfoFilled /></el-icon>
                <span>Thông tin chi tiết</span>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <span class="label">Email liên hệ</span>
                  <div class="value-with-tag">
                    <span class="value">{{ user.email }}</span>
                    <el-tag :type="user.verified ? 'success' : 'warning'" size="small" round>
                      {{ user.verified ? 'Đã xác thực' : 'Chưa xác thực' }}
                    </el-tag>
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">Ngày gia nhập</span>
                  <span class="value">{{ formatDate(user.created_at) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Tình trạng tài khoản</span>
                  <span class="value">{{ user.is_private ? 'Riêng tư' : 'Công khai' }}</span>
                </div>
              </div>
            </el-card>
          </div>

          <div v-else-if="activeTab === 'photos'" class="tab-content-fade">
            <el-card shadow="never" class="empty-card">
              <el-empty description="Không có ảnh để hiển thị" :image-size="100" />
            </el-card>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/layout/Header.vue' // Import Header
import PostList from '@/components/post/PostList.vue'
import { 
  Camera, Edit, DocumentCopy, User, 
  Picture, Lock, Unlock, InfoFilled 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import router from '@/router'
import PostUser from '@/components/post/PostUser.vue'

const authStore = useAuthStore()
const activeTab = ref('posts')
const user = computed(() => authStore.currentUser)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleEditAvatar = () => ElMessage.info('Tính năng đang phát triển')
const handleEditProfile = () => router.push('/update-profile');
</script>

<style scoped>
/* Page Layout matching NewFeedView */
.page-container {
  min-height: 100vh;
  background-color: #f0f2f5; /* Màu nền xám nhạt Facebook style */
  padding-top: 56px; /* Chừa khoảng trống cho Fixed Header */
}

.profile-view {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 16px; /* Tăng padding để tách biệt với Header */
}

.skeleton-padding {
  padding: 30px;
  background: white;
  border-radius: 16px;
}

/* Profile Info Card */
.profile-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  border: 1px solid #e4e6eb;
  overflow: hidden;
}

.profile-info-wrapper {
  padding: 32px 32px 24px;
}

.info-main-row {
  display: flex;
  gap: 32px;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  background: #f0f2f5;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info-text {
  flex: 1;
}

.name-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #050505;
}

.verified-icon {
  color: #1877f2;
  font-size: 24px;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.username {
  font-size: 16px;
  color: #65676b;
  font-weight: 500;
}

.dot-separator {
  color: #65676b;
}

.bio-text {
  margin: 12px 0 0;
  font-size: 16px;
  color: #050505;
  line-height: 1.4;
}

.bio-text.empty {
  color: #8a8d91;
  font-style: italic;
}

.edit-profile-btn {
  font-weight: 600;
  padding: 10px 20px;
}

/* Tabs */
.tabs-container {
  padding: 0 16px;
  border-top: 1px solid #e4e6eb;
}

.custom-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.custom-tabs :deep(.el-tabs__item) {
  height: 60px;
  font-weight: 600;
  color: #65676b;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #0866ff;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Content Area */
.profile-content

.info-card {
  border-radius: 12px;
  border: none;
}

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 20px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.tab-content-fade {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Mobile */
@media (max-width: 768px) {
  .profile-view {
    padding: 16px 8px;
  }
  .info-main-row {
    flex-direction: column;
    text-align: center;
  }
  .name-badge-row, .user-meta {
    justify-content: center;
  }
  .action-area, .edit-profile-btn {
    width: 100%;
  }
}
</style>