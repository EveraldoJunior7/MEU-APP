import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton mostrado instantaneamente ao abrir uma lista. */
export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-6 w-40" />
      </div>

      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-14 w-full rounded-2xl" />

      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  );
}
