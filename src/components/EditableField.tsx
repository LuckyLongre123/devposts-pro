"use client";

import React from "react";
import { Check, X, Save } from "lucide-react";

interface EditableFieldProps {
  value: string;
  isEditing: boolean;
  isSaving: boolean;
  error?: string | null;
  onDoubleClick: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  displayClassName?: string;
  showSkeletonOnSave?: boolean;
}

export function EditableField({
  value,
  isEditing,
  isSaving,
  error,
  onDoubleClick,
  onSave,
  onCancel,
  onChange,
  onKeyDown,
  inputRef,
  placeholder = "Enter text...",
  maxLength = 255,
  className = "",
  displayClassName = "",
  showSkeletonOnSave = true,
}: EditableFieldProps) {
  // Show skeleton while saving
  if (isSaving && showSkeletonOnSave) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div
          className={`h-6 bg-foreground/10 rounded-lg w-3/4 ${displayClassName}`}
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement | null>}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={isSaving}
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-blue-500/50 text-foreground placeholder:text-foreground/30 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50"
        />
        <button
          onClick={onSave}
          disabled={isSaving}
          className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 disabled:opacity-50"
          title="Save (Enter)"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 disabled:opacity-50"
          title="Cancel (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <div
      onDoubleClick={onDoubleClick}
      className={`cursor-text select-none hover:bg-blue-500/10 px-2 py-1 rounded transition-colors ${displayClassName}`}
      title="Double-click to edit"
    >
      {value || placeholder}
    </div>
  );
}
