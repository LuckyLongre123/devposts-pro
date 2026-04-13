"use server";

import { requireAdmin } from "@/lib/admin-utils";
import prisma from "../../../../../prisma/lib/prisma";
import { Role } from "@prisma/client";
import bcryptjs from "bcryptjs";

export type UserWithStats = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  _count: {
    posts: number;
    likes: number;
  };
};

/**
 * Get all users with pagination and search
 */
export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  searchQuery: string = "",
) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: searchQuery
        ? {
            OR: [
              { email: { contains: searchQuery, mode: "insensitive" } },
              { name: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : {},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true, likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({
      where: searchQuery
        ? {
            OR: [
              { email: { contains: searchQuery, mode: "insensitive" } },
              { name: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : {},
    }),
  ]);

  return {
    users: users as UserWithStats[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Update user name
 */
export async function updateUserName(userId: string, newName: string) {
  await requireAdmin();

  if (!newName || newName.trim().length === 0) {
    throw new Error("Name cannot be empty");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { name: newName.trim() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true, likes: true } },
    },
  });
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: Role) {
  await requireAdmin();

  // Prevent deleting the only admin
  if (newRole !== "admin") {
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    });

    if (adminCount <= 1) {
      throw new Error("Cannot remove the last admin from the system");
    }
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

/**
 * Delete user and cascade delete posts and likes
 */
export async function deleteUser(userId: string) {
  await requireAdmin();

  // Prevent deleting the only admin
  const adminCount = await prisma.user.count({
    where: { role: "admin" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === "admin" && adminCount <= 1) {
    throw new Error("Cannot delete the last admin from the system");
  }

  return await prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Get user detail with all their posts and likes
 */
export async function getUserDetail(userId: string) {
  await requireAdmin();

  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      aiTokens: true,
      posts: {
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      likes: {
        select: {
          id: true,
          post: {
            select: {
              id: true,
              title: true,
              authorId: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { posts: true, likes: true, messages: true },
      },
    },
  });
}
