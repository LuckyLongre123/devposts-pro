"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getAllPosts,
  searchPosts,
  updatePostStatus,
  deletePost,
  PostWithStats,
} from "../(_lib)/posts";
import {
  SearchInput,
  Button,
  ConfirmDialog,
  Alert,
  PostStatusBadge,
} from "../(_components)";
import { Trash2, Eye, Copy, Check, ChevronDown } from "lucide-react";
import PostStatusModal from "./(components)/PostStatusModal";
import LikesModal from "./(components)/LikesModal";
import { EditableField } from "@/components/EditableField";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { useInlineEditOptimistic } from "@/hooks/useInlineEditOptimistic";
import { PostSkeleton } from "./(components)/PostSkeleton";

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<"published" | "draft" | "all">("all");
  const [error, setError] = useState<string | null>(null);

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likesPost, setLikesPost] = useState<{ id: string; title: string } | null>(null);

  const [selectedPost, setSelectedPost] = useState<PostWithStats | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (
      page: number,
      search: string,
      filterStatus: "published" | "draft" | "all",
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = search
          ? await searchPosts(search, page, 10)
          : await getAllPosts(page, 10, filterStatus);
        setPosts(data.posts);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load posts";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    loadPosts(1, "", status);
  }, [loadPosts, status]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      loadPosts(1, query, status);
    },
    [loadPosts, status],
  );

  const handleStatusChange = async (postId: string, published: boolean) => {
    try {
      setIsSubmitting(true);
      await updatePostStatus(postId, published);
      toast.success(`Post ${published ? "published" : "unpublished"}`);
      loadPosts(currentPage, searchQuery, status);
      setIsStatusModalOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    try {
      setIsSubmitting(true);
      await deletePost(selectedPost.id);
      toast.success("Post deleted successfully");
      loadPosts(currentPage, searchQuery, status);
      setDeleteConfirmOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete post";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikesClick = (id: string, title: string) => {
    setLikesPost({ id, title });
    setIsLikesModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Post Management
        </h1>
        <p className="text-foreground/60">
          Manage all posts, edit titles, and control publication status.
        </p>
      </div>

      {/* Errors */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onReload={() => loadPosts(currentPage, searchQuery, status)}
            isLoading={isLoading}
            placeholder="Search by title..."
          />
        </div>
        <div className="relative group w-full md:w-48">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "published" | "draft" | "all")
            }
            className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-foreground/10 bg-foreground/[0.03] dark:bg-foreground/[0.05] text-foreground text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-foreground/[0.08] hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          >
            <option value="all" className="bg-background text-foreground">All Posts</option>
            <option value="published" className="bg-background text-foreground">Published</option>
            <option value="draft" className="bg-background text-foreground">Draft</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40 group-hover:text-blue-500 transition-colors duration-300">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-12 text-center">
          <p className="text-foreground/60">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) =>
            loadingPostId === post.id ? (
              <PostSkeleton key={post.id} />
            ) : (
              <PostCard
                key={post.id}
                post={post}
                onStatusChange={() => {
                  setSelectedPost(post);
                  setIsStatusModalOpen(true);
                }}
                onDelete={() => {
                  setSelectedPost(post);
                  setDeleteConfirmOpen(true);
                }}
                onLikesClick={() => handleLikesClick(post.id, post.title)}
                onEditingChange={setEditingPostId}
                isEditing={editingPostId === post.id}
                onPostUpdate={(updatedPost) => {
                  setLoadingPostId(null);
                  // Optimistic update: replace only the specific post
                  setPosts((prevPosts) =>
                    prevPosts.map((p) =>
                      p.id === updatedPost.id ? updatedPost : p,
                    ),
                  );
                }}
                onPostUpdateStart={() => setLoadingPostId(post.id)}
              />
            ),
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => loadPosts(currentPage - 1, searchQuery, status)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <div className="px-4 py-2 text-foreground/70">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => loadPosts(currentPage + 1, searchQuery, status)}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedPost && (
        <>
          <PostStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            post={selectedPost}
            onStatusChange={handleStatusChange}
            isLoading={isSubmitting}
          />

          <ConfirmDialog
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleDeletePost}
            title="Delete Post"
            description={`Are you sure you want to delete "${selectedPost.title}"? This action cannot be undone.`}
            confirmText="Delete Post"
            isDanger
            isLoading={isSubmitting}
          />
        </>
      )}

      {likesPost && (
        <LikesModal
          isOpen={isLikesModalOpen}
          onClose={() => setIsLikesModalOpen(false)}
          postId={likesPost.id}
          postTitle={likesPost.title}
        />
      )}
    </div>
  );
}

interface PostCardProps {
  post: PostWithStats;
  onStatusChange: () => void;
  onDelete: () => void;
  onLikesClick: () => void;
  onEditingChange: (id: string | null) => void;
  isEditing: boolean;
  onPostUpdate: (updatedPost: PostWithStats) => void;
  onPostUpdateStart: () => void;
}

function PostCard({
  post,
  onStatusChange,
  onDelete,
  onLikesClick,
  onEditingChange,
  isEditing,
  onPostUpdate,
  onPostUpdateStart,
}: PostCardProps) {
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
    // Return updated post with new title
    const updatedPost = { ...post, title: newTitle };
    onPostUpdate(updatedPost);
  });

  React.useEffect(() => {
    onEditingChange(titleEdit.isEditing ? post.id : null);
  }, [titleEdit.isEditing, post.id, onEditingChange]);

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden hover:border-foreground/20 transition-all group">
      <div className="p-5 space-y-3">
        {/* Title with Inline Edit */}
        <div className="space-y-2">
          <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
            Title
          </div>
          <EditableField
            value={titleEdit.value}
            isEditing={titleEdit.isEditing}
            isSaving={titleEdit.isSaving}
            error={titleEdit.error}
            onDoubleClick={() => titleEdit.setIsEditing(true)}
            onSave={titleEdit.handleSave}
            onCancel={titleEdit.handleCancel}
            onChange={titleEdit.setValue}
            onKeyDown={titleEdit.handleKeyDown}
            inputRef={titleEdit.inputRef}
            maxLength={200}
            displayClassName="text-lg font-semibold text-foreground line-clamp-2"
          />
        </div>

        {/* Author & Metadata */}
        <div className="space-y-2 pt-3 border-t border-foreground/10">
          <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
            Author
          </div>
          <p className="text-sm text-foreground/70">{post.author.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-foreground/10">
          <div
            className="text-center cursor-pointer hover:bg-foreground/5 rounded-lg py-1 transition-colors"
            onClick={onLikesClick}
            title="View users who liked this post"
          >
            <div className="text-base font-bold text-blue-400">
              {post._count.likes}
            </div>
            <div className="text-xs text-foreground/40 font-medium uppercase tracking-tighter">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-base font-bold text-pink-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-foreground/40">Created</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-3 border-t border-foreground/10">
          <PostStatusBadge published={post.published} />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <Link href={`/posts/${post.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium transition-colors">
              <Eye className="w-4 h-4" />
              View
            </button>
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onStatusChange}
            className="flex-1 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm font-medium transition-colors"
          >
            {post.published ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
