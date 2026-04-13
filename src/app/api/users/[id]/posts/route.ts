import prisma from "../../../../../../prisma/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isLoggedInParam = searchParams.get("loggedIn") === "true";

    const currentUser = await getAuthenticatedUser();
    const isLoggedIn = !!currentUser;

    const skip = (page - 1) * limit;

    // For logged-in users (author or admin): show all posts
    // For non-logged-in users: show only published posts
    const isAuthor = currentUser?.id === userId;
    const isAdmin = currentUser?.role === "admin";

    const whereClause = (isAuthor || isAdmin)
      ? { authorId: userId }
      : { authorId: userId, published: true };

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          body: true,
          published: true,
          author: { select: { id: true, name: true } },
          createdAt: true,
          thumbnailUrl: true,
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    return Response.json(
      {
        success: true,
        posts,
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET USERS POSTS ERROR:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}
