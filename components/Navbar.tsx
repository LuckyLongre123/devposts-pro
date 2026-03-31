"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  const NavLinks = () => (
    <>
      <li>
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          About
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          onClick={() => setIsOpen(false)}
          className="hover:text-blue-500 transition-colors"
        >
          Contact
        </Link>
      </li>
      {isAuthenticated && (
        <li>
          <Link
            href="/posts"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-500 transition-colors"
          >
            My Posts
          </Link>
        </li>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight text-foreground">
          <Link href="/">
            DEVNOTES<span className="text-blue-500">.</span>PRO
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLinks />
          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/signin">Login</Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="rounded-full bg-blue-500 px-4 py-2 text-white"
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <span className="text-foreground/60 italic">
                Hi, {user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs"
              >
                Logout
              </button>
            </div>
          )}
        </ul>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="text-2xl">✕</span> // Close Icon
          ) : (
            <span className="text-2xl">☰</span> // Menu Icon
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16.25 left-0 w-full bg-background border-b border-foreground/10 p-6 shadow-xl">
          <ul className="flex flex-col gap-6 text-lg font-medium">
            <NavLinks />
            <hr className="border-foreground/5" />
            {!isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link href="/signin" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg bg-blue-500 py-3 text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="text-foreground/60">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="w-full text-center rounded-lg border border-red-500 text-red-500 py-3"
                >
                  Logout
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
