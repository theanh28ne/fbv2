import { postService } from "@/services/post";
import { CreatePostRequest, FeedType, Pagination, Post } from "@/types/post";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePostStore = defineStore("post", () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<Pagination | null>(null);
  const currentFeedType = ref<FeedType>("for_you");

  async function fetchFeed(
    feedType: FeedType = "for_you",
    page: number = 1,
    append: boolean = false
  ) {
    loading.value = true;
    error.value = null;

    try {
      const response = await postService.getFeed(feedType, page);

      if (append) {
        posts.value = [...posts.value, ...response.data];
      } else {
        posts.value = response.data;
      }
      pagination.value = response.pagination;
      currentFeedType.value = feedType;
    } catch (err: any) {
      error.value = err.message || "Không thể tải bài đăng";
      console.error("Failed to fetch feed:", err);
    } finally {
      loading.value = false;
    }
  }
  async function createPost(data: CreatePostRequest) {
    loading.value = true;
    error.value = null;

    console.log("Calling postService.createPost...", data);

    try {
      const response = await postService.createPost(data);

      console.log("Response from service:", response);

      if (response.success && response.data) {
        posts.value = [response.data, ...posts.value];
        return response;
      }

      throw new Error(response.message || "Không thể tạo bài đăng");
    } catch (err: any) {
      console.error("Error in createPost:", err);
      error.value = err.message || "Không thể tạo bài đăng";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deletePost(postId: number) {
    loading.value = true;
    error.value = null;

    console.log(`📤 Calling postService.deletePost for ID: ${postId}...`);

    try {
      const response = await postService.deletePost(postId);

      console.log("📥 Response from service:", response);

      if (response.success) {
        posts.value = posts.value.filter((post) => post.id !== postId);
        return response;
      }

      throw new Error(response.message || "Không thể xóa bài viết");
    } catch (err: any) {
      console.error("❌ Error in deletePost:", err);
      error.value = err.message || "Có lỗi xảy ra khi xóa bài viết";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    posts,
    loading,
    error,
    pagination,
    currentFeedType,
    fetchFeed,
    createPost,
    deletePost,
  };
});
