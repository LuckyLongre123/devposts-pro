"use client";

export default function UserDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button */}
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />

      {/* User Header */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0" />
          <div className="flex-1">
            {/* Name and Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
            {/* Email */}
            <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
            {/* Date */}
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Posts Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
