import { Skeleton } from "@/components/ui/skeleton";
import SubmitGameFormSkeleton from "./SubmitGameFormSkeleton";

export default function SubmitGamePageSkeleton() {
  return (
    <section className="mb-16 flex w-full flex-col items-center sm:px-3">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <Skeleton className="mb-3 h-4 w-40" />
          <Skeleton className="mb-3 h-11 w-full max-w-lg" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <StepSkeleton />
          <StepSkeleton />
        </div>

        <SubmitGameFormSkeleton />
      </div>
    </section>
  );
}

function StepSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-4">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-28 max-w-full" />
      </div>
    </div>
  );
}
