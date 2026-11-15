import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "./GameCardSkeleton";

export const GamePageSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-8">
      <section className="mt-4">
        <div className="mb-6 flex items-end justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-sm" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};
