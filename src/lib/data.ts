import prisma from "../../prisma/lib/prisma";
import { headers } from "next/headers";

export async function getPosts(
  userId: string,
  page: number = 1,
  limit: number = 9,
  searchQuery: string = "",
  sortParam: string = "latest",
  statusParam: string = "all",
  dateParam: string = "",
) {
  const skip = (page - 1) * limit;

  const where: any = {
    authorId: userId,
  };

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { body: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (statusParam === "published") {
    where.published = true;
  } else if (statusParam === "draft") {
    where.published = false;
  }

  if (dateParam) {
    const now = new Date();
    let startDate;

    if (dateParam === "today") startDate = new Date(now.setHours(0, 0, 0, 0));
    else if (dateParam === "week")
      startDate = new Date(now.setDate(now.getDate() - 7));
    else if (dateParam === "month")
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    else if (dateParam === "year")
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));

    if (startDate) where.createdAt = { gte: startDate };
  }

  let orderBy: any = { createdAt: "desc" };

  if (sortParam === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sortParam === "az") {
    orderBy = { title: "asc" };
  } else if (sortParam === "popular") {
    // ✅ FIX: Relation array ke count ke hisaab se sort karna
    orderBy = { likes: { _count: "desc" } };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      // ✅ FIX: Author ka naam aur Likes ka count fetch karna
      include: {
        author: {
          select: { id: true, name: true },
        },
        _count: {
          select: { likes: true },
        },
      },
    }),
    prisma.post.count({
      where,
    }),
  ]);

  // Convert Date objects to ISO strings for PostType compatibility
  const transformedPosts = posts.map((post) => ({
    ...post,
    createdAt:
      post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : String(post.createdAt),
    updatedAt:
      post.updatedAt instanceof Date
        ? post.updatedAt.toISOString()
        : String(post.updatedAt),
  }));

  return {
    posts: transformedPosts,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getSinglePost(postId: string, currentUserId?: string) {
  try {
    if (!postId) return { success: false, message: "Invalid ID" };

    // ✅ Headers hatayein aur direct currentUserId use karein
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!existingPost) {
      return { success: false, message: "Post not found" };
    }

    let hasLiked = false;

    // ✅ yahan currentUserId check karein
    if (currentUserId) {
      const userLike = await prisma.like.findFirst({
        where: {
          postId: postId,
          userId: currentUserId,
        },
      });
      hasLiked = userLike !== null;
    }

    const likesCount = existingPost._count ? existingPost._count.likes : 0;
    delete (existingPost as any)._count;

    // Convert Date objects to ISO strings for PostType compatibility
    const postData = {
      ...existingPost,
      createdAt:
        existingPost.createdAt instanceof Date
          ? existingPost.createdAt.toISOString()
          : String(existingPost.createdAt),
      updatedAt:
        existingPost.updatedAt instanceof Date
          ? existingPost.updatedAt.toISOString()
          : String(existingPost.updatedAt),
      hasLiked: hasLiked,
      likesCount: likesCount,
    };

    return {
      success: true,
      data: postData,
      message: "Post retrieved successfully",
    };
  } catch (error: any) {
    console.error("GET POST ERROR:", error);
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function getPublishedPosts(
  searchQuery: string = "",
  page: number = 1,
  limit: number = 9,
  sortParam: string = "latest",
  dateParam: string = "",
  authorParam: string = "",
  statusParam: string = "published",
  isAdmin: boolean = false,
) {
  const skip = (page - 1) * limit;
  const where: any = {};

  // 📝 Status Filter (Admin can see all/drafts, others see published)
  if (statusParam === "published") {
    where.published = true;
  } else if (statusParam === "draft") {
    where.published = false;
  }

  // 🔍 Search Query Filter
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { body: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // 👤 Author Filter
  if (authorParam) {
    where.author = {
      name: { contains: authorParam, mode: "insensitive" },
    };
  }

  // 📅 Date Range Filter
  if (dateParam) {
    const now = new Date();
    let startDate;

    if (dateParam === "today") startDate = new Date(now.setHours(0, 0, 0, 0));
    else if (dateParam === "week")
      startDate = new Date(now.setDate(now.getDate() - 7));
    else if (dateParam === "month")
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    else if (dateParam === "year")
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));

    if (startDate) {
      where.createdAt = { gte: startDate };
    }
  }

  // 🔄 Sort Filter
  let orderBy: any = { createdAt: "desc" };

  if (sortParam === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sortParam === "az") {
    orderBy = { title: "asc" };
  } else if (sortParam === "popular") {
    // ✅ FIX 1: Popular ko Likes ke hisaab se sort karna
    orderBy = { likes: { _count: "desc" } };
  }

  // Fetch data
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: {
          select: { id: true, name: true },
        },
        // ✅ FIX 2: Har post ke total likes count karke lana
        _count: {
          select: { likes: true },
        },
      },
    }),
    prisma.post.count({
      where,
    }),
  ]);

  // Convert Date objects to ISO strings for PostType compatibility
  const transformedPosts = posts.map((post) => ({
    ...post,
    createdAt:
      post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : String(post.createdAt),
    updatedAt:
      post.updatedAt instanceof Date
        ? post.updatedAt.toISOString()
        : String(post.updatedAt),
  }));

  return {
    posts: transformedPosts,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
