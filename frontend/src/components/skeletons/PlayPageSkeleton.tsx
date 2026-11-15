import { Skeleton } from "@/components/ui/skeleton";

export const PlayPageSkeleton = () => {
  return (
    <div className="w-full pb-16 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-12 rounded bg-surface-container-high" />
        <span className="text-muted-foreground/40 text-xs">/</span>
        <Skeleton className="h-4 w-28 rounded bg-surface-container-high" />
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Player Viewport Skeleton */}
          <div className="rounded-2xl border border-border-subtle bg-surface-container-lowest overflow-hidden shadow-xl flex flex-col">
            <div className="relative aspect-video w-full bg-surface-container-lowest flex items-center justify-center">
              <Skeleton className="size-16 sm:size-20 rounded-2xl bg-surface-container-high" />
            </div>
            <div className="bg-surface-container-lowest border-t border-border-subtle px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-lg bg-surface-container-high" />
                <Skeleton className="size-9 rounded-lg bg-surface-container-high" />
                <Skeleton className="h-9 w-20 rounded-lg bg-surface-container-high" />
              </div>
              <Skeleton className="h-9 w-28 rounded-lg bg-surface-container-high" />
            </div>
          </div>

          {/* Details Card Skeleton */}
          <div className="rounded-2xl border border-border-subtle bg-surface-container-low p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 w-2/3">
                <Skeleton className="h-8 w-60 rounded-md bg-surface-container-high" />
                <Skeleton className="h-4 w-96 rounded-md bg-surface-container-high" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl bg-surface-container-high" />
            </div>

            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-44 rounded bg-surface-container-high" />
              <Skeleton className="h-4 w-48 rounded bg-surface-container-high" />
              <Skeleton className="h-4 w-40 rounded bg-surface-container-high" />
              <Skeleton className="h-4 w-64 rounded bg-surface-container-high" />
              <Skeleton className="h-4 w-36 rounded bg-surface-container-high" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle/40">
              <Skeleton className="h-7 w-16 rounded-md bg-surface-container-high" />
              <Skeleton className="h-7 w-16 rounded-md bg-surface-container-high" />
              <Skeleton className="h-7 w-20 rounded-md bg-surface-container-high" />
              <Skeleton className="h-7 w-24 rounded-md bg-surface-container-high" />
            </div>
          </div>

          {/* About Card Skeleton */}
          <div className="rounded-2xl border border-border-subtle bg-surface-container-low p-6 sm:p-7 shadow-sm space-y-4">
            <Skeleton className="h-6 w-44 rounded bg-surface-container-high" />
            <Skeleton className="h-4 w-60 rounded bg-surface-container-high" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded bg-surface-container-high" />
              <Skeleton className="h-4 w-11/12 rounded bg-surface-container-high" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36 rounded bg-surface-container-high" />
            <Skeleton className="h-4 w-16 rounded bg-surface-container-high" />
          </div>

          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-surface-container-low border border-border-subtle"
              >
                <Skeleton className="size-16 shrink-0 rounded-xl bg-surface-container-high" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded bg-surface-container-high" />
                  <Skeleton className="h-3 w-28 rounded bg-surface-container-high" />
                  <Skeleton className="h-3 w-16 rounded bg-surface-container-high" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
