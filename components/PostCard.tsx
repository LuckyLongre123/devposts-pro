// components/PostCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import SignInModal from "./SignInModal";
import { PostType } from "@/types";

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

  return (
    <>
      <article className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background p-6 transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground/50">
              {post.author?.name ?? "Unknown"}
            </span>
            {/* Published/Draft badge — sirf admin ko dikhega */}
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
            {post.body.split("#")}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-foreground/5 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          {/* Login check here */}
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
      </article>

      {/* Modal */}
      {showModal && (
        <SignInModal postId={post.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
