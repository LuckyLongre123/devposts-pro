"use client";
import { useState } from "react";
import { HeartIcon } from "lucide-react";

export default function PostLikeSection({ postId, initialLikes, onRestrictedAction }: any) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (onRestrictedAction()) return; // Login check logic

    // Optimistic Update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);

    // Call API (Assuming you have a /like route)
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      <button 
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          isLiked ? "bg-red-500/10 text-red-500" : "bg-foreground/5 hover:bg-foreground/10"
        }`}
      >
        <HeartIcon className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="font-bold">{likes}</span>
      </button>
      <p className="text-sm text-foreground/40 font-medium">Click to show appreciation</p>
    </div>
  );
}