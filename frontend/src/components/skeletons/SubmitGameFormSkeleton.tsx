import { Skeleton } from "@/components/ui/skeleton";

export default function SubmitGameFormSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-10 lg:flex-row">
      {/* FORM */}
      <div className="glass-strong flex-1 rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Source Game */}
          <div className="md:col-span-2">
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>

          {/* Thumbnail */}
          <Skeleton className="h-36 w-full rounded-xl" />

          {/* Gallery */}
          <Skeleton className="h-36 w-full rounded-xl" />

          {/* Tags */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <Skeleton className="h-4 w-16" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
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

      {/* PREVIEW */}
      <aside className="glass-strong sticky top-24 h-fit w-full rounded-xl p-6 lg:w-80">
        <Skeleton className="mb-4 h-6 w-24" />

        <Skeleton className="mb-4 aspect-video w-full rounded-lg" />

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}

          <div className="pt-2">
            <Skeleton className="mb-2 h-4 w-12" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
