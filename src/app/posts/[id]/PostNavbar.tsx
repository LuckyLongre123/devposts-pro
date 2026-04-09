"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { PostType } from "@/types";

interface PostNavbarProps {
  post: PostType;
  setPost: (post: PostType) => void;
  isUserAuthor: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}

export default function PostNavbar({
  post,
  setPost,
  isUserAuthor,
  isEditing,
  setIsEditing,
}: PostNavbarProps) {
  const router = useRouter();

  const togglePublish = async () => {
    try {
      const res = await fetch(
        `/api/posts/${post.id}/publish?published=${!post.published}`,
        { method: "PUT" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error();
      setPost(data.data);
      toast.success(post.published ? "Moved to Drafts" : "Post Published!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-blue-500 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Author Controls: Only visible if isUserAuthor is true */}
        {isUserAuthor && !isEditing && (
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-3 px-3 py-1 bg-foreground/5 rounded-full border border-foreground/10">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                {post.published ? "Live" : "Draft"}
              </span>
              <button
                onClick={togglePublish}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${post.published ? "bg-blue-500" : "bg-foreground/20"}`}
              >
                <span
                  className={`h-3 w-3 rounded-full bg-white transition-transform ${post.published ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-blue-500/10 rounded-full text-blue-500 transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>

            <button className="p-2 hover:bg-red-500/10 rounded-full text-red-500 transition-colors">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
