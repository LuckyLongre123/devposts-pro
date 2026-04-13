"use client";

import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  requiresTypedConfirmation?: boolean;
  confirmationText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
  requiresTypedConfirmation = false,
  confirmationText = "",
}: ConfirmDialogProps) {
  const [typed, setTyped] = React.useState("");
  const [isConfirming, setIsConfirming] = React.useState(false);

  const canConfirm = !requiresTypedConfirmation || typed === confirmationText;

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
      setTyped("");
      onClose();
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    setTyped("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={description}
      size="md"
    >
      <div className="space-y-4">
        {isDanger && (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-100">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">This action cannot be undone.</p>
          </div>
        )}

        {requiresTypedConfirmation && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                {confirmationText}
              </code>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type confirmation text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <button
          onClick={handleClose}
          disabled={isLoading || isConfirming}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-disabled font-medium"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={!canConfirm || isLoading || isConfirming}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50 cursor-disabled ${
            isDanger
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading || isConfirming ? "Loading..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
