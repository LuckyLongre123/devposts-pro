"use client";

import { useState, useRef, useEffect } from "react";
import { PostType } from "@/types";
import {
  Share2,
  MessageCircle,
  Mail,
  Copy,
  Check,
  ChevronDown,
  Send,
  Link2,
  Globe,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  generateShareUrls,
  isWebShareAvailable,
  sharePost,
  generatePostExcerpt,
} from "@/lib/og-generator";

interface ShareButtonProps {
  post: PostType;
  variant?: "icon" | "button" | "compact";
  className?: string;
}

export default function ShareButton({
  post,
  variant = "compact",
  className = "",
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasWebShare = isWebShareAvailable();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareUrls = generateShareUrls(post);
  const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/posts/${post.id}`;

  const handleNativeShare = async () => {
    const success = await sharePost(post);
    if (success) {
      toast.success("Shared successfully! 🎉");
      setShowMenu(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success("Link copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const openShareLink = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
    setShowMenu(false);
    toast.success("Opening share dialog...");
  };

  const handleToggleMenu = () => {
    if (!post.published) {
      toast.error("Publish the post to share");
      return;
    }
    setShowMenu(!showMenu);
  };

  // Platform configurations
  const platforms = [
    {
      name: "Facebook",
      icon: Share2,
      url: shareUrls.facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: ExternalLink,
      url: shareUrls.twitter,
      color: "hover:text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Link2,
      url: shareUrls.linkedin,
      color: "hover:text-blue-700",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: shareUrls.whatsapp,
      color: "hover:text-green-500",
    },
    {
      name: "Telegram",
      icon: Send,
      url: shareUrls.telegram,
      color: "hover:text-sky-400",
    },
    {
      name: "Email",
      icon: Mail,
      url: shareUrls.email,
      color: "hover:text-amber-500",
    },
    {
      name: "Reddit",
      icon: Globe,
      url: shareUrls.reddit,
      color: "hover:text-orange-500",
    },
  ];

  if (variant === "icon") {
    // Minimalist icon button
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleToggleMenu}
          className={`p-2 rounded-lg text-foreground/60 transition-colors ${className} ${
            !post.published
              ? "opacity-40 cursor-not-allowed"
              : "hover:text-blue-500 hover:bg-blue-500/10"
          }`}
          title={
            !post.published ? "Publish the post to share" : "Share this post"
          }
          aria-label="Share post"
        >
          <Share2 size={20} />
        </button>

        {/* Share Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-foreground/10 bg-background shadow-lg shadow-blue-500/10 p-2 z-50">
            {hasWebShare && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500/10 text-foreground text-sm font-medium transition-colors"
              >
                <Share2 size={18} className="text-blue-500" />
                Share via...
              </button>
            )}

            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => openShareLink(platform.url)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/5 text-foreground/70 text-sm font-medium transition-colors"
              >
                <platform.icon size={18} className={platform.color} />
                {platform.name}
              </button>
            ))}

            <div className="border-t border-foreground/5 my-1" />

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/5 text-foreground/70 text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} className="text-foreground/40" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === "button") {
    // Full button variant
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={handleToggleMenu}
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-foreground/10 bg-background text-foreground font-medium transition-all ${className} ${
            !post.published
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
          }`}
        >
          <Share2 size={18} className="text-blue-500" />
          Share
          <ChevronDown
            size={16}
            className={`transition-transform ${showMenu ? "rotate-180" : ""}`}
          />
        </button>

        {/* Share Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-foreground/10 bg-background shadow-lg shadow-blue-500/10 p-2 z-50">
            {hasWebShare && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500/10 text-foreground text-sm font-medium transition-colors"
              >
                <Share2 size={18} className="text-blue-500" />
                Share with system menu
              </button>
            )}

            <div
              className={hasWebShare ? "border-t border-foreground/5 my-1" : ""}
            />

            <div className="grid grid-cols-3 gap-1 p-2">
              {platforms.slice(0, 3).map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => openShareLink(platform.url)}
                  title={platform.name}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-foreground/5 transition-colors group"
                >
                  <platform.icon
                    size={20}
                    className={`text-foreground/60 group-hover:text-blue-500 transition-colors`}
                  />
                  <span className="text-xs text-foreground/50 group-hover:text-foreground/70">
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1 p-2 border-t border-foreground/5">
              {platforms.slice(3).map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => openShareLink(platform.url)}
                  title={platform.name}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-foreground/5 transition-colors group"
                >
                  <platform.icon
                    size={20}
                    className={`text-foreground/60 group-hover:text-blue-500 transition-colors`}
                  />
                  <span className="text-xs text-foreground/50 group-hover:text-foreground/70">
                    {platform.name}
                  </span>
                </button>
              ))}

              <button
                onClick={handleCopyLink}
                title="Copy link"
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-foreground/5 transition-colors group"
              >
                {copied ? (
                  <>
                    <Check size={20} className="text-green-500" />
                    <span className="text-xs text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy
                      size={20}
                      className="text-foreground/60 group-hover:text-blue-500 transition-colors"
                    />
                    <span className="text-xs text-foreground/50 group-hover:text-foreground/70">
                      Copy
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact variant (default)
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggleMenu}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${className} ${
          !post.published
            ? "text-foreground/40 opacity-50 cursor-not-allowed"
            : "text-foreground/70 hover:text-blue-500 hover:bg-blue-500/5"
        }`}
      >
        <Share2 size={16} />
        Share
      </button>

      {/* Compact Share Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-screen max-w-xs rounded-xl border border-foreground/10 bg-background shadow-lg shadow-blue-500/10 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-foreground/5 bg-foreground/[0.02]">
            <h3 className="text-sm font-semibold text-foreground">
              Share "{post.title.substring(0, 30)}..."
            </h3>
            <p className="text-xs text-foreground/50 mt-1 line-clamp-2">
              {generatePostExcerpt(post.body, 80)}
            </p>
          </div>

          {/* Quick Share Buttons */}
          {hasWebShare && (
            <div className="px-4 py-3 border-b border-foreground/5">
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-medium text-sm transition-colors"
              >
                <Share2 size={16} />
                Share with system menu
              </button>
            </div>
          )}

          {/* Platform Grid */}
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => openShareLink(platform.url)}
                  title={platform.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-foreground/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                >
                  <platform.icon
                    size={24}
                    className="text-foreground/60 group-hover:text-blue-500 transition-colors"
                  />
                  <span className="text-xs text-foreground/50 group-hover:text-foreground/70 text-center">
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 mt-3 px-3 py-2 rounded-lg border border-foreground/10 hover:border-foreground/20 text-foreground/70 hover:text-foreground font-medium text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-500">Link copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
