import { Skeleton } from "@/components/ui/skeleton";

export const GameFeaturedDropSkeleton = () => {
  return (
    <Skeleton className="border-border mb-16 hidden h-125 grid-cols-1 gap-15 rounded-[40px] border p-10 md:grid md:p-15 xl:grid-cols-2"></Skeleton>
  );
};
