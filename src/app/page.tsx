"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center md:pt-10 md:pb-32">
        <div className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-sm font-medium transition-colors hover:bg-foreground/10">
          ✨ Introducing DevNotes Pro 1.0
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-7xl leading-tight">
          Organize your code <br />
          <span className="text-blue-500">
            {isAuthenticated
              ? `Welcome back, ${user?.name?.split(" ")[0]}`
              : "without the chaos."}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-foreground/60 md:text-xl">
          {isAuthenticated
            ? "Ready to pick up where you left off? Your snippets and project ideas are waiting for you."
            : "The ultimate workspace for developers to store snippets, documentation, and project ideas in one lightning-fast interface."}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          {isAuthenticated ? (
            <Link
              href="/posts"
              className="rounded-full bg-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-all hover:opacity-90 active:scale-95"
            >
              Get Started Free
            </Link>
          )}

          <Link
            href="/about"
            className="rounded-full border border-foreground/10 px-8 py-4 font-semibold transition-all hover:bg-foreground/5"
          >
            Learn More
          </Link>
        </div>
      </section>
    </main>
  );
}
