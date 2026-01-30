import type { User } from "./user.model.ts";

export interface Post {
  id: number;
  image: string;
  caption: string;
  create_at: Date;
  user_id: number;
  liked: boolean;
  likes: number;
  media_type: string;
  user: User;
  comments: {
    id: number
    text: string
    user: {
      username: string
      profile_image: string
    }
  }[]
}
