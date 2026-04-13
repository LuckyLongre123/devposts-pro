"use server";

import { requireAdmin } from "@/lib/admin-utils";
import prisma from "../../../../../prisma/lib/prisma";

export type PostWithStats = {
  id: string;
  title: string;
  published: boolean;
  author: { id: string; name: string | null };
  createdAt: Date;
  _count: {
    likes: number;
  };
};

/**
 * Get all posts with pagination and filters
 */
export async function getAllPosts(
  page: number = 1,
  limit: number = 10,
  status?: "published" | "draft" | "all",
) {
  await requireAdmin();

  const skip = (page - 1) * limit;
  const whereClause =
    status === "all" || !status ? {} : { published: status === "published" };

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        published: true,
        author: { select: { id: true, name: true } },
        createdAt: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where: whereClause }),
  ]);

  return {
    posts: posts as PostWithStats[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Search posts by title
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  limit: number = 10,
) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        title: true,
        published: true,
        author: { select: { id: true, name: true } },
        createdAt: true,
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { title: { contains: query, mode: "insensitive" } },
    }),
  ]);

  return {
    posts: posts as PostWithStats[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Update post published status
 */
export async function updatePostStatus(postId: string, published: boolean) {
  await requireAdmin();

  return await prisma.post.update({
    where: { id: postId },
    data: { published },
    select: {
      id: true,
      title: true,
      published: true,
      author: { select: { id: true, name: true } },
    },
  });
}

/**
 * Delete post
 */
export async function deletePost(postId: string) {
  await requireAdmin();

  return await prisma.post.delete({
    where: { id: postId },
    select: { id: true, title: true },
  });
}

/**
 * Get post detail with all likes
 */
export async function getPostDetail(postId: string) {
  await requireAdmin();

  return await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      body: true,
      published: true,
      author: { select: { id: true, name: true, email: true } },
      createdAt: true,
      updatedAt: true,
      likes: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true } },
    },
  });
}
