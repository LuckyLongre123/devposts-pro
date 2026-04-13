"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NavLinkSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <li key={i} className="list-none">
        <div className="h-4 w-20 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md" />
      </li>
    ))}
  </>
);

const AuthSkeleton = ({ isAdmin }: { isAdmin?: boolean }) => (
  <div className="flex items-center gap-6">
    {/* Avatar Skeleton */}
    <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse shrink-0" />

    {/* Divider */}
    <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />

    {/* Admin Link Skeleton (if applicable) */}
    {isAdmin && (
      <>
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
      </>
    )}

    {/* My Posts Skeleton */}
    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

    {/* Divider */}
    <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />

    {/* Logout Skeleton */}
    <div className="h-4 w-14 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
  </div>
);

const NotAuthSkeleton = () => (
  <div className="flex items-center gap-6">
    {/* Sign In Skeleton */}
    <div className="h-4 w-14 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />

    {/* Get Started Button Skeleton */}
    <div className="h-8 w-24 bg-blue-300 dark:bg-blue-700 rounded-full animate-pulse" />
  </div>
);

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // if (pathname.includes("admin")) return null;

  // Build redirect-aware auth links — skip /signin and /signup themselves
  const shouldRedirect = pathname !== "/signin" && pathname !== "/signup";
  const redirectParam = shouldRedirect ? `?redirect=${encodeURIComponent(pathname)}` : "";
  const signinHref = `/signin${redirectParam}`;
  const signupHref = `/signup${redirectParam}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const NavLinks = () => (
    <>
      <li className="list-none">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          Home
        </Link>
      </li>
      <li className="list-none">
        <Link
          href="/posts"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          Global Posts
        </Link>
      </li>
      <li className="list-none">
        <Link
          href="/about"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          About
        </Link>
      </li>
      <li className="list-none">
        <Link
          href="/contact"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          Contact
        </Link>
      </li>
    </>
  );

  if (!mounted)
    return <header className="h-16 w-full border-b bg-background/80" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight text-foreground shrink-0">
          <Link href="/">
            DEVPOSTS<span className="text-blue-500">.</span>PRO
          </Link>
        </div>

        {/* Desktop NavLinks - Unified Font Size */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {isLoading ? <NavLinkSkeleton /> : <NavLinks />}
        </ul>

        {/* Auth Section - Optimized Structure */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Vertical Divider */}
          <div className="w-px h-5 bg-foreground/10" />

          {isLoading ? (
            isAuthenticated ? (
              <AuthSkeleton isAdmin={user?.role === "admin"} />
            ) : (
              <NotAuthSkeleton />
            )
          ) : !isAuthenticated ? (
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link
                href={signinHref}
                className="text-foreground/70 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={signupHref}
                className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6 text-sm font-medium">
              {/* Profile Avatar - Proper Circle */}
              <Link
                href="/profile"
                title="View Profile"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:ring-2 hover:ring-blue-500/20 transition-all"
              >
                <span className="text-sm font-bold uppercase">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </Link>

              {/* Vertical Divider - More Visible */}
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />

              {user?.role?.toLowerCase() === "admin" && (
                <Link
                  href="/dashboard/admin"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-blue-500 transition-colors font-bold text-blue-600 dark:text-blue-400"
                >
                  Admin
                </Link>
              )}

              <Link
                href="/dashboard/posts"
                onClick={() => setIsOpen(false)}
                className="hover:text-blue-500 transition-colors"
              >
                My Posts
              </Link>

              {/* Logout Button */}
              {isAuthenticated && (
                <button
                  onClick={() => logout()}
                  className="text-red-500 hover:text-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile: Theme toggle + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full bg-background border-b border-foreground/10 p-6 shadow-2xl">
          <ul className="flex flex-col gap-6 text-base font-medium list-none">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-5 w-24 animate-pulse bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-5 w-20 animate-pulse bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-5 w-28 animate-pulse bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-5 w-16 animate-pulse bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ) : (
              <NavLinks />
            )}

            <hr className="border-foreground/5" />

            {isLoading ? (
              isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-foreground/[0.03] rounded">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2" />
                      <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                  {user?.role === "admin" && (
                    <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  )}
                  <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="h-5 w-14 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 w-full bg-blue-300 dark:bg-blue-700 rounded animate-pulse" />
                </div>
              )
            ) : !isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={signinHref}
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 text-foreground/70"
                >
                  Sign In
                </Link>
                <Link
                  href={signupHref}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-white py-3 font-bold shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-blue-600">Account Settings</p>
                  </div>
                </Link>
                {user?.role?.toLowerCase() === "admin" && (
                  <li className="list-none">
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-blue-500 transition-colors font-semibold text-blue-600"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {isAuthenticated && (
                  <li className="list-none">
                    <Link
                      href="/dashboard/posts"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-blue-500 transition-colors"
                    >
                      My Posts
                    </Link>
                  </li>
                )}

                {/* Logout Button Mobile */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2 text-red-500 hover:text-red-600 font-medium border border-red-500/30 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
