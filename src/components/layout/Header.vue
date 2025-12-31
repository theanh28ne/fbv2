<template>
  <header class="header">
    <div class="header-container">
      <!-- Left: Logo & Search -->
      <div class="header-left">
        <div class="logo">
          <span class="logo-text">f</span>
        </div>
        <div class="search-desktop">
          <el-input
            v-model="searchQuery"
            placeholder="Tìm kiếm trên Facebook"
            class="facebook-search"
            :prefix-icon="Search"
          />
        </div>
        <!-- Mobile Search Icon -->
        <div class="search-mobile">
          <el-icon :size="20"><Search /></el-icon>
        </div>
      </div>

      <!-- Center: Navigation -->
      <nav class="nav-center">
        <div class="nav-items">
          <div
            v-for="item in navItems"
            :key="item.name"
            class="nav-item"
            :class="{ 'nav-item-active': activeTab === item.name }"
            @click="handleNavClick(item)"
          >
            <el-icon :size="28">
              <component :is="activeTab === item.name ? item.activeIcon : item.icon" />
            </el-icon>
            <!-- Active Indicator -->
            <div v-if="activeTab === item.name" class="nav-indicator"></div>
            <!-- Tooltip -->
            <div class="nav-tooltip">{{ item.label }}</div>
          </div>
        </div>
      </nav>

      <!-- Right: Action Icons & Profile -->
      <div class="header-right">
        <!-- Notifications -->
        <div class="icon-button">
          <el-icon :size="20"><Bell /></el-icon>
          <span class="badge">9+</span>
        </div>

        <!-- Avatar with Multi-level Menu -->
        <el-dropdown trigger="click" popper-class="fb-dropdown-popper">
          <div class="avatar-wrapper">
            <el-avatar
              :size="40"
              :src="authStore.currentUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.currentUser?.username}`"
              class="avatar"
            >
              {{ authStore.currentUser?.name?.charAt(0) || 'U' }}
            </el-avatar>
            <!-- Small arrow icon indicator -->
            <div class="avatar-arrow">
              <el-icon :size="8"><ArrowDownBold /></el-icon>
            </div>
          </div>
          
          <template #dropdown>
            <el-dropdown-menu class="dropdown-menu">
              <!-- Profile Link Section -->
              <div class="profile-section" @click="router.push('/profile')">
                <div class="profile-content">
                  <el-avatar :size="36" :src="authStore.currentUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.currentUser?.username}`">
                    {{ authStore.currentUser?.name?.charAt(0) || 'U' }}
                  </el-avatar>
                  <span class="profile-name">{{ authStore.currentUser?.name || 'User' }}</span>
                </div>
                <div class="profile-link">Xem trang cá nhân</div>
              </div>

              <!-- Main Menu Items -->
              <el-dropdown-item class="fb-menu-item">
                <template #default>
                  <div class="menu-item-content">
                    <div class="menu-item-left">
                      <div class="menu-icon">
                        <el-icon :size="20"><Setting /></el-icon>
                      </div>
                      <span>Cài đặt & quyền riêng tư</span>
                    </div>
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                </template>
              </el-dropdown-item>

              <el-dropdown-item class="fb-menu-item">
                <template #default>
                  <div class="menu-item-content">
                    <div class="menu-item-left">
                      <div class="menu-icon">
                        <el-icon :size="20"><QuestionFilled /></el-icon>
                      </div>
                      <span>Trợ giúp & hỗ trợ</span>
                    </div>
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                </template>
              </el-dropdown-item>

              <el-dropdown-item class="fb-menu-item">
                <template #default>
                  <div class="menu-item-content">
                    <div class="menu-item-left">
                      <div class="menu-icon">
                        <el-icon :size="20"><Moon /></el-icon>
                      </div>
                      <span>Màn hình & trợ năng</span>
                    </div>
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                </template>
              </el-dropdown-item>

              <el-dropdown-item class="fb-menu-item" @click="handleLogout">
                <template #default>
                  <div class="menu-item-left">
                    <div class="menu-icon">
                      <el-icon :size="20"><SwitchButton /></el-icon>
                    </div>
                    <span>Đăng xuất</span>
                  </div>
                </template>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search,
  HomeFilled,
  UserFilled,
  Bell,
  Setting,
  QuestionFilled,
  Moon,
  SwitchButton,
  ArrowRight,
  ArrowDownBold
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter() // Thêm dòng này
const searchQuery = ref('')
const activeTab = ref('home')
const authStore = useAuthStore()

const navItems = [
  { name: 'home', label: 'Trang chủ', icon: HomeFilled, activeIcon: HomeFilled, path: '/feed' },
  { name: 'profile', label: 'Trang cá nhân', icon: UserFilled, activeIcon: UserFilled, path: '/profile' }
]

const handleNavClick = (item: typeof navItems[0]) => {
  activeTab.value = item.name
  router.push(item.path)
}

const handleLogout = async () => {
  console.log('Logging out...')
  await authStore.logout()
  router.push('/login')
}

// Sync activeTab with current route
const syncActiveTab = () => {
  const currentPath = route.path
  const item = navItems.find(item => item.path === currentPath)
  if (item) {
    activeTab.value = item.name
  }
}

// Watch route changes
watch(() => route.path, syncActiveTab)

// Sync on mount
onMounted(syncActiveTab)
</script>

<style scoped>
/* Header */
.header {
  position: fixed;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid #dadde1;
  background-color: #ffffff;
  padding: 4px 0;
  color: #050505;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-container {
  margin: 0 auto;
  display: flex;
  height: 56px;
  max-width: 1920px;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 0 16px;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.logo {
  display: flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #0866ff;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.search-desktop {
  position: relative;
  display: block;
}

.search-mobile {
  display: none;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f2f5;
  color: #65676b;
}

@media (max-width: 640px) {
  .search-desktop {
    display: none;
  }
  
  .search-mobile {
    display: flex;
  }
}

/* Center Navigation */
.nav-center {
  display: none;
  height: 100%;
  flex: 1;
  justify-content: center;
}

@media (min-width: 1024px) {
  .nav-center {
    display: flex;
  }
}

.nav-items {
  display: flex;
  height: 100%;
  width: 100%;
  max-width: 400px;
  align-items: center;
}

.nav-item {
  position: relative;
  display: flex;
  height: 100%;
  flex: 1;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  color: #65676b;
}

.nav-item:hover {
  background-color: #f0f2f5;
  border-radius: 8px;
}

.nav-item-active {
  color: #0866ff;
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  width: 100%;
  background-color: #0866ff;
}

.nav-tooltip {
  position: absolute;
  bottom: -40px;
  z-index: 10;
  display: none;
  border-radius: 4px;
  background-color: #1c1e21;
  padding: 4px 8px;
  font-size: 12px;
  color: white;
}

.nav-item:hover .nav-tooltip {
  display: block;
}

/* Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: flex-end;
}

.icon-button {
  position: relative;
  display: flex;
  height: 40px;
  width: 40px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e4e6eb;
  transition: background-color 0.2s;
  color: #050505;
}

.icon-button:hover {
  background-color: #d8dadf;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  height: 16px;
  width: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ef4444;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

/* Avatar */
.avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.avatar {
  border: 1px solid #dadde1;
}

.avatar-arrow {
  position: absolute;
  right: -4px;
  bottom: -4px;
  display: flex;
  height: 16px;
  width: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e4e6eb;
  border: 2px solid #ffffff;
  color: #050505;
}

/* Dropdown Menu */
.dropdown-menu {
  width: 360px;
  background-color: #ffffff;
  padding: 8px;
  border: 1px solid #dadde1;
}

.profile-section {
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
  cursor: pointer;
}

.profile-section:hover {
  background-color: #f0f2f5;
}

.profile-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-name {
  font-weight: 600;
  color: #050505;
}

.profile-link {
  margin-top: 8px;
  border-top: 1px solid #dadde1;
  padding-top: 8px;
  font-size: 14px;
  color: #0866ff;
}

.menu-item-content {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  color: #050505;
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  display: flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e4e6eb;
}

/* Customizing Element Plus Input */
:deep(.facebook-search .el-input__wrapper) {
  background-color: #f0f2f5;
  box-shadow: none;
  border-radius: 20px;
  padding-left: 12px;
}

:deep(.facebook-search .el-input__inner) {
  color: #050505;
}

:deep(.facebook-search .el-input__inner::placeholder) {
  color: #65676b;
}

:deep(.facebook-search .el-input__icon) {
  color: #65676b;
}

/* Customizing Dropdown Menu */
:deep(.fb-menu-item) {
  padding: 8px !important;
  border-radius: 8px !important;
  color: #050505 !important;
  margin-bottom: 2px;
}

:deep(.fb-menu-item:hover) {
  background-color: #f0f2f5 !important;
}

/* Popper styling */
:global(.fb-dropdown-popper.el-popper) {
  background-color: #ffffff !important;
  border: 1px solid #dadde1 !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
}

:global(.fb-dropdown-popper .el-popper__arrow::before) {
  background-color: #ffffff !important;
  border: 1px solid #dadde1 !important;
}
</style>