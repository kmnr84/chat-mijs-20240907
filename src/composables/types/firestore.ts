import type { Timestamp } from "firebase/firestore";

export type User = {
  username: string;
  email: string;
  profile_picture: string;
  bio: string;
  last_login: Timestamp
};

export type Message = {
  sender_id: string;
  sender_name: string;
  message_type: 'text' | 'image' | 'video';
  content: string;
  media_url: string;
  timestamp: Timestamp;
};
