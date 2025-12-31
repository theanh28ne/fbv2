export interface User {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  is_private: boolean;
  verified: boolean;
  email?: string;
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
}

export type UserResponse =
  | {
      success: true;
      data: User;
    }
  | {
      success: false;
      message: string;
    };
