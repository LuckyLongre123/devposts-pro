"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  UserWithStats,
} from "../(_lib)/users";
import { SearchInput, ConfirmDialog, Alert } from "../(_components)";
import { Role } from "@prisma/client";
import UserRoleModal from "./(components)/UserRoleModal";
import { UserCard } from "./(components)/UserCard";
import { UserSkeleton } from "./(components)/UserSkeleton";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async (page: number, search: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers(page, 10, search);
      setUsers(data.users);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load users";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers(1, "");
  }, [loadUsers]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      loadUsers(1, query);
    },
    [loadUsers],
  );

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      setIsSubmitting(true);
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      loadUsers(currentPage, searchQuery);
      setIsRoleModalOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update role";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      await deleteUser(selectedUser.id);
      toast.success("User deleted successfully");
      loadUsers(currentPage, searchQuery);
      setDeleteConfirmOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage users, roles, and view their activity. Double-click on names to
          edit.
        </p>
      </div>

      {/* Errors */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        onReload={() => loadUsers(currentPage, searchQuery)}
        isLoading={isLoading}
        placeholder="Search by email or name..."
      />

      {/* Users Grid - Card View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <UserSkeleton key={i} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No users found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) =>
            loadingUserId === user.id ? (
              <UserSkeleton key={user.id} />
            ) : (
              <UserCard
                key={user.id}
                user={user}
                onDelete={() => {
                  setSelectedUser(user);
                  setDeleteConfirmOpen(true);
                }}
                onRoleChange={() => {
                  setSelectedUser(user);
                  setIsRoleModalOpen(true);
                }}
                onUserUpdate={(updatedUser) => {
                  setLoadingUserId(null);
                  // Optimistic update: replace only the specific user
                  setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                      u.id === updatedUser.id ? updatedUser : u,
                    ),
                  );
                }}
              />
            ),
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => loadUsers(currentPage - 1, searchQuery)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white font-medium"
          >
            Previous
          </button>
          <div className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => loadUsers(currentPage + 1, searchQuery)}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white font-medium"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <>
          <UserRoleModal
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            user={selectedUser}
            onRoleChange={handleRoleChange}
            isLoading={isSubmitting}
          />

          <ConfirmDialog
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleDeleteUser}
            title="Delete User"
            description={`Are you sure you want to delete ${selectedUser.email}? This action cannot be undone and will delete all related posts and likes.`}
            confirmText="Delete User"
            isDanger
            isLoading={isSubmitting}
          />
        </>
      )}
    </div>
  );
}
