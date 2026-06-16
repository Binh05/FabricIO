import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "./GameCardSkeleton";
import { GameFeaturedDropSkeleton } from "./GameFeaturedDropSkeleton";

export const HomeSkeleton = () => {
  return (
    <>
      <GameFeaturedDropSkeleton />

      <section className="mb-16">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
};
