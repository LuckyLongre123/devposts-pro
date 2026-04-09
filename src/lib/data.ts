import { PostType } from "@/types";
import prisma from "../../prisma/lib/prisma";

export async function getPosts(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({
      where: { authorId: userId },
    }),
  ]);

  return {
    posts,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getSinglePost(postId: string) {
  try {
    if (!postId) {
      return Response.json(
        { success: false, message: "invalid id" },
        { status: 422 },
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!existingPost) {
      return { success: false, message: "Post not found" };
    }

    return {
      success: true,
      data: existingPost,
      message: "Post retrieved successfully",
    };
  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function getPublishedPosts(
  searchQuery: string = "",
  currentPage: number = 1,
  limit: number = 9,
  sort: string = "latest",
  date: string = "",
  author: string = "",
  status: string = "published",
  isAdmin: boolean = false,
) {
  try {
    const skip = (currentPage - 1) * limit;
    const whereClause: any = {};

    if (isAdmin) {
      if (status === "draft") whereClause.published = false;
      else if (status === "published") whereClause.published = true;
    } else {
      whereClause.published = true;
    }

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { body: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (date) {
      const now = new Date();
      let dateFrom: Date;

      switch (date) {
        case "today":
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          dateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          break;
        case "year":
          dateFrom = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          break;
        default:
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      whereClause.createdAt = { gte: dateFrom };
    }

    if (author) {
      whereClause.author = {
        name: { contains: author, mode: "insensitive" },
      };
    }

    let orderBy: any;
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "az":
        orderBy = { title: "asc" };
        break;
      case "popular":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Yahan print karo — terminal mein dikhega
    console.log("=== getPublishedPosts DEBUG ===");
    console.log("Params:", {
      searchQuery,
      currentPage,
      sort,
      date,
      author,
      status,
      isAdmin,
    });
    console.log("whereClause:", JSON.stringify(whereClause, null, 2));
    console.log("orderBy:", orderBy);

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: { author: { select: { name: true } } },
      }),
      prisma.post.count({ where: whereClause }),
    ]);

    console.log("totalCount:", totalCount, "| posts returned:", posts.length);
    console.log("==============================");

    return {
      posts: posts as unknown as PostType[],
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts.");
  }
}
