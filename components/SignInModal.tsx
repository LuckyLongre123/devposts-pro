// components/SignInModal.tsx
"use client";

import { X } from "lucide-react";
import Link from "next/link";

export default function SignInModal({
  postId,
  onClose,
}: {
  postId: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-8 shadow-2xl mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
            <span className="text-2xl">🔒</span>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Sign in to Read More
          </h2>
          <p className="text-sm text-foreground/60">
            Create a free account or sign in to access the full post.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            href={`/signin?redirect=/posts/${postId}`}
            className="flex w-full items-center justify-center rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href={`/signup?redirect=/posts/${postId}`}
            className="flex w-full items-center justify-center rounded-xl border-2 border-foreground/10 py-3 text-sm font-semibold text-foreground/70 hover:border-foreground/20 hover:text-foreground transition-colors"
          >
            Create Account
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-foreground/40">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
}
