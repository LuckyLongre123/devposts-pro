"use client";

import React, { useState } from "react";
import { Modal, Button } from "../../(_components)";
import { PostWithStats } from "../../(_lib)/posts";

interface PostStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostWithStats;
  onStatusChange: (postId: string, published: boolean) => Promise<void>;
  isLoading?: boolean;
}

export default function PostStatusModal({
  isOpen,
  onClose,
  post,
  onStatusChange,
  isLoading = false,
}: PostStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<boolean>(post.published);

  const handleConfirm = async () => {
    if (selectedStatus !== post.published) {
      await onStatusChange(post.id, selectedStatus);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Post Status"
      description={`Change the publication status for "${post.title}"`}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              name="status"
              checked={selectedStatus}
              onChange={() => setSelectedStatus(true)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                Published
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Post is visible to all users
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="radio"
              name="status"
              checked={!selectedStatus}
              onChange={() => setSelectedStatus(false)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Draft</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Post is hidden from public view
              </p>
            </div>
          </label>
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
          disabled={selectedStatus === post.published || isLoading}
        >
          Update Status
        </Button>
      </div>
    </Modal>
  );
}
