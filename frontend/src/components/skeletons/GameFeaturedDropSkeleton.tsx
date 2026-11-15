import { Skeleton } from "@/components/ui/skeleton";

export const GameFeaturedDropSkeleton = () => {
  return (
    <Skeleton className="min-h-[290px] rounded-lg border border-border-subtle sm:min-h-[310px] lg:min-h-[340px]">
      <div className="flex min-h-[290px] flex-col justify-end gap-3 p-5 sm:min-h-[310px] sm:p-8 lg:min-h-[340px]">
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
