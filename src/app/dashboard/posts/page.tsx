import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import ToastHandler from "../../../../components/ToastHandler";
import { PostType } from "@/types";
import { headers } from "next/headers";
import { getPosts } from "@/lib/data";
import Loading from "../../../../components/Loading";

export const revalidate = 60;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 9;

  let posts: PostType[] = [];
  let totalPages = 1;

  try {
    // ✅ Get userId from middleware
    const incomingHeaders = await headers();
    const userId = incomingHeaders.get("x-user-id");

    if (!userId) {
      return <div className="text-center py-20">Unauthorized</div>;
    }

    // ✅ Direct DB call (NO API)
    const data = await getPosts(userId, currentPage, limit);

    // @ts-ignore or cast
    posts = data.posts;
    totalPages = data.totalPages;
  } catch (error) {
    console.error(error);
    return <div className="text-center py-20">Something went wrong</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-20">No posts found.</div>;
  }

  if (currentPage > totalPages) {
    return <div className="text-center py-20">Page not found</div>;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <ToastHandler />
      </Suspense>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Section */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-foreground/60">
              Viewing page {currentPage} of {totalPages}
            </p>
          </div>

          {/* Button */}
          <Link
            href="/dashboard/new"
            className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
          >
            <PlusIcon className="h-5 w-5" />
            Create Post
          </Link>
        </div>

        {/* Posts Grid */}
        {/* Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background p-6 transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                {/* Published / Draft Label */}
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    post.published ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>

                <h2 className="mt-3 text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors">
                  {post.title.length > 50
                    ? post.title.slice(0, 50) + "..."
                    : post.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  {post.body.length > 120
                    ? post.body.slice(0, 120) + "..."
                    : post.body}
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
            href={`/dashboard/posts?page=${currentPage - 1}`}
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
                    href={`/dashboard/posts?page=${pageNum}`}
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
            href={`/dashboard/posts?page=${currentPage + 1}`}
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
