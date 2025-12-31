<template>
  <div class="page-container">
    <Header />
    
    <main class="feed-layout">
      <div class="feed-content">
        <section class="create-section">
          <PostCreate />
        </section>

        <section class="list-section">
          <PostList feedType="for_you" />
        </section>
      </div>
    </main>
  </div>
</template>
<script setup>
import Header from '@/components/layout/Header.vue';
import PostCreate from '@/components/post/PostCreate.vue';
import PostList from '@/components/post/PostList.vue';
</script>
<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f0f2f5; 
  padding-top: 56px; 
}

.feed-layout {
  padding: 24px 16px;
  display: flex;
  justify-content: center;
}

.feed-content {
  width: 100%;
  max-width: 680px; 
  display: flex;
  flex-direction: column;
  gap: 16px; 
}


.create-section, .list-section {
  animation: slideInUp 0.5s ease-out both;
}

.list-section {
  animation-delay: 0.1s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .feed-layout {
    padding: 16px 0; 
  }
  
  .feed-content {
    gap: 8px;
  }
}
</style>
