"use client";

import { useState, useCallback } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

export default function LikeButton({
  postId,
  initialLikes,
  initialLiked,
  isAuthenticated,
  onAuthRequired,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        // Revert on failure
        setLiked(prevLiked);
        setLikesCount(prevCount);
        toast.error("Failed to update like");
      }
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [postId, liked, likesCount, isAuthenticated, isLoading, onAuthRequired]);

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium
        ${
          liked
            ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
            : "bg-foreground/5 border-foreground/10 text-foreground/50 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500"
        }
        ${isLoading ? "opacity-60 cursor-wait" : "cursor-pointer"}
      `}
    >
      {liked ? (
        <HeartSolidIcon
          className={`w-4 h-4 transition-transform ${isLoading ? "animate-pulse" : "group-hover:scale-110"}`}
        />
      ) : (
        <HeartIcon
          className={`w-4 h-4 transition-transform ${isLoading ? "animate-pulse" : "group-hover:scale-110"}`}
        />
      )}
      <span>{likesCount}</span>
    </button>
  );
}