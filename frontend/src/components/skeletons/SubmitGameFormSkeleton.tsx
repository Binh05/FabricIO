import { Skeleton } from "@/components/ui/skeleton";

export default function SubmitGameFormSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="glass-strong flex-1 rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full" />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="flex flex-col gap-3 md:col-span-2">
            <Skeleton className="h-4 w-16" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
