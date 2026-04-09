"use client";

import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string; // e.g. "like this post" | "add a comment"
}

export default function LoginModal({
  isOpen,
  onClose,
  reason = "continue",
}: LoginModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 bg-background rounded-2xl border border-foreground/10 shadow-2xl p-8 flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <LockClosedIcon className="w-6 h-6 text-blue-500" />
        </div>

        <div className="text-center space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight">Login Required</h2>
          <p className="text-sm text-foreground/50">
            You need to be logged in to {reason}.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-1">
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200"
          >
            Log In
          </button>
          <button
            onClick={() => router.push("/register")}
            className="w-full rounded-xl border-2 border-foreground/10 bg-background/50 px-6 py-3 text-sm font-semibold text-foreground/70 hover:bg-foreground/5 transition-all duration-200"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
