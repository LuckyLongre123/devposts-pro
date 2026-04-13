"use client";

import React, { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Mail,
  BookOpen,
  Heart,
  Calendar,
  LogIn,
  Trash2,
  Eye,
  Lock,
  Globe,
  FileText,
} from "lucide-react";
import { DEFAULT_THUMBNAIL } from "@/constants/thumbnails";
import { useInlineEditOptimistic } from "@/hooks/useInlineEditOptimistic";
import { EditableField } from "@/components/EditableField";
import { PostSkeleton } from "@/app/dashboard/admin/posts/(components)/PostSkeleton";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: {
    posts: number;
    likes: number;
  };
}

interface Post {
  id: string;
  title: string;
  body: string;
  published: boolean;
  author: { id: string; name: string | null };
  createdAt: Date;
  _count: { likes: number };
  thumbnailUrl?: string | null;
}

interface UserProfileContentProps {
  user: UserProfile;
  postsCount: number;
  isAuthor: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  currentUserId: string | null;
}

export default function UserProfileContent({
  user,
  postsCount,
  isAuthor,
  isAdmin,
  isLoggedIn,
  currentUserId,
}: UserProfileContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const redirectParam = `?redirect=${encodeURIComponent(pathname)}`;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
  const [togglingPostId, setTogglingPostId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isLoggedIn) loadPosts(1);
  }, []);

  const loadPosts = useCallback(
    async (page: number) => {
      try {
        setIsLoadingPosts(true);
        const response = await fetch(
          `/api/users/${user.id}/posts?page=${page}&limit=10&loggedIn=${isLoggedIn}`,
        );
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setPosts(data.posts || []);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error("Failed to load posts");
        console.error(error);
      } finally {
        setIsLoadingPosts(false);
      }
    },
    [user.id, isLoggedIn],
  );

  const handleDeletePost = async (postId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    )
      return;

    try {
      setIsDeleting(postId);
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete post");
      toast.success("Post deleted successfully");
      loadPosts(currentPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setIsDeleting(null);
    }
  };

  // Toggle published ↔ draft — works for admin (uses /api/admin) and author (uses /api/posts/:id/publish)
  const handleTogglePublish = async (post: Post) => {
    try {
      setTogglingPostId(post.id);
      const newPublished = !post.published;

      let response: Response;

      if (isAdmin) {
        // Admin route — no ownership check
        response = await fetch(`/api/admin/posts/${post.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ published: newPublished }),
        });
      } else {
        // Author route
        response = await fetch(
          `/api/posts/${post.id}/publish?published=${newPublished}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": currentUserId || "",
            },
          },
        );
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");

      toast.success(newPublished ? "Post published!" : "Moved to drafts");
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: newPublished } : p,
        ),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to toggle");
    } finally {
      setTogglingPostId(null);
    }
  };

  const getInitials = () => {
    if (!user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 transition-colors duration-200">
      {/* Header Band */}
      <div className="h-32 bg-blue-600/10 border-b border-foreground/10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="relative -mt-16 mb-8">
          <div className="border border-foreground/10 bg-background/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg border-4 border-background text-white">
                  {getInitials()}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                  {user.name || "User"}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  {user.role === "admin" && (
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-500">
                      <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      Admin
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthor && (
                <div className="flex gap-2">
                  <Link
                    href="/dashboard/posts"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                  >
                    My Dashboard
                  </Link>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-foreground/10">
              {[
                { label: "Posts", value: user._count.posts },
                // { label: "Likes", value: user._count.likes },
                { label: "Published", value: postsCount },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <BookOpen className="w-6 h-6 text-blue-500" />
            {isAuthor || isAdmin ? "All Posts" : "Published Posts"}
          </h2>

          {/* Not logged in gate — redirect back here after login */}
          {!isLoggedIn && (
            <div className="bg-background border border-foreground/10 rounded-2xl p-8 text-center mb-8 shadow-lg">
              <Lock className="w-16 h-16 mx-auto mb-4 text-blue-500/50" />
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Sign in to see full posts
              </h3>
              <p className="text-foreground/60 mb-6">
                Create an account or sign in to view all posts and engage with
                the community
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/signin${redirectParam}`}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href={`/signup${redirectParam}`}
                  className="px-6 py-2 bg-foreground hover:opacity-90 text-background rounded-lg transition-colors font-medium"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* Posts Grid + Pagination — only for logged-in users */}
          {isLoggedIn && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingPosts ? (
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                ) : posts.length === 0 ? (
                  <div className="col-span-full bg-background border border-foreground/10 rounded-2xl p-12 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-foreground/20" />
                    <p className="text-foreground/40">No posts yet</p>
                  </div>
                ) : (
                  posts.map((post) =>
                    loadingPostId === post.id ? (
                      <PostSkeleton key={post.id} />
                    ) : (
                      <PostCardGrid
                        key={post.id}
                        post={post}
                        isLoggedIn={isLoggedIn}
                        isAuthor={isAuthor}
                        isAdmin={isAdmin}
                        onDelete={() => handleDeletePost(post.id)}
                        isDeleting={isDeleting === post.id}
                        isEditing={editingPostId === post.id}
                        onEditingChange={setEditingPostId}
                        onPostUpdateStart={() => setLoadingPostId(post.id)}
                        onPostUpdate={(updatedPost) => {
                          setLoadingPostId(null);
                          setPosts((prev) =>
                            prev.map((p) =>
                              p.id === updatedPost.id ? updatedPost : p,
                            ),
                          );
                        }}
                        onTogglePublish={() => handleTogglePublish(post)}
                        isToggling={togglingPostId === post.id}
                      />
                    ),
                  )
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => loadPosts(currentPage - 1)}
                    disabled={currentPage === 1 || isLoadingPosts}
                    className="px-4 py-2 rounded-lg bg-background hover:bg-foreground/5 border border-foreground/10 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 text-foreground/60">
                    Page{" "}
                    <span className="text-foreground font-medium">{currentPage}</span>{" "}
                    of{" "}
                    <span className="text-foreground font-medium">{totalPages}</span>
                  </div>
                  <button
                    onClick={() => loadPosts(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoadingPosts}
                    className="px-4 py-2 rounded-lg bg-background hover:bg-foreground/5 border border-foreground/10 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PostCardGrid ──────────────────────────────────────────────────────────────

interface PostCardGridProps {
  post: Post;
  isLoggedIn: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
  onDelete: () => void;
  isDeleting: boolean;
  isEditing: boolean;
  onEditingChange: (id: string | null) => void;
  onPostUpdateStart: () => void;
  onPostUpdate: (updatedPost: Post) => void;
  onTogglePublish: () => void;
  isToggling: boolean;
}

function PostCardGrid({
  post,
  isLoggedIn,
  isAuthor,
  isAdmin,
  onDelete,
  isDeleting,
  isEditing,
  onEditingChange,
  onPostUpdateStart,
  onPostUpdate,
  onTogglePublish,
  isToggling,
}: PostCardGridProps) {
  const canEdit = isAuthor || isAdmin;

  const titleEdit = useInlineEditOptimistic(post.title, async (newTitle) => {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
    onPostUpdateStart();

    const response = await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to update title");
    }

    toast.success("Title updated!");
    onPostUpdate({ ...post, title: newTitle });
  });

  React.useEffect(() => {
    onEditingChange(titleEdit.isEditing ? post.id : null);
  }, [titleEdit.isEditing, post.id, onEditingChange]);

  if (!isLoggedIn) return null;

  return (
    <div className="border border-foreground/10 bg-background rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group shadow-sm flex flex-col">
      <div className="p-5 space-y-3 flex-1 flex flex-col">

        {/* Status Badge + Publish Toggle */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${post.published
              ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
              : "bg-foreground/5 border-foreground/10 text-foreground/40"
              }`}
          >
            {post.published ? "Published" : "Draft"}
          </span>

          {/* Publish / Draft toggle — admin or author only */}
          {canEdit && (
            <button
              onClick={onTogglePublish}
              disabled={isToggling}
              title={post.published ? "Move to Draft" : "Publish post"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all disabled:opacity-50 ${post.published
                ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                : "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                }`}
            >
              {isToggling ? (
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : post.published ? (
                <FileText className="w-3 h-3" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              {isToggling
                ? "..."
                : post.published
                  ? "Draft"
                  : "Publish"}
            </button>
          )}
        </div>

        {/* Title with Inline Edit */}
        <div className="space-y-1 flex-1">
          <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
            Title
          </div>
          <EditableField
            value={titleEdit.value}
            isEditing={titleEdit.isEditing}
            isSaving={titleEdit.isSaving}
            error={titleEdit.error}
            onDoubleClick={() => canEdit && titleEdit.setIsEditing(true)}
            onSave={titleEdit.handleSave}
            onCancel={titleEdit.handleCancel}
            onChange={titleEdit.setValue}
            onKeyDown={titleEdit.handleKeyDown}
            inputRef={titleEdit.inputRef}
            maxLength={200}
            displayClassName="text-base font-semibold text-foreground line-clamp-2"
          />
          {canEdit && !titleEdit.isEditing && (
            <p className="text-[10px] text-foreground/30">
              Double-click to edit title
            </p>
          )}
        </div>

        {/* Author */}
        <div className="space-y-1 pt-3 border-t border-foreground/10">
          <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
            Author
          </div>
          <p className="text-sm text-foreground/70">{post.author.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-foreground/10">
          <div className="text-center">
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-red-400" />
              {post._count.likes}
            </div>
            <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold mt-1">
              Likes
            </div>
          </div>
          <div className="text-center">
            <div className="text-base font-bold text-foreground">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold mt-1">
              Created
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-foreground/10">
          <Link href={`/posts/${post.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
              <Eye className="w-4 h-4" />
              View
            </button>
          </Link>
          {canEdit && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              title="Delete post"
              className="px-3 py-2 rounded-lg bg-foreground/5 hover:bg-red-500/15 hover:text-red-500 text-foreground/40 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
