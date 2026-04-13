import React, { Suspense } from "react";
import { getUserDetail } from "../../(_lib)/users";
import { requireAdmin } from "@/lib/admin-utils";
import BackButton from "./(components)/BackButton";
import AdminUserDetailContent from "./(components)/AdminUserDetailContent";
import UserDetailSkeleton from "./(components)/UserDetailSkeleton";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const user = await getUserDetail(id);

  if (!user) {
    return (
      <div className="space-y-4">
        <BackButton href="/dashboard/admin/users" />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <AdminUserDetailContent user={user} />
    </Suspense>
  );
}
