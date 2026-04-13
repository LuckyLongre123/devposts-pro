"use client";

import React from "react";
import { Users, FileText, Mail, Heart } from "lucide-react";

// 1. Map the string keys to their corresponding Lucide components
const iconMap = {
  users: Users,
  fileText: FileText,
  mail: Mail,
  heart: Heart,
};

interface StatCardProps {
  label: string;
  value: string | number;
  iconName?: keyof typeof iconMap; // 2. Restrict to valid keys
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "amber" | "red";
}

const colorStyles = {
  blue: "bg-transparent border border-blue-500/30 dark:border-blue-500/20 text-blue-600 dark:text-blue-400",
  green:
    "bg-transparent border border-green-500/30 dark:border-green-500/20 text-green-600 dark:text-green-400",
  amber:
    "bg-transparent border border-amber-500/30 dark:border-amber-500/20 text-amber-600 dark:text-amber-400",
  red: "bg-transparent border border-red-500/30 dark:border-red-500/20 text-red-600 dark:text-red-400",
};

const iconColorClass = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  amber: "text-amber-600 dark:text-amber-400",
  red: "text-red-600 dark:text-red-400",
};

export function StatCard({
  label,
  value,
  iconName,
  trend,
  trendValue,
  color = "blue",
}: StatCardProps) {
  // 3. Resolve the icon based on the passed string
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trendValue && (
            <p
              className={`text-xs font-medium mt-2 truncate ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : trend === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`${colorStyles[color]} p-2 md:p-3 rounded-lg shrink-0`}
          >
            <Icon
              className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass[color]}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
