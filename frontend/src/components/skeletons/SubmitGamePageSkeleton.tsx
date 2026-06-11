import { Skeleton } from "@/components/ui/skeleton";
import SubmitGameFormSkeleton from "./SubmitGameFormSkeleton";

export default function SubmitGamePageSkeleton() {
  return (
    <section className="mb-16">
      <div className="mb-8">
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="mb-3 h-10 w-96" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      <SubmitGameFormSkeleton />
    </section>
  );
}
