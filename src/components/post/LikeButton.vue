<template>
  <button 
    class="like-btn"
    :class="{ liked: localIsLiked }"
    @click.stop="handleLike"
    :disabled="loading"
  >
    <svg 
      v-if="!localIsLiked" 
      viewBox="0 0 24 24" 
      width="18" 
      height="18" 
      fill="currentColor"
    >
      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"/>
    </svg>
    <svg 
      v-else 
      viewBox="0 0 24 24" 
      width="18" 
      height="18" 
      fill="currentColor"
      class="heart-filled"
    >
      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"/>
    </svg>
    <span :class="{ 'count-animate': animateCount }">{{ localLikesCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// import { usePostStore } from '@/stores/post'

const props = defineProps<{
  postId: number
  isLiked: boolean
  likesCount: number
}>()

// const postStore = usePostStore()

const localIsLiked = ref(props.isLiked)
const localLikesCount = ref(props.likesCount)
const loading = ref(false)
const animateCount = ref(false)

// Watch for prop changes
watch(() => props.isLiked, (newVal) => {
  localIsLiked.value = newVal
})

watch(() => props.likesCount, (newVal) => {
  localLikesCount.value = newVal
})

const handleLike = async () => {
  if (loading.value) return
  
  loading.value = true
  
  // Optimistic update
  const previousLiked = localIsLiked.value
  const previousCount = localLikesCount.value
  
  localIsLiked.value = !localIsLiked.value
  localLikesCount.value = localIsLiked.value 
    ? localLikesCount.value + 1 
    : localLikesCount.value - 1
  
  // Animate count
  animateCount.value = true
  setTimeout(() => {
    animateCount.value = false
  }, 300)
  
  try {
    // await postStore.toggleLike(props.postId)
  } catch (error) {
    // Revert on error
    localIsLiked.value = previousLiked
    localLikesCount.value = previousCount
    console.error('Failed to toggle like:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.like-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #536471;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.like-btn:hover {
  background: #f918801a;
  color: #f91880;
}

.like-btn.liked {
  color: #f91880;
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.heart-filled {
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.count-animate {
  animation: countPop 0.3s ease;
}

@keyframes countPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>