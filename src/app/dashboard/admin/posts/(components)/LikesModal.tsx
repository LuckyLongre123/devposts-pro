"use client";

import React, { useEffect, useState } from "react";
import { X, User, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../../(_components)";

interface UserLiked {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
}

export default function LikesModal({
  isOpen,
  onClose,
  postId,
  postTitle,
}: LikesModalProps) {
  const [users, setUsers] = useState<UserLiked[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && postId) {
      const fetchLikes = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/admin/posts/${postId}/likes`);
          if (!response.ok) throw new Error("Failed to load likes");
          const data = await response.json();
          setUsers(data.users || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLikes();
    }
  }, [isOpen, postId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-foreground/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Liked By</h2>
            <p className="text-xs text-foreground/50 line-clamp-1">{postTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-foreground/50 font-medium">Fetching users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-500/5 rounded-xl border border-red-500/10 mb-2">
              <p className="text-sm text-red-500 font-medium">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onClose()}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-foreground/40 italic">No likes yet for this post.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user) => (
                <Link 
                  key={user.id} 
                  href={`/dashboard/admin/users/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-blue-500 transition-colors">
                      {user.name || "Anonymous User"}
                    </p>
                    <p className="text-xs text-foreground/40 line-clamp-1">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-foreground/20 group-hover:text-blue-500 transition-all">
                    <ExternalLink className="w-4 h-4 translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-foreground/5 bg-foreground/[0.02]">
          <p className="text-[10px] text-center text-foreground/30 uppercase tracking-widest font-bold">
            Total Likes: {users.length}
          </p>
        </div>
      </div>
    </div>
  );
}
