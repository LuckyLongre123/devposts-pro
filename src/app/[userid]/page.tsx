import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "../../../prisma/lib/prisma";
import { notFound } from "next/navigation";
import UserProfileContent from "./(components)/UserProfileContent";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = await params;
  const currentUser = await getAuthenticatedUser();

  // Fetch user from DB
  const user = await prisma.user.findUnique({
    where: { id: userid },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          likes: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Fetch user's published posts (with pagination handled in client component)
  const postsCount = await prisma.post.count({
    where: { authorId: userid, published: true },
  });

  // Determine user's permission level
  const isAuthor = currentUser?.id === userid;
  const isAdmin = currentUser?.role === "admin";
  const isLoggedIn = !!currentUser;

  return (
    <UserProfileContent
      user={user}
      postsCount={postsCount}
      isAuthor={isAuthor}
      isAdmin={isAdmin}
      isLoggedIn={isLoggedIn}
      currentUserId={currentUser?.id || null}
    />
  );
}
