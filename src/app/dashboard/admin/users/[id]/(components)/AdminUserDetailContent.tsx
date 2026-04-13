"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Avatar, Badge, PostStatusBadge } from "../../../(_components)";
import BackButton from "./BackButton";
import { useInlineEditOptimisticUser } from "@/hooks/useInlineEditOptimisticUser";
import { EditableField } from "@/components/EditableField";
import { useInlineEditOptimistic } from "@/hooks/useInlineEditOptimistic";
import { Check, X, Eye, Trash2 } from "lucide-react";
import { PostSkeleton } from "../../../posts/(components)/PostSkeleton";

interface Post {
  id: string;
  title: string;
  published: boolean;
  createdAt: Date;
  _count: { likes: number };
  author: {
    name: string | null;
  };
}

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
  aiTokens: number;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    posts: number;
    likes: number;
    messages: number;
  };
  posts: Post[];
}

interface AdminUserDetailContentProps {
  user: UserDetail;
}

export default function AdminUserDetailContent({
  user: initialUser,
}: AdminUserDetailContentProps) {
  const [user, setUser] = useState(initialUser);
  const [loadingField, setLoadingField] = useState<
    "name" | "email" | "aiTokens" | null
  >(null);
  const [posts, setPosts] = useState<Post[]>(initialUser.posts);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);

  // Name editing
  const nameEdit = useInlineEditOptimisticUser({
    initialValue: user.name || "",
    onSave: async (value) => {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update name");
      }

      const result = await response.json();
      const updatedUser = result.data || result;
      setUser((prev) => ({ ...prev, name: updatedUser.name }));
    },
  });

  // Email editing
  const emailEdit = useInlineEditOptimisticUser({
    initialValue: user.email,
    onSave: async (value) => {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update email");
      }

      const result = await response.json();
      const updatedUser = result.data || result;
      setUser((prev) => ({ ...prev, email: updatedUser.email }));
    },
  });

  // AI Tokens editing
  const aiTokensEdit = useInlineEditOptimisticUser({
    initialValue: user.aiTokens.toString(),
    onSave: async (value) => {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error("AI Tokens must be a valid non-negative number");
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiTokens: numValue }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update AI Tokens");
      }

      const result = await response.json();
      const updatedUser = result.data || result;
      setUser((prev) => ({ ...prev, aiTokens: updatedUser.aiTokens }));
    },
  });

  const handleNameSave = useCallback(async () => {
    setLoadingField("name");
    try {
      await nameEdit.handleSave();
    } finally {
      setLoadingField(null);
    }
  }, [nameEdit]);

  const handleEmailSave = useCallback(async () => {
    setLoadingField("email");
    try {
      await emailEdit.handleSave();
    } finally {
      setLoadingField(null);
    }
  }, [emailEdit]);

  const handleAiTokensSave = useCallback(async () => {
    setLoadingField("aiTokens");
    try {
      await aiTokensEdit.handleSave();
      toast.success("AI Tokens updated!");
    } finally {
      setLoadingField(null);
    }
  }, [aiTokensEdit]);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton href="/dashboard/admin/users" />

      {/* User Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Avatar name={user.name} email={user.email || ""} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Editable Name */}
              <div
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                onDoubleClick={() => nameEdit.handleEdit()}
                title="Double-click to edit name"
              >
                {nameEdit.isSaving ? (
                  <div className="animate-pulse">
                    <div className="h-7 bg-gray-300 dark:bg-slate-700 rounded w-48" />
                  </div>
                ) : nameEdit.isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={nameEdit.inputRef}
                      type="text"
                      value={nameEdit.value}
                      onChange={(e) => nameEdit.setValue(e.target.value)}
                      onKeyDown={nameEdit.handleKeyDown}
                      className="text-2xl font-bold bg-transparent text-gray-900 dark:text-white border border-blue-500 rounded px-2 py-1 max-w-sm"
                    />
                    <button
                      onClick={handleNameSave}
                      disabled={nameEdit.isSaving}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={nameEdit.handleCancel}
                      disabled={nameEdit.isSaving}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name || "Unknown User"}
                  </h1>
                )}
              </div>

              <Badge variant={user.role === "admin" ? "danger" : "secondary"}>
                {user.role === "admin" ? "Admin" : "User"}
              </Badge>
            </div>

            {/* Editable Email */}
            <div
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 px-2 py-1 rounded transition-colors inline-block mb-4"
              onDoubleClick={() => emailEdit.handleEdit()}
              title="Double-click to edit email"
            >
              {emailEdit.isSaving ? (
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-64" />
                </div>
              ) : emailEdit.isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={emailEdit.inputRef}
                    type="email"
                    value={emailEdit.value}
                    onChange={(e) => emailEdit.setValue(e.target.value)}
                    onKeyDown={emailEdit.handleKeyDown}
                    className="bg-transparent text-gray-600 dark:text-gray-400 border border-blue-500 rounded px-2 py-1 max-w-sm"
                  />
                  <button
                    onClick={handleEmailSave}
                    disabled={emailEdit.isSaving}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={emailEdit.handleCancel}
                    disabled={emailEdit.isSaving}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              )}
            </div>

            {emailEdit.error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                {emailEdit.error}
              </p>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {user._count.posts}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {user._count.likes}
          </p>
        </div>
        <div
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          onDoubleClick={() => aiTokensEdit.handleEdit()}
          title="Double-click to edit AI Tokens"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">AI Tokens</p>
          {aiTokensEdit.isSaving || loadingField === "aiTokens" ? (
            <div className="animate-pulse mt-2">
              <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-16" />
            </div>
          ) : aiTokensEdit.isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={aiTokensEdit.inputRef}
                type="number"
                min="0"
                value={aiTokensEdit.value}
                onChange={(e) => aiTokensEdit.setValue(e.target.value)}
                onKeyDown={aiTokensEdit.handleKeyDown}
                className="text-2xl font-bold bg-transparent text-gray-900 dark:text-white border border-blue-500 rounded px-2 py-1 w-24"
              />
              <button
                onClick={handleAiTokensSave}
                disabled={aiTokensEdit.isSaving}
                className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded"
              >
                <Check className="w-5 h-5 text-green-600" />
              </button>
              <button
                onClick={aiTokensEdit.handleCancel}
                disabled={aiTokensEdit.isSaving}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {user.aiTokens}
            </p>
          )}
          {aiTokensEdit.error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {aiTokensEdit.error}
            </p>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Posts ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No posts created</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) =>
              loadingPostId === post.id ? (
                <PostSkeleton key={post.id} />
              ) : (
                <UserPostCard
                  key={post.id}
                  post={post}
                  userId={user.id}
                  isEditing={editingPostId === post.id}
                  onEditingChange={setEditingPostId}
                  onPostUpdateStart={() => setLoadingPostId(post.id)}
                  onPostUpdate={(updatedPost) => {
                    setLoadingPostId(null);
                    setPosts((prevPosts) =>
                      prevPosts.map((p) =>
                        p.id === updatedPost.id ? updatedPost : p,
                      ),
                    );
                  }}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface AdminUserDetailContentProps {
  user: UserDetail;
}

interface UserPostCardProps {
  post: Post;
  userId: string;
  isEditing: boolean;
  onEditingChange: (id: string | null) => void;
  onPostUpdateStart: () => void;
  onPostUpdate: (updatedPost: Post) => void;
}

function UserPostCard({
  post,
  userId,
  isEditing,
  onEditingChange,
  onPostUpdateStart,
  onPostUpdate,
}: UserPostCardProps) {
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
          <div className="text-center">
            <div className="text-base font-bold text-blue-400">
              {post._count.likes}
            </div>
            <div className="text-xs text-foreground/40">Likes</div>
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
      </div>
    </div>
  );
}
