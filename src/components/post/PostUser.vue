<template>
  <div class="post-list-container">
    <div v-if="loading && posts.length === 0" class="skeleton-wrapper">
      <el-card v-for="i in 3" :key="i" shadow="never" class="skeleton-card">
        <el-skeleton animated>
          <template #template>
            <div class="skeleton-header">
              <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
              <div class="skeleton-header-text">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="text" style="width: 20%" />
              </div>
            </div>
            <el-skeleton-item variant="p" style="margin-top: 16px; width: 90%" />
            <el-skeleton-item variant="p" style="width: 60%" />
            <el-skeleton-item variant="image" style="margin-top: 16px; height: 250px; border-radius: 8px" />
          </template>
        </el-skeleton>
      </el-card>
    </div>
    
    <template v-else>
      <div class="feed-wrapper">
        <PostCard 
      v-for="post in posts" 
      :key="post.id" 
      :post="post" 
      :show-delete="true"
      @delete="handleConfirmDelete" 
    />
      </div>
      
      <div ref="loadMoreTrigger" class="load-more-area">
        <div v-if="loading && posts.length > 0" class="loading-more">
          <el-icon class="is-loading" :size="20">
            <Loading />
          </el-icon>
          <span>Đang tải thêm nội dung...</span>
        </div>
        
        <div v-else-if="!hasMore && posts.length > 0" class="no-more">
          <el-divider>
            <span class="no-more-text">Bạn đã xem hết bài viết</span>
          </el-divider>
        </div>
      </div>
    </template>
    
    <div v-if="error" class="error-container">
      <el-alert
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="custom-alert"
      />
    </div>
    
    <div v-if="!loading && posts.length === 0 && !error" class="empty-container">
      <el-empty 
        description="Chưa có bài viết nào để hiển thị" 
        :image-size="120"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { usePostStore } from '@/stores/post'
import { Loading } from '@element-plus/icons-vue'
import PostCard from './PostCard.vue'
import type { FeedType } from '@/types/post'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  feedType?: FeedType
}>()

const postStore = usePostStore()
const loadMoreTrigger = ref<HTMLElement | null>(null)

// --- BƯỚC 1: LẤY USER ID TỪ LOCALSTORAGE ---
const getLocalUserId = () => {
  const userRaw = localStorage.getItem('user') // Giả sử key lưu là 'user'
  if (!userRaw) return null
  try {
    const user = JSON.parse(userRaw)
    return user.id
  } catch (e) {
    console.error("Lỗi parse user từ localStorage", e)
    return null
  }
}

const currentUserId = getLocalUserId()

const posts = computed(() => {
  if (!postStore.posts) return []
  if (!currentUserId) return [] 

  return postStore.posts.filter(post => {
    // Ép kiểu về Number để so sánh chính xác tuyệt đối
    return Number(post.user_id) === Number(currentUserId)
  })
})

const loading = computed(() => postStore.loading)
const error = computed(() => postStore.error)
const pagination = computed(() => postStore.pagination)


const hasMore = computed(() => {
  if (!pagination.value) return false
  return pagination.value.current_page < pagination.value.last_page
})

let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (!loadMoreTrigger.value) return
  if (observer) observer.disconnect()
  
  observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0]
      if (firstEntry.isIntersecting && hasMore.value && !loading.value) {
        loadMore()
      }
    },
    { threshold: 0.1, rootMargin: '200px' }
  )
  observer.observe(loadMoreTrigger.value)
}

const loadMore = async () => {
  if (!pagination.value || !hasMore.value) return
  const nextPage = pagination.value.current_page + 1
  await postStore.fetchFeed(props.feedType || 'for_you', nextPage, true)
}

const handleConfirmDelete = (postId: number) => {
  ElMessageBox.confirm('Bài viết sẽ bị xóa vĩnh viễn. Tiếp tục?', 'Cảnh báo', {
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(async () => {
    try {
      // Gọi hàm từ store
      const response = await postStore.deletePost(postId);

      if (response && response.success) {
        ElMessage.success(response.message || "Đã xóa bài viết thành công");
      }
    } catch (err: any) {
      // Bắt lỗi từ throw err ở Store
      ElMessage.error(err.message || "Có lỗi xảy ra khi xóa");
      console.error("Delete error:", err);
    }
  }).catch(() => {
    // User nhấn "Hủy" - không cần làm gì cả
  });
};

onMounted(async () => {
  await postStore.fetchFeed(props.feedType || 'for_you')
  await nextTick()
  setupIntersectionObserver()
})

watch(loadMoreTrigger, async () => {
  await nextTick()
  setupIntersectionObserver()
})

watch(() => props.feedType, async (newType) => {
  if (newType) {
    await postStore.fetchFeed(newType)
    await nextTick()
    setupIntersectionObserver()
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.post-list-container {
  width: 100%;
  max-width: 680px; /* Độ rộng tối ưu cho Newsfeed */
  margin: 0 auto;
}

/* Skeleton Styling */
.skeleton-card {
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid #e4e6eb;
  padding: 12px;
}

.skeleton-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.skeleton-header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Feed Item Spacing */
.feed-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Khoảng cách giữa các bài viết */
}

.feed-item {
  animation: slideUp 0.4s ease-out;
}

/* Load More Area */
.load-more-area {
  padding: 24px 0 40px;
  min-height: 80px;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #65676b;
  font-size: 14px;
}

.no-more {
  padding: 0 20px;
}

.no-more-text {
  color: #8a8d91;
  font-size: 14px;
  font-weight: 500;
}

/* Alerts & States */
.error-container, .empty-container {
  padding: 40px 0;
}

.custom-alert {
  border-radius: 12px;
}

.is-loading {
  animation: rotating 1.5s linear infinite;
  color: #0866ff;
}

/* Animations */
@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .post-list-container {
    max-width: 100%;
  }
  
  .feed-wrapper {
    gap: 8px; 
  }
}
</style>