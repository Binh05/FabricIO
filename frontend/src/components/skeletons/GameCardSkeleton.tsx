import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-border-subtle bg-surface-container">
      <Skeleton className=" aspect-video rounded-md" />
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md bg-surface-container-low px-3 py-2.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
};
