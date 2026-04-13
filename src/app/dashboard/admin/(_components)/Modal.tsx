"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeButton?: boolean;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`${sizeStyles[size]} w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg pointer-events-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
              {closeButton && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
