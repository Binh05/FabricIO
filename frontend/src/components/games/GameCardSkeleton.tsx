import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
  return (
    <div className="bg-card border-border overflow-hidden rounded-lg border">
      <Skeleton className="h-50 w-full" />

      <div className="space-y-4 px-6 py-4">
        <div className="flex justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
};
