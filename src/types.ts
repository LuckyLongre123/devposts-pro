import z from "zod";
import {
  contactSchema,
  postSchema,
  profileSchema,
  signInSchema,
  signUpSchema,
} from "./utils/zod/schemas";

export type SignUpType = z.infer<typeof signUpSchema>;

export type SignInType = z.infer<typeof signInSchema>;

export type ProfileType = z.infer<typeof profileSchema>;

export type ContactType = z.infer<typeof contactSchema>;

export type PostDataType = z.infer<typeof postSchema>;

// types/index.ts (ya jahan bhi PostType hai)
export type PostType = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  thumbnailUrl?: string | null; // Optional thumbnail URL
  createdAt: string;
  updatedAt: string;
  hasLiked?: boolean;
  likesCount?: number;
  author?: {
    // ← yeh add karo
    id: string;
    name: string;
  };
  _count?: {
    likes: number;
  };
};

export type UserType = {
  id: string | null;
  name: string | null;
  email: string | null;
  aiTokens: number | null;
  role?: "user" | "admin" | null;
};
