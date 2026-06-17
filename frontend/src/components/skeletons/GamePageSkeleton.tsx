import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "../skeletons/GameCardSkeleton";

export const GamePageSkeleton = () => {
  return (
    <section className="mb-16">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="mb-3 h-10 w-80" />
        <Skeleton className="h-5 w-125 max-w-full" />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Sidebar */}
        {/* <aside className="bg-card border-border h-fit w-full rounded-lg border p-6 lg:w-70">
          // Price
          <div className="mb-6">
            <Skeleton className="mb-4 h-4 w-16" />

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          // Tags
          <div className="mb-6">
            <Skeleton className="mb-4 h-4 w-12" />

            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          // Rating
          <div className="mb-6">
            <Skeleton className="mb-4 h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          //  Sort
          <div>
            <Skeleton className="mb-4 h-4 w-12" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </aside> */}

        {/* Content */}
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />

            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
