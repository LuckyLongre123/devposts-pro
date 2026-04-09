"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { SendIcon } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface CommentsSectionProps {
  postId: string;
  currentUserId?: string; // undefined if not logged in
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

// ── Zod schema ───────────────────────────────────────────────────────────────

const commentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long (max 500 chars)"),
});
type CommentFormData = z.infer<typeof commentSchema>;

// ── Single comment card ───────────────────────────────────────────────────────

function CommentCard({
  comment,
  currentUserId,
  onDelete,
}: {
  comment: Comment;
  currentUserId?: string;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId && currentUserId === comment.author.id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    setIsDeleting(true);
    onDelete(comment.id);
  };

  return (
    <div
      className={`group flex gap-3 p-4 rounded-xl border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-200 ${isDeleting ? "opacity-40" : ""}`}
    >
      {/* Avatar */}
      <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
        {comment.author.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">
              {comment.author.name}
            </span>
            <span className="text-[10px] font-medium text-foreground/30 uppercase tracking-wider">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-500/10 text-foreground/30 hover:text-red-500 transition-all duration-200 disabled:cursor-wait"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="mt-1 text-sm text-foreground/80 leading-relaxed break-words">
          {comment.body}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CommentsSection({
  postId,
  currentUserId,
  isAuthenticated,
  onAuthRequired,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: "" },
  });

  const bodyValue = watch("body", "");

  // ── textarea ref merge (react-hook-form + auto-resize) ──
  const { ref: registerRef, ...restRegister } = register("body");

  // ── Fetch comments ────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(data.data || []);
      } catch {
        toast.error("Could not load comments");
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (formData: CommentFormData) => {
      if (!isAuthenticated) {
        onAuthRequired();
        return;
      }

      // Optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        body: formData.body,
        createdAt: new Date().toISOString(),
        author: { id: currentUserId!, name: "You" },
      };

      setComments((prev) => [optimisticComment, ...prev]);
      reset();

      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: formData.body }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to post comment");

        // Replace optimistic with real
        setComments((prev) =>
          prev.map((c) => (c.id === optimisticComment.id ? data.data : c)),
        );
      } catch (err: any) {
        toast.error(err.message || "Failed to post comment");
        setComments((prev) =>
          prev.filter((c) => c.id !== optimisticComment.id),
        );
      }
    },
    [postId, isAuthenticated, currentUserId, onAuthRequired, reset],
  );

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    async (commentId: string) => {
      // Optimistic removal
      setComments((prev) => prev.filter((c) => c.id !== commentId));

      try {
        const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          toast.error("Failed to delete comment");
          // Re-fetch to restore state
          const refetch = await fetch(`/api/posts/${postId}/comments`);
          const data = await refetch.json();
          setComments(data.data || []);
        } else {
          toast.success("Comment deleted");
        }
      } catch {
        toast.error("Something went wrong");
      }
    },
    [postId],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="mt-12 pt-8 border-t border-foreground/5 space-y-6">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon className="w-5 h-5 text-foreground/40" />
        <h2 className="text-base font-bold tracking-tight">
          Comments{" "}
          <span className="text-foreground/30 font-normal text-sm ml-1">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* Compose box */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="relative">
            <textarea
              {...restRegister}
              ref={(el) => {
                registerRef(el);
                bodyRef.current = el;
              }}
              rows={3}
              placeholder="Write a comment..."
              disabled={isSubmitting}
              maxLength={500}
              className="w-full rounded-xl border-2 border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm placeholder:text-foreground/30 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none disabled:opacity-60"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground/30">
              {bodyValue.length}/500
            </div>
          </div>

          {errors.body && (
            <p className="text-xs text-red-500">{errors.body.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !bodyValue.trim()}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <SendIcon className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        /* Guest nudge */
        <button
          onClick={onAuthRequired}
          className="w-full py-4 rounded-xl border-2 border-dashed border-foreground/10 text-sm text-foreground/40 hover:border-blue-500/30 hover:text-blue-500 hover:bg-blue-500/5 transition-all duration-200"
        >
          Login to leave a comment →
        </button>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-foreground/5 animate-pulse"
            />
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-foreground/30 text-center py-8">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
