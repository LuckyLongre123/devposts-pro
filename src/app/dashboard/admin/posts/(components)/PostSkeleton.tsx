export function PostSkeleton() {
  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-xl overflow-hidden animate-pulse">
      <div className="p-5 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
            Title
          </div>
          <div className="h-6 bg-foreground/10 rounded-lg w-3/4" />
        </div>

        {/* Author Skeleton */}
        <div className="space-y-2 pt-3 border-t border-foreground/10">
          <div className="text-xs text-foreground/40 uppercase tracking-wider font-semibold">
            Author
          </div>
          <div className="h-4 bg-foreground/10 rounded w-1/2" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-foreground/10">
          <div className="text-center space-y-1">
            <div className="h-5 bg-foreground/10 rounded w-1/2 mx-auto" />
            <div className="h-3 bg-foreground/10 rounded w-1/3 mx-auto" />
          </div>
          <div className="text-center space-y-1">
            <div className="h-5 bg-foreground/10 rounded w-1/2 mx-auto" />
            <div className="h-3 bg-foreground/10 rounded w-1/3 mx-auto" />
          </div>
        </div>

        {/* Status Skeleton */}
        <div className="pt-3 border-t border-foreground/10">
          <div className="h-6 bg-foreground/10 rounded w-1/4" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex gap-2 pt-3">
          <div className="flex-1 h-9 bg-foreground/10 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-9 bg-foreground/10 rounded-lg" />
          <div className="w-9 h-9 bg-foreground/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
