import { Skeleton } from "@/components/ui/skeleton";
import { GameCardSkeleton } from "../skeletons/GameCardSkeleton";

export const ProfileSkeleton = () => {
  return (
    <section className="mb-16 animate-pulse">
      {/* Header */}
      <div className="bg-card border-border mb-10 flex flex-col items-center gap-8 rounded-lg border p-10 md:flex-row md:items-start">
        {/* Avatar */}
        <div className="relative">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="absolute right-0 bottom-0 h-10 w-10 rounded-full" />
        </div>

        {/* User info */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <Skeleton className="h-9 w-64" />

          <Skeleton className="h-5 w-52" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </div>
        </div>

        {/* Actions */}
        <div className="my-auto flex flex-col gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border mb-8 flex gap-2 border-b px-2 pb-3">
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};
