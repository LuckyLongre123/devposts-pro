"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserWithStats } from "../../(_lib)/users";
import { Avatar, Button, RoleBadge } from "../../(_components)";
import { useInlineEditOptimistic } from "@/hooks/useInlineEditOptimistic";
import { EditableField } from "@/components/EditableField";
import { Edit, Trash2, EyeIcon } from "lucide-react";

interface UserCardProps {
  user: UserWithStats;
  onDelete: () => void;
  onRoleChange: () => void;
  onUserUpdate: (updatedUser: UserWithStats) => void;
}

export function UserCard({
  user,
  onDelete,
  onRoleChange,
  onUserUpdate,
}: UserCardProps) {
  const nameEdit = useInlineEditOptimistic(
    user.name || user.email,
    async (newName) => {
      if (!newName || newName.trim().length === 0) {
        throw new Error("Name cannot be empty");
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update name");
      }

      toast.success("Name updated!");
      // Return updated user with new name
      const updatedUser = { ...user, name: newName };
      onUserUpdate(updatedUser);
    },
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5 space-y-4">
        {/* Avatar + Name/Email */}
        <div className="flex items-start gap-3">
          <Avatar name={user.name || user.email} email={user.email} size="md" />
          <div className="flex-1 min-w-0">
            {/* Double-click to edit name */}
            <EditableField
              value={nameEdit.value}
              isEditing={nameEdit.isEditing}
              isSaving={nameEdit.isSaving}
              error={nameEdit.error}
              onDoubleClick={() => {
                nameEdit.setIsEditing(true);
                setTimeout(() => nameEdit.inputRef.current?.focus(), 0);
              }}
              onSave={nameEdit.handleSave}
              onCancel={nameEdit.handleCancel}
              onChange={nameEdit.setValue}
              onKeyDown={nameEdit.handleKeyDown}
              inputRef={nameEdit.inputRef}
              placeholder="Enter name..."
              maxLength={100}
              displayClassName="text-sm font-semibold text-gray-900 dark:text-white truncate"
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
              {user.email}
            </p>
          </div>
        </div>

        {/* Role Badge */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <RoleBadge role={user.role} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {user._count.posts}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {user._count.likes}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Link href={`/dashboard/admin/users/${user.id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full gap-2">
              <EyeIcon className="w-4 h-4" />
              View
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRoleChange}
            title="Edit Role"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
