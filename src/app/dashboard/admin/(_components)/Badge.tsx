"use client";

import React from "react";
import { Role } from "@prisma/client";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  primary:
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  secondary:
    "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
  success:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800",
  warning:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  danger:
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
  info: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs font-medium rounded",
  md: "px-3 py-1.5 text-sm font-medium rounded-lg",
};

export function Badge({
  variant = "secondary",
  children,
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface RoleBadgeProps {
  role: Role;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = {
    admin: { variant: "danger" as const, label: "Admin" },
    user: { variant: "secondary" as const, label: "User" },
  };

  const { variant, label } = config[role];
  return <Badge variant={variant}>{label}</Badge>;
}

interface StatusBadgeProps {
  published: boolean;
}

export function PostStatusBadge({ published }: StatusBadgeProps) {
  return (
    <Badge variant={published ? "success" : "warning"}>
      {published ? "Published" : "Draft"}
    </Badge>
  );
}

interface ReadStatusBadgeProps {
  isRead: boolean;
}

export function MessageStatusBadge({ isRead }: ReadStatusBadgeProps) {
  return (
    <Badge variant={isRead ? "secondary" : "info"}>
      {isRead ? "Read" : "Unread"}
    </Badge>
  );
}
