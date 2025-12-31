import { User } from "./user";

export interface Post {
  id: number;
  user_id: number;
  content: string;
  parent_id: number | null;
  original_post_id: number | null;
  is_quote: boolean;
  reply_permission: string;
  requires_reply_approval: boolean;
  status: string;
  is_ghost: boolean;
  ghost_expires_at: string | null;
  topic_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  likes_count: number;
  replies_count: number;
  reposts_and_quotes_count: number;
  media_urls: string[];
  is_liked_by_auth: boolean;
  is_saved_by_auth: boolean;
  is_reposted_by_auth: boolean;
  user: User;
  original_post?: Post | null;
}
export type FeedType = "for_you" | "following" | "ghost";

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface GetFeedResponse {
  success: boolean;
  data: Post[];
  pagination: Pagination;
}

export interface LikeResponse {
  success: boolean;
  is_liked: boolean;
  likes_count: number;
}

export interface CreatePostRequest {
  content: string;
  parent_id?: number | null;
  original_post_id?: number | null;
  is_quote?: boolean;
  reply_permission?: "everyone" | "following" | "mentioned";
  requires_reply_approval?: boolean;
  is_ghost?: boolean;
  ghost_expires_at?: string | null;
  topic_id?: number | null;
  media_urls?: string[];
}

// Response types
export interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface PostActionResponse {
  success: boolean;
  message: string;
}

export interface DeletePostRequest {
  _method: string;
}
