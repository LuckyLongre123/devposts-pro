import Link from "next/link";
import { Suspense } from "react";
import ToastHandler from "../../../../components/ToastHandler";

export const revalidate = 60;
export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 1. Get the current page from URL (default to 1)
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 9;
  const totalPosts = 100; // JSONPlaceholder fixed total
  const totalPages = Math.ceil(totalPosts / limit);

  const URL = `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${limit}`;

  let posts: any[] = [];

  try {
    const res = await fetch(URL, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    posts = await res.json();
  } catch (error) {
    // This sends the error to your error.tsx or global-error.tsx
    throw error;
  }

  // If no posts are returned, we show a simple message
  if (posts.length === 0) {
    return <div className="text-center py-20">No posts found.</div>;
  }

  return (
    <>
      <Suspense>
        <ToastHandler />
      </Suspense>
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 border-l-4 border-blue-500 pl-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Latest Articles
          </h1>
          <p className="mt-2 text-foreground/60">
            Viewing page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background p-6 transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                  Post #{post.id}
                </span>
                <h2 className="mt-3 text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/70">
                  {post.body}
                </p>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="mt-8 text-sm font-semibold text-foreground hover:translate-x-1 transition-transform inline-flex items-center gap-2"
              >
                Read More <span className="text-blue-500">→</span>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="mt-16 flex items-center justify-center gap-2 border-t border-foreground/5 pt-10">
          <Link
            href={`/posts?page=${currentPage - 1}`}
            className={`rounded-lg border border-foreground/10 px-4 py-2 text-sm font-medium transition-colors ${
              currentPage <= 1
                ? "pointer-events-none opacity-30"
                : "hover:bg-foreground/5"
            }`}
          >
            Previous
          </Link>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <Link
                    key={pageNum}
                    href={`/posts?page=${pageNum}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              }
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return (
                  <span key={pageNum} className="px-2 text-foreground/30">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Link
            href={`/posts?page=${currentPage + 1}`}
            className={`rounded-lg border border-foreground/10 px-4 py-2 text-sm font-medium transition-colors ${
              currentPage >= totalPages
                ? "pointer-events-none opacity-30"
                : "hover:bg-foreground/5"
            }`}
          >
            Next
          </Link>
        </div>
      </main>
    </>
  );
}
