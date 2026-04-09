"use client";
import { useState } from "react";
import { MessageSquareIcon, SendIcon } from "lucide-react";

export default function CommentSection({
  postId,
  isAuthenticated,
  onRestrictedAction,
}: any) {
  const [comment, setComment] = useState("");

  const postComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRestrictedAction()) return;

    // Post API logic here
    console.log("Posting:", comment);
    setComment("");
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="w-5 h-5 text-blue-500" />
        <h3 className="text-xl font-bold">Comments</h3>
      </div>

      <form onSubmit={postComment} className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            isAuthenticated
              ? "Share your thoughts..."
              : "Login to join the discussion"
          }
          className="w-full rounded-2xl border-2 border-foreground/10 bg-background/50 p-4 pr-12 focus:border-blue-500 focus:outline-none transition-all"
          rows={3}
        />
        <button
          type="submit"
          className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-xl hover:scale-110 transition-transform"
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-4">
        {/* Render comments list here */}
        <p className="text-center text-foreground/30 py-8 italic">
          No comments yet. Be the first!
        </p>
      </div>
    </section>
  );
}
