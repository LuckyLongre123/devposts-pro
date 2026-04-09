import Link from "next/link";
import { PostType } from "@/types";
import { getPublishedPosts } from "@/lib/data";
import Search from "../../../components/Search";
import { getAuthenticatedUser } from "@/lib/auth";
import PostCard from "../../../components/PostCard";

export const revalidate = 60;

export default async function Posts({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    sort?: string;
    status?: string;
    date?: string;
    author?: string;
  }>;
}) {
  const user = await getAuthenticatedUser();
  const isAdmin = user?.role === "admin"; // ✅ Admin check ko upar nikaal liya

  const { page, query, sort, status, date, author } = await searchParams;

  const currentPage = Number(page) || 1;
  const searchQuery = query || "";
  const sortParam = sort || "latest";

  // ✅ FIX 1: Agar admin hai toh default "all" dikhao, warna "published" dikhao
  const statusParam = status || (isAdmin ? "all" : "published");

  const dateParam = date || "";
  const authorParam = author || "";
  const limit = 9;

  let posts: PostType[] = [];
  let totalPages = 1;

  try {
    const data = await getPublishedPosts(
      searchQuery,
      currentPage,
      limit,
      sortParam,
      dateParam,
      authorParam,
      statusParam,
      isAdmin,
    );

    posts = data.posts;
    totalPages = data.totalPages || 1;
  } catch (error) {
    console.error(error);
    return (
      <div className="text-center py-20 text-red-500">
        Something went wrong while fetching posts.
      </div>
    );
  }

  const createPageURL = (
    pageNumber: number | string,
    isAdminRole: boolean = isAdmin,
  ) => {
    const params = new URLSearchParams();

    params.set("page", pageNumber.toString());

    if (searchQuery) params.set("query", searchQuery);
    if (sortParam && sortParam !== "latest") params.set("sort", sortParam);

    // ✅ FIX 2: Agar admin hai, toh jo bhi status ho use URL mein rehne do ( !== "all" hata diya)
    if (isAdminRole && statusParam) {
      params.set("status", statusParam);
    }

    if (dateParam) params.set("date", dateParam);
    if (authorParam) params.set("author", authorParam);

    return `posts/?${params.toString()}`;
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Header & Search Bar Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            All Global Posts
          </h1>
          <p className="mt-2 text-sm sm:text-base text-foreground/60">
            Discover thoughts, stories, and ideas.
          </p>
        </div>
        <Search userRole={user?.role} placeholder="Search articles..." />
      </div>

      {/* No Posts State */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/10 py-20 text-center">
          <p className="text-lg font-medium text-foreground/60">
            {searchQuery
              ? `No posts found matching "${searchQuery}"`
              : "No published posts yet."}
          </p>
          {searchQuery && (
            <Link href="/posts" className="mt-4 text-blue-500 hover:underline">
              Clear search
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Posts Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLoggedIn={user != null}
                isAdmin={isAdmin}
              />
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
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
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
                      <span key={pageNum} className="px-2 text-foreground/30">
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
  );
}
