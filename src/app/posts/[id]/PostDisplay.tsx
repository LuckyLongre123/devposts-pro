"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "@/utils/zod/schemas";
import { PostDataType, PostType } from "@/types";
import {
  SendIcon,
  FileTextIcon,
  X,
  RefreshCw,
  AlignLeftIcon,
  Hash,
  Clock,
  ChevronRight,
  PenIcon,
  Trash2Icon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  UserIcon,
  EyeIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import MarkdownRenderer from "../../../../components/MarkdownRenderer";
import {
  DeleteOverlay,
  getCharMeta,
  LIMITS,
  ProgressBar,
  StatPill,
} from "../../../../components/post/PostComponents";

// ─── Constants ─────────────────────────────────────────────────────────────────

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const readingTime = (s: string) => Math.max(1, Math.round(wordCount(s) / 200));

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PostDisplay({
  initialPost,
}: {
  initialPost: PostType;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(initialPost);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"deleting" | "redirecting">(
    "deleting",
  );

  const isRequesting = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PostDataType>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: { title: initialPost.title, body: initialPost.body },
  });

  const watchedTitle = watch("title", initialPost.title);
  const watchedBody = watch("body", initialPost.body);

  const titleLen = watchedTitle?.length || 0;
  const bodyLen = watchedBody?.length || 0;

  const user = useAuthStore((st) => st.user);
  const isOwner = user?.id === initialPost?.author?.id;

  const isAnyBusy =
    isRequesting.current || isTogglingPublish || isSubmitting || isDeleting;

  // ── All original logic — untouched ───────────────────────────────────────

  const togglePublish = useCallback(async () => {
    if (isRequesting.current || isSubmitting || isDeleting) {
      toast.error("Please wait for current operation to complete");
      return;
    }
    setIsTogglingPublish(true);
    isRequesting.current = true;
    try {
      const response = await fetch(
        `/api/posts/${post.id}/publish?published=${!post.published}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } },
      );
      const data = await response.json();
      if (!response.ok || !data?.success)
        throw new Error(data.message || "Failed to update");
      setPost(data.data);
      toast.success("Status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    } finally {
      setIsTogglingPublish(false);
      isRequesting.current = false;
    }
  }, [post.id, post.published, isSubmitting, isDeleting]);

  const onSubmit = useCallback(
    async (data: PostDataType) => {
      if (isRequesting.current || isTogglingPublish || isDeleting) {
        toast.error("Please wait for current operation to complete");
        return;
      }
      isRequesting.current = true;
      try {
        const response = await fetch(`/api/posts/${post.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.message || "Failed to save");
        setPost(resData.data);
        setIsEditing(false);
        toast.success("Saved");
      } catch (error: any) {
        toast.error(error.message || "Error saving post");
      } finally {
        isRequesting.current = false;
      }
    },
    [post.id, isTogglingPublish, isDeleting],
  );

  const handleDelete = useCallback(async () => {
    if (
      isRequesting.current ||
      isTogglingPublish ||
      isSubmitting ||
      isDeleting
    ) {
      toast.error("Please wait for current operation to complete");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    setDeleteStatus("deleting");
    isRequesting.current = true;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete");

      setDeleteStatus("redirecting");
      toast.success("Post deleted successfully");
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/dashboard/posts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
      setIsDeleting(false);
      setDeleteStatus("deleting");
      isRequesting.current = false;
    }
  }, [post.id, router, isTogglingPublish, isSubmitting, isDeleting]);

  // ── UI ────────────────────────────────────────────────────────────────────

  const titleMeta = getCharMeta(titleLen, LIMITS.TITLE_MIN, LIMITS.TITLE);
  const bodyMeta = getCharMeta(bodyLen, LIMITS.BODY_MIN, LIMITS.BODY);

  return (
    <div className="min-h-screen bg-background">
      {/* Delete overlay */}
      {isDeleting && <DeleteOverlay status={deleteStatus} />}

      {/* ── Sticky Navbar ── */}
      <div className="sticky top-0 z-20 border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Back */}
          <button
            onClick={() => {
              if (isDeleting) {
                toast.error("Please wait, post is being deleted");
                return;
              }
              router.back();
            }}
            className={`flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors shrink-0 ${isDeleting ? "pointer-events-none opacity-30" : ""}`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Go Back</span>
          </button>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {!isEditing && (
                <>
                  {/* Publish toggle */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-foreground/5 rounded-lg border border-foreground/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hidden xs:inline">
                      {post.published ? "Live" : "Draft"}
                    </span>
                    <button
                      onClick={togglePublish}
                      disabled={isAnyBusy}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${
                        post.published
                          ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                          : "bg-foreground/20"
                      } ${isAnyBusy ? "cursor-wait opacity-60" : "cursor-pointer"}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          post.published ? "translate-x-5" : "translate-x-1"
                        } ${isTogglingPublish ? "animate-pulse" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Edit */}
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={isAnyBusy}
                    title="Edit post"
                    className="p-2 rounded-lg text-foreground/50 hover:text-blue-500 hover:bg-blue-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <PenIcon className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    disabled={isAnyBusy}
                    title="Delete post"
                    className={`p-2 rounded-lg text-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${isDeleting ? "animate-pulse" : ""}`}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <main className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10">
        {/* ── READ MODE ── */}
        {!isEditing && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Post meta header */}
            <div className="border-l-4 border-blue-500 pl-4 sm:pl-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Published badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    post.published
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {post.published ? (
                    <>
                      <EyeIcon className="h-3 w-3" /> Published
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-3 w-3" /> Draft
                    </>
                  )}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {post.title}
              </h1>

              {/* Author + date row */}
              <div className="flex items-start sm:items-center gap-3 pt-1">
                <div className="h-8 w-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                  {initialPost?.author?.name?.charAt(0).toUpperCase() || "D"}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-foreground/80 truncate">
                    {initialPost?.author?.name || "DevNotes User"}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground/35">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3 shrink-0" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-foreground/20 hidden sm:inline-block" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      {readingTime(post.body)} min read
                    </span>
                    <span className="h-1 w-1 rounded-full bg-foreground/20 hidden sm:inline-block" />
                    <span className="font-mono hidden sm:inline">
                      #{post.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap items-center gap-2">
              <StatPill
                icon={<Hash className="h-3 w-3" />}
                value={wordCount(post.body)}
                label="words"
              />
              <StatPill
                icon={<Clock className="h-3 w-3" />}
                value={readingTime(post.body)}
                label="min read"
              />
              <StatPill
                icon={<AlignLeftIcon className="h-3 w-3" />}
                value={post.body.split("\n").filter(Boolean).length}
                label="paragraphs"
              />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-foreground/5" />

            {/* Rendered markdown content */}
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={post.body} />
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-foreground/5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-foreground/25">
              <span className="leading-relaxed">
                Last modified: {new Date(post.updatedAt).toLocaleString()}
              </span>
              {isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isAnyBusy}
                  className="flex items-center gap-1.5 text-foreground/30 hover:text-blue-400 transition-colors normal-case text-xs font-semibold tracking-normal disabled:pointer-events-none shrink-0"
                >
                  <PenIcon className="h-3.5 w-3.5" /> Edit this post
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {isEditing && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Edit mode header */}
            <div className="border-l-4 border-amber-500 pl-4 sm:pl-5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Edit Post
              </h2>
              <p className="mt-1 text-sm text-foreground/40">
                Make your changes below — unsaved edits will be lost if you
                cancel.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* ── Title ── */}
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/80 shrink-0">
                    <FileTextIcon className="h-4 w-4 text-blue-500" />
                    Title
                    <span className="text-[10px] font-normal text-foreground/30 uppercase tracking-wider hidden xs:inline">
                      required
                    </span>
                  </label>
                  <span
                    className={`text-xs font-mono transition-colors shrink-0 ${titleMeta.text} ${isSubmitting ? "opacity-30" : ""}`}
                  >
                    {titleLen}/{LIMITS.TITLE}
                  </span>
                </div>

                <input
                  {...register("title")}
                  disabled={isSubmitting}
                  placeholder="What's the headline of your story?"
                  maxLength={LIMITS.TITLE}
                  className={`w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-foreground placeholder:text-foreground/25 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                />

                <ProgressBar
                  len={titleLen}
                  min={LIMITS.TITLE_MIN}
                  max={LIMITS.TITLE}
                />

                {errors.title && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <X className="h-3 w-3" /> {errors.title.message}
                  </p>
                )}
              </section>

              {/* ── Body ── */}
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/80 shrink-0">
                    <AlignLeftIcon className="h-4 w-4 text-blue-500" />
                    Content
                    <span className="text-[10px] font-normal text-foreground/30 uppercase tracking-wider hidden xs:inline">
                      markdown
                    </span>
                  </label>
                  <span
                    className={`text-xs font-mono transition-colors shrink-0 ${bodyMeta.text} ${isSubmitting ? "opacity-30" : ""}`}
                  >
                    {bodyLen}/{LIMITS.BODY}
                  </span>
                </div>

                {/* Markdown hint chips */}
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 flex-wrap ${isSubmitting ? "opacity-30" : ""}`}
                >
                  {[
                    "**bold**",
                    "*italic*",
                    "# H1",
                    "```code```",
                    "> quote",
                    "- list",
                  ].map((hint) => (
                    <code
                      key={hint}
                      className="text-[11px] px-2 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/40 font-mono"
                    >
                      {hint}
                    </code>
                  ))}
                </div>

                <textarea
                  {...register("body")}
                  rows={14}
                  disabled={isSubmitting}
                  placeholder="Write your thoughts here… Markdown is supported."
                  maxLength={LIMITS.BODY}
                  className={`w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 sm:px-5 py-4 text-sm text-foreground placeholder:text-foreground/25 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all resize-y font-mono leading-relaxed ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                />

                <ProgressBar
                  len={bodyLen}
                  min={LIMITS.BODY_MIN}
                  max={LIMITS.BODY}
                />

                {errors.body && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <X className="h-3 w-3" /> {errors.body.message}
                  </p>
                )}
              </section>

              {/* ── Action bar ── */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-5 sm:pt-6 border-t border-foreground/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-foreground/10 text-sm font-semibold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>

                <div className="hidden sm:block flex-1" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <style jsx global>{`
        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
