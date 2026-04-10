"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react"; // ✅ Lucide se Heart icon import kiya
import SignInModal from "./SignInModal";
import { PostType } from "@/types";
import {
  DEFAULT_THUMBNAIL,
  THUMBNAIL_ASPECT_CLASS,
} from "@/constants/thumbnails";

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

  const thumbnailUrl =
    post.thumbnailUrl &&
    post.thumbnailUrl !== "null" &&
    post.thumbnailUrl.trim() !== ""
      ? post.thumbnailUrl
      : DEFAULT_THUMBNAIL;

  // ✅ Likes count nikalna
  const likesCount = post._count?.likes ?? 0;

  return (
    <>
      <article className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5">
        {/* Thumbnail Section */}
        <div
          className={`relative w-full ${THUMBNAIL_ASPECT_CLASS} overflow-hidden bg-foreground/5`}
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
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/50">
                {post.author?.name ?? "Unknown"}
              </span>
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
