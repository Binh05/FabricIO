import { Skeleton } from "@/components/ui/skeleton";

export const PlayPageSkeleton = () => {
  return (
    <section className="mb-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 flex items-end justify-between">
        <div className="w-2/3 space-y-3">
          {/* Tag "Play" */}
          <Skeleton className="h-4 w-12 rounded" />
          {/* Game Title */}
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          {/* Subtitle */}
          <Skeleton className="h-5 w-1/2 rounded" />
        </div>
        {/* Game Details Button */}
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      <div className="flex-1 space-y-4">
        {/* Iframe Viewport Skeleton (aspect-video) */}
        <div className="border-border bg-background/50 relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border">
          {/* Play Button Center Circle */}
          <Skeleton className="bg-muted/20 size-20 rounded-full" />
        </div>

        {/* Action Toolbar (Reload / Fullscreen) */}
        <div className="bg-card border-border flex items-center justify-between gap-4 rounded-xl border p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>

        {/* Description Block Skeleton */}
        <div className="border-border space-y-3 rounded-xl border bg-white/3 p-4">
          {/* Title "Mô tả" */}
          <Skeleton className="h-4 w-16 rounded" />
          {/* Description Lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
};
