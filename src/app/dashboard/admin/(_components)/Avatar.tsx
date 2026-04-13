"use client";

import React from "react";

interface AvatarProps {
  name?: string | null;
  email?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export function Avatar({
  name,
  email,
  size = "md",
  className = "",
}: AvatarProps) {
  const key = name || email || "user";
  const initials = getInitials(name, email);
  const color = stringToColor(key);

  return (
    <div
      className={`${sizeStyles[size]} ${className} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
      title={name || email}
    >
      {initials}
    </div>
  );
}
