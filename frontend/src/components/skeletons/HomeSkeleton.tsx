import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "./GameCardSkeleton";
import { GameFeaturedDropSkeleton } from "./GameFeaturedDropSkeleton";

export const HomeSkeleton = () => {
  return (
    <div className="-mx-6 -mt-6 w-[calc(100%+3rem)]">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <GameFeaturedDropSkeleton />

        <section className="mt-8 mb-12">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-20 rounded-sm" />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
