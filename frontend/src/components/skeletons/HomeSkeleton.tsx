import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "./GameCardSkeleton";
import { GameFeaturedDropSkeleton } from "./GameFeaturedDropSkeleton";

export const HomeSkeleton = () => {
  return (
    <div className="bg-background text-foreground w-full">
      <div className="mx-auto my-6 w-full sm:px-3 lg:px-8">
        <GameFeaturedDropSkeleton />

        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-6 w-1.5 rounded-full" />
            <Skeleton className="h-8 w-40" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-56 rounded-lg" />
          </div>
        </section>

        <section className="border-border-subtle bg-surface-container mt-14 rounded-2xl border p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-2xl space-y-3">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-8 w-full max-w-xl" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
            <Skeleton className="h-12 w-48 shrink-0 rounded-lg" />
          </div>
        </section>

        <footer className="border-border-subtle mt-14 flex flex-col gap-5 border-t pt-8 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-56" />
        </footer>
      </div>
    </div>
  );
};
