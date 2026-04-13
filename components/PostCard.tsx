"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ImagePlus } from "lucide-react"; // ✅ Lucide se Heart icon import kiya
import SignInModal from "./SignInModal";
import { PostType } from "@/types";
import toast from "react-hot-toast";
import {
  DEFAULT_THUMBNAIL,
  THUMBNAIL_ASPECT_CLASS,
} from "@/constants/thumbnails";
import { useAuthStore } from "@/store/useAuthStore";

export default function PostCard({
  post,
  isLoggedIn,
  isAdmin,
}: {
  post: PostType;
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    post.thumbnailUrl &&
      post.thumbnailUrl !== "null" &&
      post.thumbnailUrl.trim() !== ""
      ? post.thumbnailUrl
      : DEFAULT_THUMBNAIL,
  );

  const user = useAuthStore((st) => st.user);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const likesCount = post._count?.likes ?? 0;
  const canEditThumbnail =
    isAdmin || (isLoggedIn && post.author?.id === user?.id);

  const handleThumbnailClick = () => {
    if (canEditThumbnail) {
      fileInputRef.current?.click();
    }
  };
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleDoubleClick = () => {
    if (!canEditThumbnail) return;

    if (clickTimeout.current) {
      // Double click detected
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      handleThumbnailClick();
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
      }, 250); // 250ms window
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/posts/${post.id}/thumbnail`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload thumbnail");
      }

      const data = await response.json();
      setThumbnailUrl(data.thumbnailUrl);
      toast.success("Thumbnail updated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploadingThumbnail(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <article className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5">
        {/* Thumbnail Section */}
        <div className="relative w-full">
          {isUploadingThumbnail ? (
            <div
              className={`${THUMBNAIL_ASPECT_CLASS} bg-foreground/5 animate-pulse`}
            />
          ) : (
            <div
              className={`relative ${THUMBNAIL_ASPECT_CLASS} overflow-hidden bg-foreground/5 ${
                canEditThumbnail ? "cursor-pointer" : ""
              }`}
              onClick={handleDoubleClick}
            >
              <Image
                src={thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA6O9LhgAAAABJRU5ErkJggg=="
              />

              {/* Edit Icon Overlay */}
              {canEditThumbnail && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImagePlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploadingThumbnail}
          />
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between">
              <Link href={post.author?.id ?? "/posts"}>
                <span className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                  @{post.author?.name ?? "Unknown"}
                </span>
              </Link>
              {isAdmin && (
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    post.published
                      ? "text-green-500 bg-green-500/10"
                      : "text-amber-500 bg-amber-500/10"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors line-clamp-2">
              {post.title}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-foreground/70 line-clamp-3">
              {post.body.replace(/[#*]/g, "")}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-foreground/5 pt-4">
            {/* ✅ Left side: Date AND Likes Count */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              {/* Naya Likes UI */}
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground/60 transition-colors hover:text-red-500 cursor-default">
                <Heart
                  className={`h-3.5 w-3.5 ${likesCount > 0 ? "fill-red-500 text-red-500" : "text-foreground/40"}`}
                />
                {likesCount}
              </span>
            </div>

            {/* Right side: Read Link */}
            {isLoggedIn ? (
              <Link
                href={`/posts/${post.id}`}
                className="text-sm font-semibold text-foreground hover:translate-x-1 transition-transform inline-flex items-center gap-2"
              >
                Read <span className="text-blue-500">→</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="text-sm font-semibold text-foreground hover:translate-x-1 transition-transform inline-flex items-center gap-2"
              >
                Read <span className="text-blue-500">→</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {showModal && (
        <SignInModal postId={post.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
