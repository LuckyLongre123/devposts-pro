"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PostDisplay({ initialPost }: { initialPost: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(initialPost);

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    // Create the promise
    const deletePromise = fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      {
        method: "DELETE",
      },
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/posts");
    });

    // Fire the toast
    toast.promise(deletePromise, {
      loading: "Deleting post...",
      success: "Post deleted successfully!",
      error: "Could not delete post.",
    });
  };

  // --- SAVE LOGIC ---
  const handleSave = async () => {
    // Create the promise
    const savePromise = fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      {
        method: "PUT",
        body: JSON.stringify(post),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then((json) => {
        setPost(json);
        setIsEditing(false);
      });

    // Fire the toast
    toast.promise(savePromise, {
      loading: "Saving changes...",
      success: "Changes saved!",
      error: "Failed to save changes.",
    });
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* ... rest of your UI code stays the same ... */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/posts"
          className="text-sm text-foreground/50 hover:text-foreground"
        >
          <span className="text-blue-500">←</span> Back
        </Link>

        <div className="flex gap-4">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-bold text-blue-500 hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-bold text-red-500 hover:underline cursor-pointer"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={handleSave}
              className="rounded-full bg-blue-500 px-4 py-1 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      <article className="space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
          Post ID: {post.id}
        </span>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
          {isEditing ? (
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full bg-transparent border-none p-0 outline-none focus:ring-0 text-inherit font-inherit"
            />
          ) : (
            post.title
          )}
        </h1>

        <div className="h-px w-20 bg-foreground/20" />

        <div className="text-lg leading-relaxed text-foreground/80">
          {isEditing ? (
            <textarea
              rows={6}
              value={post.body}
              onChange={(e) => setPost({ ...post, body: e.target.value })}
              className="w-full resize-none bg-foreground/5 rounded-xl border-none p-4 outline-none focus:ring-1 focus:ring-blue-500/20 text-inherit font-inherit"
            />
          ) : (
            post.body
          )}
        </div>
      </article>
    </main>
  );
}
