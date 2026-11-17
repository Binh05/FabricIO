import { Skeleton } from "@/components/ui/skeleton";

export const GameFeaturedDropSkeleton = () => {
  return (
    <Skeleton className="border-border-subtle min-h-72.5 rounded-lg border sm:min-h-77.5 lg:min-h-85">
      <div className="flex min-h-72.5 flex-col justify-end gap-3 p-5 sm:min-h-77.5 sm:p-8 lg:min-h-85">
        <Skeleton className="h-8 w-3/4 max-w-xl sm:h-10" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-2/3 max-w-xl" />
        <div className="mt-1 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-sm" />
          <Skeleton className="h-6 w-24 rounded-sm" />
          <Skeleton className="h-6 w-16 rounded-sm" />
        </div>
        <Skeleton className="mt-2 h-11 w-32 rounded-sm" />
      </div>
    </Skeleton>
  );
};
