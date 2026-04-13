import { BookOpen } from "lucide-react";

const SkeletonCard = () => (
  <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    {/* Thumbnail Image Skeleton */}
    <div className="aspect-[16/9] w-full bg-foreground/10" />
    
    <div className="p-6 space-y-5">
      {/* Author & Status Row */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-blue-500/10 rounded-md" />
        <div className="h-5 w-16 bg-foreground/5 rounded-full" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-full bg-foreground/10 rounded-lg" />
        <div className="h-7 w-4/5 bg-foreground/10 rounded-lg" />
      </div>

      {/* Description Snippet Skeleton */}
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-foreground/5 rounded" />
        <div className="h-3.5 w-full bg-foreground/5 rounded" />
        <div className="h-3.5 w-2/3 bg-foreground/5 rounded" />
      </div>
    </div>
  </div>
);

export default function PostsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Header Section */}
      <div className="mb-12 space-y-8">
        <div className="border-l-4 border-blue-500 pl-5">
          <div className="h-10 w-72 bg-foreground/10 rounded-lg" />
          <div className="h-5 w-56 bg-foreground/5 rounded-md mt-3" />
        </div>
        
        {/* Search & Action Bar Skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-12 flex-1 bg-foreground/[0.03] border border-foreground/10 rounded-xl" />
          <div className="flex gap-3">
            <div className="h-12 w-32 bg-foreground/[0.03] border border-foreground/10 rounded-xl" />
            <div className="h-12 w-24 bg-foreground/[0.03] border border-foreground/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </main>
  );
}
