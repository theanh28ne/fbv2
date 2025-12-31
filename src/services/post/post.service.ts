import {
  CreatePostRequest,
  CreatePostResponse,
  FeedType,
  GetFeedResponse,
  LikeResponse,
  PostActionResponse,
} from "@/types/post";
import { postApi } from "./post.api";

export const postService = {
  /**
   * @param feedType - Loại feed: 'for_you' | 'following'
   * @param page - Số trang (mặc định: 1)
   */
  async getFeed(
    feedType: FeedType = "for_you",
    page: number = 1
  ): Promise<GetFeedResponse> {
    try {
      const response = await postApi.getFeed(feedType, page);
      return response.data;
    } catch (error) {
      console.error("Error fetching feed:", error);

      throw error;
    }
  },

  //    * @param data - Dữ liệu bài đăng
  //    */
  async createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
    try {
      const response = await postApi.createPost(data);
      console.log("Create Post Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async deletePost(postId: number): Promise<PostActionResponse> {
    try {
      const response = await postApi.deletePost(postId);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi kết nối server",
      };
    }
  },

  async toggleLike(postId: number): Promise<LikeResponse> {
    const response = await postApi.toggleLike(postId);
    return response.data;
  },
};
