export function UserSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse">
      <div className="p-5 space-y-4">
        {/* Avatar + Name/Email Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-32" />
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-40" />
          </div>
        </div>

        {/* Role Badge Skeleton */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-20" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-1">
            <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-1/2 mx-auto" />
            <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-1/3 mx-auto" />
          </div>
          <div className="text-center space-y-1">
            <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-1/2 mx-auto" />
            <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-1/3 mx-auto" />
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 h-9 bg-gray-300 dark:bg-slate-700 rounded-lg" />
          <div className="w-9 h-9 bg-gray-300 dark:bg-slate-700 rounded-lg" />
          <div className="w-9 h-9 bg-gray-300 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
