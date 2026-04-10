import Link from "next/link";
import { Suspense } from "react";
import { PlusIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import ToastHandler from "../../../../components/ToastHandler";
import { PostType } from "@/types";
import { headers } from "next/headers";
import { getPosts } from "@/lib/data";
import Loading from "../../../../components/Loading";
import Search from "../../../../components/Search";
import {
  DEFAULT_THUMBNAIL,
  THUMBNAIL_ASPECT_CLASS,
} from "@/constants/thumbnails";

export const revalidate = 60;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    sort?: string;
    status?: string;
    date?: string;
  }>;
}) {
  const { page, query, sort, status, date } = await searchParams;

  const currentPage = Number(page) || 1;
  const searchQuery = query || "";
  const sortParam = sort || "latest";
  const statusParam = status || "all";
  const dateParam = date || "";
  const limit = 9;

  let posts: PostType[] = [];
  let totalPages = 1;
  let userId = null;

  try {
    const incomingHeaders = await headers();
    userId = incomingHeaders.get("x-user-id");

    if (!userId) {
      return <div className="text-center py-20">Unauthorized</div>;
    }

    const data = await getPosts(
      userId,
      currentPage,
      limit,
      searchQuery,
      sortParam,
      statusParam,
      dateParam,
    );

    // @ts-ignore or cast
    posts = data.posts;
    totalPages = data.totalPages || 1;
  } catch (error) {
    console.error(error);
    return <div className="text-center py-20">Something went wrong</div>;
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();

    params.set("page", pageNumber.toString());
    if (searchQuery) params.set("query", searchQuery);
    if (sortParam && sortParam !== "latest") params.set("sort", sortParam);
    if (statusParam && statusParam !== "all") params.set("status", statusParam);
    if (dateParam) params.set("date", dateParam);

    return `/dashboard/posts?${params.toString()}`;
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <ToastHandler />
      </Suspense>

      {/* Empty State UI (Jab account mein ek bhi post na ho) */}
      {posts.length === 0 &&
      !searchQuery &&
      !dateParam &&
      statusParam === "all" ? (
        <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 mb-6">
            <FileTextIcon className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            No posts created yet
          </h2>
          <p className="mt-4 text-foreground/60 max-w-md mx-auto">
            You haven't written any posts. Get started by creating your first
            post now!
          </p>
          <Link
            href="/dashboard/new"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
          >
            <PlusIcon className="h-5 w-5" />
            Create Post
          </Link>
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-6 py-12">
          {/* ✅ Row 1: Header & Create Post Button */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="mt-2 text-sm sm:text-base text-foreground/60">
                Manage your posts and drafts
              </p>
            </div>

            <Link
              href="/dashboard/new"
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Create Post
            </Link>
          </div>

          {/* ✅ Row 2: Search Bar (Grid ke just upar) */}
          <div className="mb-8 w-full">
            <Search
              userRole="admin"
              placeholder="Search your posts..."
              hideAuthorFilter={true}
            />
          </div>

          {/* Filter ke baad Agar No Posts Found */}
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/10 py-20 text-center">
              <p className="text-lg font-medium text-foreground/60">
                {searchQuery
                  ? `No posts found matching "${searchQuery}"`
                  : "No posts found for these filters."}
              </p>
              <Link
                href="/dashboard/posts"
                className="mt-4 text-blue-500 hover:underline"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <>
              {/* Posts Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative w-full ${THUMBNAIL_ASPECT_CLASS} overflow-hidden bg-foreground/5`}
                    >
                      <Image
                        src={post.thumbnailUrl || DEFAULT_THUMBNAIL}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-1">
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
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2 border-t border-foreground/5 pt-10">
                  <Link
                    href={createPageURL(currentPage - 1)}
                    className={`rounded-lg border border-foreground/10 px-4 py-2 text-sm font-medium transition-colors ${
                      currentPage <= 1
                        ? "pointer-events-none opacity-30"
                        : "hover:bg-foreground/5 text-foreground hover:text-blue-500"
                    }`}
                  >
                    Previous
                  </Link>

                  <div className="hidden sm:flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <Link
                            key={pageNum}
                            href={createPageURL(pageNum)}
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
                      if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="px-2 text-foreground/30"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Link
                    href={createPageURL(currentPage + 1)}
                    className={`rounded-lg border border-foreground/10 px-4 py-2 text-sm font-medium transition-colors ${
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-30"
                        : "hover:bg-foreground/5 text-foreground hover:text-blue-500"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              )}
            </>
          )}
        </main>
      )}
    </>
  );
}
