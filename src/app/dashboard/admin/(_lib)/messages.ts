"use server";

import { requireAdmin } from "@/lib/admin-utils";
import prisma from "../../../../../prisma/lib/prisma";

export type MessageWithUser = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  user: { id: string; name: string | null; email: string } | null;
};

/**
 * Get all messages with pagination
 */
export async function getAllMessages(
  page: number = 1,
  limit: number = 10,
  filterUnread: boolean = false,
) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      where: filterUnread ? { isRead: false } : {},
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.message.count({
      where: filterUnread ? { isRead: false } : {},
    }),
  ]);

  return {
    messages: messages as MessageWithUser[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Search messages by sender name or email
 */
export async function searchMessages(
  query: string,
  page: number = 1,
  limit: number = 10,
) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.message.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return {
    messages: messages as MessageWithUser[],
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  await requireAdmin();

  return await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
    select: { id: true, isRead: true },
  });
}

/**
 * Mark message as unread
 */
export async function markMessageAsUnread(messageId: string) {
  await requireAdmin();

  return await prisma.message.update({
    where: { id: messageId },
    data: { isRead: false },
    select: { id: true, isRead: true },
  });
}

/**
 * Delete message
 */
export async function deleteMessage(messageId: string) {
  await requireAdmin();

  return await prisma.message.delete({
    where: { id: messageId },
    select: { id: true },
  });
}

/**
 * Get message detail
 */
export async function getMessageDetail(messageId: string) {
  await requireAdmin();

  return await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      isRead: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { posts: true, likes: true } },
        },
      },
    },
  });
}

/**
 * Get unread message count
 */
export async function getUnreadMessageCount() {
  await requireAdmin();

  return await prisma.message.count({
    where: { isRead: false },
  });
}
