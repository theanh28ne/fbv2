import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  FeedType,
  GetFeedResponse,
  LikeResponse,
  PostActionResponse,
} from "@/types/post";
import api from "../api";
export const postApi = {
  getFeed(feedType: FeedType, page: number) {
    return api.get<GetFeedResponse>("/api/posts/feed", {
      params: {
        type: feedType,
        page,
      },
    });
  },

  createPost(data: CreatePostRequest) {
    console.log("Creating post with data:", data);
    return api.post<CreatePostResponse>("/api/posts", data);
  },

  deletePost: (postId: number) => {
    // Body truyền _method: DELETE để bypass hạn chế phương thức của một số Server
    return api
      .post(`/api/posts/${postId}`, { _method: "DELETE" })
      .then((res) => res.data);
  },

  toggleLike(postId: number) {
    return api.post<LikeResponse>(`/api/posts/${postId}/like`);
  },
};
