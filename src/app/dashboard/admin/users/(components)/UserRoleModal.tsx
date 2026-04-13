"use client";

import React, { useState } from "react";
import { Modal, Button } from "../../(_components)";
import { Role } from "@prisma/client";
import { UserWithStats } from "../../(_lib)/users";

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithStats;
  onRoleChange: (userId: string, newRole: Role) => Promise<void>;
  isLoading?: boolean;
}

const roles: { value: Role; label: string; description: string }[] = [
  {
    value: "user",
    label: "User",
    description: "Can create and manage posts, interact with content",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Can access admin dashboard and manage all platform content",
  },
];

export default function UserRoleModal({
  isOpen,
  onClose,
  user,
  onRoleChange,
  isLoading = false,
}: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);

  const handleConfirm = async () => {
    if (selectedRole !== user.role) {
      await onRoleChange(user.id, selectedRole);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update User Role"
      description={`Change the role for ${user.email}`}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          {roles.map((role) => (
            <label
              key={role.value}
              className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={() => setSelectedRole(role.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {role.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {role.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={selectedRole === user.role || isLoading}
        >
          Update Role
        </Button>
      </div>
    </Modal>
  );
}
