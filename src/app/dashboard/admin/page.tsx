import { requireAdmin } from "@/lib/admin-utils";
import prisma from "../../../../prisma/lib/prisma";
import { StatCard, Avatar } from "./(_components)";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdmin();

  // Fetch stats
  const [
    userCount,
    postCount,
    messageCount,
    unreadMessageCount,
    totalLikesCount,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.like.count(),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  const publishedPostCount = await prisma.post.count({
    where: { published: true },
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Total Users"
          value={userCount}
          iconName="users"
          color="blue"
          trendValue={`${adminCount} admin`}
        />
        <StatCard
          label="Total Posts"
          value={postCount}
          iconName="fileText"
          color="green"
          trendValue={`${publishedPostCount} published`}
        />
        <StatCard
          label="Total Likes"
          value={totalLikesCount}
          iconName="heart"
          color="red"
        />
        <StatCard
          label="Messages"
          value={messageCount}
          iconName="mail"
          color="amber"
          trendValue={`${unreadMessageCount} unread`}
        />
      </div>

      {/* Recent Users Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Users
        </h2>
        <div className="space-y-2 md:space-y-4">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Link href={`/${user.id}`}>
                  <Avatar name={user.name} email={user.email} size="md" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name || "Unknown"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
