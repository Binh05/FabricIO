import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "./GameCardSkeleton";

export const GamePageSkeleton = () => {
  return (
    <div className="mx-auto w-full pb-16 sm:px-3 lg:px-8">
      <section className="mt-4">
        <div className="mb-6">
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};
