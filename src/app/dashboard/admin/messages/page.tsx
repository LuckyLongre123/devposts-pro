"use client";

import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getAllMessages,
  searchMessages,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
  MessageWithUser,
} from "../(_lib)/messages";
import {
  SearchInput,
  Button,
  ConfirmDialog,
  Alert,
  MessageStatusBadge,
  Avatar,
} from "../(_components)";
import { Trash2, EyeIcon, Mail } from "lucide-react";
import Link from "next/link";
import MessageDetailModal from "./(components)/MessageDetailModal";

function MessageSkeleton({ i }: { i: number }) {
  return (
    <div
      className={`rounded-lg border transition-all duration-200 animate-pulse ${
        i % 2 === 0
          ? "bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700"
          : "bg-blue-50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-600/40"
      }`}
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Avatar Skeleton */}
            <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 rounded-full shrink-0" />

            <div className="flex-1 min-w-0">
              {/* Name + Badge Skeleton */}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-32" />
                <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-12 shrink-0" />
              </div>

              {/* Email Skeleton */}
              <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-40 mb-2" />

              {/* Date Skeleton */}
              <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-48" />
            </div>
          </div>

          {/* Unread Dot Skeleton */}
          <div className="w-3 h-3 bg-gray-300 dark:bg-slate-700 rounded-full shrink-0 mt-1 hidden sm:block" />
        </div>

        {/* Message Preview Skeleton */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6" />
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-4/6" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full sm:w-auto">
            <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-full xs:w-20" />
            <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-full xs:w-20" />
          </div>
          <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-full sm:w-10" />
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMessage, setSelectedMessage] =
    useState<MessageWithUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);

  const loadMessages = useCallback(
    async (page: number, search: string, unreadOnly: boolean) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = search
          ? await searchMessages(search, page, 10)
          : await getAllMessages(page, 10, unreadOnly);
        setMessages(data.messages);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load messages";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    loadMessages(1, "", filterUnread);
  }, [loadMessages, filterUnread]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      loadMessages(1, query, filterUnread);
    },
    [loadMessages, filterUnread],
  );

  const handleToggleRead = async (message: MessageWithUser) => {
    try {
      setLoadingMessageId(message.id);
      if (message.isRead) {
        await markMessageAsUnread(message.id);
        toast.success("Marked as unread");
      } else {
        await markMessageAsRead(message.id);
        toast.success("Marked as read");
      }
      
      // Update only the specific message in the list
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: !message.isRead } : m
      ));
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to update message";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setLoadingMessageId(null);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    const messageId = selectedMessage.id;
    try {
      setIsSubmitting(true);
      await deleteMessage(messageId);
      toast.success("Message deleted");
      
      // Optimistic/Immediate UI update
      setMessages(prev => prev.filter(m => m.id !== messageId));
      setDeleteConfirmOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete message";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="truncate">Message Management</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View, manage, and respond to messages from users and guests.
        </p>
      </div>

      {/* Errors */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onReload={() => loadMessages(currentPage, searchQuery, filterUnread)}
            isLoading={isLoading}
            placeholder="Search by name or email..."
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-fit">
          <input
            type="checkbox"
            checked={filterUnread}
            onChange={(e) => setFilterUnread(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Unread Only
          </span>
        </label>
      </div>

      {/* Messages Grid */}
      {isLoading && messages.length === 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <MessageSkeleton key={i} i={i} />
            ))}
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {searchQuery || filterUnread
              ? "No messages found"
              : "No messages yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {messages.map((message) => 
               loadingMessageId === message.id ? (
                 <MessageSkeleton key={message.id} i={messages.indexOf(message)} />
               ) : (
                <div
                  key={message.id}
                  className={`rounded-lg border transition-all duration-200 ${
                    message.isRead
                      ? "bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700"
                      : "bg-blue-50 dark:bg-slate-800/50 border-blue-200 dark:border-blue-600/40"
                  }`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        {message.user ? (
                          <Avatar
                            name={message.user.name}
                            email={message.user.email}
                            size="md"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {message.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {message.user ? (
                              <Link
                                href={`/dashboard/admin/users/${message.user.id}`}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate hover:underline transition-colors"
                              >
                                {message.name}
                              </Link>
                            ) : (
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {message.name}
                              </h3>
                            )}
                            <MessageStatusBadge isRead={message.isRead} />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {message.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleDateString()} at{" "}
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      {!message.isRead && (
                        <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 mt-1"></div>
                      )}
                    </div>

                    {/* Message Preview */}
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {message.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full sm:w-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsDetailModalOpen(true);
                          }}
                          className="gap-2 w-full xs:w-auto"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View Full
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleRead(message)}
                          title={
                            message.isRead ? "Mark as unread" : "Mark as read"
                          }
                          className="gap-2 w-full xs:w-auto"
                        >
                          {message.isRead ? "✓ Read" : "○ Unread"}
                        </Button>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedMessage(message);
                          setDeleteConfirmOpen(true);
                        }}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
               )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  loadMessages(currentPage - 1, searchQuery, filterUnread)
                }
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "secondary"}
                      size="sm"
                      onClick={() =>
                        loadMessages(page, searchQuery, filterUnread)
                      }
                      disabled={isLoading}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  loadMessages(currentPage + 1, searchQuery, filterUnread)
                }
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedMessage && (
        <>
          <MessageDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            message={selectedMessage}
          />

          <ConfirmDialog
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleDeleteMessage}
            title="Delete Message"
            description={`Are you sure you want to delete the message from ${selectedMessage.name}? This action cannot be undone.`}
            confirmText="Delete Message"
            isDanger
            isLoading={isSubmitting}
          />
        </>
      )}
    </div>
  );
}
