<template>
  <el-card class="post-card" shadow="hover" :body-style="{ padding: '16px' }">
    <div class="post-header">
      <router-link :to="`/profile/${post.user.username}`" class="avatar-link">
        <el-avatar :size="40" :src="post.user.avatar_url">
          {{ post.user.name.charAt(0) }}
        </el-avatar>
      </router-link>

      <div class="user-info">
        <div class="user-name-row">
          <router-link :to="`/profile/${post.user.id}`" class="user-name">
            {{ post.user.name }}
            <el-icon v-if="post.user.verified" color="#1d9bf0" :size="18">
              <svg viewBox="0 0 22 22" fill="currentColor">
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
              </svg>
            </el-icon>
          </router-link>
          <span class="username">@{{ post.user.username }}</span>
        </div>
        <el-text class="post-time" size="small" type="info">
          {{ formatTime(post.created_at) }}
        </el-text>
      </div>
    </div>

    <router-link :to="`/post/${post.id}`" class="content-link">
      <div class="post-content">
        <el-text class="post-text">{{ post.content }}</el-text>
        
        <div v-if="post.media_urls && post.media_urls.length > 0" class="media-grid">
          <el-image 
            v-for="(url, index) in post.media_urls" 
            :key="index"
            :src="url" 
            fit="cover"
            class="media-image"
            :preview-src-list="post.media_urls"
            :initial-index="index"
          />
        </div>
        
        <el-card v-if="post.is_quote && post.original_post" class="quote-card" shadow="never">
          <div class="quote-header">
            <el-avatar :size="24" :src="post.original_post.user.avatar_url">
              {{ post.original_post.user.name.charAt(0) }}
            </el-avatar>
            <el-text size="small">
              <strong>{{ post.original_post.user.name }}</strong>
              <span class="username">@{{ post.original_post.user.username }}</span>
            </el-text>
          </div>
          <el-text size="small" class="quote-content">
            {{ post.original_post.content }}
          </el-text>
        </el-card>
      </div>
    </router-link>

    <div class="post-actions">
      <el-button text @click.stop="handleComment" class="action-btn">
        <el-icon><ChatDotRound /></el-icon>
        <span>{{ post.replies_count }}</span>
      </el-button>

      <el-button text @click.stop="handleRepost" class="action-btn">
        <el-icon><Refresh /></el-icon>
        <span>{{ post.reposts_and_quotes_count }}</span>
      </el-button>

      <LikeButton 
        :post-id="post.id"
        :is-liked="post.is_liked_by_auth"
        :likes-count="post.likes_count"
      />

      <template v-if="showDelete">
        <el-button 
          text 
          type="danger"
          @click.stop="handleDelete"
          class="action-btn delete-btn"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </template>
      
      <template v-else>
        <el-button 
          text 
          @click.stop="handleShare"
          class="action-btn"
        >
          <el-icon><Share /></el-icon>
        </el-button>
      </template>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChatDotRound, Refresh, Share, Delete } from '@element-plus/icons-vue'
import LikeButton from './LikeButton.vue'
import type { Post } from '@/types/post'

const props = defineProps<{
  post: Post,
  showDelete?: boolean 
}>()

const emit = defineEmits<{
  (e: 'delete', postId: number): void
}>()

const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
  } catch {
    return dateString
  }
}

const handleComment = () => console.log('Comment on post:', props.post.id)
const handleRepost = () => console.log('Repost:', props.post.id)
const handleShare = () => console.log('Share post:', props.post.id)
const handleDelete = () => emit('delete', props.post.id)
</script>

<style scoped>
.post-card {
  margin-bottom: 1px;
  border-radius: 16px;
  transition: background-color 0.2s;
}

.post-card:hover {
  background-color: var(--el-fill-color-light);
}

.post-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-name {
  font-weight: bold;
  color: var(--el-text-color-primary);
  text-decoration: none;
}

.user-name:hover {
  text-decoration: underline;
}

.username {
  color: var(--el-text-color-secondary);
}

.content-link {
  text-decoration: none;
  color: inherit;
}

.post-text {
  display: block;
  line-height: 1.5;
  white-space: pre-wrap;
  margin-bottom: 12px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
}

.media-image {
  width: 100%;
  height: 250px;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  max-width: 448px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.delete-btn:hover {
  color: var(--el-color-danger) !important;
  background-color: var(--el-color-danger-light-9) !important;
}
</style>