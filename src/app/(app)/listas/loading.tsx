import { Skeleton } from "@/components/ui/Skeleton";

/** Skeleton mostrado instantaneamente ao navegar para "Suas listas". */
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="pt-2 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[4.5rem] w-full rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  );
}
