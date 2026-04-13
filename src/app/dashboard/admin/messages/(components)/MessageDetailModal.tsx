"use client";

import React from "react";
import { Modal, Avatar, Badge } from "../../(_components)";
import { MessageWithUser } from "../../(_lib)/messages";
import Link from "next/link";

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: MessageWithUser;
}

export default function MessageDetailModal({
  isOpen,
  onClose,
  message,
}: MessageDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Message Details" size="lg">
      <div className="space-y-6">
        {/* Sender Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            From
          </h3>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {message.user ? (
              <>
                <Avatar
                  name={message.user.name}
                  email={message.user.email}
                  size="md"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {message.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {message.email}
                  </p>
                  <Link
                    href={`/dashboard/admin/users/${message.user.id}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {message.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {message.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Guest User
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Message
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {message.message}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
              Status
            </p>
            <div className="mt-2">
              <Badge variant={message.isRead ? "secondary" : "info"}>
                {message.isRead ? "Read" : "Unread"}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
              Received
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
